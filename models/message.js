const db = require('./database');
const nodemailer = require('nodemailer');

// Get all messages with optional pagination and filters
const getAllMessages = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = options;
  
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM messages WHERE 1=1';
  
  const queryParams = [];
  let paramCount = 1;
  
  // Add status filter if provided
  if (status) {
    query += ` AND status = $${paramCount++}`;
    queryParams.push(status);
  }
  
  // Add sorting and pagination
  query += ` ORDER BY ${sortBy} ${sortOrder}`;
  query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
  queryParams.push(limit, offset);
  
  // Execute query
  const result = await db.query(query, queryParams);
  
  // Get total count for pagination
  let countQuery = 'SELECT COUNT(*) FROM messages';
  
  if (status) {
    countQuery += ' WHERE status = $1';
  }
  
  const countParams = status ? [status] : [];
  const countResult = await db.query(countQuery, countParams);
  const totalCount = parseInt(countResult.rows[0].count);
  
  return {
    messages: result.rows,
    pagination: {
      total: totalCount,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

// Get message by ID
const getMessageById = async (id) => {
  const query = 'SELECT * FROM messages WHERE id = $1';
  const result = await db.query(query, [id]);
  
  return result.rows[0];
};

// Create a new message
const createMessage = async (messageData) => {
  const { user_email, message } = messageData;
  
  const query = 'INSERT INTO messages (user_email, message) VALUES ($1, $2) RETURNING *';
  const result = await db.query(query, [user_email, message]);
  
  return result.rows[0];
};

// Update message status
const updateMessageStatus = async (id, status) => {
  const query = 'UPDATE messages SET status = $1 WHERE id = $2 RETURNING *';
  const result = await db.query(query, [status, id]);
  
  return result.rows[0];
};

// Reply to a message
const replyToMessage = async (id, response) => {
  const now = new Date();
  
  // Update message with response
  const updateQuery = `
    UPDATE messages
    SET response = $1, responded_at = $2, status = 'Replied'
    WHERE id = $3
    RETURNING *
  `;
  
  const updateResult = await db.query(updateQuery, [response, now, id]);
  
  if (updateResult.rows.length === 0) {
    throw new Error('Message not found');
  }
  
  const message = updateResult.rows[0];
  
  // Try to send email reply, but don't fail if it doesn't work
  try {
    await sendEmailReply(message.user_email, response);
  } catch (error) {
    console.error('Failed to send email reply:', error);
    // Continue execution even if email fails
  }
  
  return message;
};

// Get unread messages count
const getUnreadCount = async () => {
  const query = "SELECT COUNT(*) FROM messages WHERE status = 'Unread'";
  const result = await db.query(query);
  
  return parseInt(result.rows[0].count);
};

// Configure email transporter
const configureEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email reply
const sendEmailReply = async (email, responseText) => {
  // Check if email configuration is available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email configuration not found, skipping email send');
    return false;
  }

  try {
    const transporter = configureEmailTransporter();
    
    const mailOptions = {
      from: '"BigsAckies Support" <no-reply@biggsackies.com>',
      replyTo: process.env.EMAIL_USER, // This allows replies to go to the actual support email
      to: email,
      subject: 'Response to Your Inquiry - BigsAckies',
      text: responseText,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Thank you for your message</h2>
          <p>We appreciate your inquiry. Here is our response:</p>
          <div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #4CAF50; margin: 10px 0;">
            ${responseText.replace(/\n/g, '<br>')}
          </div>
          <p>If you have any further questions, please feel free to contact us again.</p>
          <p>Best regards,<br>BigsAckies Support Team</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false; // Return false instead of throwing error
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessageStatus,
  replyToMessage,
  getUnreadCount,
  sendEmailReply
}; 