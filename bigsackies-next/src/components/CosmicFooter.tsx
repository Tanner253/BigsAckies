"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Youtube, Instagram, Heart } from "lucide-react";
import Link from "next/link";

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
  { name: "Instagram", href: "https://www.instagram.com/biggs_ackies/", icon: Instagram },
  { name: "YouTube", href: "https://www.youtube.com/@BiggsAckies", icon: Youtube },
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo and Tagline */}
          <div className="col-span-2 lg:col-span-1 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-cosmic-shimmer mb-2">Biggs Ackies</h2>
            <p className="text-stellar-silver/70 text-sm">Premium, hand-raised reptiles with love.</p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-stellar-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-stellar-silver/70 hover:text-nebula-hot-pink transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-nebula-violet/20 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-stellar-silver/60 text-sm mb-4 sm:mb-0">
            © {new Date().getFullYear()} Biggs Ackies. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <a 
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stellar-silver/70 hover:text-nebula-cyan transition-colors"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        <div className="text-center text-stellar-silver/50 text-xs mt-4">
          Made with <Heart className="inline w-3 h-3 text-nebula-rose" /> by a fellow reptile enthusiast.
        </div>
      </div>
    </footer>
  );
} 