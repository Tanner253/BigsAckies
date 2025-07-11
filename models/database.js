const { Pool } = require('pg');

// Create pool connection
const pool = new Pool({
  connectionString: process.env.HEROKU_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper for executing queries
const query = (text, params) => pool.query(text, params);

// Database initialization function
const initializeDatabase = async () => {
  try {
    // Database initialization is now handled by a separate secure script
    console.log('Database connection established');
  } catch (e) {
    console.error('Error connecting to database:', e);
    throw e;
  }
};

// Function to set up database
async function setupDatabase() {
  try {
    // Create categories table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create products table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url TEXT,
        category_id INTEGER REFERENCES categories(id),
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create users table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create orders table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        shipping_address TEXT,
        payment_intent_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create order_items table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price_at_time DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create messages table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        user_email VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Unread',
        response TEXT,
        responded_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create sessions table for storing session data
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR NOT NULL PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      )
    `);
    
    // Create cart table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create cart_items table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        cart_id INTEGER REFERENCES carts(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(cart_id, product_id)
      )
    `);

    // Create newsletter_subscribers table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `);

    // Create addresses table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255), -- Optional name for the address (e.g., 'Home', 'Work')
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL,
        phone VARCHAR(50),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add 'name' column to users table if it doesn't exist
    try {
      // Check if the column exists
      const columnCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'name'
      `);
      
      if (columnCheck.rows.length === 0) {
        // Add the name column
        await pool.query(`
          ALTER TABLE users 
          ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT 'User'
        `);
        console.log('Added name column to users table');
      }
    } catch (error) {
      console.error('Error checking/adding name column:', error);
    }
    
    // Migration for orders table: add payment_intent_id
    try {
      const columnCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_intent_id'
      `);
      
      if (columnCheck.rows.length === 0) {
        await pool.query(`ALTER TABLE orders ADD COLUMN payment_intent_id VARCHAR(255)`);
        console.log("Added 'payment_intent_id' column to 'orders' table.");
      }

      // Optional: Remove old 'payment_id' column if it exists and is no longer needed
      const oldColumnCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_id'
      `);

      if (oldColumnCheck.rows.length > 0) {
        await pool.query(`ALTER TABLE orders DROP COLUMN payment_id`);
        console.log("Removed legacy 'payment_id' column from 'orders' table.");
      }
    } catch (error) {
      console.error("Error during 'orders' table migration:", error);
    }

    console.log('Database setup completed');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

// Export the pool and initialization function
module.exports = {
  query,
  pool,
  initializeDatabase,
  setupDatabase
}; 