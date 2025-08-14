"use client";

import { motion } from "framer-motion";
import { FileText, Shield, Info, Mail } from "lucide-react";

const termsSections = [
  {
    title: "Agreement to Terms",
    content: "By accessing and using the Biggs Ackies website (the 'Site'), you accept and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use the Site. We reserve the right to modify these terms at any time.",
  },
  {
    title: "Use of the Site",
    content: "You agree to use the Site for lawful purposes only. You are prohibited from any use of the Site that would constitute a violation of any applicable law, regulation, rule, or ordinance of any nationality, state, or locality or of any international law or treaty, or that could give rise to any civil or criminal liability.",
    points: [
      "All content on the Site, including text, graphics, logos, images, and software, is the property of Biggs Ackies or its content suppliers and is protected by international copyright laws.",
      "Permission is granted to temporarily access and use the Site for personal, non-commercial use only.",
      "This license does not include any resale or commercial use of the Site or its contents; any collection and use of any product listings, descriptions, or prices; any derivative use of this site or its contents; or any use of data mining, robots, or similar data gathering and extraction tools."
    ]
  },
  {
    title: "Product Information and Sales",
    content: "We strive to be as accurate as possible with product descriptions, images, and pricing. However, we do not warrant that they are accurate, complete, reliable, current, or error-free.",
    points: [
        "All prices are subject to change without notice.",
        "We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase, inaccuracies, or errors in product or pricing information.",
        "Payment must be received in full before an order is processed. For live animal sales, specific terms regarding shipping and health guarantees apply, as detailed on our Shipping & Health Guarantee page."
    ]
  },
  {
    title: "Disclaimer of Warranties and Limitation of Liability",
    content: "This Site is provided on an 'as is' and 'as available' basis. Biggs Ackies makes no representations or warranties of any kind, express or implied, as to the operation of the site or the information, content, materials, or products included on this site.",
    points: [
        "To the full extent permissible by applicable law, Biggs Ackies disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose.",
        "Biggs Ackies will not be liable for any damages of any kind arising from the use of this site, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.",
        "Our liability in connection with the sale of any live animal is strictly limited to the terms of our Live Arrival Guarantee."
    ]
  },
];

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-xl text-stellar-silver/80 max-w-3xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto card-cosmic p-8 md:p-12 rounded-2xl space-y-8"
        >
            {termsSections.map((section, i) => (
                <div key={i}>
                    <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold mb-4 gradient-text">
                        <FileText size={24} />
                        {section.title}
                    </h2>
                    <p className="text-stellar-silver/90 text-base md:text-lg mb-4 leading-relaxed">{section.content}</p>
                    {section.points && (
                        <ul className="space-y-3 pl-4">
                            {section.points.map((point, j) => (
                                <li key={j} className="flex items-start gap-3">
                                    <Info size={16} className="text-nebula-cyan mt-1 flex-shrink-0" />
                                    <span className="text-stellar-silver">{point}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            <div className="border-t border-nebula-violet/20 pt-8 mt-8">
                 <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold mb-4 gradient-text">
                    <Mail size={24} />
                    Contact Us
                </h2>
                <p className="text-stellar-silver/80 text-center">
              Questions about these terms? Contact us at{" "}
              <a href="mailto:percivaltanner@gmail.com" className="text-nebula-cyan hover:text-nebula-pink transition-colors text-lg">
                percivaltanner@gmail.com
              </a>
            </p>
            </div>
             <div className="text-sm text-stellar-silver/50 text-right">
                <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </motion.div>

      </div>
    </div>
  );
} 
 