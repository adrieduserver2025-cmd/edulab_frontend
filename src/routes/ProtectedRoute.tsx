import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { GraduationCap } from "lucide-react";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#010414] text-white flex flex-col justify-center items-center relative overflow-hidden tech-grid">
        <div className="absolute top-[30%] right-[-10%] w-[300px] h-[300px] bg-secondary/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[30%] left-[-10%] w-[300px] h-[300px] bg-primary-light/10 blur-[100px] pointer-events-none"></div>
        <div className="z-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-light to-secondary flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(93,140,226,0.3)] mx-auto animate-pulse">
            <GraduationCap className="w-9 h-9 text-accent animate-spin-slow" />
          </div>
          <p className="text-sm font-semibold tracking-wider text-gray-400">Verificando sesión segura...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
