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

  // SINGLE SOURCE OF TRUTH: App.tsx authentication state handles navigation
  // Watch auth state and navigate based on AuthContext updates
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      if (accountType === "stylist") {
        navigate("/dashboard");
      } else {
        navigate("/my-profile");
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

    // Prevent double submissions
    if (isSubmitting) {
      return;
    }

    // Step 1: Set loading state and clear previous errors
    setError("");
    setIsSubmitting(true);
    console.log("Starting sign in process...");

    try {
      // Step 2: Authenticate using signInWithPassword
      console.log("Authenticating with email:", formData.email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      // Step 3: Handle authentication failure
      if (signInError) {
        console.error("Sign in error:", signInError);
        setError("Invalid credentials. Please try again.");
        return; // Stop execution - finally block will clear loading
      }

      if (!data.user) {
        console.error("No user data returned");
        setError("Authentication failed. Please try again.");
        return; // Stop execution - finally block will clear loading
      }

      console.log("Authentication successful, user ID:", data.user.id);

      // Step 4: Fetch user profile from database using maybeSingle()
      console.log("Fetching user profile...");
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("user_id", data.user.id)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        setError("Could not load your profile. Please contact support.");
        return; // Stop execution - finally block will clear loading
      }

      // Determine accountType from profiles.user_type
      const accountType = profile?.user_type || "client"; // Default to client if no profile
      console.log("Profile fetched successfully, user type:", accountType);

      // Store auth session in localStorage for instant feedback on reload
      localStorage.setItem('atelistry-auth', 'true');

      console.log("Sign in complete, waiting for AuthContext to update and trigger navigation...");
      // DO NOT NAVIGATE HERE ❌
      // Navigation is handled by useEffect above watching AuthContext state
      // The onAuthStateChange listener in AuthContext will update state
      // which triggers the useEffect to navigate (single source of truth)

    } catch (err) {
      console.error("Unexpected error during sign in:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      // Step 5: Always clear loading state
      // This runs in ALL cases: success, error, exception, network failure
      console.log("Clearing loading state");
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