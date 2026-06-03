import { Globe2 } from "lucide-react";

export default function ProgramsPage() {
  return (
    <div className="space-y-6 text-slate-700 animate-fadeIn">
      <div className="border-b border-gray-250 pb-4">
        <h1 className="font-display font-extrabold text-3xl text-[#00135B]">Explorar Programas</h1>
        <p className="text-sm text-slate-500 mt-1">Navega y filtra becas de excelencia y voluntariados internacionales.</p>
      </div>

      <div className="bg-white p-12 rounded-3xl border border-gray-150 shadow-md text-center space-y-4 text-slate-700">
        <div className="w-16 h-16 rounded-2xl bg-[#5D8CE2]/10 border border-[#5D8CE2]/20 flex items-center justify-center mx-auto shadow-sm">
          <Globe2 className="w-8 h-8 text-[#5D8CE2] animate-pulse" />
        </div>
        <h2 className="font-display font-bold text-xl text-[#00135B]">Buscador y Filtros Avanzados</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto font-medium">
          El módulo completo de búsqueda por geolocalización, rango de beneficios y disciplinas académicas está programado para el Sprint 1.
        </p>
      </div>
    </div>
  );
}
