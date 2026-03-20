import React from "react";
import { Stylist } from "@/app/data/stylists";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface StylistCardProps {
  stylist: Stylist;
  onNavigate?: (page: string) => void;
}

export const StylistCard = ({ stylist, onNavigate }: StylistCardProps) => {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate(`profile-${stylist.id}`);
    }
  };

  return (
    <div className="group relative flex flex-col space-y-6 cursor-pointer" onClick={handleClick}>
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-white/5">
        <ImageWithFallback
          src={stylist.imageUrl}
          alt={stylist.name}
          className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-neutral-950/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-center justify-center">
            <div className="text-[10px] font-bold tracking-[0.4em] text-white uppercase border border-white/20 px-6 py-3 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all">
                View Profile
            </div>
        </div>
      </div>
      
      <div className="space-y-1 text-center lg:text-left">
        <h3 className="font-serif text-lg tracking-wide text-white font-light group-hover:text-red-900 transition-colors">
          {stylist.name}
        </h3>
        <p className="text-[9px] font-medium tracking-[0.2em] text-neutral-500 uppercase">
          {stylist.title} — {stylist.location}
        </p>
      </div>
    </div>
  );
};