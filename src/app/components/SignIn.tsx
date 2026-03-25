import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

interface SignInProps {
  onNavigate: (page: string) => void;
  onSignInSuccess: (accountType: "client" | "stylist") => void;
}

export const SignIn = ({ onNavigate, onSignInSuccess }: SignInProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        setError("Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      // For demo purposes, determine account type based on email domain or metadata
      // In production, you'd fetch this from user metadata or a separate table
      const accountType = data.user?.email?.includes("stylist") ? "stylist" : "client";
      
      onSignInSuccess(accountType);
      onNavigate(accountType === "stylist" ? "dashboard" : "my-profile");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white tracking-tight">
            Sign In
          </h1>
          <div className="mx-auto h-[1px] w-12 bg-neutral-800" />
          <p className="text-xs tracking-[0.15em] text-neutral-500 uppercase leading-relaxed">
            Enter your credentials to access your private account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Email Field */}
          <div className="space-y-3">
            <label
              htmlFor="email"
              className="block text-[10px] font-medium tracking-[0.3em] text-neutral-500 uppercase"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-b border-white/10 bg-transparent py-4 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-red-900 transition-colors"
              placeholder="your@email.com"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <label
              htmlFor="password"
              className="block text-[10px] font-medium tracking-[0.3em] text-neutral-500 uppercase"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border-b border-white/10 bg-transparent py-4 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-red-900 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center">
              <p className="text-xs tracking-wide text-red-900/80">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative overflow-hidden border border-white/10 px-16 py-5 text-[10px] font-bold tracking-[0.4em] text-white uppercase transition-all hover:border-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isLoading ? "Signing In..." : "Sign In"}
              </span>
              <span className="absolute inset-0 bg-red-900/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </button>
          </div>
        </form>

        {/* Secondary Link */}
        <div className="text-center mt-16 pt-16 border-t border-white/5">
          <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
            Have not yet received access?{" "}
            <button
              onClick={() => onNavigate("access-hub")}
              className="text-neutral-500 hover:text-white transition-colors underline underline-offset-4"
            >
              Submit a request
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
