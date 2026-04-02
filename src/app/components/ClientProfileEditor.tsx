import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export const ClientProfileEditor = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "",
    bio: "",
    stylePreferences: [] as string[],
  });

  const availablePreferences = [
    "Minimalist",
    "Contemporary",
    "Tailoring",
    "Luxury",
    "Sustainable",
    "Avant-Garde",
    "Classic",
    "Editorial",
    "Street Style",
    "Monochrome",
    "Vintage",
    "Emerging Designers",
  ];

  const fetchProfile = async () => {
    try {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      console.log("Fetching profile for userId:", userId);

      // Fetch profile where user_id = authenticated user id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (!profileError && profile) {
        console.log("Profile loaded:", profile);
        setFormData({
          name: profile.name || "",
          city: profile.city || "",
          country: profile.country || "",
          bio: profile.bio || "",
          stylePreferences: Array.isArray(profile.style_preferences) ? profile.style_preferences : [],
        });
      } else if (profileError) {
        console.error("Profile fetch error:", profileError);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePreference = (preference: string) => {
    if (formData.stylePreferences.includes(preference)) {
      setFormData((prev) => ({
        ...prev,
        stylePreferences: prev.stylePreferences.filter((p) => p !== preference),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        stylePreferences: [...prev.stylePreferences, preference],
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (!userId) {
        console.error("No userId available");
        setIsSaving(false);
        return;
      }

      console.log("Saving profile for userId:", userId);

      // UPDATE profiles WHERE user_id = authenticated user id
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: formData.name || null,
          city: formData.city || null,
          country: formData.country || null,
          bio: formData.bio || null,
          style_preferences: formData.stylePreferences.length > 0 ? formData.stylePreferences : null,
        })
        .eq("user_id", userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
      } else {
        console.log("Profile saved successfully");
        
        // Reload profile data from profiles table
        await fetchProfile();
        
        navigate("/my-profile");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSaving(false);
    }
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
      <div className="mx-auto max-w-3xl px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-20 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white">
            Edit Profile
          </h1>
        </div>

        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 space-y-8"
        >
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Not yet provided"
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30 placeholder:text-neutral-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Not yet provided"
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30 placeholder:text-neutral-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              placeholder="Not yet provided"
              className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30 placeholder:text-neutral-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              placeholder="Not yet provided"
              className="w-full border border-white/10 bg-transparent p-4 text-white text-sm outline-none transition-colors focus:border-white/30 resize-none placeholder:text-neutral-700"
            />
          </div>
        </motion.div>

        {/* Style Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 space-y-8 border-t border-white/10 pt-16"
        >
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase">
            Style Preferences
          </h2>

          <div className="flex flex-wrap gap-3">
            {availablePreferences.map((preference) => (
              <button
                key={preference}
                onClick={() => togglePreference(preference)}
                className={`border px-6 py-3 text-[8px] font-medium tracking-[0.3em] uppercase transition-all ${
                  formData.stylePreferences.includes(preference)
                    ? "border-white/30 bg-white/5 text-white"
                    : "border-white/10 text-neutral-500 hover:border-white/20 hover:text-white"
                }`}
              >
                {preference}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-t border-white/10 pt-16 space-y-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="border border-white/10 bg-white px-12 py-4 text-[8px] font-medium tracking-[0.4em] text-black uppercase transition-all hover:bg-white/90 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => navigate("/my-profile")}
              className="border border-white/10 px-12 py-4 text-[8px] font-medium tracking-[0.4em] text-neutral-500 uppercase transition-all hover:text-white hover:border-white/20"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};