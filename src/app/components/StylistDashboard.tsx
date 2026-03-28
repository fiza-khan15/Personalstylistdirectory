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
    if (profileData?.accepting_clients === null || profileData?.accepting_clients === undefined) {
      return "Not yet available";
    }
    return profileData.accepting_clients ? "Accepting Clients" : "Not Accepting Clients";
  };

  return (
    <div className="min-h-screen py-40 md:py-48">
      <div className="mx-auto max-w-5xl px-6 md:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-40 space-y-6"
        >
          <h1 className="font-serif text-6xl md:text-8xl font-light tracking-tight text-white">
            Dashboard
          </h1>
          <div className="h-px w-16 bg-red-900/30" />
        </motion.div>

        {/* Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32"
        >
          <h2 className="text-[8px] tracking-[0.4em] text-neutral-700 uppercase mb-12">
            Metrics
          </h2>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            {/* Profile Views */}
            <div className="border border-white/[0.03] p-12">
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-6">
                Profile Views (Last 30 Days)
              </p>
              <p className="font-serif text-3xl font-light text-white">
                {profileViewsCount !== null ? profileViewsCount : "Not yet available"}
              </p>
            </div>

            {/* Introductions */}
            <div className="border border-white/[0.03] p-12">
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-6">
                Introductions (This Month)
              </p>
              <p className="font-serif text-3xl font-light text-white">
                {introductionsCount !== null ? introductionsCount : "Not yet available"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32"
        >
          <h2 className="text-[8px] tracking-[0.4em] text-neutral-700 uppercase mb-12">
            Profile Management
          </h2>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            {/* Profile Status */}
            <div className="border border-white/[0.03] p-12">
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-6">
                Profile Status
              </p>
              <p className="font-serif text-3xl font-light text-white">
                {getProfileStatus()}
              </p>
            </div>

            {/* Availability */}
            <div className="border border-white/[0.03] p-12">
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-6">
                Availability
              </p>
              <p className="font-serif text-3xl font-light text-white">
                {getAvailability()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-[8px] tracking-[0.4em] text-neutral-700 uppercase mb-12">
            Actions
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* View Introductions Button */}
            <button
              onClick={() => navigate("/stylist-introductions")}
              className="group relative overflow-hidden border border-white/[0.05] px-12 py-8 text-[9px] font-bold tracking-[0.4em] text-white uppercase transition-all duration-300 hover:border-white/10"
            >
              <span className="relative z-10">View Introductions</span>
              <span className="absolute inset-0 bg-red-900/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 ease-out" />
            </button>

            {/* Edit Profile Button */}
            <button
              onClick={() => navigate("/edit-profile")}
              className="group relative overflow-hidden border border-white/[0.05] px-12 py-8 text-[9px] font-bold tracking-[0.4em] text-white uppercase transition-all duration-300 hover:border-white/10"
            >
              <span className="relative z-10">Edit Profile</span>
              <span className="absolute inset-0 bg-red-900/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 ease-out" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};