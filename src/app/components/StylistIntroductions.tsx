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
  client_name?: string; // From profiles table
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

        // Fetch introductions where stylist_id = authenticated user id
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
          
          // Fetch client names from profiles table
          const introductionsWithClientNames = await Promise.all(
            (data || []).map(async (intro) => {
              const { data: clientProfile } = await supabase
                .from("profiles")
                .select("name")
                .eq("user_id", intro.client_id)
                .maybeSingle();
              
              return {
                ...intro,
                client_name: clientProfile?.name || "",
              };
            })
          );
          
          setIntroductions(introductionsWithClientNames);
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
      return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-amber-600";
      case "active":
        return "text-emerald-600";
      case "accepted":
        return "text-emerald-600";
      case "closed":
        return "text-neutral-600";
      case "declined":
        return "text-neutral-600";
      default:
        return "text-neutral-600";
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

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-8 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white text-center">
            Introductions
          </h1>
        </motion.div>

        {/* Introductions List */}
        {introductions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="py-32 text-center"
          >
            <p className="font-serif text-xl font-light text-neutral-600">
              No introductions yet
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-0"
          >
            {introductions.map((intro, index) => (
              <motion.button
                key={intro.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + index * 0.05,
                }}
                onClick={() => navigate(`/stylist-introduction-detail?id=${intro.id}`)}
                className={`w-full group grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr] gap-6 border-b border-white/10 py-8 transition-all duration-300 hover:bg-white/[0.02] text-left ${
                  index === 0 ? "border-t" : ""
                }`}
              >
                {/* Client Name */}
                <div>
                  <p className="font-serif text-xl font-light text-white group-hover:text-white/80 transition-colors">
                    {intro.client_name || ""}
                  </p>
                </div>

                {/* Service Type */}
                <div>
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    {intro.service_type || ""}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`text-[8px] font-medium tracking-[0.3em] uppercase ${getStatusColor(
                      intro.status
                    )}`}
                  >
                    {getStatusLabel(intro.status)}
                  </span>
                </div>

                {/* Date */}
                <div className="text-right">
                  <p className="text-[9px] tracking-[0.3em] text-neutral-700 uppercase">
                    {formatDate(intro.created_at)}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};