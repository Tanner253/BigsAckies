"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ShoppingCart, Plus, Minus, Check, Star, Sparkles, AlertCircle } from "lucide-react";
import { useNotifications } from "./NotificationSystem";

interface AddToCartButtonProps {
  productId: number;
  productName?: string;
  price?: number;
  stock?: number;
  isAnimal?: boolean;
  maleQuantity?: number;
  femaleQuantity?: number;
  unknownQuantity?: number;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export default function AddToCartButton({
  productId,
  productName = "Product",
  price = 0,
  stock = 0,
  isAnimal = false,
  maleQuantity = 0,
  femaleQuantity = 0,
  unknownQuantity = 0,
  className = "",
  size = "default"
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addNotification } = useNotifications();

  // Calculate available stock
  const availableStock = isAnimal 
    ? (maleQuantity || 0) + (femaleQuantity || 0) + (unknownQuantity || 0)
    : stock || 0;

  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      addNotification({
        type: "error",
        title: "Out of Stock",
        message: "This item is currently out of stock.",
        duration: 4000
      });
      return;
    }

    if (quantity > availableStock) {
      addNotification({
        type: "error",
        title: "Insufficient Stock",
        message: `Only ${availableStock} units available.`,
        duration: 4000
      });
      return;
    }

    setIsAdding(true);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to add item to cart');
      }

      // Add success notification
      addNotification({
        type: "success",
        title: "Added to Cart!",
        message: `${quantity}x ${productName} has been added to your cosmic collection.`,
        duration: 4000,
        action: {
          label: "View Cart",
          onClick: () => window.location.href = "/cart"
        }
      });

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      
    } catch (error) {
      addNotification({
        type: "error",
        title: "Failed to Add",
        message: error instanceof Error ? error.message : "Unable to add item to cart. Please try again.",
        duration: 4000
      });
    } finally {
      setIsAdding(false);
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    adding: { scale: 1.02 },
    added: { scale: 1.1 }
  };

  // Show out of stock message if no stock available
  if (isOutOfStock) {
    return (
      <div className={`flex flex-col space-y-4 ${className}`}>
        <div className="flex items-center justify-center space-x-2 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <AlertCircle size={20} className="text-red-400" />
          <span className="text-red-400 font-medium">Out of Stock</span>
        </div>
        <div className="text-center text-stellar-silver/70 text-sm">
          This item is currently unavailable
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Stock Information */}
      <div className="text-center text-stellar-silver/70 text-sm">
        {availableStock <= 5 && availableStock > 0 && (
          <span className="text-orange-400 font-medium">
            Only {availableStock} left in stock!
          </span>
        )}
        {availableStock > 5 && (
          <span className="text-green-400">
            In Stock ({availableStock} available)
          </span>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-stellar-silver text-sm font-medium">Quantity:</span>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full bg-nebula-violet/20 border border-nebula-violet/30 flex items-center justify-center hover:bg-nebula-violet/30 transition-colors"
          >
            <Minus size={14} className="text-stellar-white" />
          </motion.button>
          
          <motion.span
            key={quantity}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="w-12 text-center text-stellar-white font-semibold"
          >
            {quantity}
          </motion.span>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
            disabled={quantity >= availableStock}
            className="w-8 h-8 rounded-full bg-nebula-violet/20 border border-nebula-violet/30 flex items-center justify-center hover:bg-nebula-violet/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={14} className="text-stellar-white" />
          </motion.button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <motion.div
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        animate={isAdding ? "adding" : isAdded ? "added" : "idle"}
        className="relative"
      >
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || isAdded || isOutOfStock}
          size={size}
          className={`
            relative overflow-hidden btn-cosmic w-full font-semibold
            ${isAdded ? 'bg-gradient-to-r from-green-600 to-emerald-600' : ''}
            ${isAdding ? 'cursor-not-allowed' : ''}
            ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          {/* Button Content */}
          <div className="relative flex items-center justify-center space-x-2">
            {isAdding && (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Adding to Cart...</span>
              </>
            )}
            
            {isAdded && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center space-x-2"
              >
                <Check size={18} />
                <span>Added!</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Star size={16} />
                </motion.div>
              </motion.div>
            )}
            
            {!isAdding && !isAdded && (
              <>
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
                <motion.div
                  animate={{ 
                    y: [0, -2, 0],
                    rotate: [0, 5, -5, 0] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Sparkles size={14} />
                </motion.div>
              </>
            )}
          </div>
        </Button>

        {/* Particle Effects */}
        <AnimatePresence>
          {isAdded && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1,
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{
                    opacity: 0,
                    scale: 1,
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 1,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <Star 
                    size={8} 
                    className="text-nebula-gold"
                    style={{
                      filter: 'drop-shadow(0 0 4px #fbbf24)'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Price Display */}
      {price > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-stellar-silver/70 text-sm"
        >
          Total: 
          <span className="ml-1 font-bold text-nebula-gold">
            ${(price * quantity).toFixed(2)}
          </span>
        </motion.div>
      )}
    </div>
  );
} 