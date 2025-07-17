"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  LogOut,
  User,
  ShoppingCart,
  Menu,
  X,
  Store,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Close mobile menu on route change
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/products", label: "Shop Ackies", icon: Store },
    { href: "/care-requirements", label: "Care Guide", icon: BookOpen },
  ];

  if (session?.user?.role === "admin") {
    navItems.push({ href: "/admin/dashboard", label: "Admin Panel", icon: LayoutDashboard });
  }

  const NavLinks = ({ isMobile = false }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-base
            ${
              pathname === item.href
                ? "bg-gradient-to-r from-nebula-violet to-nebula-magenta text-white shadow-lg"
                : "text-stellar-silver hover:bg-nebula-violet/20 hover:text-white"
            }
            ${isMobile ? 'w-full' : ''}`}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <>
      <motion.header
        className="fixed top-0 z-50 w-full bg-slate-900/90 backdrop-blur-lg border-b border-nebula-violet/30"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto flex justify-between items-center px-4 h-20">
          <Link href="/" className="text-3xl font-bold gradient-text">
            Biggs Ackies
          </Link>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <nav className="flex items-center gap-2">
              <NavLinks />
            </nav>
            
            <div className="h-8 w-px bg-nebula-violet/30 mx-2"></div>

            {isLoading ? (
              <div className="w-8 h-8 border-2 border-t-transparent border-nebula-violet rounded-full animate-spin"></div>
            ) : session ? (
              <>
                <Button asChild variant="ghost" className="text-stellar-silver hover:text-white">
                  <Link href="/account/profile" className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">{session.user.name}</span>
                  </Link>
                </Button>
                <Button variant="outline" size="icon" className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={() => signOut()}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-stellar-silver hover:text-white">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="btn-cosmic">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/cart">
                <ShoppingCart className="text-stellar-white hover:text-nebula-gold" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/cart">
                    <ShoppingCart className="text-stellar-white hover:text-nebula-gold" />
                </Link>
             </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(true)}
              className="text-stellar-white"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[998] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-0 right-0 h-full w-72 bg-slate-900/95 backdrop-blur-lg border-l border-nebula-violet/30 z-[999] lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full p-4">
                 <div className="flex justify-between items-center pb-4 border-b border-nebula-violet/20">
                    <h2 className="text-xl font-bold gradient-text">Menu</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                        <X className="w-6 h-6 text-stellar-white"/>
                    </Button>
                 </div>

                <nav className="flex-1 mt-6 space-y-2">
                  <NavLinks isMobile />
                </nav>

                <div className="mt-auto space-y-2 pt-4 border-t border-nebula-violet/20">
                    {isLoading ? (
                      <div className="flex justify-center"><div className="w-8 h-8 border-2 border-t-transparent border-nebula-violet rounded-full animate-spin"></div></div>
                    ) : session ? (
                        <>
                            <Button asChild variant="ghost" className="w-full justify-start gap-3">
                                <Link href="/account/profile" className="flex items-center">
                                    <User className="w-5 h-5" />
                                    <span>{session.user.name}</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-3 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={() => signOut()}>
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </Button>
                        </>
                    ) : (
                        <>
                             <Button asChild variant="ghost" className="w-full justify-start gap-3">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild className="w-full btn-cosmic">
                                <Link href="/register">Register</Link>
                            </Button>
                        </>
                    )}
                    <Button asChild variant="ghost" className="w-full justify-start gap-3">
                        <Link href="/cart">
                            <ShoppingCart className="w-5 h-5" />
                            <span>Cart</span>
                        </Link>
                    </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 