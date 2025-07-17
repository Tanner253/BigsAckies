"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Crown,
  Sparkles,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Session } from "next-auth";

export function AdminShell({ children, session }: { children: React.ReactNode, session: Session }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, gradient: "from-nebula-violet to-nebula-magenta" },
    { href: "/admin/products", label: "Products", icon: Package, gradient: "from-nebula-cyan to-nebula-blue" },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart, gradient: "from-nebula-orange to-nebula-gold" },
    { href: "/admin/customers", label: "Customers", icon: Users, gradient: "from-nebula-magenta to-nebula-hot-pink" },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare, gradient: "from-nebula-green to-nebula-teal" },
    { href: "/admin/species", label: "Species", icon: Settings, gradient: "from-nebula-deep-purple to-nebula-violet" },
  ];

  const SidebarContent = () => (
    <div className="p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-violet to-nebula-magenta rounded-full blur-lg opacity-50 animate-pulse-glow"></div>
          <div className="relative bg-gradient-to-r from-nebula-violet to-nebula-magenta p-4 rounded-full">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold gradient-text">Admin Panel</h1>
          <p className="text-stellar-silver/80 text-sm">
            Welcome back, {session.user?.name}
          </p>
        </div>
      </div>
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative block"
            onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
          >
            <div className="relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-nebula">
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl`} />
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`} />
              <div className="relative flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-stellar-white font-medium group-hover:text-white transition-colors duration-300">
                  {item.label}
                </span>
                <Sparkles className="w-4 h-4 text-stellar-silver/50 group-hover:text-nebula-gold transition-colors duration-300 ml-auto opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          </Link>
        ))}
      </nav>
      <div className="pt-4 border-t border-nebula-violet/30">
        <h3 className="text-stellar-silver/80 text-sm font-medium mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Button asChild className="w-full btn-cosmic text-sm h-10">
            <Link href="/admin/products/new">
              <Package className="w-4 h-4 mr-2" />
              New Product
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-nebula-violet/50 text-stellar-silver hover:bg-nebula-violet/20 hover:text-white transition-all duration-300">
            <Link href="/">
              <Sparkles className="w-4 h-4 mr-2" />
              View Site
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-space-gradient opacity-80 z-0" />
      <div className="stars opacity-30 z-0" />
      <div className="nebula-particles z-0" />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-5"
            style={{
              background: `radial-gradient(circle, ${['#7c3aed', '#db2777', '#06b6d4'][i]}40 0%, transparent 70%)`,
              left: `${10 + i * 30}%`,
              top: `${10 + i * 25}%`,
              animation: `float ${6 + i * 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen pt-16 md:pt-0">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:w-80 bg-gradient-to-b from-space-dark/80 to-nebula-deep-purple/60 backdrop-blur-xl border-r border-nebula-violet/30 shadow-cosmic">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsSidebarOpen(false)}></div>
          <aside className="relative w-80 h-full bg-gradient-to-b from-space-dark to-nebula-deep-purple shadow-cosmic overflow-y-auto">
            <SidebarContent />
          </aside>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 relative">
          {/* Mobile Header */}
          <header className="md:hidden sticky top-0 z-30 bg-space-dark/80 backdrop-blur-md border-b border-nebula-violet/30 p-4 flex items-center justify-between">
            <Link href="/admin/dashboard" className="text-xl font-bold gradient-text">
              Admin
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </Button>
          </header>
          
          <div className="min-h-screen bg-gradient-to-br from-space-black/50 to-nebula-deep-purple/20 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="relative">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 