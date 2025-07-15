"use client";

import { motion } from "framer-motion";
import { Rocket, Star, Sparkles } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export default function LoadingScreen({ 
  message = "Traveling through the cosmos...", 
  className = "" 
}: LoadingScreenProps) {
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
            
            {/* Rocket Trail */}
            <motion.div
              className="absolute top-12 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.div
                className="w-2 h-16 bg-gradient-to-b from-nebula-amber via-nebula-orange to-transparent rounded-full"
                animate={{
                  scaleY: [1, 1.5, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
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
          <div className="w-64 h-2 bg-space-dark rounded-full overflow-hidden">
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
        <div className="relative">
          {[Star, Sparkles, Star].map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute text-nebula-cyan/30"
              style={{
                left: `${index * 30 - 30}px`,
                top: `${Math.sin(index) * 20}px`,
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
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${
                ['#7c3aed', '#db2777', '#ec4899', '#06b6d4', '#fbbf24'][i]
              }30 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
} 