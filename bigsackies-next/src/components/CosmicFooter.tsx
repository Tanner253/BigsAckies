"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Youtube, Instagram, Heart, Code, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";
import HireMeModal from "./HireMeModal";
import { Button } from "./ui/button";
import { useState } from "react";

const footerLinks = {
    "Company": [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" }
    ],
    "Legal": [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Shipping & Returns", href: "/shipping" }
    ],
    "Community": [
        { name: "Care Guide", href: "/care-requirements" },
        { name: "Our Reptiles", href: "/products-traditional" }
    ]
};

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/BiggsAckies/", icon: Instagram },
  { name: "YouTube", href: "https://www.youtube.com/@osknyo", icon: Youtube },
  { name: "GitHub", href: "https://github.com/Tanner253", icon: Github },
];

export default function CosmicFooter() {
  const [showHireMeModal, setShowHireMeModal] = useState(false);

  return (
    <footer className="relative bg-gradient-to-br from-space-black via-space-dark to-space-black border-t border-nebula-violet/20">
      {/* Hire Me Banner Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-4 bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-blue-900/80 backdrop-blur-sm border-b border-purple-500/30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-pulse" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
                  <Code className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-base md:text-lg font-bold text-white">
                  Need a Website or App?
                </h2>
                <p className="text-xs md:text-sm text-purple-200">
                  Full-stack developer available for hire • Next.js, React, Unity & more
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowHireMeModal(true)}
              className="relative overflow-hidden group bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 border border-white/20 text-sm w-full md:w-auto mt-2 md:mt-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Hire Me</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Original Footer Content */}
      <div className="pt-16 pb-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(124,58,237,0.1)_1px,_transparent_0)] bg-[length:20px_20px] opacity-20" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-48 h-48 rounded-full opacity-10"
              style={{
                background: `radial-gradient(circle, ${
                  ['#7c3aed', '#db2777', '#06b6d4'][i]
                }40 0%, transparent 70%)`,
                left: `${20 + i * 30}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Footer Links - Centered Layout */}
          <div className="flex flex-col items-center space-y-12">
            {/* Logo and Tagline - Centered */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-cosmic-shimmer mb-4">Biggs Ackies</h2>
              <p className="text-stellar-silver/70 text-lg">Premium, hand-raised reptiles with love.</p>
            </div>

            {/* Links - Centered Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center w-full max-w-4xl">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} className="flex flex-col items-center">
                  <h3 className="font-semibold text-stellar-white mb-4 text-lg">{title}</h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href} 
                          className="text-stellar-silver/70 hover:text-nebula-hot-pink transition-colors text-base"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Social Links - Centered */}
            <div className="flex items-center justify-center space-x-6">
              {socialLinks.map((social) => (
                <motion.a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stellar-silver/70 hover:text-nebula-cyan transition-colors p-3 rounded-full hover:bg-nebula-cyan/10"
                  aria-label={social.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>

            {/* Bottom Section - Centered */}
            <div className="border-t border-nebula-violet/20 pt-8 w-full">
              <div className="flex flex-col items-center space-y-4">
                <p className="text-stellar-silver/60 text-sm text-center">
                  © {new Date().getFullYear()} Biggs Ackies. All rights reserved.
                </p>
                <div className="text-center text-stellar-silver/50 text-sm">
                  Made with <Heart className="inline w-4 h-4 text-nebula-rose mx-1" /> by{" "}
                  <a 
                    href="mailto:percivaltanner@gmail.com" 
                    className="text-nebula-cyan hover:text-nebula-hot-pink transition-colors"
                  >
                    a fellow reptile enthusiast
                  </a>
                </div>
                <div className="text-center text-stellar-silver/40 text-xs">
                  For support, contact us at{" "}
                  <a 
                    href="mailto:percivaltanner@gmail.com" 
                    className="text-nebula-cyan hover:text-nebula-hot-pink transition-colors"
                  >
                    percivaltanner@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HireMeModal 
        isOpen={showHireMeModal} 
        onClose={() => setShowHireMeModal(false)} 
        showButton={false}
      />
    </footer>
  );
} 