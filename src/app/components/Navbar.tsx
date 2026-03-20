import React, { useState } from "react";
import { Search, Menu } from "lucide-react";
import { Inquiries } from "./Inquiries";

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isLoggedIn: boolean;
  onLoginToggle: () => void;
  accountType?: "client" | "stylist"; // Added account type
}

export const Navbar = ({ onNavigate, currentPage, isLoggedIn, onLoginToggle, accountType }: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-12">
        {/* Left Navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          {[
            { id: "narrative", label: "Narrative" },
            { id: "platform", label: "Platform" },
            { id: "journal", label: "Journal" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group relative text-[10px] font-medium tracking-[0.3em] uppercase transition-all cursor-pointer ${
                currentPage === item.id ? "text-white" : "text-white/40 hover:text-white"
              }`}
            >
              {item.label}
              <span 
                className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-px w-[70%] bg-[#8B0000] transition-all duration-500 ${
                  currentPage === item.id 
                    ? "opacity-100" 
                    : "opacity-0 group-hover:opacity-100"
                }`} 
              />
            </button>
          ))}
        </nav>
        
        {/* Center Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <button 
            onClick={() => onNavigate("home")}
            className="cursor-pointer font-serif text-3xl tracking-[0.2em] text-white uppercase font-light hover:text-red-900 transition-all duration-500 outline-none"
          >
            ATELISTRY
          </button>
        </div>

        {/* Right Navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          <Inquiries>
            <button className="group relative text-[10px] font-medium tracking-[0.3em] uppercase transition-all cursor-pointer text-white/40 hover:text-white">
              Concierge
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-px w-[70%] bg-[#8B0000] opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </button>
          </Inquiries>
          <button 
            onClick={() => {
              if (isLoggedIn) {
                if (accountType === "client") {
                  onNavigate("my-profile");
                } else {
                  onNavigate("dashboard");
                }
              } else {
                onNavigate("access-hub");
              }
            }}
            className={`group relative text-[10px] font-medium tracking-[0.3em] uppercase transition-all cursor-pointer ${
              currentPage === "my-profile" || currentPage === "dashboard" || currentPage === "access-hub" 
                ? "text-white" 
                : "text-white/40 hover:text-white"
            }`}
          >
            {isLoggedIn 
              ? accountType === "client" 
                ? "My Profile" 
                : "Dashboard"
              : "Access"
            }
            <span 
              className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-px w-[70%] bg-[#8B0000] transition-all duration-500 ${
                currentPage === "my-profile" || currentPage === "dashboard" || currentPage === "access-hub" 
                  ? "opacity-100" 
                  : "opacity-0 group-hover:opacity-100"
              }`} 
            />
          </button>
        </nav>
        
        {/* Mobile Menu Icon */}
        <div className="md:hidden">
            <button className="text-white/60 hover:text-white transition-colors cursor-pointer">
                <Menu size={20} strokeWidth={1} />
            </button>
        </div>
      </div>
    </header>
  );
};