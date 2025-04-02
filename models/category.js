const db = require('./database');

// Get all categories
const getAllCategories = async () => {
  const query = 'SELECT * FROM categories ORDER BY name ASC';
  const result = await db.query(query);
  return result.rows;
};

// Get category by ID
const getCategoryById = async (id) => {
  const query = 'SELECT * FROM categories WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// Create a new category
const createCategory = async (name, description) => {
  const query = 'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *';
  const result = await db.query(query, [name, description]);
  
  return result.rows[0];
};

// Update a category
const updateCategory = async (id, name, description) => {
  const query = 'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *';
  const result = await db.query(query, [name, description, id]);
  
  return result.rows[0];
};

// Delete a category
const deleteCategory = async (id) => {
  const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
  const result = await db.query(query, [id]);
  
  return result.rows[0];
};

// Get categories with product counts
const getCategoriesWithProductCounts = async () => {
  const query = `
    SELECT c.*, COUNT(p.id) AS product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id
    ORDER BY c.name ASC
  `;
  
  const result = await db.query(query);
  return result.rows;
};

// Get all categories with product counts - alias for getCategoriesWithProductCounts
const getAllCategoriesWithProductCount = async () => {
  return getCategoriesWithProductCounts();
};

// Seed initial categories if none exist
const seedInitialCategories = async () => {
  try {
    // Check if any categories exist
    const existingCategories = await getAllCategories();
    
    if (existingCategories.length === 0) {
      // Initial category data
      const initialCategories = [
        { name: 'Reptiles', description: 'Live reptiles such as snakes, lizards, and turtles' },
        { name: 'Feeders', description: 'Live and frozen food for reptiles including mice, rats, and insects' },
        { name: 'Enclosures', description: 'Tanks, terrariums, and habitats for reptiles' },
        { name: 'Heating', description: 'Heat lamps, pads, and other temperature control devices' },
        { name: 'Lighting', description: 'UV and other specialty lighting for reptile health' },
        { name: 'Substrates', description: 'Bedding and substrate materials for reptile enclosures' },
        { name: 'Accessories', description: 'Decorations, hides, and other enclosure accessories' },
        { name: 'Supplements', description: 'Vitamins and nutritional supplements for reptiles' }
      ];
      
      // Insert initial categories
      for (const category of initialCategories) {
        await createCategory(category.name, category.description);
      }
      
      console.log('Initial categories have been seeded');
    }
  } catch (error) {
    console.error('Error seeding initial categories:', error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithProductCounts,
  getAllCategoriesWithProductCount,
  seedInitialCategories
}; 