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

// --- Types ---
type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
  categories: { id: number; name: string } | null;
  is_animal?: boolean;
  male_quantity?: number;
  female_quantity?: number;
  unknown_quantity?: number;
};

type Category = {
  id: number;
  name: string;
};

type PageStats = {
  species: number;
  categories: number;
  completedOrders: number;
  soldOut: number;
};

// --- Helper Functions ---
const calculateStock = (product: any): number => {
  if (product.is_animal) {
    return (product.male_quantity || 0) + (product.female_quantity || 0) + (product.unknown_quantity || 0);
  }
  return product.stock || 0;
};

const calculateUniqueSpecies = (products: Product[]): number => {
  const speciesNames = new Set<string>();
  products.forEach(product => {
    const name = product.name.toLowerCase();
    if (name.includes('ackie') || name.includes('monitor')) speciesNames.add('Ackie Monitor');
    else if (name.includes('ball python') || name.includes('python')) speciesNames.add('Ball Python');
    else if (name.includes('bearded dragon')) speciesNames.add('Bearded Dragon');
    else if (name.includes('roach')) {
      if (name.includes('dubia')) speciesNames.add('Dubia Roach');
      else if (name.includes('hisser') || name.includes('hissing')) speciesNames.add('Hissing Roach');
      else speciesNames.add('Roach');
    }
  });
  return speciesNames.size;
};


export default function TraditionalProductsPage() {
  // --- State ---
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<PageStats>({
    species: 0,
    categories: 0,
    completedOrders: 0,
    soldOut: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [showSoldOut, setShowSoldOut] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/products-data');
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.statusText}`);
        }
        const data = await res.json();

        const processedProducts = data.products.map((p: any) => ({
          ...p,
          stock: calculateStock(p),
        }));
        
        setProducts(processedProducts);
        setCategories(data.categories || []);

        const soldOutCount = processedProducts.filter((p: Product) => p.stock === 0).length;
        const speciesCount = calculateUniqueSpecies(processedProducts);

        setStats({
          species: speciesCount,
          categories: (data.categories || []).length,
          completedOrders: data.completedOrders || 0,
          soldOut: soldOutCount,
        });

      } catch (error) {
        console.error("Failed to fetch or process products page data", error);
        setProducts([]);
        setCategories([]);
        setStats({ species: 0, categories: 0, completedOrders: 0, soldOut: 0 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Memos for Derived State ---
  const filteredProducts = useMemo(() => {
    let filtered = products
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(p => selectedCategory === "all" || p.categories?.id.toString() === selectedCategory)
      .filter(p => showSoldOut || p.stock > 0);

    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "name":
      default:
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [products, searchTerm, selectedCategory, sortBy, showSoldOut]);

  const sortedCategories = useMemo(() => {
    const getCategoryRank = (categoryName: string): number => {
      const name = categoryName.toLowerCase();
      if (name.includes('reptile') || name.includes('lizard') || name.includes('animal')) return 0;
      if (name.includes('feeder') || name.includes('food')) return 1;
      if (name.includes('enclosure') || name.includes('supply') || name.includes('equipment')) return 2;
      return 3; // Other categories
    };

    return [...categories].sort((a, b) => {
      const rankA = getCategoryRank(a.name);
      const rankB = getCategoryRank(b.name);
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      return a.name.localeCompare(b.name); // Alphabetical sort for categories with the same rank
    });
  }, [categories]);

  // --- Render Logic ---
  if (isLoading) {
    return <LoadingScreen message="Loading Available Ackies..." />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-cosmic-shimmer">
            Traditional Browse
          </h1>
          <p className="text-xl text-stellar-silver/80 max-w-2xl mx-auto mb-8">
            Browse our selection of healthy, captive-bred Red Ackie Monitors and 
            essential supplies for their care - classic style!
          </p>
          <Button asChild size="lg" className="btn-cosmic shadow-cosmic hover:shadow-nebula transition-all duration-300 hover:scale-105">
            <Link href="/products" className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Try Adventure Mode
            </Link>
          </Button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <StatCard value={stats.species} label="Species Available" color="from-nebula-hot-pink to-nebula-rose" />
          <StatCard value={stats.categories} label="Categories" color="from-nebula-cyan to-nebula-blue" />
          <StatCard value={stats.completedOrders} label="Completed Orders" color="from-emerald-400 to-green-400" />
          <StatCard value={stats.soldOut} label="Sold Out" color="from-nebula-amber to-nebula-orange" />
        </motion.div>

        {/* Controls Section */}
        <motion.div
          className="card-cosmic rounded-2xl p-6 mb-8 backdrop-blur-sm border border-nebula-violet/30 hover:border-nebula-hot-pink/50 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stellar-silver/50 w-5 h-5" />
              <Input
                placeholder="Search by name or species..."
                className="input-cosmic pl-12 bg-space-dark/50 border-nebula-violet/30 text-stellar-white placeholder-stellar-silver/50 focus:border-nebula-hot-pink/50 focus:shadow-nebula transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Select onValueChange={setSelectedCategory} defaultValue="all">
                <SelectTrigger className="input-cosmic w-[180px] bg-space-dark/50 border-nebula-violet/30 text-stellar-white hover:border-nebula-hot-pink/50 transition-all duration-300">
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
                <SelectTrigger className="input-cosmic w-[150px] bg-space-dark/50 border-nebula-violet/30 text-stellar-white hover:border-nebula-hot-pink/50 transition-all duration-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-space-dark border-nebula-violet/30">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === "grid" 
                      ? "bg-gradient-to-r from-nebula-violet to-nebula-magenta text-white shadow-lg hover:shadow-xl" 
                      : "border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 hover:border-stellar-silver"
                  }`}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === "list" 
                      ? "bg-gradient-to-r from-nebula-violet to-nebula-magenta text-white shadow-lg hover:shadow-xl" 
                      : "border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 hover:border-stellar-silver"
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>
              <div className="flex items-center">
                <Button
                  variant={showSoldOut ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowSoldOut(!showSoldOut)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    showSoldOut 
                      ? "bg-gradient-to-r from-nebula-orange to-nebula-amber text-white shadow-lg hover:shadow-xl" 
                      : "border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 hover:border-stellar-silver"
                  }`}
                >
                  {showSoldOut ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  {showSoldOut ? "Hide Sold Out" : "Show Sold Out"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid/List */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {selectedCategory === 'all' ? (
                sortedCategories.map(category => {
                  const categoryProducts = filteredProducts.filter(p => p.categories?.id === category.id);
                  if (categoryProducts.length === 0) return null;
                  return (
                    <div key={category.id} className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nebula-violet to-nebula-magenta flex items-center justify-center">
                           <Heart className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-stellar-white">{category.name}</h3>
                         <div className="flex-1 h-px bg-gradient-to-r from-nebula-violet/50 to-transparent" />
                        <span className="text-stellar-silver text-sm">
                          {categoryProducts.length} item{categoryProducts.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                        {categoryProducts.map(product => <ProductCard key={product.id} product={product} />)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                  {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h3 className="text-2xl font-bold text-stellar-white">No products found</h3>
              <p className="text-stellar-silver/70">Try adjusting your filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Sub-components ---
const StatCard = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <motion.div 
    className="card-cosmic rounded-2xl p-6 text-center hover:shadow-cosmic transition-all duration-300 hover:scale-105"
    whileHover={{ y: -5 }}
  >
    <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${color} mb-2`}>
      {value}
    </div>
    <div className="text-stellar-silver/70">{label}</div>
  </motion.div>
); 