import React from "react";
import { unsplash_tool } from "@/lib/unsplash";

export const Journal = () => {
  return (
    <div className="py-60">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-24 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.6em] text-red-900 uppercase">THE JOURNAL</span>
          <h2 className="font-serif text-6xl font-light italic text-white tracking-tighter">Editorial <br />Perspective</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {[
            { title: "The Rise of Minimal Luxury", date: "FEB 2026", category: "TREND REPORT" },
            { title: "Personal Branding in the Digital Age", date: "JAN 2026", category: "REFLECTION" },
            { title: "Curating a Capsule Wardrobe", date: "DEC 2025", category: "GUIDE" },
            { title: "The Return of Quiet Confidence", date: "NOV 2025", category: "EDITORIAL" },
          ].map((item, i) => (
            <div key={i} className="group space-y-6 cursor-pointer">
              <div className="aspect-[4/3] bg-neutral-900 overflow-hidden">
                <div className="h-full w-full bg-neutral-800" />
              </div>
              <div className="space-y-3">
                <p className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">{item.category}</p>
                <h3 className="font-serif text-2xl font-light text-white tracking-tight group-hover:text-neutral-400 transition-colors">{item.title}</h3>
                <p className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
