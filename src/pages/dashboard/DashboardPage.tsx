import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Sparkles, 
  FileText, 
  TrendingUp, 
  Cpu, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Award,
  LogOut,
  AlertTriangle,
  Bookmark,
  Heart
} from "lucide-react";
import axiosClient from "../../services/api/axiosClient";
import { useAuthStore } from "../../store/useAuthStore";
import { getMyProfile } from "../../services/profileService";
import type { StudentProfileResponse } from "../../services/profileService";

interface ProgramItem {
  id: number;
  title: string;
  description: string;
  type: string;
  organization: string;
  country: string;
  deadline: string;
  benefits?: string;
  compatibility?: number;
  slug?: string;
  is_demo?: boolean;
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logoutStore = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authLoading = useAuthStore((state) => state.isLoading || state.loading);

  const navigate = useNavigate();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Profile and Validation States
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  
  // Dynamic stats states
  const [applications, setApplications] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  // Filter and search states
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [selectedType, setSelectedType] = useState<string>("all");

  // Bookmarking state
  const [savedPrograms, setSavedPrograms] = useState<number[]>(() => {
    const saved = localStorage.getItem("edulab_saved_programs");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");

  const toggleSaveProgram = (id: number) => {
    const nextSaved = savedPrograms.includes(id)
      ? savedPrograms.filter((x) => x !== id)
      : [...savedPrograms, id];
    setSavedPrograms(nextSaved);
    localStorage.setItem("edulab_saved_programs", JSON.stringify(nextSaved));
  };

  const handleLogout = async () => {
    try {
      await logoutStore();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  // Load programs data
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await axiosClient.get("/opportunities");
        const enriched = response.data.map((item: any, idx: number) => ({
          ...item,
          compatibility: item.compatibility || (idx === 0 ? 95 : idx === 1 ? 83 : idx === 2 ? 76 : idx === 3 ? 91 : 88)
        }));
        setPrograms(enriched);
      } catch (err) {
        console.warn("Could not load programs from backend. Rendering static demo records.");
        setPrograms([
          {
            id: 1,
            title: "Beca de Excelencia Global DAAD Alemania",
            description: "Beca completa para estudios de Master y Doctorado en universidades alemanas.",
            type: "scholarship",
            organization: "Servicio Alemán de Intercambio Académico (DAAD)",
            country: "Alemania",
            deadline: "2026-10-15",
            benefits: "Matrícula completa, estipendio mensual de €1200 y seguro médico.",
            compatibility: 95,
            slug: "daad-beca",
            is_demo: true
          },
          {
            id: 2,
            title: "Summer School en Liderazgo y Sostenibilidad Oxford",
            description: "Programa intensivo de verano enfocado en políticas ambientales globales.",
            type: "summer_school",
            organization: "University of Oxford",
            country: "Reino Unido",
            deadline: "2026-06-30",
            benefits: "Alojamiento, alimentación y pase de biblioteca.",
            compatibility: 83,
            slug: "oxford-summer-school",
            is_demo: true
          },
          {
            id: 3,
            title: "Intercambio Académico Global U-Tokyo",
            description: "Semestre académico en ingeniería o ciencias computacionales.",
            type: "exchange",
            organization: "University of Tokyo",
            country: "Japón",
            deadline: "2026-08-01",
            benefits: "Exención de matrícula académica y apoyo de instalación.",
            compatibility: 76,
            slug: "u-tokyo-exchange",
            is_demo: true
          },
          {
            id: 4,
            title: "Voluntariado en AIESEC",
            description: "Proyecto internacional centrado en desarrollo comunitario y liderazgo juvenil. Nota: Oportunidad de prueba temporal.",
            type: "volunteering",
            organization: "AIESEC International",
            country: "Brasil",
            deadline: "2026-09-30",
            benefits: "Hospedaje local, seminarios de capacitación y certificado de participación.",
            compatibility: 91,
            slug: "aiesec-voluntariado",
            is_demo: false
          },
          {
            id: 5,
            title: "Voluntariado de Conservación Ambiental ONU",
            description: "Acción ecológica en áreas protegidas de biodiversidad y reforestación. Nota: Oportunidad de prueba temporal.",
            type: "volunteering",
            organization: "Voluntarios de las Naciones Unidas (VNU)",
            country: "Costa Rica",
            deadline: "2026-11-15",
            benefits: "Alojamiento, subsidio de alimentación y cobertura médica.",
            compatibility: 88,
            slug: "onu-voluntariado",
            is_demo: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Load profile and run onboarding redirect check
  useEffect(() => {
    if (authLoading || !isAuthenticated || !token) return;

    async function loadProfile() {
      try {
        const profileData = await getMyProfile();
        setProfile(profileData);

        if (user?.role === "student" && !profileData) {
          const skipped = sessionStorage.getItem("skipped_onboarding") === "true";
          if (!skipped) {
            navigate("/onboarding");
          }
        }
      } catch (err: any) {
        console.error("Failed to load student profile:", err);
        if (err.response?.status !== 401 && user?.role === "student") {
          const skipped = sessionStorage.getItem("skipped_onboarding") === "true";
          if (!skipped) {
            navigate("/onboarding");
          }
        }
      }
    }

    loadProfile();
  }, [authLoading, isAuthenticated, token, user, navigate]);

  // Load applications and documents stats
  useEffect(() => {
    if (authLoading || !isAuthenticated || !token) return;

    async function loadStatsData() {
      try {
        const appsRes = await axiosClient.get("/applications/");
        setApplications(appsRes.data);
      } catch (err) {
        console.error("Failed to load applications:", err);
      }

      try {
        const docsRes = await axiosClient.get("/documents/");
        setDocuments(docsRes.data);
      } catch (err) {
        console.error("Failed to load documents:", err);
      }
    }

    loadStatsData();
  }, [authLoading, isAuthenticated, token]);


  const docsCount = documents.length + (profile?.cv_url ? 1 : 0);
  const stats = [
    { 
      title: "Compatibilidad Promedio", 
      value: profile ? "84%" : "0%", 
      icon: Sparkles, 
      color: "text-[#5D8CE2]", 
      trend: profile ? "+4% esta semana" : "Sin perfil académico" 
    },
    { 
      title: "Postulaciones Activas", 
      value: String(applications.length), 
      icon: TrendingUp, 
      color: "text-[#00135B]", 
      trend: applications.length > 0 ? `${applications.filter((a: any) => a.status === 'started' || a.status === 'under_review').length} en proceso` : "Sin postulaciones" 
    },
    { 
      title: "Documentos Verificados", 
      value: String(docsCount), 
      icon: FileText, 
      color: "text-emerald-500", 
      trend: docsCount > 0 ? "CV / Documentos listos" : "Sube tus documentos" 
    },
  ];

  const showWarningCard = user?.role === "student" && (!profile || profile.profile_completion < 30);
  const completionPct = profile ? profile.profile_completion : 0;

  // Helper to fetch program cover images
  const getProgramImage = (slug?: string) => {
    if (slug === "daad-beca") return "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=300";
    if (slug === "oxford-summer-school") return "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300";
    if (slug === "u-tokyo-exchange") return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=300";
    if (slug === "aiesec-voluntariado") return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=300";
    if (slug === "onu-voluntariado") return "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=300";
    return "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=300";
  };

  // Helper to get country flag
  const getCountryFlag = (country: string) => {
    const norm = country.toLowerCase().trim();
    if (norm.includes("alemania")) return "🇩🇪";
    if (norm.includes("reino unido") || norm.includes("oxford")) return "🇬🇧";
    if (norm.includes("japón") || norm.includes("japon")) return "🇯🇵";
    if (norm.includes("brasil")) return "🇧🇷";
    if (norm.includes("costa rica")) return "🇨🇷";
    if (norm.includes("global") || norm.includes("internacional")) return "🌐";
    return "📍";
  };

  // Helper to fetch program gradient overlay classes with high quality color palettes and transparency
  const getOverlayGradient = (type: string) => {
    switch (type) {
      case 'volunteering':
        // Elegant deep navy blue matching AIESEC / general volunteering, opacity adjusted down
        return "from-[#000E40]/85 via-[#00135B]/60 to-[#001D80]/20";
      case 'scholarship':
        // Beautiful deep green/teal palette for scholarships, matching the academic/funding vibe
        return "from-[#022C22]/85 via-[#064E3B]/60 to-[#10B981]/20";
      case 'exchange':
        // Dynamic violet/indigo palette for academic exchanges
        return "from-[#1F0E40]/85 via-[#3B1578]/60 to-[#6328A6]/20";
      case 'summer_school':
        // Warm amber/bronze/terracotta palette for summer schools
        return "from-[#3A1404]/85 via-[#6E2A0D]/60 to-[#AD4B18]/20";
      default:
        // Fallback default
        return "from-[#000E40]/85 via-[#00135B]/60 to-[#00135B]/20";
    }
  };

  // Helper to get button styling based on type
  const getButtonClass = (type: string) => {
    switch (type) {
      case 'volunteering':
        return "bg-[#00135B] hover:bg-[#0d288c] border-white/10";
      case 'scholarship':
        return "bg-[#047857] hover:bg-[#059669] border-white/10";
      case 'exchange':
        return "bg-[#6D28D9] hover:bg-[#7C3AED] border-white/10";
      case 'summer_school':
        return "bg-[#C2410C] hover:bg-[#EA580C] border-white/10";
      default:
        return "bg-[#00135B] hover:bg-[#0d288c] border-white/10";
    }
  };

  // Helper to get program title hover styling
  const getTitleHoverClass = (type: string) => {
    switch (type) {
      case 'volunteering':
        return "hover:text-[#5D8CE2]";
      case 'scholarship':
        return "hover:text-[#34D399]";
      case 'exchange':
        return "hover:text-[#A78BFA]";
      case 'summer_school':
        return "hover:text-[#FDBA74]";
      default:
        return "hover:text-[#5D8CE2]";
    }
  };

  // Helper to get text color for primary white badge based on type
  const getBadgeTextClass = (type: string) => {
    switch (type) {
      case 'volunteering':
        return "text-[#00135B]";
      case 'scholarship':
        return "text-[#022C22]";
      case 'exchange':
        return "text-[#1F0E40]";
      case 'summer_school':
        return "text-[#3A1404]";
      default:
        return "text-[#00135B]";
    }
  };

  // Filter programs based on active tab, selected type, and search query
  let displayedPrograms = programs;

  if (activeTab === "saved") {
    displayedPrograms = displayedPrograms.filter((p) => savedPrograms.includes(p.id));
  }

  if (selectedType !== "all") {
    displayedPrograms = displayedPrograms.filter((p) => p.type === selectedType);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedPrograms = displayedPrograms.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.organization.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-slate-700 relative">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-[#00135B] leading-none pb-1">
            ¡Hola, {user?.email.split("@")[0]}!
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Bienvenido a tu centro inteligente de postulaciones internacionales.
          </p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm">
          <Calendar className="w-4 h-4 text-[#5D8CE2]" />
          <span className="text-xs font-semibold text-slate-600">Convocatorias Abiertas: Q2-2026</span>
        </div>
      </div>

      {/* Dynamic Profile Warning Card */}
      {showWarningCard && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/30 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-300"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-800 flex items-center gap-1.5">
                Completa tu perfil académico ({completionPct}%)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                Tus posibilidades de emparejamiento con becas y voluntariados internacionales aumentan exponencialmente con un perfil completo al 100%.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="bg-[#00135B] hover:bg-[#0d288c] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm hover:scale-[1.01] relative z-10"
          >
            Completar ahora
          </button>
        </div>
      )}



      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-extrabold font-display text-[#00135B]">{stat.value}</p>
                <p className="text-[10px] text-slate-500 font-semibold">{stat.trend}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-gray-100">
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Left (Programs list) vs Right (AI Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Programs List) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-display font-bold text-xl flex items-center gap-2 text-[#00135B]">
                <Award className="w-5 h-5 text-[#5D8CE2]" />
                <span>Programas Recomendados</span>
              </h2>

              {/* General Filters: Todos / Favoritos */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-gray-200/50 self-start">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "all" ? "bg-white text-[#00135B] shadow-sm" : "text-slate-500 hover:text-slate-800 bg-transparent border-none"}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "saved" ? "bg-white text-[#00135B] shadow-sm" : "text-slate-500 hover:text-slate-800 bg-transparent border-none"}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${activeTab === "saved" ? "fill-[#5D8CE2] text-[#5D8CE2]" : ""}`} />
                  <span>Guardados ({savedPrograms.length})</span>
                </button>
              </div>
            </div>

            {/* Program Type Pills */}
            <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-gray-200/50 self-start">
              {[
                { value: "all", label: "🌍 Todos los Tipos" },
                { value: "scholarship", label: "🎓 Becas" },
                { value: "volunteering", label: "🤝 Voluntariados" },
                { value: "exchange", label: "🌐 Intercambios" },
                { value: "summer_school", label: "☀️ Summer Schools" }
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${selectedType === t.value ? "bg-[#00135B] text-white shadow-sm" : "text-slate-500 hover:text-slate-800 bg-transparent border-none"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-white rounded-2xl border border-gray-200 animate-pulse shadow-sm"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {displayedPrograms.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center space-y-3">
                  <Bookmark className="w-10 h-10 text-slate-300 mx-auto animate-bounce" />
                  <h3 className="font-bold text-slate-600 text-sm">No hay programas para mostrar</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {activeTab === "saved" 
                      ? "Guarda programas haciendo clic en el icono del corazón en la pestaña 'Todos' para verlos aquí." 
                      : "No se encontraron programas en el sistema."}
                  </p>
                </div>
              ) : (
                displayedPrograms.map((prog) => (
                  <div 
                    key={prog.id}
                    className="relative rounded-3xl border border-white/10 overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group min-h-[220px] flex text-white shadow-md bg-slate-900"
                    style={{
                      backgroundImage: `url(${getProgramImage(prog.slug)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Overlay Gradient for readability */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${getOverlayGradient(prog.type)} z-0`}></div>

                    {/* Content Wrapper */}
                    <div className="relative z-10 w-full p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      {/* Left: Metadata and Text Details */}
                      <div className="space-y-3.5 flex-1 text-left">
                        {/* Badges Capsule */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[8px] px-3 py-1 rounded-full bg-white ${getBadgeTextClass(prog.type)} font-extrabold uppercase tracking-wider`}>
                            {prog.type === 'scholarship' ? 'Beca' : prog.type === 'volunteering' ? 'Voluntariado' : prog.type === 'exchange' ? 'Intercambio' : prog.type === 'summer_school' ? 'Summer School' : prog.type}
                          </span>
                          <span className="text-[8px] px-3 py-1 rounded-full bg-white/20 border border-white/10 text-white font-extrabold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-sm">
                            <span>{getCountryFlag(prog.country)}</span>
                            <span>{prog.country}</span>
                          </span>
                          {prog.is_demo && (
                            <span className="text-[8px] px-3 py-1 rounded-full bg-[#F5C542] text-[#00135B] font-extrabold uppercase tracking-wider">
                              Demo
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 
                          onClick={() => navigate("/opportunities/" + (prog.slug || "aiesec-voluntariado"))}
                          className={`font-extrabold text-xl md:text-2xl text-white font-display leading-tight ${getTitleHoverClass(prog.type)} cursor-pointer transition-colors text-left`}
                        >
                          {prog.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-white/90 font-medium line-clamp-2 leading-relaxed max-w-2xl">
                          {prog.description}
                        </p>

                        {/* Specs Footer */}
                        <div className="text-[11px] text-white/80 font-medium">
                          Organiza: <span className="text-white font-bold">{prog.organization}</span>
                          <span className="mx-2 opacity-50">|</span>
                          Límite: <span className="text-[#F5C542] font-extrabold">{prog.deadline}</span>
                        </div>
                      </div>

                      {/* Vertical Separator */}
                      <div className="hidden md:block w-px h-24 bg-white/20 shrink-0 mx-2"></div>

                      {/* Right: IA compatibility & Actions */}
                      <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 md:w-40 shrink-0 max-md:border-t max-md:border-white/10 max-md:pt-4">
                        
                        {/* IA Fit circle */}
                        <div className="text-center flex md:flex-col items-center gap-3 md:gap-1">
                          <div className="relative w-14 h-14 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg mx-auto shrink-0">
                            <span className="text-xs font-extrabold text-white font-display">{prog.compatibility}%</span>
                            <div className="absolute inset-0.5 rounded-full border border-dashed border-[#F5C542]/40 animate-spin-slow"></div>
                          </div>
                          <span className="text-[8px] text-white/80 font-bold uppercase tracking-wider">Ajuste de IA</span>
                        </div>
                        
                        {/* Buttons Group */}
                        <div className="flex items-center gap-2 w-full justify-end md:justify-center">
                          <button
                            onClick={() => toggleSaveProgram(prog.id)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer bg-white/5 backdrop-blur-md ${
                              savedPrograms.includes(prog.id)
                                ? "border-rose-400 text-rose-400 bg-rose-500/10"
                                : "border-white/40 text-white/95 hover:bg-white/10"
                            }`}
                            title={savedPrograms.includes(prog.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                          >
                            <Heart className={`w-4 h-4 ${savedPrograms.includes(prog.id) ? "fill-current" : ""}`} />
                          </button>

                          <button 
                            onClick={() => navigate("/opportunities/" + (prog.slug || "aiesec-voluntariado"))}
                            className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 border ${getButtonClass(prog.type)}`}
                          >
                            Ver Más
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Column (AI Suite & Profile Details) */}
        <div className="space-y-6">
          {/* Active Session Card */}
          {user && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm bg-gradient-to-tr from-[#5D8CE2]/5 to-transparent space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
                👤 Tu Sesión Activa (Firebase)
              </h3>
              
              <div className="flex items-center gap-4 text-left">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    className="w-12 h-12 rounded-full border-2 border-[#5D8CE2] object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00135B] to-[#5D8CE2] flex items-center justify-center font-bold text-base text-white">
                    {(user.displayName || user.email).substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#00135B] truncate">
                    {user.displayName || user.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="pt-2 space-y-2 border-t border-gray-100 text-left">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">UID de Firebase:</span>
                  <span className="text-slate-600 font-mono select-all bg-slate-50 px-2 py-0.5 rounded border border-gray-200 max-w-[150px] truncate">
                    {user.uid || user.id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">Rol Asignado:</span>
                  <span className="text-amber-600 font-bold uppercase">{user.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}

          {/* AI Copilot Section */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-xl flex items-center gap-2 text-[#00135B] text-left">
              <Cpu className="w-5 h-5 text-[#5D8CE2]" />
              <span>Asistente Copiloto IA</span>
            </h2>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4 text-left">
              
              {/* AI Review CV Card */}
              <div className="space-y-3 p-4 bg-slate-50 border border-gray-200/60 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-[#00135B]">Análisis de CV</h3>
                    <p className="text-xs text-slate-500">Verifica alineación de palabras clave.</p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase">
                    Listo
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-700">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-medium">Curriculum optimizado al 88%</span>
                </div>
                <button className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 border border-gray-200 hover:border-[#5D8CE2]/30 text-xs font-bold text-[#00135B] transition-all duration-200 cursor-pointer">
                  Re-analizar CV
                </button>
              </div>

              {/* AI Letter Generator Card */}
              <div className="space-y-3 p-4 bg-slate-50 border border-gray-200/60 rounded-2xl">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#00135B]">Carta de Motivación</h3>
                  <p className="text-xs text-slate-500">Genera borradores persuasivos en base al programa.</p>
                </div>
                <button className="w-full py-2.5 rounded-xl bg-[#5D8CE2]/10 hover:bg-[#5D8CE2]/25 border border-[#5D8CE2]/30 text-xs font-bold text-[#00135B] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Redactar con IA</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00135B]" />
                </button>
              </div>

              {/* AI Interviews Card */}
              <div className="space-y-3 p-4 bg-slate-50 border border-gray-200/60 rounded-2xl">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#00135B]">Simulador de Entrevistas</h3>
                  <p className="text-xs text-slate-500">Practica preguntas de liderazgo y académicas.</p>
                </div>
                <button className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 border border-gray-200 hover:border-[#5D8CE2]/30 text-xs font-bold text-[#00135B] transition-all duration-200 cursor-pointer">
                  Iniciar Simulación
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>



    </div>
  );
}
