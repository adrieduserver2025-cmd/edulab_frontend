import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, CheckCircle2, ChevronDown, BookOpen,
  Star, ArrowRight, ArrowLeft, Sparkles, ExternalLink,
  HelpCircle, Users, Trophy, Lightbulb,
  GraduationCap, DollarSign, Clock, Calendar, Languages,
  MapPin, Building2, Zap, AlertTriangle, Play, Check, ShieldCheck,
  Compass, Target, AlertCircle, Globe, Plane, Wallet, Shield, Home, X, Video, FileText, Search,
  Smartphone
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import { useAuthStore } from "../../store/useAuthStore";
import axiosClient from "../../services/api/axiosClient";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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

// Import local assets from src/assets/becas_fun_carolina/imagenes
import carolinaLogoHorizontal from "../../assets/becas_fun_carolina/imagenes/carolina_logo_horizontal_2026-2048x728.png";
import carolinaLogoSquare from "../../assets/becas_fun_carolina/imagenes/fundacion carolina.png";
import cartel2026 from "../../assets/becas_fun_carolina/imagenes/Cartel-general-HZ_becas_FC_2026-1024x576.png";
import bienvenidaPhoto from "../../assets/becas_fun_carolina/imagenes/bienvenida.jpeg";
import valoresPhoto from "../../assets/becas_fun_carolina/imagenes/valores.png";
import exbecarioPhoto from "../../assets/becas_fun_carolina/imagenes/exbecario.png";
import bloodPhoto from "../../assets/becas_fun_carolina/imagenes/blood.png";

// Types for Videos
interface CarolinaVideo {
  id: string;
  title: string;
  category: string;
  desc: string;
  type: "youtube" | "shorts";
  url: string;
  embedUrl: string;
  thumb: string;
  isVertical?: boolean;
}

const CAROLINA_VIDEOS: CarolinaVideo[] = [
  {
    id: "v1",
    title: "Presentación Oficial Convocatoria Fundación Carolina",
    category: "Convocatoria & Programa",
    desc: "Video oficial de presentación de las becas de posgrado y doctorado en España.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=Qg1C1WFUKtM",
    embedUrl: "https://www.youtube.com/embed/Qg1C1WFUKtM?autoplay=1",
    thumb: cartel2026
  },
  {
    id: "v2",
    title: "Resumen Rápido Fundación Carolina (YouTube Short)",
    category: "Short Informativo",
    desc: "Guía práctica en formato vertical sobre cómo elegir tu máster y postular a la Fundación Carolina.",
    type: "shorts",
    url: "https://www.youtube.com/shorts/Oj-2vb4VvZs",
    embedUrl: "https://www.youtube.com/embed/Oj-2vb4VvZs?autoplay=1",
    thumb: exbecarioPhoto,
    isVertical: true
  },
  {
    id: "v3",
    title: "Testimonio de Becario Fundación Carolina - Parte 1",
    category: "Testimonios",
    desc: "Experiencia real de posgrado en España, proceso de admisión e integración académica.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=o5XoQk3BZCI",
    embedUrl: "https://www.youtube.com/embed/o5XoQk3BZCI?autoplay=1",
    thumb: bienvenidaPhoto
  },
  {
    id: "v4",
    title: "Testimonio de Becario Fundación Carolina - Parte 2",
    category: "Testimonios",
    desc: "Consejos clave para la carta de motivación y retorno con impacto en Latinoamérica.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=Zf5cfVcr7ak",
    embedUrl: "https://www.youtube.com/embed/Zf5cfVcr7ak?autoplay=1",
    thumb: valoresPhoto
  }
];

export default function CarolinaPage() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [programId, setProgramId] = useState<number | null>(null);

  // Video Modal State (Ventana Emergente)
  const [modalVideo, setModalVideo] = useState<CarolinaVideo | null>(null);
  const [heroVideoIdx, setHeroVideoIdx] = useState(0);

  // Benefit Details Master-Detail Selection (Imagen 1 style)
  const [activeBenefitIdx, setActiveBenefitIdx] = useState<number>(0);

  // FAQ Search State
  const [faqSearch, setFaqSearch] = useState("");

  // Calculator State
  const [calcGpa, setCalcGpa] = useState<number>(82);
  const [calcLevel, setCalcLevel] = useState<string>("posgrado");
  const [calcIberoamerican, setCalcIberoamerican] = useState<boolean>(true);
  const [calcNoSpainResidency, setCalcNoSpainResidency] = useState<boolean>(true);
  const [calcDegreeHeld, setCalcDegreeHeld] = useState<boolean>(true);

  const gpaPasses = calcGpa >= 70;
  const isFullyEligible = gpaPasses && calcIberoamerican && calcNoSpainResidency && calcDegreeHeld;

  // Auto-open video popup modal on entry after 1s
  useEffect(() => {
    const timer = setTimeout(() => {
      setModalVideo(CAROLINA_VIDEOS[0]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load backend program ID
  useEffect(() => {
    async function loadProgram() {
      try {
        const res = await axiosClient.get("/opportunities/fundacion-carolina-beca");
        setProgramId(res.data.id);
      } catch {
        // Fallback
      }
    }
    loadProgram();
  }, []);

  const handleApply = async () => {
    if (!isAuthenticated || !token) {
      setShowAuthModal(true);
      return;
    }
    setApplying(true);
    setApplyError(null);
    try {
      if (programId) {
        await axiosClient.post("/applications/", { program_id: programId });
      }
      setApplySuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Error al crear postulación.";
      if (msg.includes("already") || msg.includes("ya existe")) {
        setApplySuccess(true);
      } else {
        setApplyError(msg);
      }
    } finally {
      setApplying(false);
    }
  };

  // Benefit List matching Imagen 1 layout
  const benefitsList = [
    {
      icon: GraduationCap,
      title: "Matrícula Universitaria",
      tagline: "100% o Subvencionada",
      desc: "Cobertura completa o parcial del importe de la matrícula en programas máster y doctorado de universidades españolas.",
      longDesc: "La Fundación Carolina subvenciona entre el 50% y el 100% de los costes de matrícula de los títulos de máster y doctorado en prestigiosas universidades públicas y privadas de España.",
      checklist: [
        "Matriculación oficial en universidades de España",
        "Tasas de examen y expedición académica",
        "Acceso a bibliotecas y campus virtuales",
        "Convenios institucionales con el Estado español"
      ],
      advantages: [
        "Acreditación europea oficial",
        "Red de más de 100 universidades",
        "Flexibilidad de áreas de conocimiento"
      ],
      tip: "Puedes postular hasta a 5 programas de máster en la plataforma de la Fundación Carolina en orden de preferencia.",
      image: cartel2026,
      theme: { bg: "bg-red-50/50", iconColor: "text-red-600", badgeBg: "bg-red-50 text-red-700", accentColor: "#dc2626" }
    },
    {
      icon: Plane,
      title: "Pasajes Aéreos Internacionales",
      tagline: "Ida y Vuelta a España",
      desc: "Boleto de avión de ida y vuelta en clase turista desde el país iberoamericano de origen hasta España.",
      longDesc: "La beca incluye la emisión del billete de avión de ida hacia España al inicio del curso académico y de retorno a tu país de origen al finalizar los estudios.",
      checklist: [
        "Vuelo internacional de ida a España",
        "Vuelo internacional de regreso a Latinoamérica",
        "Gestión directa de billete por la Fundación",
        "Flexibilidad de fechas según calendario académico"
      ],
      advantages: [
        "Emisión sin desembolso previo del becario",
        "Coordinación directa de itinerario",
        "Tranquilidad logística completa"
      ],
      tip: "EduLab te asiste en la tramitación del visado de estudios en el consulado de España en tu país.",
      image: bienvenidaPhoto,
      theme: { bg: "bg-blue-50/50", iconColor: "text-blue-600", badgeBg: "bg-blue-50 text-blue-700", accentColor: "#2563eb" }
    },
    {
      icon: Wallet,
      title: "Asignación Mensual",
      tagline: "Manutención & Alojamiento",
      desc: "Estipendio mensual de ayuda al alojamiento y manutención durante el periodo lectivo en España.",
      longDesc: "El becario recibe una aportación económica mensual (aproximadamente 750€ a 1.000€ según la modalidad) orientada a sufragar los costes de vivienda, alimentación y estancia.",
      checklist: [
        "Transferencias bancarias mensuales puntuales",
        "Alojamiento en residencias universitarias o pisos",
        "Gastos de vida cotidiana y manutención",
        "Asistencia al estudiante internacional"
      ],
      advantages: [
        "Estabilidad financiera mensual",
        "Apoyo para ciudades clave (Madrid, Barcelona, etc.)",
        "Autonomía del becario"
      ],
      tip: "Aprovecha la orientación de alojamiento de la Red Carolina para encontrar pisos compartidos cerca de tu universidad.",
      image: exbecarioPhoto,
      theme: { bg: "bg-amber-50/50", iconColor: "text-amber-600", badgeBg: "bg-amber-50 text-amber-700", accentColor: "#d97706" }
    },
    {
      icon: Shield,
      title: "Seguro Médico No Farmacéutico",
      tagline: "Cobertura en España",
      desc: "Seguro médico privado con cobertura de enfermedad y accidentes durante la estancia académica.",
      longDesc: "Cobertura sanitaria completa no farmacéutica durante todo el periodo lectivo en España, cumpliendo los requisitos oficiales de extranjería y visado de estudios.",
      checklist: [
        "Atención médica primaria y especializada",
        "Hospitalización y emergencias sanitarias",
        "Cumplimiento 100% norma visado España",
        "Asistencia en viaje"
      ],
      advantages: [
        "Sin copago en consultas principales",
        "Red de clínicas y hospitales privados en España",
        "Respaldo ante eventualidades"
      ],
      tip: "Guarda tu póliza digital en la app de EduLab para tener acceso inmediato a la red médica española.",
      image: bloodPhoto,
      theme: { bg: "bg-emerald-50/50", iconColor: "text-emerald-600", badgeBg: "bg-emerald-50 text-emerald-700", accentColor: "#059669" }
    },
    {
      icon: Users,
      title: "Red Iberoamericana Exbecarios",
      tagline: "Red Carolina",
      desc: "Integración a una comunidad de más de 20.000 profesionales y líderes de América Latina y España.",
      longDesc: "Acceso permanente a la Red Carolina, participando en seminarios, encuentros diplomáticos, grupos de trabajo en ODS y redes de colaboración profesional de por vida.",
      checklist: [
        "Acceso a la plataforma Red Carolina",
        "Encuentros anuales de exbecarios iberoamericanos",
        "Bolsa de empleo y colaboraciones",
        "Publicaciones y proyectos de investigación"
      ],
      advantages: [
        "Conexión directa con líderes iberoamericanos",
        "Prestigio profesional reconocido",
        "Desarrollo de carrera internacional"
      ],
      tip: "La Red Carolina es una plataforma de networking clave para proyectos de impacto social en Latinoamérica.",
      image: valoresPhoto,
      theme: { bg: "bg-purple-50/50", iconColor: "text-purple-600", badgeBg: "bg-purple-50 text-purple-700", accentColor: "#7c3aed" }
    },
    {
      icon: Sparkles,
      title: "Mentoría & IA EDULAB",
      tagline: "Acompañamiento Integral",
      desc: "Soporte de Inteligencia Artificial y mentores activos para estructurar tu perfil y postulaciones.",
      longDesc: "Herramientas de IA para optimizar tu currículum vitae al formato europeo (Europass), redactar la carta de motivación ajustada a los criterios de Fundación Carolina y simular tu postulación.",
      checklist: [
        "Generador de carta de motivación con IA",
        "Revisión de expediente y equivalencia de notas",
        "Simulador de postulaciones a los 5 másteres",
        "Sesiones de preparación de entrevista"
      ],
      advantages: [
        "Maximiza tu probabilidad de preselección",
        "Asesoría personalizada paso a paso",
        "Soporte continuo hasta la adjudicación"
      ],
      tip: "Utiliza nuestro convertidor de notas en tiempo real para adaptar tu promedio latinoamericano a la escala 0-10 de España.",
      image: carolinaLogoHorizontal,
      theme: { bg: "bg-pink-50/50", iconColor: "text-pink-600", badgeBg: "bg-pink-50 text-pink-700", accentColor: "#db2777" }
    }
  ];

  const requirements = [
    { name: "Ciudadanía Iberoamericana", priority: "Obligatorio", color: "#ef4444", desc: "Ser nacional de un país de la Comunidad Iberoamericana de Naciones (ej: Bolivia, Argentina, Colombia)." },
    { name: "Título Universitario de Grado", priority: "Obligatorio", color: "#ef4444", desc: "Poseer título de Licenciatura o equivalente al momento de solicitar la beca." },
    { name: "No Residir en España", priority: "Obligatorio", color: "#ef4444", desc: "No estar residiendo en España ni tener fijada residencia previa en el país." },
    { name: "Nota Media de Expediente", priority: "Obligatorio", color: "#ef4444", desc: "Expediente académico legalizado con acreditación de nota media sobre 10." },
    { name: "Correo Electrónico Verificado", priority: "Importante", color: "#f59e0b", desc: "Registro activo y verificado en la plataforma web de Fundación Carolina." },
    { name: "Proyecto ODS / Impacto", priority: "Importante", color: "#f59e0b", desc: "Coherencia del programa elegido con los Objetivos de Desarrollo Sostenible (ODS)." },
    { name: "Cumplir Requisitos de la Universidad", priority: "Importante", color: "#f59e0b", desc: "Requisitos específicos de admisión fijados por la universidad española de destino." },
    { name: "Compromiso de Retorno", priority: "Recomendado", color: "#22c55e", desc: "Plan para transferir los conocimientos adquiridos a tu país de origen." }
  ];

  // Official FAQ items for Fundación Carolina
  const OFFICIAL_FAQS = [
    { q: "¿Qué incluye la Beca de la Fundación Carolina?", a: "La beca incluye la cobertura del 50% al 100% de la matrícula universitaria, boletos de avión de ida y vuelta a España, seguro médico no farmacéutico y una asignación mensual de ayuda para manutención y alojamiento." },
    { q: "¿Cuándo abre la convocatoria para posgrados y doctorados?", a: "La convocatoria de Posgrado abre habitualmente en enero y cierra en marzo. La convocatoria de Doctorado y Estancias Cortas permanece abierta de enero a abril de cada año." },
    { q: "¿Puedo postular si soy ciudadano latinoamericano / boliviano?", a: "Sí, las becas están dirigidas a profesionales titulados nacionales de cualquiera de los países miembros de la Comunidad Iberoamericana de Naciones." },
    { q: "¿Es necesario residir fuera de España para postular?", a: "Sí, es un requisito obligatorio no tener fijada la residencia en España al momento de postular ni haber realizado estudios previos de larga estancia sin la autorización debida." },
    { q: "¿A cuántos programas de máster puedo postular simultáneamente?", a: "La plataforma de la Fundación Carolina permite postular hasta a un máximo de 5 programas académicos por convocatoria en orden de prioridad." },
    { q: "¿Cómo se calcula la nota media para España?", a: "La Fundación Carolina requiere que registres tu nota media universitaria convertida a la escala de 0 a 10 de España. EduLab cuenta con un simulador de equivalencia para ayudarte a calcularla correctamente." },
    { q: "¿Se necesita enviar documentos físicos en la primera fase de postulación?", a: "No, todo el proceso de postulación se realiza de forma 100% online en la plataforma web. Solamente si resultas preseleccionado(a) deberás aportar la documentación escaneada y cotejada." },
    { q: "¿Qué ocurre si ya cuento con una beca de otra institución?", a: "Las becas de la Fundación Carolina suelen ser incompatibles con otras ayudas públicas de la misma naturaleza financiadas por el Gobierno de España o la Unión Europea para el mismo fin." }
  ];

  const filteredFaqs = OFFICIAL_FAQS.filter(f =>
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600;700&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-geist { font-family: 'Geist Mono', monospace; }
        .hero-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .benefit-list-item {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .benefit-list-item:hover {
          background: rgba(220,38,38,0.04);
          border-color: rgba(220,38,38,0.25) !important;
        }
        .benefit-list-item.active {
          background: #FEF2F2;
          border-color: #DC2626 !important;
          box-shadow: 0 4px 16px rgba(220,38,38,0.10);
        }
        .benefit-panel-enter {
          animation: panelFadeIn 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes panelFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .check-item { transition: background 0.2s; }
        .adv-badge { transition: background 0.2s, border-color 0.2s; }
        .adv-badge:hover { background: #FEF3C7; border-color: #F59E0B; }
      `}</style>

      <PublicNavbar onOpenAuth={() => setShowAuthModal(true)} />

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HERO SECTION (ROYAL NAVY #00135B WITH FULBRIGHT STYLE BUTTONS & HERO PLAYER)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section
        className="hero-pattern pt-28 pb-16 relative overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg, #00135B 0%, #001a7a 50%, #0a2490 100%)" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #DC2626, transparent)" }} />
        <div className="absolute bottom-10 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #F5C542, transparent)" }} />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Header */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold"
                style={{ background: "rgba(245,197,66,0.15)", borderColor: "rgba(245,197,66,0.3)", color: "#F5C542" }}>
                <span className="w-2 h-2 rounded-full bg-[#F5C542] animate-pulse" />
                BECA INTERNACIONAL 🇪🇸 ESPAÑA — COOPERACIÓN IBEROAMERICANA
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                <span>Becas Fundación </span>
                <span style={{ color: "#F5C542" }}>Carolina</span>
              </h1>

              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl font-light">
                Programa de becas iberoamericano para realizar maestrías, doctorados y estancias de investigación en las mejores universidades de <strong className="text-white font-semibold">España</strong>.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { icon: "🇪🇸", text: "España" },
                  { icon: "🎓", text: "Posgrado / Doctorado" },
                  { icon: "💰", text: "Total o Parcial" },
                  { icon: "🗣", text: "Español" },
                ].map(tag => (
                  <span key={tag.text} className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1.5"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                    <span>{tag.icon}</span> <span>{tag.text}</span>
                  </span>
                ))}
              </div>

              {/* Action Buttons — Styled Exactly Like Fulbright Page */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {applySuccess ? (
                  <div className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-[#00135B] text-sm"
                    style={{ background: "#F5C542" }}>
                    <CheckCircle2 className="w-5 h-5" />
                    ¡Postulación iniciada! Ver en Dashboard
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[#00135B] text-sm transition-all hover:scale-105 cursor-pointer"
                    style={{ background: "#F5C542", boxShadow: "0 4px 20px rgba(245,197,66,0.4)" }}>
                    {applying ? "Iniciando..." : "Simular mi postulación"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white text-sm transition-all hover:bg-white/10 cursor-pointer"
                  style={{ border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>
                  <Sparkles className="w-4 h-4 text-[#F5C542]" />
                  Aplicar con IA
                </button>
              </div>

              {/* Attributes Banner */}
              <div className="p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 w-full"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {[
                  { icon: "💲", label: "Financiamiento", val: "Total o Parcial" },
                  { icon: "⏱", label: "Duración", val: "1 año académico" },
                  { icon: "📅", label: "Plazo", val: "Enero a Marzo/Abril" },
                  { icon: "🌐", label: "Modalidad", val: "Presencial" },
                ].map(item => (
                  <div key={item.label} className="space-y-0.5 text-left">
                    <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span>{item.icon}</span> {item.label}
                    </div>
                    <div className="text-white font-extrabold text-xs">{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-2 border-t border-white/10">
                {[
                  { val: "736+", label: "Becas convocadas" },
                  { val: "203+", label: "Programas de Posgrado" },
                  { val: "100+", label: "Universidades en España" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-2xl font-black" style={{ color: "#F5C542" }}>{s.val}</div>
                    <div className="text-white/70 text-xs font-medium mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Video Player Box */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950 relative border border-white/20 p-2 space-y-3">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black group">
                  <iframe
                    key={CAROLINA_VIDEOS[heroVideoIdx].id}
                    className="w-full h-full border-none"
                    src={CAROLINA_VIDEOS[heroVideoIdx].embedUrl.replace("autoplay=1", "autoplay=0")}
                    title={CAROLINA_VIDEOS[heroVideoIdx].title}
                    allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />

                  <button
                    onClick={() => setModalVideo(CAROLINA_VIDEOS[heroVideoIdx])}
                    className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-[#00135B] text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-[#F5C542]" />
                    Modo Ventana Emergente
                  </button>
                </div>

                {/* Video Selector Tabs */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {CAROLINA_VIDEOS.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setHeroVideoIdx(idx)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        heroVideoIdx === idx
                          ? "bg-[#00135B] border-[#F5C542] text-white shadow"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Play className={`w-3.5 h-3.5 shrink-0 ${heroVideoIdx === idx ? "text-[#F5C542] fill-current" : "text-white/40"}`} />
                      <div className="truncate">
                        <div className="text-[11px] font-bold truncate">{v.title}</div>
                        <div className="text-[9px] text-white/50 truncate">{v.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          2. MANIFIESTO Y INSTITUCIONAL FUNDACIÓN CAROLINA
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-50/40 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-blue-100 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-24 rounded-2xl bg-white border border-gray-100 p-3 shadow-md flex items-center justify-center shrink-0">
              <img src={carolinaLogoHorizontal} alt="Logo Fundación Carolina" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00135B]/5 border border-[#00135B]/15 text-[#00135B] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#5D8CE2]" />
                Cooperación Educativa & Científica Iberoamericana
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#00135B] leading-snug border-l-4 border-[#F5C542] pl-4">
                &ldquo;Fomentar las relaciones culturales y la cooperación en materia educativa y científica entre España y los países de la Comunidad Iberoamericana de Naciones.&rdquo;
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                La Fundación Carolina es la institución de referencia en la formación de posgrado y doctorado para profesionales latinoamericanos. Sus becas integran los Objetivos de Desarrollo Sostenible (ODS) de la Agenda 2030, promoviendo el conocimiento, la equidad de género y la sostenibilidad.
              </p>

              {/* Official Social Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Redes Oficiales Fundación Carolina:</span>
                <a
                  href="https://www.facebook.com/fundacioncarolina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-all"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  Facebook Oficial
                </a>
                <a
                  href="https://www.youtube.com/@RedCarolina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5 hover:bg-red-100 transition-all"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                  Red Carolina YouTube
                </a>
                <a
                  href="https://www.instagram.com/fundacioncarolina/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-pink-50 text-pink-600 border border-pink-200 text-xs font-bold flex items-center gap-1.5 hover:bg-pink-100 transition-all"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  Instagram @fundacioncarolina
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          3. BENEFICIOS - LAYOUT 2 COLUMNAS INTERACTIVO MASTER-DETAIL (EXACTO IMAGEN 1)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white relative overflow-hidden font-jakarta text-[#0f172a]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6">

          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-[#d97706]/20 text-[#d97706] text-xs font-bold font-geist mb-4 uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-[#d97706]" />
              Beneficios
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0f172a] font-jakarta">
              ¿Qué incluye la beca?
            </h2>
            <p className="text-slate-500 text-sm md:text-base mt-4 max-w-2xl mx-auto font-light">
              Explora los pilares de cobertura académica, logística y financiera otorgados por la Fundación Carolina para tus estudios en España.
            </p>
          </div>

          {/* Two-Column Master-Detail Layout (Imagen 1) */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* LEFT — Vertical Benefit Stack */}
            <div className="lg:w-[38%] flex flex-col gap-3 w-full">
              {benefitsList.map((b, i) => {
                const IconComponent = b.icon;
                const isActive = activeBenefitIdx === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveBenefitIdx(i)}
                    className={`benefit-list-item w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left cursor-pointer ${
                      isActive ? "active" : "border-slate-100 bg-white"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${b.theme.bg}`}>
                      <IconComponent className={`w-5 h-5 ${b.theme.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#0f172a] font-jakarta leading-tight">{b.title}</p>
                      <p className={`text-xs mt-0.5 font-medium ${isActive ? "text-[#dc2626]" : "text-slate-400"}`}>
                        {isActive ? "Mostrando detalles" : "Ver cobertura e información"}
                      </p>
                    </div>

                    {isActive && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* RIGHT — Active Benefit Detail Panel (Imagen 1) */}
            <div className="lg:flex-1 w-full min-h-[520px]">
              {(() => {
                const b = benefitsList[activeBenefitIdx];
                const IconComponent = b.icon;
                const accentColor = b.theme.accentColor;
                return (
                  <div key={activeBenefitIdx} className="benefit-panel-enter bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col">
                    
                    {/* Top Image Strip */}
                    <div className="relative h-56 overflow-hidden bg-slate-900">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      
                      <div
                        className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold font-geist text-white uppercase tracking-wider shadow-md"
                        style={{ backgroundColor: accentColor }}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        {b.title}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-7 flex flex-col gap-6">

                      {/* Header block */}
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${b.theme.bg}`}>
                          <IconComponent className={`w-6 h-6 ${b.theme.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-extrabold text-[#0f172a] font-jakarta leading-tight">{b.title}</h3>
                          <span className={`inline-block font-geist text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1.5 ${b.theme.badgeBg}`}>
                            {b.tagline}
                          </span>
                        </div>
                      </div>

                      {/* Long Description */}
                      <p className="text-slate-600 text-sm leading-relaxed font-jakarta">
                        {b.longDesc}
                      </p>

                      {/* QUÉ INCLUYE Checklist */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-geist">
                          QUÉ INCLUYE
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                          {b.checklist.map((item, idx2) => (
                            <div key={idx2} className="check-item flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-1.5 px-2 rounded-lg hover:bg-red-50/50">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* VENTAJAS CLAVE Badges */}
                      <div className="space-y-2.5">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-geist">
                          VENTAJAS CLAVE
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {b.advantages.map((adv, idx3) => (
                            <span key={idx3} className="adv-badge px-3 py-1 rounded-full text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 flex items-center gap-1.5 shadow-sm">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              {adv}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CONSEJO EDULAB Callout */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 flex items-start gap-3 mt-2">
                        <Sparkles className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-700 font-medium leading-relaxed">
                          <strong className="font-bold text-[#00135B]">CONSEJO EDULAB: </strong>
                          {b.tip}
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          4. MODALIDADES DE BECA Y CRITERIOS DE ELECCIÓN
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Convocatoria 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00135B]">
              Criterios de Elección & Requisitos
            </h2>
            <p className="text-slate-600 text-sm font-light">
              Condiciones académicas e institucionales para postular a las Becas Fundación Carolina:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((req, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-blue-50 text-[#00135B] flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: `${req.color}15`, color: req.color }}
                  >
                    {req.priority}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#00135B]">{req.name}</h3>
                <p className="text-xs text-slate-500 font-light">{req.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          5. CALCULADORA INTERACTIVA DE ELEGIBILIDAD FUNDACIÓN CAROLINA
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-50/50 border-y border-blue-100">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-white text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Simulador en Tiempo Real
            </span>
            <h2 className="text-3xl font-extrabold text-[#00135B]">
              Calculadora de Elegibilidad Fundación Carolina
            </h2>
            <p className="text-slate-600 text-sm font-light">
              Verifica si tu perfil académico cumple los requisitos de admisión para España.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-blue-100 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                  1. Modalidad a Postular
                </label>
                <select
                  value={calcLevel}
                  onChange={(e) => setCalcLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 font-semibold text-sm focus:outline-none focus:border-[#5D8CE2]"
                >
                  <option value="posgrado">Programa de Máster / Posgrado</option>
                  <option value="doctorado">Programa de Doctorado</option>
                  <option value="investigacion">Estancia de Investigación Postdoctoral</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                    2. Promedio Académico (0 a 100)
                  </label>
                  <span className="text-sm font-extrabold text-[#DC2626]">{calcGpa} / 100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={calcGpa}
                  onChange={(e) => setCalcGpa(Number(e.target.value))}
                  className="w-full accent-[#00135B] cursor-pointer"
                />
              </div>

              <div className="space-y-2 text-xs md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input type="checkbox" checked={calcIberoamerican} onChange={e => setCalcIberoamerican(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Nacional de país iberoamericano
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input type="checkbox" checked={calcNoSpainResidency} onChange={e => setCalcNoSpainResidency(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  No residir en España
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input type="checkbox" checked={calcDegreeHeld} onChange={e => setCalcDegreeHeld(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Título de Licenciatura en mano
                </label>
              </div>

            </div>

            <div className={`p-6 rounded-2xl border ${
              isFullyEligible
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}>
              <div className="flex items-start gap-4">
                {isFullyEligible ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h3 className="font-bold text-[#00135B]">
                    {isFullyEligible ? "¡Perfil Elegible para Becas Fundación Carolina!" : "Revisión de Requisitos Necesaria"}
                  </h3>
                  <p className="text-xs sm:text-sm font-light">
                    {isFullyEligible ? (
                      <>Tu perfil cumple las condiciones generales de nacionalidad, titulación y nota para solicitar hasta 5 programas de máster en España.</>
                    ) : (
                      <>Verifica contar con la ciudadanía iberoamericana, título universitario y nota mínima requerida.</>
                    )}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          6. GALERÍA DE VIDEOS (INCLUYE YOUTUBE SHORTS VERTICAL)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider">
                Multimedia & Testimonios
              </span>
              <h2 className="text-3xl font-extrabold text-[#00135B] mt-2">
                Conoce la Experiencia Fundación Carolina
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Incluye presentación oficial, YouTube Shorts vertical y testimonios de exbecarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {CAROLINA_VIDEOS.map((v) => (
              <div
                key={v.id}
                onClick={() => setModalVideo(v)}
                className="p-4 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg card-hover cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 group">
                    <img src={v.thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                      <div className="w-12 h-12 rounded-full bg-[#F5C542] text-[#00135B] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {v.isVertical && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center gap-1 shadow">
                        <Smartphone className="w-3 h-3" /> YouTube Short
                      </span>
                    )}
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold">
                    {v.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#00135B] leading-tight">{v.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 font-light">{v.desc}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#00135B]">
                  <span>Abrir reproductor</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#5D8CE2]" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          7. PREGUNTAS FRECUENTES OFICIALES
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Banco de Respuestas
            </span>
            <h2 className="text-3xl font-extrabold text-[#00135B]">
              Preguntas Frecuentes — Becas Carolina
            </h2>
            <p className="text-slate-500 text-sm font-light">
              Respuestas oficiales para el proceso de selección de posgrado en España:
            </p>

            <div className="pt-4 max-w-md mx-auto relative">
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Buscar duda (ej: posgrado, matrícula, visa)..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#5D8CE2] shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <FaqItem key={idx} q={faq.q} a={faq.a} />
              ))
            ) : (
              <p className="text-center text-xs text-slate-400 py-6">
                No se encontraron preguntas que coincidan con &ldquo;{faqSearch}&rdquo;.
              </p>
            )}
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          8. FOOTER BANNER CTA
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#00135B] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-[#F5C542]">
            <GraduationCap className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black leading-tight">
            ¿Listo para estudiar tu posgrado en <span style={{ color: "#F5C542" }}>España</span>?
          </h2>

          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Comienza hoy tu postulación a las Becas Fundación Carolina con la guía y el soporte inteligente de EDULAB.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleApply}
              className="px-8 py-4 rounded-full font-bold text-[#00135B] text-base transition-all hover:scale-105 cursor-pointer"
              style={{ background: "#F5C542", boxShadow: "0 4px 20px rgba(245,197,66,0.4)" }}
            >
              Iniciar postulación con IA
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-4 rounded-full font-bold text-white text-base hover:bg-white/10 border border-white/30 transition-all cursor-pointer"
            >
              Volver al Inicio
            </button>
          </div>

          {/* Social Media Links */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/70">
            <span>Redes Oficiales Fundación Carolina:</span>
            <a
              href="https://www.facebook.com/fundacioncarolina"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <FacebookIcon className="w-4 h-4 text-blue-400" />
              Facebook
            </a>
            <a
              href="https://www.youtube.com/@RedCarolina"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <YoutubeIcon className="w-4 h-4 text-red-400" />
              YouTube Red Carolina
            </a>
            <a
              href="https://www.instagram.com/fundacioncarolina/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400" />
              Instagram
            </a>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          VENTANA EMERGENTE DE VIDEO (POPUP VIDEO MODAL)
         ───────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalVideo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-slate-900 border border-white/20 rounded-3xl w-full overflow-hidden shadow-2xl space-y-4 p-6 relative ${
                modalVideo.isVertical ? "max-w-md" : "max-w-3xl"
              }`}
            >
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5C542] text-[#00135B] font-extrabold text-xs uppercase">
                    {modalVideo.category}
                  </span>
                  <h3 className="text-white font-bold text-base truncate">{modalVideo.title}</h3>
                </div>
                <button
                  onClick={() => setModalVideo(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Frame */}
              <div className={`w-full rounded-2xl overflow-hidden bg-black border border-white/10 ${
                modalVideo.isVertical ? "aspect-[9/16]" : "aspect-video"
              }`}>
                <iframe
                  className="w-full h-full border-none"
                  src={modalVideo.embedUrl}
                  title={modalVideo.title}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Footer info */}
              <div className="text-xs text-slate-300 font-light flex items-center justify-between">
                <span className="truncate pr-2">{modalVideo.desc}</span>
                <button
                  onClick={() => setModalVideo(null)}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all shrink-0 cursor-pointer"
                >
                  Cerrar ventana
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth Modal Trigger */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-5 border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-[#00135B]/10 flex items-center justify-center mx-auto text-[#00135B]">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-[#00135B]">Inicia sesión para postular</h3>
            <p className="text-sm text-slate-500">Crea tu cuenta gratis o inicia sesión para postularte a las Becas Fundación Carolina con el apoyo de IA de EDULAB.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setShowAuthModal(false); navigate("/login"); }}
                className="w-full py-3 rounded-xl bg-[#00135B] text-white font-bold text-sm hover:bg-[#0d288c] transition-all">
                Iniciar sesión
              </button>
              <button onClick={() => { setShowAuthModal(false); navigate("/register"); }}
                className="w-full py-3 rounded-xl border border-[#00135B] text-[#00135B] font-bold text-sm hover:bg-[#00135B]/5 transition-all">
                Crear cuenta gratis
              </button>
              <button onClick={() => setShowAuthModal(false)} className="text-xs text-slate-400 hover:text-slate-600 transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// FAQ Accordion Item
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        borderColor: open ? "#DC2626" : "rgba(220,38,38,0.15)",
        background: open ? "rgba(220,38,38,0.04)" : "white",
        boxShadow: open ? "0 4px 20px rgba(220,38,38,0.1)" : "none"
      }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer">
        <span className="font-semibold text-[#00135B] text-sm pr-4">{q}</span>
        <ChevronDown
          className="w-5 h-5 text-[#DC2626] shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}
