import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/landing/LandingPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProgramsPage from "../pages/programs/ProgramsPage";
import ProfilePage from "../pages/profile/ProfilePage";
import OnboardingPage from "../pages/onboarding/OnboardingPage";
import AIToolsPage from "../pages/ai/AIToolsPage";
import OpportunityDetailPage from "../pages/programs/OpportunityDetailPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage initialAuthMode="login" />} />
      <Route path="/register" element={<LandingPage initialAuthMode="register" />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/opportunities/:slug" element={<OpportunityDetailPage />} />
      <Route path="/voluntariados/:slug" element={<OpportunityDetailPage />} />

      {/* Protected App Space */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/ai-tools" element={<AIToolsPage />} />
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
