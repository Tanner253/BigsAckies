"use client";

import { useState, useEffect, useMemo } from "react";
import prisma from "@/lib/db";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Fetching functions need to be extracted or called in a server component passed down.
// For simplicity in this single file component, we'll fetch via an API route.
async function getProductsAndCategories(): Promise<{ products: Product[], categories: Category[] }> {
    const products = await prisma.products.findMany({
        include: { categories: true },
        orderBy: { created_at: 'desc' }
    });
    const categories = await prisma.categories.findMany();
    const formattedProducts = products.map((p: any) => ({ ...p, price: Number(p.price), stock: Number(p.stock) }));
    return { products: formattedProducts, categories };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((product) =>
        selectedCategory === "all"
          ? true
          : product.categories?.id.toString() === selectedCategory
      );
  }, [products, searchTerm, selectedCategory]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  if (isLoading) {
      return <div className="text-center p-10">Loading Products...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-purple to-nebula-pink">
          Explore the Collection
        </h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search products..."
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select onValueChange={setSelectedCategory} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 