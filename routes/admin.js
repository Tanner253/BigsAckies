const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const path = require('path');
const userModel = require('../models/user');
const productModel = require('../models/product');
const categoryModel = require('../models/category');
const orderModel = require('../models/order');
const messageModel = require('../models/message');
const uploadService = require('../services/uploadService');
const auth = require('../middleware/auth');

// Apply authentication middleware to all admin routes except login
router.use((req, res, next) => {
  // Skip authentication for login routes
  if (req.path === '/login' || req.path === '/login-submit') {
    return next();
  }
  
  // Check authentication for all other routes
  auth.isAuthenticated(req, res, next);
});

// Apply admin role check to all admin routes except login
router.use((req, res, next) => {
  // Skip admin check for login routes
  if (req.path === '/login' || req.path === '/login-submit') {
    return next();
  }
  
  // Check admin role for all other routes
  auth.isAdmin(req, res, next);
});

// Redirect root admin path to dashboard
router.get('/', (req, res) => {
  res.redirect('/admin/dashboard');
});

// Admin login page
router.get('/login', (req, res) => {
  // Redirect to dashboard if already logged in
  if (req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  
  res.render('admin/login', {
    title: 'Admin Login',
    error: req.session.loginError
  });
  
  // Clear login error after displaying
  req.session.loginError = null;
});

// Process admin login
router.post('/login-submit', [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.loginError = errors.array().map(error => error.msg).join(', ');
      return res.redirect('/admin/login');
    }
    
    const { email, password } = req.body;
    
    // Authenticate user
    const user = await userModel.authenticateUser(email, password);
    
    if (!user || user.role !== 'admin') {
      req.session.loginError = 'Invalid email or password, or you do not have admin privileges.';
      return res.redirect('/admin/login');
    }
    
    // Store user in session
    req.session.user = user;
    
    // Redirect to original URL or dashboard
    const returnTo = req.session.returnTo || '/admin/dashboard';
    delete req.session.returnTo;
    
    res.redirect(returnTo);
  } catch (error) {
    console.error('Login error:', error);
    req.session.loginError = 'An error occurred during login. Please try again.';
    res.redirect('/admin/login');
  }
});

// Admin logout
router.get('/logout', (req, res) => {
  // Clear user session
  req.session.user = null;
  
  res.redirect('/admin/login');
});

// Admin dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Get order statistics
    const orderStats = await orderModel.getOrderStats();
    
    // Get unread messages count
    const unreadMessages = await messageModel.getUnreadCount();
    
    // Get low stock products
    const lowStockProducts = await productModel.getLowStockProducts(5);
    
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      user: req.session.user,
      orderStats,
      unreadMessages,
      lowStockProducts
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the admin dashboard',
      error: process.env.NODE_ENV !== 'production' ? error : null
    });
  }
});

// Product management
// List all products
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.q;
    const categoryId = req.query.category;
    
    // Get products with pagination and filters
    const productsData = await productModel.getAllProducts({
      page,
      limit,
      search,
      categoryId
    });
    
    // Get all categories for the filter
    const categories = await categoryModel.getAllCategories();
    
    res.render('admin/products', {
      title: 'Manage Products',
      products: productsData.products,
      pagination: productsData.pagination,
      categories,
      activeCategory: categoryId,
      search,
      user: req.session.user
    });
  } catch (error) {
    console.error('Products list error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the products list',
      error: { status: 500 }
    });
  }
});

// Add product form
router.get('/products/add', async (req, res) => {
  try {
    // Get categories for the dropdown
    const categories = await categoryModel.getAllCategories();
    
    res.render('admin/product-form', {
      title: 'Add New Product',
      product: null,
      categories,
      isEdit: false,
      user: req.session.user
    });
  } catch (error) {
    console.error('Add product form error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the add product form',
      error: { status: 500 }
    });
  }
});

// Process add product
router.post('/products/add', uploadService.upload.single('image'), [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category_id').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    
    // Get categories for the form (in case of error)
    const categories = await categoryModel.getAllCategories();
    
    if (!errors.isEmpty()) {
      return res.render('admin/product-form', {
        title: 'Add New Product',
        product: req.body,
        categories,
        errors: errors.array(),
        isEdit: false,
        user: req.session.user
      });
    }
    
    let imageUrl = null;
    
    // Upload image to Cloudinary if provided
    if (req.file) {
      const uploadResult = await uploadService.uploadToCloudinary(req.file.path);
      
      if (!uploadResult.success) {
        return res.render('admin/product-form', {
          title: 'Add New Product',
          product: req.body,
          categories,
          errors: [{ msg: 'Failed to upload image: ' + uploadResult.error }],
          isEdit: false,
          user: req.session.user
        });
      }
      
      imageUrl = uploadResult.url;
    }
    
    // Create product
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      category_id: req.body.category_id,
      image_url: imageUrl
    };
    
    const newProduct = await productModel.createProduct(productData);
    
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Add product error:', error);
    
    // Get categories again for the form
    const categories = await categoryModel.getAllCategories();
    
    res.render('admin/product-form', {
      title: 'Add New Product',
      product: req.body,
      categories,
      errors: [{ msg: 'An error occurred while adding the product: ' + error.message }],
      isEdit: false,
      user: req.session.user
    });
  }
});

// Edit product form
router.get('/products/edit/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Get product
    const product = await productModel.getProductById(productId);
    
    if (!product) {
      return res.status(404).render('error', {
        title: 'Product Not Found',
        status: 404,
        message: 'The requested product does not exist',
        error: { status: 404 }
      });
    }
    
    // Get categories for the dropdown
    const categories = await categoryModel.getAllCategories();
    
    res.render('admin/product-form', {
      title: 'Edit Product',
      product,
      categories,
      isEdit: true,
      user: req.session.user
    });
  } catch (error) {
    console.error('Edit product form error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the edit product form',
      error: { status: 500 }
    });
  }
});

// Process edit product
router.post('/products/edit/:id', uploadService.upload.single('image'), [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category_id').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check for validation errors
    const errors = validationResult(req);
    
    // Get categories for the form (in case of error)
    const categories = await categoryModel.getAllCategories();
    
    if (!errors.isEmpty()) {
      return res.render('admin/product-form', {
        title: 'Edit Product',
        product: { ...req.body, id: productId },
        categories,
        errors: errors.array(),
        isEdit: true,
        user: req.session.user
      });
    }
    
    // Get current product
    const currentProduct = await productModel.getProductById(productId);
    
    if (!currentProduct) {
      return res.status(404).render('error', {
        title: 'Product Not Found',
        status: 404,
        message: 'The requested product does not exist',
        error: { status: 404 }
      });
    }
    
    let imageUrl = currentProduct.image_url;
    
    // Upload new image to Cloudinary if provided
    if (req.file) {
      const uploadResult = await uploadService.uploadToCloudinary(req.file.path);
      
      if (!uploadResult.success) {
        return res.render('admin/product-form', {
          title: 'Edit Product',
          product: { ...req.body, id: productId, image_url: currentProduct.image_url },
          categories,
          errors: [{ msg: 'Failed to upload image: ' + uploadResult.error }],
          isEdit: true,
          user: req.session.user
        });
      }
      
      imageUrl = uploadResult.url;
    }
    
    // Update product
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      category_id: req.body.category_id,
      image_url: imageUrl
    };
    
    await productModel.updateProduct(productId, productData);
    
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Edit product error:', error);
    
    // Get categories again for the form
    const categories = await categoryModel.getAllCategories();
    
    res.render('admin/product-form', {
      title: 'Edit Product',
      product: { ...req.body, id: req.params.id },
      categories,
      errors: [{ msg: 'An error occurred while updating the product: ' + error.message }],
      isEdit: true,
      user: req.session.user
    });
  }
});

// Delete product
router.post('/products/delete/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Delete product
    await productModel.deleteProduct(productId);
    
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to delete the product',
      error: { status: 500 }
    });
  }
});

// Categories management
// List all categories
router.get('/categories', async (req, res) => {
  try {
    // Get all categories with product counts
    const categories = await categoryModel.getAllCategoriesWithProductCount();
    
    res.render('admin/categories', {
      title: 'Manage Categories',
      categories,
      user: req.session.user
    });
  } catch (error) {
    console.error('Categories list error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the categories list',
      error: { status: 500 }
    });
  }
});

// Add category
router.post('/categories/add', [
  body('name').notEmpty().withMessage('Category name is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      req.session.messages = { error: errors.array().map(error => error.msg).join(', ') };
      return res.redirect('/admin/categories');
    }
    
    const { name, description } = req.body;
    
    // Create category
    await categoryModel.createCategory(name, description);
    
    req.session.messages = { success: 'Category added successfully' };
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Add category error:', error);
    req.session.messages = { error: 'Failed to add category: ' + error.message };
    res.redirect('/admin/categories');
  }
});

// Edit category
router.post('/categories/edit/:id', [
  body('name').notEmpty().withMessage('Category name is required')
], async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Check for validation errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      req.session.messages = { error: errors.array().map(error => error.msg).join(', ') };
      return res.redirect('/admin/categories');
    }
    
    const { name, description } = req.body;
    
    // Update category
    await categoryModel.updateCategory(categoryId, name, description);
    
    req.session.messages = { success: 'Category updated successfully' };
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Edit category error:', error);
    req.session.messages = { error: 'Failed to update category: ' + error.message };
    res.redirect('/admin/categories');
  }
});

// Delete category
router.post('/categories/delete/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Delete category
    await categoryModel.deleteCategory(categoryId);
    
    req.session.messages = { success: 'Category deleted successfully' };
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Delete category error:', error);
    req.session.messages = { error: 'Failed to delete category: ' + error.message };
    res.redirect('/admin/categories');
  }
});

// Order management
// List all orders
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;
    
    // Get orders with pagination and filters
    const ordersData = await orderModel.getAllOrders({
      page,
      limit,
      status,
      startDate,
      endDate
    });
    
    res.render('admin/orders', {
      title: 'Manage Orders',
      orders: ordersData.orders,
      pagination: ordersData.pagination,
      filters: {
        status,
        startDate,
        endDate
      },
      user: req.session.user
    });
  } catch (error) {
    console.error('Orders list error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the orders list',
      error: { status: 500 }
    });
  }
});

// View order details
router.get('/orders/:id', async (req, res) => {
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
    
    res.render('admin/order-detail', {
      title: `Order #${order.id}`,
      order,
      user: req.session.user
    });
  } catch (error) {
    console.error('Order detail error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the order details',
      error: { status: 500 }
    });
  }
});

// Update order status
router.post('/orders/:id/status', [
  body('status').notEmpty().withMessage('Status is required')
], async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    // Update order status
    await orderModel.updateOrderStatus(orderId, status);
    
    res.redirect(`/admin/orders/${orderId}`);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to update the order status',
      error: { status: 500 }
    });
  }
});

// Message management
// List all messages
router.get('/messages', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    
    // Get messages with pagination and filters
    const messagesData = await messageModel.getAllMessages({
      page,
      limit,
      status
    });
    
    res.render('admin/messages', {
      title: 'Customer Messages',
      messages: messagesData.messages,
      pagination: messagesData.pagination,
      activeStatus: status,
      user: req.session.user
    });
  } catch (error) {
    console.error('Messages list error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the messages list',
      error: { status: 500 }
    });
  }
});

// View message details
router.get('/messages/:id', async (req, res) => {
  try {
    const messageId = req.params.id;
    
    // Get message
    const message = await messageModel.getMessageById(messageId);
    
    if (!message) {
      return res.status(404).render('error', {
        title: 'Message Not Found',
        status: 404,
        message: 'The requested message does not exist',
        error: { status: 404 }
      });
    }
    
    // Update message status to Read if it's Unread
    if (message.status === 'Unread') {
      await messageModel.updateMessageStatus(messageId, 'Read');
      message.status = 'Read';
    }
    
    res.render('admin/message-detail', {
      title: 'Message Details',
      message,
      user: req.session.user
    });
  } catch (error) {
    console.error('Message detail error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to load the message details',
      error: { status: 500 }
    });
  }
});

// Reply to message
router.post('/messages/:id/reply', [
  body('response').notEmpty().withMessage('Response is required')
], async (req, res) => {
  try {
    const messageId = req.params.id;
    const { response } = req.body;
    
    // Check for validation errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      // Get message for the form
      const message = await messageModel.getMessageById(messageId);
      
      return res.render('admin/message-detail', {
        title: 'Message Details',
        message,
        errors: errors.array(),
        user: req.session.user
      });
    }
    
    // Reply to message
    await messageModel.replyToMessage(messageId, response);
    
    res.redirect('/admin/messages');
  } catch (error) {
    console.error('Reply to message error:', error);
    res.status(500).render('error', {
      title: 'Error',
      status: 500,
      message: 'Failed to send the reply',
      error: { status: 500 }
    });
  }
});

module.exports = router; 
