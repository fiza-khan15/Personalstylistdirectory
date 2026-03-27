import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Hero } from "./components/Hero";
import { Narrative } from "./components/Narrative";
import { Directory } from "./components/Directory";
import { StylistProfile } from "./components/StylistProfile";
import { About } from "./components/About";
import { Access } from "./components/Access";
import { AccessHub } from "./components/AccessHub";
import { StylistApplication } from "./components/StylistApplication";
import { MyProfile } from "./components/MyProfile";
import { StylistDashboard } from "./components/StylistDashboard";
import { StylistProfileEditor } from "./components/StylistProfileEditor";
import { IntroductionDetail } from "./components/IntroductionDetail";
import { StylistIntroductions } from "./components/StylistIntroductions";
import { StylistIntroductionDetail } from "./components/StylistIntroductionDetail";
import { ClientProfileEditor } from "./components/ClientProfileEditor";
import { SignIn } from "./components/SignIn";
import { Journal } from "./components/Journal";
import { LandingPage } from "./components/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "narrative",
        element: <Narrative />,
      },
      {
        path: "platform",
        element: <Directory />,
      },
      {
        path: "directory",
        element: <Directory />,
      },
      {
        path: "stylist/:profileId",
        element: <StylistProfile />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "journal",
        element: <Journal />,
      },
      {
        path: "access",
        element: <Access />,
      },
      {
        path: "access-hub",
        element: <AccessHub />,
      },
      {
        path: "stylist-application",
        element: <StylistApplication />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "my-profile",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requireStylist>
            <StylistDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <ProtectedRoute requireStylist>
            <StylistProfileEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: "client-edit-profile",
        element: (
          <ProtectedRoute>
            <ClientProfileEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: "introduction-detail",
        element: (
          <ProtectedRoute>
            <IntroductionDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "stylist-introductions",
        element: (
          <ProtectedRoute requireStylist>
            <StylistIntroductions />
          </ProtectedRoute>
        ),
      },
      {
        path: "stylist-introduction-detail",
        element: (
          <ProtectedRoute requireStylist>
            <StylistIntroductionDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);