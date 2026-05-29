import { BrainCircuit } from "lucide-react";

export default function AIToolsPage() {
  return (
    <div className="space-y-6 text-white animate-fadeIn">
      <div className="border-b border-glass-border pb-4">
        <h1 className="font-display font-extrabold text-3xl">Copiloto IA Académico</h1>
        <p className="text-sm text-gray-500 mt-1">Herramientas inteligentes para impulsar tu postulación.</p>
      </div>

      <div className="glass-panel p-12 rounded-3xl border border-glass-border text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-glass-border flex items-center justify-center mx-auto shadow-lg">
          <BrainCircuit className="w-8 h-8 text-accent animate-pulse" />
        </div>
        <h2 className="font-display font-bold text-xl">Suite de Inteligencia Artificial</h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Los motores generativos de OpenAI/Claude para redacción de ensayos, cartas motivacionales y mock interviews por audio están agendados para la Fase 2 de EDULAB.
        </p>
      </div>
    </div>
  );
}
