import React, { useState } from "react";
import { motion } from "motion/react";

interface StylistIntroductionDetailProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export const StylistIntroductionDetail = ({ onNavigate, onBack }: StylistIntroductionDetailProps) => {
  const [response, setResponse] = useState("");

  // Mock data - would come from backend
  const introduction = {
    clientName: "Eleanor Richardson",
    serviceType: "Wardrobe Consultation",
    status: "pending",
    date: "March 15, 2026",
    request: "I'm seeking guidance in refining my professional wardrobe. My aesthetic leans toward architectural silhouettes and neutral palettes, but I find myself uncertain about maintaining cohesion across seasons. I'm interested in developing a core wardrobe that prioritizes quality and longevity over trend-driven pieces.",
    location: "New York, NY",
    timeline: "Available April 2026",
    styleDirection: "Minimalist, Contemporary, Investment Pieces",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-600";
      case "active":
        return "text-emerald-600";
      case "closed":
        return "text-neutral-500";
      default:
        return "text-neutral-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "active":
        return "Active";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-20 space-y-8"
        >
          <div className="space-y-3">
            <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-white">
              {introduction.clientName}
            </h1>
            <div className="h-px w-12 bg-red-900/40" />
          </div>
          
          <div className="flex flex-wrap items-center gap-8">
            <div className="space-y-1">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                Service Type
              </p>
              <p className="text-[11px] font-light tracking-[0.2em] text-neutral-300 uppercase">
                {introduction.serviceType}
              </p>
            </div>
            
            <div className="h-8 w-px bg-white/5" />
            
            <div className="space-y-1">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                Status
              </p>
              <p className={`text-[11px] font-bold tracking-[0.3em] uppercase ${getStatusColor(introduction.status)}`}>
                {getStatusLabel(introduction.status)}
              </p>
            </div>

            <div className="h-8 w-px bg-white/5" />
            
            <div className="space-y-1">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                Received
              </p>
              <p className="text-[11px] font-light tracking-[0.2em] text-neutral-300 uppercase">
                {introduction.date}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Client Request */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-24 space-y-8 border-t border-white/5 pt-16"
        >
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Client Request
          </h2>
          
          <p className="font-serif text-lg font-light leading-relaxed text-neutral-300">
            {introduction.request}
          </p>
        </motion.div>

        {/* Client Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-24 space-y-12 border-t border-white/5 pt-16"
        >
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Client Context
          </h2>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="space-y-3">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                Location
              </p>
              <p className="font-serif text-xl font-light text-white">
                {introduction.location}
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                Timeline
              </p>
              <p className="font-serif text-xl font-light text-white">
                {introduction.timeline}
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                Style Direction
              </p>
              <p className="font-serif text-xl font-light text-white">
                {introduction.styleDirection}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Response Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-24 space-y-8 border-t border-white/5 pt-16"
        >
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Your Response
          </h2>
          
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Compose your response to the client..."
            className="w-full min-h-[240px] resize-none border border-white/5 bg-neutral-900/30 px-8 py-6 font-serif text-base font-light leading-relaxed text-white placeholder:text-neutral-600 focus:border-white/10 focus:outline-none transition-colors"
          />
          
          <p className="text-[9px] tracking-[0.2em] text-neutral-600 uppercase">
            This message will be shared with the client through ATELISTRY concierge.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-8 border-t border-white/5 pt-16"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <button className="group border border-white bg-white px-12 py-5 text-[9px] font-bold tracking-[0.4em] text-neutral-950 uppercase transition-all hover:bg-transparent hover:text-white">
              Accept Introduction
            </button>
            
            <button className="group border border-white/20 px-12 py-5 text-[9px] font-bold tracking-[0.4em] text-white uppercase transition-all hover:border-white hover:bg-white hover:text-neutral-950">
              Respond
            </button>
            
            <button className="text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-colors hover:text-white md:ml-auto">
              Decline
            </button>
          </div>
        </motion.div>

        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-24 border-t border-white/5 pt-12"
        >
          <button
            onClick={onBack}
            className="text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-colors hover:text-white"
          >
            ← Back to Introductions
          </button>
        </motion.div>
      </div>
    </div>
  );
};
