import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireStylist?: boolean;
}

export const ProtectedRoute = ({ children, requireStylist = false }: ProtectedRouteProps) => {
  const { isLoggedIn, accountType, isLoading } = useAuth();
  const location = useLocation();

  // Wait for auth check to complete before making any decisions
  if (isLoading) {
    // Show minimal loading state - do NOT redirect during loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[10px] font-medium tracking-[0.3em] text-neutral-600 uppercase animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // Auth check complete - now we can make routing decisions
  if (!isLoggedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (requireStylist && accountType !== "stylist") {
    return <Navigate to="/my-profile" replace />;
  }

  return <>{children}</>;
};