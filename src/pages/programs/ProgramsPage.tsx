import { Globe2 } from "lucide-react";

export default function ProgramsPage() {
  return (
    <div className="space-y-6 text-white animate-fadeIn">
      <div className="border-b border-glass-border pb-4">
        <h1 className="font-display font-extrabold text-3xl">Explorar Programas</h1>
        <p className="text-sm text-gray-500 mt-1">Navega y filtra becas de excelencia y voluntariados internacionales.</p>
      </div>

      <div className="glass-panel p-12 rounded-3xl border border-glass-border text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-glass-border flex items-center justify-center mx-auto shadow-lg">
          <Globe2 className="w-8 h-8 text-secondary animate-pulse" />
        </div>
        <h2 className="font-display font-bold text-xl">Buscador y Filtros Avanzados</h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          El módulo completo de búsqueda por geolocalización, rango de beneficios y disciplinas académicas está programado para el Sprint 1.
        </p>
      </div>
    </div>
  );
}
