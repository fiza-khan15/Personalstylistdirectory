import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";

export const ClientProfileEditor = () => {
  const navigate = useNavigate();
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
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error("Auth error:", authError);
          setIsLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!profileError && profile) {
          setName(profile.name || "");
          setCity(profile.city || "");
          setStyleDescription(profile.style_preferences || "");
          setSelectedInterests(profile.style_interests || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error("Auth error:", authError);
        setIsSaving(false);
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
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
        
        {/* Header */}
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

        {/* Name */}
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

        {/* City */}
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

        {/* Style Preferences */}
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
          <p className="text-[9px] tracking-[0.2em] text-neutral-600 uppercase">
            Share your vision for your personal style and wardrobe goals.
          </p>
        </motion.div>

        {/* Style Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-32 space-y-8 border-t border-white/5 pt-20"
        >
          <div className="space-y-4">
            <span className="text-[9px] font-bold tracking-[0.5em] text-red-900 uppercase">
              Style Interests
            </span>
            <p className="text-[9px] tracking-[0.2em] text-neutral-600 uppercase">
              Select all that resonate with your aesthetic.
            </p>
          </div>
          
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

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="space-y-8 border-t border-white/5 pt-16"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <button
              onClick={handleSave}
              className="group border border-white bg-white px-12 py-5 text-[9px] font-bold tracking-[0.4em] text-neutral-950 uppercase transition-all hover:bg-transparent hover:text-white"
            >
              Save Changes
            </button>
            
            <button
              onClick={() => navigate("/my-profile")}
              className="text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-colors hover:text-white"
            >
              Cancel
            </button>
          </div>
        </motion.div>

        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-24 border-t border-white/5 pt-12"
        >
          <button
            onClick={() => navigate("/my-profile")}
            className="text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-colors hover:text-white"
          >
            ← Back to Profile
          </button>
        </motion.div>
      </div>
    </div>
  );
};