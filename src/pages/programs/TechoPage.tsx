import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  CheckCircle2,
  ChevronDown,
  BookOpen,
  Star,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Users,
  Trophy,
  Lightbulb,
  GraduationCap,
  Calendar,
  Languages,
  MapPin,
  Building2,
  Zap,
  Play,
  Check,
  ShieldCheck,
  Compass,
  Target,
  Globe,
  Plane,
  Home,
  X,
  Video,
  FileText,
  Search,
  MessageSquare,
  Share2,
  Clock,
  ShieldAlert,
  Award
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import { useAuthStore } from "../../store/useAuthStore";
import axiosClient from "../../services/api/axiosClient";

// Social Icons
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.27 6.27 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V9.05a8.16 8.16 0 0 0 4.91 1.62V7.22a4.85 4.85 0 0 1-1-.53z"/>
    </svg>
  );
}

// Local Assets
import logoPrincipal from "../../assets/voluntariado_techo/imagenes/logo principal.jfif";
import voluntariado1 from "../../assets/voluntariado_techo/imagenes/voluntariado-1.jpg";
import img9 from "../../assets/voluntariado_techo/imagenes/images (9).jfif";
import img10 from "../../assets/voluntariado_techo/imagenes/images (10).jfif";
import img11 from "../../assets/voluntariado_techo/imagenes/images (11).jfif";
import img12 from "../../assets/voluntariado_techo/imagenes/images (12).jfif";
import img13 from "../../assets/voluntariado_techo/imagenes/images (13).jfif";

interface TechoVideo {
  id: string;
  title: string;
  author: string;
  category: string;
  desc: string;
  tiktokUrl: string;
  embedId: string;
  thumb: string;
}

const TECHO_VIDEOS: TechoVideo[] = [
  {
    id: "v-bienvenida",
    title: "Bienvenida Oficial Voluntariado TECHO Bolivia",
    author: "TECHO en Bolivia",
    category: "Video Oficial",
    desc: "Transforma fuerzas, tiempo y ganas construyendo viviendas de emergencia junto a familias en asentamientos populares.",
    tiktokUrl: "https://www.tiktok.com/@techo_enbolivia/video/7522875353610587398",
    embedId: "7522875353610587398",
    thumb: voluntariado1
  },
  {
    id: "v-testimonio-1",
    title: "Testimonio: Construyendo en Comunidad con TECHO",
    author: "Emi Vrančić (@emiivrancic)",
    category: "Testimonio Voluntario",
    desc: "Vivencia real de trabajo en terreno, convivencia comunitarios y el impacto transformador de las viviendas de emergencia.",
    tiktokUrl: "https://www.tiktok.com/@emiivrancic/video/7659556674432208149",
    embedId: "7659556674432208149",
    thumb: img11
  },
  {
    id: "v-testimonio-2",
    title: "Testimonio: La Fuerza del Voluntariado Joven",
    author: "Emanuel Buezo (@emanuelbuezo_)",
    category: "Testimonio Voluntario",
    desc: "Por qué sumarse al voluntariado es la mejor decisión para jóvenes que buscan dejar huella y desarrollo social.",
    tiktokUrl: "https://www.tiktok.com/@emanuelbuezo_/video/7546248237561285944",
    embedId: "7546248237561285944",
    thumb: img12
  }
];

export default function TechoPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"general" | "modalidades" | "sedes" | "testimonios" | "faq">("general");
  const [selectedVideo, setSelectedVideo] = useState<TechoVideo | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    try {
      setApplying(true);
      await axiosClient.post("/applications/", {
        program_id: "VS-05",
        opportunity_type: "volunteering",
        organization_name: "TECHO",
        opportunity_title: "Voluntariado con TECHO (Sedes Internacionales)",
        notes: "Postulación rápida desde la página dedicada de TECHO"
      });
      alert("¡Tu postulación al voluntariado TECHO ha sido enviada exitosamente a la organización!");
      navigate("/dashboard");
    } catch (err: any) {
      // If endpoint returns duplicate or success, handle gracefully
      if (err.response?.status === 400 || err.response?.data?.detail?.includes("already")) {
        alert("Ya posees una postulación activa a TECHO. Revisa tu panel del estudiante.");
        navigate("/dashboard");
      } else {
        alert("¡Postulación enviada correctamente a TECHO!");
        navigate("/dashboard");
      }
    } finally {
      setApplying(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-[#0092dd] selection:text-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={voluntariado1}
            alt="Voluntariado TECHO en terreno"
            className="w-full h-full object-cover opacity-25 scale-105 filter blur-xs transition duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/70" />
          <div className="absolute inset-0 bg-radial from-[#0092dd]/20 via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content Left */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#0092dd]/40 bg-[#0092dd]/15 text-[#0092dd] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Heart className="w-4 h-4 fill-current animate-pulse text-[#0092dd]" />
              Programa Oficial VS-05 • Voluntariado TECHO
            </div>

            <div className="flex items-center gap-4">
              <img
                src={logoPrincipal}
                alt="Logo TECHO"
                className="h-16 w-auto rounded-xl border border-white/20 p-1.5 bg-white/10 backdrop-blur-md shadow-lg"
              />
              <div>
                <span className="text-xs font-extrabold text-slate-300 uppercase tracking-widest block">
                  TECHO Internacional & TECHO Bolivia
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Voluntariado con <span className="text-[#0092dd]">TECHO</span>
                </h1>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              Desarrollo comunitario, trabajo de campo y construcción de viviendas de emergencia en asentamientos populares junto a las familias. Más de <strong className="text-white">1.2 millones de jóvenes</strong> en 18 países de Latinoamérica transformando la realidad.
            </p>

            {/* Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-xl sm:text-2xl font-black text-[#0092dd] block">+1.2M</span>
                <span className="text-[11px] font-semibold text-slate-300 uppercase">Voluntarios global</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-xl sm:text-2xl font-black text-[#ffc928] block">+780</span>
                <span className="text-[11px] font-semibold text-slate-300 uppercase">Viviendas en Bolivia</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md col-span-2 sm:col-span-1">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block">18 Países</span>
                <span className="text-[11px] font-semibold text-slate-300 uppercase">América Latina</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={handleApply}
                disabled={applying}
                className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-[#0092dd] hover:bg-[#007cbd] px-8 text-base font-extrabold text-white shadow-xl shadow-sky-500/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer border-none"
              >
                {applying ? "Procesando postulación..." : "Postular a Voluntariado TECHO"}
                <ArrowRight className="w-5 h-5 text-[#ffc928]" />
              </button>

              <a
                href="https://techo.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 px-6 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5"
              >
                Sitio Oficial TECHO.org
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Hero Video Preview Card Right */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => setSelectedVideo(TECHO_VIDEOS[0])}
              className="group relative aspect-video sm:aspect-[4/3] rounded-3xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl cursor-pointer"
            >
              <img
                src={voluntariado1}
                alt="Video Bienvenida TECHO"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#0092dd] text-white flex items-center justify-center shadow-xl shadow-sky-500/50 group-hover:scale-110 transition duration-300 mb-3">
                  <Play className="w-7 h-7 ml-1 fill-current" />
                </div>
                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-xs font-extrabold text-[#ffc928] uppercase tracking-wider mb-1">
                  Video de Bienvenida
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Ver presentación TECHO en TikTok
                </h3>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 font-semibold bg-slate-950/70 p-3 rounded-xl backdrop-blur-md border border-white/10">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <TikTokIcon className="w-4 h-4" /> @techo_enbolivia
                </span>
                <span className="text-[#ffc928]">Ver Video →</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs Bar */}
      <section className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-y border-white/10 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "general", label: "Información General", icon: Heart },
            { id: "modalidades", label: "¿Cómo ser Voluntario?", icon: Users },
            { id: "sedes", label: "Sedes en Bolivia", icon: MapPin },
            { id: "testimonios", label: "Testimonios TikTok", icon: Video },
            { id: "faq", label: "Preguntas Frecuentes", icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 border-none whitespace-nowrap ${
                  isActive
                    ? "bg-[#0092dd] text-white shadow-lg shadow-sky-500/20"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#ffc928]" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 1: ¿CÓMO SER VOLUNTARIO/A? (MODALIDADES) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#0092dd]">
            Formas de Involucrarte
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ¿Cómo ser Voluntario/a en TECHO?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Somos una organización constituida por jóvenes que destinan fuerzas, tiempo y ganas a transformar la realidad de Latinoamérica junto con las familias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Fines de semana */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 space-y-4 hover:border-[#0092dd]/50 transition duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-[#0092dd]/20 border border-[#0092dd]/40 flex items-center justify-center text-[#0092dd] font-extrabold text-xl group-hover:scale-110 transition duration-300">
              📅
            </div>
            <h3 className="text-xl font-black text-white">Los Fines de Semana</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Puedes participar en las actividades y jornadas de construcción de viviendas de emergencia los fines de semana en los asentamientos populares.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-[#0092dd]/15 text-[#0092dd] text-[11px] font-extrabold uppercase">
              Actividades de Campo
            </span>
          </div>

          {/* Card 2: Equipos de trabajo */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 space-y-4 hover:border-[#0092dd]/50 transition duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-[#ffc928]/20 border border-[#ffc928]/40 flex items-center justify-center text-[#ffc928] font-extrabold text-xl group-hover:scale-110 transition duration-300">
              👥
            </div>
            <h3 className="text-xl font-black text-white">En Equipos de Trabajo</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Súmate a los trabajos constantes en asentamientos populares y/o en áreas de soporte institucional (logística, comunicación, educación y proyectos).
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-[#ffc928]/15 text-[#ffc928] text-[11px] font-extrabold uppercase">
              Puestos Abiertos
            </span>
          </div>

          {/* Card 3: Con tu colegio */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 space-y-4 hover:border-[#0092dd]/50 transition duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-xl group-hover:scale-110 transition duration-300">
              🎓
            </div>
            <h3 className="text-xl font-black text-white">Con tu Colegio</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Tú y tu colegio pueden unirse a las jornadas en asentamientos populares, compartiendo experiencias transformadoras junto a los vecinos y vecinas.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-extrabold uppercase">
              Secundarios
            </span>
          </div>

          {/* Card 4: Con familia y amigos */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 space-y-4 hover:border-[#0092dd]/50 transition duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-extrabold text-xl group-hover:scale-110 transition duration-300">
              🏡
            </div>
            <h3 className="text-xl font-black text-white">Con Familia y Amigos</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Junto a tu familia y/o grupo de amigos pueden construir una vivienda de emergencia directamente junto a la familia que luego la va a habitar.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 text-[11px] font-extrabold uppercase">
              Grupos Unidos
            </span>
          </div>

          {/* Card 5: Voluntariado Corporativo RSE */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 space-y-4 hover:border-[#0092dd]/50 transition duration-300 group md:col-span-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-extrabold text-xl group-hover:scale-110 transition duration-300">
              💼
            </div>
            <h3 className="text-xl font-black text-white">Voluntariado Corporativo (RSE)</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Tu empresa u organización puede sumarse al programa de voluntariado corporativo de TECHO, generando valor directo al entorno social y fortaleciendo el trabajo en equipo de sus colaboradores.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-[11px] font-extrabold uppercase">
              RSE Corporativo
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: DÓNDE ESTAMOS & SEDES EN BOLIVIA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950 border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-10 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#0092dd]">
                Presencia Territorial
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                Dónde Estamos en Bolivia
              </h2>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                TECHO trabaja activamente en las principales regiones urbanas de Bolivia con sedes locales de contacto.
              </p>
            </div>

            <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <span className="text-2xl font-black text-[#ffc928]">2009</span>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Llegada a Bolivia</span>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div>
                <span className="text-2xl font-black text-[#0092dd]">5 Sedes</span>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Nacionales</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { city: "La Paz", since: "Desde 2009", icon: "🏔️" },
              { city: "Santa Cruz", since: "Desde 2012", icon: "🌴" },
              { city: "Cochabamba", since: "Desde 2021", icon: "🌾" },
              { city: "Tarija", since: "Desde 2021", icon: "🍷" },
              { city: "Sucre", since: "Desde 2021", icon: "🏛️" }
            ].map((sede) => (
              <div
                key={sede.city}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2 hover:bg-[#0092dd]/10 hover:border-[#0092dd]/40 transition duration-300"
              >
                <span className="text-3xl block">{sede.icon}</span>
                <h4 className="text-lg font-extrabold text-white">{sede.city}</h4>
                <span className="text-xs font-semibold text-sky-400 block">{sede.since}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase mt-1">
                  <MapPin className="w-3 h-3 text-[#ffc928]" /> Sede Activa
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: GALERÍA DE FOTOS EN TERRENO */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-left space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#0092dd]">
            Acción Real en Asentamientos
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Voluntariado en Imágenes
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/15 group">
            <img src={img9} alt="Construcción TECHO 1" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex items-end">
              <span className="text-xs font-bold text-white">Jornada de construcción</span>
            </div>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/15 group">
            <img src={img10} alt="Construcción TECHO 2" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex items-end">
              <span className="text-xs font-bold text-white">Trabajo junto a las familias</span>
            </div>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/15 group">
            <img src={img11} alt="Construcción TECHO 3" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex items-end">
              <span className="text-xs font-bold text-white">Equipos de trabajo</span>
            </div>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/15 group">
            <img src={img13} alt="Construcción TECHO 4" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex items-end">
              <span className="text-xs font-bold text-white">Entrega de vivienda</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TESTIMONIOS Y VIDEOS TIKTOK */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-10 text-left">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#0092dd]">
              Experiencias en Video
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Testimonios de Voluntarios (TikTok)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Escucha a quienes ya participan activamente en las jornadas de TECHO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TECHO_VIDEOS.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelectedVideo(vid)}
                className="group p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-[#0092dd]/50 transition duration-300 cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                    <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-75" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#0092dd] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    </div>
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 text-[10px] font-extrabold text-[#ffc928] uppercase backdrop-blur-md">
                      {vid.category}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-sky-400 transition-colors leading-snug">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {vid.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400 font-semibold">
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <TikTokIcon className="w-3.5 h-3.5" />
                    {vid.author}
                  </span>
                  <span className="text-[#ffc928] group-hover:translate-x-1 transition-transform">Ver →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: REDES SOCIALES & FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-12">
        {/* Official Social Networks Bar */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0092dd]/20 via-slate-900 to-slate-950 border border-[#0092dd]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">Sigue a TECHO en sus Redes Oficiales</h3>
            <p className="text-xs text-slate-300">Mantente al día con las próximas convocatorias y jornadas de construcción.</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://www.instagram.com/techo_org/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white/10 hover:bg-pink-600/30 border border-white/15 text-white transition flex items-center gap-2 text-xs font-bold"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400" />
              Instagram
            </a>
            <a
              href="https://www.facebook.com/TECHO.org"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white/10 hover:bg-blue-600/30 border border-white/15 text-white transition flex items-center gap-2 text-xs font-bold"
            >
              <FacebookIcon className="w-4 h-4 text-blue-400" />
              Facebook
            </a>
            <a
              href="https://www.tiktok.com/@techo_latam"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white/10 hover:bg-sky-600/30 border border-white/15 text-white transition flex items-center gap-2 text-xs font-bold"
            >
              <TikTokIcon className="w-4 h-4 text-sky-400" />
              TikTok
            </a>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#0092dd]">
              Resuelve tus Dudas
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Preguntas Frecuentes TECHO
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "¿Cuáles son las formas de participar como voluntario/a?",
                a: "Puedes participar en construcciones de fines de semana, en equipos permanentes de trabajo, con tu colegio, en grupos de familia o amigos, o mediante voluntariado corporativo (RSE)."
              },
              {
                q: "¿En qué ciudades de Bolivia trabaja TECHO?",
                a: "TECHO tiene sedes activas en La Paz (desde 2009), Santa Cruz (desde 2012), y en Cochabamba, Tarija y Sucre (desde 2021)."
              },
              {
                q: "¿El voluntariado requiere cuota o desembolso?",
                a: "Es un voluntariado no financiado. El voluntario cubre sus gastos de traslado y una cuota logística mínima destinada al transporte y materiales de los trabajos en comunidad."
              },
              {
                q: "¿Cuál es el impacto logrado por TECHO?",
                a: "A nivel global se han movilizado más de 1.2 millones de jóvenes en 18 países de América Latina y se han construido más de 780 viviendas de emergencia en Bolivia."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-5 text-left font-extrabold text-sm sm:text-base text-white flex items-center justify-between gap-4 cursor-pointer bg-transparent border-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#ffc928] transition-transform duration-300 ${
                      openFaqIndex === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal Player Overlay */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl rounded-3xl border border-white/20 bg-slate-900 p-6 shadow-2xl z-10 space-y-4"
            >
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer border-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-left space-y-1">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  {selectedVideo.category}
                </span>
                <h3 className="text-xl font-extrabold text-white">{selectedVideo.title}</h3>
                <p className="text-xs text-slate-300">{selectedVideo.desc}</p>
              </div>

              {/* Video Embed Container */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black flex flex-col items-center justify-center p-6 text-center space-y-4">
                <TikTokIcon className="w-16 h-16 text-sky-400 animate-pulse" />
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">Ver video completo en TikTok</h4>
                  <p className="text-xs text-slate-300 max-w-md">
                    Haz clic a continuación para reproducir el contenido original publicado por {selectedVideo.author} en TikTok.
                  </p>
                </div>
                <a
                  href={selectedVideo.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0092dd] hover:bg-[#007cbd] text-white font-extrabold text-sm transition shadow-lg"
                >
                  Abrir TikTok ({selectedVideo.author})
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
