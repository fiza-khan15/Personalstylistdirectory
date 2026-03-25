import React, { useState } from "react";
import { motion } from "motion/react";
import { supabase } from "../../lib/supabase";

interface StylistApplicationProps {
  onNavigate?: (page: string) => void;
}

export const StylistApplication = ({ onNavigate }: StylistApplicationProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    professionalTitle: "",
    location: "",
    yearsOfPractice: "",
    portfolioLink: "",
    areasOfPractice: [] as string[],
    approach: "",
    clientContext: "",
    confirmationChecked: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const areaOptions = [
    "Personal Styling",
    "Image Consulting",
    "Wardrobe Development",
    "Corporate / Executive Styling",
    "Special Occasion Styling",
  ];

  const handleAreaToggle = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      areasOfPractice: prev.areasOfPractice.includes(area)
        ? prev.areasOfPractice.filter((a) => a !== area)
        : [...prev.areasOfPractice, area],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirmationChecked) {
      alert("Please confirm that your information is accurate.");
      return;
    }
    
    try {
      // Insert data into Supabase
      const { data, error } = await supabase
        .from("access_requests")
        .insert([
          {
            type: "stylist",
            name: formData.fullName,
            email: formData.email,
            location: formData.location,
            professional_title: formData.professionalTitle,
            years_experience: formData.yearsOfPractice,
            website: formData.portfolioLink,
            areas_of_practice: formData.areasOfPractice.join(", "),
            approach: formData.approach,
            stylist_client_context: formData.clientContext,
            status: "pending"
          },
        ]);

      if (error) {
        console.error("Error inserting data:", error);
        alert("There was an error submitting your application. Please try again.");
        return;
      }

      console.log("Data inserted successfully:", data);
      setSubmitted(true);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("There was an error submitting your application. Please try again.");
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
            Application <span className="italic text-neutral-400">Received</span>
          </h1>
          <p className="text-sm leading-[2.2] tracking-[0.15em] text-neutral-400 max-w-lg mx-auto">
            Thank you for your application to ATELISTRY. Our editorial team will review your submission and contact you personally within 5-7 business days.
          </p>
          <button
            onClick={() => onNavigate?.("home")}
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
            Apply for <span className="italic text-neutral-400">Access</span>
          </h1>
          <p className="text-sm leading-[2.2] tracking-[0.15em] text-neutral-400">
            A professional network for personal stylists who practice with intention, depth, and clarity.
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
          ATELISTRY is a curated platform designed to support meaningful, long-term stylist–client relationships.
          Applications are reviewed to ensure alignment with our standards of practice, professionalism, and discretion.
        </motion.p>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-2xl px-6 md:px-12 py-20">
        <form onSubmit={handleSubmit} className="space-y-24">
          {/* Professional Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase block">
              Professional Overview
            </span>

            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-bold tracking-[0.5em] text-neutral-500 uppercase mb-6 block">
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
                <span className="text-[10px] font-bold tracking-[0.5em] text-neutral-500 uppercase mb-6 block">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-b border-white/10 bg-transparent py-4 text-sm tracking-[0.05em] text-white outline-none focus:border-red-900 transition-colors placeholder:text-neutral-700"
                  placeholder="Enter your email"
                />
              </label>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-bold tracking-[0.5em] text-neutral-500 uppercase mb-6 block">
                  Professional Title
                </span>
                <input
                  type="text"
                  required
                  value={formData.professionalTitle}
                  onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
                  className="w-full border-b border-white/10 bg-transparent py-4 text-sm tracking-[0.05em] text-white outline-none focus:border-red-900 transition-colors placeholder:text-neutral-700"
                  placeholder="e.g. Personal Stylist, Image Consultant"
                />
              </label>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-bold tracking-[0.5em] text-neutral-500 uppercase mb-6 block">
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

            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-bold tracking-[0.5em] text-neutral-500 uppercase mb-6 block">
                  Years of Practice
                </span>
                <input
                  type="text"
                  required
                  value={formData.yearsOfPractice}
                  onChange={(e) => setFormData({ ...formData, yearsOfPractice: e.target.value })}
                  className="w-full border-b border-white/10 bg-transparent py-4 text-sm tracking-[0.05em] text-white outline-none focus:border-red-900 transition-colors placeholder:text-neutral-700"
                  placeholder="e.g. 5 years"
                />
              </label>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-bold tracking-[0.5em] text-neutral-500 uppercase mb-6 block">
                  Website / Portfolio Link
                </span>
                <input
                  type="url"
                  value={formData.portfolioLink}
                  onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                  className="w-full border-b border-white/10 bg-transparent py-4 text-sm tracking-[0.05em] text-white outline-none focus:border-red-900 transition-colors placeholder:text-neutral-700"
                  placeholder="https://yourwebsite.com"
                />
              </label>
            </div>
          </motion.div>

          {/* Areas of Practice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8 border-t border-white/5 pt-24"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase block">
              Areas of Practice
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {areaOptions.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleAreaToggle(area)}
                  className={`px-8 py-6 border text-[10px] font-medium tracking-[0.3em] uppercase transition-all text-left ${
                    formData.areasOfPractice.includes(area)
                      ? "border-red-900 bg-red-900/10 text-white"
                      : "border-white/10 text-neutral-500 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Philosophy & Approach */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-8 border-t border-white/5 pt-24"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase block">
              Your Approach
            </span>
            <label className="block">
              <textarea
                required
                value={formData.approach}
                onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                rows={6}
                className="w-full border border-white/10 bg-transparent p-6 text-sm leading-[2] tracking-[0.05em] text-white outline-none focus:border-red-900 transition-colors placeholder:text-neutral-700 resize-none"
                placeholder="Briefly describe how you work with clients and what defines your approach to personal style."
              />
            </label>
          </motion.div>

          {/* Client Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8 border-t border-white/5 pt-24"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase block">
              Client Context
            </span>
            <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
              Optional
            </p>
            <label className="block">
              <textarea
                value={formData.clientContext}
                onChange={(e) => setFormData({ ...formData, clientContext: e.target.value })}
                rows={4}
                className="w-full border border-white/10 bg-transparent p-6 text-sm leading-[2] tracking-[0.05em] text-white outline-none focus:border-red-900 transition-colors placeholder:text-neutral-700 resize-none"
                placeholder="Who do you primarily work with? (e.g. professionals, creatives, founders, individuals in transition)"
              />
            </label>
          </motion.div>

          {/* Membership Disclosure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8 border-t border-white/5 pt-24"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] text-red-900 uppercase block">
              Professional Participation
            </span>
            <p className="text-sm leading-[2.2] tracking-[0.05em] text-neutral-400">
              ATELISTRY operates as a curated professional network.
              Accepted stylists participate through a monthly membership that supports platform operations, editorial positioning, and long-term ecosystem development.
            </p>
            <p className="text-sm leading-[2.2] tracking-[0.05em] text-neutral-400">
              This structure allows us to maintain quality, discretion, and independence.
            </p>
          </motion.div>

          {/* Consent & Integrity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8 border-t border-white/5 pt-24"
          >
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.confirmationChecked}
                onChange={(e) => setFormData({ ...formData, confirmationChecked: e.target.checked })}
                className="mt-1 w-5 h-5 border border-white/10 bg-transparent checked:bg-red-900 checked:border-red-900 transition-colors cursor-pointer"
                required
              />
              <span className="text-xs tracking-[0.1em] text-neutral-400 group-hover:text-white transition-colors">
                I confirm that the information provided is accurate and reflective of my professional practice.
              </span>
            </label>
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
              Submit Application
            </button>
            <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
              Applications are reviewed. You will be contacted personally.
            </p>
          </motion.div>
        </form>
      </section>

      {/* Closing Note */}
      <section className="py-60 border-t border-white/5">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-sm leading-[2.2] tracking-[0.15em] text-neutral-500 uppercase">
            ATELISTRY values professional clarity over scale. Not all applications are accepted.
          </p>
        </div>
      </section>
    </div>
  );
};