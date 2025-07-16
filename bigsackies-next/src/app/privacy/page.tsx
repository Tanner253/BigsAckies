"use client";

import { motion } from "framer-motion";
import { Lock, User, Shield, Info, Mail } from "lucide-react";

const policySections = [
  {
    title: "Introduction",
    content: "At Biggs Ackies, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, make a purchase, or communicate with us. Your privacy and security are paramount to us.",
  },
  {
    title: "Information We Collect",
    content: "We may collect information about you in a variety of ways. The information we may collect on the Site includes:",
    points: [
      "Personal Data: Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.",
      "Financial Data: Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, or exchange. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor, Stripe.",
      "Data from Contests, Giveaways, and Surveys: Personal and other information you may provide when entering contests or giveaways and/or responding to surveys."
    ]
  },
  {
    title: "How We Use Your Information",
    content: "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:",
    points: [
        "Create and manage your account.",
        "Process your orders and payments.",
        "Deliver products and services you have requested.",
        "Email you regarding your account or order.",
        "Respond to your customer service requests and inquiries.",
        "Send you marketing communications (with your consent).",
        "Improve our website, products, and services.",
        "Comply with our legal obligations."
    ]
  },
  {
    title: "Information Sharing & Disclosure",
    content: "We do not sell, rent, or trade your personal information with third parties for their marketing purposes. We may share your information with:",
    points: [
        "Service Providers: Third-party vendors who perform services for us or on our behalf, including payment processing (Stripe), data analysis, email delivery, hosting services, and customer service.",
        "Shipping Carriers: To deliver your orders.",
        "By Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others."
    ]
  },
  {
    title: "Your Rights & Choices",
    content: "You have certain rights regarding your personal information. You have the right to:",
    points: [
        "Access the personal information we hold about you.",
        "Request that we correct any inaccurate personal information.",
        "Request that we delete your personal information.",
        "Opt-out of future marketing communications at any time.",
    ]
  }
];

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-stellar-silver/80 max-w-3xl mx-auto">
            Your trust is important to us. Here's how we protect your information.
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto card-cosmic p-8 md:p-12 rounded-2xl space-y-8"
        >
            {policySections.map((section, i) => (
                <div key={i}>
                    <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold mb-4 gradient-text">
                        <Shield size={24} />
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
                <p className="text-stellar-silver">If you have questions or comments about this Privacy Policy, please contact us at:</p>
                <a href="mailto:contact@biggsackies.com" className="text-nebula-cyan hover:text-nebula-pink transition-colors text-lg">
                    contact@biggsackies.com
                </a>
            </div>
             <div className="text-sm text-stellar-silver/50 text-right">
                <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </motion.div>

      </div>
    </div>
  );
} 
 