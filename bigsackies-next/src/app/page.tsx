"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Shield, Award, Users, ArrowRight, ChevronDown, Home, Star, Sparkles } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
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
                      Potty Training Success
                    </h4>
                  </div>
                  <p className="text-stellar-silver text-sm md:text-base">
                    Believe it or not, Biggs has learned to use designated areas for his bathroom needs. 
                    This level of intelligence and adaptability is what makes Ackie Monitors extraordinary companions.
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
              Why Ackies Beat Bearded Dragons
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-stellar-silver max-w-3xl mx-auto">
              Discover why Ackie Monitors are the superior choice for intelligent reptile companions
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
                  Ackie Monitors are among the most intelligent reptiles. They can learn routines, recognize their owners, 
                  and even respond to their names. Some can be trained to perform simple behaviors and show genuine curiosity.
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
                  While bearded dragons often sit motionless for hours, Ackies are constantly active and engaging. 
                  They explore, hunt, dig, and interact with their environment in fascinating ways.
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
                  🤝
                </div>
                <h3 className="text-lg md:text-xl font-bold text-stellar-white mb-4 text-center">
                  💪 Hardy & Adaptable
                </h3>
                <p className="text-stellar-silver text-sm md:text-base text-center">
                  Ackies are incredibly hardy reptiles that adapt well to captivity. They're less prone to stress-related 
                  illnesses and can handle temperature variations better than many other reptiles.
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
                  🎯
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
    </div>
  );
}
