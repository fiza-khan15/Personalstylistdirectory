import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface Introduction {
  id: string;
  client_id: string;
  stylist_id: string;
  service_type: string;
  message: string;
  status: string;
  created_at: string;
}

interface ClientProfile {
  name: string;
  city: string;
  country: string;
  style_preferences: string;
}

export const StylistIntroductionDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userId } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [introduction, setIntroduction] = useState<Introduction | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const introId = searchParams.get("id");

  useEffect(() => {
    const fetchIntroductionDetail = async () => {
      try {
        if (!introId || !userId) {
          setIsLoading(false);
          return;
        }

        console.log("Fetching introduction detail:", introId);

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
          console.error("Invalid user ID format:", userId);
          setIsLoading(false);
          return;
        }

        // Fetch introduction
        const { data: introData, error: introError } = await supabase
          .from("introductions")
          .select("*")
          .eq("id", introId)
          .eq("stylist_id", userId)
          .maybeSingle();

        if (introError) {
          console.error("Introduction fetch error:", introError);
          setIntroduction(null);
          setIsLoading(false);
          return;
        }

        if (!introData) {
          console.log("Introduction not found");
          setIntroduction(null);
          setIsLoading(false);
          return;
        }

        setIntroduction(introData);

        // Fetch client profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name, city, country, style_preferences")
          .eq("user_id", introData.client_id)
          .maybeSingle();

        if (profileError) {
          console.error("Client profile fetch error:", profileError);
        } else {
          setClientProfile(profileData);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Unexpected error fetching introduction:", err);
        setIsLoading(false);
      }
    };

    fetchIntroductionDetail();
  }, [introId, userId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const handleAccept = async () => {
    if (!introduction) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("introductions")
        .update({ status: "accepted" })
        .eq("id", introduction.id);

      if (error) {
        console.error("Failed to accept introduction:", error);
      } else {
        console.log("Introduction accepted");
        setIntroduction({ ...introduction, status: "accepted" });
      }
    } catch (err) {
      console.error("Error accepting introduction:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!introduction) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("introductions")
        .update({ status: "declined" })
        .eq("id", introduction.id);

      if (error) {
        console.error("Failed to decline introduction:", error);
      } else {
        console.log("Introduction declined");
        navigate("/stylist-introductions");
      }
    } catch (err) {
      console.error("Error declining introduction:", err);
    } finally {
      setIsSubmitting(false);
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

  if (!introduction) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-8">
          <p className="font-serif text-2xl font-light text-neutral-600">
            Introduction not found
          </p>
          <button
            onClick={() => navigate("/stylist-introductions")}
            className="text-[9px] font-medium tracking-[0.3em] text-neutral-700 uppercase hover:text-white transition-colors"
          >
            ← Return to Introductions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-8 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-24 text-center"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-light text-white mb-16">
            {clientProfile?.name || ""}
          </h1>
          
          <p className="text-[10px] tracking-[0.2em] leading-relaxed text-neutral-500 max-w-2xl mx-auto mb-16">
            {introduction.message || ""}
          </p>

          {/* Info Grid */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-left">
            <div className="space-y-1">
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                Date
              </p>
              <p className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase">
                {formatDate(introduction.created_at)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                Portfolio
              </p>
              <p className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase">
                {introduction.service_type || ""}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                Compensation Range
              </p>
              <p className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase">
                {clientProfile?.style_preferences || ""}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-center gap-4 mb-16"
        >
          <button
            onClick={handleAccept}
            disabled={isSubmitting || introduction.status === "accepted"}
            className="bg-white text-black px-10 py-4 text-[8px] font-bold tracking-[0.4em] uppercase transition-all duration-300 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {introduction.status === "accepted" ? "Accepted" : "Accept Introduction"}
          </button>

          <button
            onClick={handleDecline}
            disabled={isSubmitting}
            className="border border-white/10 text-white px-10 py-4 text-[8px] font-bold tracking-[0.4em] uppercase transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50"
          >
            Decline
          </button>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={() => navigate("/stylist-introductions")}
            className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase hover:text-white transition-colors duration-300"
          >
            ← Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};