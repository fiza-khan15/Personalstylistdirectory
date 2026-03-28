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
    <div className="min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-8 md:px-20">
        {/* Luxurious Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-48 space-y-8 border-b border-white/[0.02] pb-16"
        >
          <h1 className="font-serif text-7xl md:text-9xl font-extralight tracking-tighter text-white/95">
            My Profile
          </h1>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-48 text-center space-y-8"
          >
            <div className="h-px w-32 mx-auto bg-white/5 animate-pulse" />
            <p className="text-[7px] tracking-[0.5em] text-neutral-700/80 uppercase animate-pulse">
              Loading profile
            </p>
          </motion.div>
        )}

        {/* Profile Content */}
        {!isLoading && (
          <>
            {/* Profile Overview Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mb-48"
            >
              <div className="mb-16 flex items-center justify-between border-b border-white/[0.02] pb-8">
                <h2 className="text-[7px] font-medium tracking-[0.5em] text-neutral-700/60 uppercase">
                  Overview
                </h2>
                <button
                  onClick={() => navigate("/client-edit-profile")}
                  className="text-[7px] font-medium tracking-[0.4em] text-neutral-600/80 uppercase transition-all duration-500 hover:text-white/90 hover:tracking-[0.5em]"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
                {/* Name */}
                <div className="group relative bg-gradient-to-br from-white/[0.01] to-transparent px-12 py-16 transition-all duration-700 hover:from-white/[0.02]">
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <p className="mb-8 text-[7px] tracking-[0.5em] text-neutral-700/80 uppercase">
                    Name
                  </p>
                  <p className="font-serif text-3xl font-extralight text-white/90">
                    {name}
                  </p>
                </div>

                {/* City */}
                <div className="group relative bg-gradient-to-br from-white/[0.01] to-transparent px-12 py-16 transition-all duration-700 hover:from-white/[0.02]">
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <p className="mb-8 text-[7px] tracking-[0.5em] text-neutral-700/80 uppercase">
                    City
                  </p>
                  <p className="font-serif text-3xl font-extralight text-white/90">
                    {city}
                  </p>
                </div>

                {/* Country */}
                <div className="group relative bg-gradient-to-br from-white/[0.01] to-transparent px-12 py-16 transition-all duration-700 hover:from-white/[0.02]">
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <p className="mb-8 text-[7px] tracking-[0.5em] text-neutral-700/80 uppercase">
                    Country
                  </p>
                  <p className="font-serif text-3xl font-extralight text-white/90">
                    {country}
                  </p>
                </div>

                {/* Member Since */}
                <div className="group relative bg-gradient-to-br from-white/[0.01] to-transparent px-12 py-16 transition-all duration-700 hover:from-white/[0.02]">
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <p className="mb-8 text-[7px] tracking-[0.5em] text-neutral-700/80 uppercase">
                    Member Since
                  </p>
                  <p className="font-serif text-3xl font-extralight text-white/90">
                    {memberSince}
                  </p>
                </div>

                {/* Account Type */}
                <div className="group relative bg-gradient-to-br from-white/[0.01] to-transparent px-12 py-16 transition-all duration-700 hover:from-white/[0.02]">
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <p className="mb-8 text-[7px] tracking-[0.5em] text-neutral-700/80 uppercase">
                    Account Type
                  </p>
                  <p className="font-serif text-3xl font-extralight text-white/90">
                    {userType.charAt(0).toUpperCase() + userType.slice(1)}
                  </p>
                </div>

                {/* Availability */}
                <div className="group relative bg-gradient-to-br from-white/[0.01] to-transparent px-12 py-16 transition-all duration-700 hover:from-white/[0.02]">
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <p className="mb-8 text-[7px] tracking-[0.5em] text-neutral-700/80 uppercase">
                    Availability
                  </p>
                  <p className="font-serif text-3xl font-extralight text-white/90">
                    {availability}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mb-48 border-t border-white/[0.02] pt-32"
            >
              <h2 className="mb-20 text-[7px] font-medium tracking-[0.5em] text-neutral-700/60 uppercase">
                Bio
              </h2>

              <div className="relative bg-gradient-to-br from-white/[0.01] to-transparent px-16 py-20">
                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
                <p className="max-w-4xl font-serif text-2xl md:text-3xl font-extralight leading-[2.2] tracking-wide text-neutral-300/90">
                  {bio}
                </p>
              </div>
            </motion.div>

            {/* Style Preferences Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mb-48 border-t border-white/[0.02] pt-32"
            >
              <h2 className="mb-20 text-[7px] font-medium tracking-[0.5em] text-neutral-700/60 uppercase">
                Style Preferences
              </h2>

              <div className="relative bg-gradient-to-br from-white/[0.01] to-transparent px-16 py-20">
                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
                <p className="max-w-4xl font-serif text-2xl md:text-3xl font-extralight leading-[2.2] tracking-wide text-neutral-300/90">
                  {stylePreferences}
                </p>
              </div>
            </motion.div>

            {/* Sign Out Action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="border-t border-white/[0.02] pt-20"
            >
              <button
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="group relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent px-16 py-16 text-left transition-all duration-700 hover:from-white/[0.04]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/0 via-red-900/5 to-red-900/0 translate-x-[-100%] transition-transform duration-1000 ease-out group-hover:translate-x-[100%]" />
                <span className="relative z-10 block text-[8px] font-medium tracking-[0.5em] text-white/70 uppercase transition-colors duration-500 group-hover:text-white/90">
                  Sign Out
                </span>
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};