"use client";

import { motion } from "framer-motion";
import { Heart, Star, Eye, ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
  categories: { id: number; name: string } | null;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  // Function to get difficulty stars (all reptiles are easy to keep)
  const getDifficultyStars = () => {
    const productName = product.name.toLowerCase();
    if (productName.includes('ackie') || productName.includes('monitor')) {
      return 2; // Easy-Medium for Ackies (good for beginners and experts)
    } else if (productName.includes('dragon') || productName.includes('bearded')) {
      return 1; // Easy for Bearded Dragons (great for beginners)
    } else if (productName.includes('python') || productName.includes('snake')) {
      return 1; // Easy for Pythons (great for beginners)
    }
    return 1; // Default to easy for other reptiles
  };

  const difficultyStars = getDifficultyStars();
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    },
    hover: {
      y: -8,
      scale: 1.02
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1
    }
  };

  const overlayVariants = {
    hover: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group h-full"
    >
      <Card className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-space-dark/80 via-nebula-deep-purple/30 to-space-void/80 border border-nebula-violet/30 backdrop-blur-sm transition-all duration-500 hover:border-nebula-hot-pink/60 hover:shadow-cosmic flex flex-col p-0">
        {/* Product Image Section - Flush with top */}
        <div className="relative overflow-hidden rounded-t-xl">
          <Link href={`/products/${product.id}`} className="block">
            <div className="relative h-48 md:h-56 w-full bg-gradient-to-br from-nebula-deep-purple/20 to-nebula-magenta/20">
              <motion.div variants={imageVariants}>
                <Image
                  src={product.image_url || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-500"
                />
              </motion.div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-space-black/60 via-transparent to-transparent" />
              
              {/* Hover Actions */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center space-x-3 opacity-0"
                variants={overlayVariants}
              >
                <Button 
                  size="sm" 
                  className="btn-cosmic text-white font-semibold rounded-full shadow-nebula backdrop-blur-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                {!isOutOfStock && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-nebula-cyan/60 text-nebula-cyan hover:bg-nebula-cyan/20 rounded-full backdrop-blur-sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                )}
              </motion.div>
            </div>
          </Link>
          
          {/* Stock Status Badge */}
          {isOutOfStock && (
            <div className="absolute top-3 right-3 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
              SOLD!
            </div>
          )}
          
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-3 right-3 bg-nebula-amber/90 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Low Stock
            </div>
          )}
          
          {/* Category Badge */}
          {product.categories?.name && (
            <div className="absolute top-3 left-3 bg-nebula-violet/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {product.categories.name}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="p-4 md:p-6 flex-1 flex flex-col">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-lg md:text-xl mb-3 text-stellar-white group-hover:text-nebula-hot-pink transition-colors duration-300 line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex-1">
            {/* Difficulty Stars */}
            <div className="flex items-center gap-1 mb-4">
              <span className="text-xs text-stellar-silver/70 mr-2">Difficulty:</span>
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < difficultyStars
                      ? "fill-nebula-gold text-nebula-gold"
                      : "text-stellar-silver/30"
                  }`}
                />
              ))}
            </div>

            {/* Price Section */}
            <div className="mb-4">
              <motion.div 
                className="text-2xl md:text-3xl font-extrabold"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebula-gold via-nebula-amber to-nebula-orange">
                  ${Number(product.price).toFixed(2)}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Stock Information & Actions */}
          <div className="mt-auto space-y-3">
            <div className="text-sm">
              <div className="text-stellar-silver/70">
                {isOutOfStock ? (
                  <span className="text-emerald-500 font-semibold">
                    SOLD!
                  </span>
                ) : isLowStock ? (
                  <span className="text-nebula-amber font-semibold flex items-center gap-1">
                    <motion.div
                      className="w-2 h-2 bg-nebula-amber rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    Only {product.stock} left
                  </span>
                ) : (
                  <span className="text-nebula-cyan">
                    {product.stock} available
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="btn-cosmic flex-1 font-semibold"
                disabled={isOutOfStock}
              >
                <Link href={`/products/${product.id}`}>
                  View Details
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="p-2 border-nebula-hot-pink/50 text-nebula-hot-pink hover:bg-nebula-hot-pink/10 hover:border-nebula-hot-pink transition-all duration-300"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Cosmic Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-nebula-violet via-nebula-hot-pink to-nebula-cyan rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-md -z-10" />
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
      </Card>
    </motion.div>
  );
} 