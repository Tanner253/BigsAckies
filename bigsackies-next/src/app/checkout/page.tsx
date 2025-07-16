"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/components/NotificationSystem";
import { 
  CreditCard, 
  MapPin, 
  Package, 
  ShoppingCart, 
  Truck, 
  MessageSquare,
  Lock,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import Image from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Address validation schema
const addressSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  orderNotes: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

type CartItem = {
  id: number;
  quantity: number;
  products: {
    id: number;
    name: string;
    price: number;
    image_url: string | null;
    categories: {
      name: string;
    } | null;
  } | null;
};

function CheckoutForm({ cart, addressData }: { cart: CartItem[], addressData: AddressFormData }) {
  const stripe = useStripe();
  const elements = useElements();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create order first
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: addressData,
          orderNotes: addressData.orderNotes,
          cartItems: cart.map(item => ({
            product_id: item.products?.id,
            quantity: item.quantity,
            price: item.products?.price
          }))
        }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderRes.json();

      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation?order_id=${order.id}`,
        },
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          addNotification({
            type: "error",
            title: "Payment Failed",
            message: error.message || "Please check your payment details"
          });
        } else {
          addNotification({
            type: "error",
            title: "Payment Error",
            message: "An unexpected error occurred. Please try again."
          });
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      addNotification({
        type: "error",
        title: "Checkout Failed",
        message: "An error occurred during checkout. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card-cosmic p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-cyan to-nebula-blue flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold gradient-text">Payment Information</h2>
        </div>
        
        <div className="bg-space-dark/30 p-4 rounded-lg border border-nebula-violet/20">
          <PaymentElement />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full btn-cosmic h-14 text-lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="loading-cosmic" />
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Complete Order
          </div>
        )}
      </Button>

      <p className="text-sm text-stellar-silver/70 text-center">
        By placing your order, you agree to our{" "}
        <a href="/terms" className="text-nebula-cyan hover:text-nebula-hot-pink">Terms of Service</a> and{" "}
        <a href="/privacy" className="text-nebula-cyan hover:text-nebula-hot-pink">Privacy Policy</a>.
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "USA",
    },
  });

  const watchedData = watch();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    fetchCartAndCreatePaymentIntent();
  }, [session, status, router]);

  const fetchCartAndCreatePaymentIntent = async () => {
    try {
      setIsLoading(true);
      
      // Fetch cart items
      const cartRes = await fetch("/api/cart");
      if (!cartRes.ok) {
        throw new Error("Failed to fetch cart");
      }
      
      const cartData = await cartRes.json();
      const cartItems = cartData.cart_items || [];
      
      if (cartItems.length === 0) {
        addNotification({
          type: "error",
          title: "Empty Cart",
          message: "Your cart is empty. Please add items before checkout."
        });
        router.push("/cart");
        return;
      }
      
      setCart(cartItems);
      
      // Create payment intent
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
      });
      
      if (!checkoutRes.ok) {
        throw new Error("Failed to create payment intent");
      }
      
      const checkoutData = await checkoutRes.json();
      setClientSecret(checkoutData.clientSecret);
      
    } catch (error) {
      console.error("Checkout setup error:", error);
      addNotification({
        type: "error",
        title: "Checkout Error",
        message: "Failed to setup checkout. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => {
    if (!item.products) return acc;
    return acc + item.quantity * Number(item.products.price);
  }, 0);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const onAddressSubmit = (data: AddressFormData) => {
    // Address form is valid, payment form will handle the rest
    console.log("Address validated:", data);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-cosmic mb-4" />
          <p className="text-stellar-silver">Setting up your checkout...</p>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#7c3aed',
      colorBackground: '#0f0f23',
      colorText: '#e2e8f0',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
  };

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
            Checkout
          </h1>
          <p className="text-xl text-stellar-silver/80">
            Complete your order for {totalItems} cosmic companion{totalItems !== 1 ? 's' : ''}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Back to Cart */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => router.push("/cart")}
                className="border-nebula-violet/50 text-stellar-silver hover:bg-nebula-violet/20 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            </div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card-cosmic p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-magenta to-nebula-violet flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Shipping Address</h2>
              </div>

              <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-stellar-white">Full Name *</Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      className="input-cosmic"
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-stellar-white">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="input-cosmic"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-stellar-white">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    className="input-cosmic"
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="street" className="text-stellar-white">Street Address *</Label>
                  <Input
                    id="street"
                    {...register("street")}
                    className="input-cosmic"
                    placeholder="123 Main Street"
                  />
                  {errors.street && (
                    <p className="text-red-400 text-sm mt-1">{errors.street.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-stellar-white">City *</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      className="input-cosmic"
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-stellar-white">State *</Label>
                    <Input
                      id="state"
                      {...register("state")}
                      className="input-cosmic"
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zipCode" className="text-stellar-white">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      {...register("zipCode")}
                      className="input-cosmic"
                      placeholder="12345"
                    />
                    {errors.zipCode && (
                      <p className="text-red-400 text-sm mt-1">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="country" className="text-stellar-white">Country *</Label>
                  <Input
                    id="country"
                    {...register("country")}
                    className="input-cosmic"
                    placeholder="USA"
                  />
                  {errors.country && (
                    <p className="text-red-400 text-sm mt-1">{errors.country.message}</p>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Order Notes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card-cosmic p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-orange to-nebula-gold flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Order Notes</h2>
                <span className="text-stellar-silver/70 text-sm">(Optional)</span>
              </div>

              <Textarea
                {...register("orderNotes")}
                placeholder="Any special instructions for your order..."
                className="input-cosmic min-h-[100px]"
              />
            </motion.div>

            {/* Payment Form */}
            {clientSecret && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance,
                  }}
                >
                  <CheckoutForm cart={cart} addressData={watchedData} />
                </Elements>
              </motion.div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card-cosmic p-6 rounded-xl sticky top-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-hot-pink to-nebula-rose flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Order Summary</h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => {
                  if (!item.products) return null;
                  
                  const product = item.products;
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-space-dark/30 rounded-lg">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-nebula-deep-purple/20 to-nebula-violet/20 flex-shrink-0">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-stellar-silver/50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-stellar-white text-sm">{product.name}</h3>
                        <p className="text-stellar-silver/70 text-xs">{product.categories?.name}</p>
                        <p className="text-stellar-silver/70 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-stellar-white">
                          ${(item.quantity * Number(product.price)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-nebula-violet/20">
                <div className="flex justify-between text-stellar-silver">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stellar-silver">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-stellar-white pt-2 border-t border-nebula-violet/20">
                  <span>Total</span>
                  <span className="text-nebula-gold">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-nebula-cyan/10 to-nebula-blue/10 rounded-lg border border-nebula-cyan/20">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-nebula-cyan" />
                  <span className="text-stellar-white font-medium">Free Shipping</span>
                </div>
                <p className="text-stellar-silver/70 text-sm">
                  All orders ship via FedEx Priority Overnight for the safety of your new companion.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 