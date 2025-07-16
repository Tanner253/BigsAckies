"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, LogIn, Heart, User } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/");
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${
                ['#7c3aed', '#db2777', '#ec4899', '#06b6d4', '#fbbf24', '#f59e0b'][i]
              }40 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-gradient-to-br from-nebula-violet/20 to-nebula-magenta/20 flex items-center justify-center"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <Heart className="text-nebula-hot-pink" size={24} />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full bg-gradient-to-br from-nebula-cyan/20 to-nebula-gold/20 flex items-center justify-center"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <User className="text-nebula-cyan" size={16} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-10 h-10 rounded-full bg-gradient-to-br from-nebula-gold/20 to-nebula-rose/20 flex items-center justify-center"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        >
          <Lock className="text-nebula-gold" size={20} />
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="card-cosmic backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-nebula-violet via-nebula-magenta to-nebula-hot-pink flex items-center justify-center mb-4"
            >
              <LogIn className="text-white" size={32} />
            </motion.div>
            
            <CardTitle className="text-3xl font-bold text-stellar-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-stellar-silver/80">
              Sign in to your Biggs Ackies account to continue your reptile journey
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-nebula-crimson/20 border border-nebula-crimson/50 rounded-lg"
              >
                <p className="text-nebula-crimson text-sm text-center">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-stellar-white">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stellar-silver/50" size={18} />
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your username or email"
                    className="input-cosmic pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-stellar-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stellar-silver/50" size={18} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input-cosmic pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stellar-silver/50 hover:text-nebula-hot-pink transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-cosmic py-6 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="loading-cosmic" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-stellar-silver/70 text-sm">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-nebula-hot-pink hover:text-nebula-pink transition-colors font-medium"
                >
                  Create Account
                </Link>
              </p>
              
              <div className="flex items-center gap-2 text-stellar-silver/50 text-xs">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-nebula-violet/50 to-transparent" />
                <span>Protected by industry-standard encryption</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-nebula-violet/50 to-transparent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 