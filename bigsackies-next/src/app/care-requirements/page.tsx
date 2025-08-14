"use client";

import { motion } from "framer-motion";
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Home, 
  Heart, 
  Utensils, 
  Shield, 
  Clock, 
  Lightbulb,
  Eye,
  Zap,
  TreePine,
  Waves,
  AlertCircle,
  CheckCircle,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const careGuide = [
  {
    title: "Enclosure Requirements",
    icon: <Home className="w-6 h-6" />,
    gradient: "from-nebula-cyan to-nebula-blue",
    sections: [
      {
        subtitle: "Minimum Size",
        content: "Adult Ackie Monitors require a minimum enclosure size of 6ft x 2ft x 2ft (180cm x 60cm x 60cm). Larger is always better, as these are very active lizards that love to explore.",
        icon: <Eye className="w-5 h-5" />
      },
      {
        subtitle: "Substrate",
        content: "Use a mix of sand, soil, and clay that can hold burrows. Never use 100% sand - it won't hold burrows and lacks proper humidity retention. The substrate should be a minimum of 12 inches deep to allow for proper digging and burrow construction. If breeding, provide even deeper substrate for nesting behavior. Under their hide, maintain substrate at 80% humidity for proper shedding and health.",
        icon: <TreePine className="w-5 h-5" />
      },
      {
        subtitle: "Hiding Spots",
        content: "Provide multiple hiding spots - both warm and cool sides. Most importantly, create a humid hide with moist substrate underneath (80% humidity) for proper shedding. Rock caves, hollow logs, and commercial reptile hides all work well. Ackies feel secure when they have options and proper humidity gradients.",
        icon: <Shield className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Temperature & Lighting",
    icon: <Thermometer className="w-6 h-6" />,
    gradient: "from-nebula-orange to-nebula-gold",
    sections: [
      {
        subtitle: "Temperature Gradient",
        content: "Basking spot: 120-130°F (49-54°C), Hot side: 90-100°F (32-38°C), Cool side: 75-85°F (24-29°C). Night temperatures can drop to 70-75°F (21-24°C).",
        icon: <Thermometer className="w-5 h-5" />
      },
      {
        subtitle: "UV Lighting",
        content: "Provide UVB lighting with a 10-12% UVB bulb. Replace every 6-12 months. UVB is essential for calcium metabolism and overall health.",
        icon: <Sun className="w-5 h-5" />
      },
      {
        subtitle: "Lighting Schedule",
        content: "12-14 hours of light during summer, 10-12 hours during winter. This mimics natural seasonal cycles and helps regulate their behavior.",
        icon: <Clock className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Humidity & Water",
    icon: <Droplets className="w-6 h-6" />,
    gradient: "from-nebula-magenta to-nebula-violet",
    sections: [
      {
        subtitle: "Humidity Levels",
        content: "Maintain 20-40% ambient humidity in the enclosure. However, create a humid hide with 80% humidity in the substrate underneath - this is crucial for proper shedding and health. Too high ambient humidity can cause respiratory issues, while inadequate humidity under hides leads to shedding problems. Use a reliable hygrometer to monitor.",
        icon: <Droplets className="w-5 h-5" />
      },
      {
        subtitle: "Water Source",
        content: "Provide a shallow water bowl large enough for soaking but not deep enough to drown. Change water regularly to prevent bacterial growth.",
        icon: <Waves className="w-5 h-5" />
      },
      {
        subtitle: "Misting",
        content: "Light misting 2-3 times per week can help with humidity and provide drinking opportunities. Avoid over-misting which can lead to mold.",
        icon: <Droplets className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Diet & Feeding",
    icon: <Utensils className="w-6 h-6" />,
    gradient: "from-nebula-hot-pink to-nebula-rose",
    sections: [
      {
        subtitle: "Staple Foods",
        content: "Dubia roaches, crickets, mealworms, and superworms. At Biggs Ackies, we gut-load all our feeders with organic vegetables for optimal nutrition.",
        icon: <Utensils className="w-5 h-5" />
      },
      {
        subtitle: "Feeding Schedule",
        content: "Juveniles: daily, Adults: every 2-3 days. Feed appropriate sized prey - nothing larger than the space between their eyes.",
        icon: <Clock className="w-5 h-5" />
      },
      {
        subtitle: "Supplements",
        content: "Dust food with calcium powder 2-3 times per week, and calcium with D3 once per week. Multivitamin once per week for juveniles, bi-weekly for adults.",
        icon: <Zap className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Behavior & Handling",
    icon: <Heart className="w-6 h-6" />,
    gradient: "from-nebula-deep-purple to-nebula-violet",
    sections: [
      {
        subtitle: "Natural Behavior",
        content: "Ackie Monitors are naturally curious and intelligent. They love to explore, dig, and climb. Provide enrichment like branches, rocks, and hiding spots.",
        icon: <Eye className="w-5 h-5" />
      },
      {
        subtitle: "Taming Process",
        content: "Start with short, gentle handling sessions. Our hand-raised Ackies are already well-socialized, but consistency is key to maintaining their trust.",
        icon: <Heart className="w-5 h-5" />
      },
      {
        subtitle: "Signs of Stress",
        content: "Watch for excessive hiding, refusing food, or aggressive behavior. Stressed Ackies may also have dull coloration or lethargy.",
        icon: <AlertCircle className="w-5 h-5" />
      }
    ]
  },
  {
    title: "Health & Wellness",
    icon: <Shield className="w-6 h-6" />,
    gradient: "from-nebula-cyan to-nebula-blue",
    sections: [
      {
        subtitle: "Regular Health Checks",
        content: "Monitor weight, appetite, and behavior. Healthy Ackies are alert, active, and have bright coloration. Annual vet checkups are recommended.",
        icon: <CheckCircle className="w-5 h-5" />
      },
      {
        subtitle: "Common Issues",
        content: "Shedding problems (low humidity), respiratory infections (poor ventilation), and parasites. Proper husbandry prevents most health issues.",
        icon: <AlertCircle className="w-5 h-5" />
      },
      {
        subtitle: "Emergency Signs",
        content: "Seek immediate veterinary care for: difficulty breathing, bleeding, seizures, or prolonged refusal to eat (more than 2 weeks for adults).",
        icon: <Shield className="w-5 h-5" />
      }
    ]
  }
];

export default function CareRequirementsPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-space-gradient opacity-60" />
      <div className="stars opacity-30" />
      <div className="nebula-particles" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-cosmic-shimmer">
            Ackie Monitor Care Guide
          </h1>
          <p className="text-xl text-stellar-silver/80 max-w-3xl mx-auto mb-8">
            Everything you need to know to provide the best care for your Red Ackie Monitor. 
            Our comprehensive guide covers all aspects of proper husbandry.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-cosmic p-6 rounded-xl">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-gold to-nebula-orange mb-2">
                15-20 years
              </div>
              <div className="text-stellar-silver/70">Average Lifespan</div>
            </div>
                         <div className="card-cosmic p-6 rounded-xl">
               <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-magenta to-nebula-violet mb-2">
                 2 feet
               </div>
               <div className="text-stellar-silver/70">Max Adult Size</div>
             </div>
            <div className="card-cosmic p-6 rounded-xl">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebula-cyan to-nebula-blue mb-2">
                Intermediate
              </div>
              <div className="text-stellar-silver/70">Care Level</div>
            </div>
          </div>
        </motion.div>

        {/* Care Guide Sections */}
        <div className="space-y-12">
          {careGuide.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-cosmic rounded-2xl p-8 backdrop-blur-xl border border-nebula-violet/30"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${section.gradient} flex items-center justify-center text-white`}>
                  {section.icon}
                </div>
                <h2 className="text-3xl font-bold gradient-text">{section.title}</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                {section.sections.map((subsection, subIndex) => (
                  <div key={subIndex} className="bg-space-dark/30 rounded-xl p-6 border border-nebula-violet/20">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nebula-violet/30 to-nebula-magenta/30 flex items-center justify-center text-stellar-silver mt-1">
                        {subsection.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-stellar-white">{subsection.subtitle}</h3>
                    </div>
                    <p className="text-stellar-silver/90 leading-relaxed">{subsection.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 card-cosmic rounded-2xl p-8 bg-gradient-to-br from-nebula-violet/10 to-nebula-magenta/10 border border-nebula-violet/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-gold to-nebula-orange flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold gradient-text">Important Notes</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-stellar-silver">All our Ackies are hand-raised and tamed from hatching</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-stellar-silver">We provide ongoing support for all our customers</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-stellar-silver">Ackies are highly intelligent and can recognize their owners</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <p className="text-stellar-silver">Always research local veterinarians who treat reptiles</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <p className="text-stellar-silver">Check local laws regarding monitor ownership</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <p className="text-stellar-silver">Consider the long-term commitment - they can live 15-20 years</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h2 className="text-4xl font-bold gradient-text mb-6">
            Ready to Welcome an Ackie into Your Home?
          </h2>
          <p className="text-lg text-stellar-silver/80 mb-8 max-w-2xl mx-auto">
            Browse our available hand-raised Ackie Monitors or contact us with any questions about care and setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg"
              className="btn-cosmic text-white font-bold text-lg py-4 px-8 rounded-full hover:scale-105 transition-transform duration-300 shadow-cosmic animate-pulse-glow"
            >
              <Link href="/products">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Available Ackies
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-stellar-silver text-stellar-silver hover:bg-stellar-silver/10 font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
            >
              <Link href="/contact">
                Have Questions? Contact Us
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 