"use client"

import { motion } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AddressesPage() {
  // Placeholder for addresses. In a real app, you'd fetch this data.
  const addresses: any[] = [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <MapPin className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-stellar-white">My Addresses</h1>
        </div>
        <Button className="btn-cosmic">
            <Plus size={16} className="mr-2" />
            Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center card-cosmic p-8 rounded-xl">
          <MapPin className="mx-auto h-12 w-12 text-stellar-silver/50" />
          <h3 className="mt-4 text-lg font-semibold text-stellar-white">No saved addresses</h3>
          <p className="mt-1 text-sm text-stellar-silver/70">
            Add an address to make checkout faster.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* This is where you would map through saved addresses */}
        </div>
      )}
    </motion.div>
  );
} 