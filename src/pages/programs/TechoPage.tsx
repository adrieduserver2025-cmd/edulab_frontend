import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Heart,
  Share2,
  Play,
  Check,
  HelpCircle,
  Globe,
  Award,
  Calendar,
  AlertTriangle,
  X,
  UserCheck,
  ShieldCheck,
  Building,
  ArrowRight,
  ChevronDown,
  BookOpen,
  Users,
  Leaf,
  Compass,
  MapPin,
  Languages,
  Clock,
  ExternalLink,
  Sparkles
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

// EduServer Ad Courses
import cursosImg1 from "../../assets/cursos_eduserver/REGULARES 2026 (1).jpg.jpeg";
import cursosImg2 from "../../assets/cursos_eduserver/REGULARES 2026.jpg.jpeg";

const cursosImgs = [cursosImg1, cursosImg2];

function EduServerAdCard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % cursosImgs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const whatsappMsg = encodeURIComponent(
    "Hola, me interesa información sobre los cursos de idiomas de EduServer 🌍"
  );

  return (
    <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-white">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
            Publicidad · EduServer
          </p>
          <p className="text-xs font-bold text-[#00135B] mt-0.5">
            🌐 Aprende el idioma que necesitas
          </p>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-extrabold border border-amber-200">
          PATROCINADO
        </span>
      </div>

      <div
        className="relative w-full aspect-[9/16] max-h-72 overflow-hidden cursor-pointer"
        onClick={() =>
          window.open(`https://wa.me/59169440951?text=${whatsappMsg}`, "_blank")
        }
      >
        {cursosImgs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Cursos EduServer ${i + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: active === i ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="flex justify-center gap-1.5 py-2">
        {cursosImgs.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full border-none transition-all cursor-pointer ${
              active === i ? "w-5 h-1.5 bg-[#00135B]" : "w-1.5 h-1.5 bg-slate-300"
            }`}
          />
        ))}
      </div>

      <div className="px-4 pb-4">
        <a
          href={`https://wa.me/59169440951?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 no-underline"
        >
          <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}

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
    desc: "Vivencia real de trabajo en terreno, convivencia comunitaria y el impacto transformador de las viviendas de emergencia.",
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

  const [activeTab, setActiveTab] = useState<"descripcion" | "modalidades" | "sedes" | "requisitos" | "testimonios" | "faq">("descripcion");
  const [selectedVideo, setSelectedVideo] = useState<TechoVideo | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [applying, setApplying] = useState(false);

  // Saved Programs State
  const [savedPrograms, setSavedPrograms] = useState<string[]>(() => {
    try {
      const local = localStorage.getItem("edulab_saved_programs");
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setSelectedVideo(TECHO_VIDEOS[0]);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleSave = () => {
    const programId = "VS-05";
    let updated: string[];
    if (savedPrograms.includes(programId)) {
      updated = savedPrograms.filter((id) => id !== programId);
    } else {
      updated = [...savedPrograms, programId];
    }
    setSavedPrograms(updated);
    localStorage.setItem("edulab_saved_programs", JSON.stringify(updated));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace del voluntariado copiado al portapapeles!");
    }
  };

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

  const isSaved = savedPrograms.includes("VS-05");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-700 font-sans">
      <PublicNavbar />

      {/* Hero Section — EDULAB Navy Header */}
      <section className="relative bg-gradient-to-r from-[#00135B] via-[#061b58] to-[#021448] pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={voluntariado1}
            alt="Voluntariado TECHO"
            className="w-full h-full object-cover opacity-15 filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00135B] via-[#00135B]/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 space-y-6">
          {/* Top Bar Navigation & Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/programs")}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver a voluntariados</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSave}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all bg-white/10 cursor-pointer ${
                  isSaved
                    ? "border-rose-400/50 text-rose-400 bg-rose-500/20"
                    : "border-white/20 text-slate-200 hover:text-white hover:bg-white/20"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                <span>{isSaved ? "Guardado" : "Guardar para después"}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full border border-white/20 text-slate-200 hover:text-white hover:bg-white/20 bg-white/10 cursor-pointer"
                title="Compartir voluntariado"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title & Brand Header Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C542] text-[#00135B] text-xs font-extrabold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-current" />
                Voluntariado Internacional · VS-05
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Voluntariado con <span className="text-[#F5C542]">TECHO</span>
              </h1>

              <p className="text-sm sm:text-base font-normal text-slate-200 leading-relaxed max-w-2xl">
                Desarrollo comunitario, trabajo de campo y construcción de viviendas de emergencia en asentamientos precarios junto a las familias. Más de <strong className="text-white">1.2 millones de jóvenes</strong> transformando la realidad en Latinoamérica.
              </p>

              {/* Info Badges Row */}
              <div className="flex flex-wrap gap-2.5 pt-2 text-xs font-semibold text-slate-200">
                <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#F5C542]" /> 18 Países de LATAM
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" /> Presencial / Trabajo de campo
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" /> Fines de semana / Recurrente
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-amber-300" /> Español
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={applying}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F5C542] hover:bg-[#ffd34f] px-8 text-sm font-extrabold text-[#00135B] shadow-lg shadow-amber-400/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border-none"
                >
                  {applying ? "Procesando postulación..." : "Postular a Voluntariado TECHO"}
                  <ArrowRight className="w-4 h-4 text-[#00135B]" />
                </button>

                <a
                  href="https://techo.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 no-underline"
                >
                  Sitio Oficial TECHO.org
                  <ExternalLink className="w-4 h-4 text-slate-300" />
                </a>
              </div>
            </div>

            {/* Right Brand Badge */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white p-6 shadow-2xl flex items-center justify-center border-4 border-[#F5C542]">
                <img
                  src={logoPrincipal}
                  alt="Logo TECHO"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subheader Navigation Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center sm:justify-start gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: "descripcion", label: "DESCRIPCIÓN" },
            { id: "modalidades", label: "MODALIDADES" },
            { id: "sedes", label: "SEDES EN BOLIVIA" },
            { id: "requisitos", label: "REQUISITOS" },
            { id: "testimonios", label: "TESTIMONIOS" },
            { id: "faq", label: "PREGUNTAS FRECUENTES" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer bg-transparent border-t-0 border-x-0 ${
                activeTab === tab.id
                  ? "border-[#00135B] text-[#00135B]"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Layout Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Left Column: Details Content */}
          <div className="lg:col-span-8 space-y-10">

            {/* TAB 1: DESCRIPCIÓN */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00135B]">
                  DESCRIPCIÓN
                </span>
                <h2 className="text-2xl font-extrabold text-[#00135B]">
                  ¿De qué se trata este voluntariado?
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Voluntariado enfocado en el desarrollo comunitario y la construcción de viviendas de emergencia en asentamientos precarios. Los voluntarios trabajan junto a las familias para mejorar su entorno social.
              </p>

              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                <h4 className="text-sm font-extrabold text-[#00135B] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F5C542]" />
                  Sé Voluntario/a: Más de 1.2 Millones de Jóvenes
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Somos una organización constituida por jóvenes que destinan fuerzas, tiempo y ganas a transformar la realidad de Latinoamérica, junto con las familias que habitan en asentamientos populares.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-extrabold text-[#00135B]">¿Por qué ser voluntario/a?</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  El voluntariado es el motor de la organización, es la fuerza transformadora de la realidad en la que vivimos. Gracias a los voluntarios y voluntarias de TECHO, las familias de los barrios populares pueden vivir mejor.
                </p>
              </div>
            </div>

            {/* TAB 2: MODALIDADES (¿CÓMO SER VOLUNTARIO/A?) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00135B]">
                  MODALIDADES
                </span>
                <h2 className="text-2xl font-extrabold text-[#00135B]">
                  ¿Cómo ser Voluntario/a?
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                  <span className="text-xs font-black text-[#00135B] uppercase block">📅 Los Fines de Semana</span>
                  <p className="text-xs text-slate-600">Puedes participar de las actividades que tenemos los fines de semana en los asentamientos populares.</p>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-extrabold">ACTIVIDADES</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                  <span className="text-xs font-black text-[#00135B] uppercase block">👥 En Equipos de Trabajo</span>
                  <p className="text-xs text-slate-600">Puedes sumarte a los constantes trabajos en asentamientos populares y/o en áreas de soporte de TECHO.</p>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-extrabold">PUESTOS ABIERTOS</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                  <span className="text-xs font-black text-[#00135B] uppercase block">🎓 Con tu Colegio</span>
                  <p className="text-xs text-slate-600">Tú y tu colegio pueden participar de las actividades de los asentamientos populares, junto a los vecinos.</p>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">SECUNDARIOS</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                  <span className="text-xs font-black text-[#00135B] uppercase block">🏡 Con Familia y Amigos</span>
                  <p className="text-xs text-slate-600">Junto a tu familia y/o grupo de amigos pueden construir una vivienda de emergencia junto a la familia anfitriona.</p>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-extrabold">GRUPOS</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 sm:col-span-2">
                  <span className="text-xs font-black text-[#00135B] uppercase block">💼 Voluntariado Corporativo</span>
                  <p className="text-xs text-slate-600">Tu empresa puede sumarse al programa de voluntariado corporativo, que genera valor al entorno y a sus colaboradores/as.</p>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-extrabold">RSE CORPORATIVO</span>
                </div>
              </div>
            </div>

            {/* TAB 3: SEDES EN BOLIVIA */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00135B]">
                  PRESENCIA TERRITORIAL
                </span>
                <h2 className="text-2xl font-extrabold text-[#00135B]">
                  Dónde Estamos en Bolivia
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-xl font-black text-[#00135B] block">2009</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">La Paz</span>
                </div>
                <div>
                  <span className="text-xl font-black text-[#00135B] block">2012</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Santa Cruz</span>
                </div>
                <div>
                  <span className="text-xl font-black text-[#00135B] block">2021</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Tarija, Cochabamba, Sucre</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <img src={img9} alt="Acción TECHO 1" className="rounded-xl aspect-square object-cover border border-slate-200" />
                <img src={img10} alt="Acción TECHO 2" className="rounded-xl aspect-square object-cover border border-slate-200" />
                <img src={img11} alt="Acción TECHO 3" className="rounded-xl aspect-square object-cover border border-slate-200" />
                <img src={img13} alt="Acción TECHO 4" className="rounded-xl aspect-square object-cover border border-slate-200" />
              </div>
            </div>

            {/* TAB 4: REQUISITOS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00135B]">
                  ELEGIBILIDAD & REQUISITOS
                </span>
                <h2 className="text-2xl font-extrabold text-[#00135B]">
                  Requisitos para Participar
                </h2>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Jóvenes bolivianos o residentes interesados en urbanismo social y reducción de la pobreza.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Motivación para el trabajo de campo en comunidad y excelente actitud de trabajo en equipo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Disponibilidad de tiempo durante las jornadas de construcción los fines de semana o puestos fijos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Voluntariado no financiado: El voluntario cubre sus gastos de traslado y una cuota mínima de participación logística.</span>
                </li>
              </ul>
            </div>

            {/* TAB 5: TESTIMONIOS (TIKTOK) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00135B]">
                  EXPERIENCIA REAL
                </span>
                <h2 className="text-2xl font-extrabold text-[#00135B]">
                  Testimonios en Video (TikTok)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TECHO_VIDEOS.slice(1).map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition cursor-pointer space-y-3 group"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                      <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#00135B] text-white flex items-center justify-center shadow-md">
                          <Play className="w-5 h-5 ml-0.5 fill-current text-[#F5C542]" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#00135B] group-hover:text-blue-600 transition">{vid.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{vid.desc}</p>
                    </div>
                    <div className="text-[10px] font-bold text-sky-600 flex items-center gap-1">
                      <TikTokIcon className="w-3 h-3" /> {vid.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TAB 6: FAQ */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00135B]">
                  PREGUNTAS FRECUENTES
                </span>
                <h2 className="text-2xl font-extrabold text-[#00135B]">
                  Resuelve tus dudas sobre TECHO
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: "¿Cuáles son las formas de participar como voluntario/a?",
                    a: "Puedes participar de las actividades que tenemos los fines de semana en asentamientos populares, en equipos de trabajo permanentes, con tu colegio (secundarios), con tu familia y amigos, o en voluntariado corporativo (RSE)."
                  },
                  {
                    q: "¿En qué ciudades de Bolivia trabaja TECHO?",
                    a: "TECHO tiene sedes activas en La Paz (desde 2009), Santa Cruz (desde 2012), y en Cochabamba, Tarija y Sucre (desde 2021)."
                  },
                  {
                    q: "¿El voluntariado requiere cuota?",
                    a: "Es un voluntariado no financiado. El voluntario cubre sus gastos de traslado y una cuota logística mínima destinada al transporte y herramientas de trabajo en comunidad."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full p-4 text-left text-xs font-bold text-[#00135B] flex items-center justify-between gap-4 cursor-pointer bg-white border-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === idx ? "rotate-180 text-[#00135B]" : ""}`} />
                    </button>
                    {openFaqIndex === idx && (
                      <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-6">

            {/* Video Bienvenida Sidebar Card */}
            <div
              onClick={() => setSelectedVideo(TECHO_VIDEOS[0])}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 cursor-pointer hover:border-blue-300 transition group"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#00135B]">
                  VIDEO DE BIENVENIDA
                </span>
                <h3 className="text-sm font-extrabold text-[#00135B]">Conoce la experiencia TECHO</h3>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                <img src={voluntariado1} alt="Bienvenida TECHO" className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#00135B] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play className="w-6 h-6 ml-0.5 fill-current text-[#F5C542]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5 text-sky-600">
                  <TikTokIcon className="w-3.5 h-3.5" /> @techo_enbolivia
                </span>
                <span className="text-[#00135B] font-bold">Ver TikTok →</span>
              </div>
            </div>

            {/* EduServer Ad Card */}
            <EduServerAdCard />

            {/* Official Social Media Card */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#00135B]">
                Redes Oficiales TECHO
              </h3>

              <div className="space-y-2">
                <a
                  href="https://www.instagram.com/techo_org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-pink-50 border border-slate-200 text-xs font-bold text-slate-700 transition no-underline"
                >
                  <span className="flex items-center gap-2">
                    <InstagramIcon className="w-4 h-4 text-pink-600" /> Instagram Oficial
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="https://www.facebook.com/TECHO.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-bold text-slate-700 transition no-underline"
                >
                  <span className="flex items-center gap-2">
                    <FacebookIcon className="w-4 h-4 text-blue-600" /> Facebook Oficial
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="https://www.tiktok.com/@techo_latam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 text-xs font-bold text-slate-700 transition no-underline"
                >
                  <span className="flex items-center gap-2">
                    <TikTokIcon className="w-4 h-4 text-sky-600" /> TikTok @techo_latam
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl z-10 space-y-4 text-left"
            >
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer border-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 pr-6">
                <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider">
                  {selectedVideo.category}
                </span>
                <h3 className="text-base font-extrabold text-[#00135B]">{selectedVideo.title}</h3>
                <p className="text-xs text-slate-500">{selectedVideo.desc}</p>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <TikTokIcon className="w-14 h-14 text-sky-400 animate-pulse" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Ver video completo en TikTok</h4>
                  <p className="text-xs text-slate-300">
                    Publicado por <strong className="text-white">{selectedVideo.author}</strong> en TikTok.
                  </p>
                </div>
                <a
                  href={selectedVideo.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00135B] hover:bg-[#0d288c] text-white font-extrabold text-xs transition shadow-md no-underline"
                >
                  Abrir TikTok ({selectedVideo.author})
                  <ExternalLink className="w-3.5 h-3.5 text-[#F5C542]" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
