const productModel = require('../models/product');

/**
 * Cart Service
 * Handles shopping cart operations using session storage
 */

// Initialize cart in session if it doesn't exist
const initCart = (req) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: [],
      totalQty: 0,
      totalPrice: 0
    };
  }
  return req.session.cart;
};

// Add item to cart
const addToCart = async (req, productId, quantity = 1) => {
  const cart = initCart(req);
  
  // Get product details
  const product = await productModel.getProductById(productId);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  // Check if product has enough stock
  if (product.stock < quantity) {
    throw new Error(`Only ${product.stock} items available in stock`);
  }
  
  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(item => item.id === productId);
  
  if (existingItemIndex > -1) {
    // Update quantity if product already in cart
    const existingItem = cart.items[existingItemIndex];
    
    // Check if new total quantity exceeds stock
    if (existingItem.quantity + quantity > product.stock) {
      throw new Error(`Cannot add ${quantity} more items. Only ${product.stock - existingItem.quantity} more available.`);
    }
    
    existingItem.quantity += quantity;
    existingItem.price = product.price;
    existingItem.total = existingItem.quantity * product.price;
  } else {
    // Add new item to cart
    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      total: quantity * product.price,
      image_url: product.image_url
    });
  }
  
  // Update cart totals
  updateCartTotals(cart);
  
  return cart;
};

// Remove item from cart
const removeFromCart = (req, productId) => {
  const cart = req.session.cart;
  
  if (!cart) {
    return null;
  }
  
  // Filter out the item to remove
  cart.items = cart.items.filter(item => item.id !== parseInt(productId));
  
  // Update cart totals
  updateCartTotals(cart);
  
  return cart;
};

// Update item quantity
const updateQuantity = async (req, productId, quantity) => {
  const cart = req.session.cart;
  
  if (!cart) {
    return null;
  }
  
  // Find the item
  const item = cart.items.find(item => item.id === parseInt(productId));
  
  if (!item) {
    throw new Error('Item not found in cart');
  }
  
  // Check stock availability
  const product = await productModel.getProductById(productId);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  if (quantity > product.stock) {
    throw new Error(`Only ${product.stock} items available in stock`);
  }
  
  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    return removeFromCart(req, productId);
  }
  
  // Update item quantity and total
  item.quantity = quantity;
  item.total = quantity * item.price;
  
  // Update cart totals
  updateCartTotals(cart);
  
  return cart;
};

// Get cart contents
const getCart = (req) => {
  return req.session.cart || initCart(req);
};

// Clear cart
const clearCart = (req) => {
  req.session.cart = {
    items: [],
    totalQty: 0,
    totalPrice: 0
  };
  
  return req.session.cart;
};

// Helper to update cart totals
const updateCartTotals = (cart) => {
  cart.totalQty = cart.items.reduce((total, item) => total + item.quantity, 0);
  cart.totalPrice = parseFloat(
    cart.items.reduce((total, item) => total + item.total, 0).toFixed(2)
  );
};

// Validate cart items against current stock
const validateCartItems = async (req) => {
  const cart = getCart(req);
  const invalidItems = [];
  
  // Check each item for stock availability
  for (const item of cart.items) {
    const product = await productModel.getProductById(item.id);
    
    if (!product) {
      invalidItems.push({
        id: item.id,
        name: item.name,
        reason: 'Product no longer exists'
      });
      continue;
    }
    
    if (product.stock < item.quantity) {
      invalidItems.push({
        id: item.id,
        name: item.name,
        reason: `Only ${product.stock} available in stock`,
        availableQuantity: product.stock
      });
    }
    
    // Update price in case it changed
    if (product.price !== item.price) {
      item.price = product.price;
      item.total = item.quantity * product.price;
    }
  }
  
  // Update cart totals if prices changed
  updateCartTotals(cart);
  
  return {
    isValid: invalidItems.length === 0,
    invalidItems
  };
};

module.exports = {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCart,
  clearCart,
  validateCartItems
}; 