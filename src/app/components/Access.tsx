import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";

export const Access = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    context: "",
    preferences: [] as string[],
  });

  const [submitted, setSubmitted] = useState(false);

  const preferenceOptions = [
    "Personal Stylist",
    "Image Consultant",
    "Wardrobe Development",
    "Unsure / Prefer Guidance",
  ];

  const handlePreferenceToggle = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter((p) => p !== preference)
        : [...prev.preferences, preference],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Insert data into the database
      const { data, error } = await supabase
        .from("access_requests")
        .insert([
          {
            type: "client",
            name: formData.fullName,
            email: formData.email,
            location: formData.location,
            client_context: formData.context,
            seeking: formData.preferences.join(", "),
            status: "pending"
          },
        ]);

      if (error) {
        console.error("Error inserting data:", error);
        alert("There was an error submitting your request. Please try again.");
        return;
      }
      
      console.log("Data inserted successfully:", data);
      setSubmitted(true);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("There was an error submitting your request. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-neutral-950 pt-32 text-white overflow-hidden min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="max-w-2xl px-6 text-center space-y-12 py-40"
        >
          <div className="mx-auto h-px w-16 bg-red-900" />
          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight text-white">
            Request <span className="italic text-neutral-400">Received</span>
          </h1>
          <p className="text-sm leading-[2.2] tracking-[0.15em] text-neutral-400 max-w-lg mx-auto">
            Thank you for your interest in ATELISTRY. A member of our concierge team will review your request and respond personally within 48 hours.
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-[10px] font-medium tracking-[0.3em] text-neutral-600 uppercase hover:text-white transition-all border-b border-white/5 pb-2"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 pt-32 text-white overflow-hidden">
      {/* Page Header */}
      <section className="mx-auto max-w-3xl px-6 md:px-12 py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="space-y-12 text-center"
        >
          <div className="mx-auto h-px w-16 bg-red-900" />
          <h1 className="font-serif text-6xl md:text-8xl font-light leading-[1] tracking-tighter text-white">
            Request <span className="italic text-neutral-400">Access</span>
          </h1>
          <p className="text-sm leading-[2.2] tracking-[0.15em] text-neutral-400">
            A considered introduction to personal styling, guided with discretion.
          </p>
        </motion.div>
      </section>

      {/* Introductory Copy */}
      <section className="mx-auto max-w-2xl px-6 md:px-12 py-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="text-sm leading-[2.2] tracking-[0.05em] text-neutral-400 text-center"
        >
          ATELISTRY works through a concierge-led process to ensure alignment, clarity, and trust.
          This request helps us understand your context so we may guide you thoughtfully.
        </motion.p>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-2xl px-6 md:px-12 py-20">
        <form onSubmit={handleSubmit} className="space-y-24">
          {/* Client Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase mb-6 block">
                  Full Name
                </span>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border-b border-white/10 bg-transparent py-4 text-sm tracking-[0.05em] text-white outline-none focus:border-red-900 transition-colors placeholder:text-neutral-700"
                  placeholder="Enter your name"
                />
              </label>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase mb-6 block">
                  Email Address
                </span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-b border-white/10 bg-transparent py-4 text-sm tracking-[0.05em] text-white outline-none focus:border-red-900 transition-colors placeholder:text-neutral-700"
                  placeholder="your.email@example.com"
                />
              </label>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase mb-6 block">
                  Location (City / Region)
                </span>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border-b border-white/10 bg-transparent py-4 text-sm tracking-[0.05em] text-white outline-none focus:border-red-900 transition-colors placeholder:text-neutral-700"
                  placeholder="City, Region"
                />
              </label>
            </div>
          </motion.div>

          {/* Context Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8 border-t border-white/5 pt-24"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase block">
              Your Context
            </span>
            <label className="block">
              <textarea
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                rows={6}
                className="w-full border border-white/10 bg-transparent p-6 text-sm leading-[2] tracking-[0.05em] text-white outline-none focus:border-red-900 transition-colors placeholder:text-neutral-700 resize-none"
                placeholder="Tell us what brings you to ATELISTRY — professional, personal, or transitional needs."
              />
            </label>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-8 border-t border-white/5 pt-24"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase block">
              What You're Seeking
            </span>
            <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
              Optional — Select any that apply
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preferenceOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handlePreferenceToggle(option)}
                  className={`px-8 py-6 border text-[10px] font-medium tracking-[0.3em] uppercase transition-all text-left ${
                    formData.preferences.includes(option)
                      ? "border-red-900 bg-red-900/10 text-white"
                      : "border-white/10 text-neutral-500 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Assurance Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="py-12 text-center"
          >
            <p className="text-[10px] leading-loose tracking-[0.2em] text-neutral-600 uppercase">
              Your information is reviewed privately and used solely to guide appropriate introductions.
            </p>
          </motion.div>

          {/* Primary Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="space-y-8 text-center"
          >
            <button
              type="submit"
              className="px-20 py-6 border border-white/10 text-[10px] font-bold tracking-[0.5em] text-white uppercase hover:bg-white hover:text-black transition-all"
            >
              Submit Request
            </button>
            <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
              A member of our concierge team will respond personally.
            </p>
          </motion.div>
        </form>
      </section>

      {/* Closing Tone */}
      <section className="py-60 border-t border-white/5">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-sm leading-[2.2] tracking-[0.15em] text-neutral-500 uppercase">
            ATELISTRY values clarity over speed. Introductions are handled with care.
          </p>
        </div>
      </section>
    </div>
  );
};