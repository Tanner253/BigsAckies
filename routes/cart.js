const express = require('express');
const router = express.Router();
const db = require('../models/database');

// Get cart page
router.get('/', (req, res) => {
  try {
    // Initialize cart if it doesn't exist
    if (!req.session.cart) {
      req.session.cart = {
        items: [],
        totalQty: 0,
        totalPrice: 0
      };
    }
    
    res.render('cart', {
      title: 'Shopping Cart',
      cart: req.session.cart,
      user: req.session.user || null,
      messages: {}
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
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity, 10) || 1;
    
    // Input validation
    if (!productId) {
      req.session.messages = { error: 'Product ID is required' };
      return res.redirect('/cart');
    }
    
    // Get product from database
    const result = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    const product = result.rows[0];
    
    if (!product) {
      req.session.messages = { error: 'Product not found' };
      return res.redirect('/cart');
    }
    
    if (product.stock_quantity < qty) {
      req.session.messages = { error: 'Not enough stock available' };
      return res.redirect('/cart');
    }
    
    // Initialize cart if it doesn't exist
    if (!req.session.cart) {
      req.session.cart = {
        items: [],
        totalQty: 0,
        totalPrice: 0
      };
    }
    
    const cart = req.session.cart;
    
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += qty;
      cart.items[existingItemIndex].total = parseFloat(product.price) * cart.items[existingItemIndex].quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: qty,
        image_url: product.image_url,
        total: parseFloat(product.price) * qty
      });
    }
    
    // Update cart totals
    cart.totalQty = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.total, 0);
    
    // Save cart to session
    req.session.cart = cart;
    
    req.session.messages = { success: 'Product added to cart' };
    res.redirect('/cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    req.session.messages = { error: 'An error occurred. Please try again.' };
    res.redirect('/cart');
  }
});

// Update cart item quantity
router.post('/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity, 10);
    
    // Input validation
    if (!productId || !qty) {
      return res.status(400).json({ success: false, error: 'Product ID and quantity are required' });
    }
    
    if (!req.session.cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    const cart = req.session.cart;
    const itemIndex = cart.items.findIndex(item => item.id === parseInt(productId, 10));
    
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Product not found in cart' });
    }
    
    if (qty <= 0) {
      // Remove item from cart
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock quantity
      const result = await db.query('SELECT stock_quantity FROM products WHERE id = $1', [productId]);
      const product = result.rows[0];
      
      if (!product || product.stock_quantity < qty) {
        return res.status(400).json({ success: false, error: 'Not enough stock available' });
      }
      
      // Update quantity
      cart.items[itemIndex].quantity = qty;
      cart.items[itemIndex].total = cart.items[itemIndex].price * qty;
    }
    
    // Update cart totals
    cart.totalQty = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.total, 0);
    
    // Save cart to session
    req.session.cart = cart;
    
    res.json({
      success: true,
      message: 'Cart updated',
      cartItemCount: cart.totalQty,
      cartTotal: cart.totalPrice.toFixed(2),
      itemTotal: itemIndex !== -1 ? cart.items[itemIndex].total.toFixed(2) : 0
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
  }
});

// Remove item from cart
router.post('/remove', (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }
    
    if (!req.session.cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    const cart = req.session.cart;
    const itemIndex = cart.items.findIndex(item => item.id === parseInt(productId, 10));
    
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Product not found in cart' });
    }
    
    // Remove item from cart
    cart.items.splice(itemIndex, 1);
    
    // Update cart totals
    cart.totalQty = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.total, 0);
    
    // Save cart to session
    req.session.cart = cart;
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      cartItemCount: cart.totalQty,
      cartTotal: cart.totalPrice.toFixed(2)
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
  }
});

// Clear cart
router.post('/clear', (req, res) => {
  try {
    // Reset cart
    req.session.cart = {
      items: [],
      totalQty: 0,
      totalPrice: 0
    };
    
    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
  }
});

module.exports = router; 