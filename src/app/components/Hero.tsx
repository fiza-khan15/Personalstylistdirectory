import React from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { motion } from "motion/react";

export const Hero = () => {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-950 pt-20">
      <div className="mx-auto flex max-w-7xl w-full px-6 md:px-12 items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="z-10 order-2 lg:order-1"
          >
            <div className="mb-8 h-px w-12 bg-red-900" />
            <h1 className="mb-8 font-serif text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.1]">
              Refining the <br />
              <span className="italic text-neutral-400">Visual Dialogue</span>
            </h1>
            <p className="mb-12 max-w-lg text-xs leading-[1.8] tracking-[0.15em] text-neutral-500 uppercase">
              A curated global platform connecting visionary personal stylists with individuals who value identity, intention, and discretion.
            </p>
            <div className="flex gap-8 text-[10px] font-medium tracking-[0.3em] uppercase">
              <Link 
                to="/directory"
                className="text-white/40 hover:text-white transition-all"
              >
                The Platform
              </Link>
              <span className="text-neutral-700">·</span>
              <Link 
                to="/narrative"
                className="text-white/40 hover:text-white transition-all"
              >
                The Narrative
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="relative aspect-[4/5] overflow-hidden order-1 lg:order-2 bg-neutral-900"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
              alt="Minimal luxury fashion"
              className="h-full w-full object-cover grayscale transition-transform duration-[3s] hover:scale-105"
            />
            <div className="absolute inset-0 bg-neutral-950/20" />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};