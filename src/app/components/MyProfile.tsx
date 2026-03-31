import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface SavedStylist {
  id: string;
  stylist_id: string;
  created_at: string;
  // Profile fields from joined data
  full_name?: string;
  specialties?: string;
}

export const MyProfile = () => {
  const navigate = useNavigate();
  const { userId, signOut } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [savedStylists, setSavedStylists] = useState<SavedStylist[]>([]);

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

        // Fetch saved stylists if they exist
        const { data: savedData, error: savedError } = await supabase
          .from("saved_stylists")
          .select("id, stylist_id, created_at")
          .eq("client_id", userId)
          .order("created_at", { ascending: false });

        if (!savedError && savedData) {
          // Fetch full stylist profile data for each saved stylist
          const stylistsWithDetails = await Promise.all(
            savedData.map(async (saved) => {
              const { data: stylistProfile } = await supabase
                .from("profiles")
                .select("full_name, specialties")
                .eq("user_id", saved.stylist_id)
                .maybeSingle();

              return {
                ...saved,
                full_name: stylistProfile?.full_name || "",
                specialties: stylistProfile?.specialties || "",
              };
            })
          );

          setSavedStylists(stylistsWithDetails);
          console.log("Saved stylists loaded:", stylistsWithDetails.length);
        } else if (savedError) {
          console.error("Saved stylists fetch error:", savedError);
          setSavedStylists([]);
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
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return "";
    }
  };

  // Map real Supabase data to UI fields
  const name = profileData?.full_name || profileData?.name || "";
  const location = profileData?.city || "";
  const bio = profileData?.bio || "";
  const memberSince = formatMemberSince(profileData?.created_at);

  const handleSignOut = async () => {
    await signOut();
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

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-8 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white">
            My Profile
          </h1>
        </motion.div>

        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-32"
        >
          <p className="text-[8px] tracking-[0.3em] text-[#4a1a1a] uppercase mb-12">
            Profile
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Name */}
            {name && (
              <div>
                <p className="font-serif text-2xl font-light text-white">
                  {name}
                </p>
              </div>
            )}

            {/* Location */}
            {location && (
              <div>
                <p className="font-serif text-2xl font-light text-white">
                  {location}
                </p>
              </div>
            )}

            {/* Member Since */}
            {memberSince && (
              <div>
                <p className="font-serif text-2xl font-light text-white">
                  {memberSince}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/client-edit-profile")}
              className="border border-white/10 px-6 py-3 text-[8px] tracking-[0.3em] text-neutral-500 uppercase hover:text-white hover:border-white/20 transition-all duration-300"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/introduction-detail")}
              className="border border-white/10 px-6 py-3 text-[8px] tracking-[0.3em] text-neutral-500 uppercase hover:text-white hover:border-white/20 transition-all duration-300"
            >
              View Messages
            </button>
            <button
              className="border border-white/10 px-6 py-3 text-[8px] tracking-[0.3em] text-neutral-500 uppercase hover:text-white hover:border-white/20 transition-all duration-300"
            >
              Inquiries
            </button>
          </div>
        </motion.div>

        {/* Your Stylists Section */}
        {bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-32 border-t border-white/10 pt-20"
          >
            <p className="text-[8px] tracking-[0.3em] text-[#4a1a1a] uppercase mb-12">
              Your Stylists
            </p>

            <p className="max-w-4xl font-serif text-xl md:text-2xl font-light leading-loose text-neutral-300">
              {bio}
            </p>
          </motion.div>
        )}

        {/* Saved Stylists Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-32 border-t border-white/10 pt-20"
        >
          <p className="text-[8px] tracking-[0.3em] text-[#4a1a1a] uppercase mb-12">
            Saved Stylists
          </p>

          {savedStylists.length === 0 ? (
            <p className="font-serif text-xl font-light text-neutral-600">
              No saved stylists yet
            </p>
          ) : (
            <div className="space-y-0">
              {savedStylists.map((stylist, index) => (
                <motion.div
                  key={stylist.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4 + index * 0.05,
                  }}
                  className={`grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr] gap-6 border-b border-white/10 py-8 ${
                    index === 0 ? "border-t" : ""
                  }`}
                >
                  {/* Stylist Name */}
                  <div>
                    <p className="font-serif text-xl font-light text-white">
                      {stylist.full_name || ""}
                    </p>
                  </div>

                  {/* Specialties */}
                  <div>
                    <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                      {stylist.specialties || ""}
                    </p>
                  </div>

                  {/* View Profile Button */}
                  <div className="text-right">
                    <button
                      onClick={() => navigate(`/stylist/${stylist.stylist_id}`)}
                      className="text-[8px] tracking-[0.3em] text-neutral-500 uppercase hover:text-white transition-colors duration-300"
                    >
                      View Profile
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Additional Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-white/10 pt-20"
        >
          <p className="text-[8px] tracking-[0.3em] text-[#4a1a1a] uppercase mb-16">
          </p>

          <div className="space-y-8">
            <p className="font-serif text-sm font-light text-neutral-600 uppercase tracking-wider">
              Current requests will be matched to the concierge team
            </p>

            <button
              onClick={handleSignOut}
              className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase hover:text-white transition-colors duration-300"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};