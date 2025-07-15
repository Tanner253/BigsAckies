"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Star, Zap, ShoppingCart, Eye } from "lucide-react";
import { Button } from "./ui/button";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
  categories: { name: string } | null;
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const
    }
  }
};

const imageVariants = {
  hover: {
    scale: 1.1,
    rotate: 2,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const
    }
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

export default function ProductCard({ product }: { product: Product }) {
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div 
      variants={cardVariants} 
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="h-full group"
    >
      <Card className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-space-dark/50 via-nebula-deep-purple/20 to-space-void/50 border border-nebula-violet/20 backdrop-blur-sm transition-all duration-500 hover:border-nebula-hot-pink/50 hover:shadow-cosmic flex flex-col">
        {/* Product Image Section */}
        <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-br from-nebula-deep-purple/10 to-nebula-magenta/10">
          <Link href={`/products/${product.id}`} className="block">
            <div className="relative h-56 w-full">
              <motion.div variants={imageVariants}>
                <Image
                  src={product.image_url || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-500"
                />
              </motion.div>
              
              {/* Gradient Overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-space-black/60 via-transparent to-transparent opacity-0"
                variants={overlayVariants}
              />
              
              {/* Hover Actions */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0"
                variants={overlayVariants}
              >
                <Button 
                  size="sm" 
                  className="btn-cosmic text-white font-semibold rounded-full shadow-nebula"
                >
                  <Eye size={16} className="mr-2" />
                  View
                </Button>
                {!isOutOfStock && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-nebula-cyan/50 text-nebula-cyan hover:bg-nebula-cyan/20 rounded-full backdrop-blur-sm"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Add
                  </Button>
                )}
              </motion.div>
            </div>
          </Link>
          
          {/* Stock Status Badge */}
          {isOutOfStock && (
            <div className="absolute top-3 right-3 bg-nebula-crimson/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
              Out of Stock
            </div>
          )}
          
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-3 right-3 bg-nebula-amber/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
              <Zap size={12} />
              Low Stock
            </div>
          )}
          
          {/* Category Badge */}
          {product.categories?.name && (
            <div className="absolute top-3 left-3 bg-nebula-violet/80 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              {product.categories.name}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="p-6 flex-1 flex flex-col">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-xl mb-2 text-stellar-white group-hover:text-nebula-hot-pink transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          {/* Price Section */}
          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                className="text-3xl font-extrabold"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebula-gold via-nebula-amber to-nebula-orange">
                  ${Number(product.price).toFixed(2)}
                </span>
              </motion.div>
              
              {/* Rating Stars (placeholder) */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    className="text-nebula-gold fill-current"
                  />
                ))}
              </div>
            </div>
            
            {/* Stock Information */}
            <div className="text-sm">
              <div className="text-stellar-silver/70">
                {isOutOfStock ? (
                  <span className="text-nebula-crimson font-semibold">
                    Out of Stock
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
                    {product.stock} in stock
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Cosmic Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-nebula-violet via-nebula-hot-pink to-nebula-cyan rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-md -z-10" />
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
      </Card>
    </motion.div>
  );
} 