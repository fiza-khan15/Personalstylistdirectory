import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireStylist?: boolean;
}

export const ProtectedRoute = ({ children, requireStylist = false }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("account_type")
            .eq("user_id", user.id)
            .single();

          setAccountType(profile?.account_type || null);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (requireStylist && accountType !== "stylist") {
    return <Navigate to="/my-profile" replace />;
  }

  return <>{children}</>;
};
