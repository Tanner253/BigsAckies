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
      user: req.session.user || null,
      featuredProducts,
      categories
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.render('index', { 
      title: 'Home',
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
    user: req.session.user || null
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Contact Us',
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
      error: { status: 500 }
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
      product,
      relatedProducts: relatedProductsData.products.filter(p => p.id !== product.id)
    });
  } catch (error) {
    console.error('Error rendering product page:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the product page',
      error: { status: 500 }
    });
  }
});

// Checkout page
router.get('/checkout', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    // Get user's cart
    const cartResult = await db.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.session.user.id]
    );

    if (cartResult.rows.length === 0) {
      return res.redirect('/cart');
    }

    const cart = cartResult.rows[0];

    // Get cart items with product details
    const itemsResult = await db.query(`
      SELECT ci.*, p.name, p.price, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cart.id]);

    const cartItems = itemsResult.rows.map(item => ({
      ...item,
      price: parseFloat(item.price),
      total: parseFloat(item.price) * item.quantity
    }));
    
    // Redirect to cart if empty
    if (cartItems.length === 0) {
      return res.redirect('/cart');
    }

    // Validate cart items against current stock
    const invalidItems = [];
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        invalidItems.push({
          id: item.product_id,
          name: item.name,
          reason: `Only ${item.stock} units available in stock`,
          availableQuantity: item.stock
        });
      }
    }

    if (invalidItems.length > 0) {
      req.session.cartError = 'Some items in your cart are no longer available in the requested quantity.';
      return res.redirect('/cart');
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.render('checkout', {
      title: 'Checkout',
      cart: {
        items: cartItems,
        totalQty,
        totalPrice
      },
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    console.error('Error loading checkout:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'An error occurred while loading checkout',
      error: process.env.NODE_ENV !== 'production' ? error : null
    });
  }
});

// Process order
router.post('/checkout', [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('name').notEmpty().withMessage('Please enter your name'),
  body('address').notEmpty().withMessage('Please enter your address'),
  body('city').notEmpty().withMessage('Please enter your city'),
  body('state').notEmpty().withMessage('Please enter your state/province'),
  body('zip').notEmpty().withMessage('Please enter your postal/zip code'),
  body('payment_method_id').notEmpty().withMessage('Payment information is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    // Get user's cart
    const cartResult = await db.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [req.session.user.id]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart not found'
      });
    }

    const cart = cartResult.rows[0];

    // Get cart items with product details
    const itemsResult = await db.query(`
      SELECT ci.*, p.name, p.price, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cart.id]);

    const cartItems = itemsResult.rows;
    
    // Ensure cart is not empty
    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Your cart is empty'
      });
    }

    // Validate cart items against current stock
    const invalidItems = [];
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        invalidItems.push({
          id: item.product_id,
          name: item.name,
          reason: `Only ${item.stock} units available in stock`,
          availableQuantity: item.stock
        });
      }
    }

    if (invalidItems.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Some items in your cart are no longer available in the requested quantity.',
        invalidItems
      });
    }

    // Format shipping address
    const {
      name,
      address,
      city,
      state,
      zip,
      country,
      email,
      payment_method_id
    } = req.body;
    
    const shippingAddress = `${name}\n${address}\n${city}, ${state} ${zip}\n${country || 'USA'}`;
    
    // Process payment
    const paymentResult = await paymentService.processPayment({
      amount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      paymentMethodId: payment_method_id,
      description: `Order from Reptile E-Commerce - ${cartItems.length} items`,
      metadata: {
        email,
        items_count: cartItems.length.toString()
      }
    });
    
    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Payment failed: ' + paymentResult.error
      });
    }
    
    // Create order
    const orderData = {
      user_id: req.session.user ? req.session.user.id : null,
      total_amount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      shipping_address: shippingAddress
    };
    
    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.price
    }));
    
    const order = await orderModel.createOrder(orderData, orderItems);
    
    // Send confirmation email
    await paymentService.sendOrderConfirmationEmail(order, email);
    
    // Clear cart after successful order
    await db.query(
      'DELETE FROM cart_items WHERE cart_id = $1',
      [cart.id]
    );
    
    return res.json({
      success: true,
      orderId: order.id,
      redirect: `/checkout/success?order_id=${order.id}`
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during checkout. Please try again.'
    });
  }
});

// Order success page
router.get('/checkout/success', async (req, res) => {
  try {
    const orderId = req.query.order_id;
    
    // If no order ID, show generic success
    if (!orderId) {
      return res.render('order-confirmation', {
        title: 'Order Successful',
        order: null
      });
    }
    
    // Get order details
    const order = await orderModel.getOrderById(orderId);
    
    if (!order) {
      return res.render('order-confirmation', {
        title: 'Order Successful',
        order: null,
        error: 'Order not found or access denied.'
      });
    }

    // Optional: Check if the order belongs to the logged-in user
    if (req.session.user && order.user_id !== req.session.user.id) {
       return res.status(403).render('error', {
           title: 'Access Denied',
           status: 403,
           message: 'You do not have permission to view this order.'
       });
    }

    res.render('order-confirmation', {
      title: 'Order Successful',
      order
    });
  } catch (error) {
    console.error('Error rendering success page:', error);
    // Render the confirmation page even on error, but indicate an issue
    res.render('order-confirmation', {
      title: 'Order Successful',
      order: null,
      error: 'An unexpected error occurred while retrieving order details.'
    });
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
  // Redirect to home if already logged in
  if (req.session.user) {
    return res.redirect('/');
  }
  
  res.render('login', {
    title: 'Sign In',
    user: null,
    messages: req.session.messages || {}
  });
  
  // Clear messages after displaying
  req.session.messages = {};
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
  // Redirect to home if already logged in
  if (req.session.user) {
    return res.redirect('/');
  }
  
  res.render('register', {
    title: 'Create Account',
    user: null,
    messages: req.session.messages || {}
  });
  
  // Clear messages after displaying
  req.session.messages = {};
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

// Account page (requires authentication)
router.get('/account', async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    req.session.returnTo = '/account';
    req.session.messages = {
      error: 'Please sign in to access your account'
    };
    return res.redirect('/login');
  }
  
  try {
    // Get user's orders
    const ordersQuery = `
      SELECT o.*, o.total_amount as total, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `;
    const ordersResult = await db.query(ordersQuery, [req.session.user.id]);
    
    // Get user's addresses
    const addressesQuery = `
      SELECT * FROM addresses 
      WHERE user_id = $1 
      ORDER BY is_default DESC, created_at DESC
    `;
    const addressesResult = await db.query(addressesQuery, [req.session.user.id]);
    
    // Get user's payment methods
    const paymentMethodsQuery = `
      SELECT * FROM payment_methods 
      WHERE user_id = $1 
      ORDER BY is_default DESC, created_at DESC
    `;
    const paymentMethodsResult = await db.query(paymentMethodsQuery, [req.session.user.id]);
    
    res.render('account', {
      title: 'My Account',
      user: req.session.user,
      orders: ordersResult.rows,
      addresses: addressesResult.rows,
      paymentMethods: paymentMethodsResult.rows,
      messages: req.session.messages || {}
    });
    
    // Clear any flash messages
    req.session.messages = {};
  } catch (error) {
    console.error('Error loading account page:', error);
    res.render('account', {
      title: 'My Account',
      user: req.session.user,
      orders: [],
      addresses: [],
      paymentMethods: [],
      messages: {
        error: 'Failed to load account information. Please try again.'
      }
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
    user: req.session.user || null
  });
});

// Shipping & Returns page
router.get('/shipping', (req, res) => {
  res.render('shipping', { 
    title: 'Shipping & Returns',
    user: req.session.user || null
  });
});

// Privacy Policy page
router.get('/privacy', (req, res) => {
  res.render('privacy', { 
    title: 'Privacy Policy',
    user: req.session.user || null
  });
});

// Terms & Conditions page
router.get('/terms', (req, res) => {
  res.render('terms', { 
    title: 'Terms & Conditions',
    user: req.session.user || null
  });
});

// User orders page (requires authentication)
router.get('/orders', async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    req.session.returnTo = '/orders';
    req.session.messages = {
      error: 'Please sign in to view your orders'
    };
    return res.redirect('/login');
  }

  try {
    // Get user's orders
    const query = `
      SELECT o.*, o.total_amount as total, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `;
    
    const result = await db.query(query, [req.session.user.id]);
    const orders = result.rows;

    res.render('orders', {
      title: 'My Orders',
      user: req.session.user,
      orders: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load your orders',
      error: { status: 500 }
    });
  }
});

// View individual order details (requires authentication)
router.get('/orders/:id', async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    req.session.returnTo = `/orders/${req.params.id}`;
    req.session.messages = {
      error: 'Please sign in to view order details'
    };
    return res.redirect('/login');
  }

  try {
    const orderId = req.params.id;
    
    // Get order with items
    const order = await orderModel.getOrderById(orderId);
    
    if (!order) {
      return res.status(404).render('error', {
        title: 'Order Not Found',
        status: 404,
        message: 'The requested order does not exist',
        error: { status: 404 }
      });
    }

    // Check if the order belongs to the logged-in user
    if (order.user_id !== req.session.user.id) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        status: 403,
        message: 'You do not have permission to view this order',
        error: { status: 403 }
      });
    }
    
    res.render('order-detail', {
      title: `Order #${order.id}`,
      order,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load order details',
      error: { status: 500 }
    });
  }
});

// Address management routes
router.post('/account/addresses/new', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  try {
    const { name, street, city, state, zip, country, phone } = req.body;
    
    // Check if this is the first address (make it default)
    const addressCount = await db.query('SELECT COUNT(*) FROM addresses WHERE user_id = $1', [req.session.user.id]);
    const isDefault = parseInt(addressCount.rows[0].count) === 0;
    
    const query = `
      INSERT INTO addresses (
        user_id, name, street, city, state, zip, country, phone, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      req.session.user.id,
      name,
      street,
      city,
      state,
      zip,
      country,
      phone,
      isDefault
    ]);

    res.json({ success: true, address: result.rows[0] });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Failed to add address' });
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

// Payment method management routes
router.post('/account/payment-methods/new', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  try {
    const { payment_method_id } = req.body;
    
    // Retrieve payment method details from Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentMethod = await stripe.paymentMethods.retrieve(payment_method_id);
    
    // Check if this is the first payment method (make it default)
    const methodCount = await db.query('SELECT COUNT(*) FROM payment_methods WHERE user_id = $1', [req.session.user.id]);
    const isDefault = parseInt(methodCount.rows[0].count) === 0;
    
    const query = `
      INSERT INTO payment_methods (
        user_id, stripe_payment_method_id, brand, last4, exp_month, exp_year, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      req.session.user.id,
      payment_method_id,
      paymentMethod.card.brand,
      paymentMethod.card.last4,
      paymentMethod.card.exp_month,
      paymentMethod.card.exp_year,
      isDefault
    ]);

    res.json({ success: true, paymentMethod: result.rows[0] });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ error: 'Failed to add payment method' });
  }
});

router.post('/account/payment-methods/:id/set-default', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  try {
    const methodId = req.params.id;
    
    // First, remove default from all payment methods
    await db.query(
      'UPDATE payment_methods SET is_default = false WHERE user_id = $1',
      [req.session.user.id]
    );
    
    // Set the selected payment method as default
    await db.query(
      'UPDATE payment_methods SET is_default = true WHERE id = $1 AND user_id = $2',
      [methodId, req.session.user.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    res.status(500).json({ error: 'Failed to set default payment method' });
  }
});

router.delete('/account/payment-methods/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please sign in to continue' });
  }

  try {
    const methodId = req.params.id;
    
    // Check if this is the default payment method
    const methodResult = await db.query(
      'SELECT is_default, stripe_payment_method_id FROM payment_methods WHERE id = $1 AND user_id = $2',
      [methodId, req.session.user.id]
    );
    
    if (methodResult.rows.length === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    
    // Delete the payment method from Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    await stripe.paymentMethods.detach(methodResult.rows[0].stripe_payment_method_id);
    
    // Delete from database
    await db.query(
      'DELETE FROM payment_methods WHERE id = $1 AND user_id = $2',
      [methodId, req.session.user.id]
    );
    
    // If this was the default method, set a new default if other methods exist
    if (methodResult.rows[0].is_default) {
      const remainingMethods = await db.query(
        'SELECT id FROM payment_methods WHERE user_id = $1 ORDER BY created_at ASC LIMIT 1',
        [req.session.user.id]
      );
      
      if (remainingMethods.rows.length > 0) {
        await db.query(
          'UPDATE payment_methods SET is_default = true WHERE id = $1',
          [remainingMethods.rows[0].id]
        );
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: 'Failed to delete payment method' });
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
    user: req.session.user,
    messages: req.session.messages || {}
  });
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
    user: req.session.user,
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    messages: req.session.messages || {}
  });
});

module.exports = router; 