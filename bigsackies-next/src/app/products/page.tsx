"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Star, 
  Shield, 
  Zap,
  Users,
  Home,
  Utensils,
  Baby,
  Award,
  RefreshCw,
  Calendar,
  SkipForward
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';

// Define types
type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
  categories: { id: number; name: string } | null;
};

type UserChoices = {
  experienceLevel: 'beginner' | 'intermediate' | 'expert' | null;
  lookingFor: 'live-animals' | 'supplies' | 'food' | 'everything' | null;
  animalType: 'monitor' | 'python' | 'dragon' | 'any' | null;
  budget: 'low' | 'medium' | 'high' | 'any' | null;
};

type Scene = 'welcome' | 'experience' | 'category' | 'animal-type' | 'budget' | 'swipe' | 'results';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene>('welcome');
  const [userChoices, setUserChoices] = useState<UserChoices>({
    experienceLevel: null,
    lookingFor: null,
    animalType: null,
    budget: null
  });
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handle URL parameters
  useEffect(() => {
    const sceneParam = searchParams.get('scene');
    if (sceneParam && ['welcome', 'experience', 'category', 'animal-type', 'budget', 'swipe', 'results'].includes(sceneParam)) {
      setCurrentScene(sceneParam as Scene);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
          const res = await fetch('/api/products-data');
          const { products } = await res.json();
          
          const productsWithCalculatedStock = products.map((p: any) => ({
            ...p,
            stock: p.is_animal 
              ? (p.male_quantity || 0) + (p.female_quantity || 0) + (p.unknown_quantity || 0)
              : (p.stock || 0),
          }));

          setProducts(productsWithCalculatedStock);
        } catch (error) {
        console.error("Failed to fetch products", error);
        } finally {
          setIsLoading(false);
        }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    console.log('Filtering products:', {
      totalProducts: products.length,
      userChoices,
      availableCategories: [...new Set(products.map(p => p.categories?.name).filter(Boolean))]
    });

    if (userChoices.experienceLevel === 'beginner') {
      filtered = filtered.filter(p => {
        const name = p.name.toLowerCase();
        // Beginner-friendly animals and essential supplies
        return name.includes('ball python') || name.includes('bearded dragon') || 
               name.includes('dubia roach') || name.includes('enclosure') || name.includes('heat') ||
               name.includes('light');
      });
    }

    // Filter based on user choices - made more flexible
    if (userChoices.lookingFor === 'live-animals') {
      // More flexible category matching for live animals
      filtered = filtered.filter(p => {
        const categoryName = p.categories?.name?.toLowerCase() || '';
        return categoryName.includes('reptile') || 
               categoryName.includes('lizard') || 
               categoryName.includes('animal') ||
               categoryName.includes('monitor') ||
               categoryName.includes('python') ||
               categoryName.includes('dragon') ||
               // Also check product names for animal indicators
               p.name.toLowerCase().includes('ackie') ||
               p.name.toLowerCase().includes('monitor') ||
               p.name.toLowerCase().includes('python') ||
               p.name.toLowerCase().includes('dragon') ||
               p.name.toLowerCase().includes('snake') ||
               p.name.toLowerCase().includes('lizard');
      });
      console.log('After live-animals filter:', filtered.length);
    } else if (userChoices.lookingFor === 'supplies') {
      // More flexible category matching for supplies
      filtered = filtered.filter(p => {
        const categoryName = p.categories?.name?.toLowerCase() || '';
        const productName = p.name.toLowerCase();
        return categoryName.includes('enclosure') || 
               categoryName.includes('accessory') || 
               categoryName.includes('accessor') ||
               categoryName.includes('heating') || 
               categoryName.includes('lighting') ||
               categoryName.includes('supply') ||
               categoryName.includes('supplies') ||
               categoryName.includes('equipment') ||
               productName.includes('tank') ||
               productName.includes('terrarium') ||
               productName.includes('enclosure') ||
               productName.includes('light') ||
               productName.includes('heat') ||
               productName.includes('substrate');
      });
      console.log('After supplies filter:', filtered.length);
    } else if (userChoices.lookingFor === 'food') {
      // More flexible category matching for food
      filtered = filtered.filter(p => {
        const categoryName = p.categories?.name?.toLowerCase() || '';
        const productName = p.name.toLowerCase();
        return categoryName.includes('feeder') || 
               categoryName.includes('food') ||
               categoryName.includes('feed') ||
               productName.includes('roach') ||
               productName.includes('cricket') ||
               productName.includes('worm') ||
               productName.includes('food') ||
               productName.includes('feeder');
      });
      console.log('After food filter:', filtered.length);
    }
    // If 'everything' is selected, don't filter by category

    // Animal type filtering - only apply if looking for live animals
    if (userChoices.lookingFor === 'live-animals' && userChoices.animalType && userChoices.animalType !== 'any') {
      if (userChoices.animalType === 'monitor') {
        filtered = filtered.filter(p => {
          const productName = p.name.toLowerCase();
          return productName.includes('ackie') || 
                 productName.includes('monitor') ||
                 productName.includes('varanus');
        });
      } else if (userChoices.animalType === 'python') {
        filtered = filtered.filter(p => {
          const productName = p.name.toLowerCase();
          return productName.includes('python') || 
                 productName.includes('ball') ||
                 productName.includes('royal');
        });
      } else if (userChoices.animalType === 'dragon') {
        filtered = filtered.filter(p => {
          const productName = p.name.toLowerCase();
          return productName.includes('dragon') || 
                 productName.includes('bearded') ||
                 productName.includes('pogona');
        });
      }
      console.log('After animal type filter:', filtered.length);
    }

    // Budget filtering - only apply if budget is not 'any'
    if (userChoices.budget && userChoices.budget !== 'any') {
      if (userChoices.budget === 'low') {
        filtered = filtered.filter(p => p.price < 300);
      } else if (userChoices.budget === 'medium') {
        filtered = filtered.filter(p => p.price >= 300 && p.price < 600);
      } else if (userChoices.budget === 'high') {
        filtered = filtered.filter(p => p.price >= 600);
      }
      console.log('After budget filter:', filtered.length);
    }

    // Always filter out products with no stock
    const finalFiltered = filtered.filter(p => p.stock > 0);
    console.log('Final filtered products:', finalFiltered.length);
    
    return finalFiltered;
  }, [products, userChoices]);

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentProduct = filteredProducts[currentProductIndex];
    
    if (direction === 'right' && currentProduct) {
      setLikedProducts(prev => [...prev, currentProduct]);
    }

    if (currentProductIndex < filteredProducts.length - 1) {
      setCurrentProductIndex(prev => prev + 1);
    } else {
      setCurrentScene('results');
    }
  };

  const resetJourney = () => {
    setCurrentScene('welcome');
    setUserChoices({
      experienceLevel: null,
      lookingFor: null,
      animalType: null,
      budget: null
    });
    setCurrentProductIndex(0);
    setLikedProducts([]);
  };

  const nextScene = () => {
    const scenes: Scene[] = ['welcome', 'experience', 'category', 'animal-type', 'budget', 'swipe'];
    const currentIndex = scenes.indexOf(currentScene);
    
    if (currentScene === 'budget') {
      setCurrentScene('swipe');
      setCurrentProductIndex(0);
    } else if (currentScene === 'category' && userChoices.lookingFor !== 'live-animals') {
      // Skip animal type selection if not looking for live animals
      setCurrentScene('budget');
    } else if (currentIndex < scenes.length - 1) {
      setCurrentScene(scenes[currentIndex + 1]);
    }
  };

  const skipToTraditional = () => {
    window.location.href = '/products-traditional';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-space-gradient opacity-60" />
        <div className="stars opacity-30" />
        <div className="nebula-particles" />
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-4"
          >
            🦎
          </motion.div>
          <h2 className="text-3xl font-bold text-stellar-white mb-4">Loading Your Adventure...</h2>
          <div className="loading-cosmic" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-24 pb-8 md:pb-12 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-space-gradient opacity-60" />
      <div className="stars opacity-40" />
      <div className="nebula-particles" />
      
      {/* Improved Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Fewer, more controlled orbs */}
        <motion.div
          className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full opacity-15 top-20 left-10"
          style={{
            background: 'radial-gradient(circle, #7c3aed30 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full opacity-10 top-1/2 right-10"
          style={{
            background: 'radial-gradient(circle, #db277730 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <AnimatePresence mode="wait">
          {/* Welcome Scene */}
          {currentScene === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl md:text-8xl mb-6"
              >
                🦎
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
                Your Reptile Adventure Begins!
              </h1>
              <p className="text-lg md:text-xl text-stellar-silver mb-8 max-w-2xl mx-auto">
                Let's find your perfect scaly companion through an epic journey of discovery! 
                Answer a few fun questions and we'll match you with the ideal reptile or supplies.
              </p>
              <Button
                onClick={nextScene}
                size="lg"
                className="btn-cosmic text-white font-bold text-lg md:text-xl py-4 md:py-6 px-8 md:px-12 rounded-full hover:scale-105 transition-transform duration-300 shadow-cosmic animate-pulse-glow"
              >
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                Start My Adventure
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
              </Button>
              
              {/* Footer with Skip Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-12 pt-8 border-t border-stellar-silver/20"
              >
                <div className="flex justify-center items-center gap-4">
                  <span className="text-stellar-silver/70 text-sm">
                    Prefer traditional browsing?
                  </span>
                  <Button
                    onClick={skipToTraditional}
                    variant="outline"
                    size="sm"
                    className="border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 font-medium text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip Adventure
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Experience Level Scene */}
          {currentScene === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="text-center max-w-6xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
                What's Your Reptile Experience Level?
              </h2>
              <p className="text-base md:text-lg text-stellar-silver mb-8 md:mb-12">
                This helps us recommend the perfect match for your skill level!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[
                  { 
                    level: 'beginner' as const, 
                    icon: <Baby className="w-6 h-6 md:w-8 md:h-8" />, 
                    title: 'Beginner', 
                    desc: 'New to reptiles, ready to learn!',
                    gradient: 'from-nebula-cyan to-nebula-blue'
                  },
                  { 
                    level: 'intermediate' as const, 
                    icon: <Users className="w-6 h-6 md:w-8 md:h-8" />, 
                    title: 'Intermediate', 
                    desc: 'Some experience, want to expand!',
                    gradient: 'from-nebula-violet to-nebula-magenta'
                  },
                  { 
                    level: 'expert' as const, 
                    icon: <Award className="w-6 h-6 md:w-8 md:h-8" />, 
                    title: 'Expert', 
                    desc: 'Seasoned keeper, bring on the challenge!',
                    gradient: 'from-nebula-amber to-nebula-orange'
                  }
                ].map((option) => (
                  <motion.div
                    key={option.level}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`card-cosmic p-6 md:p-8 cursor-pointer transition-all duration-300 hover:shadow-cosmic group ${
                        userChoices.experienceLevel === option.level ? 'ring-2 ring-nebula-hot-pink' : ''
                      }`}
                      onClick={() => {
                        setUserChoices(prev => ({ ...prev, experienceLevel: option.level }));
                        setTimeout(nextScene, 500);
                      }}
                    >
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:animate-pulse`}>
                        <div className="text-white">
                          {option.icon}
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-stellar-white mb-2">
                        {option.title}
                      </h3>
                      <p className="text-stellar-silver text-sm md:text-base">
                        {option.desc}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Footer with Skip Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-12 pt-8 border-t border-stellar-silver/20"
              >
                <div className="flex justify-center items-center gap-4">
                  <span className="text-stellar-silver/70 text-sm">
                    Want to browse products directly?
                  </span>
                  <Button
                    onClick={skipToTraditional}
                    variant="outline"
                    size="sm"
                    className="border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 font-medium text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip Adventure
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Category Scene */}
          {currentScene === 'category' && (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="text-center max-w-6xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
                What Are You Looking For?
              </h2>
              <p className="text-base md:text-lg text-stellar-silver mb-8 md:mb-12">
                Choose your quest type and let's find exactly what you need!
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { 
                    type: 'live-animals' as const, 
                    icon: <Heart className="w-6 h-6 md:w-8 md:h-8" />, 
                    title: 'Live Animals', 
                    desc: 'Find your new scaly friend!',
                    gradient: 'from-nebula-hot-pink to-nebula-rose'
                  },
                  { 
                    type: 'supplies' as const, 
                    icon: <Home className="w-6 h-6 md:w-8 md:h-8" />, 
                    title: 'Supplies', 
                    desc: 'Enclosures, heating, lighting',
                    gradient: 'from-nebula-violet to-nebula-blue'
                  },
                  { 
                    type: 'food' as const, 
                    icon: <Utensils className="w-6 h-6 md:w-8 md:h-8" />, 
                    title: 'Food', 
                    desc: 'Feeders and nutrition',
                    gradient: 'from-nebula-amber to-nebula-orange'
                  },
                  { 
                    type: 'everything' as const, 
                    icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />, 
                    title: 'Everything', 
                    desc: 'Show me all the goods!',
                    gradient: 'from-nebula-cyan to-nebula-magenta'
                  }
                ].map((option) => (
                  <motion.div
                    key={option.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`card-cosmic p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-cosmic group ${
                        userChoices.lookingFor === option.type ? 'ring-2 ring-nebula-hot-pink' : ''
                      }`}
                      onClick={() => {
                        setUserChoices(prev => ({ ...prev, lookingFor: option.type }));
                        setTimeout(nextScene, 500);
                      }}
                    >
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-3 md:mb-4 mx-auto group-hover:animate-pulse`}>
                        <div className="text-white">
                          {option.icon}
                        </div>
                      </div>
                      <h3 className="text-sm md:text-lg font-bold text-stellar-white mb-1 md:mb-2">
                        {option.title}
                      </h3>
                      <p className="text-xs md:text-sm text-stellar-silver">
                        {option.desc}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Footer with Skip Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-12 pt-8 border-t border-stellar-silver/20"
              >
                <div className="flex justify-center items-center gap-4">
                  <span className="text-stellar-silver/70 text-sm">
                    Want to browse products directly?
                  </span>
                  <Button
                    onClick={skipToTraditional}
                    variant="outline"
                    size="sm"
                    className="border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 font-medium text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip Adventure
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Animal Type Scene */}
          {currentScene === 'animal-type' && userChoices.lookingFor === 'live-animals' && (
            <motion.div
              key="animal-type"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="text-center max-w-6xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
                Which Species Calls to You?
              </h2>
              <p className="text-base md:text-lg text-stellar-silver mb-8 md:mb-12">
                Each species has its own unique personality and care requirements!
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { 
                    type: 'monitor' as const, 
                    title: 'Ackie Monitors', 
                    desc: 'Intelligent, active, personality-packed!',
                    emoji: '🦎',
                    gradient: 'from-nebula-hot-pink to-nebula-rose'
                  },
                  { 
                    type: 'python' as const, 
                    title: 'Ball Pythons', 
                    desc: 'Calm, beautiful, perfect for beginners',
                    emoji: '🐍',
                    gradient: 'from-nebula-violet to-nebula-blue'
                  },
                  { 
                    type: 'dragon' as const, 
                    title: 'Bearded Dragons', 
                    desc: 'Social, hardy, great personalities',
                    emoji: '🐲',
                    gradient: 'from-nebula-amber to-nebula-orange'
                  },
                  { 
                    type: 'any' as const, 
                    title: 'Surprise Me!', 
                    desc: 'Open to any amazing species',
                    emoji: '✨',
                    gradient: 'from-nebula-cyan to-nebula-magenta'
                  }
                ].map((option) => (
                  <motion.div
                    key={option.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`card-cosmic p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-cosmic group ${
                        userChoices.animalType === option.type ? 'ring-2 ring-nebula-hot-pink' : ''
                      }`}
                      onClick={() => {
                        setUserChoices(prev => ({ ...prev, animalType: option.type }));
                        setTimeout(nextScene, 500);
                      }}
                    >
                      <div className="text-3xl md:text-4xl mb-3 md:mb-4">
                        {option.emoji}
                      </div>
                      <h3 className="text-sm md:text-lg font-bold text-stellar-white mb-1 md:mb-2">
                        {option.title}
                      </h3>
                      <p className="text-xs md:text-sm text-stellar-silver">
                        {option.desc}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Footer with Skip Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-12 pt-8 border-t border-stellar-silver/20"
              >
                <div className="flex justify-center items-center gap-4">
                  <span className="text-stellar-silver/70 text-sm">
                    Want to browse products directly?
                  </span>
                  <Button
                    onClick={skipToTraditional}
                    variant="outline"
                    size="sm"
                    className="border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 font-medium text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip Adventure
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Budget Scene */}
          {currentScene === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="text-center max-w-6xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
                What's Your Budget Range?
              </h2>
              <p className="text-base md:text-lg text-stellar-silver mb-8 md:mb-12">
                We'll show you the best options within your price range!
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { 
                    range: 'low' as const, 
                    title: 'Under $300', 
                    desc: 'Budget-friendly options',
                    icon: '💰',
                    gradient: 'from-nebula-cyan to-nebula-blue'
                  },
                  { 
                    range: 'medium' as const, 
                    title: '$300 - $600', 
                    desc: 'Mid-range quality',
                    icon: '💎',
                    gradient: 'from-nebula-violet to-nebula-magenta'
                  },
                  { 
                    range: 'high' as const, 
                    title: '$600+', 
                    desc: 'Premium selections',
                    icon: '👑',
                    gradient: 'from-nebula-amber to-nebula-orange'
                  },
                  { 
                    range: 'any' as const, 
                    title: 'Any Budget', 
                    desc: 'Show me everything!',
                    icon: '🌟',
                    gradient: 'from-nebula-hot-pink to-nebula-rose'
                  }
                ].map((option) => (
                  <motion.div
                    key={option.range}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`card-cosmic p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-cosmic group ${
                        userChoices.budget === option.range ? 'ring-2 ring-nebula-hot-pink' : ''
                      }`}
                      onClick={() => {
                        setUserChoices(prev => ({ ...prev, budget: option.range }));
                        setTimeout(nextScene, 500);
                      }}
                    >
                      <div className="text-3xl md:text-4xl mb-3 md:mb-4">
                        {option.icon}
                      </div>
                      <h3 className="text-sm md:text-lg font-bold text-stellar-white mb-1 md:mb-2">
                        {option.title}
                      </h3>
                      <p className="text-xs md:text-sm text-stellar-silver">
                        {option.desc}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Footer with Skip Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-12 pt-8 border-t border-stellar-silver/20"
              >
                <div className="flex justify-center items-center gap-4">
                  <span className="text-stellar-silver/70 text-sm">
                    Want to browse products directly?
                  </span>
                  <Button
                    onClick={skipToTraditional}
                    variant="outline"
                    size="sm"
                    className="border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 font-medium text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip Adventure
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Improved Swipe Scene */}
          {currentScene === 'swipe' && filteredProducts.length > 0 && (
            <motion.div
              key="swipe"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-2xl md:text-4xl font-bold gradient-text mb-4">
                Swipe to Find Your Match!
              </h2>
              <p className="text-base md:text-lg text-stellar-silver mb-6 md:mb-8">
                ❤️ Right for "YES!" • ❌ Left for "Not for me"
              </p>
              
              {/* Responsive card container */}
              <div className="relative w-full max-w-sm mx-auto mb-6 md:mb-8" style={{ height: 'min(70vh, 500px)' }}>
        <AnimatePresence>
                  {filteredProducts[currentProductIndex] && (
                    <motion.div
                      key={filteredProducts[currentProductIndex].id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(_, info: PanInfo) => {
                        if (info.offset.x > 100) {
                          handleSwipe('right');
                        } else if (info.offset.x < -100) {
                          handleSwipe('left');
                        }
                      }}
                      className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    >
                      <Card className="card-cosmic h-full p-4 md:p-6 flex flex-col">
                        <div className="relative flex-1 rounded-lg overflow-hidden mb-4">
                          <Image
                            src={filteredProducts[currentProductIndex].image_url || "/placeholder.png"}
                            alt={filteredProducts[currentProductIndex].name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-shrink-0 space-y-3 md:space-y-4">
                          <h3 className="text-lg md:text-xl font-bold text-stellar-white leading-tight">
                            {filteredProducts[currentProductIndex].name}
                          </h3>
                          <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-gold to-nebula-orange">
                            ${filteredProducts[currentProductIndex].price}
                          </p>
                          <div className="flex justify-center gap-4">
                            <Button
                              onClick={() => handleSwipe('left')}
                              variant="outline"
                              size="lg"
                              className="border-nebula-crimson text-nebula-crimson hover:bg-nebula-crimson/20 transition-all duration-300"
                            >
                              <X className="w-5 h-5 md:w-6 md:h-6" />
                            </Button>
                            <Button
                              onClick={() => handleSwipe('right')}
                              size="lg"
                              className="btn-cosmic"
                            >
                              <Heart className="w-5 h-5 md:w-6 md:h-6" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex justify-center gap-1 mb-4">
                {filteredProducts.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentProductIndex ? 'bg-nebula-hot-pink' : 'bg-stellar-silver/30'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-stellar-silver text-sm md:text-base">
                {currentProductIndex + 1} of {filteredProducts.length}
              </p>
              
              {/* Footer with Skip Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-8 pt-6 border-t border-stellar-silver/20"
              >
                <div className="flex justify-center items-center gap-4">
                  <span className="text-stellar-silver/70 text-sm">
                    Want to browse products directly?
                  </span>
                  <Button
                    onClick={skipToTraditional}
                    variant="outline"
                    size="sm"
                    className="border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 font-medium text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip Adventure
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Results Scene */}
          {currentScene === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center max-w-6xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
                Your Perfect Matches!
              </h2>
              <p className="text-base md:text-lg text-stellar-silver mb-6 md:mb-8">
                {likedProducts.length > 0 
                  ? `You found ${likedProducts.length} amazing match${likedProducts.length > 1 ? 'es' : ''}! 🎉`
                  : "No matches this time, but that's okay! Let's try again with different preferences."
                }
              </p>
              
              {likedProducts.length > 0 ? (
                <div className={`grid ${likedProducts.length === 1 ? 'grid-cols-1 justify-items-center' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4 md:gap-6 mb-6 md:mb-8`}>
                  {likedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className={likedProducts.length === 1 ? 'max-w-sm w-full' : ''}
                    >
                      <Card className="card-cosmic p-4 md:p-6 h-full">
                        <div className="relative h-40 md:h-48 rounded-lg overflow-hidden mb-4">
                          <Image
                            src={product.image_url || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-base md:text-lg font-bold text-stellar-white leading-tight">
                            {product.name}
                          </h3>
                          <p className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-gold to-nebula-orange">
                            ${product.price}
                          </p>
                          <div className="flex items-center gap-2 text-stellar-silver text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>Hatched: {new Date().toLocaleDateString()}</span>
                          </div>
                          <Button
                            asChild
                            size="sm"
                            className="btn-cosmic w-full"
                          >
                            <Link href={`/products/${product.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-4xl md:text-6xl mb-6 md:mb-8">🔍</div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={resetJourney}
                  variant="outline"
                  className="cosmic-glow"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
                <Button
                  asChild
                  className="btn-cosmic"
                >
                  <Link href="/products-traditional">
                    <Shield className="w-4 h-4 mr-2" />
                    Browse All Products
                  </Link>
                </Button>
              </div>
              <Button
                onClick={skipToTraditional}
                variant="outline"
                size="sm"
                className="border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 font-medium text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <SkipForward className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Skip Adventure</span>
                <span className="sm:hidden">Skip</span>
              </Button>
            </motion.div>
          )}

          {/* No Products Found */}
          {currentScene === 'swipe' && filteredProducts.length === 0 && (
            <motion.div
              key="no-products"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="text-4xl md:text-6xl mb-6">🔍</div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 gradient-text">
                No Matches Found
              </h2>
              <p className="text-base md:text-lg text-stellar-silver mb-6 md:mb-8">
                Looks like we don't have anything matching your specific criteria right now. 
                Let's try different preferences or browse all our products!
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={resetJourney}
                  variant="outline"
                  className="cosmic-glow"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  asChild
                  className="btn-cosmic"
                >
                  <Link href="/products-traditional">
                    <Shield className="w-4 h-4 mr-2" />
                    Browse All Products
                  </Link>
                </Button>
              </div>
              
              {/* Footer with Skip Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-8 pt-6 border-t border-stellar-silver/20"
              >
                <div className="flex justify-center items-center gap-4">
                  <span className="text-stellar-silver/70 text-sm">
                    Want to browse products directly?
                  </span>
                  <Button
                    onClick={skipToTraditional}
                    variant="outline"
                    size="sm"
                    className="border-stellar-silver/50 text-stellar-silver hover:bg-stellar-silver/10 font-medium text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip Adventure
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 