"use client";

import prisma from "@/lib/db";
import AddToCartButton from "@/components/AddToCartButton";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  categories: {
    name: string;
  } | null;
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }
    const product: Product = await res.json();
    return product;
  } catch (err: any) {
    console.error(err);
    return null;
  }
}

export default async function ProductDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="container mx-auto py-12 text-center">
        Product not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <span className="text-purple-400 font-semibold">
            {product.categories?.name || "Uncategorized"}
          </span>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-gray-300 text-lg">{product.description}</p>
          <p className="text-3xl font-extrabold text-white">
            ${product.price.toFixed(2)}
          </p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
} 