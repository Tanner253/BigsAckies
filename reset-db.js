require('dotenv').config();
const db = require('./models/database');
const categoryModel = require('./models/category');
const productModel = require('./models/product');

async function resetDatabase() {
  console.log('Starting database reset...');
  
  try {
    // Initialize database schema
    await db.setupDatabase();
    console.log('Database schema initialized');
    
    // Create categories
    console.log('Creating categories...');
    const categories = [
      { name: 'Snakes', description: 'Various snake species for reptile enthusiasts' },
      { name: 'Lizards', description: 'Different lizard species including geckos, iguanas, and more' },
      { name: 'Turtles', description: 'Aquatic and land turtles and tortoises' },
      { name: 'Food', description: 'Food items for reptiles including live and frozen options' },
      { name: 'Habitats', description: 'Terrariums, aquariums, and accessories for reptile habitats' },
      { name: 'Accessories', description: 'Various accessories for reptile care and handling' }
    ];
    
    for (const category of categories) {
      await categoryModel.createCategory(category.name, category.description);
    }
    
    const allCategories = await categoryModel.getAllCategories();
    console.log(`Created ${allCategories.length} categories`);
    
    // Create products
    console.log('Creating products...');
    const products = [
      // Snakes
      {
        name: 'Ball Python',
        description: 'A popular pet snake known for its docile temperament and manageable size.',
        price: 149.99,
        stock: 10,
        category_id: allCategories.find(c => c.name === 'Snakes').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/ball_python.jpg'
      },
      {
        name: 'Corn Snake',
        description: 'An excellent beginner snake that is colorful, active, and easy to handle.',
        price: 89.99,
        stock: 15,
        category_id: allCategories.find(c => c.name === 'Snakes').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/corn_snake.jpg'
      },
      // Lizards
      {
        name: 'Leopard Gecko',
        description: 'A small, friendly gecko with distinctive spotted patterns and easy care requirements.',
        price: 59.99,
        stock: 20,
        category_id: allCategories.find(c => c.name === 'Lizards').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/leopard_gecko.jpg'
      },
      {
        name: 'Bearded Dragon',
        description: 'A popular lizard pet known for its friendly behavior and distinctive appearance.',
        price: 129.99,
        stock: 8,
        category_id: allCategories.find(c => c.name === 'Lizards').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/bearded_dragon.jpg'
      },
      // Turtles
      {
        name: 'Red-Eared Slider',
        description: 'A common aquatic turtle species that makes a great beginner pet.',
        price: 39.99,
        stock: 12,
        category_id: allCategories.find(c => c.name === 'Turtles').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/red_eared_slider.jpg'
      },
      {
        name: 'Russian Tortoise',
        description: 'A small land tortoise that can live for decades with proper care.',
        price: 199.99,
        stock: 5,
        category_id: allCategories.find(c => c.name === 'Turtles').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/russian_tortoise.jpg'
      },
      // Food
      {
        name: 'Frozen Mice (10 pack)',
        description: 'Frozen mice for feeding snakes and large lizards.',
        price: 24.99,
        stock: 50,
        category_id: allCategories.find(c => c.name === 'Food').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/frozen_mice.jpg'
      },
      {
        name: 'Live Crickets (100 count)',
        description: 'Live crickets for feeding lizards and other insectivorous reptiles.',
        price: 12.99,
        stock: 100,
        category_id: allCategories.find(c => c.name === 'Food').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/crickets.jpg'
      },
      // Habitats
      {
        name: '40 Gallon Terrarium',
        description: 'A large glass terrarium suitable for most reptile species.',
        price: 149.99,
        stock: 8,
        category_id: allCategories.find(c => c.name === 'Habitats').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/terrarium.jpg'
      },
      {
        name: 'Turtle Tank Setup',
        description: 'Complete setup for aquatic turtles including filter and basking area.',
        price: 199.99,
        stock: 6,
        category_id: allCategories.find(c => c.name === 'Habitats').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/turtle_tank.jpg'
      },
      // Accessories
      {
        name: 'Heat Lamp',
        description: 'Provides necessary heat for reptiles to regulate their body temperature.',
        price: 29.99,
        stock: 25,
        category_id: allCategories.find(c => c.name === 'Accessories').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/heat_lamp.jpg'
      },
      {
        name: 'Digital Thermometer/Hygrometer',
        description: 'Accurately measures temperature and humidity in reptile enclosures.',
        price: 19.99,
        stock: 30,
        category_id: allCategories.find(c => c.name === 'Accessories').id,
        image_url: 'https://res.cloudinary.com/demo/image/upload/v1/reptile/thermometer.jpg'
      }
    ];
    
    for (const product of products) {
      await productModel.createProduct(product);
    }
    
    const allProducts = await productModel.getAllProducts({ limit: 100 });
    console.log(`Created ${allProducts.products.length} products`);
    
    console.log('Database reset completed successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await db.pool.end();
  }
}

// Run the reset
resetDatabase(); 