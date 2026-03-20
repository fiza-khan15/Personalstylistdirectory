import React, { useState } from "react";
import { motion } from "motion/react";

interface IntroductionDetailProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export const IntroductionDetail = ({ onNavigate, onBack }: IntroductionDetailProps) => {
  const [response, setResponse] = useState("");
  const [showResponseArea, setShowResponseArea] = useState(false);

  // Mock data - in production this would come from props or API
  const introduction = {
    stylist: {
      name: "Isabella Chen",
      service: "Personal Styling Consultation",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787"
    },
    status: "Pending Response",
    date: "March 15, 2026",
    clientRequest: "I'm seeking guidance for a complete wardrobe evolution. My professional life has shifted from corporate to creative direction, and I need to align my personal style with this transition. I'm drawn to minimalist silhouettes with architectural details—pieces that speak quietly but with intention. My aesthetic references include The Row, Lemaire, and vintage Jil Sander. I'm looking for someone who understands the language of restraint and can help me curate a wardrobe that reflects confidence without excess.",
    conversation: [
      {
        sender: "Isabella Chen",
        role: "Stylist",
        date: "March 16, 2026",
        message: "Thank you for reaching out. Your vision for this transition resonates deeply with my approach to personal styling. The shift from corporate to creative direction is a significant moment, and your instinct to align your wardrobe with this evolution shows a thoughtful understanding of style as a form of visual communication."
      },
      {
        sender: "Isabella Chen", 
        role: "Stylist",
        date: "March 16, 2026",
        message: "I'd be honored to work with you on this journey. My process begins with understanding not just what you wear, but why—the intention behind each choice. We'll start with a comprehensive wardrobe assessment, followed by curation sessions that focus on building a foundation of essential pieces. Given your references, I believe we'll create something truly distinctive."
      }
    ]
  };

  const handleSubmitResponse = () => {
    if (response.trim()) {
      // Handle response submission
      setResponse("");
      setShowResponseArea(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-32 md:py-48">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        {/* Back Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={onBack}
          className="group mb-20 flex items-center gap-3 text-[9px] font-bold tracking-[0.4em] text-neutral-600 uppercase hover:text-white transition-colors"
        >
          <span className="text-red-900 group-hover:text-red-800 transition-colors">←</span>
          Return to Profile
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-32 space-y-12 border-b border-white/5 pb-20"
        >
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <span className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">Introduction Request</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-white leading-none">
                {introduction.stylist.name}
              </h1>
              <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
                {introduction.stylist.service}
              </p>
            </div>

            <div className="hidden md:block w-32 h-32 overflow-hidden border border-white/10">
              <img 
                src={introduction.stylist.image} 
                alt={introduction.stylist.name}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
            <div className="flex items-center gap-8">
              <div>
                <span className="text-[8px] font-bold tracking-[0.4em] text-neutral-700 uppercase block mb-2">Status</span>
                <span className="text-[10px] font-medium tracking-[0.25em] text-neutral-400 uppercase">{introduction.status}</span>
              </div>
              <div className="h-8 w-[1px] bg-white/5" />
              <div>
                <span className="text-[8px] font-bold tracking-[0.4em] text-neutral-700 uppercase block mb-2">Submitted</span>
                <span className="text-[10px] font-medium tracking-[0.25em] text-neutral-400 uppercase">{introduction.date}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Client Request Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-32 space-y-10"
        >
          <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">Your Request</h2>
          <div className="space-y-8 border-l border-white/5 pl-10">
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-neutral-300 font-light italic">
              {introduction.clientRequest}
            </p>
          </div>
        </motion.div>

        {/* Conversation Section */}
        {introduction.conversation.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-32 space-y-16"
          >
            <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">Correspondence</h2>
            
            <div className="space-y-20">
              {introduction.conversation.map((message, index) => (
                <div key={index} className="space-y-6 border-l border-white/5 pl-10">
                  <div className="flex items-baseline gap-6">
                    <span className="text-[10px] font-medium tracking-[0.3em] text-white uppercase">
                      {message.sender}
                    </span>
                    <span className="text-[8px] font-medium tracking-[0.3em] text-neutral-700 uppercase">
                      {message.role}
                    </span>
                    <span className="text-[8px] tracking-[0.25em] text-neutral-800 uppercase">
                      {message.date}
                    </span>
                  </div>
                  <p className="text-base leading-[1.9] text-neutral-400 max-w-2xl font-light">
                    {message.message}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stylist Response Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-32"
        >
          {!showResponseArea ? (
            <button
              onClick={() => setShowResponseArea(true)}
              className="group flex items-center gap-4 text-[10px] font-bold tracking-[0.4em] text-neutral-600 uppercase hover:text-white transition-colors"
            >
              <span className="text-red-900 group-hover:text-red-800 transition-colors">+</span>
              Continue Correspondence
            </button>
          ) : (
            <div className="space-y-12">
              <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">Your Response</h2>
              
              <div className="space-y-8 border-l border-white/5 pl-10">
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Compose your message..."
                  rows={8}
                  className="w-full bg-transparent border-b border-white/10 py-4 text-base leading-[1.9] text-white placeholder:text-neutral-800 outline-none focus:border-red-900/30 transition-colors resize-none font-light"
                />
                
                <div className="flex items-center gap-8">
                  <button
                    onClick={handleSubmitResponse}
                    disabled={!response.trim()}
                    className="text-[10px] font-bold tracking-[0.4em] text-white uppercase hover:text-red-900 transition-colors disabled:text-neutral-800 disabled:cursor-not-allowed"
                  >
                    Send Response
                  </button>
                  <button
                    onClick={() => {
                      setShowResponseArea(false);
                      setResponse("");
                    }}
                    className="text-[10px] font-medium tracking-[0.4em] text-neutral-700 uppercase hover:text-neutral-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-8 border-t border-white/5 pt-20"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <button className="group relative px-12 py-6 text-[10px] font-bold tracking-[0.4em] text-white uppercase border border-white/10 hover:border-red-900/30 transition-all overflow-hidden">
              <span className="relative z-10">Schedule Consultation</span>
              <div className="absolute inset-0 bg-red-900/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
            
            <button className="px-12 py-6 text-[10px] font-medium tracking-[0.4em] text-neutral-600 uppercase hover:text-white transition-colors">
              View Full Profile
            </button>
          </div>

          <p className="text-[9px] leading-[2] tracking-[0.2em] text-neutral-800 uppercase max-w-xl">
            This introduction allows you to establish a dialogue with your selected stylist. Continue the correspondence to refine your collaboration or schedule a formal consultation.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
