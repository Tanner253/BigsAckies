"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "./ui/card";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
  categories: { name: string } | null;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductCard({ product }: { product: Product }) {
  const isLowStock = product.stock <= 5 && product.stock > 0;

  return (
    <motion.div variants={cardVariants} className="h-full">
      <Card className="group relative w-full h-full overflow-hidden rounded-lg bg-card border-2 border-transparent hover:border-nebula-pink transition-all duration-300 flex flex-col">
        <Link href={`/products/${product.id}`} className="block p-4">
          <div className="relative w-full h-48">
            <Image
              src={product.image_url || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="p-4 pt-0 flex flex-col flex-grow">
          <h3 className="font-bold text-lg truncate group-hover:text-nebula-pink transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {product.categories?.name || "Uncategorized"}
          </p>
          <div className="mt-4 flex-grow" />
          <div className="flex items-center justify-between">
            <p className="text-xl font-extrabold text-nebula-gold">
              ${Number(product.price).toFixed(2)}
            </p>
            {product.stock === 0 ? (
                <span className="font-semibold text-destructive">Out of Stock</span>
            ) : isLowStock ? (
              <span className="relative flex items-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-nebula-orange opacity-75"></span>
                <span className="ml-4 text-sm font-semibold text-nebula-orange">Low Stock</span>
              </span>
            ) : (
              <p className="text-sm text-muted-foreground">
                Stock: {product.stock}
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 