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
  Heart,
  Plus,
  Check,
  X,
  Eye,
  Building2,
  Users,
  CheckCircle2,
  Globe
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

  if (user?.role === "organization") {
    return <OrganizationDashboard />;
  }
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

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
      trend: profile ? "+4% esta semana" : "Sin perfil EDULAB" 
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
                Completa tu perfil EDULAB ({completionPct}%)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                Tus posibilidades de emparejamiento con becas y voluntariados internacionales aumentan exponencialmente con un perfil completo.
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

// ==========================================================
// ORGANIZATION DASHBOARD
// ==========================================================
function OrganizationDashboard() {
  const logoutStore = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  
  const [activeTab, setActiveTab] = useState<"programs" | "applicants">("programs");
  const [programs, setPrograms] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);

  // Create Opportunity Form State
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("scholarship");
  const [newDescription, setNewDescription] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newBenefits, setNewBenefits] = useState("");
  const [newEligibility, setNewEligibility] = useState("");
  const [newSlots, setNewSlots] = useState("");
  
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Requirements config states
  const [reqProfileFields, setReqProfileFields] = useState<string[]>(["phone", "cv"]); 
  const [reqDocuments, setReqDocuments] = useState<string[]>([]);
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);

  // Temp state for adding a custom question
  const [tempQText, setTempQText] = useState("");
  const [tempQType, setTempQType] = useState<"short_text" | "long_text" | "single_choice">("short_text");
  const [tempQOptions, setTempQOptions] = useState("");
  const [tempQRequired, setTempQRequired] = useState(true);

  // Status PATCH updates
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const pRes = await axiosClient.get("/organizations/me/programs");
      setPrograms(pRes.data);
    } catch (err) {
      console.error("Error loading org programs:", err);
    }

    try {
      const aRes = await axiosClient.get("/organizations/me/applicants");
      setApplicants(aRes.data);
    } catch (err) {
      console.error("Error loading org applicants:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    
    if (!newTitle.trim()) {
      setCreateError("El título de la convocatoria es requerido.");
      return;
    }
    if (!newDescription.trim()) {
      setCreateError("La descripción es requerida.");
      return;
    }

    setCreateLoading(true);
    try {
      await axiosClient.post("/organizations/me/programs", {
        title: newTitle,
        type: newType,
        description: newDescription,
        country: newCountry || "Global",
        deadline: newDeadline || null,
        benefits: newBenefits,
        eligibility: newEligibility,
        slots: newSlots ? parseInt(newSlots) : null,
        required_profile_fields: reqProfileFields,
        required_documents: reqDocuments,
        custom_questions: customQuestions
      });

      // Reset
      setNewTitle("");
      setNewDescription("");
      setNewCountry("");
      setNewDeadline("");
      setNewBenefits("");
      setNewEligibility("");
      setNewSlots("");
      setReqProfileFields(["phone", "cv"]);
      setReqDocuments([]);
      setCustomQuestions([]);
      setShowCreateModal(false);
      
      // Reload
      await loadData();
    } catch (err: any) {
      setCreateError(err.response?.data?.detail || "Ocurrió un error al crear la convocatoria.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: number, nextStatus: string) => {
    setUpdatingStatus(true);
    setStatusError(null);
    try {
      await axiosClient.patch(`/organizations/me/applications/${appId}/status`, {
        status: nextStatus
      });
      // reload lists
      await loadData();
      
      // Update local selectedApplicant view
      setSelectedApplicant((prev: any) => {
        if (!prev) return null;
        const newAudit = {
          id: Date.now(),
          old_status: prev.status,
          new_status: nextStatus,
          changed_by: user?.email || "organization",
          created_at: new Date().toISOString()
        };
        return {
          ...prev,
          status: nextStatus,
          status_history: [newAudit, ...(prev.status_history || [])]
        };
      });
    } catch (err: any) {
      console.error(err);
      setStatusError(err.response?.data?.detail || "Error al actualizar el estado de la postulación.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleLogout = async () => {
    await logoutStore();
    window.location.href = "/";
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-700 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-[#00135B] pb-1">
            Centro de Organización
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona tus convocatorias y revisa los postulantes asignados a tus oportunidades de manera segura.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Convocatoria</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-600 transition-all cursor-pointer flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Convocatorias Publicadas</p>
            <p className="text-3xl font-extrabold font-display text-[#00135B]">{programs.length}</p>
            <p className="text-[10px] text-slate-500 font-semibold">Programas activos en EDULAB</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
            <Globe className="w-6 h-6 text-[#5D8CE2]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Postulaciones Recibidas</p>
            <p className="text-3xl font-extrabold font-display text-[#00135B]">{applicants.length}</p>
            <p className="text-[10px] text-slate-500 font-semibold">Candidatos aplicando a tus ofertas</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <Users className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("programs")}
          className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "programs"
              ? "border-[#00135B] text-[#00135B]"
              : "border-transparent text-slate-400 hover:text-slate-600 bg-transparent"
          }`}
        >
          Mis Convocatorias ({programs.length})
        </button>
        <button
          onClick={() => setActiveTab("applicants")}
          className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "applicants"
              ? "border-[#00135B] text-[#00135B]"
              : "border-transparent text-slate-400 hover:text-slate-600 bg-transparent"
          }`}
        >
          Postulantes Recibidos ({applicants.length})
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <div className="w-10 h-10 border-t-2 border-r-2 border-[#00135B] rounded-full animate-spin"></div>
        </div>
      ) : activeTab === "programs" ? (
        // Tab: Convocatorias List
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          {programs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-600">No has publicado convocatorias</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Crea tu primera convocatoria académica o de voluntariado haciendo clic en "Nueva Convocatoria".
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200">
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Título de la Convocatoria</th>
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Tipo</th>
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">País</th>
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Límite</th>
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Cupos</th>
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Slug</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {programs.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-4.5 text-sm font-bold text-slate-700">{p.title}</td>
                      <td className="p-4.5">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#00135B] uppercase">
                          {p.type}
                        </span>
                      </td>
                      <td className="p-4.5 text-sm text-slate-500">{p.country}</td>
                      <td className="p-4.5 text-sm text-amber-600 font-semibold">{p.deadline || "Abierto"}</td>
                      <td className="p-4.5 text-sm text-slate-600">{p.slots || "N/A"}</td>
                      <td className="p-4.5 text-xs font-mono text-slate-400 select-all">{p.slug}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        // Tab: Applicants List
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          {applicants.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-600">No hay postulaciones registradas</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Los estudiantes que apliquen a tus convocatorias aparecerán listados aquí con sus datos de perfil.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200">
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Estudiante</th>
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Convocatoria</th>
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Estado de Postulación</th>
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Fecha de Aplicación</th>
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-4.5">
                        <p className="text-sm font-bold text-slate-700">{app.student_name}</p>
                        <p className="text-xs text-slate-400">{app.student_email}</p>
                      </td>
                      <td className="p-4.5 text-sm font-semibold text-[#00135B]">{app.program_title}</td>
                      <td className="p-4.5">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase">
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4.5 text-sm text-slate-500">
                        {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "Iniciada"}
                      </td>
                      <td className="p-4.5">
                        <button
                          onClick={() => setSelectedApplicant(app)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#5D8CE2]/50 hover:bg-slate-50 text-xs font-bold text-[#00135B] transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Perfil</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE PROGRAM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-display font-extrabold text-xl text-[#00135B]">
                Crear Convocatoria
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateProgram} className="p-6 overflow-y-auto space-y-4 flex-1">
              {createError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium text-left">
                  {createError}
                </div>
              )}

              <div className="relative">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                  Título de la Convocatoria *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Beca de Liderazgo Comunitario 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Tipo de Convocatoria *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all bg-white"
                  >
                    <option value="scholarship">Beca</option>
                    <option value="volunteering">Voluntariado</option>
                    <option value="exchange">Intercambio</option>
                    <option value="summer_school">Summer School</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    País Destino
                  </label>
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    placeholder="Ej. Alemania o Global"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Fecha Límite
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Cupos Disponibles (Opcional)
                  </label>
                  <input
                    type="number"
                    value={newSlots}
                    onChange={(e) => setNewSlots(e.target.value)}
                    placeholder="Ej. 10"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                  Descripción Detallada *
                </label>
                <textarea
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detalles sobre la convocatoria..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                  Elegibilidad / Requisitos
                </label>
                <textarea
                  value={newEligibility}
                  onChange={(e) => setNewEligibility(e.target.value)}
                  placeholder="Ej. Graduados universitarios con nivel de inglés intermedio..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                  Beneficios Ofrecidos
                </label>
                <textarea
                  value={newBenefits}
                  onChange={(e) => setNewBenefits(e.target.value)}
                  placeholder="Ej. Alojamiento completo, estipendio mensual..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all resize-none"
                />
              </div>

              {/* CONFIGURACIÓN DE REQUISITOS DE PERFIL EDULAB */}
              <div className="space-y-3 border-t border-gray-100 pt-4 text-left">
                <h4 className="font-bold text-xs text-[#00135B] uppercase tracking-wider">Perfil EDULAB Requerido</h4>
                <p className="text-[10px] text-slate-400">Selecciona qué campos del perfil del estudiante son obligatorios para postular a esta convocatoria.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: "phone", label: "Teléfono" },
                    { key: "country", label: "País" },
                    { key: "city", label: "Ciudad" },
                    { key: "birth_date", label: "Fecha Nacimiento" },
                    { key: "education_level", label: "Nivel Académico" },
                    { key: "university", label: "Universidad" },
                    { key: "carrera", label: "Carrera / Área" },
                    { key: "cv", label: "Currículum (CV)" },
                    { key: "languages", label: "Idiomas / Inglés" },
                    { key: "graduation_date", label: "Fecha Graduación" },
                    { key: "laboral", label: "Experiencia Laboral" },
                    { key: "voluntaria", label: "Experiencia Voluntaria" },
                    { key: "motivation_letter", label: "Carta Motivación" }
                  ].map((field) => {
                    const isChecked = reqProfileFields.includes(field.key);
                    return (
                      <label key={field.key} className="flex items-center gap-2 text-xs font-semibold text-slate-650 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReqProfileFields([...reqProfileFields, field.key]);
                            } else {
                              setReqProfileFields(reqProfileFields.filter(f => f !== field.key));
                            }
                          }}
                          className="rounded text-[#00135B] focus:ring-[#00135B]"
                        />
                        <span>{field.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* DOCUMENTOS SOLICITADOS CHECKLIST */}
              <div className="space-y-3 border-t border-gray-100 pt-4 text-left">
                <h4 className="font-bold text-xs text-[#00135B] uppercase tracking-wider">Documentos Solicitados</h4>
                <p className="text-[10px] text-slate-400">Selecciona qué documentos adicionales obligatorios debe subir el postulante.</p>
                
                <div className="flex flex-wrap gap-4">
                  {[
                    "Carta de Recomendación",
                    "Video de Presentación",
                    "Certificado de Idiomas",
                    "Certificado de Notas",
                    "Portafolio"
                  ].map((docName) => {
                    const isChecked = reqDocuments.includes(docName);
                    return (
                      <label key={docName} className="flex items-center gap-2 text-xs font-semibold text-slate-650 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setReqDocuments([...reqDocuments, docName]);
                            } else {
                              setReqDocuments(reqDocuments.filter(d => d !== docName));
                            }
                          }}
                          className="rounded text-[#00135B] focus:ring-[#00135B]"
                        />
                        <span>{docName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* PREGUNTAS PERSONALIZADAS CONSTRUCTOR */}
              <div className="space-y-3 border-t border-gray-100 pt-4 text-left">
                <h4 className="font-bold text-xs text-[#00135B] uppercase tracking-wider">Preguntas Personalizadas</h4>
                <p className="text-[10px] text-slate-400">Agrega preguntas específicas para los aplicantes de esta oportunidad.</p>

                {/* List of current questions */}
                {customQuestions.length > 0 && (
                  <div className="space-y-2">
                    {customQuestions.map((q, idx) => (
                      <div key={q.id} className="bg-slate-50 border border-gray-150 p-3.5 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-700 flex items-center gap-1.5">
                            <span>{idx + 1}. {q.text}</span>
                            {q.required && <span className="text-rose-500 font-extrabold">*</span>}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Tipo: {q.type === "long_text" ? "Texto Largo" : q.type === "single_choice" ? "Opción Única" : "Texto Corto"}{q.options && ` [${q.options.join(", ")}]`}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCustomQuestions(customQuestions.filter(curr => curr.id !== q.id))}
                          className="text-rose-500 hover:text-rose-600 font-bold bg-transparent border-none cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dynamic adder interface */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-gray-200 space-y-3">
                  <p className="text-[10px] font-bold text-slate-500 uppercase font-display">Añadir Nueva Pregunta</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Escribe la pregunta aquí..."
                      value={tempQText}
                      onChange={(e) => setTempQText(e.target.value)}
                      className="bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] sm:col-span-2"
                    />

                    <select
                      value={tempQType}
                      onChange={(e) => setTempQType(e.target.value as any)}
                      className="bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] bg-white"
                    >
                      <option value="short_text">Texto Corto</option>
                      <option value="long_text">Texto Largo</option>
                      <option value="single_choice">Opción Única</option>
                    </select>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-650 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempQRequired}
                        onChange={(e) => setTempQRequired(e.target.checked)}
                        className="rounded text-[#00135B]"
                      />
                      <span>Pregunta Obligatoria</span>
                    </label>

                    {tempQType === "single_choice" && (
                      <input
                        type="text"
                        placeholder="Opciones (separadas por comas)"
                        value={tempQOptions}
                        onChange={(e) => setTempQOptions(e.target.value)}
                        className="bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] sm:col-span-2"
                      />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (tempQText.trim()) {
                        const newQ = {
                          id: `q-${Date.now()}`,
                          text: tempQText.trim(),
                          type: tempQType,
                          required: tempQRequired,
                          options: tempQType === "single_choice" ? tempQOptions.split(",").map(o => o.trim()).filter(Boolean) : undefined
                        };
                        setCustomQuestions([...customQuestions, newQ]);
                        setTempQText("");
                        setTempQOptions("");
                        setTempQRequired(true);
                      }
                    }}
                    className="bg-[#5D8CE2] hover:bg-[#5D8CE2]/80 text-white font-bold px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer border-none"
                  >
                    + Agregar Pregunta
                  </button>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {createLoading ? "Creando..." : "Publicar Convocatoria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLICANT DETAIL MODAL */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between text-left">
              <div>
                <h3 className="font-display font-extrabold text-xl text-[#00135B]">
                  Perfil de Postulante
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Postulado a: <span className="font-semibold text-[#00135B]">{selectedApplicant.program_title}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedApplicant(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-850 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-left flex-1">
              
              {/* Profile header */}
              <div className="flex items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-gray-150">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00135B] to-[#5D8CE2] flex items-center justify-center font-bold text-white text-lg shadow-sm">
                    {selectedApplicant.student_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#00135B]">{selectedApplicant.student_name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{selectedApplicant.student_email}</p>
                  </div>
                </div>

                {/* Status Dropdown selector */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Estado Postulación</span>
                  <div className="flex items-center gap-2">
                    {updatingStatus && <div className="w-4 h-4 border-2 border-[#00135B] border-t-transparent rounded-full animate-spin"></div>}
                    <select
                      value={selectedApplicant.status}
                      disabled={updatingStatus}
                      onChange={(e) => handleUpdateStatus(selectedApplicant.id, e.target.value)}
                      className="bg-white border border-gray-250 text-[#00135B] rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#5D8CE2] cursor-pointer"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_REVIEW">IN_REVIEW</option>
                      <option value="INTERVIEW">INTERVIEW</option>
                      <option value="PRESELECTED">PRESELECTED</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="WITHDRAWN">WITHDRAWN</option>
                    </select>
                  </div>
                  {statusError && <span className="text-[10px] text-rose-500 font-bold">{statusError}</span>}
                </div>
              </div>

              {/* Grid 1: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-gray-150 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Ubicación</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.student_city}, {selectedApplicant.student_country}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Teléfono</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.student_phone || "No provisto"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Fecha de Nacimiento</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.student_birth_date || "No provisto"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Nivel de Educación</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.student_education_level}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Institución</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.student_current_institution || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Carrera / Área</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.student_area || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Nivel de Inglés</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.student_english_level || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Graduación Estimada</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.student_expected_graduation_date || "N/A"}</span>
                </div>
                {selectedApplicant.student_other_languages && selectedApplicant.student_other_languages.length > 0 && (
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Otros Idiomas</span>
                    <span className="text-slate-800 font-semibold">{selectedApplicant.student_other_languages.join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Links and Bio */}
              <div className="space-y-3">
                {selectedApplicant.student_bio && (
                  <div>
                    <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Biografía</h5>
                    <p className="text-xs text-slate-650 leading-relaxed mt-1 bg-slate-50/50 p-3 rounded-xl border border-gray-150">
                      {selectedApplicant.student_bio}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {selectedApplicant.student_cv_url && (
                    <a
                      href={selectedApplicant.student_cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-xs font-bold text-emerald-700 transition-all"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Ver Currículum Vitae (CV)</span>
                    </a>
                  )}
                  {selectedApplicant.student_linkedin_url && (
                    <a
                      href={selectedApplicant.student_linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 transition-all"
                    >
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {selectedApplicant.student_portfolio_url && (
                    <a
                      href={selectedApplicant.student_portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-gray-250 text-xs font-bold text-slate-700 transition-all"
                    >
                      <span>Portafolio</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Chronological Trajectory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-xs">
                {/* Work experience list */}
                <div>
                  <h5 className="font-bold text-[#00135B] uppercase tracking-wider text-[10px] mb-2">Trayectoria Laboral</h5>
                  {selectedApplicant.student_work_experience && selectedApplicant.student_work_experience.length > 0 ? (
                    <div className="space-y-2">
                      {selectedApplicant.student_work_experience.map((work: any, idx: number) => (
                        <div key={idx} className="bg-slate-50/50 p-3 rounded-xl border border-gray-150">
                          <p className="font-bold text-slate-700">{work.position} — {work.company}</p>
                          <p className="text-[10px] text-slate-400">{work.start_date} - {work.end_date || "Presente"}</p>
                          {work.description && <p className="text-slate-500 mt-1">{work.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">Sin experiencia laboral declarada.</p>
                  )}
                </div>

                {/* Volunteer experience list */}
                <div>
                  <h5 className="font-bold text-[#00135B] uppercase tracking-wider text-[10px] mb-2">Trayectoria de Voluntariado</h5>
                  {selectedApplicant.student_volunteer_experience && selectedApplicant.student_volunteer_experience.length > 0 ? (
                    <div className="space-y-2">
                      {selectedApplicant.student_volunteer_experience.map((vol: any, idx: number) => (
                        <div key={idx} className="bg-slate-50/50 p-3 rounded-xl border border-gray-150">
                          <p className="font-bold text-slate-700">{vol.role} — {vol.organization}</p>
                          <p className="text-[10px] text-slate-400">{vol.start_date} - {vol.end_date || "Presente"}</p>
                          {vol.description && <p className="text-slate-500 mt-1">{vol.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">Sin voluntariados declarados.</p>
                  )}
                </div>
              </div>

              {/* General Motivation Letter */}
              {selectedApplicant.student_general_motivation_letter && (
                <div className="border-t border-gray-100 pt-4">
                  <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Carta de Motivación General</h5>
                  <p className="text-xs text-slate-650 leading-relaxed bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100 whitespace-pre-line">
                    {selectedApplicant.student_general_motivation_letter}
                  </p>
                </div>
              )}

              {/* Custom Answers */}
              {selectedApplicant.answers && selectedApplicant.answers.length > 0 && (
                <div className="border-t border-gray-100 pt-4 text-xs space-y-3">
                  <h5 className="font-bold text-[#00135B] uppercase tracking-wider text-[10px]">Respuestas al Cuestionario</h5>
                  {(() => {
                    const currentProgram = programs.find(p => p.id === selectedApplicant.program_id);
                    const getQuestionText = (qid: string) => {
                      if (!currentProgram?.custom_questions) return qid;
                      const q = currentProgram.custom_questions.find((x: any) => x.id === qid);
                      return q ? q.text : qid;
                    };
                    return (
                      <div className="space-y-3">
                        {selectedApplicant.answers.map((ans: any, idx: number) => (
                          <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-gray-150">
                            <p className="font-bold text-slate-800">{getQuestionText(ans.question_id)}</p>
                            <p className="text-slate-650 mt-1 bg-white p-2.5 rounded-lg border border-gray-100">{ans.answer}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Uploaded Documents */}
              {selectedApplicant.uploaded_documents && Object.keys(selectedApplicant.uploaded_documents).length > 0 && (
                <div className="border-t border-gray-100 pt-4 text-xs space-y-3">
                  <h5 className="font-bold text-[#00135B] uppercase tracking-wider text-[10px]">Documentos Específicos Subidos</h5>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(selectedApplicant.uploaded_documents).map(([docName, docUrl]: any) => (
                      <a
                        key={docName}
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-gray-250 font-semibold text-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>{docName} &rarr;</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Chronological Status History Audit Trail */}
              {selectedApplicant.status_history && selectedApplicant.status_history.length > 0 && (
                <div className="border-t border-gray-100 pt-4 text-xs space-y-3">
                  <h5 className="font-bold text-[#00135B] uppercase tracking-wider text-[10px]">Historial de Cambios de Estado (Auditoría)</h5>
                  <div className="space-y-2 border-l-2 border-slate-200 pl-4 py-1 ml-2 text-left">
                    {selectedApplicant.status_history.map((h: any, idx: number) => (
                      <div key={idx} className="relative space-y-0.5">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                        <p className="font-semibold text-slate-700">
                          {h.old_status} &rarr; <span className="font-extrabold text-[#5D8CE2]">{h.new_status}</span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Por: <span className="font-medium">{h.changed_by}</span> | {new Date(h.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                >
                  Cerrar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================================
// ADMIN DASHBOARD (ORGANIZATION APPROVAL)
// ==========================================================
function AdminDashboard() {
  const logoutStore = useAuthStore((state) => state.logout);
  const [pendingOrgs, setPendingOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/admin/organizations/pending");
      setPendingOrgs(response.data);
    } catch (err: any) {
      console.error("Error fetching pending orgs:", err);
      setError("Error al obtener las organizaciones pendientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas APROBAR esta organización?")) return;
    try {
      await axiosClient.patch(`/admin/organizations/${id}/approve`);
      alert("Organización aprobada con éxito.");
      await fetchPending();
    } catch (err) {
      console.error("Error approving organization:", err);
      alert("Error al aprobar la organización.");
    }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas RECHAZAR esta organización?")) return;
    try {
      await axiosClient.patch(`/admin/organizations/${id}/reject`);
      alert("Organización rechazada.");
      await fetchPending();
    } catch (err) {
      console.error("Error rejecting organization:", err);
      alert("Error al rechazar la organización.");
    }
  };

  const handleLogout = async () => {
    await logoutStore();
    window.location.href = "/";
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-700 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-[#00135B] pb-1">
            Panel de Administración
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Revisión y aprobación de solicitudes de registro de Organizaciones en EDULAB.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-600 transition-all cursor-pointer flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium text-left">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solicitudes Pendientes</p>
            <p className="text-3xl font-extrabold font-display text-amber-500">{pendingOrgs.length}</p>
            <p className="text-[10px] text-slate-500 font-semibold">Organizaciones esperando revisión de 24 horas</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
            <Building2 className="w-6 h-6 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="w-10 h-10 border-t-2 border-r-2 border-[#00135B] rounded-full animate-spin"></div>
          </div>
        ) : pendingOrgs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-slate-600">¡Al día! No hay solicitudes pendientes</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Todas las organizaciones registradas han sido procesadas por el equipo administrativo.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200">
                  <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Organización</th>
                  <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Tipo</th>
                  <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Ubicación</th>
                  <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Responsable</th>
                  <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Respaldo</th>
                  <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-4.5">
                      <div className="flex items-center gap-3">
                        {org.logo_url ? (
                          <img src={org.logo_url} alt="Logo" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                            {org.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-slate-700">{org.name}</p>
                          {org.website && (
                            <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#5D8CE2] hover:underline">
                              Sitio Web
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-gray-200 text-slate-600 uppercase">
                        {org.type}
                      </span>
                    </td>
                    <td className="p-4.5 text-sm text-slate-500">{org.city}, {org.country}</td>
                    <td className="p-4.5">
                      <p className="text-sm font-semibold text-slate-700">{org.contact_name}</p>
                      <p className="text-[11px] text-slate-400">{org.contact_position} | {org.contact_phone}</p>
                      <p className="text-xs text-slate-500 font-medium">{org.contact_email}</p>
                    </td>
                    <td className="p-4.5">
                      {org.verification_document_url ? (
                        <a
                          href={org.verification_document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#5D8CE2] hover:underline font-bold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Ver Respaldo</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Sin archivo</span>
                      )}
                    </td>
                    <td className="p-4.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(org.id)}
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 hover:text-emerald-700 transition-all cursor-pointer"
                          title="Aprobar Organización"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(org.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 hover:text-rose-700 transition-all cursor-pointer"
                          title="Rechazar Organización"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
