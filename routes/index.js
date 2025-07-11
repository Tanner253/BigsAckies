const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const productModel = require('../models/product');
const categoryModel = require('../models/category');
const orderModel = require('../models/order');
const messageModel = require('../models/message');
const userModel = require('../models/user');
const paymentService = require('../services/paymentService');
const newsletterModel = require('../models/newsletter');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../models/database');
const auth = require('../middleware/auth');

// Home page
router.get('/', async (req, res) => {
  try {
    // Get products using direct query instead of model method to ensure we get results
    
    // Direct query to get products - using RANDOM() to show different products on each refresh
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY RANDOM() 
      LIMIT 8
    `;
    
    const result = await db.query(query);
    const featuredProducts = result.rows;
    
    console.log(`Featured products found: ${featuredProducts.length}`);
    
    // Get categories for the shop by category section
    const categories = await categoryModel.getAllCategories();
    
    res.render('index', {
      title: 'Home',
      layout: 'main-layout',
      user: req.session.user || null,
      featuredProducts,
      categories
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.render('index', {
      title: 'Home',
      layout: 'main-layout',
      user: req.session.user || null,
      featuredProducts: [],
      categories: []
    });
  }
});

// Products page
router.get('/products', async (req, res) => {
  try {
    const db = require('../models/database');
    
    // Get all categories for the filter sidebar
    const categoriesResult = await db.query('SELECT * FROM categories ORDER BY name ASC');
    const categories = categoriesResult.rows;
    
    // Get filter parameters
    let categoryId = null;
    const categoryParam = req.query.category;
    const min_price = req.query.min_price;
    const max_price = req.query.max_price;
    const sort = req.query.sort || 'name_asc'; // Default to name ascending if not specified
    
    // Handle category filtering by name or ID
    if (categoryParam) {
      if (!isNaN(categoryParam)) {
        // If the parameter is a number, use it directly as ID
        categoryId = parseInt(categoryParam, 10);
      } else {
        // If it's a string, find the matching category ID
        const categoryName = decodeURIComponent(categoryParam).toLowerCase();
        const matchedCategory = categories.find(c => 
          c.name.toLowerCase() === categoryName
        );
        if (matchedCategory) {
          categoryId = matchedCategory.id;
        }
      }
    }
    
    // Build query
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    let params = [];
    let paramIndex = 1;
    
    if (categoryId) {
      query += ` AND p.category_id = $${paramIndex++}`;
      params.push(categoryId);
    }
    
    if (min_price !== undefined && min_price !== '') {
      query += ` AND p.price >= $${paramIndex++}`;
      params.push(parseFloat(min_price));
    }
    
    if (max_price !== undefined && max_price !== '') {
      query += ` AND p.price <= $${paramIndex++}`;
      params.push(parseFloat(max_price));
    }
    
    // Handle sorting
    switch (sort) {
      case 'name_asc':
        query += ' ORDER BY p.name ASC';
        break;
      case 'name_desc':
        query += ' ORDER BY p.name DESC';
        break;
      case 'price_asc':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY p.price DESC';
        break;
      default:
        query += ' ORDER BY p.name ASC'; // Default sorting
    }
    
    // Execute query
    const result = await db.query(query, params);
    
    res.render('products', { 
      title: categoryId ? 'Products by Category' : 'All Products',
      layout: 'main-layout',
      products: result.rows,
      categories: categories,
      selectedCategory: categoryId,
      selectedCategoryName: categoryParam,
      min_price: min_price || '',
      max_price: max_price || '',
      currentSort: sort,
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).render('error', {
      title: 'Error',
      layout: 'main-layout',
      status: 500,
      message: 'An error occurred while loading products',
      error: process.env.NODE_ENV !== 'production' ? error : null
    });
  }
});

// About page
router.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About Us',
    layout: 'main-layout',
    user: req.session.user || null
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Contact Us',
    layout: 'main-layout',
    user: req.session.user || null
  });
});

// Shop page with optional filters
router.get('/shop', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const categoryId = req.query.category;
    const search = req.query.q;
    const min_price = req.query.min_price;
    const max_price = req.query.max_price;
    
    // Get products with pagination and filters
    const productsData = await productModel.getAllProducts({
      page,
      limit,
      categoryId,
      search,
      min_price,
      max_price
    });
    
    // Get all categories for the filter
    const categories = await categoryModel.getAllCategories();
    
    // Get active category if filter is applied
    let activeCategory = null;
    if (categoryId) {
      activeCategory = await categoryModel.getCategoryById(categoryId);
    }
    
    res.render('shop', {
      title: activeCategory ? `${activeCategory.name} - Shop` : 'Shop All Reptiles and Supplies',
      layout: 'main-layout',
      products: productsData.products,
      pagination: productsData.pagination,
      categories,
      activeCategory,
      search,
      min_price: min_price || '',
      max_price: max_price || ''
    });
  } catch (error) {
    console.error('Error rendering shop page:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the shop page',
      error: { status: 500 },
      layout: 'main-layout'
    });
  }
});

// Redirect old product URLs to new shop URLs
router.get('/products/:id', (req, res) => {
  res.redirect(`/shop/${req.params.id}`);
});

// Product detail page
router.get('/shop/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.getProductById(productId);
    
    if (!product) {
      return res.status(404).render('error', {
        title: 'Product Not Found',
        status: 404,
        message: 'The requested product does not exist',
        error: { status: 404 }
      });
    }
    
    // Get related products (same category)
    const relatedProductsData = await productModel.getAllProducts({
      categoryId: product.category_id,
      limit: 4
    });
    
    res.render('product', {
      title: product.name,
      layout: 'main-layout',
      product,
      relatedProducts: relatedProductsData.products.filter(p => p.id !== product.id),
      user: req.session.user || null,
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    console.error('Error rendering product page:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the product page',
      error: process.env.NODE_ENV !== 'production' ? error : null,
      layout: 'main-layout'
    });
  }
});

// Checkout page
router.get('/checkout', auth.isAuthenticated, async (req, res) => {
  try {
    // Get user's cart
    const userId = req.session.user.id;
    const cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    
    if (cartResult.rows.length === 0) {
      req.flash('error', 'Your cart is empty.');
      return res.redirect('/cart');
    }
    
    const cartId = cartResult.rows[0].id;
    
    // Get cart items
    const itemsResult = await db.query(
      `SELECT ci.*, p.name, p.price, p.stock, p.image_url 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.cart_id = $1`,
      [cartId]
    );
    
    const cartItems = itemsResult.rows.map(item => ({
      ...item,
      price: parseFloat(item.price),
      total: parseFloat(item.price) * item.quantity
    }));
    
    if (cartItems.length === 0) {
      req.flash('error', 'Your cart is empty.');
      return res.redirect('/cart');
    }

    // Check stock
    const invalidItems = [];
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        invalidItems.push(`${item.name} (only ${item.stock} available)`);
      }
    }
    
    if (invalidItems.length > 0) {
      req.flash('error', `Stock updated for: ${invalidItems.join(', ')}. Please review your cart.`);
      return res.redirect('/cart');
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        cart_id: cartId,
        user_id: userId
      }
    });

    // Get user's saved addresses
    const addressesResult = await db.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    
    res.render('checkout', {
      title: 'Checkout',
      layout: 'main-layout',
      user: req.session.user,
      cart: {
        items: cartItems,
        totalQty,
        totalPrice
      },
      addresses: addressesResult.rows,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      clientSecret: paymentIntent.client_secret,
      csrfToken: req.csrfToken(),
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error loading checkout page:', error);
    // Log the specific Stripe error if available
    if (error.type === 'StripeInvalidRequestError') {
      console.error('Stripe Error Details:', error.message);
      req.flash('error', `A payment processing error occurred: ${error.message}. Please check your API keys.`);
    } else {
      req.flash('error', 'An unexpected error occurred while preparing the checkout. Please try again.');
    }
    res.redirect('/cart');
  }
});

// Handle Stripe redirect after payment attempt
router.get('/checkout/complete', auth.isAuthenticated, async (req, res) => {
  // Get payment information from URL
  const { payment_intent, payment_intent_client_secret } = req.query;
  
  if (!payment_intent || !payment_intent_client_secret) {
    req.flash('error', 'Invalid payment confirmation request');
    return res.redirect('/checkout');
  }
  
  try {
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
    
    // Check if payment was successful
    if (paymentIntent.status !== 'succeeded') {
      req.flash('error', `Payment ${paymentIntent.status}. Please try again.`);
      return res.redirect('/checkout');
    }
    
    // Check if this payment has already been processed
    const existingOrderCheck = await db.query('SELECT id FROM orders WHERE payment_intent_id = $1', [payment_intent]);
    if (existingOrderCheck.rows.length > 0) {
      return res.redirect(`/account/orders/${existingOrderCheck.rows[0].id}`);
    }
    
    // Get cart information
    const userId = req.session.user.id;
    const cartId = paymentIntent.metadata.cart_id;
    
    // Verify cart belongs to user
    const cartCheck = await db.query('SELECT id FROM carts WHERE id = $1 AND user_id = $2', [cartId, userId]);
    if (cartCheck.rows.length === 0) {
      req.flash('error', 'Invalid cart information');
      return res.redirect('/cart');
    }
    
    // Get cart items
    const itemsResult = await db.query(
      `SELECT ci.*, p.name, p.price, p.stock 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.cart_id = $1`,
      [cartId]
    );
    
    const cartItems = itemsResult.rows.map(item => ({
      ...item,
      price: parseFloat(item.price),
    }));
    
    if (cartItems.length === 0) {
      req.flash('error', 'Your cart is empty');
      return res.redirect('/cart');
    }
    
    // Check stock again
    const invalidItems = [];
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        invalidItems.push(`${item.name} (only ${item.stock} available)`);
      }
    }
    
    if (invalidItems.length > 0) {
      req.flash('error', `Stock has changed: ${invalidItems.join(', ')}. Your payment will be refunded.`);
      
      // TODO: Issue refund if needed
      // await stripe.refunds.create({ payment_intent: payment_intent });
      
      return res.redirect('/cart');
    }
    
    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Get shipping address
    const addressResult = await db.query(
      'SELECT * FROM addresses WHERE user_id = $1 AND is_default = true LIMIT 1',
      [userId]
    );
    
    const address = addressResult.rows.length > 0 ? addressResult.rows[0] : null;
    const shippingAddress = address ? 
      `${address.name}, ${address.street}, ${address.city}, ${address.state} ${address.zip_code}, ${address.country}` :
      'No address provided';
    
    // Create order in database
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (
          user_id, total_amount, shipping_address, status, payment_intent_id, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id`,
        [userId, totalAmount, shippingAddress, 'paid', payment_intent]
      );
      
      const orderId = orderResult.rows[0].id;
      
      // Add order items
      for (const item of cartItems) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.product_id, item.quantity, item.price]
        );
        
        // Update product stock
        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }
      
      // Clear cart
      await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
      
      await client.query('COMMIT');
      
      // Redirect to order confirmation
      req.flash('success', 'Order placed successfully!');
      return res.redirect(`/account/orders/${orderId}`);
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error processing order:', error);
      req.flash('error', 'Failed to process your order. Please contact support.');
      return res.redirect('/cart');
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error handling checkout completion:', error);
    req.flash('error', 'An unexpected error occurred');
    return res.redirect('/cart');
  }
});

// Process order (POST /checkout) - Keep for now, but comment out order creation logic
router.post('/checkout', auth.isAuthenticated, [
  // Keep address validation needed for temporary storage or other actions
  body('shipping_option', 'Please select a shipping address option').isIn(['saved', 'new']),
  body('selected_address_id').if(body('shipping_option').equals('saved')).notEmpty().withMessage('Please select a saved address.'),
  body('name').if(body('shipping_option').equals('new')).notEmpty().withMessage('Please enter your name for the new address.'),
  body('street').if(body('shipping_option').equals('new')).notEmpty().withMessage('Please enter your street address.'),
  body('city').if(body('shipping_option').equals('new')).notEmpty().withMessage('Please enter your city.'),
  body('state').if(body('shipping_option').equals('new')).notEmpty().withMessage('Please enter your state/province.'),
  body('zip_code').if(body('shipping_option').equals('new')).notEmpty().withMessage('Please enter your postal/zip code.'),
  body('country').if(body('shipping_option').equals('new')).notEmpty().withMessage('Please enter your country.'),
  // No longer need paymentIntentId validation here
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // ... Error rendering logic remains largely the same ...
    // Needs to re-fetch cart, addresses, and RE-CREATE payment intent for client secret
    console.error("[POST /checkout] Validation errors on submit (before Stripe redirect)", errors.array());
    // Re-render checkout with errors
    try {
        // Fetch cart/address data (same as before)
        const cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [req.session.user.id]);
        const cartId = cartResult.rows.length > 0 ? cartResult.rows[0].id : null;
        let cartItems = []; let totalPrice = 0; let totalQty = 0;
        if (cartId) {
             const itemsResult = await db.query('SELECT ci.*, p.name, p.price, p.stock, p.image_url FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = $1', [cartId]);
             cartItems = itemsResult.rows.map(item => ({...item, price: parseFloat(item.price), total: parseFloat(item.price) * item.quantity }));
             totalPrice = cartItems.reduce((sum, item) => sum + item.total, 0);
             totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        }
        const addressesResult = await db.query('SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC', [req.session.user.id]);
        const addresses = addressesResult.rows;

        // Re-create Payment Intent to get a fresh client secret for the re-render
        let paymentIntent;
        try {
            if (totalPrice > 0) { // Only create if cart isn't empty
              paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalPrice * 100), 
                currency: 'usd',
                metadata: { user_id: req.session.user.id, cart_id: cartId },
                automatic_payment_methods: { enabled: true }
              });
            }
        } catch (stripeError) {
             console.error("[POST /checkout] Error re-creating PaymentIntent on validation fail:", stripeError);
             // Handle this error gracefully, maybe show a generic payment init error
        }

        return res.status(400).render('checkout', {
          title: 'Checkout',
          layout: 'main-layout',
          user: req.session.user,
          cart: { items: cartItems, totalQty, totalPrice },
          addresses: addresses,
          stripePublicKey: process.env.STRIPE_PUBLIC_KEY, 
          clientSecret: paymentIntent ? paymentIntent.client_secret : null, // Pass new secret or null
          csrfToken: req.csrfToken(),
          messages: { error: errors.array().map(e => e.msg).join(', ') },
          formErrors: errors.mapped(),
          oldInput: req.body,
          paymentError: req.flash('paymentError')[0] || null
        });
    } catch (fetchError) {
        console.error('[POST /checkout] Error re-rendering checkout after validation failure:', fetchError);
        req.flash('error', 'An unexpected error occurred.');
        return res.redirect('/checkout');
    }
  }

  // --- Logic Moved --- 
  // The primary purpose of POST /checkout in this flow is typically validation 
  // before stripe.confirmPayment is called on the client.
  // Order creation, stock check, etc., now happens in GET /checkout/complete.
  // We might store temporary data needed for completion (like address/notes) in the session here.
  console.log('[POST /checkout] Form validated (but logic moved to /checkout/complete).');

  // Example: Store order notes in session before client calls confirmPayment
  if (req.body.order_notes) {
      req.session.orderNotes = req.body.order_notes;
  }
  // TODO: Need a robust way to store the selected shipping address details for retrieval in /checkout/complete

  // Since confirmPayment handles redirect, this response isn't usually sent.
  // We could redirect back to checkout if needed, but Stripe handles the flow.
  // res.redirect('/checkout'); 
  // Or send a simple OK if no redirect is expected (shouldn't happen with confirmPayment)
   res.status(200).json({ message: 'Validation OK, proceed with payment confirmation on client.' }); // Or redirect back?

  /* --- MOVED LOGIC --- 
  try {
    // Verify Payment Intent Server-Side (MOVED)
    // Check amount/currency (MOVED)
    // Check stock (MOVED)
    // Determine Shipping Address (MOVED - needs temporary storage)
    // Create Order (MOVED)
    // Update Stock (MOVED)
    // Clear Cart (MOVED)
    // Send Confirmation Email (MOVED)
    // Redirect (MOVED)
  } catch (error) {
    console.error('Old POST /checkout error location:', error);
    req.flash('error', 'An error occurred during checkout. Please try again or contact support.');
    res.redirect('/checkout'); 
  }
  */
});

// Order success/confirmation page (using account order details)
router.get('/account/orders/:id', auth.isAuthenticated, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.session.user.id;

    const order = await orderModel.getOrderByIdForUser(orderId, userId);

    if (!order) {
      req.flash('error', 'Order not found or you do not have permission to view it.');
      return res.redirect('/account/orders');
    }
    
    // Get order items as well
    const items = await orderModel.getOrderItems(orderId);

    res.render('account/order-details', { // Assuming you have an order-details view
      title: `Order #${order.id}`,
      layout: 'main-layout', 
      user: req.session.user,
      order: order,
      items: items,
      messages: req.flash() // Display success message from checkout
    });
  } catch (error) {
    console.error('Error displaying order confirmation:', error);
    req.flash('error', 'Failed to load order details.');
    res.redirect('/account/orders');
  }
});

// Order Confirmation page (potentially remove if redirecting to account)
router.get('/order-confirmation/:orderId', auth.isAuthenticated, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.session.user.id;
    
    // Fetch the order details, ensuring it belongs to the user
    const order = await orderModel.getOrderByIdForUser(orderId, userId);

    if (!order) {
      req.flash('error', 'Order not found or access denied.');
      return res.redirect('/account/orders'); // Redirect to their orders list
    }
    
    // Get order items as well
    const items = await orderModel.getOrderItems(orderId);

    res.render('order-confirmation', {
      title: `Order #${order.id} Confirmation`,
      layout: 'main-layout',
      user: req.session.user,
      order: order,
      items: items,
      messages: req.flash() // Show success flash message
    });
  } catch (error) {
    console.error('Error rendering order confirmation page:', error);
    req.flash('error', 'An error occurred while displaying your order confirmation.');
    res.redirect('/account/orders'); // Redirect on error
  }
});

// Customer message/chat
router.post('/message', [
  body('name').notEmpty().withMessage('Please enter your name'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('subject').notEmpty().withMessage('Please select a subject'),
  body('message').notEmpty().withMessage('Please enter your message')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.messages = {
        error: errors.array().map(error => error.msg).join(', ')
      };
      return res.redirect('/contact');
    }
    
    const { email, message, name, subject } = req.body;
    
    // Save message to database
    const newMessage = await messageModel.createMessage({
      user_email: email,
      message: `Name: ${name}\nSubject: ${subject}\n\nMessage:\n${message}`
    });
    
    // Set success message in session
    req.session.messages = {
      success: 'Your message has been sent successfully! We will get back to you soon.'
    };
    
    res.redirect('/contact');
  } catch (error) {
    console.error('Error sending message:', error);
    req.session.messages = {
      error: 'An error occurred while sending your message. Please try again.'
    };
    res.redirect('/contact');
  }
});

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/'); // Redirect if already logged in
  }
  res.render('login', {
    title: 'Login',
    layout: 'main-layout',
    messages: req.session.messages || {},
    csrfToken: req.csrfToken()
  });
  delete req.session.messages; // Clear messages after reading
});

// Process login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.messages = {
        error: errors.array().map(error => error.msg).join(', ')
      };
      return res.redirect('/login');
    }
    
    const { email, password } = req.body;
    
    // Authenticate user
    const user = await userModel.authenticateUser(email, password);
    
    if (!user) {
      req.session.messages = {
        error: 'Invalid email or password'
      };
      return res.redirect('/login');
    }
    
    // Store user in session
    req.session.user = user;
    
    // Redirect to original URL or home
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    
    // Success message
    req.session.messages = {
      success: 'You have successfully signed in!'
    };
    
    res.redirect(returnTo);
  } catch (error) {
    console.error('Login error:', error);
    req.session.messages = {
      error: 'An error occurred during sign in. Please try again.'
    };
    res.redirect('/login');
  }
});

// Registration page
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/'); // Redirect if already logged in
  }
  res.render('register', {
    title: 'Register',
    layout: 'main-layout',
    messages: req.session.messages || {},
    csrfToken: req.csrfToken()
  });
  delete req.session.messages; // Clear messages after reading
});

// Process registration
router.post('/register', [
  body('name').notEmpty().withMessage('Please enter your name'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  body('terms').equals('on').withMessage('You must agree to the terms and conditions')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.messages = {
        error: errors.array().map(error => error.msg).join(', ')
      };
      return res.redirect('/register');
    }
    
    const { name, email, password } = req.body;
    
    // Check if the email is for admin
    const role = email === 'percivaltanner@gmail.com' ? 'admin' : 'customer';
    
    // Create user
    await userModel.createUser({
      name,
      email,
      password,
      role
    });
    
    // Success message
    req.session.messages = {
      success: 'Account created successfully! Please sign in.'
    };
    
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.message.includes('already exists')) {
      req.session.messages = {
        error: 'A user with this email already exists'
      };
    } else {
      req.session.messages = {
        error: 'An error occurred during registration. Please try again.'
      };
    }
    
    res.redirect('/register');
  }
});

// Logout
router.get('/logout', (req, res) => {
  // Clear user session
  req.session.user = null;
  
  // Success message
  req.session.messages = {
    success: 'You have been logged out successfully'
  };
  
  res.redirect('/');
});

// Redirect /account to /account/profile
router.get('/account', auth.isAuthenticated, (req, res) => {
  res.redirect('/account/profile');
});

// Account Profile Page
router.get('/account/profile', auth.isAuthenticated, async (req, res) => {
  try {
    // User data is already in req.session.user thanks to auth.isAuthenticated
    res.render('account/profile', {
      title: 'Personal Information',
      layout: 'layouts/account-layout', // Use the new account layout
      user: req.session.user,
      messages: req.session.messages || {}, // Use session messages
      currentPath: '/account/profile', // For sidebar active state
      csrfToken: req.csrfToken() // Pass CSRF token
    });
    delete req.session.messages; // Clear messages after reading
  } catch (error) {
    console.error('Error loading profile page:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load profile information. Please try again.',
      layout: 'layouts/account-layout' // Use account layout for error too
    });
  }
});

// Handle Profile Update (POST)
router.post('/account/update-profile', 
  auth.isAuthenticated, 
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Valid email is required').isEmail().normalizeEmail()
    // Add validation for phone if needed
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.messages = { error: errors.array().map(e => e.msg).join(', ') };
      return res.redirect('/account/profile');
    }

    const { name, email } = req.body;
    const userId = req.session.user.id;

    try {
      // Check if email is changing and if it's already taken by another user
      if (email !== req.session.user.email) {
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          req.session.messages = { error: 'Email address is already in use by another account.' };
          return res.redirect('/account/profile');
        }
      }
      
      // Update user in database (pass only name and email)
      const updatedUser = await userModel.updateUser(userId, { name, email });

      // Update user in session (only update name and email)
      req.session.user.name = updatedUser.name; 
      req.session.user.email = updatedUser.email;

      req.session.messages = { success: 'Profile updated successfully.' };
      res.redirect('/account/profile');

    } catch (error) {
      console.error('Error updating profile:', error);
      req.session.messages = { error: 'Failed to update profile. Please try again.' };
      res.redirect('/account/profile');
    }
  }
);

// Account Orders Page
router.get('/account/orders', auth.isAuthenticated, async (req, res) => {
  try {
    // Get user's orders
    const ordersQuery = `
      SELECT o.*, o.total_amount as total 
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `;
    const ordersResult = await db.query(ordersQuery, [req.session.user.id]);
    
    res.render('account/orders', {
      title: 'Order History',
      layout: 'layouts/account-layout',
      user: req.session.user,
      orders: ordersResult.rows,
      messages: req.session.messages || {},
      currentPath: '/account/orders'
    });
    delete req.session.messages;
  } catch (error) {
    console.error('Error loading orders page:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load order history. Please try again.',
      layout: 'layouts/account-layout'
    });
  }
});

// Account Addresses Page
router.get('/account/addresses', auth.isAuthenticated, async (req, res) => {
  try {
    // Get user's addresses
    const addressesQuery = `
      SELECT * FROM addresses 
      WHERE user_id = $1 
      ORDER BY is_default DESC, created_at DESC
    `;
    const addressesResult = await db.query(addressesQuery, [req.session.user.id]);
    
    res.render('account/addresses', {
      title: 'My Addresses',
      layout: 'layouts/account-layout',
      user: req.session.user,
      addresses: addressesResult.rows,
      messages: req.session.messages || {},
      currentPath: '/account/addresses'
    });
    delete req.session.messages;
  } catch (error) {
    console.error('Error loading addresses page:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load addresses. Please try again.',
      layout: 'layouts/account-layout'
    });
  }
});

// Newsletter subscription
router.post('/subscribe', [
  body('email').isEmail().withMessage('Please enter a valid email address')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.messages = {
        error: errors.array().map(error => error.msg).join(', ')
      };
      return res.redirect('back');
    }

    const { email } = req.body;

    // Add subscriber to database
    await newsletterModel.addSubscriber(email);

    // Set success message
    req.session.messages = {
      success: 'You have successfully subscribed to our newsletter! Welcome to our reptile community.'
    };

    // Redirect back to the previous page
    res.redirect('back');
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // Handle duplicate subscription error
    if (error.message.includes('already subscribed')) {
      req.session.messages = {
        error: 'This email is already subscribed to our newsletter'
      };
    } else {
      req.session.messages = {
        error: 'An error occurred while subscribing. Please try again.'
      };
    }

    res.redirect('back');
  }
});

// FAQ page
router.get('/faq', (req, res) => {
  res.render('faq', { 
    title: 'Frequently Asked Questions',
    layout: 'main-layout',
    user: req.session.user || null
  });
});

// Shipping & Returns page
router.get('/shipping', (req, res) => {
  res.render('shipping', { 
    title: 'Shipping & Returns',
    layout: 'main-layout',
    user: req.session.user || null
  });
});

// Privacy Policy page
router.get('/privacy', (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy',
    layout: 'main-layout',
    user: req.session.user || null
  });
});

// Terms & Conditions page
router.get('/terms', (req, res) => {
  res.render('terms', {
    title: 'Terms & Conditions',
    layout: 'main-layout',
    user: req.session.user || null
  });
});

// Redirect old /orders page to the new /account/orders page for bookmark compatibility
router.get('/orders', auth.isAuthenticated, (req, res) => {
  res.redirect('/account/orders');
});

// View individual order details (requires authentication)
router.get('/account/orders/:id', auth.isAuthenticated, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.session.user.id;

    const order = await orderModel.getOrderByIdForUser(orderId, userId);

    if (!order) {
      req.flash('error', 'Order not found or you do not have permission to view it.');
      return res.redirect('/account/orders');
    }
    
    // Get order items as well
    const items = await orderModel.getOrderItems(orderId);

    res.render('order-detail', {
      title: `Order #${order.id}`,
      layout: 'layouts/account-layout', 
      user: req.session.user,
      order: order,
      items: items,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error displaying order details:', error);
    req.flash('error', 'Failed to load order details.');
    res.redirect('/account/orders');
  }
});

// Address management routes
router.post('/account/addresses', auth.isAuthenticated, [
  body('name', 'Full Name is required').notEmpty(),
  body('street', 'Street Address is required').notEmpty(),
  body('city', 'City is required').notEmpty(),
  body('state', 'State is required').notEmpty(),
  body('zip', 'ZIP Code is required').notEmpty(),
  body('phone', 'Phone Number is required').notEmpty(),
], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.messages = { error: errors.array().map(e => e.msg).join(', ') };
    return res.redirect('/account/addresses/new'); 
  }

  try {
    const { name, street, city, state, zip, country, phone } = req.body;
    const userId = req.session.user.id;
    
    // Check if this is the first address (make it default)
    const addressCountResult = await db.query('SELECT COUNT(*) FROM addresses WHERE user_id = $1', [userId]);
    const isDefault = parseInt(addressCountResult.rows[0].count) === 0;
    
    const query = `
      INSERT INTO addresses (user_id, name, street, city, state, zip, country, phone, is_default)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await db.query(query, [userId, name, street, city, state, zip, country || 'USA', phone, isDefault]);

    req.session.messages = { success: 'Address added successfully.' };
    res.redirect('/account/addresses');

  } catch (error) {
    console.error('Error adding address:', error);
    req.session.messages = { error: 'Failed to add address. Please try again.' };
    res.redirect('/account/addresses/new');
  }
});

router.post('/account/addresses/:id/set-default', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  try {
    const addressId = req.params.id;
    
    // First, remove default from all addresses
    await db.query(
      'UPDATE addresses SET is_default = false WHERE user_id = $1',
      [req.session.user.id]
    );
    
    // Set the selected address as default
    await db.query(
      'UPDATE addresses SET is_default = true WHERE id = $1 AND user_id = $2',
      [addressId, req.session.user.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ error: 'Failed to set default address' });
  }
});

router.delete('/account/addresses/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  try {
    const addressId = req.params.id;
    
    // Check if this is the default address
    const addressResult = await db.query(
      'SELECT is_default FROM addresses WHERE id = $1 AND user_id = $2',
      [addressId, req.session.user.id]
    );
    
    if (addressResult.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    // Delete the address
    await db.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2',
      [addressId, req.session.user.id]
    );
    
    // If this was the default address, set a new default if other addresses exist
    if (addressResult.rows[0].is_default) {
      const remainingAddresses = await db.query(
        'SELECT id FROM addresses WHERE user_id = $1 ORDER BY created_at ASC LIMIT 1',
        [req.session.user.id]
      );
      
      if (remainingAddresses.rows.length > 0) {
        await db.query(
          'UPDATE addresses SET is_default = true WHERE id = $1',
          [remainingAddresses.rows[0].id]
        );
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// Address management routes
router.get('/account/addresses/new', async (req, res) => {
  if (!req.session.user) {
    req.session.returnTo = '/account/addresses/new';
    req.session.messages = {
      error: 'Please sign in to add a new address'
    };
    return res.redirect('/login');
  }

  res.render('address/new', {
    title: 'Add New Address',
    layout: 'layouts/account-layout',
    user: req.session.user,
    messages: req.session.messages || {},
    currentPath: '/account/addresses',
    csrfToken: req.csrfToken()
  });
  delete req.session.messages;
});

router.get('/account/payment-methods/new', async (req, res) => {
  if (!req.session.user) {
    req.session.returnTo = '/account/payment-methods/new';
    req.session.messages = {
      error: 'Please sign in to add a new payment method'
    };
    return res.redirect('/login');
  }

  res.render('payment/new', {
    title: 'Add New Payment Method',
    layout: 'layouts/account-layout',
    user: req.session.user,
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    messages: req.session.messages || {},
    currentPath: '/account/payment-methods',
    csrfToken: req.csrfToken()
  });
  delete req.session.messages;
});

// Contact form submission
router.post('/contact', [
  // ... existing contact form validation ...
], async (req, res) => {
  // ... implementation ...
});

// Add a route for Stripe debugging (only in development)
router.get('/stripe-debug', auth.isAuthenticated, async (req, res) => {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).render('404', {
      title: 'Page Not Found',
      layout: 'main-layout',
      user: req.session.user
    });
  }

  try {
    // Create a test payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1999, // $19.99
      currency: 'usd',
      description: 'Debug payment intent',
      automatic_payment_methods: { enabled: true }
    });

    res.render('stripe-debug', {
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating test payment intent:', error);
    res.status(500).send(`
      <h1>Stripe Debug Error</h1>
      <p>Error creating test payment intent: ${error.message}</p>
      <pre>${JSON.stringify(error, null, 2)}</pre>
    `);
  }
});

module.exports = router; 