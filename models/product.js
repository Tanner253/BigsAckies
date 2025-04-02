const db = require('./database');

// Get all products with optional pagination and filters
const getAllProducts = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    categoryId,
    search,
    min_price,
    max_price,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = options;
  
  const offset = (page - 1) * limit;
  let query = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  
  const queryParams = [];
  let paramCount = 1;
  
  // Add filters if provided
  if (categoryId) {
    query += ` AND p.category_id = $${paramCount++}`;
    queryParams.push(categoryId);
  }
  
  if (search) {
    query += ` AND (p.name ILIKE $${paramCount++} OR p.description ILIKE $${paramCount++})`;
    queryParams.push(`%${search}%`, `%${search}%`);
  }
  
  // Add price range filters if provided
  if (min_price !== undefined && min_price !== null && min_price !== '') {
    query += ` AND p.price >= $${paramCount++}`;
    queryParams.push(parseFloat(min_price));
  }
  
  if (max_price !== undefined && max_price !== null && max_price !== '') {
    query += ` AND p.price <= $${paramCount++}`;
    queryParams.push(parseFloat(max_price));
  }
  
  // Add sorting and pagination
  query += ` ORDER BY p.${sortBy} ${sortOrder}`;
  query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
  queryParams.push(limit, offset);
  
  // Execute query
  const result = await db.query(query, queryParams);
  
  // Process the products to ensure price is a number
  const products = result.rows.map(product => ({
    ...product,
    price: parseFloat(product.price)
  }));
  
  // Get total count for pagination
  const countQuery = `
    SELECT COUNT(*) FROM products p
    WHERE 1=1
    ${categoryId ? ' AND p.category_id = $1' : ''}
    ${search ? ` AND (p.name ILIKE $${categoryId ? 2 : 1} OR p.description ILIKE $${categoryId ? 3 : 2})` : ''}
    ${min_price !== undefined && min_price !== null && min_price !== '' ? 
      ` AND p.price >= $${categoryId && search ? 4 : (categoryId || search ? 2 : 1)}` : ''}
    ${max_price !== undefined && max_price !== null && max_price !== '' ? 
      ` AND p.price <= $${
        (categoryId && search && min_price !== undefined && min_price !== null && min_price !== '') ? 5 :
        (categoryId && search) ? 4 :
        ((categoryId || search) && (min_price !== undefined && min_price !== null && min_price !== '')) ? 3 :
        (categoryId || search) ? 2 : 
        (min_price !== undefined && min_price !== null && min_price !== '') ? 2 : 1
      }` : ''}
  `;
  
  const countParams = [];
  if (categoryId) countParams.push(categoryId);
  if (search) countParams.push(`%${search}%`, `%${search}%`);
  if (min_price !== undefined && min_price !== null && min_price !== '') countParams.push(parseFloat(min_price));
  if (max_price !== undefined && max_price !== null && max_price !== '') countParams.push(parseFloat(max_price));
  
  const countResult = await db.query(countQuery, countParams);
  const totalCount = parseInt(countResult.rows[0].count);
  
  return {
    products: products,
    pagination: {
      total: totalCount,
      page: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

// Get a single product by ID
const getProductById = async (id) => {
  const query = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `;
  
  const result = await db.query(query, [id]);
  if (result.rows.length === 0) return null;
  
  const product = result.rows[0];
  // Ensure price is a number
  product.price = parseFloat(product.price);
  
  return product;
};

// Create a new product
const createProduct = async (productData) => {
  const {
    name,
    description,
    price,
    stock,
    category_id,
    image_url
  } = productData;
  
  const query = `
    INSERT INTO products (name, description, price, stock, category_id, image_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  
  const result = await db.query(query, [
    name,
    description,
    price,
    stock,
    category_id,
    image_url
  ]);
  
  return result.rows[0];
};

// Update a product
const updateProduct = async (id, productData) => {
  // Build the SET clause dynamically based on provided fields
  const updates = [];
  const values = [];
  let paramCount = 1;

  // Only include fields that are provided and not undefined
  if (productData.name !== undefined) {
    updates.push(`name = $${paramCount}`);
    values.push(productData.name);
    paramCount++;
  }
  if (productData.description !== undefined) {
    updates.push(`description = $${paramCount}`);
    values.push(productData.description);
    paramCount++;
  }
  if (productData.price !== undefined) {
    updates.push(`price = $${paramCount}`);
    values.push(productData.price);
    paramCount++;
  }
  if (productData.stock !== undefined) {
    updates.push(`stock = $${paramCount}`);
    values.push(productData.stock);
    paramCount++;
  }
  if (productData.category_id !== undefined) {
    updates.push(`category_id = $${paramCount}`);
    values.push(productData.category_id);
    paramCount++;
  }
  if (productData.image_url !== undefined) {
    updates.push(`image_url = $${paramCount}`);
    values.push(productData.image_url);
    paramCount++;
  }

  // If no fields to update, return the current product
  if (updates.length === 0) {
    const currentProduct = await getProductById(id);
    return currentProduct;
  }

  const query = `
    UPDATE products
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  values.push(id);
  const result = await db.query(query, values);
  return result.rows[0];
};

// Delete a product
const deleteProduct = async (id) => {
  const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// Update product stock
const updateProductStock = async (id, stockChange) => {
  const query = `
    UPDATE products
    SET stock = stock + $1
    WHERE id = $2 AND stock + $1 >= 0
    RETURNING *
  `;
  
  const result = await db.query(query, [stockChange, id]);
  return result.rows[0];
};

// Check if product has enough stock
const checkProductStock = async (id, quantity) => {
  const query = 'SELECT stock FROM products WHERE id = $1';
  const result = await db.query(query, [id]);
  
  if (result.rows.length === 0) {
    return false;
  }
  
  return result.rows[0].stock >= quantity;
};

// Get products with low stock
const getLowStockProducts = async (threshold = 5) => {
  const query = 'SELECT * FROM products WHERE stock <= $1 ORDER BY stock ASC';
  const result = await db.query(query, [threshold]);
  return result.rows;
};

// Get featured products
const getFeaturedProducts = async (limit = 4) => {
  try {
    // First, try to get products with stock > 0
    const query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock > 0
      ORDER BY RANDOM()
      LIMIT $1
    `;
    
    const result = await db.query(query, [limit]);
    
    // If no products found with stock, return empty array
    if (result.rows.length === 0) {
      console.log('No products with stock found for featured section');
      
      // Fallback: Get any products regardless of stock
      const fallbackQuery = `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY RANDOM()
        LIMIT $1
      `;
      
      const fallbackResult = await db.query(fallbackQuery, [limit]);
      // Convert price strings to numbers
      return fallbackResult.rows.map(product => ({
        ...product,
        price: parseFloat(product.price)
      }));
    }
    
    // Convert price strings to numbers
    return result.rows.map(product => ({
      ...product,
      price: parseFloat(product.price)
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  checkProductStock,
  getLowStockProducts,
  getFeaturedProducts
}; 