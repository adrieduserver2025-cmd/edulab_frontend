import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Lock, Mail, User, ArrowRight, ShieldAlert } from "lucide-react";
import { registerWithEmail } from "../../services/authService";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password, name);
      navigate("/verify-email", { state: { email } });
    } catch (err: any) {
      console.error("Firebase Registration Error:", err);
      setError(err.message || "Error al crear la cuenta. Reintente.");
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
            Crear Cuenta EDULAB
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Únete a la plataforma inteligente de becas y voluntariados
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wider">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-glass-border focus:border-secondary/50 focus:outline-none text-sm text-gray-200 transition-all duration-200"
              />
            </div>
          </div>

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
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-glass-border focus:border-secondary/50 focus:outline-none text-sm text-gray-200 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wider">Confirmar Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-glass-border focus:border-secondary/50 focus:outline-none text-sm text-gray-200 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-blue-400 font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-secondary/10 hover:scale-[1.01] transition-all duration-200"
          >
            {loading ? "Creando Cuenta..." : "Registrarse"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs">
          <Link
            to="/login"
            className="text-gray-400 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            ¿Ya tienes cuenta? Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
