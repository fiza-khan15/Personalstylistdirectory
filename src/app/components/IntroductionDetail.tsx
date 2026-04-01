import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export const IntroductionDetail = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [searchParams] = useSearchParams();
  const introductionId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(true);
  const [introduction, setIntroduction] = useState<any>(null);
  const [stylistProfile, setStylistProfile] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [showResponseArea, setShowResponseArea] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchIntroduction = async () => {
      try {
        if (!userId || !introductionId) {
          setIsLoading(false);
          return;
        }

        console.log("Fetching introduction:", introductionId);

        // Fetch introduction data
        const { data: introData, error: introError } = await supabase
          .from("introductions")
          .select("*")
          .eq("id", introductionId)
          .eq("client_id", userId)
          .maybeSingle();

        if (introError) {
          console.error("Introduction fetch error:", introError);
          setIntroduction(null);
        } else if (introData) {
          setIntroduction(introData);
          console.log("Introduction loaded:", introData);

          // Fetch stylist profile
          const { data: stylistData, error: stylistError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", introData.stylist_id)
            .maybeSingle();

          if (!stylistError && stylistData) {
            setStylistProfile(stylistData);
            console.log("Stylist profile loaded:", stylistData);
          } else if (stylistError) {
            console.error("Stylist profile fetch error:", stylistError);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntroduction();
  }, [userId, introductionId]);

  const handleSubmitResponse = async () => {
    if (!response.trim() || !introductionId) return;

    setIsSending(true);
    try {
      // In a real implementation, you would save the response to a messages table
      // For now, we'll just log it
      console.log("Sending response:", response);
      
      // Clear the form
      setResponse("");
      setShowResponseArea(false);
    } catch (err) {
      console.error("Error sending response:", err);
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getStatusLabel = (status: string) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
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

  if (!introduction || !stylistProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <p className="font-serif text-xl font-light text-neutral-600">
            Introduction not found
          </p>
          <button
            onClick={() => navigate("/my-profile")}
            className="text-[8px] tracking-[0.3em] text-neutral-500 uppercase hover:text-white transition-colors"
          >
            Return to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-8 pt-32 pb-24">
        {/* Back Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate("/my-profile")}
          className="mb-16 text-[8px] tracking-[0.3em] text-neutral-600 uppercase hover:text-white transition-colors"
        >
          ← Return to Profile
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 flex items-start justify-between gap-8"
        >
          <div className="flex-1">
            <h1 className="font-serif text-5xl md:text-6xl font-light text-white mb-6">
              {stylistProfile.full_name || stylistProfile.name || ""}
            </h1>
            <p className="text-[8px] tracking-[0.3em] text-neutral-600 uppercase mb-8">
              {introduction.service_type || "Personal Styling / Wardrobe Building"}
            </p>
            <div className="flex items-center gap-12">
              <div>
                <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-2">
                  Status
                </p>
                <p className="text-[8px] tracking-[0.3em] text-[#4a1a1a] uppercase">
                  {getStatusLabel(introduction.status)}
                </p>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-2">
                  Date Submitted
                </p>
                <p className="text-[8px] tracking-[0.3em] text-neutral-500 uppercase">
                  {formatDate(introduction.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Image Placeholder */}
          <div className="hidden md:block w-24 h-24 border border-white/10 bg-neutral-950" />
        </motion.div>

        {/* Your Message Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20 border-t border-white/10 pt-16"
        >
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase mb-12">
            Your Message
          </h2>

          <p className="font-serif text-lg md:text-xl leading-loose text-neutral-400 italic max-w-3xl">
            {introduction.message || ""}
          </p>
        </motion.div>

        {/* Stylist Response Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20 border-t border-white/10 pt-16"
        >
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase mb-12">
            Stylist Response
          </h2>

          {introduction.stylist_response ? (
            <div className="space-y-10">
              <div>
                <p className="text-[8px] tracking-[0.3em] text-white uppercase mb-4">
                  {stylistProfile.full_name || stylistProfile.name || ""}
                </p>
                <p className="text-sm leading-loose text-neutral-400 max-w-3xl">
                  {introduction.stylist_response}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-600">
              Awaiting response from stylist
            </p>
          )}
        </motion.div>

        {/* Continue Correspondence Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20 border-t border-white/10 pt-16"
        >
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase mb-12">
            Continue Correspondence
          </h2>

          {!showResponseArea ? (
            <button
              onClick={() => setShowResponseArea(true)}
              className="text-[8px] tracking-[0.3em] text-neutral-500 uppercase hover:text-white transition-colors"
            >
              + Add Message
            </button>
          ) : (
            <div className="space-y-8">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Continue your conversation..."
                rows={6}
                className="w-full border border-white/10 bg-transparent p-4 text-white text-sm outline-none transition-colors focus:border-white/30 resize-none placeholder:text-neutral-700"
              />
              
              <div className="flex gap-4">
                <button
                  onClick={handleSubmitResponse}
                  disabled={!response.trim() || isSending}
                  className="border border-white/10 bg-white px-8 py-3 text-[8px] font-medium tracking-[0.4em] text-black uppercase transition-all hover:bg-white/90 disabled:opacity-50"
                >
                  {isSending ? "Sending..." : "Send Message"}
                </button>
                <button
                  onClick={() => {
                    setShowResponseArea(false);
                    setResponse("");
                  }}
                  className="text-[8px] tracking-[0.3em] text-neutral-500 uppercase hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row gap-4 border-t border-white/10 pt-16"
        >
          <button
            className="border border-white/10 px-8 py-4 text-[8px] font-medium tracking-[0.4em] text-white uppercase hover:border-white/20 hover:bg-white/[0.02] transition-all"
          >
            Schedule Consultation
          </button>
          
          <button
            onClick={() => navigate(`/stylist/${introduction.stylist_id}`)}
            className="border border-white/10 px-8 py-4 text-[8px] font-medium tracking-[0.4em] text-neutral-500 uppercase hover:text-white hover:border-white/20 transition-all"
          >
            View Full Profile
          </button>
        </motion.div>
      </div>
    </div>
  );
};