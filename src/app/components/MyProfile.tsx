import React from "react";
import { motion } from "motion/react";

interface MyProfileProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export const MyProfile = ({ onNavigate, onLogout }: MyProfileProps) => {
  // Mock data - would come from backend
  const clientData = {
    name: "Eleanor Richardson",
    city: "New York",
    memberSince: "January 2026",
    styleInterests: ["Minimalist", "Contemporary", "Tailoring"],
    styleDescription:
      "I'm seeking a refined, minimal wardrobe that prioritizes quality over quantity. My aesthetic leans toward architectural silhouettes, neutral palettes, and investment pieces that transcend seasons.",
  };

  const savedStylists = [
    {
      id: "maven",
      name: "Maven Clarke",
      location: "New York, NY",
      specialty: "Editorial & Luxury",
    },
    {
      id: "iris",
      name: "Iris Chen",
      location: "Los Angeles, CA",
      specialty: "Minimalist Wardrobes",
    },
  ];

  const introductions = [
    {
      id: 1,
      stylist: "Sofia Andersen",
      date: "March 10, 2026",
      status: "Active",
      specialty: "Contemporary Tailoring",
    },
  ];

  const requests = [
    {
      id: 1,
      stylist: "Maven Clarke",
      service: "Wardrobe Consultation",
      date: "March 12, 2026",
      status: "Pending Response",
    },
    {
      id: 2,
      stylist: "Iris Chen",
      service: "Personal Shopping",
      date: "February 28, 2026",
      status: "Confirmed",
    },
  ];

  return (
    <div className="min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-32 space-y-3"
        >
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-white">
            My Profile
          </h1>
          <div className="h-px w-12 bg-red-900/40" />
        </motion.div>

        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-40 space-y-12"
        >
          <div className="flex items-end justify-between">
            <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
              Overview
            </h2>
            <button
              onClick={() => onNavigate?.("client-edit-profile")}
              className="text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-colors hover:text-white"
            >
              Edit Profile
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-3">
            <div className="space-y-3">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                Name
              </p>
              <p className="font-serif text-xl font-light text-white">
                {clientData.name}
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                City
              </p>
              <p className="font-serif text-xl font-light text-white">
                {clientData.city}
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                Member Since
              </p>
              <p className="font-serif text-xl font-light text-white">
                {clientData.memberSince}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
              Style Interests
            </p>
            <div className="flex flex-wrap gap-3">
              {clientData.styleInterests.map((interest) => (
                <span
                  key={interest}
                  className="border border-white/10 px-6 py-3 text-[9px] font-medium tracking-[0.3em] text-neutral-400 uppercase"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Style Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-40 space-y-12 border-t border-white/5 pt-20"
        >
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Style Preferences
          </h2>
          
          <p className="max-w-2xl font-serif text-lg font-light leading-relaxed text-neutral-300">
            {clientData.styleDescription}
          </p>
        </motion.div>

        {/* Saved Stylists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-40 space-y-12 border-t border-white/5 pt-20"
        >
          <div className="flex items-end justify-between">
            <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
              Saved Stylists
            </h2>
            <button
              onClick={() => onNavigate?.("platform")}
              className="text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-colors hover:text-white"
            >
              Browse Platform
            </button>
          </div>
          
          <div className="space-y-0">
            {savedStylists.map((stylist, index) => (
              <div
                key={stylist.id}
                className={`group grid grid-cols-1 gap-6 border-b border-white/5 py-10 transition-all hover:bg-neutral-900/20 md:grid-cols-3 md:items-center ${
                  index === 0 ? "border-t" : ""
                }`}
              >
                <div className="space-y-1">
                  <p className="font-serif text-2xl font-light text-white">
                    {stylist.name}
                  </p>
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    {stylist.location}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
                    {stylist.specialty}
                  </p>
                </div>

                <div className="flex justify-start md:justify-end">
                  <button
                    onClick={() => onNavigate?.(`profile-${stylist.id}`)}
                    className="border-b border-white/10 pb-1 text-[9px] font-medium tracking-[0.3em] text-neutral-400 uppercase transition-all hover:border-white hover:text-white"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Introductions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-40 space-y-12 border-t border-white/5 pt-20"
        >
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Introductions
          </h2>
          
          <p className="text-[10px] leading-[2] tracking-[0.2em] text-neutral-600 uppercase">
            Curated stylist introductions facilitated by our concierge team.
          </p>

          <div className="space-y-0">
            {introductions.map((intro, index) => (
              <div
                key={intro.id}
                className={`group grid grid-cols-1 gap-6 border-b border-white/5 py-10 transition-all hover:bg-neutral-900/20 md:grid-cols-4 md:items-center ${
                  index === 0 ? "border-t" : ""
                }`}
              >
                <div className="space-y-1">
                  <p className="font-serif text-2xl font-light text-white">
                    {intro.stylist}
                  </p>
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    {intro.date}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
                    {intro.specialty}
                  </p>
                </div>

                <div>
                  <span className="text-[9px] font-bold tracking-[0.4em] text-emerald-600 uppercase">
                    {intro.status}
                  </span>
                </div>

                <div className="flex justify-start md:justify-end">
                  <button 
                    onClick={() => onNavigate?.("introduction-detail")}
                    className="border-b border-white/10 pb-1 text-[9px] font-medium tracking-[0.3em] text-neutral-400 uppercase transition-all hover:border-white hover:text-white"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="border-t border-white/5 pt-12"
        >
          <button
            onClick={onLogout}
            className="text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-colors hover:text-white"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
};