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
        // Always check for existing Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session check error:", sessionError);
          setIsLoggedIn(false);
          setAccountType(null);
          setUserId(null);
          localStorage.removeItem('atelistry-auth');
          return;
        }

        if (session?.user) {
          // Session exists - fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("account_type")
            .eq("user_id", session.user.id)
            .maybeSingle(); // Use maybeSingle() to handle missing profiles gracefully

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            // Session exists but profile fetch failed - still mark as logged in
            // but without account type (user can be redirected to complete profile)
            setIsLoggedIn(true);
            setAccountType(null);
            setUserId(session.user.id);
          } else {
            // Session and profile exist - set full state
            setIsLoggedIn(true);
            setAccountType(profile?.account_type || null);
            setUserId(session.user.id);
            localStorage.setItem('atelistry-auth', 'true');
          }
        } else {
          // No session exists
          setIsLoggedIn(false);
          setAccountType(null);
          setUserId(null);
          localStorage.removeItem('atelistry-auth');
        }
      } catch (err) {
        console.error("Unexpected auth check error:", err);
        setIsLoggedIn(false);
        setAccountType(null);
        setUserId(null);
        localStorage.removeItem('atelistry-auth');
      } finally {
        // Always complete loading state
        setIsLoading(false);
      }
    };

    // Always check auth on application load - no shortcuts
    checkAuth();

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);

      if (session?.user) {
        // User signed in or token refreshed - fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("user_id", session.user.id)
          .maybeSingle(); // Use maybeSingle() to handle missing profiles gracefully

        if (profileError) {
          console.error("Profile fetch error on auth change:", profileError);
          setIsLoggedIn(true);
          setAccountType(null);
          setUserId(session.user.id);
        } else {
          setIsLoggedIn(true);
          setAccountType(profile?.account_type || null);
          setUserId(session.user.id);
          localStorage.setItem('atelistry-auth', 'true');
        }
        setIsLoading(false);
      } else {
        // User signed out
        setIsLoggedIn(false);
        setAccountType(null);
        setUserId(null);
        setIsLoading(false);
        localStorage.removeItem('atelistry-auth');
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