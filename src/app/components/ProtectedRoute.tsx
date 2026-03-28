import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireStylist?: boolean;
}

/**
 * PROTECTED ROUTE WRAPPER
 * 
 * Ensures users are authenticated before accessing protected pages.
 * 
 * Loading State: Shows loading indicator while auth is being verified
 * Not Logged In: Redirects to /sign-in
 * Logged In: Renders the protected content
 * 
 * CRITICAL: Always checks isLoading FIRST to prevent premature redirects
 */
export const ProtectedRoute = ({ 
  children, 
  requireStylist = false 
}: ProtectedRouteProps) => {
  const { isLoggedIn, accountType, isLoading } = useAuth();
  const location = useLocation();

  /**
   * STEP 1: Wait for authentication to complete
   * 
   * NEVER redirect while isLoading is true
   * This prevents the instant logout bug where navigation happens
   * before the session is confirmed
   */
  if (isLoading) {
    console.log("🔒 ProtectedRoute: Waiting for auth to load...");
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

  /**
   * STEP 2: Check if user is authenticated
   * 
   * Only reaches here if isLoading is false
   * If not logged in, redirect to sign-in page
   */
  if (!isLoggedIn) {
    console.log("🚫 ProtectedRoute: User not logged in, redirecting to /sign-in");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  /**
   * STEP 3: Check role-based access (if required)
   * 
   * Some routes are restricted to stylists only
   * If user is not a stylist, redirect to their appropriate dashboard
   */
  if (requireStylist && accountType !== "stylist") {
    console.log("🚫 ProtectedRoute: Stylist access required, redirecting non-stylist to /my-profile");
    return <Navigate to="/my-profile" replace />;
  }

  /**
   * STEP 4: User is authenticated and authorized - render content
   */
  console.log("✅ ProtectedRoute: Access granted");
  return <>{children}</>;
};
