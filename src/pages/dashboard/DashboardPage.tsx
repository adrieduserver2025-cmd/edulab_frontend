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
  Globe,
  Edit,
  Trash2
} from "lucide-react";
import axiosClient from "../../services/api/axiosClient";
import { useAuthStore } from "../../store/useAuthStore";
import { getMyProfile } from "../../services/profileService";
import type { StudentProfileResponse } from "../../services/profileService";
import { SPANISH_SPEAKING_COUNTRIES } from "../../constants/spanishCountries";

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

        // Clean up savedPrograms from localStorage if they no longer exist in backend database
        const validIds = enriched.map((p: any) => p.id);
        const filteredSaved = savedPrograms.filter((id) => validIds.includes(id));
        if (filteredSaved.length !== savedPrograms.length) {
          setSavedPrograms(filteredSaved);
          localStorage.setItem("edulab_saved_programs", JSON.stringify(filteredSaved));
        }
      } catch (err) {
        console.warn("Could not load programs from backend. Rendering static demo records.");
        const fallback = [
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
        ];
        setPrograms(fallback);
        
        // Also sync fallback IDs
        const validIds = fallback.map((p) => p.id);
        const filteredSaved = savedPrograms.filter((id) => validIds.includes(id));
        if (filteredSaved.length !== savedPrograms.length) {
          setSavedPrograms(filteredSaved);
          localStorage.setItem("edulab_saved_programs", JSON.stringify(filteredSaved));
        }
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
      trend: applications.length > 0 ? `${applications.filter((a: any) => a.status === 'started' || a.status === 'pending' || a.status === 'in_review').length} en proceso` : "Sin postulaciones" 
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
                  <span>Guardados ({programs.filter((p) => savedPrograms.includes(p.id)).length})</span>
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

  // View / Edit Program Modal states (Org)
  const [viewingProg, setViewingProg] = useState<any | null>(null);
  const [editingOrgProg, setEditingOrgProg] = useState<any | null>(null);
  const [orgProgEditForm, setOrgProgEditForm] = useState<any>({});
  const [orgProgEditLoading, setOrgProgEditLoading] = useState(false);
  const [orgProgEditError, setOrgProgEditError] = useState<string | null>(null);
  const [editReqProfileFields, setEditReqProfileFields] = useState<string[]>([]);
  const [editReqDocuments, setEditReqDocuments] = useState<string[]>([]);
  const [editCustomQuestions, setEditCustomQuestions] = useState<any[]>([]);
  const [editTempQText, setEditTempQText] = useState("");
  const [editTempQType, setEditTempQType] = useState<"short_text" | "long_text" | "single_choice">("short_text");
  const [editTempQOptions, setEditTempQOptions] = useState("");
  const [editTempQRequired, setEditTempQRequired] = useState(true);

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

  const handleDeleteApplication = async (appId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar permanentemente esta postulación? Esta acción no se puede deshacer.")) return;
    try {
      await axiosClient.delete(`/applications/${appId}`);
      alert("Postulación eliminada con éxito.");
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Error al eliminar la postulación.");
    }
  };

  const handleEditOrgProg = (prog: any) => {
    setOrgProgEditForm({
      title: prog.title || "",
      type: prog.type || "scholarship",
      description: prog.description || "",
      country: prog.country || "",
      deadline: prog.deadline ? prog.deadline.split("T")[0] : "",
      benefits: prog.benefits || "",
      eligibility: prog.eligibility || "",
      slots: prog.slots != null ? String(prog.slots) : "",
    });
    setEditReqProfileFields(prog.required_profile_fields || []);
    setEditReqDocuments(prog.required_documents || []);
    setEditCustomQuestions(prog.custom_questions || []);
    setEditTempQText("");
    setEditTempQOptions("");
    setEditTempQRequired(true);
    setOrgProgEditError(null);
    setEditingOrgProg(prog);
  };

  const handleSaveOrgProg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrgProg) return;
    setOrgProgEditLoading(true);
    setOrgProgEditError(null);
    try {
      await axiosClient.put(`/organizations/me/programs/${editingOrgProg.id}`, {
        title: orgProgEditForm.title,
        type: orgProgEditForm.type,
        description: orgProgEditForm.description,
        country: orgProgEditForm.country,
        deadline: orgProgEditForm.deadline || null,
        benefits: orgProgEditForm.benefits,
        eligibility: orgProgEditForm.eligibility,
        slots: orgProgEditForm.slots ? parseInt(orgProgEditForm.slots) : null,
        required_profile_fields: editReqProfileFields,
        required_documents: editReqDocuments,
        custom_questions: editCustomQuestions,
      });
      setEditingOrgProg(null);
      await loadData();
    } catch (err: any) {
      setOrgProgEditError(err.response?.data?.detail || "Error al actualizar la convocatoria.");
    } finally {
      setOrgProgEditLoading(false);
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
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Estado</th>
                    <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Acciones</th>
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
                      <td className="p-4.5">
                        {p.status === "pending_review" && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-600 uppercase">
                            En revisión
                          </span>
                        )}
                        {p.status === "approved" && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase">
                            Aprobada
                          </span>
                        )}
                        {p.status === "rejected" && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-700 uppercase">
                            Rechazada
                          </span>
                        )}
                        {p.status === "inactive" && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 uppercase">
                            Inactiva
                          </span>
                        )}
                        {!p.status && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 uppercase">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="p-4.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingProg(p)}
                            title="Ver detalles"
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-[#00135B] transition-all border border-transparent hover:border-indigo-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button
                            onClick={() => handleEditOrgProg(p)}
                            title="Editar convocatoria"
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all border border-transparent hover:border-amber-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
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
                      <td className="p-4.5 text-xs font-semibold">
                        {app.status === "started" && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-600 uppercase">
                            Iniciada
                          </span>
                        )}
                        {app.status === "pending" && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-600 uppercase">
                            Pendiente
                          </span>
                        )}
                        {app.status === "in_review" && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#00135B] uppercase">
                            En revisión
                          </span>
                        )}
                        {app.status === "accepted" && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase">
                            Aceptado
                          </span>
                        )}
                        {app.status === "rejected" && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-700 uppercase">
                            Rechazado
                          </span>
                        )}
                        {!["started", "pending", "in_review", "accepted", "rejected"].includes(app.status) && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 uppercase">
                            {app.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4.5 text-sm text-slate-500">
                        {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "Iniciada"}
                      </td>
                      <td className="p-4.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedApplicant(app)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#5D8CE2]/50 hover:bg-slate-50 text-xs font-bold text-[#00135B] transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Perfil</span>
                          </button>
                          <button
                            onClick={() => handleDeleteApplication(app.id)}
                            className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-all cursor-pointer"
                            title="Eliminar Postulación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* VIEW PROGRAM MODAL (Org) */}
      {viewingProg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-scaleUp">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-xl text-[#00135B]">Detalles de la Convocatoria</h3>
                <p className="text-xs text-slate-400 mt-0.5">Información completa de la convocatoria guardada</p>
              </div>
              <button onClick={() => setViewingProg(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-all cursor-pointer">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Título</p>
                  <p className="font-semibold text-slate-700">{viewingProg.title || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Tipo</p>
                  <p className="font-semibold text-slate-700 uppercase">{viewingProg.type || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">País</p>
                  <p className="font-semibold text-slate-700">{viewingProg.country || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Fecha Límite</p>
                  <p className="font-semibold text-slate-700">{viewingProg.deadline || "Abierto"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Cupos</p>
                  <p className="font-semibold text-slate-700">{viewingProg.slots ?? "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Estado</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${viewingProg.status === "approved" ? "bg-emerald-50 text-emerald-700" : viewingProg.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                    {viewingProg.status === "approved" ? "Aprobada" : viewingProg.status === "rejected" ? "Rechazada" : "En Revisión"}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Descripción</p>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{viewingProg.description || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Elegibilidad / Requisitos</p>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{viewingProg.eligibility || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Beneficios</p>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{viewingProg.benefits || "—"}</p>
              </div>
              {viewingProg.required_profile_fields?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Campos de Perfil Requeridos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingProg.required_profile_fields.map((f: string) => (
                      <span key={f} className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#00135B] uppercase">{f}</span>
                    ))}
                  </div>
                </div>
              )}
              {viewingProg.required_documents?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Documentos Requeridos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingProg.required_documents.map((d: string) => (
                      <span key={d} className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 uppercase">{d}</span>
                    ))}
                  </div>
                </div>
              )}
              {viewingProg.custom_questions?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Preguntas Personalizadas</p>
                  {viewingProg.custom_questions.map((q: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-700">{i+1}. {q.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Tipo: {q.type} · {q.required ? "Requerida" : "Opcional"}</p>
                      {q.options?.length > 0 && (
                        <p className="text-[10px] text-slate-500 mt-0.5">Opciones: {q.options.join(", ")}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => { setViewingProg(null); handleEditOrgProg(viewingProg); }} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-50 transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Editar
              </button>
              <button onClick={() => setViewingProg(null)} className="px-4 py-2 rounded-xl bg-[#00135B] text-white text-xs font-bold hover:bg-[#001a7a] transition-all cursor-pointer">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROGRAM MODAL (Org) */}
      {editingOrgProg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-scaleUp">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-xl text-[#00135B]">Editar Convocatoria</h3>
                <p className="text-xs text-amber-500 font-semibold mt-0.5">⚠ Al guardar, la convocatoria volverá a estado "En Revisión" hasta aprobación del admin.</p>
              </div>
              <button onClick={() => setEditingOrgProg(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-all cursor-pointer">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <form onSubmit={handleSaveOrgProg} className="overflow-y-auto p-6 space-y-4 text-sm">
              {orgProgEditError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">{orgProgEditError}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Título *</label>
                  <input value={orgProgEditForm.title || ""} onChange={e => setOrgProgEditForm((f:any) => ({...f, title: e.target.value}))} required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5D8CE2] focus:ring-1 focus:ring-[#5D8CE2]/20 transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Tipo</label>
                  <select value={orgProgEditForm.type || "scholarship"} onChange={e => setOrgProgEditForm((f:any) => ({...f, type: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5D8CE2]">
                    <option value="scholarship">Beca</option>
                    <option value="volunteering">Voluntariado</option>
                    <option value="internship">Pasantía</option>
                    <option value="exchange">Intercambio</option>
                    <option value="research">Investigación</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">País</label>
                  <div className="relative">
                    <select
                      value={orgProgEditForm.country || ""}
                      onChange={e => setOrgProgEditForm((f:any) => ({...f, country: e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5D8CE2] appearance-none cursor-pointer"
                    >
                      <option value="">-- Selecciona --</option>
                      {SPANISH_SPEAKING_COUNTRIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Fecha Límite</label>
                  <input type="date" value={orgProgEditForm.deadline || ""} onChange={e => setOrgProgEditForm((f:any) => ({...f, deadline: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5D8CE2]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Cupos</label>
                  <input type="number" min="1" value={orgProgEditForm.slots || ""} onChange={e => setOrgProgEditForm((f:any) => ({...f, slots: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5D8CE2]" placeholder="Sin límite" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Descripción *</label>
                <textarea rows={4} value={orgProgEditForm.description || ""} onChange={e => setOrgProgEditForm((f:any) => ({...f, description: e.target.value}))} required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5D8CE2] resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Elegibilidad / Requisitos</label>
                <textarea rows={3} value={orgProgEditForm.eligibility || ""} onChange={e => setOrgProgEditForm((f:any) => ({...f, eligibility: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5D8CE2] resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Beneficios</label>
                <textarea rows={3} value={orgProgEditForm.benefits || ""} onChange={e => setOrgProgEditForm((f:any) => ({...f, benefits: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5D8CE2] resize-none" />
              </div>

              {/* Required Profile Fields */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400">Campos de Perfil Requeridos</label>
                <div className="flex flex-wrap gap-2">
                  {["phone","cv","linkedin","portfolio","bio","university","career","semester","gpa","english_level"].map(field => (
                    <label key={field} className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input type="checkbox" checked={editReqProfileFields.includes(field)} onChange={e => {
                        if (e.target.checked) setEditReqProfileFields(p => [...p, field]);
                        else setEditReqProfileFields(p => p.filter(x => x !== field));
                      }} className="rounded" />
                      <span className="font-medium text-slate-600 capitalize">{field}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400">Documentos Requeridos</label>
                <div className="flex flex-wrap gap-2">
                  {["transcript","passport","recommendation_letter","motivation_letter","language_certificate","birth_certificate"].map(doc => (
                    <label key={doc} className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input type="checkbox" checked={editReqDocuments.includes(doc)} onChange={e => {
                        if (e.target.checked) setEditReqDocuments(p => [...p, doc]);
                        else setEditReqDocuments(p => p.filter(x => x !== doc));
                      }} className="rounded" />
                      <span className="font-medium text-slate-600 capitalize">{doc.replace(/_/g, " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Questions */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400">Preguntas Personalizadas</label>
                {editCustomQuestions.map((q: any, i: number) => (
                  <div key={i} className="flex items-start justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 gap-2">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-700">{q.text}</p>
                      <p className="text-[10px] text-slate-400">{q.type} · {q.required ? "Requerida" : "Opcional"}</p>
                    </div>
                    <button type="button" onClick={() => setEditCustomQuestions(p => p.filter((_: any, j: number) => j !== i))} className="text-rose-400 hover:text-rose-600 p-1 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="p-3 border border-dashed border-slate-200 rounded-xl space-y-2">
                  <input value={editTempQText} onChange={e => setEditTempQText(e.target.value)} placeholder="Texto de la pregunta" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#5D8CE2]" />
                  <div className="flex gap-2">
                    <select value={editTempQType} onChange={e => setEditTempQType(e.target.value as any)} className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
                      <option value="short_text">Texto corto</option>
                      <option value="long_text">Texto largo</option>
                      <option value="single_choice">Opción única</option>
                    </select>
                    <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={editTempQRequired} onChange={e => setEditTempQRequired(e.target.checked)} /> Requerida</label>
                    <button type="button" onClick={() => {
                      if (!editTempQText.trim()) return;
                      const newQ: any = { text: editTempQText, type: editTempQType, required: editTempQRequired };
                      if (editTempQType === "single_choice" && editTempQOptions) newQ.options = editTempQOptions.split(",").map((s: string) => s.trim());
                      setEditCustomQuestions(p => [...p, newQ]);
                      setEditTempQText(""); setEditTempQOptions("");
                    }} className="px-3 py-1.5 bg-[#00135B] text-white text-xs font-bold rounded-lg hover:bg-[#001a7a] transition-all cursor-pointer">+ Añadir</button>
                  </div>
                  {editTempQType === "single_choice" && (
                    <input value={editTempQOptions} onChange={e => setEditTempQOptions(e.target.value)} placeholder="Opciones separadas por coma: Opción A, Opción B" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none" />
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 pt-4 border-t border-gray-100 bg-white flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setEditingOrgProg(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-slate-500 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer">Cancelar</button>
                <button type="submit" disabled={orgProgEditLoading} className="px-5 py-2 rounded-xl bg-[#00135B] text-white text-xs font-bold hover:bg-[#001a7a] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60">
                  {orgProgEditLoading ? <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"/> : null}
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
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
                  <div className="relative">
                    <select
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Selecciona el país --</option>
                      {SPANISH_SPEAKING_COUNTRIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
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
                      <option value="started">Iniciada (Borrador)</option>
                      <option value="pending">Pendiente</option>
                      <option value="in_review">En revisión</option>
                      <option value="accepted">Aceptado / Aprobado</option>
                      <option value="rejected">Rechazado</option>
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

function AdminDashboard() {
  const logoutStore = useAuthStore((state) => state.logout);
  
  // Tabs state
  const [mainTab, setMainTab] = useState<"organizations" | "programs" | "applicants">("organizations");
  const [orgStatus, setOrgStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [progStatus, setProgStatus] = useState<"pending_review" | "approved" | "rejected">("pending_review");

  // Data states
  const [orgs, setOrgs] = useState<any[]>([]);
  const [progs, setProgs] = useState<any[]>([]);
  const [adminApplicants, setAdminApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modals state
  const [editingOrg, setEditingOrg] = useState<any | null>(null);
  const [orgEditForm, setOrgEditForm] = useState<any>({});
  
  const [editingProg, setEditingProg] = useState<any | null>(null);
  const [progEditForm, setProgEditForm] = useState<any>({});

  const [adminSelectedApp, setAdminSelectedApp] = useState<any | null>(null);
  const [updatingAppStatus, setUpdatingAppStatus] = useState(false);
  const [appStatusError, setAppStatusError] = useState<string | null>(null);
  const [viewingAdminProg, setViewingAdminProg] = useState<any | null>(null);


  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mainTab === "organizations") {
        const response = await axiosClient.get(`/admin/organizations?status=${orgStatus}`);
        setOrgs(response.data);
      } else if (mainTab === "programs") {
        const response = await axiosClient.get(`/admin/programs?status=${progStatus}`);
        setProgs(response.data);
      } else if (mainTab === "applicants") {
        const response = await axiosClient.get(`/applications/admin`);
        setAdminApplicants(response.data);
      }
    } catch (err: any) {
      console.error("Error loading admin data:", err);
      setError("Error al obtener los registros del panel de administración.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [mainTab, orgStatus, progStatus]);

  // Actions for Organizations
  const handleApproveOrg = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas APROBAR esta organización?")) return;
    try {
      await axiosClient.patch(`/admin/organizations/${id}/approve`);
      alert("Organización aprobada con éxito.");
      await loadData();
    } catch (err) {
      console.error("Error approving organization:", err);
      alert("Error al aprobar la organización.");
    }
  };

  const handleRejectOrg = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas RECHAZAR esta organización?")) return;
    try {
      await axiosClient.patch(`/admin/organizations/${id}/reject`);
      alert("Organización rechazada.");
      await loadData();
    } catch (err) {
      console.error("Error rejecting organization:", err);
      alert("Error al rechazar la organización.");
    }
  };

  // Actions for Programs (Convocatorias)
  const handleApproveProgram = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas APROBAR esta convocatoria?")) return;
    try {
      await axiosClient.patch(`/admin/programs/${id}/approve`);
      alert("Convocatoria aprobada con éxito.");
      await loadData();
    } catch (err) {
      console.error("Error approving program:", err);
      alert("Error al aprobar la convocatoria.");
    }
  };

  const handleRejectProgram = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas RECHAZAR esta convocatoria?")) return;
    try {
      await axiosClient.patch(`/admin/programs/${id}/reject`);
      alert("Convocatoria rechazada.");
      await loadData();
    } catch (err) {
      console.error("Error rejecting program:", err);
      alert("Error al rechazar la convocatoria.");
    }
  };

  // Admin CRUD for Organizations
  const handleEditOrg = (org: any) => {
    setOrgEditForm({ ...org });
    setEditingOrg(org);
  };

  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/admin/organizations/${orgEditForm.id}`, orgEditForm);
      alert("Organización actualizada con éxito.");
      setEditingOrg(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Error al actualizar la organización.");
    }
  };

  const handleDeleteOrg = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas ELIMINAR esta organización y todas sus dependencias (usuarios, convocatorias, postulaciones)? Esta acción es irreversible.")) return;
    try {
      await axiosClient.delete(`/admin/organizations/${id}`);
      alert("Organización eliminada con éxito.");
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Error al eliminar la organización.");
    }
  };

  // Admin CRUD for Convocatorias
  const handleEditProg = (prog: any) => {
    setProgEditForm({ ...prog });
    setEditingProg(prog);
  };

  const handleSaveProg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/admin/programs/${progEditForm.id}`, progEditForm);
      alert("Convocatoria actualizada con éxito.");
      setEditingProg(null);
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Error al actualizar la convocatoria.");
    }
  };

  const handleDeleteProgram = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas ELIMINAR esta convocatoria y todas sus postulaciones asociadas? Esta acción es irreversible.")) return;
    try {
      await axiosClient.delete(`/admin/programs/${id}`);
      alert("Convocatoria eliminada con éxito.");
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Error al eliminar la convocatoria.");
    }
  };

  // Admin CRUD for Applications
  const handleDeleteAdminApplication = async (appId: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar permanentemente esta postulación? Esta acción es irreversible.")) return;
    try {
      await axiosClient.delete(`/applications/${appId}`);
      alert("Postulación eliminada con éxito.");
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Error al eliminar la postulación.");
    }
  };

  const handleUpdateAdminApplicationStatus = async (appId: number, nextStatus: string) => {
    setUpdatingAppStatus(true);
    setAppStatusError(null);
    try {
      await axiosClient.put(`/applications/${appId}`, {
        status: nextStatus
      });
      await loadData();
      
      setAdminSelectedApp((prev: any) => {
        if (!prev) return null;
        const newAudit = {
          id: Date.now(),
          old_status: prev.status,
          new_status: nextStatus,
          changed_by: "admin",
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
      setAppStatusError(err.response?.data?.detail || "Error al actualizar el estado.");
    } finally {
      setUpdatingAppStatus(false);
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
            Revisión, aprobación e historial de solicitudes de organizaciones y convocatorias en EDULAB.
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

      {/* Main Tab Bar (Organizations vs Convocatorias vs Postulantes) */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => {
            setMainTab("organizations");
            setOrgStatus("PENDING");
          }}
          className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            mainTab === "organizations"
              ? "border-[#00135B] text-[#00135B]"
              : "border-transparent text-slate-400 hover:text-slate-655 bg-transparent"
          }`}
        >
          📁 Registro de Organizaciones
        </button>
        <button
          onClick={() => {
            setMainTab("programs");
            setProgStatus("pending_review");
          }}
          className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            mainTab === "programs"
              ? "border-[#00135B] text-[#00135B]"
              : "border-transparent text-slate-400 hover:text-slate-655 bg-transparent"
          }`}
        >
          📝 Convocatorias
        </button>
        <button
          onClick={() => {
            setMainTab("applicants");
          }}
          className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            mainTab === "applicants"
              ? "border-[#00135B] text-[#00135B]"
              : "border-transparent text-slate-400 hover:text-slate-655 bg-transparent"
          }`}
        >
          👥 Control de Postulantes
        </button>
      </div>

      {/* Sub-status Tab Filters */}
      {mainTab === "organizations" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[
                { key: "PENDING", label: "Pendientes" },
                { key: "APPROVED", label: "Aprobadas" },
                { key: "REJECTED", label: "Rechazadas" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setOrgStatus(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    orgStatus === tab.key
                      ? "bg-white text-[#00135B] shadow-sm"
                      : "text-slate-500 hover:text-slate-800 bg-transparent border-none"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl">
              Total en esta pestaña: <span className="text-[#00135B] font-bold">{orgs.length}</span>
            </div>
          </div>

          {/* Organizations List */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <div className="w-10 h-10 border-t-2 border-r-2 border-[#00135B] rounded-full animate-spin"></div>
              </div>
            ) : orgs.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-slate-600">No hay organizaciones en esta categoría</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No se encontraron registros de organizaciones con estado <span className="font-mono text-slate-600">{orgStatus}</span>.
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
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Estado</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orgs.map((org) => (
                      <tr key={org.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-4.5">
                          <div className="flex items-center gap-3">
                            {org.logo_url ? (
                              <img src={org.logo_url} alt="Logo" className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-150 text-[#00135B] flex items-center justify-center font-bold text-xs">
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
                          {org.status === "PENDING" && (
                            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-600 uppercase">
                              Pendiente
                            </span>
                          )}
                          {org.status === "APPROVED" && (
                            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase">
                              Aprobada
                            </span>
                          )}
                          {org.status === "REJECTED" && (
                            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-700 uppercase">
                              Rechazada
                            </span>
                          )}
                        </td>
                        <td className="p-4.5">
                          <div className="flex items-center gap-2">
                            {org.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() => handleApproveOrg(org.id)}
                                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 hover:text-emerald-700 transition-all cursor-pointer"
                                  title="Aprobar Organización"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectOrg(org.id)}
                                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 hover:text-rose-700 transition-all cursor-pointer"
                                  title="Rechazar Organización"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleEditOrg(org)}
                              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-750 transition-all cursor-pointer"
                              title="Editar Organización"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrg(org.id)}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-650 hover:text-rose-700 transition-all cursor-pointer"
                              title="Eliminar Organización"
                            >
                              <Trash2 className="w-4 h-4" />
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
      )}

      {mainTab === "programs" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[
                { key: "pending_review", label: "Pendientes" },
                { key: "approved", label: "Aprobadas" },
                { key: "rejected", label: "Rechazadas" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setProgStatus(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    progStatus === tab.key
                      ? "bg-white text-[#00135B] shadow-sm"
                      : "text-slate-500 hover:text-slate-800 bg-transparent border-none"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl">
              Total en esta pestaña: <span className="text-[#00135B] font-bold">{progs.length}</span>
            </div>
          </div>

          {/* Convocatorias List */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <div className="w-10 h-10 border-t-2 border-r-2 border-[#00135B] rounded-full animate-spin"></div>
              </div>
            ) : progs.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-slate-600">No hay convocatorias en esta categoría</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No se encontraron convocatorias con estado <span className="font-mono text-slate-600">{progStatus}</span>.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200">
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Convocatoria</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Organización</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Tipo</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Ubicación</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Límite</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Cupos</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Estado</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {progs.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-4.5">
                          <p className="text-sm font-bold text-slate-700">{p.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono select-all">{p.slug}</p>
                        </td>
                        <td className="p-4.5 text-sm font-semibold text-[#00135B]">{p.organization_name || p.organization}</td>
                        <td className="p-4.5">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#00135B] uppercase">
                            {p.type}
                          </span>
                        </td>
                        <td className="p-4.5 text-sm text-slate-500">{p.country}</td>
                        <td className="p-4.5 text-sm text-amber-600 font-semibold">{p.deadline || "Abierto"}</td>
                        <td className="p-4.5 text-sm text-slate-600">{p.slots || "N/A"}</td>
                        <td className="p-4.5">
                          {p.status === "pending_review" && (
                            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-600 uppercase">
                              En revisión
                            </span>
                          )}
                          {p.status === "approved" && (
                            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase">
                              Aprobada
                            </span>
                          )}
                          {p.status === "rejected" && (
                            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-700 uppercase">
                              Rechazada
                            </span>
                          )}
                          {p.status === "inactive" && (
                            <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500 uppercase">
                              Inactiva
                            </span>
                          )}
                        </td>
                        <td className="p-4.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewingAdminProg(p)}
                              className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 hover:text-indigo-700 transition-all cursor-pointer"
                              title="Ver Detalles de Convocatoria"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {p.status === "pending_review" && (
                              <>
                                <button
                                  onClick={() => handleApproveProgram(p.id)}
                                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 hover:text-emerald-700 transition-all cursor-pointer"
                                  title="Aprobar Convocatoria"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectProgram(p.id)}
                                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 hover:text-rose-700 transition-all cursor-pointer"
                                  title="Rechazar Convocatoria"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleEditProg(p)}
                              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-750 transition-all cursor-pointer"
                              title="Editar Convocatoria"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProgram(p.id)}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-650 hover:text-rose-700 transition-all cursor-pointer"
                              title="Eliminar Convocatoria"
                            >
                              <Trash2 className="w-4 h-4" />
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
      )}

      {mainTab === "applicants" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl">
              Total de Postulaciones: <span className="text-[#00135B] font-bold">{adminApplicants.length}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <div className="w-10 h-10 border-t-2 border-r-2 border-[#00135B] rounded-full animate-spin"></div>
              </div>
            ) : adminApplicants.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-600">No hay postulaciones registradas</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Las postulaciones de los estudiantes a las distintas convocatorias aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-200">
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Estudiante</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Convocatoria</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Estado</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Fecha</th>
                      <th className="p-4.5 text-xs font-bold text-slate-400 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminApplicants.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-4.5">
                          <p className="text-sm font-bold text-slate-700">{app.student_name}</p>
                          <p className="text-xs text-slate-400">{app.student_email}</p>
                        </td>
                        <td className="p-4.5 text-sm font-semibold text-[#00135B]">
                          {app.program_title}
                        </td>
                        <td className="p-4.5 text-xs font-semibold">
                          {app.status === "started" && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-600 uppercase">
                              Iniciada
                            </span>
                          )}
                          {app.status === "pending" && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-600 uppercase">
                              Pendiente
                            </span>
                          )}
                          {app.status === "in_review" && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#00135B] uppercase">
                              En revisión
                            </span>
                          )}
                          {app.status === "accepted" && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase">
                              Aceptado
                            </span>
                          )}
                          {app.status === "rejected" && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-700 uppercase">
                              Rechazado
                            </span>
                          )}
                        </td>
                        <td className="p-4.5 text-sm text-slate-500">
                          {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "Iniciada"}
                        </td>
                        <td className="p-4.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setAdminSelectedApp(app)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#5D8CE2]/50 hover:bg-slate-50 text-xs font-bold text-[#00135B] transition-all cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Ver Ficha</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAdminApplication(app.id)}
                              className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-all cursor-pointer"
                              title="Eliminar Postulación"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* EDIT ORGANIZATION MODAL */}
      {editingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between text-left">
              <h3 className="font-display font-extrabold text-xl text-[#00135B]">
                Editar Organización
              </h3>
              <button 
                onClick={() => setEditingOrg(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all cursor-pointer border-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveOrg} className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Nombre de la Organización *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgEditForm.name || ""}
                    onChange={(e) => setOrgEditForm({ ...orgEditForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Tipo de Organización *
                  </label>
                  <select
                    value={orgEditForm.type || ""}
                    onChange={(e) => setOrgEditForm({ ...orgEditForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all bg-white"
                  >
                    <option value="ONG">ONG</option>
                    <option value="Universidad">Universidad</option>
                    <option value="Fundación">Fundación</option>
                    <option value="Empresa">Empresa</option>
                    <option value="Organismo Internacional">Organismo Internacional</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    País *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={orgEditForm.country || ""}
                      onChange={(e) => setOrgEditForm({ ...orgEditForm, country: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Selecciona el país --</option>
                      {SPANISH_SPEAKING_COUNTRIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgEditForm.city || ""}
                    onChange={(e) => setOrgEditForm({ ...orgEditForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    value={orgEditForm.website || ""}
                    onChange={(e) => setOrgEditForm({ ...orgEditForm, website: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Estado de Aprobación *
                  </label>
                  <select
                    value={orgEditForm.status || ""}
                    onChange={(e) => setOrgEditForm({ ...orgEditForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all bg-white"
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="APPROVED">Aprobada</option>
                    <option value="REJECTED">Rechazada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                  Descripción
                </label>
                <textarea
                  value={orgEditForm.description || ""}
                  onChange={(e) => setOrgEditForm({ ...orgEditForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all resize-none"
                />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-xs text-[#00135B] uppercase tracking-wider mb-3">Datos del Contacto / Responsable</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                      Nombre del Contacto *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgEditForm.contact_name || ""}
                      onChange={(e) => setOrgEditForm({ ...orgEditForm, contact_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                      Email del Contacto *
                    </label>
                    <input
                      type="email"
                      required
                      value={orgEditForm.contact_email || ""}
                      onChange={(e) => setOrgEditForm({ ...orgEditForm, contact_email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                      Cargo del Contacto *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgEditForm.contact_position || ""}
                      onChange={(e) => setOrgEditForm({ ...orgEditForm, contact_position: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                      Teléfono del Contacto *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgEditForm.contact_phone || ""}
                      onChange={(e) => setOrgEditForm({ ...orgEditForm, contact_phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOrg(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW CONVOCATORIA MODAL (Admin) */}
      {viewingAdminProg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-scaleUp">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-xl text-[#00135B]">Detalles de la Convocatoria</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enviada por: <span className="font-semibold text-[#00135B]">{viewingAdminProg.organization_name || viewingAdminProg.organization || "—"}</span>
                </p>
              </div>
              <button onClick={() => setViewingAdminProg(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-all cursor-pointer">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Título</p>
                  <p className="font-semibold text-slate-700">{viewingAdminProg.title || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Tipo</p>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#00135B] uppercase">{viewingAdminProg.type || "—"}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">País</p>
                  <p className="font-semibold text-slate-700">{viewingAdminProg.country || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Fecha Límite</p>
                  <p className="font-semibold text-amber-600">{viewingAdminProg.deadline || "Abierto"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Cupos</p>
                  <p className="font-semibold text-slate-700">{viewingAdminProg.slots ?? "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Estado</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${viewingAdminProg.status === "approved" ? "bg-emerald-50 text-emerald-700" : viewingAdminProg.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                    {viewingAdminProg.status === "approved" ? "Aprobada" : viewingAdminProg.status === "rejected" ? "Rechazada" : "En Revisión"}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Descripción</p>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-100">{viewingAdminProg.description || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Elegibilidad / Requisitos</p>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{viewingAdminProg.eligibility || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Beneficios</p>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{viewingAdminProg.benefits || "—"}</p>
              </div>
              {viewingAdminProg.required_profile_fields?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Campos de Perfil Requeridos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingAdminProg.required_profile_fields.map((f: string) => (
                      <span key={f} className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#00135B] uppercase">{f}</span>
                    ))}
                  </div>
                </div>
              )}
              {viewingAdminProg.required_documents?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Documentos Requeridos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingAdminProg.required_documents.map((d: string) => (
                      <span key={d} className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 uppercase">{d}</span>
                    ))}
                  </div>
                </div>
              )}
              {viewingAdminProg.custom_questions?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Preguntas Personalizadas ({viewingAdminProg.custom_questions.length})</p>
                  {viewingAdminProg.custom_questions.map((q: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-700">{i+1}. {q.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Tipo: {q.type} · {q.required ? "Requerida" : "Opcional"}</p>
                      {q.options?.length > 0 && (
                        <p className="text-[10px] text-slate-500 mt-0.5">Opciones: {q.options.join(", ")}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              {viewingAdminProg.status === "pending_review" && (
                <>
                  <button onClick={() => { handleApproveProgram(viewingAdminProg.id); setViewingAdminProg(null); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer">
                    <Check className="w-3.5 h-3.5" /> Aprobar
                  </button>
                  <button onClick={() => { handleRejectProgram(viewingAdminProg.id); setViewingAdminProg(null); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer">
                    <X className="w-3.5 h-3.5" /> Rechazar
                  </button>
                </>
              )}
              <button onClick={() => setViewingAdminProg(null)} className="px-4 py-2 rounded-xl bg-[#00135B] text-white text-xs font-bold hover:bg-[#001a7a] transition-all cursor-pointer">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROGRAM/CONVOCATORIA MODAL */}
      {editingProg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between text-left">
              <h3 className="font-display font-extrabold text-xl text-[#00135B]">
                Editar Convocatoria
              </h3>
              <button 
                onClick={() => setEditingProg(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all cursor-pointer border-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProg} className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
              <div className="relative">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                  Título de la Convocatoria *
                </label>
                <input
                  type="text"
                  required
                  value={progEditForm.title || ""}
                  onChange={(e) => setProgEditForm({ ...progEditForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Tipo de Convocatoria *
                  </label>
                  <select
                    value={progEditForm.type || ""}
                    onChange={(e) => setProgEditForm({ ...progEditForm, type: e.target.value })}
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
                  <div className="relative">
                    <select
                      value={progEditForm.country || ""}
                      onChange={(e) => setProgEditForm({ ...progEditForm, country: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Selecciona --</option>
                      {SPANISH_SPEAKING_COUNTRIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Fecha Límite
                  </label>
                  <input
                    type="date"
                    value={progEditForm.deadline || ""}
                    onChange={(e) => setProgEditForm({ ...progEditForm, deadline: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Cupos Disponibles
                  </label>
                  <input
                    type="number"
                    value={progEditForm.slots !== undefined && progEditForm.slots !== null ? progEditForm.slots : ""}
                    onChange={(e) => setProgEditForm({ ...progEditForm, slots: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                    Estado de Aprobación *
                  </label>
                  <select
                    value={progEditForm.status || ""}
                    onChange={(e) => setProgEditForm({ ...progEditForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all bg-white"
                  >
                    <option value="pending_review">En revisión</option>
                    <option value="approved">Aprobada</option>
                    <option value="rejected">Rechazada</option>
                    <option value="inactive">Inactiva</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                  Descripción Detallada *
                </label>
                <textarea
                  required
                  value={progEditForm.description || ""}
                  onChange={(e) => setProgEditForm({ ...progEditForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                  Elegibilidad / Requisitos
                </label>
                <textarea
                  value={progEditForm.eligibility || ""}
                  onChange={(e) => setProgEditForm({ ...progEditForm, eligibility: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 block">
                  Beneficios Ofrecidos
                </label>
                <textarea
                  value={progEditForm.benefits || ""}
                  onChange={(e) => setProgEditForm({ ...progEditForm, benefits: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProg(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN SELECTED APPLICANT DETAIL MODAL */}
      {adminSelectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between text-left">
              <div>
                <h3 className="font-display font-extrabold text-xl text-[#00135B]">
                  Ficha de Postulación (Admin)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Postulado a: <span className="font-semibold text-[#00135B]">{adminSelectedApp.program_title}</span>
                </p>
              </div>
              <button 
                onClick={() => setAdminSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-805 transition-all cursor-pointer border-none"
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
                    {adminSelectedApp.student_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#00135B]">{adminSelectedApp.student_name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{adminSelectedApp.student_email}</p>
                  </div>
                </div>

                {/* Status Dropdown selector */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Estado Postulación</span>
                  <div className="flex items-center gap-2">
                    {updatingAppStatus && <div className="w-4 h-4 border-2 border-[#00135B] border-t-transparent rounded-full animate-spin"></div>}
                    <select
                      value={adminSelectedApp.status}
                      disabled={updatingAppStatus}
                      onChange={(e) => handleUpdateAdminApplicationStatus(adminSelectedApp.id, e.target.value)}
                      className="bg-white border border-gray-250 text-[#00135B] rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#5D8CE2] cursor-pointer"
                    >
                      <option value="started">Iniciada (Borrador)</option>
                      <option value="pending">Pendiente</option>
                      <option value="in_review">En revisión</option>
                      <option value="accepted">Aceptado / Aprobado</option>
                      <option value="rejected">Rechazado</option>
                    </select>
                  </div>
                  {appStatusError && <span className="text-[10px] text-rose-500 font-bold">{appStatusError}</span>}
                </div>
              </div>

              {/* Grid 1: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-gray-150 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Ubicación</span>
                  <span className="text-slate-800 font-semibold">{adminSelectedApp.student_city}, {adminSelectedApp.student_country}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Teléfono</span>
                  <span className="text-slate-800 font-semibold">{adminSelectedApp.student_phone || "No provisto"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Fecha de Nacimiento</span>
                  <span className="text-slate-800 font-semibold">{adminSelectedApp.student_birth_date || "No provisto"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Nivel de Educación</span>
                  <span className="text-slate-800 font-semibold">{adminSelectedApp.student_education_level}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Institución</span>
                  <span className="text-slate-800 font-semibold">{adminSelectedApp.student_current_institution || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Carrera / Área</span>
                  <span className="text-slate-800 font-semibold">{adminSelectedApp.student_area || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Nivel de Inglés</span>
                  <span className="text-slate-800 font-semibold">{adminSelectedApp.student_english_level || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Graduación Estimada</span>
                  <span className="text-slate-800 font-semibold">{adminSelectedApp.student_expected_graduation_date || "N/A"}</span>
                </div>
                {adminSelectedApp.student_other_languages && adminSelectedApp.student_other_languages.length > 0 && (
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[9px] tracking-wider">Otros Idiomas</span>
                    <span className="text-slate-800 font-semibold">{adminSelectedApp.student_other_languages.join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Links and Bio */}
              <div className="space-y-3">
                {adminSelectedApp.student_bio && (
                  <div>
                    <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Biografía</h5>
                    <p className="text-xs text-slate-650 leading-relaxed mt-1 bg-slate-50/50 p-3 rounded-xl border border-gray-150">
                      {adminSelectedApp.student_bio}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {adminSelectedApp.student_cv_url && (
                    <a
                      href={adminSelectedApp.student_cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-xs font-bold text-emerald-700 transition-all"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Ver Currículum Vitae (CV)</span>
                    </a>
                  )}
                  {adminSelectedApp.student_linkedin_url && (
                    <a
                      href={adminSelectedApp.student_linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 transition-all"
                    >
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {adminSelectedApp.student_portfolio_url && (
                    <a
                      href={adminSelectedApp.student_portfolio_url}
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
                  {adminSelectedApp.student_work_experience && adminSelectedApp.student_work_experience.length > 0 ? (
                    <div className="space-y-2">
                      {adminSelectedApp.student_work_experience.map((work: any, idx: number) => (
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
                  {adminSelectedApp.student_volunteer_experience && adminSelectedApp.student_volunteer_experience.length > 0 ? (
                    <div className="space-y-2">
                      {adminSelectedApp.student_volunteer_experience.map((vol: any, idx: number) => (
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
              {adminSelectedApp.student_general_motivation_letter && (
                <div className="border-t border-gray-100 pt-4">
                  <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Carta de Motivación General</h5>
                  <p className="text-xs text-slate-655 leading-relaxed bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100 whitespace-pre-line">
                    {adminSelectedApp.student_general_motivation_letter}
                  </p>
                </div>
              )}

              {/* Custom Answers */}
              {adminSelectedApp.answers && adminSelectedApp.answers.length > 0 && (
                <div className="border-t border-gray-100 pt-4 text-xs space-y-3">
                  <h5 className="font-bold text-[#00135B] uppercase tracking-wider text-[10px]">Respuestas al Cuestionario</h5>
                  <div className="space-y-3">
                    {adminSelectedApp.answers.map((ans: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-gray-150">
                        <p className="font-bold text-slate-800">Pregunta ID: {ans.question_id}</p>
                        <p className="text-slate-655 mt-1 bg-white p-2.5 rounded-lg border border-gray-100">{ans.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Documents */}
              {adminSelectedApp.uploaded_documents && Object.keys(adminSelectedApp.uploaded_documents).length > 0 && (
                <div className="border-t border-gray-100 pt-4 text-xs space-y-3">
                  <h5 className="font-bold text-[#00135B] uppercase tracking-wider text-[10px]">Documentos Específicos Subidos</h5>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(adminSelectedApp.uploaded_documents).map(([docName, docUrl]: any) => (
                      <a
                        key={docName}
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-gray-250 font-semibold text-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-505" />
                        <span>{docName} &rarr;</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Chronological Status History Audit Trail */}
              {adminSelectedApp.status_history && adminSelectedApp.status_history.length > 0 && (
                <div className="border-t border-gray-100 pt-4 text-xs space-y-3">
                  <h5 className="font-bold text-[#00135B] uppercase tracking-wider text-[10px]">Historial de Cambios de Estado (Auditoría)</h5>
                  <div className="space-y-2 border-l-2 border-slate-200 pl-4 py-1 ml-2 text-left">
                    {adminSelectedApp.status_history.map((h: any, idx: number) => (
                      <div key={idx} className="relative space-y-0.5">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                        <p className="font-semibold text-slate-700">
                          {h.old_status || "None"} &rarr; <span className="font-extrabold text-[#5D8CE2]">{h.new_status}</span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Por ID de usuario: <span className="font-medium">{h.changed_by}</span> | {new Date(h.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setAdminSelectedApp(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-655 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
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
