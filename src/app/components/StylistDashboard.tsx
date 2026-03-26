import React, { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StylistDashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const StylistDashboard = ({ onNavigate, onLogout }: StylistDashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  
  // Mock data - would come from backend
  const analytics = {
    profileViews: 342,
    introductions: 23,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the currently logged-in user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error("Auth error:", authError);
          setIsLoading(false);
          return;
        }

        // Fetch profile data from profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          setProfileData(null);
        } else {
          setProfileData(profile);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-24 space-y-2">
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-white">
            Stylist Dashboard
          </h1>
          <p className="text-[10px] font-medium tracking-[0.4em] text-neutral-500 uppercase">
            {profileData?.name || "Not yet provided"}
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="mb-32 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="group border border-white/5 bg-neutral-900/30 p-10 transition-all duration-500 hover:border-white/10">
            <div className="space-y-6">
              <p className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
                Profile Views
              </p>
              <p className="font-serif text-5xl font-light text-white">
                {analytics.profileViews}
              </p>
              <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
                Last 30 Days
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate("stylist-introductions")}
            className="group border border-white/5 bg-neutral-900/30 p-10 text-left transition-all duration-500 hover:border-white/10 hover:bg-neutral-900/40"
          >
            <div className="space-y-6">
              <p className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
                Introductions
              </p>
              <p className="font-serif text-5xl font-light text-white">
                {analytics.introductions}
              </p>
              <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase group-hover:text-neutral-500 transition-colors">
                This Month
              </p>
            </div>
          </button>
        </div>

        {/* Profile Management */}
        <div className="space-y-12 border-t border-white/5 pt-16">
          <h2 className="font-serif text-3xl font-light tracking-tight text-white">
            Profile Management
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6 border border-white/5 bg-neutral-900/20 p-10">
              <p className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
                Profile Status
              </p>
              <p className="font-serif text-2xl font-light text-white">
                Active & Verified
              </p>
              <button 
                onClick={() => onNavigate("edit-profile")}
                className="mt-4 inline-block border-b border-white/10 pb-1 text-[9px] font-medium tracking-[0.4em] text-neutral-400 uppercase transition-all hover:border-white hover:text-white"
              >
                Edit Profile
              </button>
            </div>

            <div className="space-y-6 border border-white/5 bg-neutral-900/20 p-10">
              <p className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
                Availability
              </p>
              <p className="font-serif text-2xl font-light text-white">
                {profileData?.accepting_clients ? "Accepting Clients" : "Not Accepting Clients"}
              </p>
              <button 
                onClick={() => onNavigate("edit-profile")}
                className="mt-4 inline-block border-b border-white/10 pb-1 text-[9px] font-medium tracking-[0.4em] text-neutral-400 uppercase transition-all hover:border-white hover:text-white">
                Update Status
              </button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-24 border-t border-white/5 pt-12">
          <button
            onClick={onLogout}
            className="text-[9px] font-medium tracking-[0.4em] text-neutral-600 uppercase transition-colors hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};