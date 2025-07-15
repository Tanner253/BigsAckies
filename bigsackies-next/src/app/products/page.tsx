"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Grid, List, Heart, RotateCcw } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";

// Define types for our data for type safety
type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
  categories: { id: number; name: string } | null;
};

type Category = {
  id: number;
  name: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/products-data');
        const { products, categories } = await res.json();
        setProducts(products);
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch products page data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((product) =>
        selectedCategory === "all"
          ? true
          : product.categories?.id.toString() === selectedCategory
      );

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  // Count unique species based on product names
  const uniqueSpecies = useMemo(() => {
    const speciesNames = new Set<string>();
    
    products.forEach(product => {
      const name = product.name.toLowerCase();
      
      // Identify species from product names
      if (name.includes('ackie') || name.includes('monitor')) {
        speciesNames.add('Ackie Monitor');
      } else if (name.includes('ball python') || name.includes('python')) {
        speciesNames.add('Ball Python');
      } else if (name.includes('bearded dragon')) {
        speciesNames.add('Bearded Dragon');
      } else if (name.includes('roach')) {
        // Count different types of roaches as separate species
        if (name.includes('dubia')) {
          speciesNames.add('Dubia Roach');
        } else if (name.includes('hisser') || name.includes('hissing')) {
          speciesNames.add('Hissing Roach');
        } else {
          speciesNames.add('Roach');
        }
      }
    });
    
    return speciesNames.size;
  }, [products]);

  if (isLoading) {
    return <LoadingScreen message="Loading Available Ackies..." />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-cosmic-shimmer">
            Available Ackies
          </h1>
          <p className="text-xl text-stellar-silver/80 max-w-2xl mx-auto mb-8">
            Browse our selection of healthy, captive-bred Red Ackie Monitors and 
            essential supplies for their care
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={statsVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="card-cosmic rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-nebula-hot-pink mb-2">
              {uniqueSpecies}
            </div>
            <div className="text-stellar-silver/70">Species Available</div>
          </div>
          <div className="card-cosmic rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-nebula-cyan mb-2">
              {categories.length}
            </div>
            <div className="text-stellar-silver/70">Categories</div>
          </div>
          <div className="card-cosmic rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-nebula-amber mb-2">
              {products.filter(p => p.stock > 0).length}
            </div>
            <div className="text-stellar-silver/70">Available Now</div>
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          className="card-cosmic rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stellar-silver/50 w-5 h-5" />
              <Input
                placeholder="Search by name or species..."
                className="input-cosmic pl-12 bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <Select onValueChange={setSelectedCategory} defaultValue="all">
                <SelectTrigger className="input-cosmic w-[180px] bg-space-dark/50 border-nebula-violet/30 text-stellar-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-space-dark border-nebula-violet/30">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={setSortBy} defaultValue="name">
                <SelectTrigger className="input-cosmic w-[150px] bg-space-dark/50 border-nebula-violet/30 text-stellar-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-space-dark border-nebula-violet/30">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 pt-4 border-t border-nebula-violet/20">
            <div className="flex items-center justify-between text-sm text-stellar-silver/70">
              <span>Showing {filteredProducts.length} of {products.length} products</span>
              {searchTerm && (
                <span>
                  Results for "<span className="text-nebula-hot-pink">{searchTerm}</span>"
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Products Grid/List */}
        <motion.div
          className={`grid gap-8 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {filteredProducts.map((product) => (
              viewMode === "list" ? (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card-cosmic rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-cosmic transition-all duration-300 group"
                >
                  {/* Large Image for List View */}
                  <div className="relative w-full md:w-80 h-64 md:h-48 rounded-lg overflow-hidden bg-gradient-to-br from-nebula-deep-purple/10 to-nebula-magenta/10 flex-shrink-0">
                    <img
                      src={product.image_url || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.stock === 0 && (
                      <div className="absolute top-3 right-3 bg-nebula-crimson/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-stellar-white mb-2 group-hover:text-nebula-hot-pink transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-stellar-silver/70 mb-4">
                        {product.categories?.name || "Uncategorized"}
                      </p>
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-gold via-nebula-amber to-nebula-orange mb-4">
                        ${Number(product.price).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-stellar-silver/70">
                        {product.stock === 0 ? (
                          <span className="text-nebula-crimson font-semibold">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="text-nebula-cyan">
                            {product.stock} available
                          </span>
                        )}
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="btn-cosmic"
                        disabled={product.stock === 0}
                      >
                        <Link href={`/products/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <ProductCard key={product.id} product={product} />
              )
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-6xl mb-4">🦎</div>
            <h3 className="text-2xl font-bold text-stellar-white mb-2">
              No products found
            </h3>
            <p className="text-stellar-silver/70 mb-6">
              Try adjusting your search or browse our other categories
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="btn-cosmic"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 