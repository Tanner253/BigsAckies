"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Youtube, Instagram, Heart } from "lucide-react";
import Link from "next/link";
import HireMeModal from "./HireMeModal";

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
  return (
    <footer className="relative bg-gradient-to-br from-space-black via-space-dark to-space-black border-t border-nebula-violet/20 pt-16 pb-8">
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
        {/* Hire Me Section */}
        <div className="text-center mb-12">
          <HireMeModal />
        </div>

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
    </footer>
  );
} 