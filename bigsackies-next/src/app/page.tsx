"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Shield, Award, Users, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full"
              style={{
                background: `radial-gradient(circle, ${
                  ['#7c3aed', '#db2777', '#ec4899', '#06b6d4', '#fbbf24', '#f59e0b'][i]
                }20 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className="text-7xl md:text-9xl font-extrabold mb-8 leading-[1.1]"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 25%, #ec4899 50%, #fbbf24 75%, #06b6d4 100%)',
                backgroundSize: '400% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Biggs Ackies
            </motion.h1>
            
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p className="text-2xl md:text-3xl text-stellar-silver mb-4 font-light">
                Premium Australian Dwarf Monitor Lizards
              </p>
              <p className="text-lg md:text-xl text-stellar-silver/80 max-w-2xl mx-auto">
                Your trusted source for healthy, captive-bred Red Ackie Monitors 
                and everything you need to care for these intelligent reptiles
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="btn-cosmic text-white font-bold text-lg py-4 px-8 rounded-full hover:scale-105 transition-transform duration-300 shadow-cosmic group"
              >
                <Link href="/products" className="flex items-center gap-3">
                  <Heart className="w-5 h-5 group-hover:animate-pulse" />
                  View Available Ackies
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="cosmic-glow border-2 border-nebula-violet/50 text-stellar-white hover:bg-nebula-violet/20 py-4 px-8 rounded-full backdrop-blur-sm"
              >
                <Link href="/care-requirements" className="flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  Care Guide
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Ackies Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold mb-6 gradient-text">
              About Red Ackie Monitors
            </h2>
            <p className="text-xl text-stellar-silver/80 max-w-2xl mx-auto">
              Discover why these remarkable Australian dwarf monitors make such fascinating and rewarding companions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="card-cosmic rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-stellar-white">
                  Fun Facts About Ackies
                </h3>
                <ul className="space-y-4 text-stellar-silver/80">
                  <li className="flex items-start gap-3">
                    <span className="text-nebula-hot-pink">•</span>
                    <span>Native to Australia, these intelligent lizards can recognize their owners</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nebula-cyan">•</span>
                    <span>Despite their small size (2-3 feet), they're incredibly active and curious</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nebula-gold">•</span>
                    <span>Known for their distinctive spiny tails and beautiful patterns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nebula-violet">•</span>
                    <span>Excellent climbers and diggers, making them fascinating to watch</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nebula-rose">•</span>
                    <span>One of the most popular dwarf monitor species in the hobby</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-nebula-amber">•</span>
                    <span>Can live 15-20 years with proper care</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="card-cosmic rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-3 text-stellar-white">
                  Scientific Name
                </h4>
                <p className="text-stellar-silver/80 italic">
                  Varanus acanthurus
                </p>
              </div>
              <div className="card-cosmic rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-3 text-stellar-white">
                  Size
                </h4>
                <p className="text-stellar-silver/80">
                  24-30 inches (60-75cm) total length
                </p>
              </div>
              <div className="card-cosmic rounded-2xl p-6">
                <h4 className="text-xl font-bold mb-3 text-stellar-white">
                  Lifespan
                </h4>
                <p className="text-stellar-silver/80">
                  15-20 years with proper care
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold mb-6 gradient-text">
              Why Choose Biggs Ackies?
            </h2>
            <p className="text-xl text-stellar-silver/80 max-w-2xl mx-auto">
              Experience the difference of working with passionate reptile experts who care about quality and education
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: "Premium Quality",
                description: "Hand-selected, healthy, captive-bred Ackie monitors from established bloodlines",
                gradient: "from-nebula-violet to-nebula-magenta"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Support",
                description: "Comprehensive care guidance and ongoing support from experienced keepers",
                gradient: "from-nebula-cyan to-nebula-hot-pink"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Health Guarantee",
                description: "All our animals come with health guarantees and detailed care instructions",
                gradient: "from-nebula-amber to-nebula-rose"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card-cosmic rounded-2xl p-8 group hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:animate-pulse`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-stellar-white group-hover:text-nebula-pink transition-colors">
                  {feature.title}
                </h3>
                <p className="text-stellar-silver/80 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 relative">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="holographic-effect rounded-3xl p-12 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Ready to Meet Your New Ackie?
            </h2>
            <p className="text-xl text-stellar-silver/80 mb-8 max-w-2xl mx-auto">
              Browse our available Red Ackie monitors and find your perfect reptilian companion today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="btn-cosmic text-white font-bold text-xl py-6 px-12 rounded-full hover:scale-105 transition-transform duration-300 shadow-cosmic animate-pulse-glow"
              >
                <Link href="/products" className="flex items-center gap-3">
                  <Heart className="w-6 h-6" />
                  Shop Ackies
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="cosmic-glow border-2 border-nebula-violet/50 text-stellar-white hover:bg-nebula-violet/20 py-6 px-12 rounded-full backdrop-blur-sm"
              >
                <Link href="/care-requirements" className="flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  Care Guide
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
