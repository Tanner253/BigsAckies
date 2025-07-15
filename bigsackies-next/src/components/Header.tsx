"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogOut, User, ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.header 
      className="fixed top-0 z-50 w-full bg-space-black/90 backdrop-blur-lg border-b border-nebula-violet/30 shadow-cosmic"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <nav className="container mx-auto flex justify-between items-center px-4 py-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href="/" 
            className="text-3xl font-bold text-stellar-white hover:text-nebula-pink transition-all duration-300 relative group"
          >
            <span className="relative z-10">Biggs Ackies</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-nebula-violet/20 via-nebula-magenta/20 to-nebula-hot-pink/20 rounded-lg blur-md"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              asChild 
              variant="ghost" 
              className="text-stellar-white hover:text-nebula-hot-pink hover:bg-nebula-violet/30 transition-all duration-300 font-medium text-lg"
            >
              <Link href="/products">Shop Ackies</Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              asChild 
              variant="ghost" 
              className="text-stellar-white hover:text-nebula-cyan hover:bg-nebula-violet/30 transition-all duration-300 font-medium text-lg"
            >
              <Link href="/care-requirements">Care Guide</Link>
            </Button>
          </motion.div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="loading-cosmic" />
            ) : session ? (
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="flex items-center gap-2 text-stellar-white hover:text-nebula-cyan hover:bg-nebula-violet/30 transition-all duration-300"
                  >
                    <Link href="/account/profile">
                      <User size={18} />
                      <span className="hidden sm:inline text-stellar-white">
                        {session.user?.name ?? "Account"}
                      </span>
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => signOut()} 
                    variant="outline" 
                    className="flex items-center gap-2 border-nebula-crimson/50 text-nebula-crimson hover:bg-nebula-crimson/20 hover:border-nebula-crimson hover:text-white transition-all duration-300"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="text-stellar-white hover:text-nebula-cyan hover:bg-nebula-violet/30 transition-all duration-300 text-lg"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    className="btn-cosmic text-white font-semibold px-6 py-2 rounded-full shadow-nebula text-lg"
                  >
                    <Link href="/register">Register</Link>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              asChild 
              variant="ghost" 
              size="icon" 
              className="relative cosmic-glow p-2 hover:bg-nebula-violet/30 transition-all duration-300"
            >
              <Link href="/cart">
                <ShoppingCart className="text-stellar-white hover:text-nebula-gold transition-colors w-6 h-6" />
                {/* Cart indicator badge */}
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-nebula-crimson rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-stellar-white hover:text-nebula-pink hover:bg-nebula-violet/30 transition-all duration-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-space-dark/95 backdrop-blur-lg border-t border-nebula-violet/20"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button 
                  asChild 
                  variant="ghost" 
                  className="w-full text-left text-stellar-white hover:text-nebula-pink hover:bg-nebula-violet/30 transition-all duration-300 justify-start text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/products">Shop Ackies</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Button 
                  asChild 
                  variant="ghost" 
                  className="w-full text-left text-stellar-white hover:text-nebula-cyan hover:bg-nebula-violet/30 transition-all duration-300 justify-start text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/care-requirements">Care Guide</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  asChild 
                  variant="ghost" 
                  className="w-full text-left text-stellar-white hover:text-nebula-gold hover:bg-nebula-violet/30 transition-all duration-300 justify-start text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/cart" className="flex items-center gap-2">
                    <ShoppingCart size={18} />
                    Cart
                  </Link>
                </Button>
              </motion.div>

              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="loading-cosmic" />
                </div>
              ) : session ? (
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="w-full text-left text-stellar-white hover:text-nebula-cyan hover:bg-nebula-violet/30 transition-all duration-300 justify-start text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/account/profile" className="flex items-center gap-2">
                        <User size={18} />
                        {session.user?.name ?? "Account"}
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button 
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      variant="outline" 
                      className="w-full flex items-center gap-2 border-nebula-crimson/50 text-nebula-crimson hover:bg-nebula-crimson/20 hover:border-nebula-crimson hover:text-white transition-all duration-300 text-lg"
                    >
                      <LogOut size={16} />
                      Logout
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="w-full text-left text-stellar-white hover:text-nebula-cyan hover:bg-nebula-violet/30 transition-all duration-300 text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button 
                      asChild 
                      className="w-full btn-cosmic text-white font-semibold py-3 rounded-full shadow-nebula text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/register">Register</Link>
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
} 