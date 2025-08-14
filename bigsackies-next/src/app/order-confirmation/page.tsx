"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, Home, Receipt } from "lucide-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-cosmic mb-4" />
          <p className="text-stellar-silver">Processing your order...</p>
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="card-cosmic p-12 rounded-2xl">
            {/* Success Icon */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-2xl opacity-50 animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-cosmic-shimmer">
              Order Confirmed!
            </h1>
            <p className="text-xl text-stellar-silver/80 mb-8">
              Thank you for your purchase! Your cosmic companion is being prepared for its journey to you.
            </p>

            {/* Order Details */}
            {orderId && (
              <div className="bg-space-dark/30 p-6 rounded-lg border border-nebula-violet/20 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Receipt className="w-5 h-5 text-nebula-gold" />
                  <span className="text-lg font-medium text-stellar-white">Order Details</span>
                </div>
                <div className="text-stellar-silver/80">
                  <p>Order ID: <span className="text-nebula-gold font-mono">#{orderId}</span></p>
                  <p className="text-sm mt-2">
                    You will receive an email confirmation shortly with your order details and tracking information.
                  </p>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-nebula-cyan/10 to-nebula-blue/10 p-6 rounded-lg border border-nebula-cyan/20 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-nebula-cyan" />
                <span className="text-lg font-medium text-stellar-white">What's Next?</span>
              </div>
              <div className="text-stellar-silver/80 text-left space-y-2">
                <p>✓ Your order is being processed</p>
                <p>✓ You'll receive shipping confirmation within 24 hours</p>
                <p>✓ Your package will arrive via FedEx Priority Overnight</p>
                <p>✓ Live arrival guarantee ensures your companion's safety</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-cosmic">
                <Link href="/account/orders">
                  <Receipt className="w-5 h-5 mr-2" />
                  View Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-stellar-silver text-stellar-silver hover:bg-stellar-silver/10">
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Return Home
                </Link>
              </Button>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-nebula-violet/20">
              <p className="text-stellar-silver/70 text-sm">
                Need help? Contact us at{" "}
                <a href="mailto:percivaltanner@gmail.com" className="text-nebula-cyan hover:text-nebula-hot-pink">
                  percivaltanner@gmail.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-cosmic mb-4" />
          <p className="text-stellar-silver">Loading...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
} 