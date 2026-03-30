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

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
          console.error("Invalid user ID format:", userId);
          setProfileData(null);
          setIsLoading(false);
          return;
        }

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
            My Profile
          </h1>
          <div className="h-px w-16 bg-red-900/30" />
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center space-y-8"
          >
            <div className="h-px w-24 mx-auto bg-red-900/20 animate-pulse" />
            <p className="text-[10px] tracking-[0.3em] text-neutral-700 uppercase animate-pulse">
              Loading profile
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
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-40 space-y-16"
            >
              <div className="flex items-end justify-between">
                <h2 className="text-[8px] font-medium tracking-[0.5em] text-red-900/80 uppercase">
                  Overview
                </h2>
                <button
                  onClick={() =>
                    navigate("/client-edit-profile")
                  }
                  className="text-[8px] font-medium tracking-[0.3em] text-neutral-700 uppercase transition-colors duration-300 hover:text-white"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 gap-x-20 gap-y-16 md:grid-cols-3">
                {/* Name */}
                <div className="space-y-4">
                  <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                    Name
                  </p>
                  <p className="font-serif text-2xl font-light text-white">
                    {name}
                  </p>
                </div>

                {/* City */}
                <div className="space-y-4">
                  <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                    City
                  </p>
                  <p className="font-serif text-2xl font-light text-white">
                    {city}
                  </p>
                </div>

                {/* Country */}
                <div className="space-y-4">
                  <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                    Country
                  </p>
                  <p className="font-serif text-2xl font-light text-white">
                    {country}
                  </p>
                </div>

                {/* Member Since */}
                <div className="space-y-4">
                  <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                    Member Since
                  </p>
                  <p className="font-serif text-2xl font-light text-white">
                    {memberSince}
                  </p>
                </div>

                {/* Account Type */}
                <div className="space-y-4">
                  <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                    Account Type
                  </p>
                  <p className="font-serif text-2xl font-light text-white">
                    {userType.charAt(0).toUpperCase() + userType.slice(1)}
                  </p>
                </div>

                {/* Availability */}
                <div className="space-y-4">
                  <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                    Availability
                  </p>
                  <p className="font-serif text-2xl font-light text-white">
                    {availability}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mb-40 space-y-12 border-t border-white/[0.03] pt-24"
            >
              <h2 className="text-[8px] font-medium tracking-[0.5em] text-red-900/80 uppercase">
                Bio
              </h2>

              <p className="max-w-3xl font-serif text-xl md:text-2xl font-light leading-loose text-neutral-300">
                {bio}
              </p>
            </motion.div>

            {/* Style Preferences Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-40 space-y-12 border-t border-white/[0.03] pt-24"
            >
              <h2 className="text-[8px] font-medium tracking-[0.5em] text-red-900/80 uppercase">
                Style Preferences
              </h2>

              <p className="max-w-3xl font-serif text-xl md:text-2xl font-light leading-loose text-neutral-300">
                {stylePreferences}
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="border-t border-white/[0.03] pt-16"
            >
              <button
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="text-[9px] font-medium tracking-[0.3em] text-neutral-700 uppercase transition-colors duration-300 hover:text-white"
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