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
    <div className="min-h-[70vh] flex flex-col justify-center items-center p-6 relative overflow-hidden text-slate-700">
      {/* Background Glowing Orbs */}
      <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#5D8CE2]/15 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#F5C542]/10 blur-[100px] pointer-events-none"></div>

      {/* White Panel Onboarding Card */}
      <div className="w-full max-w-lg bg-white p-10 rounded-3xl border border-gray-150 shadow-xl relative z-10 text-center space-y-8 animate-fadeIn text-slate-700">
        
        {/* Animated Icon Circle */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#5D8CE2] to-[#00135B] flex items-center justify-center border border-white/10 shadow-sm mx-auto relative group">
          <GraduationCap className="w-10 h-10 text-[#F5C542] group-hover:scale-110 transition-transform duration-300" />
          <Sparkles className="w-5 h-5 text-[#F5C542] absolute top-3 right-3 animate-pulse" />
        </div>

        {/* Heading Content */}
        <div className="space-y-3">
          <h1 className="font-display font-extrabold text-3xl tracking-wide text-[#00135B]">
            Completa tu perfil EDULAB
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto font-medium">
            Tu perfil nos ayudará a encontrar becas, intercambios, voluntariados y oportunidades estratégicas que coincidan exactamente con tus objetivos académicos y profesionales.
          </p>
        </div>

        {/* Actions Button Group */}
        <div className="space-y-4 pt-4">
          <button
            onClick={handleCompleteNow}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 text-white font-extrabold text-sm tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer border-none"
          >
            <span>Completar perfil ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSkipForNow}
            className="w-full py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-gray-200 text-xs font-bold text-slate-400 hover:text-[#00135B] transition-all duration-200 cursor-pointer active:scale-95"
          >
            Saltar por ahora
          </button>
        </div>

        {/* Tip Badge */}
        <div className="pt-2 text-[11px] text-slate-400 italic">
          💡 Puedes postular a las oportunidades en cualquier momento completando el perfil mínimo requerido por el programa.
        </div>
      </div>
    </div>
  );
}
