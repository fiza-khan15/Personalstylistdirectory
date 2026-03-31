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
    bio: "",
    stylePreferences: "",
    styleInterests: [] as string[],
  });

  const availableInterests = [
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) {
          setIsLoading(false);
          return;
        }

        console.log("Fetching client profile using userId:", userId);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (!profileError && profile) {
          setFormData({
            name: profile.full_name || profile.name || "",
            city: profile.city || "",
            bio: profile.bio || "",
            stylePreferences: profile.style_preferences || "",
            styleInterests: profile.style_interests || [],
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

    fetchProfile();
  }, [userId]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    if (formData.styleInterests.includes(interest)) {
      setFormData((prev) => ({
        ...prev,
        styleInterests: prev.styleInterests.filter((i) => i !== interest),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        styleInterests: [...prev.styleInterests, interest],
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

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.name,
          name: formData.name, // Keep legacy field for backwards compatibility
          city: formData.city,
          bio: formData.bio,
          style_preferences: formData.stylePreferences,
          style_interests: formData.styleInterests,
        })
        .eq("user_id", userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
      } else {
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
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30"
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
                className="w-full border-b border-white/10 bg-transparent py-2 text-white text-sm outline-none transition-colors focus:border-white/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              className="w-full border border-white/10 bg-transparent p-4 text-white text-sm outline-none transition-colors focus:border-white/30 resize-none"
              placeholder="Tell us about yourself..."
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

          <div className="space-y-2">
            <label className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase block">
              Describe Your Style
            </label>
            <textarea
              value={formData.stylePreferences}
              onChange={(e) => handleInputChange("stylePreferences", e.target.value)}
              rows={6}
              className="w-full border border-white/10 bg-transparent p-4 text-white text-sm outline-none transition-colors focus:border-white/30 resize-none"
              placeholder="What draws you to certain aesthetics? What are you looking for in a stylist?"
            />
          </div>
        </motion.div>

        {/* Style Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 space-y-8 border-t border-white/10 pt-16"
        >
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase">
            Style Interests
          </h2>

          <div className="flex flex-wrap gap-3">
            {availableInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`border px-6 py-3 text-[8px] font-medium tracking-[0.3em] uppercase transition-all ${
                  formData.styleInterests.includes(interest)
                    ? "border-white/30 bg-white/5 text-white"
                    : "border-white/10 text-neutral-500 hover:border-white/20 hover:text-white"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
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