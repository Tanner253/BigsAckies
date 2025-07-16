"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Star, Shield, Truck, Dna } from "lucide-react";

const faqs = [
  {
    category: "About Our Reptiles",
    icon: <Star className="w-5 h-5" />,
    questions: [
      {
        q: "What makes Ackie Monitors a great pet?",
        a: "Ackie Monitors are intelligent, active, and hardy reptiles with amazing personalities. Unlike more sedentary reptiles, Ackies are constantly exploring and interacting with their environment. They are a manageable size and can form strong bonds with their owners, making them a truly rewarding companion for keepers of all levels.",
      },
      {
        q: "Are your reptiles hand-raised?",
        a: "Absolutely. We are present from the moment they hatch to be the first thing they smell, which creates an immediate, positive bond. We dedicate ourselves full-time to handling and taming each animal before it goes to its new home, ensuring you receive a well-socialized and handleable companion.",
      },
      {
        q: "What do you feed your reptiles?",
        a: "We believe in providing the most natural and nutritious diet possible. We farm our own insects (like Dubia roaches) using organic kitchen scraps. This ensures our reptiles receive a varied, gut-loaded diet free from pesticides and full of essential nutrients for optimal health.",
      },
    ],
  },
  {
    category: "Shipping & Health Guarantee",
    icon: <Shield className="w-5 h-5" />,
    questions: [
      {
        q: "How do you ship your reptiles?",
        a: "The health and safety of our animals is our #1 priority. We ship via FedEx Priority Overnight in insulated boxes with appropriate heat or cold packs, depending on the weather. We only ship on Tuesdays and Wednesdays to ensure there are no weekend delays. We will work with you to coordinate a shipping date that ensures you are home to receive your new animal.",
      },
      {
        q: "Do you offer a live arrival guarantee?",
        a: "Yes, we guarantee live and healthy arrival. In the rare event of a problem, you must contact us within one hour of delivery with photos and videos. We will work with you to resolve the issue, which may include a replacement or refund. Our full shipping and guarantee policy will be provided during checkout.",
      },
      {
        q: "Can I pick up my reptile locally?",
        a: "Yes, local pickup is available in the [Your City/Region] area. Please contact us before purchasing to arrange a pickup time and location.",
      },
    ],
  },
   {
    category: "Genetics & Breeding",
    icon: <Dna className="w-5 h-5" />,
    questions: [
      {
        q: "What is a 'Red Ackie'?",
        a: "We specialize in the Red Ackie Monitor (Varanus acanthurus), which is known for its vibrant red and orange coloration. We selectively breed for the deepest reds and most striking patterns, while always prioritizing the health and genetic diversity of our lines.",
      },
      {
        q: "Do you provide genetic information for your reptiles?",
        a: "biggs and our breeder females are the start of our internal lineage. bigs and smalls are rare high red top enders 3rd generation captive bred hand tamed. no deepr information is available.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-space-gradient opacity-60" />
      <div className="stars opacity-30" />
      <div className="nebula-particles" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-cosmic-shimmer">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-stellar-silver/80 max-w-2xl mx-auto">
            Have questions? We have answers. Here are some common things people want to know.
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
        >
            {faqs.map((category, i) => (
                <div key={i} className="mb-8">
                    <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
                        <span className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-violet to-nebula-magenta flex items-center justify-center text-white">
                            {category.icon}
                        </span>
                        <span className="gradient-text">{category.category}</span>
                    </h2>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {category.questions.map((faq, j) => (
                        <AccordionItem value={`item-${i}-${j}`} key={j} className="card-cosmic rounded-xl border-none">
                            <AccordionTrigger className="p-6 text-lg font-semibold text-left text-stellar-white hover:no-underline">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="p-6 pt-0 text-stellar-silver/90 text-base">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ))}
        </motion.div>

      </div>
    </div>
  );
} 