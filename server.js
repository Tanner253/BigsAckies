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
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');

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

// Trust the first proxy hop (common for Heroku)
app.set('trust proxy', 1);

const server = http.createServer(app);
const io = socketIo(server);

const isProduction = process.env.NODE_ENV === 'production';

// Database connection
const pool = new Pool({
  connectionString: process.env.HEROKU_DATABASE_URL,
  ssl: { // Always require SSL for the remote database
    rejectUnauthorized: false
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
app.use(expressLayouts);
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

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
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Flash middleware - MUST be after session
app.use(flash());

// Add user data to response locals
app.use(auth.setUserLocals);

// CSRF protection middleware
app.use(csrf({ cookie: false }));

// Middleware to make CSRF token and flash messages available to all views
// This MUST come after the CSRF middleware and before the routes
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.messages = req.flash();
  next();
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
  
  // Restore database cart fetching logic
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
      
      next();
    })
    .catch(err => {
      console.error('Error fetching cart data:', err);
      next(); // Ensure next() is called even on error
    });
  } else {
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
  // Handle CSRF token errors specifically
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).render('error', {
      title: 'Error 403',
      layout: 'main-layout',
      status: 403,
      message: 'Invalid security token. Please try submitting the form again.',
      error: null,
      csrfToken: req.csrfToken ? req.csrfToken() : ''
    });
    return;
  }

  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).render('error', {
    title: `Error ${statusCode}`,
    layout: 'main-layout',
    status: statusCode,
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV !== 'production' ? err : null,
    csrfToken: req.csrfToken ? req.csrfToken() : ''
  });
});

// Route for 404 Not Found
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    layout: 'main-layout',
    status: 404,
    message: 'The page you are looking for does not exist'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 