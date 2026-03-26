import React from "react";
import { Link } from "react-router";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-neutral-950 py-32 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-20 px-6 md:grid-cols-4 md:px-12">
        {/* Branding */}
        <div className="space-y-8">
          <Link 
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer font-serif text-3xl tracking-[0.2em] text-white uppercase font-light hover:text-red-900 transition-all duration-500"
          >
            ATELISTRY
          </Link>
          <p className="text-[10px] tracking-[0.15em] leading-loose text-neutral-600 uppercase">
            A global platform connecting visionary personal stylists with individuals who value identity, intention, and discretion.
          </p>
        </div>

        {/* Links - The Brand */}
        <div>
          <h4 className="mb-8 text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">The Brand</h4>
          <ul className="space-y-4 text-[10px] font-medium text-neutral-500 uppercase tracking-[0.3em]">
            <li><Link to="/" className="hover:text-white transition-colors cursor-pointer">Home</Link></li>
            <li><Link to="/narrative" className="hover:text-white transition-colors cursor-pointer text-left">The Narrative</Link></li>
            <li><Link to="/platform" className="hover:text-white transition-colors cursor-pointer text-left">Platform</Link></li>
            <li><Link to="/journal" className="hover:text-white transition-colors cursor-pointer text-left">Journal</Link></li>
            <li><Link to="/access-hub" className="hover:text-white transition-colors cursor-pointer text-left">Access ATELISTRY</Link></li>
            <li><Link to="/sign-in" className="hover:text-white transition-colors cursor-pointer text-left">Member Sign In</Link></li>
            <li><Link to="/my-profile" className="hover:text-white transition-colors cursor-pointer text-left">Client Profile</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors cursor-pointer text-left">Dashboard</Link></li>
          </ul>
        </div>

        {/* Links - Connect */}
        <div>
          <h4 className="mb-8 text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">Connect</h4>
          <ul className="space-y-4 text-[10px] font-medium text-neutral-500 uppercase tracking-[0.3em]">
            <li><a href="mailto:hello@atelistry.com" className="hover:text-white transition-colors">Email</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="mb-8 text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">Legal</h4>
          <ul className="space-y-4 text-[10px] font-medium text-neutral-500 uppercase tracking-[0.3em]">
            <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mx-auto max-w-7xl border-t border-white/5 mt-20 pt-12 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] tracking-[0.3em] text-neutral-700 uppercase">
            © 2026 ATELISTRY. All rights reserved.
          </p>
          <p className="text-[9px] tracking-[0.3em] text-neutral-700 uppercase">
            Designed with intention.
          </p>
        </div>
      </div>
    </footer>
  );
};
