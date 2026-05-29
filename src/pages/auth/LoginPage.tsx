import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { loginWithGoogle, loginWithEmail } from "../../services/authService";
import axiosClient from "../../services/api/axiosClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user: firebaseUser, token } = await loginWithEmail(email, password);
      
      const localUser = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        role: (firebaseUser.email?.includes("admin") ? "admin" : "student") as "student" | "admin" | "reviewer",
        is_active: true,
        displayName: firebaseUser.displayName,
      };

      // Set user session in Zustand state
      loginStore(token, localUser);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Firebase Email Auth Error:", err);
      setError(err.message || "Error al autenticar. Reintente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { user: firebaseUser, token } = await loginWithGoogle();
      
      // Temporary token storage to authorize the synchronization call
      useAuthStore.getState().setToken(token);
      
      // Synchronize session details with the FastAPI backend
      let localUser;
      try {
        const syncResponse = await axiosClient.post("/auth/sync");
        localUser = syncResponse.data;
      } catch (backendErr) {
        console.warn("FastAPI backend is offline. Synchronizing session locally using Firebase profile.");
        localUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "student@edulab.com",
          role: "student" as "student" | "admin" | "reviewer",
          is_active: true,
        };
      }
      
      loginStore(token, localUser);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Firebase Auth Google Error:", err);
      setError(err.message || "Error al iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeveloperBypass = (role: "student" | "admin") => {
    const token = `mock-${role}-token`;
    const mockUser = {
      id: `mock-${role}-uid`,
      email: `${role}@edulab.com`,
      role: role as "student" | "admin" | "reviewer",
      is_active: true,
    };
    loginStore(token, mockUser);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#010414] text-white tech-grid flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-secondary/15 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-primary-light/10 blur-[120px] pointer-events-none"></div>

      {/* Main Panel */}
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-glass-border shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-light to-secondary flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(93,140,226,0.3)] mx-auto mb-4">
            <GraduationCap className="w-7 h-7 text-accent" />
          </div>
          <h2 className="font-display font-extrabold text-2xl tracking-wide">
            Acceder a EDULAB
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            EduServer plataforma inteligente de postulaciones
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* OAuth Social Buttons */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-glass-border hover:border-secondary/30 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Acceder con Google</span>
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-glass-border"></div>
          <span className="text-[10px] text-gray-600 px-3 uppercase tracking-wider">o continuar con email</span>
          <div className="flex-1 border-t border-glass-border"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@universidad.edu"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-glass-border focus:border-secondary/50 focus:outline-none text-sm text-gray-200 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wider">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-glass-border focus:border-secondary/50 focus:outline-none text-sm text-gray-200 transition-all duration-200"
              />
            </div>
            <div className="flex justify-end mt-1.5">
              <Link
                to="/forgot-password"
                className="text-[10px] text-gray-500 hover:text-white transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-blue-400 font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-secondary/10 hover:scale-[1.01] transition-all duration-200"
          >
            {loading ? "Autenticando..." : "Ingresar"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Developer Sandbox Bypass Mode */}
        <div className="mt-8 pt-6 border-t border-glass-border">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-3 text-center">
            🔧 Sandbox de Desarrollador
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDeveloperBypass("student")}
              className="py-2 px-3 rounded-xl bg-[#00135B]/20 hover:bg-[#00135B]/30 border border-[#00135B]/40 hover:border-secondary/40 text-xs font-semibold text-secondary transition-all duration-200 cursor-pointer"
            >
              Rol: Estudiante
            </button>
            <button
              onClick={() => handleDeveloperBypass("admin")}
              className="py-2 px-3 rounded-xl bg-accent/10 hover:bg-accent/15 border border-accent/25 hover:border-accent/40 text-xs font-semibold text-accent transition-all duration-200 cursor-pointer"
            >
              Rol: Administrador
            </button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs">
          <Link
            to="/register"
            className="text-gray-400 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            ¿No tienes cuenta? Regístrate gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
