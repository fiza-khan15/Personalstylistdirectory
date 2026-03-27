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

  // Show loading only if we're actually checking auth (has session in localStorage)
  if (isLoading) {
    return null; // Return nothing instead of a loading screen for instant feel
  }

  if (!isLoggedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (requireStylist && accountType !== "stylist") {
    return <Navigate to="/my-profile" replace />;
  }

  return <>{children}</>;
};