import React, { useState, useMemo, useEffect } from "react";
import { StylistCard } from "./StylistCard";
import { motion } from "motion/react";
import { Inquiries } from "./Inquiries";
import { supabase } from "@/lib/supabase";

interface StylistProfile {
  id: string;
  user_id: string;
  name: string;
  city: string;
  professional_title: string;
  specialties: string[] | string;
}

export const Directory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stylists, setStylists] = useState<StylistProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_type", "stylist")
          .eq("availability", true)
          .eq("profile_status", "Active")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch stylists:", error);
          setStylists([]);
        } else {
          console.log("Stylists loaded:", data?.length || 0);
          setStylists(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching stylists:", err);
        setStylists([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStylists();
  }, []);

  const filteredStylists = useMemo(() => {
    if (!searchQuery) return stylists;
    return stylists.filter((s) => {
      const matchesName = s.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = s.city?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTitle = s.professional_title?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Handle specialties as array or string
      const specialtiesArray = Array.isArray(s.specialties) ? s.specialties : [];
      const matchesSpecialties = specialtiesArray.some(spec => 
        spec?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return matchesName || matchesCity || matchesTitle || matchesSpecialties;
    });
  }, [searchQuery, stylists]);

  return (
    <div className="bg-neutral-950 pt-32 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 md:px-12 py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="max-w-4xl space-y-12"
        >
          <div className="h-px w-16 bg-red-900" />
          <h1 className="font-serif text-6xl md:text-8xl font-light leading-[1] tracking-tighter text-white">
            A Platform for <br />
            <span className="italic text-neutral-400">Considered Connection</span>
          </h1>
          <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400 max-w-2xl">
            ATELISTRY brings structure, clarity, and trust to the process of working with a personal stylist — beyond search, beyond social media.
          </p>
        </motion.div>
      </section>

      {/* What Exists Here */}
      <section className="py-60 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-24">
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">What Exists Here</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            <div className="space-y-6">
              <h3 className="font-serif text-3xl font-light text-white">Discovery</h3>
              <p className="text-[11px] leading-loose text-neutral-500 tracking-[0.15em] uppercase">
                Explore a curated network of personal stylists, image consultants, and wardrobe specialists — presented with clarity, context, and intention.
              </p>
            </div>
            <div className="space-y-6 pt-12 md:pt-24">
              <h3 className="font-serif text-3xl font-light text-white">Connection</h3>
              <p className="text-[11px] leading-loose text-neutral-500 tracking-[0.15em] uppercase">
                Engage directly or through concierge support to build meaningful, long-term stylist relationships.
              </p>
            </div>
            <div className="space-y-6 pt-24 md:pt-48">
              <h3 className="font-serif text-3xl font-light text-white">Continuity</h3>
              <p className="text-[11px] leading-loose text-neutral-500 tracking-[0.15em] uppercase">
                ATELISTRY is designed for evolving needs — not one-time transactions, but ongoing collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Difference */}
      <section className="py-60 bg-neutral-900/20 border-y border-white/5">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-12">
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">Beyond Search. Beyond Scrolling.</span>
            <h2 className="font-serif text-5xl md:text-7xl font-light leading-tight text-white">
              Beyond Search. <br />
              <span className="italic text-neutral-500">Beyond Scrolling.</span>
            </h2>
            <div className="h-px w-24 bg-red-900" />
            <div className="space-y-8">
              <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400">
                Finding a stylist should not feel accidental. ATELISTRY replaces fragmented searches and social noise with structure, discretion, and thoughtful presentation.
              </p>
              <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400">
                Every professional is reviewed, contextualized, and positioned with care — allowing individuals to engage with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Network */}
      <section className="py-60 mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <div className="space-y-6">
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">The Network</span>
            <h2 className="font-serif text-5xl md:text-7xl font-light tracking-tighter text-white">
              The <span className="italic text-neutral-500">Network</span>
            </h2>
          </div>
          <p className="text-[11px] leading-loose text-neutral-500 tracking-[0.15em] uppercase max-w-md">
            ATELISTRY brings together independent professionals across disciplines, regions, and aesthetics — united by depth of practice and clarity of vision.
          </p>
        </div>

        {/* Optional minimal search */}
        <div className="mb-16 max-w-md">
          <input
            type="text"
            placeholder="SEARCH BY NAME, LOCATION, OR DISCIPLINE"
            className="w-full border-b border-white/10 bg-transparent py-4 text-[10px] font-medium tracking-[0.3em] text-white uppercase outline-none placeholder:text-neutral-700 focus:border-red-900 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Stylist Grid */}
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
            <p className="font-serif text-xl italic text-neutral-600">Loading stylists...</p>
          </div>
        ) : filteredStylists.length === 0 && !searchQuery ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
            <p className="font-serif text-xl italic text-neutral-600">No stylists available yet.</p>
          </div>
        ) : filteredStylists.length === 0 && searchQuery ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
            <p className="font-serif text-xl italic text-neutral-600">No results found.</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-[10px] font-bold tracking-[0.4em] text-red-900 uppercase border-b border-red-900/20 pb-1"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-32 sm:grid-cols-2 lg:grid-cols-4">
            {filteredStylists.map((stylist) => (
              <StylistCard key={stylist.id} stylist={stylist} />
            ))}
          </div>
        )}
      </section>

      {/* Ways to Engage */}
      <section className="py-60 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
            <div className="space-y-12">
              <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">Ways to Engage</span>
              <h2 className="font-serif text-5xl md:text-6xl font-light leading-tight text-white">
                Ways to <span className="italic text-neutral-500">Engage</span>
              </h2>
              <div className="h-px w-24 bg-red-900" />
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm tracking-[0.1em] text-white">Direct stylist inquiries</h4>
                <p className="text-[11px] leading-loose text-neutral-600 tracking-[0.1em]">
                  Connect directly with professionals whose practice aligns with your vision.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm tracking-[0.1em] text-white">Concierge-led introductions</h4>
                <p className="text-[11px] leading-loose text-neutral-600 tracking-[0.1em]">
                  Let our team guide you to the ideal stylist match based on your needs.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm tracking-[0.1em] text-white">Ongoing professional relationships</h4>
                <p className="text-[11px] leading-loose text-neutral-600 tracking-[0.1em]">
                  Build continuity with stylists who understand your evolving aesthetic.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm tracking-[0.1em] text-white">Future collaborative tools and services</h4>
                <p className="text-[11px] leading-loose text-neutral-600 tracking-[0.1em]">
                  An evolving platform designed to grow with the community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built on Trust */}
      <section className="py-60 bg-neutral-900/20 border-y border-white/5">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="space-y-12">
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">Built on Trust</span>
            <h2 className="font-serif text-5xl md:text-6xl font-light leading-tight text-white">
              Built on <span className="italic text-neutral-500">Trust</span>
            </h2>
            <div className="mx-auto h-px w-24 bg-red-900" />
            <div className="space-y-8 max-w-2xl mx-auto">
              <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400">
                ATELISTRY is intentionally curated. Admission is selective, presentation is considered, and relationships are respected.
              </p>
              <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400">
                This is a platform designed to grow with its community — not overwhelm it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition CTA */}
      <section className="py-60 text-center">
        <div className="mx-auto max-w-3xl px-6 space-y-12">
          <p className="text-sm tracking-[0.2em] text-neutral-400 uppercase">
            ATELISTRY is not designed for browsing. It is designed for alignment.
          </p>
          <div className="flex gap-8 justify-center text-[10px] font-medium tracking-[0.3em] uppercase">
            <button 
              onClick={() => window.scrollTo({ top: document.querySelector('#directory')?.getBoundingClientRect().top || 0, behavior: 'smooth' })}
              className="text-white/40 hover:text-white transition-all border-b border-white/5 pb-2"
            >
              Explore the Network
            </button>
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