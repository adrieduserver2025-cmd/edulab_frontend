import { Routes, Route, Navigate } from "react-router-dom";
import LandingPageV2 from "../pages/landing/LandingPageV2";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProgramsPage from "../pages/programs/ProgramsPage";
import ProfilePage from "../pages/profile/ProfilePage";
import OnboardingPage from "../pages/onboarding/OnboardingPage";
import AIToolsPage from "../pages/ai/AIToolsPage";
import OpportunityDetailPage from "../pages/programs/OpportunityDetailPage";
import PremiumScholarshipPage from "../pages/programs/PremiumScholarshipPage";
import PatinoPage from "../pages/programs/PatinoPage";
import CarolinaPage from "../pages/programs/CarolinaPage";
import ErasmusPage from "../pages/programs/ErasmusPage";
import GksPage from "../pages/programs/GksPage";
import DaadPage from "../pages/programs/DaadPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPageV2 />} />
      <Route path="/login" element={<LandingPageV2 initialAuthMode="login" />} />
      <Route path="/register" element={<LandingPageV2 initialAuthMode="register" />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Dedicated Beca Patiño route */}
      <Route path="/becas/patino-beca" element={<PatinoPage />} />

      {/* Dedicated Beca Fundación Carolina routes */}
      <Route path="/becas/fundacion-carolina" element={<CarolinaPage />} />
      <Route path="/becas/fundacion-carolina-beca" element={<CarolinaPage />} />

      {/* Dedicated Beca Erasmus Mundus routes */}
      <Route path="/becas/erasmus-mundus" element={<ErasmusPage />} />
      <Route path="/becas/erasmus-mundus-beca" element={<ErasmusPage />} />

      {/* Dedicated Beca GKS Corea del Sur routes */}
      <Route path="/becas/gks-korea" element={<GksPage />} />
      <Route path="/becas/gks-korea-beca" element={<GksPage />} />

      {/* Dedicated Beca DAAD EPOS Alemania routes */}
      <Route path="/becas/daad-epos" element={<DaadPage />} />
      <Route path="/becas/daad-epos-beca" element={<DaadPage />} />

      {/* 
        Premium Scholarship pages — dynamic template (PremiumScholarshipPage).
        Uses /becas/:slug for all scholarships (loaded from backend).
        React Router v6 matches specific paths before generic ones when listed first.
      */}
      <Route path="/becas/:slug" element={<PremiumScholarshipPage />} />
      
      {/* Generic opportunity detail pages */}
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
