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

  // Prevent concurrent profile fetches
  const isFetchingRef = useRef(false);

  /**
   * FETCH USER PROFILE
   * Gets user type from database after confirming valid session
   */
  const fetchUserProfile = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log("Profile fetch already in progress, skipping");
      return;
    }

    isFetchingRef.current = true;

    try {
      // Get current session directly from Supabase (no manual localStorage)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        setIsLoggedIn(false);
        setAccountType(null);
        setUserId(null);
        setIsLoading(false);
        return;
      }

      // No session = not logged in
      if (!session?.user) {
        console.log("No active session");
        setIsLoggedIn(false);
        setAccountType(null);
        setUserId(null);
        setIsLoading(false);
        return;
      }

      const currentUserId = session.user.id;
      console.log("Active session found for user:", currentUserId);

      // Fetch profile from database
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        // Still logged in even if profile fails
        setIsLoggedIn(true);
        setAccountType(null);
        setUserId(currentUserId);
        setIsLoading(false);
        return;
      }

      // Update state with profile data
      console.log("Profile loaded, user_type:", profile?.user_type);
      setIsLoggedIn(true);
      setAccountType(profile?.user_type || null);
      setUserId(currentUserId);
      setIsLoading(false);
    } catch (err) {
      console.error("Profile fetch exception:", err);
      setIsLoggedIn(false);
      setAccountType(null);
      setUserId(null);
      setIsLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  /**
   * INITIAL SESSION CHECK
   * Run once on mount
   */
  useEffect(() => {
    console.log("AuthContext initializing");
    fetchUserProfile();
  }, [fetchUserProfile]);

  /**
   * AUTH STATE CHANGE LISTENER
   * Handles all auth events from Supabase
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, "| Session exists:", !!session);

      // Debug SIGNED_OUT events
      if (event === "SIGNED_OUT") {
        console.trace("SIGNED_OUT event origin");
      }

      switch (event) {
        case "INITIAL_SESSION":
          // Already handled by initial useEffect, skip
          break;

        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          // Session changed, refetch profile
          fetchUserProfile();
          break;

        case "SIGNED_OUT":
          // User signed out, clear state immediately
          console.log("User signed out, clearing state");
          setIsLoggedIn(false);
          setAccountType(null);
          setUserId(null);
          setIsLoading(false);
          break;

        default:
          console.log("Unhandled auth event:", event);
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  /**
   * SIGN OUT
   * Relies entirely on Supabase to clear session
   */
  const signOut = useCallback(async () => {
    console.log("Signing out");

    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Sign out error:", error);
      // Force clear state even on error
      setIsLoggedIn(false);
      setAccountType(null);
      setUserId(null);
      return;
    }

    console.log("Sign out successful");
    // State will be cleared by SIGNED_OUT event handler
  }, []);

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
