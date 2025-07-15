"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative w-full h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center z-10 p-4">
        <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-nebula-purple via-nebula-pink to-nebula-gold drop-shadow-[0_0_15px_rgba(230,0,126,0.5)]">
          BigsAckies Reptiles
        </h1>
        <p className="text-xl md:text-2xl text-purple-200 mt-4 max-w-2xl mx-auto">
          Premium, captive-bred reptiles, delivered directly to you.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="bg-gradient-to-r from-nebula-purple via-nebula-pink to-nebula-gold text-white font-bold text-lg py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg shadow-nebula-pink/30">
            <Link href="/products">
              Explore the Collection
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
