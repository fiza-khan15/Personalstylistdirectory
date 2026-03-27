import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  isLoggedIn: boolean;
  accountType: "client" | "stylist" | null;
  isLoading: boolean;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  accountType: null,
  isLoading: true,
  userId: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountType, setAccountType] = useState<"client" | "stylist" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("account_type")
            .eq("user_id", session.user.id)
            .single();

          setAccountType(profile?.account_type || "client");
          setIsLoggedIn(true);
          setUserId(session.user.id);
        } else {
          setIsLoggedIn(false);
          setAccountType(null);
          setUserId(null);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setIsLoggedIn(false);
        setAccountType(null);
        setUserId(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Check localStorage first for instant feedback
    const hasSession = localStorage.getItem('atelistry-auth');
    if (!hasSession) {
      // No session in localStorage, instantly set to not loading
      setIsLoading(false);
      setIsLoggedIn(false);
    } else {
      // Session might exist, check with Supabase
      checkAuth();
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAuth();
      } else {
        setIsLoggedIn(false);
        setAccountType(null);
        setUserId(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, accountType, isLoading, userId }}>
      {children}
    </AuthContext.Provider>
  );
};