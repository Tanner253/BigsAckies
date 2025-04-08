const express = require('express');
const router = express.Router();
const db = require('../models/database');

// Get cart page
router.get('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    // Get or create cart for user
    let cartResult = await db.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.session.user.id]
    );

    let cart;
    if (cartResult.rows.length === 0) {
      // Create new cart if none exists
      cartResult = await db.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
        [req.session.user.id]
      );
      cart = cartResult.rows[0];
    } else {
      cart = cartResult.rows[0];
    }

    // Get cart items with product details
    const itemsResult = await db.query(`
      SELECT ci.*, p.name, p.price, p.image_url 
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

    res.render('cart', {
      title: 'Shopping Cart',
      layout: 'main-layout',
      cart: {
        items: cartItems,
        totalQty,
        totalPrice
      },
      user: req.session.user,
      messages: req.session.messages || {}
    });
  } catch (error) {
    console.error('Error loading cart:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'An error occurred while loading your cart',
      error: process.env.NODE_ENV !== 'production' ? error : null
    });
  }
});

// Add product to cart
router.post('/add', async (req, res) => {
  try {
    if (!req.session.user) {
      // In production, always redirect to login
      if (process.env.NODE_ENV === 'production') {
        return res.redirect('/login');
      }
      
      // In development, return JSON error for AJAX requests
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(401).json({ error: 'Please login to add items to cart' });
      }
      
      // For regular form submissions in development
      return res.redirect('/login');
    }

    const { product_id, quantity } = req.body;
    const qty = parseInt(quantity, 10) || 1;
    
    // Input validation
    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Parse product_id to ensure it's a number
    const parsedProductId = parseInt(product_id, 10);
    if (isNaN(parsedProductId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    // Get or create cart
    let cartResult = await db.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.session.user.id]
    );

    let cart;
    if (cartResult.rows.length === 0) {
      cartResult = await db.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
        [req.session.user.id]
      );
      cart = cartResult.rows[0];
    } else {
      cart = cartResult.rows[0];
    }

    // Check if product exists and has enough stock
    const productResult = await db.query(
      'SELECT * FROM products WHERE id = $1',
      [parsedProductId]
    );
    
    const product = productResult.rows[0];
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < qty) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    // Add or update cart item
    await db.query(`
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (cart_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + $3
    `, [cart.id, parsedProductId, qty]);

    // Get updated cart totals
    const cartItemsResult = await db.query(`
      SELECT ci.*, p.price 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cart.id]);

    const cartItems = cartItemsResult.rows.map(item => ({
      ...item,
      price: parseFloat(item.price)
    }));
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ 
      success: true, 
      message: 'Product added to cart',
      cartItemCount: totalQty,
      cartTotal: totalPrice.toFixed(2)
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'An error occurred while adding to cart' });
  }
});

// Update cart item quantity
router.post('/update', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Please login to update cart' });
    }

    const { product_id, quantity } = req.body;
    
    // Input validation
    if (!product_id || quantity === undefined) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Get user's cart
    const cartResult = await db.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.session.user.id]
    );

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cart = cartResult.rows[0];

    // Check product stock
    const productResult = await db.query(
      'SELECT * FROM products WHERE id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];
    if (qty > product.stock) {
      return res.status(400).json({ 
        error: `Only ${product.stock} units available in stock` 
      });
    }

    // Update cart item quantity
    await db.query(
      `UPDATE cart_items 
       SET quantity = $1, 
           updated_at = CURRENT_TIMESTAMP
       WHERE cart_id = $2 AND product_id = $3
       RETURNING *`,
      [qty, cart.id, product_id]
    );

    // Get updated cart totals
    const cartItemsResult = await db.query(`
      SELECT ci.*, p.price, p.name 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cart.id]);

    const cartItems = cartItemsResult.rows.map(item => ({
      ...item,
      price: parseFloat(item.price)
    }));

    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const updatedItem = cartItems.find(item => item.product_id === parseInt(product_id));
    const itemTotal = updatedItem ? updatedItem.price * updatedItem.quantity : 0;

    res.json({
      success: true,
      cartItemCount: totalQty,
      cartTotal: totalPrice,
      itemTotal: itemTotal,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ 
      success: false,
      error: 'An error occurred while updating the cart' 
    });
  }
});

// Remove item from cart
router.post('/remove', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Please login to remove items from cart' });
    }

    const { product_id } = req.body;
    
    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Get user's cart
    const cartResult = await db.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.session.user.id]
    );

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cart = cartResult.rows[0];

    // Remove item from cart
    const deleteResult = await db.query(
      'DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *',
      [cart.id, product_id]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Get updated cart totals
    const cartItemsResult = await db.query(`
      SELECT ci.*, p.price 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cart.id]);

    const cartItems = cartItemsResult.rows.map(item => ({
      ...item,
      price: parseFloat(item.price)
    }));
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      success: true,
      message: 'Item removed from cart',
      cartItemCount: totalQty,
      cartTotal: totalPrice.toFixed(2)
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'An error occurred while removing from cart' });
  }
});

// Clear cart
router.post('/clear', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Please login to clear cart' });
    }

    // Get user's cart
    const cartResult = await db.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.session.user.id]
    );

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cart = cartResult.rows[0];

    // Remove all items from cart
    await db.query(
      'DELETE FROM cart_items WHERE cart_id = $1',
      [cart.id]
    );

    res.json({
      success: true,
      message: 'Cart cleared',
      cartItemCount: 0,
      cartTotal: '0.00'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'An error occurred while clearing cart' });
  }
});

// Route to get cart item count for header update
router.get('/item-count', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Please login to get cart item count' });
    }

    // Get user's cart
    const cartResult = await db.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.session.user.id]
    );

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cart = cartResult.rows[0];

    // Get cart items with product details
    const itemsResult = await db.query(`
      SELECT ci.*, p.name, p.price, p.image_url 
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

    // Get user's saved addresses
    const addressesQuery = `
      SELECT * FROM addresses 
      WHERE user_id = $1 
      ORDER BY is_default DESC, created_at DESC
    `;
    const addressesResult = await db.query(addressesQuery, [req.session.user.id]);
    const addresses = addressesResult.rows;

    res.render('checkout', {
      title: 'Checkout',
      layout: 'main-layout',
      user: req.session.user,
      cart: {
        items: cartItems,
        totalQty,
        totalPrice
      },
      addresses,
      csrfToken: req.csrfToken(),
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (error) {
    console.error('Error loading checkout:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'An error occurred while loading checkout',
      error: process.env.NODE_ENV !== 'production' ? error : null,
      layout: 'main-layout'
    });
  }
});

module.exports = router; 