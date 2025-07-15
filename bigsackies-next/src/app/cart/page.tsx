"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type CartItem = {
  id: number;
  quantity: number;
  products: {
    id: number;
    name: string;
    price: number;
    image_url: string | null;
  } | null;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCartItems() {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) {
          throw new Error("Failed to fetch cart items.");
        }
        const data = await res.json();
        setCartItems(data.cart_items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCartItems();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => {
    if (!item.products) return acc;
    return acc + item.quantity * Number(item.products.price);
  }, 0);

  if (isLoading) return <div className="container mx-auto py-12 text-center">Loading cart...</div>;
  if (error) return <div className="container mx-auto py-12 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              item.products && (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-700 rounded-md flex items-center justify-center">
                      <span className="text-gray-400">Image</span>
                    </div>
                    <div>
                      <h2 className="font-semibold">{item.products.name}</h2>
                      <p className="text-gray-400">${Number(item.products.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>Quantity: {item.quantity}</p>
                    <p className="font-bold">Total: ${(item.quantity * Number(item.products.price)).toFixed(2)}</p>
                  </div>
                </div>
              )
            ))}
          </div>
          <div className="bg-gray-800 p-6 rounded-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2 mt-2">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-6">Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
} 