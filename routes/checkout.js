const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../models/database');
const auth = require('../middleware/auth'); // Assuming you have authentication middleware
const orderModel = require('../models/order'); // Import the order model

// Route to display the checkout page
router.get('/', auth.isAuthenticated, async (req, res) => {
  try {
    // Fetch cart details to display on the checkout page
    const cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [req.session.user.id]);
    if (cartResult.rows.length === 0) {
      // Handle case where user has no cart (maybe redirect to cart page or show message)
      req.session.messages = { warning: 'Your cart is empty.' };
      return res.redirect('/cart');
    }
    const cart = cartResult.rows[0];

    const itemsResult = await db.query(`
      SELECT ci.quantity, p.id as product_id, p.name, p.price, p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cart.id]);

    const cartItems = itemsResult.rows.map(item => ({
      ...item,
      price: parseFloat(item.price),
      total: parseFloat(item.price) * item.quantity
    }));
    const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Fetch user's saved addresses
    const addressesResult = await db.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [req.session.user.id]
    );
    const addresses = addressesResult.rows;

    res.render('checkout', {
      title: 'Confirm Payment',
      layout: 'main-layout',
      cart: {
        items: cartItems,
        totalQty,
        totalPrice
      },
      user: req.session.user,
      addresses: addresses,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      messages: req.session.messages || {}
    });
  } catch (error) {
    console.error('Error loading checkout page:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'An error occurred while preparing your checkout',
      error: process.env.NODE_ENV !== 'production' ? error : null
    });
  }
});

// Route to create Stripe Payment Intent
router.post('/create-payment-intent', auth.isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;

    // 1. Get the user's cart ID
    const cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    if (cartResult.rows.length === 0) {
      return res.status(400).json({ error: 'No active cart found.' });
    }
    const cartId = cartResult.rows[0].id;

    // 2. Get cart items
    const itemsResult = await db.query(`
      SELECT ci.quantity, p.price, p.id as product_id, p.name as product_name, p.stock as product_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cartId]);

    if (itemsResult.rows.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }
    const cartItems = itemsResult.rows;

    // 2a. Check stock availability for all items BEFORE creating Payment Intent
    for (const item of cartItems) {
        if (item.product_stock < item.quantity) {
            console.warn(`Stock check failed for Payment Intent creation: User ${userId}, Product ${item.product_id} (${item.product_name}). Requested: ${item.quantity}, Available: ${item.product_stock}`);
            return res.status(400).json({
                error: `Sorry, "${item.product_name}" is out of stock or has insufficient quantity available. Please remove it from your cart or reduce the quantity.`,
                itemId: item.product_id // Optional: Send item ID back to highlight it in the UI
            });
        }
    }

    // 2b. Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
    }, 0);
    const totalAmountInCents = Math.round(totalPrice * 100); // Stripe expects amount in cents

    if (totalAmountInCents <= 0) {
        return res.status(400).json({ error: 'Cart total must be greater than zero.' });
    }

    // 3. Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountInCents,
      currency: 'usd', // Or get from config/env
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      // Optionally add customer ID if you manage Stripe Customers
      // customer: stripeCustomerId,
      metadata: {
        userId: userId.toString(),
        cartId: cartId.toString()
        // Add any other relevant info needed by webhook
      }
    });

    // 4. Send publishable key and PaymentIntent client_secret to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    res.status(500).json({ error: 'Failed to create Payment Intent.' });
  }
});

// Route to create Stripe checkout session
// router.post('/create-checkout-session', auth.isAuthenticated, async (req, res) => {
// ... (code removed) ...
// });

// Stripe Webhook Handler -- REMOVING AS PER REQUEST
// router.post('/webhook', async (req, res) => {
//  ... webhook logic removed ...
// });

// New route to handle post-payment redirect and synchronous order creation
router.get('/order/processing', auth.isAuthenticated, async (req, res) => {
  const clientSecret = req.query.payment_intent_client_secret;
  const paymentIntentId = req.query.payment_intent;
  const redirectStatus = req.query.redirect_status;

  if (!paymentIntentId || !clientSecret || !redirectStatus) {
    console.error('Invalid redirect parameters received.', req.query);
    req.session.messages = { error: 'Invalid payment confirmation request.' };
    return res.redirect('/checkout'); // Redirect back to checkout with error
  }

  const client = await db.pool.connect(); // Get DB client for potential transaction

  try {
    // Retrieve the PaymentIntent from Stripe to check its final status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    switch (paymentIntent.status) {
      case 'succeeded':
        // --- Order Creation Logic Moved Here ---

        // Idempotency Check: Has an order already been created for this payment?
        const existingOrderResult = await client.query('SELECT id FROM orders WHERE payment_id = $1', [paymentIntent.id]);
        if (existingOrderResult.rows.length > 0) {
          console.log(`Order for PaymentIntent ${paymentIntent.id} already exists (Order ID: ${existingOrderResult.rows[0].id}). Redirecting to success.`);
          req.session.messages = { success: 'Your payment was successful! Your order is confirmed.' };
          return res.redirect(`/order/completed?order_id=${existingOrderResult.rows[0].id}&pi=${paymentIntent.id}`);
        }

        // Extract metadata
        const userId = parseInt(paymentIntent.metadata.userId);
        const cartId = parseInt(paymentIntent.metadata.cartId);
        const totalAmount = paymentIntent.amount / 100;
        const shippingDetails = paymentIntent.shipping;

        if (!userId || !cartId) {
            console.error(`Sync Order Error: Missing userId (${userId}) or cartId (${cartId}) in PaymentIntent metadata for ${paymentIntent.id}`);
            // Payment succeeded, but we can't create the order. This is a problem state.
            req.session.messages = { error: 'Order processing failed due to missing information. Please contact support.' };
            // TODO: Potentially flag this payment for manual review/refund?
            return res.redirect('/cart'); // Redirect somewhere sensible
        }

        // Format shipping address if collected by Payment Element
        let shippingAddressString = null;
        if (shippingDetails && shippingDetails.address) {
            const addr = shippingDetails.address;
            shippingAddressString = [
                shippingDetails.name,
                addr.line1,
                addr.line2,
                `${addr.city}, ${addr.state} ${addr.postal_code}`,
                addr.country
            ].filter(Boolean).join('\n');
        }

        console.log(`Processing synchronous order for User ID: ${userId}, Cart ID: ${cartId}, PI: ${paymentIntent.id}`);

        // --- Start Database Transaction ---
        try {
            await client.query('BEGIN');

            // 1. Fetch cart items *within transaction*
            const itemsResult = await client.query(`
                SELECT ci.product_id, ci.quantity, p.price as price_at_time, p.stock
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.cart_id = $1 FOR UPDATE
            `, [cartId]); // Use FOR UPDATE to lock rows

            if (itemsResult.rows.length === 0) {
                // Cart might have been emptied elsewhere? Or cartId mismatch.
                throw new Error(`Cart ID ${cartId} was empty when trying to fulfill synchronous order for PI ${paymentIntent.id}.`);
            }
            const orderItems = itemsResult.rows;

            // 2. Check stock availability *within transaction*
            for (const item of orderItems) {
                if (item.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ID ${item.product_id} during synchronous order creation.`);
                }
            }

            // 3. Prepare order data
            const orderData = {
                user_id: userId,
                total_amount: totalAmount,
                shipping_address: shippingAddressString,
                payment_id: paymentIntent.id,
                status: 'paid' // Or 'processing'
            };

            // 4. Create the order (using the modified model function - without stock logic)
            const newOrderId = await orderModel.createOrder(orderData, orderItems, client);
            console.log(`Order ${newOrderId} created successfully within transaction.`);

            // 5. Decrement stock *within transaction*
            for (const item of orderItems) {
                await client.query(`
                    UPDATE products
                    SET stock = stock - $1
                    WHERE id = $2
                `, [item.quantity, item.product_id]);
            }
            console.log(`Stock decremented for order ${newOrderId}.`);

            // 6. Clear the cart *within transaction*
            await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
            console.log(`Cart items for cart ID ${cartId} deleted.`);
            // Optionally delete the cart itself
            // await client.query('DELETE FROM carts WHERE id = $1', [cartId]);

            // 7. Commit the transaction
            await client.query('COMMIT');
            console.log(`Successfully processed synchronous order ${newOrderId} for PaymentIntent ${paymentIntent.id}`);

            // Optional: Trigger order confirmation email here

            // Redirect to completion page
            req.session.messages = { success: 'Your payment was successful! Your order is confirmed.' };
            res.redirect(`/order/completed?order_id=${newOrderId}&pi=${paymentIntent.id}`);

        } catch (dbError) {
            await client.query('ROLLBACK');
            console.error(`DATABASE ERROR during synchronous order processing for PaymentIntent ${paymentIntent.id}:`, dbError);
            // Inform user of failure. Payment was successful, but order failed.
            req.session.messages = { error: `Your payment was successful, but there was an issue creating your order (${dbError.message || 'Database error'}). Please contact support.` };
            // TODO: Potentially flag this payment for manual review/refund?
            return res.redirect('/checkout'); // Redirect back to checkout or cart
        }
        // --- End Database Transaction ---
        break;

      case 'processing':
        req.session.messages = { warning: "Your payment is processing. We'll update you when payment is received." };
        res.redirect('/cart'); // Or an order status page
        break;

      case 'requires_payment_method':
        req.session.messages = { error: 'Payment failed. Please try another payment method.' };
        res.redirect('/checkout');
        break;

      default:
        req.session.messages = { error: 'Something went wrong with your payment.' };
        res.redirect('/checkout');
        break;
    }
  } catch (error) {
    console.error("Error retrieving PaymentIntent status or processing order:", error);
    req.session.messages = { error: 'Failed to confirm payment status or process order.' };
    res.redirect('/checkout');
  } finally {
    client.release(); // Ensure client is always released
  }
});

// Simple Order Completed page route
router.get('/order/completed', auth.isAuthenticated, (req, res) => {
    const orderId = req.query.order_id;
    const paymentIntentId = req.query.pi;
    // TODO: Optionally fetch order details using orderId to display more info
    res.render('order_completed', {
        title: 'Order Completed',
        layout: 'main-layout',
        user: req.session.user,
        orderId: orderId,
        paymentIntentId: paymentIntentId,
        messages: req.session.messages || {}
    });
});

module.exports = router; 