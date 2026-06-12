import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert,
  CheckCircle2
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { loginWithGoogle, loginWithEmail, registerWithEmail } from "../../services/authService";
import axiosClient from "../../services/api/axiosClient";
import OrganizationRegisterForm from "./OrganizationRegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const setToken = useAuthStore((state) => state.setToken);

  // States
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isOrgRegister, setIsOrgRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { user: firebaseUser, token } = await loginWithGoogle();
      
      // Temporary token storage to authorize the synchronization call
      setToken(token);
      
      let localUser;
      try {
        const syncResponse = await axiosClient.post("/auth/sync");
        const backendUser = syncResponse.data;
        localUser = {
          id: backendUser.id,
          uid: backendUser.firebase_uid,
          email: backendUser.email,
          role: backendUser.role,
          is_active: backendUser.status === "active",
          displayName: backendUser.full_name || firebaseUser.displayName,
          photoURL: backendUser.photo_url || firebaseUser.photoURL,
          created_at: backendUser.created_at,
          last_login: backendUser.last_login,
        };
      } catch (backendErr) {
        console.warn("FastAPI backend is offline. Synchronizing session locally.");
        localUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "student@edulab.com",
          role: "student" as const,
          is_active: true,
          displayName: firebaseUser.displayName,
        };
      }
      
      loginStore(token, localUser);
      onClose();
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.message || "Error al iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  // Email Submit Handler (Login or Register)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (mode === "register") {
      if (!name.trim()) {
        setError("El nombre completo es requerido.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        // LOGIN FLOW
        const { user: firebaseUser, token } = await loginWithEmail(email, password);
        
        // Synchronize session details with the FastAPI backend
        setToken(token);
        let localUser;
        try {
          const syncResponse = await axiosClient.post("/auth/sync");
          const backendUser = syncResponse.data;
          localUser = {
            id: backendUser.id,
            uid: backendUser.firebase_uid,
            email: backendUser.email,
            role: backendUser.role,
            is_active: backendUser.status === "active",
            displayName: backendUser.full_name || firebaseUser.displayName,
            photoURL: backendUser.photo_url || firebaseUser.photoURL,
            created_at: backendUser.created_at,
            last_login: backendUser.last_login,
          };
        } catch (backendErr) {
          console.warn("FastAPI backend is offline. Restoring session locally.");
          localUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email || email,
            role: "student" as const,
            is_active: true,
            displayName: firebaseUser.displayName,
          };
        }

        loginStore(token, localUser);
        onClose();
      } else {
        // REGISTRATION FLOW
        await registerWithEmail(email, password, name);
        
        setSuccess("¡Cuenta creada con éxito! Se ha enviado un correo de verificación.");
        // Redirect to verification view after 2.5s
        setTimeout(() => {
          onClose();
          navigate("/verify-email", { state: { email } });
        }, 2500);
      }
    } catch (err: any) {
      console.error("Email Auth Error:", err);
      setError(err.message || "Error de autenticación. Por favor, reintente.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px] border border-gray-100 relative animate-scaleUp">
        
        {/* Left Side: Forms */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between overflow-y-auto text-left relative bg-white text-gray-800 h-full">
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Branding cap */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00135B] flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-[#F5C542]" />
            </div>
            <span className="font-display font-extrabold text-sm tracking-wider text-[#00135B]">
              EDULAB
            </span>
          </div>

          {/* Form Content / Transitions */}
          <div className="my-auto py-4">
            <AnimatePresence mode="wait">
              {isOrgRegister ? (
                <motion.div
                  key="org-register"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <OrganizationRegisterForm onBack={() => setIsOrgRegister(false)} />
                </motion.div>
              ) : !showEmailForm ? (
                // SCREEN A: OAuth choices
                <motion.div
                  key="oauth"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#00135B] tracking-tight leading-tight">
                      Inicia sesión o regístrate en un momento
                    </h2>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Usa tu correo electrónico u otro servicio para acceder a EDULAB gratis.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    {/* Google OAuth Button */}
                    <button
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-300 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-3 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      <span>Usar Google</span>
                    </button>

                    {/* Email Option Button */}
                    <button
                      onClick={() => setShowEmailForm(true)}
                      className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-300 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-3 cursor-pointer shadow-sm"
                    >
                      <Mail className="w-4.5 h-4.5 text-gray-500" />
                      <span>Usar un correo electrónico</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                // SCREEN B: Email/Credentials form
                <motion.div
                  key="email-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 pb-1">
                    <button 
                      onClick={() => {
                        setError(null);
                        setShowEmailForm(false);
                      }}
                      className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Atrás</span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl text-[#00135B]">
                    {mode === "login" ? "Iniciar Sesión" : "Crear tu Cuenta"}
                  </h3>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-500" />
                      <span>{success}</span>
                    </div>
                  )}

                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    {mode === "register" && (
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nombre Completo"
                          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all duration-200"
                        />
                      </div>
                    )}

                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all duration-200"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all duration-200"
                      />
                    </div>

                    {mode === "register" && (
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmar Contraseña"
                          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all duration-200"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 font-bold text-white text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 transition-all"
                    >
                      {loading ? "Procesando..." : mode === "login" ? "Ingresar" : "Registrarse"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom toggle link */}
          <div className="text-center text-xs text-gray-500 pt-2 space-y-3">
            <button
              onClick={toggleMode}
              className="hover:text-[#5D8CE2] font-semibold underline cursor-pointer bg-transparent border-none"
            >
              {mode === "login"
                ? "¿No tienes cuenta? Regístrate gratis"
                : "¿Ya tienes cuenta? Inicia Sesión"}
            </button>
            
            {mode === "login" && !isOrgRegister && (
              <div className="pt-2.5 border-t border-gray-150 flex flex-col items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">¿Eres una organización?</span>
                <button
                  onClick={() => setIsOrgRegister(true)}
                  className="text-xs font-semibold text-[#00135B] hover:text-[#5D8CE2] underline cursor-pointer bg-transparent border-none mt-1"
                >
                  Registra tu organización en EDULAB
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Visual Canva Branding */}
        <div className="hidden md:block w-1/2 bg-[#00135B] relative overflow-hidden h-full">
          {/* Background image */}
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
            alt="Estudiantes exitosos estudiando juntos en laptop" 
            className="w-full h-full object-cover opacity-35 filter brightness-75 select-none pointer-events-none"
          />

          {/* Grid overlay */}
          <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none"></div>

          {/* Branding Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-10 text-white space-y-4 bg-gradient-to-t from-[#00135B] via-[#00135B]/40 to-transparent">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-lg">
              <GraduationCap className="w-6 h-6 text-[#F5C542]" />
            </div>
            <div className="space-y-2 text-left">
              <h4 className="font-display font-extrabold text-2xl tracking-wide leading-tight">
                Impulsa tu futuro internacional
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                Únete a miles de estudiantes que ya están postulando estratégicamente a becas y voluntariados globales guiados por inteligencia artificial.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
              <span>EDULAB Platform</span>
              <span>© 2026</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
