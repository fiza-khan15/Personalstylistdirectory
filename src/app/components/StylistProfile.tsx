import React from "react";
import { motion } from "motion/react";
import { Stylist } from "@/app/data/stylists";
import { Inquiries } from "./Inquiries";

interface StylistProfileProps {
  stylist: Stylist;
  onNavigate?: (page: string) => void;
}

export const StylistProfile = ({ stylist, onNavigate }: StylistProfileProps) => {
  return (
    <div className="bg-neutral-950 pt-32 text-white overflow-hidden">
      {/* Header Section */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
          {/* Left: Name and Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="space-y-12"
          >
            <div className="h-px w-16 bg-red-900" />
            <div className="space-y-6">
              <h1 className="font-serif text-6xl md:text-7xl font-light tracking-tight text-white">
                {stylist.name}
              </h1>
              <p className="text-sm tracking-[0.15em] text-neutral-400 uppercase">
                {stylist.title}
              </p>
              <div className="flex items-center gap-3 text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
                <span className="text-neutral-700">Based in —</span>
                <span>{stylist.location}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="aspect-[4/5] bg-neutral-900 overflow-hidden grayscale"
          >
            <img
              src={stylist.imageUrl}
              alt={stylist.name}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Profile Introduction */}
      <section className="mx-auto max-w-4xl px-6 md:px-12 py-40 border-t border-white/5">
        <div className="space-y-12">
          <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Profile
          </span>
          <p className="text-sm leading-[2.2] tracking-[0.05em] text-neutral-300">
            {stylist.profileIntro || stylist.bio}
          </p>
        </div>
      </section>

      {/* Areas of Practice */}
      {stylist.areasOfPractice && stylist.areasOfPractice.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 md:px-12 py-40 border-t border-white/5">
          <div className="space-y-12">
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">
              Areas of Practice
            </span>
            <ul className="space-y-6">
              {stylist.areasOfPractice.map((area, index) => (
                <li
                  key={index}
                  className="text-sm tracking-[0.1em] text-neutral-400 border-l-[1px] border-white/10 pl-6"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Approach & Philosophy */}
      {stylist.approach && (
        <section className="bg-neutral-900/20 py-60 border-y border-white/5">
          <div className="mx-auto max-w-4xl px-6 md:px-12">
            <div className="space-y-12">
              <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">
                Approach
              </span>
              <p className="text-sm leading-[2.2] tracking-[0.05em] text-neutral-300">
                {stylist.approach}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Who They Work With */}
      {stylist.clientContext && stylist.clientContext.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 md:px-12 py-40">
          <div className="space-y-12">
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">
              Who They Work With
            </span>
            <div className="flex flex-wrap gap-8">
              {stylist.clientContext.map((context, index) => (
                <span
                  key={index}
                  className="text-sm tracking-[0.1em] text-neutral-400 italic"
                >
                  {context}
                  {index < stylist.clientContext!.length - 1 && (
                    <span className="mx-4 text-neutral-700">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Engagement Options */}
      <section className="mx-auto max-w-4xl px-6 md:px-12 py-40 border-t border-white/5">
        <div className="space-y-12">
          <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Engagement
          </span>
          <p className="text-sm leading-[2.2] tracking-[0.05em] text-neutral-400">
            Engagements vary based on needs, context, and duration. Introductions may be
            initiated directly or facilitated through ATELISTRY's concierge.
          </p>
        </div>
      </section>

      {/* Trust & Verification */}
      <section className="mx-auto max-w-4xl px-6 md:px-12 py-20">
        <p className="text-[10px] leading-loose tracking-[0.2em] text-neutral-600 uppercase">
          This professional is part of the ATELISTRY network and has been reviewed for
          experience, clarity of practice, and professional integrity.
        </p>
      </section>

      {/* Primary Actions */}
      <section className="mx-auto max-w-4xl px-6 md:px-12 py-40 border-t border-white/5">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <Inquiries>
            <button className="px-16 py-6 border border-white/10 text-[10px] font-bold tracking-[0.5em] text-white uppercase hover:bg-white hover:text-black transition-all">
              Request Introduction
            </button>
          </Inquiries>
          <button className="text-[10px] font-medium tracking-[0.3em] text-white/40 uppercase hover:text-white transition-all border-b border-white/5 pb-2">
            Save Stylist
          </button>
        </div>
      </section>

      {/* Back to Network */}
      <section className="py-40 text-center border-t border-white/5">
        <button
          onClick={() => onNavigate?.("directory")}
          className="text-[10px] font-medium tracking-[0.3em] text-neutral-600 uppercase hover:text-white transition-all"
        >
          ← Back to Network
        </button>
      </section>
    </div>
  );
};