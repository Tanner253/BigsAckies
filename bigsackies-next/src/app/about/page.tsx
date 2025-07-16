"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Award, Users, Home, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-space-gradient opacity-60" />
      <div className="stars opacity-30" />
      <div className="nebula-particles" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-cosmic-shimmer">
            Our Story
          </h1>
          <p className="text-xl text-stellar-silver/80 max-w-3xl mx-auto">
            It all started with one extraordinary reptile and a passion for ethical, hands-on breeding.
          </p>
        </motion.div>

        {/* Meet Biggs Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="card-cosmic p-6 rounded-2xl">
              <div className="relative w-full h-auto aspect-[4/3] rounded-lg overflow-hidden mb-6">
                <Image
                  src="/IMG_20240829_141121_408.jpg"
                  alt="Biggs - Our Free-Range Ackie Monitor"
                  layout="fill"
                  objectFit="cover"
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-stellar-white mb-2 text-center">
                Biggs: The Free-Range Genius
              </h3>
              <p className="text-stellar-silver text-center">
                Meet the incredible Ackie Monitor who has mapped our entire house and lives free-range with us.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">The King of the House</h2>
            <p className="text-stellar-silver/90 text-lg leading-relaxed">
              Every great reptile business starts with passion. Ours started with one extraordinary Ackie Monitor named Biggs. His intelligence, personality, and adaptability inspired us to share our love for these animals with the world.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 mt-1 rounded-full bg-gradient-to-br from-nebula-gold to-nebula-orange flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-stellar-white text-lg">Free-Range Intelligence</h4>
                  <p className="text-stellar-silver">Biggs has mapped our entire house, knowing every corner and favorite basking spot.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 mt-1 rounded-full bg-gradient-to-br from-nebula-magenta to-nebula-violet flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-stellar-white text-lg">Potty Training Success</h4>
                  <p className="text-stellar-silver">Believe it or not, Biggs is potty trained, showcasing the incredible intelligence of Ackie Monitors.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* From Egg to Your Home Section */}
        <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 gradient-text">
              From Egg to Your Home
            </h2>
            <p className="text-xl text-stellar-silver/80 max-w-3xl mx-auto">
              We're there from the moment they hatch, ensuring every Ackie Monitor is hand-raised with love and dedication.
            </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }} className="card-cosmic p-6 rounded-xl flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-nebula-gold to-nebula-orange flex items-center justify-center mb-4"><Heart className="w-8 h-8 text-white" /></div>
                <h3 className="text-xl font-bold text-stellar-white mb-2">First Impression Bonding</h3>
                <p className="text-stellar-silver/90">We're present at hatching to be the first thing they smell, creating an immediate bond and sense of safety.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="card-cosmic p-6 rounded-xl flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-nebula-magenta to-nebula-deep-purple flex items-center justify-center mb-4"><Shield className="w-8 h-8 text-white" /></div>
                <h3 className="text-xl font-bold text-stellar-white mb-2">Organic Nutrition</h3>
                <p className="text-stellar-silver/90">We farm our own insects using kitchen scraps, providing the most natural and nutritious diet possible.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="card-cosmic p-6 rounded-xl flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-nebula-cyan to-nebula-blue flex items-center justify-center mb-4"><Users className="w-8 h-8 text-white" /></div>
                <h3 className="text-xl font-bold text-stellar-white mb-2">Full-Time Dedication</h3>
                <p className="text-stellar-silver/90">We dedicate ourselves full-time to taming each animal, ensuring you receive a well-socialized companion.</p>
            </motion.div>
        </div>

        {/* Final CTA Section */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
        >
            <h2 className="text-4xl font-bold mb-6 gradient-text">
              Join the Biggs Ackies Family
            </h2>
            <p className="text-lg text-stellar-silver/80 mb-8">
              Whether you're a seasoned keeper or just starting your journey, we're here to provide you with an exceptional animal and lifetime support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg"
                className="btn-cosmic text-white font-bold text-lg py-4 px-8 rounded-full hover:scale-105 transition-transform duration-300 shadow-cosmic animate-pulse-glow"
              >
                <Link href="/products">
                  <Star className="w-5 h-5 mr-2" />
                  Find Your Reptile
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-stellar-silver text-stellar-silver hover:bg-stellar-silver/10 font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Link href="/contact">
                  Get in Touch
                </Link>
              </Button>
            </div>
        </motion.div>

      </div>
    </div>
  );
} 