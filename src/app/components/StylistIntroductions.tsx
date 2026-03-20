import React from "react";
import { motion } from "motion/react";

interface StylistIntroductionsProps {
  onNavigate: (page: string) => void;
}

export const StylistIntroductions = ({ onNavigate }: StylistIntroductionsProps) => {
  // Mock data - would come from backend
  const introductions = [
    {
      id: 1,
      clientName: "Eleanor Richardson",
      date: "March 15, 2026",
      serviceType: "Wardrobe Consultation",
      status: "pending",
    },
    {
      id: 2,
      clientName: "Marcus Wellington",
      date: "March 14, 2026",
      serviceType: "Personal Styling",
      status: "active",
    },
    {
      id: 3,
      clientName: "Sofia Andersen",
      date: "March 12, 2026",
      serviceType: "Event Styling",
      status: "active",
    },
    {
      id: 4,
      clientName: "James Mitchell",
      date: "March 10, 2026",
      serviceType: "Wardrobe Consultation",
      status: "pending",
    },
    {
      id: 5,
      clientName: "Isabella Torres",
      date: "March 8, 2026",
      serviceType: "Personal Shopping",
      status: "active",
    },
    {
      id: 6,
      clientName: "Alexander Chen",
      date: "February 28, 2026",
      serviceType: "Seasonal Refresh",
      status: "closed",
    },
    {
      id: 7,
      clientName: "Victoria Blake",
      date: "February 25, 2026",
      serviceType: "Wardrobe Consultation",
      status: "closed",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-600";
      case "active":
        return "text-emerald-600";
      case "closed":
        return "text-neutral-500";
      default:
        return "text-neutral-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "active":
        return "Active";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-16 space-y-6"
        >
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-white">
            Introductions
          </h1>
          <p className="text-[10px] leading-[2] tracking-[0.2em] text-neutral-600 uppercase">
            Curated client introductions facilitated by ATELISTRY.
          </p>
        </motion.div>

        {/* Introductions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-20"
        >
          <div className="space-y-0">
            {introductions.map((intro, index) => (
              <div
                key={intro.id}
                className={`group grid grid-cols-1 gap-6 border-b border-white/5 py-10 transition-all hover:bg-neutral-900/20 md:grid-cols-5 md:items-center ${
                  index === 0 ? "border-t" : ""
                }`}
              >
                <div className="space-y-1 md:col-span-2">
                  <p className="font-serif text-2xl font-light text-white">
                    {intro.clientName}
                  </p>
                  <p className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                    {intro.date}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
                    {intro.serviceType}
                  </p>
                </div>

                <div>
                  <span
                    className={`text-[9px] font-bold tracking-[0.4em] uppercase ${getStatusColor(
                      intro.status
                    )}`}
                  >
                    {getStatusLabel(intro.status)}
                  </span>
                </div>

                <div className="flex justify-start md:justify-end">
                  <button
                    onClick={() => onNavigate("stylist-introduction-detail")}
                    className="border-b border-white/10 pb-1 text-[9px] font-medium tracking-[0.3em] text-neutral-400 uppercase transition-all hover:border-white hover:text-white"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-24 border-t border-white/5 pt-12"
        >
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-[9px] font-medium tracking-[0.3em] text-neutral-600 uppercase transition-colors hover:text-white"
          >
            ← Back to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};