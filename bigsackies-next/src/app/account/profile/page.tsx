"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Settings, Heart, ShoppingBag, MapPin, Star } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-16 md:pt-24 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-space-gradient opacity-60" />
        <div className="stars opacity-30" />
        <div className="nebula-particles" />
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl mb-4"
          >
            🦎
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-stellar-white mb-4">Loading Your Profile...</h2>
          <div className="loading-cosmic" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen pt-16 md:pt-24 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-space-gradient opacity-60" />
        <div className="stars opacity-30" />
        <div className="nebula-particles" />
        
        <div className="text-center max-w-md mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card-cosmic p-6 md:p-8 rounded-xl"
          >
            <div className="text-5xl md:text-6xl mb-6">🔒</div>
            <h2 className="text-2xl md:text-3xl font-bold text-stellar-white mb-4">Access Denied</h2>
            <p className="text-stellar-silver mb-6 md:mb-8">
              You must be logged in to view your profile.
            </p>
            <Button asChild className="btn-cosmic">
              <Link href="/login">Login to Continue</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 md:pb-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Enhanced Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 gradient-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your Profile
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-stellar-silver max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Manage your account and preferences in your cosmic dashboard
            </motion.p>
          </div>

          {/* Profile Content */}
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="lg:col-span-2"
            >
              <Card className="card-cosmic overflow-hidden">
                <CardHeader className="pb-4 md:pb-6">
                  <CardTitle className="text-xl md:text-2xl font-bold text-stellar-white flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-nebula-violet to-nebula-magenta flex items-center justify-center shadow-cosmic">
                      <User className="text-white" size={20} />
                    </div>
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 md:space-y-8">
                  {/* Profile Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="text-stellar-silver text-sm font-medium mb-2 md:mb-3 block flex items-center gap-2">
                        <User size={16} />
                        Full Name
                      </label>
                      <div className="card-cosmic rounded-lg p-3 md:p-4 transition-all duration-300 hover:shadow-nebula">
                        <p className="text-stellar-white font-medium text-base md:text-lg">
                          {session.user.name || "Not provided"}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-stellar-silver text-sm font-medium mb-2 md:mb-3 block flex items-center gap-2">
                        <Mail size={16} />
                        Email Address
                      </label>
                      <div className="card-cosmic rounded-lg p-3 md:p-4 transition-all duration-300 hover:shadow-nebula">
                        <p className="text-stellar-white font-medium text-base md:text-lg break-all">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="text-stellar-silver text-sm font-medium mb-2 md:mb-3 block flex items-center gap-2">
                      <Star size={16} />
                      Account Type
                    </label>
                    <div className="card-cosmic rounded-lg p-3 md:p-4 transition-all duration-300 hover:shadow-nebula">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-nebula-cyan to-nebula-blue flex items-center justify-center shadow-lg">
                          <Heart className="text-white" size={14} />
                        </div>
                        <div>
                          <span className="text-stellar-white font-medium text-base md:text-lg">
                            Reptile Enthusiast
                          </span>
                          <p className="text-stellar-silver-light text-xs md:text-sm">
                            Premium member with full access
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="pt-4 md:pt-6 border-t border-nebula-violet/20">
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <Button
                        variant="outline"
                        className="cosmic-glow border-nebula-violet/50 text-nebula-violet hover:bg-nebula-violet/20 transition-all duration-300"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="cosmic-glow border-nebula-hot-pink/50 text-nebula-hot-pink hover:bg-nebula-hot-pink/20 transition-all duration-300"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Manage Addresses
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="space-y-4 md:space-y-6"
            >
              {/* Quick Stats */}
              <Card className="card-cosmic">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl font-bold text-stellar-white flex items-center gap-2">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-nebula-gold to-nebula-orange" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-nebula-deep-purple/20 transition-all duration-300 hover:bg-nebula-deep-purple/30">
                    <div className="flex items-center gap-2 md:gap-3">
                      <ShoppingBag className="text-nebula-cyan" size={18} />
                      <span className="text-stellar-silver text-sm md:text-base">Orders</span>
                    </div>
                    <span className="text-nebula-cyan font-bold text-base md:text-lg">0</span>
                  </div>
                  <div className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-nebula-deep-purple/20 transition-all duration-300 hover:bg-nebula-deep-purple/30">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Heart className="text-nebula-hot-pink" size={18} />
                      <span className="text-stellar-silver text-sm md:text-base">Wishlist</span>
                    </div>
                    <span className="text-nebula-hot-pink font-bold text-base md:text-lg">0</span>
                  </div>
                  <div className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-nebula-deep-purple/20 transition-all duration-300 hover:bg-nebula-deep-purple/30">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Calendar className="text-nebula-gold" size={18} />
                      <span className="text-stellar-silver text-sm md:text-base">Member Since</span>
                    </div>
                    <span className="text-nebula-gold font-bold text-base md:text-lg">2024</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="card-cosmic">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl font-bold text-stellar-white flex items-center gap-2">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-nebula-violet to-nebula-magenta" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full cosmic-glow border-nebula-violet/50 text-nebula-violet hover:bg-nebula-violet/20 justify-start transition-all duration-300"
                  >
                    <Link href="/orders" className="flex items-center gap-2 md:gap-3">
                      <ShoppingBag size={16} />
                      <span className="text-sm md:text-base">View Orders</span>
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="w-full cosmic-glow border-nebula-hot-pink/50 text-nebula-hot-pink hover:bg-nebula-hot-pink/20 justify-start transition-all duration-300"
                  >
                    <Link href="/addresses" className="flex items-center gap-2 md:gap-3">
                      <MapPin size={16} />
                      <span className="text-sm md:text-base">Manage Addresses</span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    className="w-full btn-cosmic justify-start transition-all duration-300"
                  >
                    <Link href="/products" className="flex items-center gap-2 md:gap-3">
                      <Heart size={16} />
                      <span className="text-sm md:text-base">Shop Ackies</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 