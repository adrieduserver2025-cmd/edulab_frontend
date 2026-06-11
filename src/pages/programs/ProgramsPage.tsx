import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Globe2,
  GraduationCap,
  HandHeart,
  MapPin,
  Search,
  BriefcaseBusiness,
} from "lucide-react";
import { getOpportunities } from "../../services/opportunityService";

type OpportunityCard = {
  id: number;
  title: string;
  slug: string;
  type: string;
  organization?: string;
  organization_name?: string;
  country?: string;
  deadline?: string;
  short_description?: string;
  description?: string;
  status?: string;
};

function getTypeLabel(type?: string) {
  if (type === "volunteering") return "Voluntariado";
  if (type === "scholarship") return "Beca";
  if (type === "job") return "Trabajo";
  return "Oportunidad";
}

function getTypeIcon(type?: string) {
  if (type === "volunteering") return HandHeart;
  if (type === "scholarship") return GraduationCap;
  if (type === "job") return BriefcaseBusiness;
  return Globe2;
}

export default function ProgramsPage() {
  const [opportunities, setOpportunities] = useState<OpportunityCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    async function loadOpportunities() {
      setLoading(true);
      setError(null);

      try {
        const data = await getOpportunities();

        const list = Array.isArray(data)
          ? data
          : data.items || data.results || [];

        setOpportunities(list);
      } catch (err) {
        console.error("Error cargando oportunidades:", err);
        setError("No se pudieron cargar las oportunidades desde el backend.");
      } finally {
        setLoading(false);
      }
    }

    loadOpportunities();
  }, []);

  const filteredOpportunities = useMemo(() => {
    let result = [...opportunities];

    if (typeFilter !== "all") {
      result = result.filter((item) => item.type === typeFilter);
    }

    if (search.trim()) {
      const value = search.toLowerCase();

      result = result.filter((item) => {
        return (
          item.title?.toLowerCase().includes(value) ||
          item.organization?.toLowerCase().includes(value) ||
          item.organization_name?.toLowerCase().includes(value) ||
          item.country?.toLowerCase().includes(value)
        );
      });
    }

    return result;
  }, [opportunities, search, typeFilter]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-md">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#5D8CE2]/20 border-t-[#5D8CE2]" />
        <p className="mt-4 text-sm font-bold text-[#00135B]">
          Cargando oportunidades...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center shadow-md">
        <p className="text-sm font-bold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-700 animate-fadeIn">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="font-display font-extrabold text-3xl text-[#00135B]">
          Explorar Programas
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Navega y filtra becas, voluntariados y oportunidades internacionales.
        </p>
      </div>

      <div className="rounded-3xl border border-[#EBDDC5] bg-white p-5 shadow-[0_12px_35px_rgba(3,26,51,0.05)]">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título, organización o país..."
              className="w-full rounded-2xl border border-gray-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#5D8CE2]/50 focus:bg-white"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold text-[#00135B] outline-none transition focus:border-[#5D8CE2]/50 focus:bg-white"
          >
            <option value="all">Todas</option>
            <option value="volunteering">Voluntariados</option>
            <option value="scholarship">Becas</option>
            <option value="job">Trabajos</option>
          </select>
        </div>
      </div>

      {filteredOpportunities.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-md">
          <p className="text-sm font-bold text-slate-500">
            No se encontraron oportunidades con esos filtros.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredOpportunities.map((item) => {
            const Icon = getTypeIcon(item.type);

            return (
              <Link
                key={item.id}
                to={`/opportunities/${item.slug}`}
                className="group rounded-3xl border border-[#EBDDC5] bg-white p-5 shadow-[0_12px_35px_rgba(3,26,51,0.05)] transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#5D8CE2]/20 bg-[#5D8CE2]/10 text-[#5D8CE2]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    {getTypeLabel(item.type)}
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-black leading-tight text-[#00135B] group-hover:text-[#5D8CE2]">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-500 line-clamp-3">
                  {item.short_description || item.description}
                </p>

                <div className="mt-5 space-y-2 text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-3.5 w-3.5 text-[#5D8CE2]" />
                    <span>
                      {item.organization_name ||
                        item.organization ||
                        "Organización aliada"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#5D8CE2]" />
                    <span>{item.country || "Global"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-[#5D8CE2]" />
                    <span>{item.deadline || "Convocatoria abierta"}</span>
                  </div>
                </div>

                <div className="mt-6 inline-flex items-center rounded-xl bg-[#00135B] px-4 py-2 text-xs font-black text-white transition group-hover:bg-[#5D8CE2]">
                  Ver oportunidad
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}