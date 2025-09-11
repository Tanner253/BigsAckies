"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Shield, Award, Users, ArrowRight, ChevronDown, Home, Star, Sparkles, Briefcase, Code, Zap, Rocket, DollarSign, Copy, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import HireMeModal from "@/components/HireMeModal";

export default function HomePage() {
  const [showHireMeModal, setShowHireMeModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Contract Address - replace with actual CA when available
  const contractAddress = "LAUNCHING (9/11)"; // Launch date
  
  const copyToClipboard = async () => {
    if (contractAddress === "LAUNCHING (9/11)") return;
    
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Pump Fun Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-8 bg-gradient-to-r from-space-black via-nebula-deep-purple/50 to-space-black backdrop-blur-sm border-b border-green-500/30 overflow-hidden"
      >
        {/* Cosmic Background with Green Accents */}
        <div className="absolute inset-0 bg-space-gradient opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse" />
        
        {/* Stars and Cosmic Elements */}
        <div className="stars opacity-30" />
        
        {/* Floating Elements - More Cosmic */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${5 + i * 8}%`,
                top: `${10 + (i % 4) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 20, 0],
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            >
              {i % 4 === 0 && <div className="w-2 h-2 bg-green-400 rounded-full opacity-60 shadow-lg shadow-green-400/50" />}
              {i % 4 === 1 && <Rocket className="w-4 h-4 text-green-400 opacity-70" />}
              {i % 4 === 2 && <div className="text-lg opacity-50">🦎</div>}
              {i % 4 === 3 && <div className="w-1 h-1 bg-stellar-silver rounded-full opacity-40" />}
            </motion.div>
          ))}
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center space-y-6">
            {/* Main Header with Cosmic Styling */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
              className="flex items-center justify-center gap-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <Rocket className="relative w-8 h-8 md:w-12 md:h-12 text-green-400" />
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-30" />
                <span className="relative text-4xl md:text-6xl">🦎</span>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <DollarSign className="relative w-8 h-8 md:w-12 md:h-12 text-green-400" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl md:text-4xl lg:text-5xl font-bold gradient-text text-center leading-tight"
            >
              This is the animal runner pump is looking for!
            </motion.h1>
            
            {/* Main Content Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Biggs Photo Card - Featured */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="md:col-span-1"
              >
                <div className="card-cosmic p-4 rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
                  <div className="aspect-square bg-gradient-to-br from-nebula-deep-purple/30 to-nebula-magenta/30 rounded-lg overflow-hidden mb-4 border border-green-500/20">
                    <Image
                      src="/IMG_20240829_141121_408.jpg"
                      alt="Biggs - The Original Pump Runner"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-green-400 mb-1">
                      Meet Biggs! 🦎
                    </h3>
                    <p className="text-stellar-silver text-sm">
                      The legendary free-range genius behind it all
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Baby Monitor Lizards Card */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="md:col-span-1"
              >
                <div className="card-cosmic p-6 rounded-xl border border-green-500/20 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <span className="text-xl">🦎</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-stellar-white">
                      Baby Monitors Available!
                    </h3>
                  </div>
                  <div className="space-y-2 text-stellar-silver">
                    <p className="text-lg font-semibold text-green-400">
                      <span className="font-bold text-white">14 in stock</span> 
                      <span className="text-stellar-silver/70"> (7 not listed)</span>
                    </p>
                    <p className="text-sm">
                      Available since <span className="text-green-400 font-medium">September 6th</span>
                    </p>
                    <p className="text-sm text-stellar-silver/80">
                      Hand-raised, premium quality Ackie Monitors ready for loving homes
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Conservation & Tokenomics Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="md:col-span-1"
              >
                <div className="card-cosmic p-6 rounded-xl border border-green-500/20 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-stellar-white">
                      Conservation Mission
                    </h3>
                  </div>
                  <div className="space-y-3 text-stellar-silver">
                    <div className="bg-nebula-deep-purple/20 rounded-lg p-3 border border-purple-500/20">
                      <p className="text-purple-400 font-semibold text-sm mb-1">🏠 80% for Home Breeding</p>
                      <p className="text-xs text-stellar-silver/80">
                        Supporting our home breeding operation and care
                      </p>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                      <p className="text-green-400 font-semibold text-sm mb-1">🌿 20% for Conservation</p>
                      <p className="text-xs text-stellar-silver/80">
                        Creator funds donated to reptile conservation efforts
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Supply Lock Promise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="card-cosmic p-6 rounded-xl border-2 border-green-500/30 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl md:text-2xl font-bold text-green-400">
                    Creator Commitment
                  </h3>
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">10%</span>
                        </div>
                        <p className="text-green-400 font-semibold text-sm">Creator Buy-In</p>
                      </div>
                      <p className="text-stellar-silver text-xs">
                        I will be purchasing <span className="text-white font-semibold">10% of the supply</span> - putting my money where my mouth is!
                      </p>
                    </div>
                    
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-xs">📹</span>
                        </div>
                        <p className="text-purple-400 font-semibold text-sm">Biggs on Stream!</p>
                      </div>
                      <p className="text-stellar-silver text-xs">
                        Biggs will make special <span className="text-white font-semibold">live stream appearances</span> at major market cap milestones!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contract Address Section - Redesigned */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="max-w-md mx-auto"
            >
              <div className="card-cosmic p-4 rounded-xl border border-green-500/30">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Code className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-stellar-white font-semibold">Contract Address</p>
                </div>
                <div className="flex items-center gap-2 bg-space-black/50 rounded-lg p-3 border border-green-500/20">
                  <code className="text-green-400 text-sm flex-1 text-center font-mono">
                    {contractAddress}
                  </code>
                  <Button
                    onClick={copyToClipboard}
                    disabled={contractAddress === "LAUNCHING (9/11)"}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-green-500/10 disabled:opacity-50 border border-green-500/20"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-green-400" />
                    )}
                  </Button>
                </div>
                  {contractAddress === "LAUNCHING (9/11)" && (
                    <p className="text-green-400/70 text-xs mt-2 text-center">Ready for takeoff! 🚀</p>
                  )}
              </div>
            </motion.div>
            
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Button 
                asChild 
                className="btn-cosmic bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 border border-green-500/30"
              >
                <Link href="/products">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Shop Baby Monitors
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300 font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
              >
                <Link href="/about">
                  <Heart className="w-5 h-5 mr-2" />
                  Our Conservation Mission
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Hero Section */}
      <section className="relative h-screen pt-20">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-space-gradient opacity-60" />
        <div className="stars opacity-40" />
        <div className="nebula-particles" />
        
        {/* Floating Orbs - More controlled */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full opacity-10"
              style={{
                background: `radial-gradient(circle, ${
                  ['#7c3aed', '#db2777', '#06b6d4', '#fbbf24'][i]
                }20 0%, transparent 70%)`,
                left: `${20 + i * 25}%`,
                top: `${20 + i * 20}%`,
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        {/* Main Hero Content - Restructured */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="w-full max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center space-y-6"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold gradient-text text-center leading-tight">
                Biggs Ackies
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-stellar-silver text-center max-w-4xl mx-auto leading-relaxed">
                Premium Ackie Monitor reptiles bred with passion, raised with love
              </p>
              
              {/* Action Buttons - Integrated into main content flow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
              >
                <Button 
                  asChild 
                  className="btn-cosmic text-white font-bold text-lg md:text-xl py-4 md:py-6 px-8 md:px-12 rounded-full hover:scale-105 transition-transform duration-300 shadow-cosmic"
                >
                  <Link href="/products?scene=experience">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Find Your Perfect Match
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="btn-cosmic text-white font-bold text-lg md:text-xl py-4 md:py-6 px-8 md:px-12 rounded-full hover:scale-105 transition-transform duration-300 shadow-cosmic"
                >
                  <Link href="/about">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Our Story
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Discover Our Story - Bottom Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="absolute bottom-8 inset-x-0 mx-auto flex flex-col items-center gap-2 text-stellar-silver"
          >
            <p className="text-sm font-medium text-center">Discover Our Story</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center"
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Meet Biggs Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-space-gradient opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 gradient-text">
              Meet Biggs - Our King of the House
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-stellar-silver max-w-3xl mx-auto">
              Every great reptile business starts with passion. Ours started with one extraordinary Ackie Monitor named Biggs.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="card-cosmic p-6 md:p-8 rounded-xl">
                <div className="aspect-video bg-gradient-to-br from-nebula-deep-purple/30 to-nebula-magenta/30 rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/IMG_20240829_141121_408.jpg"
                    alt="Biggs - Our Free-Range Ackie Monitor"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-stellar-white mb-4 text-center">
                  Biggs - Our Free-Range Genius
                </h3>
                <p className="text-stellar-silver text-sm md:text-base text-center">
                  Meet the incredible Ackie Monitor who has mapped our entire house and lives free-range with us
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="card-cosmic p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-gold to-nebula-orange flex items-center justify-center">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-stellar-white">
                      Free-Range Intelligence
                    </h4>
                  </div>
                  <p className="text-stellar-silver text-sm md:text-base">
                    Biggs has mapped our entire house with incredible precision. He knows every corner, every hiding spot, 
                    and has his favorite basking locations throughout the day. His intelligence constantly amazes us.
                  </p>
                </div>
                
                <div className="card-cosmic p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-magenta to-nebula-deep-purple flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-stellar-white">
                      A Capacity for Routine
                    </h4>
                  </div>
                  <p className="text-stellar-silver text-sm md:text-base">
                    Biggs demonstrates a surprising tendency to use consistent spots for his bathroom needs.
                    This level of routine behavior highlights the intelligence and adaptability that make Ackie Monitors extraordinary companions.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* From Egg to Your Home Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-nebula-deep-purple/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 gradient-text">
              From Egg to Your Home
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-stellar-silver max-w-3xl mx-auto">
              We're there from the moment they hatch, ensuring every Ackie Monitor is hand-raised with love and dedication.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="card-cosmic p-6 md:p-8 rounded-xl">
                <div className="aspect-video bg-gradient-to-br from-nebula-orange/30 to-nebula-gold/30 rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/20250414_143219.jpg"
                    alt="Hand-raising baby Ackie Monitors"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-stellar-white mb-4 text-center">
                  Hand-Raised from Day One
                </h3>
                <p className="text-stellar-silver text-sm md:text-base text-center">
                  We're present when they hatch, making us the first thing they smell - creating an unbreakable bond
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="card-cosmic p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-gold to-nebula-orange flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-stellar-white">
                      First Impression Bonding
                    </h4>
                  </div>
                  <p className="text-stellar-silver text-sm md:text-base">
                    We ensure we're present at hatching so we're the first thing they smell. This creates an immediate 
                    bond and helps them associate humans with safety and care from their very first moments.
                  </p>
                </div>
                
                <div className="card-cosmic p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-magenta to-nebula-deep-purple flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-stellar-white">
                      Organic Nutrition
                    </h4>
                  </div>
                  <p className="text-stellar-silver text-sm md:text-base">
                    We farm our own insects using kitchen scraps, providing the most natural and nutritious diet possible. 
                    This ensures optimal health and development for every reptile.
                  </p>
                </div>
                
                <div className="card-cosmic p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-teal to-nebula-blue flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-stellar-white">
                      Full-Time Dedication
                    </h4>
                  </div>
                  <p className="text-stellar-silver text-sm md:text-base">
                    We dedicate ourselves full-time to taming each animal before they go to their new homes. 
                    This means you receive a well-socialized, handleable companion.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Ackies Beat Bearded Dragons Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-space-gradient opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 gradient-text">
              Why Ackies Excel as Companions
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-stellar-silver max-w-3xl mx-auto">
              Discover why Ackie Monitors are a superior choice for an intelligent and engaging reptile companion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-cosmic p-6 md:p-8 rounded-xl h-full">
                <div className="aspect-video bg-gradient-to-br from-nebula-gold/30 to-nebula-orange/30 rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/20250414_143352.jpg"
                    alt="Intelligent Ackie Monitor"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-stellar-white mb-4 text-center">
                  🧠 Superior Intelligence
                </h3>
                <p className="text-stellar-silver text-sm md:text-base text-center">
                  Ackie Monitors are renowned for their problem-solving skills. They show remarkable curiosity and can learn to recognize their keepers and daily routines, making them one of the most intelligent pet lizards.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-cosmic p-6 md:p-8 rounded-xl h-full">
                <div className="aspect-video bg-gradient-to-br from-nebula-magenta/30 to-nebula-deep-purple/30 rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/20250414_144025.jpg"
                    alt="Active Ackie Monitor"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-stellar-white mb-4 text-center">
                  ⚡ Active & Engaging
                </h3>
                <p className="text-stellar-silver text-sm md:text-base text-center">
                  While many reptiles are sedentary, Ackies are constantly active. They are natural foragers who explore, hunt, burrow, and interact with their environment in fascinating ways that are a joy to watch.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-cosmic p-6 md:p-8 rounded-xl h-full">
                <div className="aspect-video bg-nebula-teal/30 rounded-lg flex items-center justify-center text-4xl md:text-6xl mb-6">
                  <Users className="w-12 h-12" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-stellar-white mb-4 text-center">
                  🤝 Social & Communal
                </h3>
                <p className="text-stellar-silver text-sm md:text-base text-center">
                  Unlike many solitary reptiles, Ackies can thrive in small, properly structured groups. Their complex social hierarchies and interactions are a key indicator of their advanced intelligence and behavior.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-cosmic p-6 md:p-8 rounded-xl h-full">
                <div className="aspect-video bg-nebula-blue/30 rounded-lg flex items-center justify-center text-4xl md:text-6xl mb-6">
                  🏹
                </div>
                <h3 className="text-lg md:text-xl font-bold text-stellar-white mb-4 text-center">
                  🏹 Natural Hunters
                </h3>
                <p className="text-stellar-silver text-sm md:text-base text-center">
                  Watching an Ackie hunt is mesmerizing. Their natural hunting instincts, speed, and precision 
                  make feeding time an exciting event rather than a mundane task.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-cosmic p-6 md:p-8 rounded-xl h-full">
                <div className="aspect-video bg-nebula-orange/30 rounded-lg flex items-center justify-center text-4xl md:text-6xl mb-6">
                  🏠
                </div>
                <h3 className="text-lg md:text-xl font-bold text-stellar-white mb-4 text-center">
                  🏡 Manageable Size
                </h3>
                <p className="text-stellar-silver text-sm md:text-base text-center">
                  At 24-30 inches, Ackies are large enough to be impressive but small enough to handle comfortably. 
                  They don't require massive enclosures like larger monitor species.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-cosmic p-6 md:p-8 rounded-xl h-full">
                <div className="aspect-video bg-nebula-deep-purple/30 rounded-lg flex items-center justify-center text-4xl md:text-6xl mb-6">
                  ⭐
                </div>
                <h3 className="text-lg md:text-xl font-bold text-stellar-white mb-4 text-center">
                  🌟 Unique Personalities
                </h3>
                <p className="text-stellar-silver text-sm md:text-base text-center">
                  Each Ackie has a distinct personality. Some are bold explorers, others are cautious observers. 
                  They form genuine bonds with their owners and can live 15-20 years.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Proven Success Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-nebula-deep-purple/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 gradient-text">
              Proven Success
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-stellar-silver max-w-3xl mx-auto">
              Our dedication has led to incredible success stories and growing recognition in the reptile community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="card-cosmic p-6 md:p-8 rounded-xl">
                <div className="aspect-video bg-gradient-to-br from-nebula-gold/30 to-nebula-orange/30 rounded-lg overflow-hidden mb-6">
                  <iframe
                    src="https://www.youtube.com/embed/-76gApybeUo"
                    title="Biggs Ackies at PWN Expo"
                    width="100%"
                    height="100%"
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-stellar-white mb-4 text-center">
                  PWN Expo Success
                </h3>
                <p className="text-stellar-silver text-sm md:text-base text-center">
                  Watch us at the PWN expo, sharing our passion and connecting with fellow reptile enthusiasts
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="card-cosmic p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-gold to-nebula-orange flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-stellar-white">
                      First Clutch Success
                    </h4>
                  </div>
                  <p className="text-stellar-silver text-sm md:text-base">
                    We successfully reared and sold our first full clutch of Ackie Monitors, proving our 
                    breeding program's effectiveness and the quality of our care.
                  </p>
                </div>
                
                <div className="card-cosmic p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-magenta to-nebula-deep-purple flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-stellar-white">
                      Community Recognition
                    </h4>
                  </div>
                  <p className="text-stellar-silver text-sm md:text-base">
                    Our presence at the PWN expo allowed us to connect with other vendors, share knowledge, 
                    and build lasting relationships within the reptile community.
                  </p>
                </div>
                
                <div className="card-cosmic p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-teal to-nebula-blue flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-stellar-white">
                      Customer Satisfaction
                    </h4>
                  </div>
                  <p className="text-stellar-silver text-sm md:text-base">
                    Every customer who has purchased from us has been thrilled with their new companion. 
                    Our hand-raised Ackies adapt quickly to their new homes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-16 md:py-24 bg-space-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 gradient-text">
              Join the Adventure!
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-stellar-silver max-w-3xl mx-auto mb-8">
              Interested in getting involved? Contact me to fund my breeding project for a percentage of equity on sales! 
              I also accept donations to help support the care and keeping of these amazing animals.
            </p>
            <Button 
              asChild 
              className="btn-cosmic text-white font-bold text-lg md:text-xl py-4 md:py-6 px-8 md:px-12 rounded-full hover:scale-105 transition-transform duration-300 shadow-cosmic"
            >
              <Link href="/contact">
                <Heart className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                Get Involved
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-nebula-deep-purple/30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 gradient-text">
              You're Here for a Reason
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-stellar-silver mb-6 md:mb-8">
              Maybe you stumbled upon us while researching reptiles, or perhaps a friend recommended us. 
              Either way, you're meant to be here. We believe every amazing reptile finds their perfect human, 
              and every passionate keeper finds their ideal companion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                className="btn-cosmic text-white font-bold text-lg md:text-xl py-4 md:py-6 px-8 md:px-12 rounded-full hover:scale-105 transition-transform duration-300 shadow-cosmic animate-pulse-glow"
              >
                <Link href="/products?scene=experience">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  Find Your Perfect Match
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="border-stellar-silver text-stellar-silver hover:bg-stellar-silver hover:text-space-black font-semibold text-base px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Link href="/contact">
                  Get in Touch
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <HireMeModal 
        isOpen={showHireMeModal} 
        onClose={() => setShowHireMeModal(false)} 
        showButton={false}
      />
    </div>
  );
}
