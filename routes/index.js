const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const productModel = require('../models/product');
const categoryModel = require('../models/category');
const orderModel = require('../models/order');
const messageModel = require('../models/message');
const userModel = require('../models/user');
const newsletterModel = require('../models/newsletter');
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

// User account page (profile, orders, etc.)
router.get('/account', auth.isAuthenticated, async (req, res) => {
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
    
    res.render('account', {
      title: 'My Account',
      layout: 'main-layout',
      user: req.session.user,
      orders: ordersResult.rows,
      addresses: addressesResult.rows,
      messages: req.session.messages || {} // Use session messages
    });
    delete req.session.messages; // Clear messages after reading
  } catch (error) {
    console.error('Error loading account page:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load account information. Please try again.',
      layout: 'main-layout'
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
router.get('/orders/:id', auth.isAuthenticated, async (req, res) => {
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
      layout: 'main-layout',
      order,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load order details',
      error: { status: 500 },
      layout: 'main-layout'
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

// Order confirmation page
router.get('/order-confirmation/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Check if this order belongs to the logged-in user or if they are admin
    const orderDetails = await orderModel.getOrderById(orderId);
    
    if (!orderDetails || (req.session.user && orderDetails.user_id !== req.session.user.id && !req.session.user.is_admin)) {
      req.flash('error', 'You are not authorized to view this order.');
      return res.redirect('/'); // Redirect to home or login
    }
    
    res.render('order-confirmation', {
      title: `Order Confirmation #${orderId}`,
      layout: 'main-layout',
      order: orderDetails,
      user: req.session.user || null,
      messages: req.session.messages || {}
    });
    delete req.session.messages; // Clear messages after reading
  } catch (error) {
    // ... error handling ...
    res.status(500).render('error', {
      // ... error variables ...
      layout: 'main-layout' // <-- Add main layout here too
    });
  }
});

module.exports = router; 