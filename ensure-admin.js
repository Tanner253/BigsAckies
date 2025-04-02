require('dotenv').config();
const db = require('./models/database');
const bcrypt = require('bcrypt');

async function ensureAdmin() {
  try {
    console.log('Ensuring admin account exists...');
    
    const adminEmail = 'percivaltanner@gmail.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Check if admin exists
    const checkQuery = 'SELECT * FROM users WHERE email = $1';
    const checkResult = await db.query(checkQuery, [adminEmail]);
    
    if (checkResult.rows.length === 0) {
      // Create admin user
      const createQuery = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const createResult = await db.query(createQuery, [
        'Admin User',
        adminEmail,
        hashedPassword,
        'admin'
      ]);
      console.log('Admin user created:', adminEmail);
    } else {
      // Update existing user to admin role and set hashed password
      const updateQuery = `
        UPDATE users 
        SET role = 'admin', password = $1
        WHERE email = $2
        RETURNING *
      `;
      const updateResult = await db.query(updateQuery, [hashedPassword, adminEmail]);
      console.log('Existing user updated to admin:', adminEmail);
    }
    
    console.log('Admin account setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error ensuring admin account:', error);
    process.exit(1);
  }
}

// Create a direct database connection for this script
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.HEROKU_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
});

// Override the db.query function to use our direct connection
db.query = (text, params) => pool.query(text, params);

ensureAdmin(); 