import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const navigate = useNavigate();

  const handleCompleteNow = () => {
    navigate("/profile");
  };

  const handleSkipForNow = () => {
    // Store in sessionStorage to prevent infinite loops during this active session tab
    sessionStorage.setItem("skipped_onboarding", "true");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center p-6 relative overflow-hidden text-white">
      {/* Background Glowing Orbs */}
      <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#5D8CE2]/15 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#F5C542]/10 blur-[100px] pointer-events-none"></div>

      {/* Glass Panel Onboarding Card */}
      <div className="w-full max-w-lg glass-panel p-10 rounded-3xl border border-glass-border bg-[#00135B]/20 backdrop-blur-2xl shadow-2xl relative z-10 text-center space-y-8 animate-fadeIn">
        
        {/* Animated Icon Circle */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#5D8CE2] to-[#00135B] flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(93,140,226,0.35)] mx-auto relative group">
          <GraduationCap className="w-10 h-10 text-[#F5C542] group-hover:scale-110 transition-transform duration-300" />
          <Sparkles className="w-5 h-5 text-accent absolute top-3 right-3 animate-pulse" />
        </div>

        {/* Heading Content */}
        <div className="space-y-3">
          <h1 className="font-display font-extrabold text-3xl tracking-wide bg-gradient-to-r from-white via-blue-100 to-[#5D8CE2] bg-clip-text text-transparent">
            Completa tu perfil académico
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
            Tu perfil nos ayudará a encontrar becas, intercambios, voluntariados y oportunidades estratégicas que coincidan exactamente con tus objetivos académicos y profesionales.
          </p>
        </div>

        {/* Actions Button Group */}
        <div className="space-y-4 pt-4">
          <button
            onClick={handleCompleteNow}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#5D8CE2] to-[#F5C542] hover:from-[#5D8CE2]/90 hover:to-[#F5C542]/90 text-primary-dark font-extrabold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#5D8CE2]/15 hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>Completar perfil ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSkipForNow}
            className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-glass-border text-xs font-bold text-gray-400 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
          >
            Saltar por ahora
          </button>
        </div>

        {/* Tip Badge */}
        <div className="pt-2 text-[11px] text-gray-500 italic">
          💡 Puedes postular a las oportunidades en cualquier momento una vez alcances el 100% de completitud.
        </div>
      </div>
    </div>
  );
}
