import React from "react";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="border-t border-white/5 bg-neutral-950 py-32 text-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-20 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <button 
              onClick={() => {
                onNavigate?.("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="font-serif text-2xl tracking-[0.3em] text-white uppercase font-light cursor-pointer hover:text-red-900 transition-colors block text-left outline-none"
            >
              ATELISTRY
            </button>
            <p className="max-w-xs text-[10px] leading-[2] tracking-[0.2em] text-neutral-600 uppercase">
              The premier destination for the world's most talented fashion visionaries. Founded in 2026.
            </p>
          </div>
          
          <div>
            <h4 className="mb-8 text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">The Brand</h4>
            <ul className="space-y-4 text-[10px] font-medium text-neutral-500 uppercase tracking-[0.3em]">
              <li><button onClick={() => onNavigate?.("home")} className="hover:text-white transition-colors cursor-pointer">Home</button></li>
              <li><button onClick={() => onNavigate?.("narrative")} className="hover:text-white transition-colors cursor-pointer text-left">The Narrative</button></li>
              <li><button onClick={() => onNavigate?.("platform")} className="hover:text-white transition-colors cursor-pointer text-left">Platform</button></li>
              <li><button onClick={() => onNavigate?.("journal")} className="hover:text-white transition-colors cursor-pointer text-left">Journal</button></li>
              <li><button onClick={() => onNavigate?.("access-hub")} className="hover:text-white transition-colors cursor-pointer text-left">Access ATELISTRY</button></li>
              <li><button onClick={() => onNavigate?.("my-profile")} className="hover:text-white transition-colors cursor-pointer text-left">Client Profile</button></li>
              <li><button onClick={() => onNavigate?.("dashboard")} className="hover:text-white transition-colors cursor-pointer text-left">Dashboard</button></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-8 text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">Social</h4>
            <ul className="space-y-4 text-[10px] font-medium text-neutral-500 uppercase tracking-[0.3em]">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pinterest</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-32 border-t border-white/5 pt-12 text-[9px] font-medium tracking-[0.3em] text-neutral-800 uppercase text-center md:text-left">
          <p>© 2026 ATELISTRY. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};