"use client";

import { motion } from "framer-motion";
import { Truck, Shield, Calendar, Sun, Snowflake, Package, Box, HelpCircle } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-space-gradient opacity-60" />
      <div className="stars opacity-30" />
      <div className="nebula-particles" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-cosmic-shimmer">
            Shipping & Health Guarantee
          </h1>
          <p className="text-xl text-stellar-silver/80 max-w-3xl mx-auto">
            Your new companion's safety is our highest priority. Here’s how we ensure a secure journey from our home to yours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Shipping Process */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold gradient-text">Our Shipping Process</h2>
            <div className="card-cosmic p-6 rounded-xl space-y-4">
              <div className="flex items-start gap-4">
                <Truck size={24} className="text-nebula-cyan mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stellar-white text-lg">FedEx Priority Overnight</h3>
                  <p className="text-stellar-silver">We exclusively use FedEx Priority Overnight to ensure the fastest and safest possible transit time for your animal.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar size={24} className="text-nebula-cyan mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stellar-white text-lg">Strategic Shipping Days</h3>
                  <p className="text-stellar-silver">We only ship on Tuesdays and Wednesdays. This avoids any potential for packages to be delayed over a weekend, which is critical for the animal's well-being.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1"><Sun size={20} className="text-nebula-amber" /><Snowflake size={20} className="text-nebula-blue" /></div>
                <div>
                  <h3 className="font-bold text-stellar-white text-lg">Weather Permitting</h3>
                  <p className="text-stellar-silver">We rigorously check temperatures at our location, the FedEx hub, and your destination. We will only ship when the weather is safe for the animal (typically between 40°F and 90°F).</p>
                </div>
              </div>
               <div className="flex items-start gap-4">
                <Package size={24} className="text-nebula-cyan mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stellar-white text-lg">Secure & Insulated Packaging</h3>
                  <p className="text-stellar-silver">Your reptile is packaged securely in an insulated box with appropriate, phase-22 cryopacks or heat packs based on weather conditions to maintain a stable temperature.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Health Guarantee */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold gradient-text">Live Arrival Guarantee</h2>
            <div className="card-cosmic p-6 rounded-xl space-y-4">
               <div className="flex items-start gap-4">
                <Shield size={24} className="text-nebula-hot-pink mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stellar-white text-lg">Our Commitment</h3>
                  <p className="text-stellar-silver">We guarantee that your reptile will arrive alive and in good health. We take every precaution to make this a reality.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Box size={24} className="text-nebula-hot-pink mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stellar-white text-lg">Your Responsibility</h3>
                  <p className="text-stellar-silver">You must be home to receive the package on the first delivery attempt. If the package is left outside or held at a facility, our guarantee is voided.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <HelpCircle size={24} className="text-nebula-hot-pink mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stellar-white text-lg">In Case of an Issue</h3>
                  <p className="text-stellar-silver">In the extremely rare event of a DOA (Dead on Arrival), you must contact us within one hour of delivery. Clear photos and videos will be required to process a claim. A replacement or full refund will be provided.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
 