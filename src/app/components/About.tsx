import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Inquiries } from "./Inquiries";

export const About = () => {
  return (
    <div className="bg-neutral-950 pt-32 text-white">
      {/* Narrative Introduction */}
      <section className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-12">
             <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
             >
                <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase block mb-6">The Silent Architect</span>
                <h2 className="font-serif text-6xl md:text-9xl font-light tracking-tighter leading-none mb-10">
                  The <span className="italic text-neutral-500\">Silent</span> <br /> Architect
                </h2>
                <div className="h-px w-24 bg-red-900 mb-10" />
                <p className="max-w-xl text-sm leading-[2] tracking-[0.15em] text-neutral-400 uppercase">
                  Established in 2026, ATELISTRY emerged as a response to the fragmentation of personal style services. We believe personal identity deserves structure, trust, and thoughtful craftsmanship — not trends or algorithms.
                </p>
                <button className="text-[10px] font-medium tracking-[0.3em] text-white/40 uppercase hover:text-white transition-all mt-8 border-b border-white/5 pb-2">
                  Explore the Narrative
                </button>
             </motion.div>
          </div>
          <div className="lg:col-span-5">
             <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="aspect-[3/4] overflow-hidden grayscale"
             >
                <ImageWithFallback 
                   src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop"
                   alt="Minimalist fashion studio"
                   className="h-full w-full object-cover"
                />
             </motion.div>
          </div>
        </div>
      </section>

      {/* Manifesto Statement */}
      <section className="py-60 bg-neutral-900/30">
         <div className="mx-auto max-w-4xl px-6 text-center">
            <h3 className="font-serif text-3xl md:text-5xl italic font-light text-neutral-200 leading-tight mb-6">
               "We do not merely categorize stylists; we archive visionaries."
            </h3>
            <p className="text-sm tracking-[0.15em] text-neutral-500 mb-12">
               Fashion is the physical manifestation of one's internal dialogue.
            </p>
            <span 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[10px] font-bold tracking-[0.6em] text-[#8B0000] uppercase cursor-pointer hover:text-red-900 transition-all"
            >
              The Atelistry Manifesto
            </span>
         </div>
      </section>

      {/* Core Principles Section */}
      <section className="py-60 mx-auto max-w-7xl px-6 md:px-12">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            <div className="space-y-6">
               <span className="text-red-900 font-serif text-3xl italic">01</span>
               <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase">Uncompromising Quality</h4>
               <p className="text-[11px] leading-loose text-neutral-500 tracking-[0.15em] uppercase">
                  Every stylist on the platform undergoes a considered review process, ensuring professional depth and integrity.
               </p>
            </div>
            <div className="space-y-6 pt-12 md:pt-24">
               <span className="text-red-900 font-serif text-3xl italic">02</span>
               <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase">Global Perspectives</h4>
               <p className="text-[11px] leading-loose text-neutral-500 tracking-[0.15em] uppercase">
                  The ATELISTRY network spans cultures, disciplines, and fashion capitals worldwide.
               </p>
            </div>
            <div className="space-y-6 pt-24 md:pt-48">
               <span className="text-red-900 font-serif text-3xl italic">03</span>
               <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase">Enduring Aesthetic</h4>
               <p className="text-[11px] leading-loose text-neutral-500 tracking-[0.15em] uppercase">
                  We value timeless wardrobes and long-term style evolution over momentary trends.
               </p>
            </div>
         </div>
      </section>

      {/* The Collective */}
      <section className="pb-60 px-6 md:px-12">
         <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row gap-12 items-end justify-between mb-16">
               <h2 className="font-serif text-5xl md:text-8xl font-light tracking-tighter text-white">
                  The <span className="italic text-neutral-500">Collective</span>
               </h2>
               <p className="max-w-xs text-[10px] tracking-[0.25em] text-neutral-600 uppercase leading-relaxed text-right">
                  A discreet internal circle of curators and industry professionals guiding the standards of the ATELISTRY platform.
               </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="aspect-square overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                  <ImageWithFallback 
                     src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop"
                     alt="Industry professional"
                     className="h-full w-full object-cover"
                  />
               </div>
               <div className="aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 mt-12 md:mt-24">
                  <ImageWithFallback 
                     src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop"
                     alt="Creative professional"
                     className="h-full w-full object-cover"
                  />
               </div>
            </div>
         </div>
      </section>

      {/* Concierge Section */}
      <section className="py-60 border-t border-white/5 text-center">
         <div className="mx-auto max-w-2xl px-6">
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-8 tracking-tight">Connect with our <span className="italic text-neutral-500">Concierge</span></h2>
            <p className="text-sm tracking-[0.15em] text-neutral-500 mb-12">
               For private introductions, bespoke requests, and tailored guidance.
            </p>
            <Inquiries>
              <button className="text-[10px] font-bold tracking-[0.6em] text-[#8B0000] uppercase hover:text-red-900 transition-all border-b border-[#8B0000]/30 pb-2">
                 INQUIRIES
              </button>
            </Inquiries>
         </div>
      </section>
    </div>
  );
};