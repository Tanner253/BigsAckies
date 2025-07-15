"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogOut, User, ShoppingCart } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-purple to-nebula-pink hover:from-nebula-pink hover:to-nebula-purple transition-all duration-300">
          BigsAckies
        </Link>
        <div className="flex items-center gap-4">
          <Button asChild variant="link" className="text-white text-lg">
            <Link href="/products">Products</Link>
          </Button>
          {isLoading ? (
            <div className="w-24 h-8 bg-secondary/50 animate-pulse rounded-md" />
          ) : session ? (
            <>
              <Button asChild variant="ghost" className="flex items-center gap-2 text-white">
                <Link href="/account/profile">
                  <User size={16} /> {session.user?.name ?? "Account"}
                </Link>
              </Button>
              <Button onClick={() => signOut()} variant="outline" className="flex items-center gap-2 border-nebula-red hover:bg-nebula-red/20 text-white">
                <LogOut size={16} /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-white">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-nebula-purple to-nebula-pink text-white font-bold hover:scale-105 transition-transform duration-300">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
          <Button asChild variant="ghost" size="icon">
            <Link href="/cart">
              <ShoppingCart className="text-white hover:text-nebula-pink transition-colors" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
} 