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
import { Search, Filter, Grid, List, Heart, RotateCcw, Sparkles, Eye, EyeOff } from "lucide-react";
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

export default function TraditionalProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [showSoldOut, setShowSoldOut] = useState(false);
  const [completedOrders, setCompletedOrders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/products-data');
        const { products, categories, completedOrders } = await res.json();
        setProducts(products);
        setCategories(categories);
        setCompletedOrders(completedOrders);
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
      )
      .filter((product) =>
        showSoldOut ? true : product.stock > 0
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
  }, [products, searchTerm, selectedCategory, sortBy, showSoldOut]);

  // Sort categories to show Ackies/Lizards first, then Feeders, then rest
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Ackies/Lizards/Reptiles first
      if (aName.includes('ackie') || aName.includes('lizard') || aName.includes('reptile')) {
        if (bName.includes('ackie') || bName.includes('lizard') || bName.includes('reptile')) {
          return a.name.localeCompare(b.name);
        }
        return -1;
      }
      if (bName.includes('ackie') || bName.includes('lizard') || bName.includes('reptile')) {
        return 1;
      }
      
      // Feeders second
      if (aName.includes('feeder') || aName.includes('food')) {
        if (bName.includes('feeder') || bName.includes('food')) {
          return a.name.localeCompare(b.name);
        }
        return -1;
      }
      if (bName.includes('feeder') || bName.includes('food')) {
        return 1;
      }
      
      // Rest alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [categories]);

  // Sort products to show Ackies first
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Ackies first
      if (aName.includes('ackie')) {
        if (bName.includes('ackie')) {
          return a.name.localeCompare(b.name);
        }
        return -1;
      }
      if (bName.includes('ackie')) {
        return 1;
      }
      
      // Other reptiles second
      if (aName.includes('monitor') || aName.includes('python') || aName.includes('dragon') || aName.includes('snake')) {
        if (bName.includes('monitor') || bName.includes('python') || bName.includes('dragon') || bName.includes('snake')) {
          return a.name.localeCompare(b.name);
        }
        return -1;
      }
      if (bName.includes('monitor') || bName.includes('python') || bName.includes('dragon') || bName.includes('snake')) {
        return 1;
      }
      
      // Rest alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [filteredProducts]);

  // Calculate stock statistics
  const stockStats = useMemo(() => {
    const totalProducts = products.length;
    const inStockProducts = products.filter(product => product.stock > 0).length;
    const soldOutProducts = products.filter(product => product.stock === 0).length;
    
    return {
      total: totalProducts,
      inStock: inStockProducts,
      soldOut: soldOutProducts
    };
  }, [products]);

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
            Traditional Browse
          </h1>
          <p className="text-xl text-stellar-silver/80 max-w-2xl mx-auto mb-8">
            Browse our selection of healthy, captive-bred Red Ackie Monitors and 
            essential supplies for their care - classic style!
          </p>
          
          {/* Link to Adventure Mode */}
          <div className="mb-8">
            <Button
              asChild
              size="lg"
              className="btn-cosmic shadow-cosmic hover:shadow-nebula transition-all duration-300 hover:scale-105"
            >
              <Link href="/products" className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Try Adventure Mode
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
          variants={statsVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="card-cosmic rounded-2xl p-4 md:p-6 text-center hover:shadow-cosmic transition-all duration-300 hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-hot-pink to-nebula-rose mb-2">
              {uniqueSpecies}
            </div>
            <div className="text-xs md:text-base text-stellar-silver/70">Species Available</div>
          </motion.div>
          <motion.div 
            className="card-cosmic rounded-2xl p-4 md:p-6 text-center hover:shadow-cosmic transition-all duration-300 hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-cyan to-nebula-blue mb-2">
              {categories.length}
            </div>
            <div className="text-xs md:text-base text-stellar-silver/70">Categories</div>
          </motion.div>
          <motion.div 
            className="card-cosmic rounded-2xl p-4 md:p-6 text-center hover:shadow-cosmic transition-all duration-300 hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">
              {completedOrders}
            </div>
            <div className="text-xs md:text-base text-stellar-silver/70">Completed Orders</div>
          </motion.div>
          <motion.div 
            className="card-cosmic rounded-2xl p-4 md:p-6 text-center hover:shadow-cosmic transition-all duration-300 hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-amber to-nebula-orange mb-2">
              {stockStats.soldOut}
            </div>
            <div className="text-xs md:text-base text-stellar-silver/70">Sold Out</div>
          </motion.div>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          className="card-cosmic rounded-2xl p-4 md:p-6 mb-8 backdrop-blur-sm border border-nebula-violet/30 hover:border-nebula-hot-pink/50 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stellar-silver/50 w-5 h-5" />
              <Input
                placeholder="Search by name or species..."
                className="input-cosmic w-full pl-12 bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-hot-pink/50 focus:shadow-nebula transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:flex md:flex-row md:items-center gap-2 md:gap-3">
              <Select onValueChange={setSelectedCategory} defaultValue="all">
                <SelectTrigger className="input-cosmic w-full md:w-[180px] bg-space-dark/50 border-nebula-violet/30 text-stellar-white hover:border-nebula-hot-pink/50 transition-all duration-300">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-space-dark border-nebula-violet/30">
                  <SelectItem value="all">All Categories</SelectItem>
                  {sortedCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={setSortBy} defaultValue="name">
                <SelectTrigger className="input-cosmic w-full md:w-[150px] bg-space-dark/50 border-nebula-violet/30 text-stellar-white hover:border-nebula-hot-pink/50 transition-all duration-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-space-dark border-nebula-violet/30">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle and Sold Out Toggle */}
              <div className="col-span-2 flex items-center justify-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === "grid" 
                      ? "bg-gradient-to-r from-nebula-violet to-nebula-magenta text-white shadow-lg hover:shadow-xl" 
                      : "border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 hover:border-stellar-silver"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === "list" 
                      ? "bg-gradient-to-r from-nebula-violet to-nebula-magenta text-white shadow-lg hover:shadow-xl" 
                      : "border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 hover:border-stellar-silver"
                  }`}
                >
                  <List className="w-5 h-5" />
                </Button>
                <Button
                  variant={showSoldOut ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowSoldOut(!showSoldOut)}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    showSoldOut 
                      ? "bg-gradient-to-r from-nebula-orange to-nebula-amber text-white shadow-lg hover:shadow-xl" 
                      : "border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 hover:border-stellar-silver"
                  }`}
                >
                  {showSoldOut ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  <span className="truncate">{showSoldOut ? "Hide Sold Out" : "Show Sold Out"}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 pt-4 border-t border-nebula-violet/20">
            <div className="flex items-center justify-between text-sm text-stellar-silver/70">
              <div className="flex items-center gap-4">
                <span>Showing {sortedProducts.length} products</span>
                {!showSoldOut && (
                  <span className="text-nebula-amber">
                    (sold out items hidden)
                  </span>
                )}
              </div>
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {selectedCategory === "all" ? (
              // Show products grouped by category
              sortedCategories.map((category) => {
                const categoryProducts = sortedProducts.filter(
                  product => product.categories?.id === category.id
                );
                
                if (categoryProducts.length === 0) return null;
                
                return (
                  <motion.div
                    key={category.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="mb-12"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nebula-violet to-nebula-magenta flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-stellar-white">
                        {category.name}
                      </h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-nebula-violet/50 to-transparent" />
                      <span className="text-stellar-silver text-sm">
                        {categoryProducts.length} item{categoryProducts.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className={`grid gap-6 ${
                      viewMode === "grid" 
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                    }`}>
                      {categoryProducts.map((product) => (
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
                                <div className="absolute top-3 right-3 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                  SOLD!
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col">
                              <div className="flex-1">
                                <h3 className="text-2xl font-bold text-stellar-white mb-2 group-hover:text-nebula-hot-pink transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-stellar-silver mb-4">
                                  {product.categories?.name || "Uncategorized"}
                                </p>
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-gold via-nebula-amber to-nebula-orange mb-4">
                                  ${Number(product.price).toFixed(2)}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-sm text-stellar-silver">
                                                              {product.stock === 0 ? (
                              <span className="text-emerald-500 font-semibold">
                                SOLD!
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
                    </div>
                  </motion.div>
                );
              })
            ) : (
              // Show products for selected category
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}>
                {sortedProducts.map((product) => (
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
                          <div className="absolute top-3 right-3 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            SOLD!
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-stellar-white mb-2 group-hover:text-nebula-hot-pink transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-stellar-silver mb-4">
                            {product.categories?.name || "Uncategorized"}
                          </p>
                          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-gold via-nebula-amber to-nebula-orange mb-4">
                            ${Number(product.price).toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-stellar-silver">
                                                      {product.stock === 0 ? (
                            <span className="text-emerald-500 font-semibold">
                              SOLD!
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
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {sortedProducts.length === 0 && (
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