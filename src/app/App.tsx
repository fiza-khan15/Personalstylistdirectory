import React, { useState, useEffect } from "react";
import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { Directory } from "@/app/components/Directory";
import { Footer } from "@/app/components/Footer";
import { About } from "@/app/components/About";
import { Narrative } from "@/app/components/Narrative";
import { StylistProfile } from "@/app/components/StylistProfile";
import { Access } from "@/app/components/Access";
import { AccessHub } from "@/app/components/AccessHub";
import { StylistApplication } from "@/app/components/StylistApplication";
import { MyProfile } from "@/app/components/MyProfile";
import { StylistDashboard } from "@/app/components/StylistDashboard";
import { StylistProfileEditor } from "@/app/components/StylistProfileEditor";
import { IntroductionDetail } from "@/app/components/IntroductionDetail";
import { StylistIntroductions } from "@/app/components/StylistIntroductions";
import { StylistIntroductionDetail } from "@/app/components/StylistIntroductionDetail";
import { ClientProfileEditor } from "@/app/components/ClientProfileEditor";
import { stylists } from "@/app/data/stylists";
import { motion, AnimatePresence } from "motion/react";

const FeaturedInsight = () => {
  return (
    <section className="bg-neutral-950 py-60 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-12 text-center">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           transition={{ duration: 1.5 }}
           viewport={{ once: true }}
           className="space-y-12"
        >
          <span className="text-[10px] font-bold tracking-[0.6em] text-red-900 uppercase">THE JOURNAL</span>
          <h2 className="font-serif text-5xl md:text-8xl font-light tracking-tighter text-white leading-none">
            The Art of <br />
            <span className="italic text-neutral-500 pl-12">Restraint</span>
          </h2>
          <div className="mx-auto h-[1px] w-24 bg-red-900" />
          <p className="mx-auto max-w-xl text-xs leading-[2] tracking-[0.15em] text-neutral-500 uppercase">
            A considered exploration of modern personal style.
          </p>
          <button className="text-[10px] font-medium tracking-[0.4em] text-white/40 uppercase hover:text-white transition-all border-b border-white/5 pb-2">
            Read Entry
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8 }}
  >
    <Hero onNavigate={onNavigate} />
    
    {/* Quote Section (The Manifesto) */}
    <section className="mx-auto max-w-5xl py-60 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="space-y-10"
      >
        <p className="font-serif text-3xl md:text-5xl italic leading-tight text-neutral-300 font-light">
          "Style is a silent language, spoken through the curation of identity."
        </p>
        <div className="mx-auto h-[1px] w-12 bg-neutral-800" />
        <p 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-[9px] font-bold tracking-[0.6em] text-red-900 uppercase cursor-pointer hover:opacity-70 transition-opacity"
        >
          The Atelistry Philosophy
        </p>
      </motion.div>
    </section>

    <About />
    
    <FeaturedInsight />
    
    {/* Newsletter (Subscription) */}
    <section className="bg-neutral-950 py-60 border-t border-white/5">
      <div className="mx-auto max-w-xl px-6 text-center">
        <h2 className="mb-6 font-serif text-4xl font-light tracking-tight text-white">
          The Weekly <span className="italic text-neutral-500">Dialogue</span>
        </h2>
        <p className="text-xs tracking-[0.15em] text-neutral-500 uppercase mb-12">
          Occasional reflections on style, identity, and intention.
        </p>
        <form className="flex flex-col gap-12 items-center">
          <input
            type="email"
            placeholder="YOUR EMAIL"
            className="w-full border-b border-white/10 bg-transparent py-4 text-center text-[10px] font-bold tracking-[0.4em] text-white uppercase outline-none focus:border-red-900 transition-colors"
            required
          />
          <button
            type="submit"
            className="text-[10px] font-bold tracking-[0.5em] text-white/40 uppercase hover:text-white transition-all border-b border-white/5 pb-2"
          >
            Join the Network
          </button>
        </form>
      </div>
    </section>
  </motion.div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountType, setAccountType] = useState<"client" | "stylist">("stylist"); // Default to stylist for demo

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Check if current page is a profile page
  const isProfilePage = currentPage.startsWith("profile-");
  const profileId = isProfilePage ? currentPage.replace("profile-", "") : null;
  const currentStylist = profileId ? stylists.find(s => s.id === profileId) : null;

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-white selection:bg-red-900 selection:text-white antialiased">
      <Navbar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
        isLoggedIn={isLoggedIn}
        onLoginToggle={() => setIsLoggedIn(!isLoggedIn)}
        accountType={accountType}
      />
      <main>
        <AnimatePresence mode="wait">
          {currentPage === "home" ? (
            <LandingPage key="home" onNavigate={setCurrentPage} />
          ) : currentPage === "narrative" ? (
            <motion.div
              key="narrative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Narrative onNavigate={setCurrentPage} />
            </motion.div>
          ) : currentPage === "platform" || currentPage === "directory" ? (
            <motion.div
              key="platform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Directory onNavigate={setCurrentPage} />
            </motion.div>
          ) : isProfilePage && currentStylist ? (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <StylistProfile stylist={currentStylist} onNavigate={setCurrentPage} />
            </motion.div>
          ) : currentPage === "about" ? (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <About />
            </motion.div>
          ) : currentPage === "journal" ? (
            <motion.div
              key="journal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="py-60"
            >
              <div className="mx-auto max-w-7xl px-6 md:px-12">
                 <div className="mb-24 space-y-4">
                    <span className="text-[10px] font-bold tracking-[0.6em] text-red-900 uppercase">THE JOURNAL</span>
                    <h2 className="font-serif text-6xl font-light italic text-white tracking-tighter">Editorial <br />Perspective</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    {[
                      { title: "The Rise of Minimal Luxury", date: "FEB 2026", category: "TREND REPORT", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071" },
                      { title: "Archiving Identity", date: "JAN 2026", category: "STYLING TIPS", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070" }
                    ].map((post, i) => (
                      <div key={i} className="group cursor-pointer space-y-8">
                        <div className="aspect-[16/9] overflow-hidden bg-neutral-900 border border-white/5">
                          <img src={post.img} alt={post.title} className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-[9px] font-bold tracking-[0.3em] text-red-900 uppercase">
                            <span>{post.category}</span>
                            <span className="text-neutral-600">{post.date}</span>
                          </div>
                          <h3 className="font-serif text-3xl font-light text-white group-hover:text-neutral-400 transition-colors">{post.title}</h3>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          ) : currentPage === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <StylistDashboard 
                onNavigate={setCurrentPage}
                onLogout={() => {
                  setIsLoggedIn(false);
                  setCurrentPage("home");
                }}
              />
            </motion.div>
          ) : currentPage === "access" ? (
            <motion.div
              key="access"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Access onNavigate={setCurrentPage} />
            </motion.div>
          ) : currentPage === "access-hub" ? (
            <motion.div
              key="access-hub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <AccessHub onNavigate={setCurrentPage} />
            </motion.div>
          ) : currentPage === "stylist-application" ? (
            <motion.div
              key="stylist-application"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <StylistApplication onNavigate={setCurrentPage} />
            </motion.div>
          ) : currentPage === "my-profile" ? (
            <motion.div
              key="my-profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <MyProfile 
                onNavigate={setCurrentPage}
                onLogout={() => {
                  setIsLoggedIn(false);
                  setCurrentPage("home");
                }}
              />
            </motion.div>
          ) : currentPage === "edit-profile" ? (
            <motion.div
              key="edit-profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <StylistProfileEditor onNavigate={setCurrentPage} />
            </motion.div>
          ) : currentPage === "introduction-detail" ? (
            <motion.div
              key="introduction-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <IntroductionDetail 
                onNavigate={setCurrentPage}
                onBack={() => setCurrentPage("my-profile")}
              />
            </motion.div>
          ) : currentPage === "stylist-introductions" ? (
            <motion.div
              key="stylist-introductions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <StylistIntroductions 
                onNavigate={setCurrentPage}
                onBack={() => setCurrentPage("my-profile")}
              />
            </motion.div>
          ) : currentPage === "stylist-introduction-detail" ? (
            <motion.div
              key="stylist-introduction-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <StylistIntroductionDetail 
                onNavigate={setCurrentPage}
                onBack={() => setCurrentPage("stylist-introductions")}
              />
            </motion.div>
          ) : currentPage === "client-edit-profile" ? (
            <motion.div
              key="client-edit-profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ClientProfileEditor onNavigate={setCurrentPage} />
            </motion.div>
          ) : (
            <LandingPage key="fallback" onNavigate={setCurrentPage} />
          )}
        </AnimatePresence>
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}