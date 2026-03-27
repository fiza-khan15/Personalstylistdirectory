import React from "react";
import { Hero } from "./Hero";
import { About } from "./About";
import { Inquiries } from "./Inquiries";

const FeaturedInsight = () => {
  return (
    <section className="bg-neutral-950 py-60 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-12 text-center">
        <div className="space-y-12">
          <span className="text-[10px] font-bold tracking-[0.6em] text-red-900 uppercase">THE JOURNAL</span>
          <h2 className="font-serif text-5xl md:text-8xl font-light tracking-tighter text-white leading-none">
            The Art of <br />
            <span className="italic text-neutral-500 pl-12">Restraint</span>
          </h2>
          <div className="mx-auto h-[1px] w-24 bg-red-900" />
          <p className="mx-auto max-w-xl text-xs leading-[2] tracking-[0.15em] text-neutral-500 uppercase">
            A considered exploration of modern personal style.
          </p>
          <button className="text-[10px] font-medium tracking-[0.4em] text-white/40 uppercase hover:text-white transition-all border-b border-white/5 pb-2">
            Read Entry
          </button>
        </div>
      </div>
    </section>
  );
};

export const LandingPage = () => (
  <div>
    <Hero />
    
    {/* Quote Section (The Manifesto) */}
    <section className="mx-auto max-w-5xl py-60 px-6 text-center">
      <div className="space-y-10">
        <p className="font-serif text-3xl md:text-5xl italic leading-tight text-neutral-300 font-light">
          "Style is a silent language, spoken through the curation of identity."
        </p>
        <div className="mx-auto h-[1px] w-12 bg-neutral-800" />
        <p 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-[9px] font-bold tracking-[0.6em] text-red-900 uppercase cursor-pointer hover:opacity-70 transition-opacity"
        >
          The Atelistry Philosophy
        </p>
      </div>
    </section>

    <About />
    
    <FeaturedInsight />
    
    {/* Newsletter (Subscription) */}
    <section className="bg-neutral-950 py-60 border-t border-white/5">
      <div className="mx-auto max-w-xl px-6 text-center">
        <h2 className="mb-6 font-serif text-4xl font-light tracking-tight text-white">
          The Weekly <span className="italic text-neutral-500">Dialogue</span>
        </h2>
        <p className="text-xs tracking-[0.15em] text-neutral-500 uppercase mb-12">
          Occasional reflections on style, identity, and intention.
        </p>
        <form className="flex flex-col gap-12 items-center">
          <input
            type="email"
            placeholder="YOUR EMAIL"
            className="w-full border-b border-white/10 bg-transparent py-4 text-center text-[10px] font-bold tracking-[0.4em] text-white uppercase outline-none focus:border-red-900 transition-colors"
            required
          />
          <button
            type="submit"
            className="text-[10px] font-bold tracking-[0.5em] text-white/40 uppercase hover:text-white transition-all border-b border-white/5 pb-2"
          >
            Join the Network
          </button>
        </form>
      </div>
    </section>
  </div>
);
