import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, RefreshCw, ShieldAlert, CheckCircle, ArrowRight } from "lucide-react";
import { sendVerificationEmail } from "../../services/authService";

export default function VerifyEmailPage() {
  const location = useLocation();
  const email = location.state?.email || "tu correo registrado";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResendClick = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await sendVerificationEmail();
      setSuccess(true);
    } catch (err: any) {
      console.error("Firebase Resend Verification Error:", err);
      setError(err.message || "Error al reenviar el correo de verificación.");
    } finally {
      setLoading(false);
    }
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
            <Mail className="w-7 h-7 text-accent animate-pulse" />
          </div>
          <h2 className="font-display font-extrabold text-2xl tracking-wide">
            Verifica tu Correo
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Te hemos enviado un enlace de confirmación
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-glass-border text-center space-y-4 mb-6">
          <p className="text-sm text-gray-300">
            Hemos enviado un correo electrónico de verificación a:
          </p>
          <p className="font-bold text-accent text-sm select-all tracking-wide">{email}</p>
          <p className="text-xs text-gray-500">
            Por favor, haz clic en el enlace del correo para activar tu cuenta.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>¡Correo enviado! Revisa tu bandeja de entrada o spam.</span>
          </div>
        )}

        <button
          onClick={handleResendClick}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-glass-border hover:border-secondary/30 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-3 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 shrink-0 ${loading ? "animate-spin" : ""}`} />
          <span>Reenviar Correo de Verificación</span>
        </button>

        <div className="mt-8 text-center text-xs border-t border-glass-border pt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            <span>Ir al Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
