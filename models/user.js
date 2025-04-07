const bcrypt = require('bcrypt');
const db = require('./database');

// Get user by email
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0];
};

// Get user by ID
const getUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// Create a new user
const createUser = async (userData) => {
  const { name, email, password, role = 'customer' } = userData;
  
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  // Insert user
  const query = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
  const result = await db.query(query, [name, email, hashedPassword, role]);
  
  return result.rows[0];
};

// Verify password
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Authenticate user
const authenticateUser = async (email, password) => {
  const user = await getUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await verifyPassword(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  // Don't return password
  delete user.password;
  
  return user;
};

// Create initial admin user
const createInitialAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'percivaltanner@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Check if admin exists
    const existingAdmin = await getUserByEmail(adminEmail);
    
    if (!existingAdmin) {
      await createUser({
        name: 'Admin User',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Initial admin user created:', adminEmail);
    }
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};

// Get total number of users
const getTotalUsers = async () => {
  const query = 'SELECT COUNT(*) FROM users WHERE role = $1';
  const result = await db.query(query, ['customer']);
  return parseInt(result.rows[0].count);
};

// Get all users (excluding password)
const getAllUsers = async () => {
  const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
  const result = await db.query(query);
  return result.rows;
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  verifyPassword,
  authenticateUser,
  createInitialAdmin,
  getTotalUsers,
  getAllUsers
}; 