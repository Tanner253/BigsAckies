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

// Update user profile information
const updateUser = async (userId, updates) => {
  const allowedUpdates = ['name', 'email']; // Removed 'phone'
  const fields = [];
  const values = [];
  let paramIndex = 1;

  // Build the SET part of the query dynamically and safely
  for (const key in updates) {
    if (allowedUpdates.includes(key) && updates[key] !== undefined) {
      fields.push(`${key} = $${paramIndex++}`);
      values.push(updates[key]);
    }
  }

  if (fields.length === 0) {
    // No valid fields to update, return current user data or throw error
    // For now, let's just return the existing data without hitting DB
    console.warn('updateUser called with no valid fields to update for userId:', userId);
    return await getUserById(userId); 
  }

  // Add the user ID as the last parameter for the WHERE clause
  values.push(userId);

  const setClause = fields.join(', ');
  const query = `
    UPDATE users 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $${paramIndex}
    RETURNING id, name, email, role, created_at, updated_at; -- Removed phone from returning clause
  `;

  try {
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw new Error('User not found or update failed');
    }
    return result.rows[0]; // Return the updated user object
  } catch (error) {
    console.error('Error updating user:', error);
    throw error; // Re-throw the error to be handled by the route
  }
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  verifyPassword,
  authenticateUser,
  createInitialAdmin,
  getTotalUsers,
  getAllUsers,
  updateUser
}; 