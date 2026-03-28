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
  const [response, setResponse] = useState("");
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
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date unavailable";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-amber-700/80";
      case "active":
      case "accepted":
        return "text-emerald-700/80";
      case "closed":
      case "declined":
        return "text-neutral-600";
      default:
        return "text-neutral-600";
    }
  };

  const getStatusLabel = (status: string) => {
    if (!status) return "Status Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="h-px w-24 mx-auto bg-red-900/20 animate-pulse" />
          <p className="text-[10px] tracking-[0.3em] text-neutral-700 uppercase animate-pulse">
            Loading introduction
          </p>
        </div>
      </div>
    );
  }

  if (!introduction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="h-px w-12 mx-auto bg-red-900/20" />
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
    <div className="min-h-screen py-40 md:py-48">
      <div className="mx-auto max-w-4xl px-6 md:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32 space-y-12"
        >
          <div className="space-y-6">
            <h1 className="font-serif text-6xl md:text-8xl font-light tracking-tight text-white">
              {clientProfile?.name || "Client Introduction"}
            </h1>
            <div className="h-px w-16 bg-red-900/30" />
          </div>

          <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
            <div className="space-y-2">
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                Service Type
              </p>
              <p className="text-[10px] font-light tracking-[0.25em] text-neutral-400 uppercase">
                {introduction.service_type || "Not specified"}
              </p>
            </div>

            <div className="h-8 w-px bg-white/[0.03]" />

            <div className="space-y-2">
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                Status
              </p>
              <p
                className={`text-[10px] font-medium tracking-[0.3em] uppercase ${getStatusColor(
                  introduction.status
                )}`}
              >
                {getStatusLabel(introduction.status)}
              </p>
            </div>

            <div className="h-8 w-px bg-white/[0.03]" />

            <div className="space-y-2">
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                Received
              </p>
              <p className="text-[10px] font-light tracking-[0.25em] text-neutral-400 uppercase">
                {formatDate(introduction.created_at)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Client Request */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-32 space-y-10 border-t border-white/[0.03] pt-20"
        >
          <h2 className="text-[8px] font-medium tracking-[0.5em] text-red-900/80 uppercase">
            Client Request
          </h2>

          <p className="font-serif text-xl md:text-2xl font-light leading-loose text-neutral-300">
            {introduction.message || "No message provided"}
          </p>
        </motion.div>

        {/* Client Context */}
        {clientProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-32 space-y-16 border-t border-white/[0.03] pt-20"
          >
            <h2 className="text-[8px] font-medium tracking-[0.5em] text-red-900/80 uppercase">
              Client Context
            </h2>

            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                  Location
                </p>
                <p className="font-serif text-xl font-light text-white">
                  {clientProfile.city && clientProfile.country
                    ? `${clientProfile.city}, ${clientProfile.country}`
                    : clientProfile.city || clientProfile.country || "Not provided"}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase">
                  Style Direction
                </p>
                <p className="font-serif text-xl font-light text-white">
                  {clientProfile.style_preferences || "Not provided"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Response Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-32 space-y-10 border-t border-white/[0.03] pt-20"
        >
          <h2 className="text-[8px] font-medium tracking-[0.5em] text-red-900/80 uppercase">
            Your Response
          </h2>

          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Compose your response to the client..."
            className="w-full min-h-[280px] resize-none border border-white/[0.05] bg-transparent px-10 py-8 font-serif text-lg font-light leading-loose text-white placeholder:text-neutral-800 focus:border-white/[0.1] focus:outline-none transition-colors duration-300"
          />

          <p className="text-[8px] tracking-[0.25em] text-neutral-800 uppercase">
            This message will be facilitated through the Atelistry concierge service
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-12 border-t border-white/[0.03] pt-20"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <button
              onClick={handleAccept}
              disabled={isSubmitting || introduction.status === "accepted"}
              className="group border border-white bg-white px-16 py-6 text-[9px] font-bold tracking-[0.4em] text-neutral-950 uppercase transition-all duration-300 hover:bg-transparent hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {introduction.status === "accepted" ? "Accepted" : "Accept Introduction"}
            </button>

            <button
              disabled={isSubmitting}
              className="group border border-white/10 px-16 py-6 text-[9px] font-bold tracking-[0.4em] text-white uppercase transition-all duration-300 hover:border-white hover:bg-white hover:text-neutral-950 disabled:opacity-50"
            >
              Send Response
            </button>

            <button
              onClick={handleDecline}
              disabled={isSubmitting}
              className="text-[9px] font-medium tracking-[0.3em] text-neutral-700 uppercase transition-colors hover:text-white md:ml-auto disabled:opacity-50"
            >
              Decline
            </button>
          </div>
        </motion.div>

        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-32 border-t border-white/[0.03] pt-16"
        >
          <button
            onClick={() => navigate("/stylist-introductions")}
            className="group flex items-center gap-3 text-[9px] font-medium tracking-[0.3em] text-neutral-700 uppercase transition-colors duration-300 hover:text-white"
          >
            <span className="text-red-900/50 group-hover:text-red-900 transition-colors">
              ←
            </span>
            Return to Introductions
          </button>
        </motion.div>
      </div>
    </div>
  );
};