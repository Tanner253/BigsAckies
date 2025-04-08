const db = require('./database');
const productModel = require('./product');
const userModel = require('./user');

// Get all orders with optional pagination and filters
const getAllOrders = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    startDate,
    endDate,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = options;
  
  const offset = (page - 1) * limit;
  let query = `
    SELECT o.*, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE 1=1
  `;
  
  const queryParams = [];
  let paramCount = 1;
  
  // Add filters if provided
  if (status) {
    query += ` AND o.status = $${paramCount++}`;
    queryParams.push(status);
  }
  
  if (startDate) {
    query += ` AND o.created_at >= $${paramCount++}`;
    queryParams.push(startDate);
  }
  
  if (endDate) {
    query += ` AND o.created_at <= $${paramCount++}`;
    queryParams.push(endDate);
  }
  
  // Add sorting and pagination
  query += ` ORDER BY o.${sortBy} ${sortOrder}`;
  query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
  queryParams.push(limit, offset);
  
  // Execute query
  const result = await db.query(query, queryParams);
  
  // Get total count for pagination
  let countQuery = `
    SELECT COUNT(*) FROM orders o WHERE 1=1
  `;
  
  const countParams = [];
  let countParamIndex = 1;
  
  if (status) {
    countQuery += ` AND o.status = $${countParamIndex++}`;
    countParams.push(status);
  }
  
  if (startDate) {
    countQuery += ` AND o.created_at >= $${countParamIndex++}`;
    countParams.push(startDate);
  }
  
  if (endDate) {
    countQuery += ` AND o.created_at <= $${countParamIndex++}`;
    countParams.push(endDate);
  }
  
  const countResult = await db.query(countQuery, countParams);
  const totalCount = parseInt(countResult.rows[0].count);
  
  return {
    orders: result.rows,
    pagination: {
      total: totalCount,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

// Get order by ID with order items
const getOrderById = async (id) => {
  // Get order
  const orderQuery = `
    SELECT o.*, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = $1
  `;
  
  const orderResult = await db.query(orderQuery, [id]);
  
  if (!orderResult.rows[0]) {
    return null;
  }
  
  const order = orderResult.rows[0];
  
  // Get order items
  const itemsQuery = `
    SELECT 
      oi.*,
      p.name as product_name,
      p.image_url as product_image,
      oi.price_at_time
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `;
  
  const itemsResult = await db.query(itemsQuery, [id]);
  
  // Add items to order
  order.items = itemsResult.rows;
  
  return order;
};

// Create a new order
const createOrder = async (orderData, items) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { user_id, total_amount, shipping_address } = orderData;
    
    // Insert order
    const orderQuery = `
      INSERT INTO orders (user_id, total_amount, shipping_address)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const orderResult = await client.query(orderQuery, [
      user_id,
      total_amount,
      shipping_address
    ]);
    
    const order = orderResult.rows[0];
    
    // Insert order items
    for (const item of items) {
      const { product_id, quantity, price_at_time } = item;
      
      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      await client.query(itemQuery, [
        order.id,
        product_id,
        quantity,
        price_at_time
      ]);
      
      // Update product stock
      await client.query(`
        UPDATE products
        SET stock = stock - $1
        WHERE id = $2 AND stock >= $1
      `, [quantity, product_id]);
    }
    
    await client.query('COMMIT');
    
    return await getOrderById(order.id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Update order status
const updateOrderStatus = async (id, status) => {
  const query = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
  const result = await db.query(query, [status, id]);
  
  return result.rows[0];
};

// Get order statistics
const getOrderStats = async () => {
  try {
    // Get total orders count
    const totalQuery = 'SELECT COUNT(*) FROM orders';
    const totalResult = await db.query(totalQuery);
    
    // Get pending orders count
    const pendingQuery = "SELECT COUNT(*) FROM orders WHERE status = 'pending'";
    const pendingResult = await db.query(pendingQuery);
    
    // Get total revenue
    const revenueQuery = 'SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders';
    const revenueResult = await db.query(revenueQuery);
    
    // Get recent orders
    const recentQuery = `
      SELECT o.*, u.email as user_email, u.name as customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `;
    const recentResult = await db.query(recentQuery);
    
    // Get total products and customers
    const totalProducts = await productModel.getTotalProducts();
    const totalCustomers = await userModel.getTotalUsers();
    
    return {
      total: parseInt(totalResult.rows[0].count) || 0,
      pending: parseInt(pendingResult.rows[0].count) || 0,
      revenue: parseFloat(revenueResult.rows[0].total_revenue) || 0,
      recentOrders: recentResult.rows || [],
      products: totalProducts,
      customers: totalCustomers
    };
  } catch (error) {
    console.error('Error getting order stats:', error);
    return {
      total: 0,
      pending: 0,
      revenue: 0,
      recentOrders: [],
      products: 0,
      customers: 0
    };
  }
};

// Check cart items stock availability before creating order
const checkCartItemsAvailability = async (items) => {
  for (const item of items) {
    const { product_id, quantity } = item;
    const isAvailable = await productModel.checkProductStock(product_id, quantity);
    
    if (!isAvailable) {
      return false;
    }
  }
  
  return true;
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderStats,
  checkCartItemsAvailability
}; 