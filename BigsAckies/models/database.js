const { Pool } = require('pg');

// Create connection pool with configuration appropriate for environment
let poolConfig = {
  connectionString: process.env.DATABASE_URL || process.env.HEROKU_DATABASE_URL
};

// In production, force SSL mode with no certificate verification
if (process.env.NODE_ENV === 'production') {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
  console.log('Setting SSL mode for production database connection');
}

// Create the pool with the appropriate config
const pool = new Pool(poolConfig);

// Helper for executing queries with better error handling
const query = async (text, params) => {
  let client;
  try {
    client = await pool.connect();
    console.log('Database connection acquired');
    const result = await client.query(text, params);
    return result;
  } catch (err) {
    console.error('Database query error:', err);
    console.error('Query:', text);
    console.error('Params:', JSON.stringify(params));
    throw err;
  } finally {
    if (client) {
      client.release();
      console.log('Database connection released');
    }
  }
};

// Database initialization function
const initializeDatabase = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('Initial database connection successful');
    
    // Test the connection
    const testResult = await client.query('SELECT NOW()');
    console.log('Database connection test successful:', testResult.rows[0]);
    console.log('Connection environment:', process.env.NODE_ENV || 'development');
    
    // Check if sessions table exists
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'sessions'
      );
    `);
    
    if (!checkTable.rows[0].exists) {
      console.log('Sessions table does not exist, creating it...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          sid VARCHAR NOT NULL PRIMARY KEY,
          sess JSON NOT NULL,
          expire TIMESTAMP(6) NOT NULL
        )
      `);
      console.log('Sessions table created successfully');
    } else {
      console.log('Sessions table exists');
    }
    
    return true;
  } catch (e) {
    console.error('Database initialization error:', e);
    console.error('Error stack:', e.stack);
    throw e;
  } finally {
    if (client) {
      client.release();
      console.log('Initial database connection released');
    }
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
        payment_id VARCHAR(255),
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