import { useState } from "react";
import { X, ArrowLeft, GraduationCap, Sparkles } from "lucide-react";

interface IaIntroModalProps {
  isOpen: boolean;
  onClose: (allowAiImprovement: boolean) => void;
}

export default function IaIntroModal({ isOpen, onClose }: IaIntroModalProps) {
  const [toggleState, setToggleState] = useState(true);

  if (!isOpen) return null;

  const handleStart = () => {
    onClose(toggleState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[550px] border border-gray-100 relative animate-scaleUp text-gray-800">
        
        {/* Left Side: Content */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between overflow-y-auto text-left h-full bg-white relative">
          
          {/* Back button */}
          <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer text-xs font-semibold select-none" onClick={() => onClose(false)}>
            <ArrowLeft className="w-4 h-4" />
            <span>Atrás</span>
          </div>

          <div className="my-auto py-6 space-y-6">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#00135B] tracking-tight leading-tight">
              Antes de empezar, <br />hablemos de la IA. 🤖 🤝
            </h2>

            <div className="space-y-4 text-xs text-gray-500 leading-relaxed font-medium">
              <p>
                Estás a punto de descubrir cómo la IA de EDULAB puede ayudarte a alcanzar tus objetivos académicos e internacionales. Esta tecnología mejora constantemente con la ayuda de estudiantes como tú.
              </p>
              <p>
                Si activas esta configuración, podremos aprender de tu perfil y preferencias para crear sugerencias y herramientas de IA de manera segura y confidencial.
              </p>
              <p>
                Puedes desactivarlo ahora o en cualquier momento desde tu Configuración, donde siempre mantienes el control absoluto de tus preferencias de privacidad e IA.
              </p>
            </div>

            {/* Toggle Box */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-xs font-bold text-[#00135B]">
                Optimizar herramientas de IA con mi perfil
              </span>
              <button
                type="button"
                onClick={() => setToggleState(!toggleState)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  toggleState ? "bg-[#5D8CE2]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    toggleState ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 transition-all"
          >
            <span>Empezar ahora</span>
          </button>
        </div>

        {/* Right Side: Canva Visual Container */}
        <div className="hidden md:block w-1/2 bg-[#00135B] relative overflow-hidden h-full">
          {/* Grid Overlay */}
          <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none"></div>

          {/* Glowing orbs */}
          <div className="absolute top-[20%] right-[-10%] w-[250px] h-[250px] rounded-full bg-[#5D8CE2]/20 filter blur-[80px]"></div>
          <div className="absolute bottom-[20%] left-[-10%] w-[250px] h-[250px] rounded-full bg-[#F5C542]/10 filter blur-[80px]"></div>

          {/* Illustration Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-10 text-white text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center border border-white/15 shadow-xl animate-float">
              <Sparkles className="w-10 h-10 text-[#F5C542] animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-display font-extrabold text-xl tracking-wide">
                IA Estratégica Integrada
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed max-w-xs font-medium">
                Analizamos convocatorias internacionales y adaptamos cartas motivacionales y CVs en segundos para maximizar tu éxito.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="w-8 h-8 rounded-full bg-[#00135B] flex items-center justify-center border border-white/10">
                <GraduationCap className="w-4 h-4 text-[#F5C542]" />
              </div>
              <span className="font-display font-extrabold text-xs tracking-widest text-[#F5C542]">
                EDULAB
              </span>
            </div>
          </div>
        </div>

        {/* Close absolute Button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
