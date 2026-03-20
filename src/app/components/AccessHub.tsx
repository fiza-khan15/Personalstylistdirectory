import React from "react";
import { motion } from "motion/react";

interface AccessHubProps {
  onNavigate?: (page: string) => void;
}

export const AccessHub = ({ onNavigate }: AccessHubProps) => {
  return (
    <div className="bg-neutral-950 pt-32 text-white overflow-hidden">
      {/* Page Header */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="max-w-4xl space-y-12 text-center mx-auto"
        >
          <div className="mx-auto h-px w-16 bg-red-900" />
          <h1 className="font-serif text-6xl md:text-8xl font-light leading-[1] tracking-tighter text-white">
            Join <span className="italic text-neutral-400">ATELISTRY</span>
          </h1>
          <p className="text-sm leading-[2.2] tracking-[0.15em] text-neutral-400 max-w-2xl mx-auto">
            A considered space for those who shape identity — and those seeking to define it.
          </p>
        </motion.div>
      </section>

      {/* Split Section - Two Paths */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-40 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* LEFT PATH - For Clients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            viewport={{ once: true }}
            className="border border-white/5 bg-neutral-900/20 p-12 md:p-16 space-y-12"
          >
            <div className="space-y-6">
              <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">
                Path One
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-white">
                For Those Seeking <br />
                <span className="italic text-neutral-500">a Stylist</span>
              </h2>
            </div>

            <p className="text-sm leading-[2.2] tracking-[0.05em] text-neutral-400">
              ATELISTRY connects individuals with experienced personal stylists and image consultants through a curated, trust-led process. This is not a marketplace — it is a guided introduction.
            </p>

            <div className="space-y-6 border-l border-white/10 pl-8">
              <div className="space-y-2">
                <p className="text-xs tracking-[0.1em] text-neutral-300">
                  Verified professionals only
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-[0.1em] text-neutral-300">
                  Discreet and considered introductions
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-[0.1em] text-neutral-300">
                  Long-term style thinking, not trends
                </p>
              </div>
            </div>

            <div className="pt-8 space-y-6">
              <button
                onClick={() => onNavigate?.("access")}
                className="w-full px-12 py-6 border border-white/10 text-[10px] font-bold tracking-[0.5em] text-white uppercase hover:bg-white hover:text-black transition-all"
              >
                Request Access
              </button>
              <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase text-center">
                Handled through our concierge
              </p>
            </div>
          </motion.div>

          {/* RIGHT PATH - For Stylists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            viewport={{ once: true }}
            className="border border-white/5 bg-neutral-900/20 p-12 md:p-16 space-y-12"
          >
            <div className="space-y-6">
              <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">
                Path Two
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-white">
                For Stylists & <br />
                <span className="italic text-neutral-500">Image Consultants</span>
              </h2>
            </div>

            <p className="text-sm leading-[2.2] tracking-[0.05em] text-neutral-400">
              ATELISTRY is a professional network for stylists who approach fashion as craft, strategy, and dialogue. Membership is selective and editorially guided.
            </p>

            <div className="space-y-6 border-l border-white/10 pl-8">
              <div className="space-y-2">
                <p className="text-xs tracking-[0.1em] text-neutral-300">
                  No bidding or price competition
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-[0.1em] text-neutral-300">
                  Clients introduced with context
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-[0.1em] text-neutral-300">
                  Professional positioning, not exposure chasing
                </p>
              </div>
            </div>

            <div className="pt-8 space-y-6">
              <button
                onClick={() => onNavigate?.("stylist-application")}
                className="w-full px-12 py-6 border border-white/10 text-[10px] font-bold tracking-[0.5em] text-white uppercase hover:bg-white hover:text-black transition-all"
              >
                Apply for Access
              </button>
              <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase text-center">
                Applications are reviewed
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Note */}
      <section className="py-60 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm leading-[2.2] tracking-[0.15em] text-neutral-500 uppercase">
            ATELISTRY is intentionally built with restraint. We value clarity, discretion, and integrity over scale.
          </p>
        </div>
      </section>
    </div>
  );
};
