"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  ChevronLeft,
  Menu,
  LogOut,
  Plus,
  Eye,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminShellProps {
  children: React.ReactNode;
  session: Session;
}

export function AdminShell({ children, session }: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/species", label: "Species", icon: Settings },
  ];

  return (
    <div className="relative min-h-screen bg-slate-900 text-stellar-white lg:flex">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-lg border-r border-nebula-violet/30 transition-transform duration-300 ease-in-out z-40 lg:z-auto lg:static lg:h-auto lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full w-64 p-4">
          <div className="text-center py-4 border-b border-nebula-violet/20">
            <h2 className="text-2xl font-bold gradient-text">Admin Panel</h2>
            <p className="text-sm text-stellar-silver/70">
              Welcome back, {session.user?.name}
            </p>
          </div>
          <nav className="flex-1 mt-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 
                  ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-nebula-violet to-nebula-magenta text-white shadow-lg"
                      : "text-stellar-silver hover:bg-nebula-violet/20 hover:text-white"
                  }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-2 pt-4 border-t border-nebula-violet/20">
            <Button variant="outline" className="w-full btn-cosmic" asChild>
                <Link href="/admin/products/new"><Plus className="w-4 h-4 mr-2"/>New Product</Link>
            </Button>
            <Button variant="outline" className="w-full border-nebula-violet/50 text-stellar-silver hover:bg-nebula-violet/20 hover:text-white" asChild>
                <Link href="/" target="_blank"><Eye className="w-4 h-4 mr-2"/>View Site</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:overflow-hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 bg-slate-900/80 backdrop-blur-lg border-b border-nebula-violet/30 p-4 flex items-center justify-between z-30 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-stellar-white hover:bg-nebula-violet/20"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold gradient-text">Admin</h1>
          <div className="w-10"></div>
        </header>
        
        <main className="flex-1 p-4 md:p-8 lg:overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 