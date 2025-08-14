"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/components/NotificationSystem";
import { useSession } from "next-auth/react";
import { 
  Mail, 
  User, 
  MessageSquare, 
  Send, 
  Sparkles,
  ArrowRight,
  Briefcase,
  Globe,
  Rocket,
  Brain,
  Target,
  TrendingUp,
  Shield,
  Cpu,
  Database,
  Cloud,
  Terminal,
  Award,
  Zap,
  Code2,
  Building,
  Star,
  CheckCircle,
  ExternalLink,
  Server,
  Smartphone,
  Users,
  Trophy,
  GitBranch,
  Activity,
  Calendar,
  Eye,
  Heart,
  Box,
  Layers,
  Cog,
  FileText,
  DollarSign,
  Gamepad2,
  Palette,
  ShoppingCart,
  Bot,
  Wrench,
  Monitor,
  CloudLightning,
  Lightbulb,
  Megaphone,
  Settings,
  Hash,
  Coins,
  Wallet,
  Banknote,
  Store,
  PaintBucket,
  Brush
} from "lucide-react";

// Tech stack icons from react-icons
import {
  SiSharp,
  SiDotnet,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiNextdotjs,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiSass,
  SiTailwindcss,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiPrisma,
  SiUnity,
  SiAmazon,
  SiDocker,
  SiGit,
  SiSwagger,
  SiGithub,
  SiVercel,
  SiPython,
  SiSolana,
  SiAndroid,
  SiLinux,
  SiJupyter,
  SiGithubactions,
  SiPostman,
  SiFramer,
  SiRadixui
} from "react-icons/si";

const techStacks = {
  "Core Technologies": [
    { name: "C#", icon: SiSharp, color: "#239120" },
    { name: ".NET", icon: SiDotnet, color: "#512BD4" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  ],
  "Frontend & Design": [
    { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
    { name: "CSS3", icon: SiCss3, color: "#1572B6" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    { name: "Sass", icon: SiSass, color: "#CC6699" },
    { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
    { name: "Radix UI", icon: SiRadixui, color: "#161618" },
  ],
  "Databases & Storage": [
    { name: "SQL Server", icon: Database, color: "#CC2927" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "Prisma", icon: SiPrisma, color: "#2D3748" },
    { name: "Entity Framework", icon: Database, color: "#512BD4" },
  ],
  "Cloud & DevOps": [
    { name: "AWS", icon: SiAmazon, color: "#FF9900" },
    { name: "Azure", icon: Cloud, color: "#0078D4" },
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "Git", icon: SiGit, color: "#F05032" },
    { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
    { name: "Vercel", icon: SiVercel, color: "#000000" },
    { name: "Linux", icon: SiLinux, color: "#FCC624" },
    { name: "Windows", icon: Monitor, color: "#0078D6" },
    { name: "PowerShell", icon: Terminal, color: "#5391FE" },
  ],
  "Game Development": [
    { name: "Unity", icon: SiUnity, color: "#000000" },
    { name: "C# (Unity)", icon: SiSharp, color: "#239120" },
    { name: "Android", icon: SiAndroid, color: "#3DDC84" },
    { name: "Google Play", icon: Smartphone, color: "#414141" },
  ],
  "Tools & Platforms": [
    { name: "VS Code", icon: Code2, color: "#007ACC" },
    { name: "Visual Studio", icon: Code2, color: "#5C2D91" },
    { name: "GitHub", icon: SiGithub, color: "#181717" },
    { name: "Swagger", icon: SiSwagger, color: "#85EA2D" },
    { name: "Postman", icon: SiPostman, color: "#FF6C37" },
    { name: "Jupyter", icon: SiJupyter, color: "#F37626" },
  ],
  "Blockchain & Crypto": [
    { name: "Solana", icon: SiSolana, color: "#9945FF" },
    { name: "Web3", icon: Coins, color: "#F7931A" },
    { name: "Smart Contracts", icon: Hash, color: "#627EEA" },
  ]
};

const projects = [
  {
    name: "BigsAckies",
    description: "DEPLOYED: Production e-commerce platform specializing in reptile sales with cosmic-themed UI, advanced product management, and real-time inventory tracking",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "NextAuth"],
    status: "🚀 LIVE",
    link: "https://bigsackies.com",
    stars: 1,
    language: "TypeScript",
    updated: "Jul 16, 2025",
    icon: Store,
    color: "#10b981"
  },
  {
    name: "Gold Clicker Mining",
    description: "DEPLOYED: Full-stack gaming platform featuring multiple clicker games, blockchain integration, and real-time leaderboards",
    technologies: ["Unity", "C#", "JavaScript", "Node.js", "Solana", "Android"],
    status: "🎮 LIVE",
    link: "https://goldclickermining.com",
    stars: 2,
    language: "C#",
    updated: "May 21, 2025",
    icon: Gamepad2,
    color: "#f59e0b"
  },
  {
    name: "Unity6-Clicker",
    description: "DEPLOYED: Mobile clicker game built with Unity 6, featuring engaging gameplay mechanics and monetization strategies",
    technologies: ["Unity", "C#", "Android", "Google Play"],
    status: "📱 MOBILE",
    link: "https://play.google.com/store/apps/details?id=com.goldclickermining.unity6clicker",
    stars: 0,
    language: "C#",
    updated: "May 21, 2025",
    icon: Smartphone,
    color: "#8b5cf6"
  },
  {
    name: "MemeCoinClicker - LEGACY",
    description: "DEPLOYED: Unity6 game deployed on Google App Store with memecoin integration and blockchain rewards system",
    technologies: ["Unity", "C#", "Android", "Blockchain", "Google Play"],
    status: "🏪 STORE",
    link: "https://play.google.com/store/apps/details?id=com.memecoinclicker",
    stars: 0,
    language: "C#",
    updated: "May 3, 2025",
    icon: Coins,
    color: "#ef4444"
  },
  {
    name: "ClickerDemo",
    description: "DEPLOYED: Web-based clicker game where players earn money. Features memecoin backing and Solana blockchain integration",
    technologies: ["JavaScript", "Node.js", "Solana", "Web3", "Blockchain"],
    status: "🌐 WEB",
    link: "https://clickerdemo.com",
    stars: 1,
    language: "JavaScript",
    updated: "May 8, 2025",
    icon: DollarSign,
    color: "#06b6d4"
  },
  {
    name: "MCP Unity Integration",
    description: "Forked MCP Server to integrate Unity Editor with AI Model clients (Claude Desktop, Windsurf, Cursor) for enhanced development workflow",
    technologies: ["C#", "Unity", "AI Integration", "MCP Protocol"],
    status: "🤖 AI TOOL",
    link: "https://github.com/Tanner253/mcp-unity",
    stars: 0,
    language: "C#",
    updated: "Apr 4, 2025",
    icon: Bot,
    color: "#7c3aed"
  },
  {
    name: "ComedyMcpServer",
    description: "DEPLOYED: MCP server using C# SDK to enhance code comments with jokes from JokeAPI, bringing humor to development",
    technologies: ["C#", "MCP SDK", "API Integration", "Comedy AI"],
    status: "😄 DEPLOYED",
    link: "https://github.com/Tanner253/ComedyMcpServer",
    stars: 0,
    language: "C#",
    updated: "Apr 4, 2025",
    icon: Megaphone,
    color: "#f97316"
  },
  {
    name: "BAP Web App",
    description: "Business application platform with responsive design and modern JavaScript architecture",
    technologies: ["JavaScript", "HTML5", "CSS3", "Responsive Design"],
    status: "🌐 DEMO",
    link: "https://tanner253.github.io/BAP_Web_App/",
    stars: 0,
    language: "JavaScript",
    updated: "Jul 7, 2025",
    icon: Building,
    color: "#3b82f6"
  },
  {
    name: "SPA-GoldClicker",
    description: "Single Page Application pitch for gold clicker miner game with modern web technologies",
    technologies: ["JavaScript", "SPA", "Game Development", "Web"],
    status: "🎯 PITCH",
    link: "https://github.com/Tanner253/SPA-GoldClicker",
    stars: 0,
    language: "JavaScript",
    updated: "Jul 2, 2025",
    icon: Target,
    color: "#14b8a6"
  },
  {
    name: "DinoCMS2.2",
    description: "DEPLOYED: Gaming server CMS with advanced management capabilities and user authentication",
    technologies: ["C#", ".NET", "SQL Server", "Web API", "CMS"],
    status: "🎮 DEPLOYED",
    link: "https://github.com/Tanner253/DinoCMS2.2",
    stars: 1,
    language: "C#",
    updated: "Feb 13, 2024",
    icon: Server,
    color: "#059669"
  },
  {
    name: "React Hair Salon",
    description: "Professional hair salon website built for a client with appointment booking and service management",
    technologies: ["React", "JavaScript", "CSS3", "Client Project"],
    status: "👥 CLIENT",
    link: "https://github.com/Tanner253/React-Hair-Salon",
    stars: 1,
    language: "JavaScript",
    updated: "Jun 10, 2022",
    icon: Brush,
    color: "#db2777"
  },
  {
    name: "MySQL EF Core CRUD",
    description: "Full CRUD operations implementation with MySQL integration using Entity Framework Core",
    technologies: ["C#", "Entity Framework", "MySQL", "CRUD Operations"],
    status: "🗄️ DATABASE",
    link: "https://github.com/Tanner253/mySQL-EF-Core-FULL-CRUD",
    stars: 1,
    language: "HTML",
    updated: "May 31, 2022",
    icon: Database,
    color: "#0ea5e9"
  },
  {
    name: "Portfolio JS",
    description: "Personal portfolio website built with modern JavaScript and mobile-friendly responsive design",
    technologies: ["CSS3", "JavaScript", "HTML5", "Responsive Design"],
    status: "🎨 PORTFOLIO",
    link: "https://github.com/Tanner253/My-portfolio-JS",
    stars: 0,
    language: "CSS",
    updated: "Apr 27, 2025",
    icon: Palette,
    color: "#be185d"
  }
];

const specialties = [
  { name: "Microservices Architecture", icon: Cpu, color: "#7c3aed" },
  { name: "Multi-tenancy Implementation", icon: Globe, color: "#db2777" },
  { name: "AWS Cloud Solutions", icon: SiAmazon, color: "#FF9900" },
  { name: "Azure Cloud Services", icon: Cloud, color: "#0078D4" },
  { name: "Real-time Applications", icon: Zap, color: "#f59e0b" },
  { name: "E-commerce Solutions", icon: Building, color: "#10b981" },
  { name: "Game Development (Unity)", icon: SiUnity, color: "#000000" },
  { name: "Blockchain Integration", icon: Coins, color: "#8b5cf6" },
  { name: "AI Tool Integration", icon: Brain, color: "#06b6d4" },
  { name: "Mobile App Development", icon: Smartphone, color: "#ef4444" },
  { name: "Full-Stack Development", icon: Code2, color: "#f97316" },
  { name: "DevOps & CI/CD", icon: Settings, color: "#84cc16" },
];

const achievements = [
  { name: "Arctic Code Vault Contributor", icon: Award, color: "#0ea5e9", description: "Code preserved in Arctic Code Vault" },
  { name: "Pull Shark x3", icon: GitBranch, color: "#10b981", description: "Merged significant pull requests" },
  { name: "Quickdraw", icon: Zap, color: "#f59e0b", description: "Fast repository creation" },
  { name: "YOLO", icon: Rocket, color: "#ef4444", description: "Merged pull request without review" },
  { name: "105 Repositories", icon: Box, color: "#8b5cf6", description: "Created 105+ repositories" },
  { name: "20 Following", icon: Users, color: "#06b6d4", description: "Following 20 developers" },
  { name: "12 Followers", icon: Heart, color: "#f97316", description: "Followed by 12 developers" },
  { name: "Production Apps", icon: Rocket, color: "#10b981", description: "Multiple deployed applications" },
];

type HireMeModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  showButton?: boolean;
};

export default function HireMeModal({ isOpen: externalIsOpen, onClose, showButton = true }: HireMeModalProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const { addNotification } = useNotifications();
  const { data: session } = useSession();

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onClose && !open) {
      // Externally controlled and trying to close
      onClose();
    } else if (onClose && open) {
      // Externally controlled and trying to open - can't do this from internal button
      // This should only happen if there's an issue with the implementation
      console.warn("Cannot open externally controlled modal from internal button");
    } else {
      // Internal control
      setInternalIsOpen(open);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/hire-me-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id || null,
          userEmail: session?.user?.email || null
        }),
      });

      if (response.ok) {
        addNotification({
          type: "success",
          title: "Message Sent!",
          message: "Thanks for reaching out! I'll get back to you soon.",
          duration: 5000
        });
        setFormData({ name: "", email: "", company: "", message: "" });
        setIsOpen(false);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Failed to Send",
        message: "Unable to send message. Please try again.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      {/* Enhanced Animated Hire Me Button */}
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-12 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
          
          <Button
            onClick={() => setIsOpen(true)}
            className="relative overflow-hidden group bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-6 px-12 rounded-full text-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-110 border-2 border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative flex items-center gap-4 z-10">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <Briefcase className="w-8 h-8" />
                <div className="absolute inset-0 bg-yellow-300 rounded-full blur-md opacity-30 animate-pulse"></div>
              </motion.div>
              <span className="text-xl font-bold">Looking for a Developer?</span>
              <motion.div
                animate={{ 
                  x: [0, 10, 0],
                  rotate: [0, 15, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </div>
          </Button>
        </motion.div>
      )}

      {/* Enhanced Modal with Solid Background */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="bg-slate-900 border-2 border-purple-500/50 text-white shadow-2xl p-0"
          style={{ 
            maxWidth: '85vw',
            width: '85vw',
            maxHeight: '90vh',
            height: '90vh',
            backgroundColor: '#0f172a' // Fixed solid background
          }}
        >
          <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
            {/* Header */}
            <DialogHeader className="pb-6 pt-6 px-6 border-b border-purple-500/50 flex-shrink-0 bg-slate-900">
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <DialogTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Tanner Percival
                  </DialogTitle>
                  <p className="text-base md:text-lg text-slate-300 mt-2">
                    Unicorn Software Engineer • $GCM Dev
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>12 followers • 20 following</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Box className="w-4 h-4" />
                      <span>105 repositories</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative flex-shrink-0"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
              </div>
            </DialogHeader>

            {/* Tab Navigation */}
            <div className="flex-shrink-0 bg-slate-900 px-4 py-4 sm:px-6 sm:py-6">
              <div className="overflow-x-auto pb-2 -mb-2">
                <div className="bg-slate-800 p-1 rounded-full border border-purple-500/50 inline-block">
                  <div className="flex items-center gap-1">
                    {tabs.map((tab, index) => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-1.5 lg:px-6 lg:py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 text-sm whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-slate-300 hover:text-white hover:bg-purple-500/30'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Content - Scrollable Area */}
            <div className="flex-1 min-h-0 bg-slate-900 overflow-y-auto px-6 pb-6">
              <div className="min-h-full">
                <AnimatePresence mode="wait">
                  {activeTab === "about" && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="grid lg:grid-cols-2 gap-8 pb-8"
                    >
                      {/* About Me */}
                      <div className="bg-slate-800 border border-purple-500/50 p-6 lg:p-8 rounded-xl">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-white">What I Do</h3>
                        </div>
                        <div className="text-sm md:text-base leading-relaxed space-y-4 text-slate-300">
                          <p>
                            <strong>Got an idea for an app or website? I can build it.</strong> Think of me as your one-stop-shop for turning a concept into a real, working product. I handle everything from start to finish.
                          </p>
                          <p>
                            <strong>The Look and Feel (Front-End):</strong> I design and build the part of the app you actually see and use. My goal is to make it beautiful, easy-to-use, and enjoyable for your customers. This includes everything from the layout and buttons to smooth animations and a design that works perfectly on phones, tablets, and computers.
                          </p>
                          <p>
                            <strong>The Brains of the Operation (Back-End):</strong> Behind the scenes, I build the powerful engine that makes your app work. This includes managing user accounts, storing data securely, and handling all the complex logic that happens when a user clicks a button.
                          </p>
                          <p>
                            <strong>The Plumbing and Power (API & Server Services):</strong> I also build and manage the critical infrastructure that keeps your app running fast and reliably. This includes connecting your app to other services (like payment systems), ensuring it can handle many users at once, and keeping it secure from threats.
                          </p>
                           <p>
                            <strong>Bottom line: If you have an idea, I have the skills to build it.</strong>
                          </p>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="bg-slate-800 border border-purple-500/50 p-6 lg:p-8 rounded-xl">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-white">Example Services</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { name: "Full Website & App Creation", icon: Rocket, color: "#7c3aed" },
                            { name: "E-commerce & Online Stores", icon: ShoppingCart, color: "#10b981" },
                            { name: "Game Development (PC & Mobile)", icon: Gamepad2, color: "#000000" },
                            { name: "Connecting to Other Apps (APIs)", icon: GitBranch, color: "#f59e0b" },
                            { name: "Making Sure Your App is Fast & Secure", icon: Shield, color: "#ef4444" },
                            { name: "Custom Business Tools", icon: Wrench, color: "#3b82f6" },
                            { name: "AI & Automation for Your Business", icon: Bot, color: "#06b6d4" },
                            { name: "Blockchain & Web3 Integration", icon: Coins, color: "#8b5cf6" },
                          ].map((specialty, index) => (
                            <motion.div
                              key={specialty.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="flex items-center gap-3 p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all duration-300 group"
                            >
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${specialty.color}30` }}
                              >
                                <specialty.icon 
                                  className="w-4 h-4 group-hover:scale-110 transition-transform"
                                  style={{ color: specialty.color }}
                                />
                              </div>
                              <span className="text-slate-300 group-hover:text-white transition-colors text-sm md:text-base">
                                {specialty.name}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "skills" && (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8"
                    >
                      {Object.entries(techStacks).map(([category, techs], categoryIndex) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                          className="bg-slate-800 border border-purple-500/50 p-6 rounded-xl"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                              <Code2 className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-white">{category}</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {techs.map((tech, index) => (
                              <motion.div
                                key={tech.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="flex items-center gap-2 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all duration-300 group"
                              >
                                <tech.icon 
                                  className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" 
                                  style={{ color: tech.color }}
                                />
                                <span className="text-slate-300 group-hover:text-white transition-colors text-xs md:text-sm truncate">
                                  {tech.name}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "projects" && (
                    <motion.div
                      key="projects"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8"
                    >
                      {projects.map((project, index) => (
                        <motion.div
                          key={project.name}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="bg-slate-800 border border-purple-500/50 p-6 rounded-xl hover:bg-slate-700 transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${project.color}30` }}
                              >
                                <project.icon 
                                  className="w-5 h-5"
                                  style={{ color: project.color }}
                                />
                              </div>
                              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                                {project.name}
                              </h3>
                            </div>
                            <span className="text-xs px-2 py-1 bg-purple-500/30 text-purple-300 rounded-full border border-purple-500/50">
                              {project.status}
                            </span>
                          </div>
                          
                          <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs border border-slate-600"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-slate-600">
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                <span>{project.stars}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: project.language === 'TypeScript' ? '#3178C6' : project.language === 'JavaScript' ? '#F7DF1E' : project.language === 'C#' ? '#239120' : '#64748b' }}
                                />
                                <span>{project.language}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{project.updated}</span>
                              </div>
                            </div>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "achievements" && (
                    <motion.div
                      key="achievements"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8"
                    >
                      {achievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-slate-800 border border-purple-500/50 p-6 rounded-xl hover:bg-slate-700 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${achievement.color}30` }}
                            >
                              <achievement.icon 
                                className="w-6 h-6 group-hover:scale-110 transition-transform"
                                style={{ color: achievement.color }}
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                                {achievement.name}
                              </h3>
                              <p className="text-sm text-slate-400">
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "contact" && (
                    <motion.div
                      key="contact"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="max-w-4xl mx-auto pb-8"
                    >
                      <div className="bg-slate-800 border border-purple-500/50 p-6 lg:p-8 rounded-xl">
                        <div className="flex items-center justify-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                            <Mail className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">Ready to build something great together?</h3>
                            <p className="text-slate-300 text-sm md:text-base">Let's discuss your next project</p>
                          </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name" className="text-white text-sm mb-2 block">Name *</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="bg-slate-700 border-purple-500/50 text-white placeholder-slate-400 focus:border-purple-400 h-10"
                                placeholder="Your name"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="email" className="text-white text-sm mb-2 block">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="bg-slate-700 border-purple-500/50 text-white placeholder-slate-400 focus:border-purple-400 h-10"
                                placeholder="your@email.com"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="company" className="text-white text-sm mb-2 block">Company</Label>
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) => setFormData({...formData, company: e.target.value})}
                              className="bg-slate-700 border-purple-500/50 text-white placeholder-slate-400 focus:border-purple-400 h-10"
                              placeholder="Your company"
                            />
                          </div>

                          <div>
                            <Label htmlFor="message" className="text-white text-sm mb-2 block">Message *</Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => setFormData({...formData, message: e.target.value})}
                              className="bg-slate-700 border-purple-500/50 text-white placeholder-slate-400 focus:border-purple-400 min-h-[120px] resize-none"
                              placeholder="Tell me about your project..."
                              required
                            />
                          </div>

                          <div className="pt-4">
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full h-12 text-base font-bold bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                  <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Sending...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-5 h-5" />
                                    <span>Send Message</span>
                                    <Sparkles className="w-5 h-5" />
                                  </>
                                )}
                              </div>
                            </Button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 