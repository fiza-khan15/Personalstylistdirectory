import React from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Inquiries } from "./Inquiries";

export const Narrative = () => {
  return (
    <div className="bg-neutral-950 pt-32 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full px-6 md:px-12 flex items-center">
        <div className="mx-auto max-w-7xl w-full relative z-10 py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="max-w-4xl space-y-12"
          >
            <div className="h-px w-16 bg-red-900" />
            <h1 className="font-serif text-6xl md:text-[9rem] font-light leading-[0.9] tracking-tighter text-white">
              Refining the <br />
              <span className="italic text-neutral-400">Visual Dialogue</span>
            </h1>
            <p className="text-sm tracking-[0.2em] text-neutral-500 uppercase max-w-xl">
              A considered philosophy for personal style in an age of noise.
            </p>
          </motion.div>
        </div>
        
        {/* Background Image */}
        <div className="absolute top-0 right-0 w-1/2 h-full grayscale opacity-30">
            <ImageWithFallback 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
                alt="Minimalist fashion background"
                className="h-full w-full object-cover"
            />
        </div>
      </section>

      {/* Foundational Quote */}
      <section className="mx-auto max-w-5xl py-60 px-6 text-center border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <p className="font-serif text-3xl md:text-5xl italic leading-tight text-neutral-300 font-light">
            "Style is a silent language, spoken through the curation of identity."
          </p>
          <div className="mx-auto h-[1px] w-12 bg-neutral-800" />
          <p className="text-[9px] font-bold tracking-[0.6em] text-red-900 uppercase">
            The Atelistry Philosophy
          </p>
        </motion.div>
      </section>

      {/* Origins: Our Narrative */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2 }}
            viewport={{ once: true }}
            className="aspect-[4/5] bg-neutral-900 overflow-hidden grayscale"
          >
            <ImageWithFallback 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920"
                alt="Craftsmanship"
                className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="space-y-12">
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">Our Narrative</span>
            <h2 className="font-serif text-5xl md:text-7xl font-light leading-tight text-white">
              Our <span className="italic text-neutral-500">Narrative</span>
            </h2>
            <div className="h-px w-24 bg-red-900" />
            <div className="space-y-8">
              <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400">
                ATELISTRY was established in 2026 as a response to the fragmented and performative nature of modern style culture. While fashion became louder, finding thoughtful personal guidance became increasingly difficult.
              </p>
              <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400">
                We believe personal style is not discovered through trends, shortcuts, or endless content — but through intentional collaboration with professionals who understand identity, lifestyle, and context.
              </p>
              <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400">
                ATELISTRY exists to bring structure, trust, and discretion to the process of working with a personal stylist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Role of the Stylist: The Silent Architect */}
      <section className="bg-neutral-900/20 py-60 border-y border-white/5">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">The Silent Architect</span>
            <h3 className="font-serif text-5xl md:text-7xl font-light tracking-tight leading-tight text-white">
              The Silent <span className="italic text-neutral-500">Architect</span>
            </h3>
            <div className="h-px w-24 bg-red-900" />
            <div className="space-y-8">
              <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400">
                A personal stylist is not a curator of outfits, but an architect of presence. Their work exists quietly — shaping how individuals move through professional, social, and personal spaces.
              </p>
              <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400">
                ATELISTRY recognizes and elevates stylists who practice with depth, restraint, and long-term vision.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Manifesto Statement */}
      <section className="py-60">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h3 className="font-serif text-4xl md:text-6xl italic font-light text-neutral-200 leading-tight">
              "We do not merely categorize stylists; we archive visionaries."
            </h3>
            <p className="text-sm tracking-[0.15em] text-neutral-500">
              Those who understand that fashion is the physical manifestation of one's internal dialogue.
            </p>
            <div className="mx-auto h-[1px] w-12 bg-neutral-800" />
            <p className="text-[9px] font-bold tracking-[0.6em] text-red-900 uppercase">
              The Atelistry Manifesto
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Principles */}
      <section className="py-60 mx-auto max-w-7xl px-6 md:px-12 border-t border-white/5">
        <div className="mb-24">
          <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">Our Principles</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
          <div className="space-y-6">
            <span className="text-red-900 font-serif text-3xl italic">01</span>
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase">Uncompromising Quality</h4>
            <p className="text-[11px] leading-loose text-neutral-500 tracking-[0.15em] uppercase">
              Every professional on the ATELISTRY platform undergoes a considered review process. We prioritize experience, clarity of practice, and ethical professionalism.
            </p>
          </div>
          <div className="space-y-6 pt-12 md:pt-24">
            <span className="text-red-900 font-serif text-3xl italic">02</span>
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase">Global Perspectives</h4>
            <p className="text-[11px] leading-loose text-neutral-500 tracking-[0.15em] uppercase">
              Style is cultural, contextual, and personal. ATELISTRY embraces diverse perspectives across regions, disciplines, and identities.
            </p>
          </div>
          <div className="space-y-6 pt-24 md:pt-48">
            <span className="text-red-900 font-serif text-3xl italic">03</span>
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase">Enduring Aesthetic</h4>
            <p className="text-[11px] leading-loose text-neutral-500 tracking-[0.15em] uppercase">
              We value longevity over novelty, refinement over excess, and wardrobes built to evolve with life.
            </p>
          </div>
        </div>
      </section>

      {/* Curation & Trust */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
          <div className="lg:col-span-5 space-y-12">
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">Curation as Responsibility</span>
            <h2 className="font-serif text-5xl md:text-7xl font-light leading-tight text-white">
              Curation as <span className="italic text-neutral-500">Responsibility</span>
            </h2>
            <div className="h-px w-24 bg-red-900" />
            <div className="space-y-8">
              <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400">
                Trust is not built through volume. It is built through discernment.
              </p>
              <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400">
                ATELISTRY is intentionally curated. Each stylist is reviewed, contextualized, and presented with clarity — allowing individuals to engage with confidence rather than uncertainty.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-8">
            <div className="aspect-[3/4] overflow-hidden grayscale mt-24">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1539109132381-3151b8a74514?q=80&w=1920"
                alt="Fashion detail"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden grayscale">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920"
                alt="Model detail"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Transition to the Platform */}
      <section className="py-60 border-t border-white/5 text-center">
        <div className="mx-auto max-w-3xl px-6 space-y-12">
          <p className="text-sm tracking-[0.2em] text-neutral-400 uppercase">
            ATELISTRY is not a destination for browsing. It is a space for considered connection.
          </p>
          <div className="flex gap-8 justify-center text-[10px] font-medium tracking-[0.3em] uppercase">
            <Link 
              to="/directory"
              className="text-white/40 hover:text-white transition-all border-b border-white/5 pb-2"
            >
              Explore the Platform
            </Link>
            <span className="text-neutral-700">·</span>
            <Inquiries>
              <button className="text-white/40 hover:text-white transition-all border-b border-white/5 pb-2">
                Connect with Concierge
              </button>
            </Inquiries>
          </div>
        </div>
      </section>
    </div>
  );
};