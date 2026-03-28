import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export const StylistDashboard = () => {
  const { userId } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [clientsCount, setClientsCount] = useState(0);

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
        } else if (profileError) {
          console.error("Profile fetch error:", profileError);
        }

        // Example: fetch related stats (safe pattern)
        const { count, error: countError } = await supabase
          .from("access_requests")
          .select("*", { count: "exact", head: true })
          .eq("type", "client");

        if (!countError && typeof count === "number") {
          setClientsCount(count);
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

  return (
    <div className="min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-5xl px-6 md:px-12">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="grid grid-cols-1 gap-12 md:grid-cols-2"
        >
          <div className="border border-white/5 p-10">
            <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase mb-4">
              Stylist Name
            </p>
            <p className="font-serif text-2xl font-light text-white">
              {profileData?.name || "Not yet provided"}
            </p>
          </div>

          <div className="border border-white/5 p-10">
            <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase mb-4">
              Client Requests
            </p>
            <p className="font-serif text-2xl font-light text-white">
              {clientsCount}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};