"use client";

import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";
import { Button } from "./ui/button";

const shorts = [
  {
    id: "fxjx-jWKQ_w",
    title: "Baby Ackie Monitor Eggs",
    url: "https://www.youtube.com/shorts/fxjx-jWKQ_w"
  },
  {
    id: "OBWso6DCw8E", 
    title: "Ackie Monitor Feeding",
    url: "https://www.youtube.com/shorts/OBWso6DCw8E"
  },
  {
    id: "lMoqssKLFzQ",
    title: "Baby Ackie Monitor Lizards for Sale", 
    url: "https://www.youtube.com/shorts/lMoqssKLFzQ"
  }
];

export default function YouTubeShorts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {shorts.map((short, index) => (
        <motion.div
          key={short.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className="card-cosmic rounded-xl overflow-hidden hover:shadow-cosmic transition-all duration-300">
            {/* Video Container */}
            <div className="relative aspect-[9/16] bg-gradient-to-br from-nebula-deep-purple/20 to-nebula-magenta/20">
              {/* Embedded YouTube Short */}
              <iframe
                className="w-full h-full rounded-t-xl"
                src={`https://www.youtube.com/embed/${short.id}?controls=1&rel=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3`}
                title={short.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Video Info */}
            <div className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-stellar-white mb-2 group-hover:text-nebula-hot-pink transition-colors">
                {short.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-stellar-silver text-xs md:text-sm">
                  Click to play • Watch on YouTube
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="cosmic-glow border-nebula-violet/50 text-nebula-violet hover:bg-nebula-violet/20 transition-all duration-300"
                >
                  <a
                    href={short.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 md:gap-2"
                  >
                    <ExternalLink size={12} />
                    <span className="text-xs md:text-sm">Full Video</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 