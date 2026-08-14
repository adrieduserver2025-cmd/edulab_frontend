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

// Import local assets from src/assets/beca_gks_koreasur/imagenes
import gksLogo from "../../assets/beca_gks_koreasur/imagenes/logo-Global-Korea-Scholarship.png";
import snuLogo from "../../assets/beca_gks_koreasur/imagenes/LOGO SEOL NATIONAL UNIVERSITY.jpeg";
import pusanLogo from "../../assets/beca_gks_koreasur/imagenes/LOGO Universidad Nacional de Pusan.jfif";
import yonseiLogo from "../../assets/beca_gks_koreasur/imagenes/Universidad Yonsei.jfif";
import koreaUnivLogo from "../../assets/beca_gks_koreasur/imagenes/Universidad de Corea (Korea University).png";
import gksPhoto1 from "../../assets/beca_gks_koreasur/imagenes/630ff758-4652-475e-8ab9-f57b5176bde0.jpg";
import gksPhoto2 from "../../assets/beca_gks_koreasur/imagenes/7-e2s8PQ4HqWqE-JGvHJYKrKxrw8fAhqcmzFCAd6LzgRRONM9_tYTaqzE8_FmME2RPjrGMoQyVw2dQPnp_JjFbhRxb2CxQ29xEoE7TEQ6I-GYoz9LucZGdeie5wLaeNZqSQpL4bQqv6PW2DQzpYdkEQJAluXY_AtW4Nj4zefAVOibnjM2v2SWx1fAxnvWX0s.jfif";
import gksPhoto3 from "../../assets/beca_gks_koreasur/imagenes/images (7).jfif";
import gksPhoto4 from "../../assets/beca_gks_koreasur/imagenes/yKGaBbqbnx4UYMTaXkhc_olFv6PN5XLqkZPat560kOV6vO6lRIymDghaMxNwYNEhQNCPXH4RfhPcAIMij1dgeGpSLXs6FFm_BtlPDZ_rXEeerjxXPGGHZlQCuhzhI3xbrRVCcyJcMLblPt0GzUWyp25HzUV9D7fbj1O5fK7Vhd7Z312NBcOfsah1GvoYhwiQ.jfif";

// Social Icons Components
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

// Types for Videos
interface GksVideo {
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

const GKS_VIDEOS: GksVideo[] = [
  {
    id: "v1",
    title: "Presentación Oficial Beca GKS Corea del Sur",
    category: "Presentación Oficial",
    desc: "Video de bienvenida e introducción oficial al programa Global Korea Scholarship por el Gobierno de Corea.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=FdrTbOMqnNE",
    embedUrl: "https://www.youtube.com/embed/FdrTbOMqnNE?autoplay=1",
    thumb: gksPhoto1
  },
  {
    id: "v2",
    title: "Experiencia de Estudio y Vida en Corea (GKS Testimonio 1)",
    category: "Testimonio & Vida Universitaria",
    desc: "Vivencia real de estudiantes internacionales en el año de idioma coreano y vida en el campus universitario.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=9tQGjg-OumM",
    embedUrl: "https://www.youtube.com/embed/9tQGjg-OumM?autoplay=1",
    thumb: gksPhoto2
  },
  {
    id: "v3",
    title: "Consejos para Postular a la Beca GKS (GKS Testimonio 2)",
    category: "Testimonios",
    desc: "Estrategias para la carta de recomendación, ensayo de estudio y entrevista en la Embajada o Universidad.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=1R5icIaoddw",
    embedUrl: "https://www.youtube.com/embed/1R5icIaoddw?autoplay=1",
    thumb: gksPhoto4
  },
  {
    id: "v4",
    title: "Resumen Rápido Beca GKS (Video Vertical Short)",
    category: "Short Informativo",
    desc: "Guía práctica en formato vertical con los montos de asignación mensual, pasajes y requisitos esenciales.",
    type: "shorts",
    url: "https://www.youtube.com/watch?v=Cmtg0T3ugng",
    embedUrl: "https://www.youtube.com/embed/Cmtg0T3ugng?autoplay=1",
    thumb: gksPhoto3,
    isVertical: true
  }
];

export default function GksPage() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [programId, setProgramId] = useState<number | null>(null);

  // Video Modal State (Ventana Emergente)
  const [modalVideo, setModalVideo] = useState<GksVideo | null>(null);

  // Benefit Details Master-Detail Selection (Imagen 1 style)
  const [activeBenefitIdx, setActiveBenefitIdx] = useState<number>(0);

  // FAQ Search State
  const [faqSearch, setFaqSearch] = useState("");

  // Calculator State
  const [calcGpa, setCalcGpa] = useState<number>(85);
  const [calcAge, setCalcAge] = useState<number>(26);
  const [calcLevel, setCalcLevel] = useState<string>("posgrado");
  const [calcNonKorean, setCalcNonKorean] = useState<boolean>(true);
  const [calcDegree, setCalcDegree] = useState<boolean>(true);

  const gpaPasses = calcGpa >= 80;
  const agePasses = calcLevel === "posgrado" ? calcAge <= 40 : calcAge <= 25;
  const isFullyEligible = gpaPasses && agePasses && calcNonKorean && calcDegree;

  // Auto-open welcome video popup modal on entry after 1s
  useEffect(() => {
    const timer = setTimeout(() => {
      setModalVideo(GKS_VIDEOS[0]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load backend program ID
  useEffect(() => {
    async function loadProgram() {
      try {
        const res = await axiosClient.get("/opportunities/gks-korea-beca");
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
      title: "Matrícula y Tasas 100% Cubiertas",
      tagline: "Financiamiento Estatal NIIED",
      desc: "Exención total de costos universitarios, tasas de admisión y formación en instituciones públicas y privadas de Corea.",
      longDesc: "El Gobierno de Corea del Sur subvenciona el 100% del importe de la matrícula universitaria y tasas de admisión. Si el costo excede el límite estándar, la universidad receptora asume el excedente.",
      checklist: [
        "Matriculación académica completa en grado o posgrado",
        "Tasas administrativas y derechos de admisión",
        "Acceso ilimitado a bibliotecas y laboratorios de investigación",
        "Expedición oficial de diplomas al graduarse"
      ],
      advantages: [
        "Sin desembolso académico del becario",
        "Acceso a universidades top mundial (SKY)",
        "Respaldo oficial del Gobierno de Corea"
      ],
      tip: "Puedes postular por la Ruta Embajada (hasta 3 universidades) o por la Ruta Universidad (1 universidad).",
      image: gksPhoto1,
      theme: { bg: "bg-red-50/50", iconColor: "text-red-600", badgeBg: "bg-red-50 text-red-700", accentColor: "#dc2626" }
    },
    {
      icon: Wallet,
      title: "Estipendio Mensual de Manutención",
      tagline: "1.000.000 KRW / mes",
      desc: "Asignación mensual de 1.000.000 KRW (posgrado) o 900.000 KRW (pregrado) para vida cotidiana.",
      longDesc: "Depósito mensual puntual directamente en tu cuenta bancaria coreana para cubrir gastos de residencia, alimentación, transporte público y necesidades personales durante todo el programa.",
      checklist: [
        "1.000.000 KRW/mes para máster y doctorado",
        "900.000 KRW/mes para estudiantes de licenciatura",
        "Pagos continuos durante periodos académicos y recesos",
        "Transferencia SEPA / bancaria local automática"
      ],
      advantages: [
        "Suficiente para residencias universitarias o pisos",
        "Sin requisito de rendición de comprobantes personales",
        "Estabilidad económica total"
      ],
      tip: "Las residencias universitarias en Corea suelen incluir servicios y facilidades a costo muy accesible.",
      image: gksPhoto2,
      theme: { bg: "bg-blue-50/50", iconColor: "text-blue-600", badgeBg: "bg-blue-50 text-blue-700", accentColor: "#2563eb" }
    },
    {
      icon: Plane,
      title: "Pasajes Aéreos Internacionales",
      tagline: "Ida y Vuelta a Seúl",
      desc: "Boleto aéreo de ida a Corea del Sur al iniciar el programa y de retorno a tu país al finalizar.",
      longDesc: "NIIED emite el pasaje internacional en clase turista desde el aeropuerto principal de tu país de origen hacia Corea del Sur y el billete de regreso al completar los estudios.",
      checklist: [
        "Vuelo internacional de ida a Seúl (Incheon)",
        "Vuelo internacional de regreso al graduarse",
        "Equipaje facturado incluido según aerolínea",
        "Gestión directa sin adelanto de dinero"
      ],
      advantages: [
        "Cero coste de viaje internacional",
        "Logística coordinada por la organización",
        "Bono de traslado de llegada"
      ],
      tip: "EduLab te asiste en la tramitación del visado de estudios D-2 o D-4 en la Embajada de Corea.",
      image: gksPhoto4,
      theme: { bg: "bg-amber-50/50", iconColor: "text-amber-600", badgeBg: "bg-amber-50 text-amber-700", accentColor: "#d97706" }
    },
    {
      icon: Languages,
      title: "Curso Intensivo de Coreano (1 año 100%)",
      tagline: "Formación Lingüística Total",
      desc: "1 año académico completo de inmersión en idioma coreano en un centro lingüístico universitario.",
      longDesc: "Formación intensiva de idioma coreano previa al inicio de la carrera. La beca cubre 100% el costo del curso y otorga un bono adicional de 100.000 KRW/mes a quienes alcancen TOPIK Nivel 5 o 6.",
      checklist: [
        "1 año completo de clases intensivas de idioma",
        "Materiales de estudio y exámenes TOPIK incluidos",
        "Certificación de suficiencia idiomática",
        "Premio de 100.000 KRW/mes por TOPIK Nivel 5 o 6"
      ],
      advantages: [
        "Dominio fluido del idioma coreano",
        "Inmersión cultural profunda",
        "Incentivo económico por excelencia de idioma"
      ],
      tip: "Quienes ya poseen TOPIK Nivel 5 o 6 están exentos del año de idioma e ingresan directo al grado o posgrado.",
      image: gksPhoto3,
      theme: { bg: "bg-emerald-50/50", iconColor: "text-emerald-600", badgeBg: "bg-emerald-50 text-emerald-700", accentColor: "#059669" }
    },
    {
      icon: Shield,
      title: "Seguro Médico & Subsidio de Instalación",
      tagline: "Cobertura Médica + 200.000 KRW",
      desc: "Seguro médico de salud Nacional (NHIS) + Subsidio único inicial de 200.000 KRW al llegar a Corea.",
      longDesc: "Inscripción en el Seguro Nacional de Salud de Corea (NHIS) con cobertura médica completa, más un pago único de 200.000 KRW a la llegada para compras iniciales y adaptación.",
      checklist: [
        "Pago de prima del Seguro Nacional de Salud de Corea (NHIS)",
        "Atención médica, urgencias y hospitalización",
        "200.000 KRW iniciales para gastos de instalación",
        "Incentivo de finalización de estudios de 100.000 KRW"
      ],
      advantages: [
        "Acceso al moderno sistema de salud de Corea",
        "Ayuda financiera inmediata al aterrizar",
        "Protección médica total"
      ],
      tip: "Guarda tu tarjeta NHIS para atención con descuento en cualquier clínica o centro hospitalario de Corea.",
      image: snuLogo,
      theme: { bg: "bg-purple-50/50", iconColor: "text-purple-600", badgeBg: "bg-purple-50 text-purple-700", accentColor: "#7c3aed" }
    },
    {
      icon: Sparkles,
      title: "Mentoría & Asistente IA EDULAB",
      tagline: "Acompañamiento Personalizado",
      desc: "Soporte de Inteligencia Artificial y mentores para preparar tu expediente GKS y ensayar entrevistas.",
      longDesc: "Herramientas de IA para redactar la carta de motivación (Personal Statement), la propuesta de plan de estudio (Statement of Purpose) y la equivalencia de tu GPA en la escala del 80%.",
      checklist: [
        "Calculador de GPA oficial en escala 80% / 100%",
        "Asistente IA para Personal Statement & Study Plan",
        "Orientación en la elección de Ruta Embajada vs. Universidad",
        "Simulacros de entrevista consular"
      ],
      advantages: [
        "Maximiza tu puntuación de preselección",
        "Revisión de documentos según guías NIIED",
        "Acompañamiento de mentores ex-becarios GKS"
      ],
      tip: "EduLab te guía paso a paso para legalizar o apostillar tus certificados de estudio ante la Cancillería.",
      image: gksLogo,
      theme: { bg: "bg-pink-50/50", iconColor: "text-pink-600", badgeBg: "bg-pink-50 text-pink-700", accentColor: "#db2777" }
    }
  ];

  const requirements = [
    { name: "Nacionalidad Extranjera", priority: "Obligatorio", color: "#ef4444", desc: "El solicitante y ambos padres deben tener una nacionalidad distinta a la coreana." },
    { name: "Límite de Edad", priority: "Obligatorio", color: "#ef4444", desc: "Menor de 40 años para Posgrado (nacido después de 1 sept 1986) / Menor de 25 para Pregrado." },
    { name: "GPA mínimo de 80%", priority: "Obligatorio", color: "#ef4444", desc: "Promedio acumulado de al menos 80% o estar en el top 20% del programa académico anterior." },
    { name: "Título de Grado o Maestría", priority: "Obligatorio", color: "#ef4444", desc: "Poseer título universitario oficial para posgrado, o bachillerato formalizado para pregrado." },
    { name: "Salud Física y Mental", priority: "Obligatorio", color: "#ef4444", desc: "Gozar de buena salud física y mental certificada mediante formulario oficial GKS." },
    { name: "Personal Statement & Study Plan", priority: "Importante", color: "#f59e0b", desc: "Redacción de la carta de presentación y plan detallado de estudios en inglés o coreano." },
    { name: "2 Cartas de Recomendación", priority: "Importante", color: "#f59e0b", desc: "Recomendaciones académicas en sobre sellado o firmadas oficialmente." },
    { name: "Prohibición de Doble Postulación", priority: "Recomendado", color: "#22c55e", desc: "Elegir exclusivamente Ruta Embajada O Ruta Universidad (no ambas)." }
  ];

  // Official FAQ items for GKS
  const OFFICIAL_FAQS = [
    {
      q: "¿Qué cubre la Beca GKS del Gobierno de Corea?",
      a: "La beca GKS ofrece financiamiento 100% integral: pasajes aéreos de ida y vuelta a Seúl, 100% de la matrícula universitaria, curso intensivo de idioma coreano de 1 año, estipendio mensual de 1.000.000 KRW (posgrado) o 900.000 KRW (pregrado), seguro médico de salud NHIS y subsidio único de instalación de 200.000 KRW."
    },
    {
      q: "¿Cuál es la diferencia entre la Ruta Embajada y la Ruta Universidad?",
      a: "En la Ruta Embajada (Embassy Track), postulas ante la Embajada de Corea en tu país de origen y puedes seleccionar hasta 3 universidades distintas. En la Ruta Universidad (University Track), aplicas directamente a 1 sola universidad coreana."
    },
    {
      q: "¿Es necesario saber idioma coreano antes de postular?",
      a: "No es obligatorio. El programa incluye 1 año completo de formación intensiva en idioma coreano en un centro universitario especializado. Si ya cuentas con certificación TOPIK Nivel 5 o 6, ingresas directamente a la carrera y recibes un bono adicional de 100.000 KRW/mes."
    },
    {
      q: "¿Puedo postular por ambas rutas (Embajada y Universidad) al mismo tiempo?",
      a: "No. La doble postulación está estrictamente prohibida por NIIED. Si un candidato postula por ambas rutas simultáneamente, su candidatura será descalificada automáticamente."
    },
    {
      q: "¿Cómo se calcula el GPA de 80% requerido?",
      a: "Tu promedio de notas acumulado (GPA) debe ser igual o superior al 80% sobre 100 (ejemplo: 80/100, 3.0/4.0, 3.2/4.3 o 3.4/4.5) o certificar que te ubicas en el top 20% superior de tu promoción."
    },
    {
      q: "¿Pueden postular personas con ciudadanía coreana o padres coreanos?",
      a: "No. Tanto el solicitante como ambos padres deben poseer exclusivamente nacionalidad extranjera (distinta a la coreana)."
    },
    {
      q: "¿Cuándo abre la convocatoria del programa GKS?",
      a: "La convocatoria de Posgrado (Máster y Doctorado) abre habitualmente en febrero de cada año. La convocatoria de Pregrado (Licenciatura) abre habitualmente en septiembre."
    },
    {
      q: "¿Qué programas académicos están disponibles en la Beca GKS?",
      a: "Casi todas las disciplinas de Humanidades, Ciencias Sociales, Ciencias Naturales, Ingeniería, Artes e Investigación y Desarrollo (I+D) en más de 60 universidades asociadas de Corea del Sur."
    }
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
          1. HERO SECTION (ONLY WELCOME VIDEO PLAYER IN HERO AS REQUESTED)
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
                BECA GUBERNAMENTAL DE COREA DEL SUR 🇰🇷 NIIED
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                <span>Becas GKS </span>
                <span style={{ color: "#F5C542" }}>Corea del Sur</span>
              </h1>

              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl font-light">
                Programa de Beca Global de Corea (Global Korea Scholarship - NIIED). <strong className="text-white font-semibold">2.000 becas integrales anuales</strong> para estudios de pregrado, maestría y doctorado.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { icon: "🇰🇷", text: "Corea del Sur" },
                  { icon: "🎓", text: "Pregrado & Posgrado" },
                  { icon: "💰", text: "100% Integral + Estipendio" },
                  { icon: "🗣", text: "Coreano / Inglés" },
                ].map(tag => (
                  <span key={tag.text} className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1.5"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                    <span>{tag.icon}</span> <span>{tag.text}</span>
                  </span>
                ))}
              </div>

              {/* Action Buttons — Main Apply + AI Apply + Study in Korea Link */}
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

                <a
                  href="https://www.studyinkorea.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white text-sm transition-all hover:bg-white/10 cursor-pointer"
                  style={{ border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
                >
                  <Globe className="w-4 h-4 text-[#F5C542]" />
                  Study in Korea (NIIED)
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              {/* Attributes Banner */}
              <div className="p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 w-full"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {[
                  { icon: "💰", label: "Estipendio", val: "1.000.000 KRW/mes" },
                  { icon: "✈️", label: "Vuelos", val: "100% Cubiertos" },
                  { icon: "🗣", label: "Idioma", val: "1 año Coreano 100%" },
                  { icon: "📅", label: "Postulación", val: "Febrero / Septiembre" },
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
                  { val: "2.000", label: "Becas anuales mundiales" },
                  { val: "60+", label: "Universidades en Corea" },
                  { val: "100%", label: "Matrícula + Vuelos + Seguro" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-2xl font-black" style={{ color: "#F5C542" }}>{s.val}</div>
                    <div className="text-white/70 text-xs font-medium mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Video Player Box — ONLY THE WELCOME VIDEO AS REQUESTED */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950 relative border border-white/20 p-2 space-y-3">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black group">
                  <iframe
                    className="w-full h-full border-none"
                    src={GKS_VIDEOS[0].embedUrl.replace("autoplay=1", "autoplay=0")}
                    title={GKS_VIDEOS[0].title}
                    allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />

                  <button
                    onClick={() => setModalVideo(GKS_VIDEOS[0])}
                    className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-[#00135B] text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-[#F5C542]" />
                    Modo Ventana Emergente
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#F5C542] text-[#00135B] font-extrabold text-[10px] uppercase">
                      {GKS_VIDEOS[0].category}
                    </span>
                    <span className="text-xs font-bold truncate">{GKS_VIDEOS[0].title}</span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-relaxed font-light">{GKS_VIDEOS[0].desc}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          2. MANIFIESTO Y UNIVERSIDADES ASOCIADAS EN COREA (SKY UNIVERSITIES)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-50/40 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-blue-100 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-28 rounded-2xl bg-white border border-gray-100 p-2 shadow-md flex items-center justify-center shrink-0">
              <img src={gksLogo} alt="Logo Beca GKS" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00135B]/5 border border-[#00135B]/15 text-[#00135B] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#5D8CE2]" />
                Instituto Nacional para la Educación Internacional (NIIED)
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#00135B] leading-snug border-l-4 border-[#F5C542] pl-4">
                &ldquo;Fomentar el talento global y establecer redes internacionales invitando a los mejores estudiantes del mundo a Corea del Sur.&rdquo;
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                El Programa GKS (Global Korea Scholarship) brinda a estudiantes internacionales oportunidades de formación académica, exención total de matrícula, pasajes aéreos, seguro médico y un año intensivo de inmersión en idioma coreano en universidades de máximo prestigio mundial.
              </p>

              {/* Official Social Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Canal Oficial Embajada / NIIED:</span>
                <a
                  href="https://www.facebook.com/profile.php?id=61560771421161"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-all"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  Facebook Embajada de Corea
                </a>
                <a
                  href="https://www.studyinkorea.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition-all"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  Portal Study in Korea
                </a>
              </div>
            </div>
          </div>

          {/* Associated Universities Showcase (SNU, Korea Univ, Yonsei, Pusan) */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-geist">
                UNIVERSIDADES ASOCIADAS DESTACADAS EN COREA (SKY & TOP UNIVERSITIES)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Seoul National University", logo: snuLogo, tag: "SNU - Posición #1 en Corea" },
                { name: "Korea University", logo: koreaUnivLogo, tag: "Universidad de Corea" },
                { name: "Yonsei University", logo: yonseiLogo, tag: "Universidad Yonsei" },
                { name: "Pusan National University", logo: pusanLogo, tag: "Univ. Nacional de Pusan" },
              ].map((u) => (
                <div key={u.name} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center space-y-2">
                  <div className="w-20 h-16 flex items-center justify-center">
                    <img src={u.logo} alt={u.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="font-bold text-xs text-[#00135B]">{u.name}</div>
                  <span className="text-[10px] text-slate-400 font-medium">{u.tag}</span>
                </div>
              ))}
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
              Beneficios de la Beca
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0f172a] font-jakarta">
              ¿Qué incluye la Beca GKS?
            </h2>
            <p className="text-slate-500 text-sm md:text-base mt-4 max-w-2xl mx-auto font-light">
              Explora la cobertura 100% integral otorgada por el Gobierno de Corea del Sur para tus estudios académicos.
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
          4. RUTAS DE POSTULACIÓN (EMBASSY TRACK VS. UNIVERSITY TRACK)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Rutas de Postulación Oficiales
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00135B]">
              ¿Por cuál ruta postular a la Beca GKS?
            </h2>
            <p className="text-slate-600 text-sm font-light">
              El Gobierno de Corea distribuye las 2.000 becas anuales a través de dos modalidades principales:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Embassy Track Card */}
            <div className="p-8 rounded-3xl bg-white border border-blue-100 shadow-lg space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#00135B] font-extrabold text-xs">
                    Ruta Embajada (Embassy Track)
                  </span>
                  <span className="text-2xl font-black text-[#00135B]">800 Cupos</span>
                </div>
                <h3 className="text-xl font-bold text-[#00135B]">Postulación a través de la Embajada de Corea</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Presentas tu expediente directamente ante la Embajada de Corea en tu país de origen. Permite seleccionar hasta <strong className="font-bold text-[#00135B]">3 universidades distintas</strong>.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    Elección de 3 universidades (al menos 1 de Tipo B)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    Evaluación consular inicial en tu país
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    Revisión de expediente por NIIED y admisión final
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-[#00135B] font-semibold">
                Recomendada si deseas comparar opciones entre 3 instituciones universitarias.
              </div>
            </div>

            {/* University Track Card */}
            <div className="p-8 rounded-3xl bg-white border border-red-100 shadow-lg space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 font-extrabold text-xs">
                    Ruta Universidad (University Track)
                  </span>
                  <span className="text-2xl font-black text-[#DC2626]">1.200 Cupos</span>
                </div>
                <h3 className="text-xl font-bold text-[#00135B]">Postulación directa a la Universidad receptora</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Envías tu expediente directamente a la oficina de admisiones de <strong className="font-bold text-[#00135B]">1 sola universidad coreana</strong> participante en programas General, R-GKS o I+D.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    Enfoque directo en 1 programa especializado
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    Incluye cupos regionales (R-GKS) e Investigación (I+D)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    Evaluación por el departamento académico de destino
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 text-xs text-red-900 font-semibold">
                Ideal si tienes identificado un profesor o departamento específico en Corea.
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          5. SECCIÓN DEDICADA DE TESTIMONIOS Y EXPERIENCIAS EN VIDEO
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider">
                Experiencias de Becarios GKS
              </span>
              <h2 className="text-3xl font-extrabold text-[#00135B] mt-2">
                Vivencias y Consejos de Estudio en Corea
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Mira testimonios reales de estudiantes iberoamericanos en universidades de Corea del Sur.
            </p>
          </div>

          {/* Video Cards Grid with Uniform Height & Aspect-Video */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {GKS_VIDEOS.slice(1).map((v) => (
              <div
                key={v.id}
                onClick={() => setModalVideo(v)}
                className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
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

                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold">
                    {v.category}
                  </span>
                  <h3 className="text-base font-bold text-[#00135B] leading-tight">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">{v.desc}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#00135B] mt-4">
                  <span className="flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-[#5D8CE2]" /> Reproducir experiencia
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#5D8CE2]" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          6. CALCULADORA INTERACTIVA DE ELEGIBILIDAD GKS
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-50/50 border-y border-blue-100">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-white text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Simulador en Tiempo Real
            </span>
            <h2 className="text-3xl font-extrabold text-[#00135B]">
              Calculadora de Elegibilidad Beca GKS
            </h2>
            <p className="text-slate-600 text-sm font-light">
              Calcula si tu promedio académico (GPA 80%) y edad son elegibles según NIIED.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-blue-100 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                  1. Nivel de Estudios
                </label>
                <select
                  value={calcLevel}
                  onChange={(e) => setCalcLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 font-semibold text-sm focus:outline-none focus:border-[#5D8CE2]"
                >
                  <option value="posgrado">Programa de Posgrado (Máster / Doctorado)</option>
                  <option value="pregrado">Programa de Pregrado (Licenciatura)</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                    2. Promedio Académico (GPA 80% mín.)
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

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                  3. Edad del Candidato (Años)
                </label>
                <input
                  type="number"
                  min="16"
                  max="60"
                  value={calcAge}
                  onChange={(e) => setCalcAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 font-semibold text-sm focus:outline-none focus:border-[#5D8CE2]"
                />
              </div>

              <div className="space-y-2 text-xs flex flex-col justify-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input type="checkbox" checked={calcNonKorean} onChange={e => setCalcNonKorean(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Candidato y ambos padres de nacionalidad distinta a la coreana
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input type="checkbox" checked={calcDegree} onChange={e => setCalcDegree(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Título oficial de grado o certificado de egreso
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
                    {isFullyEligible ? "¡Perfil Elegible para Becas GKS del Gobierno de Corea!" : "Revisión de Requisitos Necesaria"}
                  </h3>
                  <p className="text-xs sm:text-sm font-light">
                    {isFullyEligible ? (
                      <>Tu promedio ({calcGpa}/100), edad ({calcAge} años) y condición de nacionalidad cumplen con la normativa del Ministerio de Educación de Corea (NIIED).</>
                    ) : (
                      <>Verifica contar con GPA mayor al 80% (o top 20%) y cumplir el límite de edad (menor de 40 para posgrado / menor de 25 para pregrado).</>
                    )}
                  </p>
                </div>
              </div>
            </div>

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
              Banco de Respuestas NIIED
            </span>
            <h2 className="text-3xl font-extrabold text-[#00135B]">
              Preguntas Frecuentes — Becas GKS
            </h2>
            <p className="text-slate-500 text-sm font-light">
              Respuestas oficiales para el proceso de selección de la Beca Global de Corea:
            </p>

            <div className="pt-4 max-w-md mx-auto relative">
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Buscar duda (ej: embajada, GPA, idioma, pasajes)..."
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
            ¿Listo para estudiar en <span style={{ color: "#F5C542" }}>Corea del Sur</span>?
          </h2>

          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Comienza hoy tu postulación al programa de Becas GKS con la ayuda inteligente de EDULAB.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleApply}
              className="px-8 py-4 rounded-full font-bold text-[#00135B] text-base transition-all hover:scale-105 cursor-pointer"
              style={{ background: "#F5C542", boxShadow: "0 4px 20px rgba(245,197,66,0.4)" }}
            >
              Iniciar postulación con IA
            </button>

            <a
              href="https://www.studyinkorea.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-full font-bold text-white text-base hover:bg-white/10 border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#F5C542]" />
              Study in Korea (NIIED)
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
          </div>

          {/* Social Media Links */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/70">
            <span>Redes Oficiales Embajada / NIIED:</span>
            <a
              href="https://www.facebook.com/profile.php?id=61560771421161"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <FacebookIcon className="w-4 h-4 text-blue-400" />
              Facebook Embajada de Corea
            </a>
            <a
              href="https://www.studyinkorea.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              Portal Study in Korea
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
            <p className="text-sm text-slate-500">Crea tu cuenta gratis o inicia sesión para postularte a las Becas GKS Corea del Sur con el apoyo de IA de EDULAB.</p>
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
