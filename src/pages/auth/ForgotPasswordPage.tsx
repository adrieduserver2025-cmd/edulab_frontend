import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, ArrowRight, ShieldAlert, CheckCircle } from "lucide-react";
import { resetPassword } from "../../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error("Firebase Reset Password Error:", err);
      setError(err.message || "Error al enviar el enlace. Verifique su email.");
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
            <GraduationCap className="w-7 h-7 text-accent" />
          </div>
          <h2 className="font-display font-extrabold text-2xl tracking-wide">
            Recuperar Contraseña
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Te enviaremos las instrucciones de restablecimiento
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 text-left">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Te hemos enviado un enlace para recuperar tu contraseña. Revisa tu bandeja de entrada o spam.</span>
            </div>
            <Link
              to="/login"
              className="inline-flex w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-blue-400 font-bold text-sm tracking-wide items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md shadow-secondary/10"
            >
              <span>Volver a Iniciar Sesión</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wider">Email Registrado</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-blue-400 font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-secondary/10 hover:scale-[1.01] transition-all duration-200"
            >
              {loading ? "Enviando Enlace..." : "Enviar Enlace de Recuperación"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-6 text-center text-xs">
            <Link
              to="/login"
              className="text-gray-400 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Volver a Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
