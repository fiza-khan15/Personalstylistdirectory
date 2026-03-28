import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export const MyProfile = () => {
  const navigate = useNavigate();
  const { userId, signOut } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Wait until AuthContext provides a stable userId
        if (!userId) {
          setIsLoading(false);
          return;
        }

        console.log(
          "Fetching profile using userId from AuthContext:",
          userId,
        );

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          setError(null);
          setProfileData(null);
        } else {
          setProfileData(profile);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const clientData = {
    name: profileData?.name || "Not yet provided",
    city: profileData?.city || "Not yet provided",
    memberSince:
      profileData?.member_since || "Not yet provided",
    styleInterests: profileData?.style_interests || [],
    styleDescription:
      profileData?.style_preferences || "Not yet provided",
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
            My Profile
          </h1>
          <div className="h-px w-12 bg-red-900/40" />
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center"
          >
            <p className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
              Loading profile...
            </p>
          </motion.div>
        )}

        {/* No Profile Fallback */}
        {!isLoading && !profileData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center"
          >
            <p className="font-serif text-xl text-neutral-500">
              Profile not yet available.
            </p>
          </motion.div>
        )}

        {/* Profile Content */}
        {!isLoading && (
          <>
            {/* Profile Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-40 space-y-12"
            >
              <div className="flex items-end justify-between">
                <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
                  Overview
                </h2>
                <button
                  onClick={() =>
                    navigate("/client-edit-profile")
                  }
                  className="text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-colors hover:text-white"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-3">
                <div className="space-y-3">
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    Name
                  </p>
                  <p className="font-serif text-xl font-light text-white">
                    {clientData.name}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    City
                  </p>
                  <p className="font-serif text-xl font-light text-white">
                    {clientData.city}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    Member Since
                  </p>
                  <p className="font-serif text-xl font-light text-white">
                    {clientData.memberSince}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                  Style Interests
                </p>
                {clientData.styleInterests.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {clientData.styleInterests.map(
                      (interest: string) => (
                        <span
                          key={interest}
                          className="border border-white/10 px-6 py-3 text-[9px] font-medium tracking-[0.3em] text-neutral-400 uppercase"
                        >
                          {interest}
                        </span>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="font-serif text-xl font-light text-neutral-500">
                    Not yet provided
                  </p>
                )}
              </div>
            </motion.div>

            {/* Style Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mb-40 space-y-12 border-t border-white/5 pt-20"
            >
              <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
                Style Preferences
              </h2>

              <p className="max-w-2xl font-serif text-lg font-light leading-relaxed text-neutral-300">
                {clientData.styleDescription}
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="border-t border-white/5 pt-12"
            >
              <button
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-colors hover:text-white"
              >
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};