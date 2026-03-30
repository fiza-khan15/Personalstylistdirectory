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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/sign-in");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="h-px w-24 mx-auto bg-[#4a1a1a]/20 animate-pulse" />
          <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase animate-pulse">
            Loading
          </p>
        </div>
      </div>
    );
  }

  // Helper to format profile status
  const getProfileStatus = () => {
    if (!profileData?.profile_status) {
      return "";
    }
    // Format as "Active & Verified" 
    if (profileData.profile_status === 'active') {
      return "Active & Verified";
    }
    return profileData.profile_status.charAt(0).toUpperCase() + profileData.profile_status.slice(1);
  };

  // Helper to format availability
  const getAvailability = () => {
    if (profileData?.availability === null || profileData?.availability === undefined) {
      return "";
    }
    return profileData.availability ? "Accepting Clients" : "Not Accepting Clients";
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-8 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white mb-2">
            Stylist Dashboard
          </h1>
          <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
            {profileData?.full_name || ""}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
        >
          {/* Profile Views */}
          <div className="border border-white/10 bg-black p-8">
            <p className="text-[8px] tracking-[0.3em] text-[#4a1a1a] uppercase mb-4">
              Profile Views
            </p>
            <p className="font-serif text-5xl font-light text-white mb-2">
              {profileViewsCount !== null ? profileViewsCount : ""}
            </p>
            <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
              This Month
            </p>
          </div>

          {/* Introductions */}
          <div className="border border-white/10 bg-black p-8">
            <p className="text-[8px] tracking-[0.3em] text-[#4a1a1a] uppercase mb-4">
              Introductions
            </p>
            <p className="font-serif text-5xl font-light text-white mb-2">
              {introductionsCount !== null ? introductionsCount : ""}
            </p>
            <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
              This Month
            </p>
          </div>
        </motion.div>

        {/* Profile Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="font-serif text-2xl font-light text-white mb-8">
            Profile Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Status */}
            <div className="border border-white/10 bg-black p-8">
              <p className="text-[8px] tracking-[0.3em] text-[#4a1a1a] uppercase mb-4">
                Profile Status
              </p>
              <p className="font-serif text-xl font-light text-white mb-6">
                {getProfileStatus()}
              </p>
              <button
                onClick={() => navigate("/edit-profile")}
                className="text-[8px] tracking-[0.3em] text-neutral-500 uppercase hover:text-white transition-colors duration-300"
              >
                Edit Profile
              </button>
            </div>

            {/* Availability */}
            <div className="border border-white/10 bg-black p-8">
              <p className="text-[8px] tracking-[0.3em] text-[#4a1a1a] uppercase mb-4">
                Availability
              </p>
              <p className="font-serif text-xl font-light text-white mb-6">
                {getAvailability()}
              </p>
              <button
                onClick={() => navigate("/edit-profile")}
                className="text-[8px] tracking-[0.3em] text-neutral-500 uppercase hover:text-white transition-colors duration-300"
              >
                Update Status
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            onClick={handleSignOut}
            className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase hover:text-white transition-colors duration-300"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
};