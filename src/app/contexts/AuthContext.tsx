import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  isLoggedIn: boolean;
  accountType: "client" | "stylist" | null;
  isLoading: boolean;
  userId: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  accountType: null,
  isLoading: true,
  userId: null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountType, setAccountType] = useState<
    "client" | "stylist" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Prevent multiple simultaneous profile fetches
  const isFetchingProfile = useRef(false);

  /**
   * ROBUST SESSION CHECKER
   * Verifies session exists and is valid before any state updates
   */
  const verifySession = useCallback(async (): Promise<boolean> => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session verification error:", error);
        return false;
      }

      if (!session?.user) {
        console.log("No active session found");
        return false;
      }

      // Verify session hasn't expired
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        console.log("Session expired");
        return false;
      }

      console.log("✅ Session verified, user ID:", session.user.id);
      return true;
    } catch (err) {
      console.error("Session verification exception:", err);
      return false;
    }
  }, []);

  /**
   * SAFE PROFILE FETCH WITH SESSION VERIFICATION
   * Only fetches profile if session is confirmed valid
   */
  const fetchProfileSafely = useCallback(async () => {
    // Prevent duplicate fetches
    if (isFetchingProfile.current) {
      console.log("⏭️ Profile fetch already in progress, skipping...");
      return;
    }

    isFetchingProfile.current = true;

    try {
      // STEP 1: Verify session exists and is valid
      const sessionValid = await verifySession();

      if (!sessionValid) {
        console.log("❌ Invalid session, clearing auth state");
        setIsLoggedIn(false);
        setAccountType(null);
        setUserId(null);
        setIsLoading(false);
        return;
      }

      // STEP 2: Get session details
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        // This shouldn't happen after verifySession, but double-check
        console.log("❌ Session lost during fetch");
        setIsLoggedIn(false);
        setAccountType(null);
        setUserId(null);
        setIsLoading(false);
        return;
      }

      const currentUserId = session.user.id;
      console.log("📥 Fetching profile for user:", currentUserId);

      // STEP 3: Fetch user profile from database
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        // Still set as logged in even if profile fails
        setIsLoggedIn(true);
        setAccountType(null);
        setUserId(currentUserId);
        setIsLoading(false);
        return;
      }

      // STEP 4: Update state with profile data
      const userType = profile?.user_type || null;
      console.log("✅ Profile loaded successfully, type:", userType);

      setIsLoggedIn(true);
      setAccountType(userType);
      setUserId(currentUserId);
      setIsLoading(false);
    } catch (err) {
      console.error("❌ Unexpected error during profile fetch:", err);
      setIsLoggedIn(false);
      setAccountType(null);
      setUserId(null);
      setIsLoading(false);
    } finally {
      isFetchingProfile.current = false;
    }
  }, [verifySession]);

  /**
   * CLEAR AUTH STATE
   * Centralized function to reset all auth state
   */
  const clearAuthState = useCallback(() => {
    console.log("🧹 Clearing auth state");
    setIsLoggedIn(false);
    setAccountType(null);
    setUserId(null);
    setIsLoading(false);
  }, []);

  /**
   * INITIAL AUTH CHECK ON APP LOAD
   * Only runs once when app starts
   */
  useEffect(() => {
    console.log("🚀 AuthContext initializing...");
    fetchProfileSafely();
  }, [fetchProfileSafely]);

  /**
   * AUTH STATE CHANGE LISTENER
   * Handles sign-in, sign-out, and token refresh events
   */
  useEffect(() => {
    console.log("👂 Setting up auth state listener");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "🔔 Auth event:",
        event,
        "| Has session:",
        !!session,
        "| Timestamp:",
        new Date().toISOString(),
      );

      // Debug trace for SIGNED_OUT events
      if (event === "SIGNED_OUT") {
        console.trace("⚠️ SIGNED_OUT event triggered from:");
      }

      // Handle different auth events
      switch (event) {
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
          // Wait briefly for session to stabilize in storage
          console.log("⏳ Waiting for session to stabilize...");
          setTimeout(() => {
            fetchProfileSafely();
          }, 150);
          break;

        case "SIGNED_OUT":
          console.log("👋 User signed out, clearing state");
          clearAuthState();
          break;

        case "USER_UPDATED":
          // Profile might have changed, refetch
          console.log("🔄 User updated, refreshing profile");
          fetchProfileSafely();
          break;

        default:
          // For INITIAL_SESSION and other events, do nothing
          // The initial useEffect handles the first load
          break;
      }
    });

    return () => {
      console.log("🛑 Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, [fetchProfileSafely, clearAuthState]);

  /**
   * SIGN OUT FUNCTION
   * Safely signs out user and clears all state
   */
  const signOut = useCallback(async () => {
    console.log("🚪 Signing out user...");

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("❌ Sign out error:", error);
        throw error;
      }

      console.log("✅ Sign out successful");
      clearAuthState();
    } catch (err) {
      console.error("❌ Sign out exception:", err);
      // Force clear state even if sign out fails
      clearAuthState();
    }
  }, [clearAuthState]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        accountType,
        isLoading,
        userId,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
