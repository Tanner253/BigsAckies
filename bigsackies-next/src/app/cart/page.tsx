"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/components/NotificationSystem";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package, 
  ArrowRight, 
  ShoppingBag,
  Sparkles,
  RefreshCw
} from "lucide-react";

type CartItem = {
  id: number;
  quantity: number;
  products: {
    id: number;
    name: string;
    price: number;
    image_url: string | null;
    stock: number;
    is_animal: boolean;
    male_quantity: number;
    female_quantity: number;
    unknown_quantity: number;
    categories: {
      name: string;
    } | null;
  } | null;
};

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    fetchCartItems();
  }, [session, status, router]);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart");
      if (!res.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await res.json();
      setCartItems(data.cart_items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to load cart items"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(prev => ({ ...prev, [productId]: true }));
    
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update cart");
      }

      // Update local state
      setCartItems(prev => 
        prev.map(item => 
          item.products?.id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      addNotification({
        type: "success",
        title: "Cart Updated",
        message: "Item quantity updated successfully"
      });
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      addNotification({
        type: "error",
        title: "Update Failed",
        message: error.message || "Failed to update quantity"
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId: number) => {
    setIsUpdating(prev => ({ ...prev, [productId]: true }));
    
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to remove item");
      }

      // Update local state
      setCartItems(prev => prev.filter(item => item.products?.id !== productId));

      addNotification({
        type: "success",
        title: "Item Removed",
        message: "Item removed from cart successfully"
      });
    } catch (error: any) {
      console.error("Error removing item:", error);
      addNotification({
        type: "error",
        title: "Remove Failed",
        message: error.message || "Failed to remove item"
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your entire cart?")) return;
    
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/cart/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to clear cart");
      }

      setCartItems([]);
      addNotification({
        type: "success",
        title: "Cart Cleared",
        message: "All items removed from cart"
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      addNotification({
        type: "error",
        title: "Clear Failed",
        message: "Failed to clear cart"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableStock = (product: any) => {
    if (product.is_animal) {
      return (product.male_quantity || 0) + (product.female_quantity || 0) + (product.unknown_quantity || 0);
    }
    return product.stock || 0;
  };

  const subtotal = cartItems.reduce((acc, item) => {
    if (!item.products) return acc;
    return acc + item.quantity * Number(item.products.price);
  }, 0);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-cosmic mb-4" />
          <p className="text-stellar-silver">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-space-gradient opacity-60" />
      <div className="stars opacity-30" />
      <div className="nebula-particles" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-cosmic-shimmer">
            Your Cart
          </h1>
          <p className="text-xl text-stellar-silver/80">
            {totalItems === 0 ? "Your cart awaits cosmic companions" : `${totalItems} items ready for checkout`}
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="card-cosmic p-12 rounded-2xl">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-nebula-cyan to-nebula-blue rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
                <div className="relative bg-gradient-to-r from-nebula-cyan to-nebula-blue p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-stellar-white mb-4">Your cart is empty</h2>
              <p className="text-stellar-silver/70 mb-8">
                Discover amazing reptiles and supplies waiting for you
              </p>
              <Button asChild className="btn-cosmic">
                <Link href="/products">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                </Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Cart Items */
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold gradient-text">Items ({totalItems})</h2>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="border-nebula-crimson/50 text-nebula-crimson hover:bg-nebula-crimson/20 hover:border-nebula-crimson hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              {cartItems.map((item) => {
                if (!item.products) return null;
                
                const product = item.products;
                const availableStock = getAvailableStock(product);
                const isOutOfStock = availableStock === 0;
                const isUpdatingItem = isUpdating[product.id];
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="card-cosmic rounded-xl overflow-hidden border border-nebula-violet/30 hover:border-nebula-magenta/50 transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-nebula-deep-purple/20 to-nebula-violet/20 flex-shrink-0">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-stellar-silver/50" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-stellar-white mb-2">
                            {product.name}
                          </h3>
                          <p className="text-stellar-silver/70 mb-2">
                            {product.categories?.name || "Uncategorized"}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-nebula-gold">
                              ${Number(product.price).toFixed(2)}
                            </span>
                            <span className="text-sm text-stellar-silver/70">
                              {availableStock} available
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdatingItem}
                              className="w-10 h-10 p-0 border-nebula-violet/50 hover:border-nebula-magenta/50 hover:bg-nebula-magenta/20"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            
                            <span className="w-12 text-center text-lg font-medium text-stellar-white">
                              {isUpdatingItem ? (
                                <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(product.id, item.quantity + 1)}
                              disabled={item.quantity >= availableStock || isUpdatingItem}
                              className="w-10 h-10 p-0 border-nebula-violet/50 hover:border-nebula-magenta/50 hover:bg-nebula-magenta/20"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right min-w-[100px]">
                            <p className="text-xl font-bold text-stellar-white">
                              ${(item.quantity * Number(product.price)).toFixed(2)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(product.id)}
                            disabled={isUpdatingItem}
                            className="w-10 h-10 p-0 border-nebula-crimson/50 text-nebula-crimson hover:border-nebula-crimson hover:bg-nebula-crimson/20 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="card-cosmic p-8 rounded-2xl sticky top-8"
              >
                <h3 className="text-2xl font-bold gradient-text mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-stellar-silver">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stellar-silver">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="border-t border-nebula-violet/20 pt-4">
                    <div className="flex justify-between text-xl font-bold text-stellar-white">
                      <span>Total</span>
                      <span className="text-nebula-gold">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full btn-cosmic mb-4">
                  <Link href="/checkout">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Link>
                </Button>

                <div className="text-center">
                  <Link 
                    href="/products" 
                    className="text-nebula-cyan hover:text-nebula-hot-pink transition-colors inline-flex items-center"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 