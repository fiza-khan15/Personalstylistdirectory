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
  timeline: string;
}

interface ClientProfile {
  name: string;
  city: string;
  style_preferences: string;
}

interface Message {
  id: string;
  introduction_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender_name?: string;
}

export const StylistIntroductionDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userId } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [introduction, setIntroduction] = useState<Introduction | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const introId = searchParams.get("id");

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

      // Fetch introduction where id = selected introduction id AND stylist_id = authenticated user
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

      // Join with profiles table using introductions.client_id = profiles.user_id
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name, city, style_preferences")
        .eq("user_id", introData.client_id)
        .maybeSingle();

      if (profileError) {
        console.error("Client profile fetch error:", profileError);
      } else {
        setClientProfile(profileData);
      }

      // Fetch messages for this introduction
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("introduction_id", introId)
        .order("created_at", { ascending: true });

      if (messagesError) {
        console.error("Messages fetch error:", messagesError);
      } else {
        // Fetch sender names for each message
        const messagesWithNames = await Promise.all(
          (messagesData || []).map(async (msg) => {
            const { data: senderProfile } = await supabase
              .from("profiles")
              .select("name")
              .eq("user_id", msg.sender_id)
              .maybeSingle();
            
            return {
              ...msg,
              sender_name: senderProfile?.name || "",
            };
          })
        );
        
        setMessages(messagesWithNames);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Unexpected error fetching introduction:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
      return "";
    }
  };

  const handleAccept = async () => {
    if (!introduction) return;

    setIsSubmitting(true);
    try {
      // Update introductions.status = 'active'
      const { error } = await supabase
        .from("introductions")
        .update({ status: "active" })
        .eq("id", introduction.id);

      if (error) {
        console.error("Failed to accept introduction:", error);
      } else {
        console.log("Introduction accepted - status updated to 'active'");
        // Refresh data after update
        await fetchIntroductionDetail();
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
      // Update introductions.status = 'closed'
      const { error } = await supabase
        .from("introductions")
        .update({ status: "closed" })
        .eq("id", introduction.id);

      if (error) {
        console.error("Failed to decline introduction:", error);
      } else {
        console.log("Introduction declined - status updated to 'closed'");
        // Navigate back to introductions list
        navigate("/stylist-introductions");
      }
    } catch (err) {
      console.error("Error declining introduction:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!introduction || !userId || !messageText.trim()) return;

    setIsSendingMessage(true);
    try {
      // Insert new message
      const { data: newMessageData, error } = await supabase
        .from("messages")
        .insert([
          {
            introduction_id: introduction.id,
            sender_id: userId,
            message: messageText,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Failed to send message:", error);
      } else {
        console.log("Message sent:", newMessageData);
        
        // Fetch sender name for the new message
        const { data: senderProfile } = await supabase
          .from("profiles")
          .select("name")
          .eq("user_id", userId)
          .maybeSingle();
        
        // Add new message to messages list with sender name
        setMessages([
          ...messages,
          {
            ...newMessageData,
            sender_name: senderProfile?.name || "",
          },
        ]);
        
        // Clear message text
        setMessageText("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSendingMessage(false);
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
          className="mb-24"
        >
          {/* Client Name */}
          <h1 className="font-serif text-4xl md:text-5xl font-light text-white mb-12 text-center">
            {clientProfile?.name || ""}
          </h1>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Location */}
            {clientProfile?.city && (
              <div>
                <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-2">
                  Location
                </p>
                <p className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase">
                  {clientProfile.city}
                </p>
              </div>
            )}

            {/* Service Type */}
            {introduction.service_type && (
              <div>
                <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-2">
                  Service Type
                </p>
                <p className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase">
                  {introduction.service_type}
                </p>
              </div>
            )}

            {/* Status */}
            <div>
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-2">
                Status
              </p>
              <p className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase">
                {introduction.status}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="text-center">
            <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-2">
              Date Submitted
            </p>
            <p className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase">
              {formatDate(introduction.created_at)}
            </p>
          </div>
        </motion.div>

        {/* Client Request */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-24 border-t border-white/10 pt-16"
        >
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase mb-12">
            Client Request
          </h2>
          <p className="text-[10px] tracking-[0.2em] leading-relaxed text-neutral-400 max-w-3xl">
            {introduction.message || ""}
          </p>
        </motion.div>

        {/* Client Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-24 border-t border-white/10 pt-16"
        >
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase mb-12">
            Client Context
          </h2>

          <div className="space-y-8">
            {/* Timeline */}
            <div>
              <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-2">
                Timeline
              </p>
              <p className="text-[10px] tracking-[0.2em] leading-relaxed text-neutral-400">
                {introduction.timeline || "Not specified"}
              </p>
            </div>

            {/* Style Preferences */}
            {clientProfile?.style_preferences && (
              <div>
                <p className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase mb-2">
                  Style Preferences
                </p>
                <p className="text-[10px] tracking-[0.2em] leading-relaxed text-neutral-400">
                  {clientProfile.style_preferences}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-24 border-t border-white/10 pt-16"
        >
          <h2 className="text-[8px] tracking-[0.4em] text-[#4a1a1a] uppercase mb-12">
            Messages
          </h2>

          {/* Messages List */}
          <div className="space-y-6 mb-12">
            {messages.length === 0 ? (
              <p className="text-[10px] tracking-[0.2em] text-neutral-600 italic text-center py-12">
                No messages yet
              </p>
            ) : (
              messages.map((msg) => {
                const isCurrentUser = msg.sender_id === userId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-2xl ${
                        isCurrentUser
                          ? "bg-white text-black border border-white/20"
                          : "bg-neutral-900 text-white border border-white/10"
                      } p-6`}
                    >
                      <p className="text-[8px] tracking-[0.3em] uppercase mb-3 opacity-70">
                        {msg.sender_name || ""}
                      </p>
                      <p className="text-[10px] tracking-[0.15em] leading-relaxed mb-3">
                        {msg.message}
                      </p>
                      <p className="text-[8px] tracking-[0.3em] uppercase opacity-50">
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-white/10 pt-8">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              rows={4}
              className="w-full border border-white/10 bg-transparent p-4 text-white text-sm outline-none transition-colors focus:border-white/30 resize-none placeholder:text-neutral-700"
            />
            <button
              onClick={handleSendMessage}
              disabled={isSendingMessage || !messageText.trim()}
              className="mt-4 bg-white text-black px-10 py-4 text-[8px] font-bold tracking-[0.4em] uppercase transition-all duration-300 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingMessage ? "Sending..." : "Send"}
            </button>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-center gap-4 mb-16 border-t border-white/10 pt-16"
        >
          <button
            onClick={handleAccept}
            disabled={isSubmitting || introduction.status === "active"}
            className="bg-white text-black px-10 py-4 text-[8px] font-bold tracking-[0.4em] uppercase transition-all duration-300 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {introduction.status === "active" ? "Accepted" : "Accept Introduction"}
          </button>

          <button
            onClick={handleDecline}
            disabled={isSubmitting || introduction.status === "closed"}
            className="border border-white/10 text-white px-10 py-4 text-[8px] font-bold tracking-[0.4em] uppercase transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {introduction.status === "closed" ? "Declined" : "Decline"}
          </button>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={() => navigate("/stylist-introductions")}
            className="text-[8px] tracking-[0.3em] text-neutral-700 uppercase hover:text-white transition-colors duration-300"
          >
            ← Back to Introductions
          </button>
        </motion.div>
      </div>
    </div>
  );
};