"use client";

import { motion } from "framer-motion";
import { Rocket, Star, Sparkles } from "lucide-react";
import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export default function LoadingScreen({ 
  message = "Traveling through the cosmos...", 
  className = "" 
}: LoadingScreenProps) {
  const [orbs, setOrbs] = useState<any[]>([]);

  useEffect(() => {
    const colors = ['#7c3aed', '#db2777', '#ec4899', '#06b6d4', '#fbbf24'];
    const generatedOrbs = [...Array(5)].map((_, i) => ({
      style: {
        background: `radial-gradient(circle, ${colors[i]}30 0%, transparent 70%)`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      },
      animate: {
        x: [0, Math.random() * 100 - 50],
        y: [0, Math.random() * 100 - 50],
        scale: [1, 1.5, 1],
      },
      transition: {
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        repeatType: "reverse" as const,
        delay: i * 0.5,
      },
    }));
    setOrbs(generatedOrbs);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-space-black/95 backdrop-blur-sm ${className}`}>
      <div className="text-center">
        {/* Animated Rocket */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div
              className="text-6xl text-nebula-hot-pink"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Rocket size={64} />
            </motion.div>
            
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-cosmic-shimmer mb-2">
            {message}
          </h2>
          <p className="text-stellar-silver/70">
            Please wait while we prepare your cosmic experience
          </p>
        </motion.div>

        {/* Animated Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-8"
        >
          <div className="w-full max-w-xs h-2 bg-space-dark rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-nebula-violet via-nebula-hot-pink to-nebula-cyan"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Floating Icons */}
        <div className="relative w-32 h-16 mx-auto">
          {[Star, Sparkles, Star].map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute text-nebula-cyan/30"
              style={{
                left: `${index * 40 + 16}px`,
                top: `${Math.sin(index) * 10}px`,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + index * 0.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            >
              <Icon size={20} />
            </motion.div>
          ))}
        </div>

        {/* Spinning Loader */}
        <motion.div
          className="mt-8 mx-auto w-8 h-8 border-2 border-nebula-violet/30 border-t-nebula-hot-pink rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-20"
            style={orb.style}
            animate={orb.animate}
            transition={orb.transition}
          />
        ))}
      </div>
    </div>
  );
} 