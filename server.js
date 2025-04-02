require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const path = require('path');
const csrf = require('csurf');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');

// Import database and models
const db = require('./models/database');
const userModel = require('./models/user');
const auth = require('./middleware/auth');

// Import routes
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Database connection
const pool = new Pool({
  connectionString: process.env.HEROKU_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
});

// Connect to the database
pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    // Setup database tables and initial data
    return db.setupDatabase();
  })
  .then(() => {
    // Create initial admin user
    return userModel.createInitialAdmin();
  })
  .catch(err => console.error('Error setting up application:', err));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware - MUST be before CSRF
app.use(session({
  store: new pgSession({
    pool,
    tableName: 'sessions'
  }),
  secret: process.env.SESSION_SECRET,
  resave: true, // Changed to true to ensure session is saved
  saveUninitialized: true, // Changed to true to ensure session is created
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Add user data to response locals - MUST be before CSRF
app.use(auth.setUserLocals);

// CSRF protection for all routes except /api
const csrfProtection = csrf({ 
  cookie: false, // Changed to false to use session instead of cookie
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS']  // Only verify on state-changing methods
});

// Apply CSRF protection to all routes except API and file uploads
app.use((req, res, next) => {
  // Skip CSRF for API routes, Socket.IO, or file uploads
  if (req.path.startsWith('/api/') || 
      req.path.startsWith('/socket.io/') || 
      (req.path.startsWith('/admin/products/') && req.method === 'POST' && req.is('multipart/form-data'))) {
    next();
  } else {
    csrfProtection(req, res, (err) => {
      if (err) {
        console.error('CSRF Error:', err);
        // For AJAX requests, return JSON response
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(403).json({
            error: 'Invalid CSRF token. Please refresh the page and try again.'
          });
        }
        
        // Ensure csrfToken is available for error page rendering
        res.locals.csrfToken = 'error-page-token';
        
        // For regular requests, render error page
        return res.status(403).render('error', {
          title: 'Error',
          status: 403,
          message: 'Invalid request. Please refresh the page and try again.',
          error: process.env.NODE_ENV !== 'production' ? err : null
        });
      }
      next();
    });
  }
});

// Add CSRF token to all rendered views
app.use((req, res, next) => {
  try {
    // Only try to get the token if the CSRF middleware was applied
    if (req.csrfToken) {
      const token = req.csrfToken();
      res.locals.csrfToken = token;
    } else {
      // For routes where CSRF is skipped, generate a token manually
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      res.locals.csrfToken = token;
    }
    next();
  } catch (error) {
    console.error('CSRF Token Generation Error:', error);
    next(error);
  }
});

// Middleware to make current path available to all templates
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  
  // Initialize cart if it doesn't exist in session
  if (!req.session.cart) {
    req.session.cart = {
      items: [],
      totalQty: 0,
      totalPrice: 0
    };
  }
  
  // Make cart available to all views
  res.locals.cart = req.session.cart;
  
  // If user is logged in, fetch cart data from database
  if (req.session.user) {
    db.query(
      'SELECT ci.*, p.price FROM cart_items ci JOIN products p ON ci.product_id = p.id JOIN carts c ON ci.cart_id = c.id WHERE c.user_id = $1',
      [req.session.user.id]
    )
    .then(result => {
      const cartItems = result.rows.map(item => ({
        ...item,
        price: parseFloat(item.price)
      }));
      const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Update session cart with database data
      req.session.cart = {
        items: cartItems,
        totalQty,
        totalPrice
      };
      
      // Update locals cart
      res.locals.cart = req.session.cart;
      
      // Initialize messages object to make it available to all views
      res.locals.messages = req.session.messages || {};
      // Clear flash messages after setting them in locals
      req.session.messages = {};
      
      next();
    })
    .catch(err => {
      console.error('Error fetching cart data:', err);
      next();
    });
  } else {
    // Initialize messages object to make it available to all views
    res.locals.messages = req.session.messages || {};
    // Clear flash messages after setting them in locals
    req.session.messages = {};
    
    next();
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('send_message', async (data) => {
    try {
      // Save message to database
      const { user_email, message } = data;
      const query = 'INSERT INTO messages (user_email, message) VALUES ($1, $2) RETURNING *';
      const result = await pool.query(query, [user_email, message]);
      
      // Emit message to admin panel
      io.emit('new_message', result.rows[0]);
      
      // Acknowledge receipt
      socket.emit('message_received', { status: 'success', id: result.rows[0].id });
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('message_received', { status: 'error', message: 'Failed to save message' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Add routes
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/cart', cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  
  // Ensure csrfToken is available for error page rendering
  if (!res.locals.csrfToken) {
    res.locals.csrfToken = 'error-page-token';
  }
  
  res.status(statusCode).render('error', {
    title: `Error ${statusCode}`,
    status: statusCode,
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV !== 'production' ? err : null
  });
});

// Route for 404 Not Found
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    status: 404,
    message: 'The page you are looking for does not exist'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 