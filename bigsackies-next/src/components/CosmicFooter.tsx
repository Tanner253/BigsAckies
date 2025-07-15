"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart
} from "lucide-react";

export default function CosmicFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "All Products", href: "/products" },
      { name: "Reptiles", href: "/products?category=reptiles" },
      { name: "Feeders", href: "/products?category=feeders" },
      { name: "Supplies", href: "/products?category=supplies" },
    ],
    support: [
      { name: "Care Requirements", href: "/care-requirements" },
      { name: "FAQ", href: "/faq" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Contact Us", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "About Us", href: "/about" },
    ]
  };

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com", color: "text-pink-400" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com", color: "text-red-400" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-space-black via-space-dark to-space-black border-t border-nebula-violet/20">
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

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link href="/" className="inline-block mb-4">
                <motion.div
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nebula-violet via-nebula-magenta to-nebula-hot-pink flex items-center justify-center">
                    <Heart className="text-white" size={16} />
                  </div>
                  <span className="text-xl font-bold text-stellar-white">
                    Biggs Ackies
                  </span>
                </motion.div>
              </Link>
              
              <p className="text-stellar-silver/70 mb-4 text-sm">
                Your premier source for healthy, captive-bred Red Ackie Monitors and reptile supplies. 
                Serving reptile enthusiasts with quality animals and expert advice.
              </p>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-stellar-silver/70 text-sm">
                  <Mail size={14} className="text-nebula-cyan" />
                  <span>percivaltanner@gmail.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Link Sections */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-stellar-white mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-stellar-silver/70 hover:text-nebula-hot-pink transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Media & Bottom */}
        <div className="border-t border-nebula-violet/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-stellar-silver/70 text-sm"
            >
              © {currentYear} Biggs Ackies. All rights reserved.
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-gradient-to-br from-nebula-violet/20 to-nebula-magenta/20 flex items-center justify-center ${social.color} hover:from-nebula-violet/40 hover:to-nebula-magenta/40 transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
} 