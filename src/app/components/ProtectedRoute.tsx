import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireStylist?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireStylist = false 
}: ProtectedRouteProps) => {
  const { isLoggedIn, accountType, isLoading } = useAuth();
  const location = useLocation();

  // Wait for auth to complete before making routing decisions
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-[10px] font-medium tracking-[0.3em] text-neutral-600 uppercase animate-pulse">
            Verifying Access...
          </div>
          <div className="h-[1px] w-16 mx-auto bg-neutral-800 animate-pulse" />
        </div>
      </div>
    );
  }

  // Not logged in - redirect to sign in
  if (!isLoggedIn) {
    console.log("ProtectedRoute: Not logged in, redirecting to /sign-in");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requireStylist && accountType !== "stylist") {
    console.log("ProtectedRoute: Stylist required, redirecting to /my-profile");
    return <Navigate to="/my-profile" replace />;
  }

  // Access granted
  return <>{children}</>;
};
