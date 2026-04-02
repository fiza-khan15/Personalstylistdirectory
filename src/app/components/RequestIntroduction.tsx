import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight } from "lucide-react";

export const RequestIntroduction = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [searchParams] = useSearchParams();
  const stylistId = searchParams.get("stylist");

  const [isLoading, setIsLoading] = useState(true);
  const [stylistProfile, setStylistProfile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    serviceType: "",
    timeline: "",
    message: "",
  });

  useEffect(() => {
    const fetchStylistProfile = async () => {
      if (!stylistId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("user_id, name, professional_title, city")
          .eq("id", stylistId)
          .eq("user_type", "stylist")
          .maybeSingle();

        if (error) {
          console.error("Failed to fetch stylist profile:", error);
          setStylistProfile(null);
        } else {
          setStylistProfile(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching stylist:", err);
        setStylistProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStylistProfile();
  }, [stylistId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !stylistProfile) {
      console.error("Missing user ID or stylist profile");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("introductions").insert([
        {
          client_id: userId,
          stylist_id: stylistProfile.user_id,
          service_type: formData.serviceType,
          message: formData.message,
          timeline: formData.timeline,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Failed to submit introduction request:", error);
      } else {
        console.log("Introduction request submitted successfully");
        // Redirect to My Profile with success message
        navigate("/my-profile?success=request-submitted");
      }
    } catch (err) {
      console.error("Unexpected error submitting request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
          Loading...
        </p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-8">
          <p className="font-serif text-xl text-neutral-500">
            Please sign in to request an introduction.
          </p>
          <button
            onClick={() => navigate("/sign-in")}
            className="text-[10px] font-medium tracking-[0.3em] text-neutral-600 uppercase hover:text-white transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!stylistId || !stylistProfile) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-8">
          <p className="font-serif text-xl text-neutral-500">
            Stylist not found.
          </p>
          <button
            onClick={() => navigate("/directory")}
            className="text-[10px] font-medium tracking-[0.3em] text-neutral-600 uppercase hover:text-white transition-all"
          >
            ← Back to Network
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 pt-32 text-white overflow-hidden">
      {/* Header Section */}
      <section className="mx-auto max-w-4xl px-6 md:px-12 py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="space-y-12"
        >
          <div className="h-px w-16 bg-red-900" />
          <h1 className="font-serif text-6xl md:text-7xl font-light leading-[1] tracking-tighter text-white">
            Request <span className="italic text-neutral-400">Introduction</span>
          </h1>
          <p className="text-sm leading-[2.2] tracking-[0.1em] text-neutral-400 max-w-2xl">
            Share your needs and timeline with {stylistProfile.name || "this stylist"}. 
            We facilitate introductions with care and discretion.
          </p>
        </motion.div>
      </section>

      {/* Stylist Context */}
      <section className="mx-auto max-w-4xl px-6 md:px-12 pb-20">
        <div className="border-t border-white/5 pt-12 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase">
            Introduction Request To
          </span>
          <h2 className="font-serif text-3xl font-light text-white">
            {stylistProfile.name || ""}
          </h2>
          {stylistProfile.professional_title && (
            <p className="text-sm tracking-[0.15em] text-neutral-400 uppercase">
              {stylistProfile.professional_title}
            </p>
          )}
          {stylistProfile.city && (
            <p className="text-[11px] tracking-[0.2em] text-neutral-500 uppercase">
              {stylistProfile.city}
            </p>
          )}
        </div>
      </section>

      {/* Form Section */}
      <section className="mx-auto max-w-4xl px-6 md:px-12 py-40 border-t border-white/5">
        <form onSubmit={handleSubmit} className="space-y-16">
          {/* Service Type */}
          <div className="space-y-6">
            <label className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-medium">
              Service Type
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) =>
                setFormData({ ...formData, serviceType: e.target.value })
              }
              className="w-full bg-transparent border-b border-white/10 py-4 text-sm tracking-wider text-white focus:border-red-900 transition-colors outline-none appearance-none cursor-pointer"
              required
            >
              <option value="" disabled className="bg-neutral-950">
                Select a service type
              </option>
              <option value="Personal Styling" className="bg-neutral-950">
                Personal Styling
              </option>
              <option value="Image Consulting" className="bg-neutral-950">
                Image Consulting
              </option>
              <option value="Wardrobe Development" className="bg-neutral-950">
                Wardrobe Development
              </option>
              <option value="Corporate Styling" className="bg-neutral-950">
                Corporate Styling
              </option>
              <option value="Special Occasion Styling" className="bg-neutral-950">
                Special Occasion Styling
              </option>
            </select>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            <label className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-medium">
              Timeline
            </label>
            <input
              type="text"
              value={formData.timeline}
              onChange={(e) =>
                setFormData({ ...formData, timeline: e.target.value })
              }
              placeholder="e.g., Immediately, Within 1 Month, April 2026, Flexible"
              className="w-full bg-transparent border-b border-white/10 py-4 text-sm tracking-wider text-white placeholder:text-neutral-700 focus:border-red-900 transition-colors outline-none"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-6">
            <label className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-medium">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Share your vision, needs, and what you're hoping to achieve through this collaboration."
              className="w-full bg-transparent border border-white/10 px-4 py-4 text-sm tracking-wider text-white placeholder:text-neutral-700 focus:border-red-900 transition-colors outline-none min-h-[200px] resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-12 flex flex-col md:flex-row gap-8 items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group px-16 py-6 border border-white/10 text-[10px] font-bold tracking-[0.5em] text-white uppercase hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/stylist/${stylistId}`)}
              className="text-[10px] font-medium tracking-[0.3em] text-neutral-600 uppercase hover:text-white transition-all"
            >
              ← Back to Profile
            </button>
          </div>
        </form>
      </section>

      {/* Footer Note */}
      <section className="mx-auto max-w-4xl px-6 md:px-12 py-40 border-t border-white/5">
        <p className="text-[10px] leading-loose tracking-[0.2em] text-neutral-600 uppercase text-center">
          All introduction requests are reviewed to ensure alignment and appropriateness. 
          You will receive a response within 48 hours.
        </p>
      </section>
    </div>
  );
};
