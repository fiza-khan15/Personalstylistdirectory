import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
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

export const StylistIntroductions = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [introductions, setIntroductions] = useState<Introduction[]>([]);

  useEffect(() => {
    const fetchIntroductions = async () => {
      try {
        if (!userId) {
          setIsLoading(false);
          return;
        }

        console.log("Fetching introductions for stylist:", userId);

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
          console.error("Invalid user ID format:", userId);
          setIntroductions([]);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("introductions")
          .select("*")
          .eq("stylist_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Introductions fetch error:", error);
          setIntroductions([]);
        } else {
          console.log("Introductions loaded:", data?.length || 0);
          setIntroductions(data || []);
        }
      } catch (err) {
        console.error("Unexpected introductions fetch error:", err);
        setIntroductions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntroductions();
  }, [userId]);

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
        return "text-emerald-700/80";
      case "accepted":
        return "text-emerald-700/80";
      case "closed":
        return "text-neutral-600";
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="h-px w-24 mx-auto bg-red-900/20 animate-pulse" />
          <p className="text-[10px] tracking-[0.3em] text-neutral-700 uppercase animate-pulse">
            Loading introductions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-40 md:py-48">
      <div className="mx-auto max-w-6xl px-6 md:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32 space-y-8"
        >
          <h1 className="font-serif text-6xl md:text-8xl font-light tracking-tight text-white">
            Introductions
          </h1>
          <div className="h-px w-16 bg-red-900/30" />
          <p className="text-[9px] leading-loose tracking-[0.25em] text-neutral-700 uppercase max-w-2xl">
            Client inquiries facilitated through the Atelistry concierge service
          </p>
        </motion.div>

        {/* Introductions List */}
        {introductions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="py-32 text-center space-y-8"
          >
            <div className="h-px w-12 mx-auto bg-red-900/20" />
            <p className="font-serif text-2xl font-light text-neutral-600">
              No introductions yet
            </p>
            <p className="text-[9px] tracking-[0.2em] text-neutral-800 uppercase">
              Client inquiries will appear here
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-0"
          >
            {introductions.map((intro, index) => (
              <motion.div
                key={intro.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4 + index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group grid grid-cols-1 gap-8 border-b border-white/[0.03] py-12 transition-all duration-500 hover:bg-white/[0.01] md:grid-cols-5 md:items-center ${
                  index === 0 ? "border-t" : ""
                }`}
              >
                <div className="space-y-3 md:col-span-2">
                  <p className="text-[9px] tracking-[0.3em] text-neutral-700 uppercase">
                    {formatDate(intro.created_at)}
                  </p>
                  <p className="font-serif text-xl font-light text-white">
                    Introduction Request
                  </p>
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
                    {intro.service_type || "Not specified"}
                  </p>
                </div>

                <div>
                  <span
                    className={`text-[9px] font-medium tracking-[0.4em] uppercase ${getStatusColor(
                      intro.status
                    )}`}
                  >
                    {getStatusLabel(intro.status)}
                  </span>
                </div>

                <div className="flex justify-start md:justify-end">
                  <button
                    onClick={() =>
                      navigate(`/stylist-introduction-detail?id=${intro.id}`)
                    }
                    className="border-b border-white/5 pb-1 text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-all duration-300 hover:border-white/30 hover:text-white"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-32 border-t border-white/[0.03] pt-16"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-3 text-[9px] font-medium tracking-[0.3em] text-neutral-700 uppercase transition-colors duration-300 hover:text-white"
          >
            <span className="text-red-900/50 group-hover:text-red-900 transition-colors">
              ←
            </span>
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};