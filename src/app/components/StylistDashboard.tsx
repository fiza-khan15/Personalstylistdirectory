import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export const StylistDashboard = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileViewsCount, setProfileViewsCount] = useState<number | null>(null);
  const [introductionsCount, setIntroductionsCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!userId) {
          setIsLoading(false);
          return;
        }

        console.log("Fetching stylist dashboard data using userId:", userId);

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
          console.error("Invalid user ID format:", userId);
          setIsLoading(false);
          return;
        }

        // Fetch stylist profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (!profileError && profile) {
          setProfileData(profile);
          console.log("Profile data loaded:", profile);
        } else if (profileError) {
          console.error("Profile fetch error:", profileError);
        }

        // Fetch profile views (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: viewsCount, error: viewsError } = await supabase
          .from("profile_views")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .gte("created_at", thirtyDaysAgo.toISOString());

        if (!viewsError && typeof viewsCount === "number") {
          setProfileViewsCount(viewsCount);
          console.log("Profile views (last 30 days):", viewsCount);
        } else if (viewsError) {
          console.error("Profile views fetch error:", viewsError);
        }

        // Fetch introductions (this month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: introsCount, error: introsError } = await supabase
          .from("introductions")
          .select("*", { count: "exact", head: true })
          .eq("stylist_id", userId)
          .gte("created_at", startOfMonth.toISOString());

        if (!introsError && typeof introsCount === "number") {
          setIntroductionsCount(introsCount);
          console.log("Introductions (this month):", introsCount);
        } else if (introsError) {
          console.error("Introductions fetch error:", introsError);
        }
      } catch (err) {
        console.error("Unexpected dashboard error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="h-px w-24 mx-auto bg-red-900/20 animate-pulse" />
          <p className="text-[10px] tracking-[0.3em] text-neutral-700 uppercase animate-pulse">
            Loading dashboard
          </p>
        </div>
      </div>
    );
  }

  // Helper to format profile status
  const getProfileStatus = () => {
    if (!profileData?.profile_status) {
      return "Not yet available";
    }
    // Capitalize first letter
    return profileData.profile_status.charAt(0).toUpperCase() + profileData.profile_status.slice(1);
  };

  // Helper to format availability
  const getAvailability = () => {
    if (profileData?.availability === null || profileData?.availability === undefined) {
      return "Not yet available";
    }
    return profileData.availability ? "Accepting Clients" : "Not Accepting Clients";
  };

  return (
    <div className="min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-8 md:px-20">
        {/* Luxurious Header with Subtle Sophistication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-48 space-y-8 border-b border-white/[0.02] pb-16"
        >
          <h1 className="font-serif text-7xl md:text-9xl font-extralight tracking-tighter text-white/95">
            Dashboard
          </h1>
        </motion.div>

        {/* Refined Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-48"
        >
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
            {/* Profile Views */}
            <div className="group relative bg-gradient-to-br from-white/[0.01] to-transparent px-16 py-20 transition-all duration-700 hover:from-white/[0.02]">
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <p className="mb-10 text-[7px] font-medium tracking-[0.5em] text-neutral-700/80 uppercase">
                Profile Views — Last 30 Days
              </p>
              <p className="font-serif text-5xl md:text-6xl font-extralight tracking-tight text-white/90">
                {profileViewsCount !== null ? profileViewsCount : "—"}
              </p>
            </div>

            {/* Introductions */}
            <div className="group relative bg-gradient-to-br from-white/[0.01] to-transparent px-16 py-20 transition-all duration-700 hover:from-white/[0.02]">
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <p className="mb-10 text-[7px] font-medium tracking-[0.5em] text-neutral-700/80 uppercase">
                Introductions — This Month
              </p>
              <p className="font-serif text-5xl md:text-6xl font-extralight tracking-tight text-white/90">
                {introductionsCount !== null ? introductionsCount : "—"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Elegant Profile Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-48"
        >
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
            {/* Profile Status */}
            <div className="group relative bg-gradient-to-br from-white/[0.01] to-transparent px-16 py-20 transition-all duration-700 hover:from-white/[0.02]">
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <p className="mb-10 text-[7px] font-medium tracking-[0.5em] text-neutral-700/80 uppercase">
                Profile Status
              </p>
              <p className="font-serif text-5xl md:text-6xl font-extralight tracking-tight text-white/90">
                {getProfileStatus()}
              </p>
            </div>

            {/* Availability */}
            <div className="group relative bg-gradient-to-br from-white/[0.01] to-transparent px-16 py-20 transition-all duration-700 hover:from-white/[0.02]">
              <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <p className="mb-10 text-[7px] font-medium tracking-[0.5em] text-neutral-700/80 uppercase">
                Availability
              </p>
              <p className="font-serif text-5xl md:text-6xl font-extralight tracking-tight text-white/90">
                {getAvailability()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Refined Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-white/[0.02] pt-20"
        >
          <div className="flex flex-col gap-1 md:flex-row">
            {/* View Introductions Button */}
            <button
              onClick={() => navigate("/stylist-introductions")}
              className="group relative flex-1 overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent px-16 py-16 text-left transition-all duration-700 hover:from-white/[0.04]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/0 via-red-900/5 to-red-900/0 translate-x-[-100%] transition-transform duration-1000 ease-out group-hover:translate-x-[100%]" />
              <span className="relative z-10 block text-[8px] font-medium tracking-[0.5em] text-white/70 uppercase transition-colors duration-500 group-hover:text-white/90">
                View Introductions
              </span>
            </button>

            {/* Edit Profile Button */}
            <button
              onClick={() => navigate("/edit-profile")}
              className="group relative flex-1 overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent px-16 py-16 text-left transition-all duration-700 hover:from-white/[0.04]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/0 via-red-900/5 to-red-900/0 translate-x-[-100%] transition-transform duration-1000 ease-out group-hover:translate-x-[100%]" />
              <span className="relative z-10 block text-[8px] font-medium tracking-[0.5em] text-white/70 uppercase transition-colors duration-500 group-hover:text-white/90">
                Edit Profile
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};