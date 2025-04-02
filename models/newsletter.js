const db = require('./database');

/**
 * Add a new newsletter subscriber
 * @param {string} email - The subscriber's email address
 * @returns {Promise<Object>} The created subscriber record
 */
const addSubscriber = async (email) => {
  // Check if subscriber already exists
  const existingSubscriber = await getSubscriberByEmail(email);
  if (existingSubscriber) {
    throw new Error('This email is already subscribed to the newsletter');
  }

  const query = 'INSERT INTO newsletter_subscribers (email) VALUES ($1) RETURNING *';
  const result = await db.query(query, [email]);
  return result.rows[0];
};

/**
 * Get a subscriber by email
 * @param {string} email - The subscriber's email address
 * @returns {Promise<Object|null>} The subscriber record if found, null otherwise
 */
const getSubscriberByEmail = async (email) => {
  const query = 'SELECT * FROM newsletter_subscribers WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0] || null;
};

/**
 * Get all newsletter subscribers
 * @param {Object} options - Query options (pagination, sorting)
 * @returns {Promise<Object>} Object containing subscribers and pagination info
 */
const getAllSubscribers = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'subscribed_at',
    sortOrder = 'DESC'
  } = options;

  const offset = (page - 1) * limit;
  
  // Get subscribers with pagination
  const query = `
    SELECT * FROM newsletter_subscribers 
    ORDER BY ${sortBy} ${sortOrder} 
    LIMIT $1 OFFSET $2
  `;
  const result = await db.query(query, [limit, offset]);

  // Get total count for pagination
  const countResult = await db.query('SELECT COUNT(*) FROM newsletter_subscribers');
  const totalCount = parseInt(countResult.rows[0].count);

  return {
    subscribers: result.rows,
    pagination: {
      total: totalCount,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

/**
 * Remove a subscriber
 * @param {string} email - The subscriber's email address
 * @returns {Promise<boolean>} True if subscriber was removed, false if not found
 */
const removeSubscriber = async (email) => {
  const query = 'DELETE FROM newsletter_subscribers WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rowCount > 0;
};

module.exports = {
  addSubscriber,
  getSubscriberByEmail,
  getAllSubscribers,
  removeSubscriber
}; 