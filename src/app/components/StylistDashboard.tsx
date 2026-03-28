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
        <p className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
          Loading dashboard...
        </p>
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
    <div className="min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-32 space-y-3"
        >
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-white">
            Dashboard
          </h1>
          <div className="h-px w-12 bg-red-900/40" />
        </motion.div>

        {/* Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-[9px] tracking-[0.3em] text-neutral-500 uppercase mb-8">
            Metrics
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Profile Views */}
            <div className="border border-white/5 p-10">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase mb-4">
                Profile Views (Last 30 Days)
              </p>
              <p className="font-serif text-2xl font-light text-white">
                {profileViewsCount !== null ? profileViewsCount : "Not yet available"}
              </p>
            </div>

            {/* Introductions */}
            <div className="border border-white/5 p-10">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase mb-4">
                Introductions (This Month)
              </p>
              <p className="font-serif text-2xl font-light text-white">
                {introductionsCount !== null ? introductionsCount : "Not yet available"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-[9px] tracking-[0.3em] text-neutral-500 uppercase mb-8">
            Profile Management
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Profile Status */}
            <div className="border border-white/5 p-10">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase mb-4">
                Profile Status
              </p>
              <p className="font-serif text-2xl font-light text-white">
                {getProfileStatus()}
              </p>
            </div>

            {/* Availability */}
            <div className="border border-white/5 p-10">
              <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase mb-4">
                Availability
              </p>
              <p className="font-serif text-2xl font-light text-white">
                {getAvailability()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <h2 className="text-[9px] tracking-[0.3em] text-neutral-500 uppercase mb-8">
            Actions
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Edit Profile Button */}
            <button
              onClick={() => navigate("/edit-profile")}
              className="group relative overflow-hidden border border-white/10 px-8 py-6 text-[10px] font-bold tracking-[0.4em] text-white uppercase transition-all hover:border-red-900"
            >
              <span className="relative z-10">Edit Profile</span>
              <span className="absolute inset-0 bg-red-900/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </button>

            {/* Update Status Button */}
            <button
              onClick={() => navigate("/update-status")}
              className="group relative overflow-hidden border border-white/10 px-8 py-6 text-[10px] font-bold tracking-[0.4em] text-white uppercase transition-all hover:border-red-900"
            >
              <span className="relative z-10">Update Status</span>
              <span className="absolute inset-0 bg-red-900/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </button>

            {/* View Introductions Button */}
            <button
              onClick={() => navigate("/introductions")}
              className="group relative overflow-hidden border border-white/10 px-8 py-6 text-[10px] font-bold tracking-[0.4em] text-white uppercase transition-all hover:border-red-900"
            >
              <span className="relative z-10">View Introductions</span>
              <span className="absolute inset-0 bg-red-900/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
