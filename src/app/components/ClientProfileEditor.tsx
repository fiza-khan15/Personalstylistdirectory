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
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [styleDescription, setStyleDescription] = useState("");

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

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

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
          setName(profile.name || "");
          setCity(profile.city || "");
          setStyleDescription(profile.style_preferences || "");
          setSelectedInterests(profile.style_interests || []);
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

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
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
        .upsert({
          user_id: userId,
          name,
          city,
          style_preferences: styleDescription,
          style_interests: selectedInterests,
        });

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

  return (
    <div className="min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-32 space-y-3"
        >
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-white">
            Edit Profile
          </h1>
          <div className="h-px w-12 bg-red-900/40" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-24 space-y-6"
        >
          <label className="block space-y-4">
            <span className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
              Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-white/10 bg-transparent pb-4 font-serif text-2xl font-light text-white outline-none transition-colors focus:border-white/30"
            />
          </label>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-24 space-y-6 border-t border-white/5 pt-20"
        >
          <label className="block space-y-4">
            <span className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
              City
            </span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border-b border-white/10 bg-transparent pb-4 font-serif text-2xl font-light text-white outline-none transition-colors focus:border-white/30"
            />
          </label>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-24 space-y-6 border-t border-white/5 pt-20"
        >
          <label className="block space-y-4">
            <span className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
              Style Preferences
            </span>
            <textarea
              value={styleDescription}
              onChange={(e) => setStyleDescription(e.target.value)}
              className="w-full min-h-[180px] resize-none border border-white/5 bg-neutral-900/30 px-8 py-6 font-serif text-lg font-light leading-relaxed text-white outline-none transition-colors focus:border-white/10"
              placeholder="Describe your style preferences and aesthetic..."
            />
          </label>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-32 space-y-8 border-t border-white/5 pt-20"
        >
          <div className="flex flex-wrap gap-3">
            {availableInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`border px-6 py-3 text-[9px] font-medium tracking-[0.3em] uppercase transition-all ${
                  selectedInterests.includes(interest)
                    ? "border-white bg-white text-neutral-950"
                    : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-neutral-300"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="space-y-8 border-t border-white/5 pt-16"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="group border border-white bg-white px-12 py-5 text-[9px] font-bold tracking-[0.4em] text-neutral-950 uppercase transition-all hover:bg-transparent hover:text-white disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => navigate("/my-profile")}
              className="text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-colors hover:text-white"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
