import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  X
} from "lucide-react";
import axiosClient from "../../services/api/axiosClient";
import { useAuthStore } from "../../store/useAuthStore";
import { getMyProfile, canApply } from "../../services/profileService";
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
  compatibility?: number; // Added locally for matching demo
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
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [postulationSuccess, setPostulationSuccess] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logoutStore();
      navigate("/");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  // Load programs data
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await axiosClient.get("/programs/");
        const enriched = response.data.map((item: any, idx: number) => ({
          ...item,
          compatibility: idx === 0 ? 94 : idx === 1 ? 81 : 74
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
            compatibility: 95
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
            compatibility: 83
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
            compatibility: 76
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
    // Wait for auth to complete before fetching profile
    if (authLoading || !isAuthenticated || !token) return;

    async function loadProfile() {
      try {
        const profileData = await getMyProfile();
        setProfile(profileData);

        // Redirect checks: Only for students, bypass for admins/mentors
        if (user?.role === "student" && !profileData) {
          const skipped = sessionStorage.getItem("skipped_onboarding") === "true";
          if (!skipped) {
            navigate("/onboarding");
          }
        }
      } catch (err: any) {
        console.error("Failed to load student profile:", err);
        // Do not redirect to onboarding on 401 Unauthorized errors
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

  // Handle opportunity apply click
  const handleApplyClick = (programTitle: string) => {
    if (!canApply(profile)) {
      setShowIncompleteModal(true);
    } else {
      setPostulationSuccess(`¡Tu postulación para el programa "${programTitle}" ha sido registrada con éxito!`);
      setTimeout(() => setPostulationSuccess(null), 5000);
    }
  };

  const stats = [
    { title: "Compatibilidad Promedio", value: "84%", icon: Sparkles, color: "text-accent", trend: "+4% esta semana" },
    { title: "Postulaciones Activas", value: "3", icon: TrendingUp, color: "text-secondary", trend: "2 en revisión" },
    { title: "Documentos Verificados", value: "4", icon: FileText, color: "text-emerald-400", trend: "CV optimizado" },
  ];

  // Determine if we should show the dashboard warning card (< 30% completion)
  const showWarningCard = user?.role === "student" && (!profile || profile.profile_completion < 30);
  const completionPct = profile ? profile.profile_completion : 0;

  return (
    <div className="space-y-8 animate-fadeIn text-white relative">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent leading-none pb-1">
            ¡Hola, {user?.email.split("@")[0]}!
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">
            Bienvenido a tu centro inteligente de postulaciones internacionales.
          </p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-glass-border">
          <Calendar className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-gray-300">Convocatorias Abiertas: Q2-2026</span>
        </div>
      </div>

      {/* Dynamic Profile Warning Card */}
      {showWarningCard && (
        <div className="glass-panel p-5 rounded-2xl border border-[#F5C542]/30 bg-[#F5C542]/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg shadow-[#F5C542]/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5C542]/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-300"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542]">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F5C542] flex items-center gap-1.5">
                Completa tu perfil académico ({completionPct}%)
              </h4>
              <p className="text-xs text-gray-400 mt-0.5 max-w-xl">
                Tus posibilidades de emparejamiento con becas y voluntariados internacionales aumentan exponencialmente con un perfil completo al 100%.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="bg-[#F5C542] hover:bg-[#F5C542]/90 text-primary-dark font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#F5C542]/15 hover:scale-[1.01]"
          >
            Completar ahora
          </button>
        </div>
      )}

      {/* Postulation Success Alert */}
      {postulationSuccess && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 p-4 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 fill-current" />
          <span className="font-semibold">{postulationSuccess}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-glass-border flex items-center justify-between bg-[#00135B]/10">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-extrabold font-display">{stat.value}</p>
                <p className="text-[10px] text-gray-400 font-semibold">{stat.trend}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-glass-border">
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Left (Programs list) vs Right (AI Panel stub) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Programs List) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" />
              <span>Programas Recomendados</span>
            </h2>
            <span className="text-xs text-secondary hover:underline font-semibold cursor-pointer">Ver todos</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl border border-glass-border animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {programs.map((prog) => (
                <div 
                  key={prog.id}
                  className="glass-panel p-6 rounded-2xl border border-glass-border flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-secondary/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25 uppercase font-semibold">
                        {prog.type}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-glass-border uppercase font-semibold">
                        {prog.country}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-white font-display leading-snug">{prog.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{prog.description}</p>
                    <div className="pt-2 text-xs text-gray-500 font-medium">
                      Organiza: <span className="text-gray-300 font-semibold">{prog.organization}</span> | Límite: <span className="text-accent font-semibold">{prog.deadline}</span>
                    </div>
                  </div>

                  {/* Compatibility Circle */}
                  <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 pl-4 border-l max-md:border-l-0 max-md:border-t max-md:pt-4 border-glass-border w-full md:w-36">
                    <div className="text-center">
                      <div className="relative w-14 h-14 rounded-full border border-glass-border bg-white/5 flex items-center justify-center shadow-inner mx-auto mb-1">
                        <span className="text-sm font-bold text-accent font-display">{prog.compatibility}%</span>
                        <div className="absolute inset-0.5 rounded-full border-2 border-dashed border-secondary/35 animate-spin-slow"></div>
                      </div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Ajuste de IA</span>
                    </div>
                    
                    <button 
                      onClick={() => handleApplyClick(prog.title)}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-secondary/15 border border-glass-border hover:border-secondary/30 text-xs font-semibold text-gray-300 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (AI Suite Stubs & Profile Details) */}
        <div className="space-y-6">
          {/* Active Firebase Session Details */}
          {user && (
            <div className="glass-panel p-6 rounded-3xl border border-glass-border bg-gradient-to-tr from-[#00135B]/10 to-transparent space-y-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                👤 Tu Sesión Activa (Firebase)
              </h3>
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    className="w-12 h-12 rounded-full border-2 border-secondary object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center font-bold text-base text-primary-dark">
                    {(user.displayName || user.email).substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">
                    {user.displayName || user.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="pt-2 space-y-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-500 font-medium">UID de Firebase:</span>
                  <span className="text-gray-300 font-mono select-all bg-white/5 px-2 py-0.5 rounded border border-glass-border max-w-[150px] truncate">
                    {user.uid || user.id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-500 font-medium">Rol Asignado:</span>
                  <span className="text-accent font-semibold uppercase">{user.role}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-500/40 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}

          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <Cpu className="w-5 h-5 text-accent" />
            <span>Asistente Copiloto IA</span>
          </h2>

          <div className="glass-panel p-6 rounded-3xl border border-glass-border bg-gradient-to-br from-primary-dark/40 to-transparent space-y-6">
            
            {/* AI Review CV Card */}
            <div className="space-y-3.5 p-4 bg-white/5 rounded-2xl border border-glass-border">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white">Análisis de CV</h3>
                  <p className="text-xs text-gray-400">Verifica alineación de palabras clave.</p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                  Listo
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="font-medium">Curriculum optimizado al 88%</span>
              </div>
              <button className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-glass-border hover:border-glass-border-glow text-xs font-semibold transition-all duration-200 cursor-pointer">
                Re-analizar CV
              </button>
            </div>

            {/* AI Letter Generator Card */}
            <div className="space-y-3.5 p-4 bg-white/5 rounded-2xl border border-glass-border">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white">Carta de Motivación</h3>
                <p className="text-xs text-gray-400">Genera borradores persuasivos en base al programa.</p>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-secondary/15 hover:bg-secondary/25 border border-secondary/35 text-xs font-semibold text-secondary hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
                <span>Redactar con IA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* AI Interviews Card */}
            <div className="space-y-3.5 p-4 bg-white/5 rounded-2xl border border-glass-border">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white">Simulador de Entrevistas</h3>
                <p className="text-xs text-gray-400">Practica preguntas de liderazgo y académicas.</p>
              </div>
              <button className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-glass-border hover:border-glass-border-glow text-xs font-semibold transition-all duration-200 cursor-pointer">
                Iniciar Simulación
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* STUNNING GLASSMORPHIC VALIDATION MODAL */}
      {showIncompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010414]/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-glass-border bg-[#00135B]/30 backdrop-blur-xl shadow-2xl relative space-y-6">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowIncompleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Alert Header */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#F5C542] mx-auto shadow-lg shadow-[#F5C542]/5">
                <AlertTriangle className="w-7 h-7" />
              </div>
              
              <h3 className="font-display font-extrabold text-xl text-white">
                Perfil Incompleto
              </h3>
              
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                Para postular a esta oportunidad internacional debes completar tu perfil académico estratégico al 100%. ¡Solo te tomará un par de minutos!
              </p>
            </div>

            {/* Visual Indicator of Completion */}
            <div className="bg-[#00135B]/30 rounded-2xl p-4 border border-glass-border space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Progreso actual:</span>
                <span className="text-[#F5C542]">{completionPct}%</span>
              </div>
              <div className="w-full bg-[#00135B]/20 rounded-full h-1.5 overflow-hidden border border-glass-border">
                <div 
                  className="bg-gradient-to-r from-[#5D8CE2] to-[#F5C542] h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>

            {/* Actions Button Group */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setShowIncompleteModal(false);
                  navigate("/profile");
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#5D8CE2] to-[#F5C542] hover:from-[#5D8CE2]/90 hover:to-[#F5C542]/90 text-primary-dark font-extrabold text-xs tracking-wider transition-all duration-200 cursor-pointer active:scale-95 text-center"
              >
                Completar perfil
              </button>
              
              <button
                onClick={() => setShowIncompleteModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-glass-border text-xs font-bold text-gray-400 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

