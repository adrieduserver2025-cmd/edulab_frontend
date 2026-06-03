import { BrainCircuit } from "lucide-react";

export default function AIToolsPage() {
  return (
    <div className="space-y-6 text-slate-700 animate-fadeIn">
      <div className="border-b border-gray-250 pb-4">
        <h1 className="font-display font-extrabold text-3xl text-[#00135B]">Copiloto IA Académico</h1>
        <p className="text-sm text-slate-500 mt-1">Herramientas inteligentes para impulsar tu postulación.</p>
      </div>

      <div className="bg-white p-12 rounded-3xl border border-gray-150 shadow-md text-center space-y-4 text-slate-700">
        <div className="w-16 h-16 rounded-2xl bg-[#F5C542]/10 border border-[#F5C542]/20 flex items-center justify-center mx-auto shadow-sm">
          <BrainCircuit className="w-8 h-8 text-[#5D8CE2] animate-pulse" />
        </div>
        <h2 className="font-display font-bold text-xl text-[#00135B]">Suite de Inteligencia Artificial</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto font-medium">
          Los motores generativos de OpenAI/Claude para redacción de ensayos, cartas motivacionales y mock interviews por audio están agendados para la Fase 2 de EDULAB.
        </p>
      </div>
    </div>
  );
}
