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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Wait until AuthContext provides a stable userId
        if (!userId) {
          setIsLoading(false);
          return;
        }

        console.log(
          "Fetching client profile using userId from AuthContext:",
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
          setProfileData(null);
        } else {
          console.log("Client profile loaded:", profile);
          setProfileData(profile);
        }
      } catch (err) {
        console.error("Unexpected profile fetch error:", err);
        setProfileData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Format date helper
  const formatMemberSince = (dateString: string | null) => {
    if (!dateString) return "Not yet provided";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return "Not yet provided";
    }
  };

  // Map real Supabase data to UI fields
  const name = profileData?.name || "Not yet provided";
  const city = profileData?.city || "Not yet provided";
  const country = profileData?.country || "Not yet provided";
  const bio = profileData?.bio || "Not yet provided";
  const stylePreferences = profileData?.style_preferences || "Not yet provided";
  const memberSince = formatMemberSince(profileData?.created_at);
  const userType = profileData?.user_type || "Not yet provided";
  const availability = profileData?.availability || "Not yet provided";

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
                {/* Name */}
                <div className="space-y-3">
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    Name
                  </p>
                  <p className="font-serif text-xl font-light text-white">
                    {name}
                  </p>
                </div>

                {/* City */}
                <div className="space-y-3">
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    City
                  </p>
                  <p className="font-serif text-xl font-light text-white">
                    {city}
                  </p>
                </div>

                {/* Country */}
                <div className="space-y-3">
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    Country
                  </p>
                  <p className="font-serif text-xl font-light text-white">
                    {country}
                  </p>
                </div>

                {/* Member Since */}
                <div className="space-y-3">
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    Member Since
                  </p>
                  <p className="font-serif text-xl font-light text-white">
                    {memberSince}
                  </p>
                </div>

                {/* Account Type */}
                <div className="space-y-3">
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    Account Type
                  </p>
                  <p className="font-serif text-xl font-light text-white">
                    {userType.charAt(0).toUpperCase() + userType.slice(1)}
                  </p>
                </div>

                {/* Availability */}
                <div className="space-y-3">
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    Availability
                  </p>
                  <p className="font-serif text-xl font-light text-white">
                    {availability}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mb-40 space-y-12 border-t border-white/5 pt-20"
            >
              <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
                Bio
              </h2>

              <p className="max-w-2xl font-serif text-lg font-light leading-relaxed text-neutral-300">
                {bio}
              </p>
            </motion.div>

            {/* Style Preferences Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mb-40 space-y-12 border-t border-white/5 pt-20"
            >
              <h2 className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
                Style Preferences
              </h2>

              <p className="max-w-2xl font-serif text-lg font-light leading-relaxed text-neutral-300">
                {stylePreferences}
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
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
