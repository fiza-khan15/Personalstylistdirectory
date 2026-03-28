import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export const SignIn = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, accountType } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * NAVIGATION HANDLER
   * Waits for auth to finish loading, then navigates based on account type
   */
  useEffect(() => {
    // Only navigate when auth is confirmed loaded and user is logged in
    if (!isLoading && isLoggedIn && accountType) {
      console.log("Auth complete, navigating to:", accountType === "stylist" ? "/dashboard" : "/my-profile");
      
      if (accountType === "stylist") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/my-profile", { replace: true });
      }
    }
  }, [isLoggedIn, isLoading, accountType, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);
    console.log("Starting sign in");

    try {
      // Authenticate with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError("Invalid credentials. Please try again.");
        return;
      }

      if (!data.user) {
        console.error("No user data returned");
        setError("Authentication failed. Please try again.");
        return;
      }

      console.log("Sign in successful, user ID:", data.user.id);
      
      // DO NOT:
      // - Manually touch localStorage
      // - Fetch profile here (AuthContext handles it)
      // - Navigate here (useEffect handles it)
      // 
      // Supabase will fire SIGNED_IN event
      // AuthContext will detect it and fetch profile
      // useEffect above will navigate when ready

    } catch (err) {
      console.error("Sign in exception:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
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
              disabled={isSubmitting}
              className="group relative overflow-hidden border border-white/10 px-16 py-5 text-[10px] font-bold tracking-[0.4em] text-white uppercase transition-all hover:border-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isSubmitting ? "Signing In..." : "Sign In"}
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
              onClick={() => navigate("/access-hub")}
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
