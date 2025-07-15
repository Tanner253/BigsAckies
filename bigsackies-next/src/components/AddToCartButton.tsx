"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AddToCartButton({ productId }: { productId: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartMessage, setAddToCartMessage] = useState("");

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/products/${productId}`);
      return;
    }

    setIsAddingToCart(true);
    setAddToCartMessage("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!res.ok) {
        throw new Error("Failed to add to cart.");
      }
      setAddToCartMessage("Item added to cart!");
    } catch (err) {
      setAddToCartMessage("Error adding item to cart.");
    } finally {
      setIsAddingToCart(false);
      setTimeout(() => setAddToCartMessage(""), 3000);
    }
  };

  return (
    <div className="w-full">
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={isAddingToCart}
      >
        {isAddingToCart ? "Adding..." : "Add to Cart"}
      </Button>
      {addToCartMessage && (
        <p className="text-center mt-2">{addToCartMessage}</p>
      )}
    </div>
  );
} 