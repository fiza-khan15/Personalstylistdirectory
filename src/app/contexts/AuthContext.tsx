import React, {
  createContext,
  useContext,
  useEffect,
  useState,
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

  useEffect(() => {
    /**
     * SAFE PROFILE FETCH FUNCTION
     * Always confirms session before querying database
     */
    const fetchProfileSafely = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session check error:", sessionError);
          setIsLoggedIn(false);
          setAccountType(null);
          setUserId(null);
          localStorage.removeItem("atelistry-auth");
          return;
        }

        if (!session?.user) {
          setIsLoggedIn(false);
          setAccountType(null);
          setUserId(null);
          localStorage.removeItem("atelistry-auth");
          return;
        }

        const userId = session.user.id;

        console.log(
          "Fetching user profile after stable session...",
        );

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("user_type")
            .eq("user_id", userId)
            .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);

          // Still logged in even if profile fails
          setIsLoggedIn(true);
          setAccountType(null);
          setUserId(userId);
        } else {
          console.log(
            "Profile fetched successfully, user type:",
            profile?.user_type,
          );

          setIsLoggedIn(true);
          setAccountType(profile?.user_type || null);
          setUserId(userId);
          localStorage.setItem("atelistry-auth", "true");
        }
      } catch (err) {
        console.error("Unexpected auth check error:", err);
        setIsLoggedIn(false);
        setAccountType(null);
        setUserId(null);
        localStorage.removeItem("atelistry-auth");
      } finally {
        setIsLoading(false);
      }
    };

    /**
     * INITIAL AUTH CHECK ON APP LOAD
     */
    fetchProfileSafely();

    /**
     * AUTH STATE CHANGE LISTENER
     * Handles login, logout, and token refresh safely
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth state change:", event);

      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED"
      ) {
        // Wait briefly to allow session to stabilize
        setTimeout(async () => {
          await fetchProfileSafely();
        }, 100);
      }

      if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setAccountType(null);
        setUserId(null);
        setIsLoading(false);
        localStorage.removeItem("atelistry-auth");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      setIsLoggedIn(false);
      setAccountType(null);
      setUserId(null);
      setIsLoading(false);
      localStorage.removeItem("atelistry-auth");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, accountType, isLoading, userId, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};