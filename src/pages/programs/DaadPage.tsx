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

// Import local assets from src/assets/beca_DAAD/imagenes
import daadLogo from "../../assets/beca_DAAD/imagenes/logo_daad_principal.png";
import heidelbergLogo from "../../assets/beca_DAAD/imagenes/heidelberg-university-logo.png";
import heidelbergPhoto from "../../assets/beca_DAAD/imagenes/Heidelberg_Universitäts.jpg";
import gottingenPhoto from "../../assets/beca_DAAD/imagenes/Göttingen_uni.jpg";
import gottingenLogo from "../../assets/beca_DAAD/imagenes/logo_uni_goten.jfif";
import tuBerlinPhoto from "../../assets/beca_DAAD/imagenes/UNI_Berlin_Charlottenburg_TU.jpg";
import bonnPhoto from "../../assets/beca_DAAD/imagenes/uni_bonn.jpg";
import bonnLogo from "../../assets/beca_DAAD/imagenes/UNI_Bonn_Logo.jpg";
import daadPhoto1 from "../../assets/beca_DAAD/imagenes/1748074637696-1.jpg";
import daadPhoto2 from "../../assets/beca_DAAD/imagenes/img.jpeg";
import daadPhoto3 from "../../assets/beca_DAAD/imagenes/img2.jpeg";

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
interface DaadVideo {
  id: string;
  title: string;
  category: string;
  desc: string;
  type: "youtube";
  url: string;
  embedUrl: string;
  thumb: string;
}

const DAAD_VIDEOS: DaadVideo[] = [
  {
    id: "v1",
    title: "Presentación Oficial Beca DAAD EPOS Alemania",
    category: "Presentación Oficial",
    desc: "Video de bienvenida e introducción al programa EPOS para estudios de posgrado en desarrollo sostenible en Alemania.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=bB_BaCSAxCw",
    embedUrl: "https://www.youtube.com/embed/bB_BaCSAxCw?autoplay=1",
    thumb: daadPhoto1
  },
  {
    id: "v2",
    title: "Experiencia de Becario DAAD en Alemania (Testimonio 1)",
    category: "Testimonio & Vida Universitaria",
    desc: "Testimonio real sobre el proceso de adaptación, el año de posgrado y el ecosistema académico alemán.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=8KodgCsmir0",
    embedUrl: "https://www.youtube.com/embed/8KodgCsmir0?autoplay=1",
    thumb: daadPhoto2
  },
  {
    id: "v3",
    title: "Consejos de Postulación y Cartas (Testimonio 2)",
    category: "Testimonios",
    desc: "Recomendaciones clave para certificar la experiencia laboral de 2 años y preparar la propuesta de impacto.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=rZS2YP4QOvg",
    embedUrl: "https://www.youtube.com/embed/rZS2YP4QOvg?autoplay=1",
    thumb: daadPhoto3
  },
  {
    id: "v4",
    title: "Requisitos y Documentación Obligatoria DAAD EPOS",
    category: "Guía de Requisitos",
    desc: "Explicación detallada de los requisitos de admisión, traducción de títulos y formularios oficiales DAAD.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=VzK-8aveKEk",
    embedUrl: "https://www.youtube.com/embed/VzK-8aveKEk?autoplay=1",
    thumb: heidelbergPhoto
  }
];

const DAAD_HERO_SLIDES = [
  { url: gottingenPhoto, title: "Universität Göttingen · Alemania" },
  { url: heidelbergPhoto, title: "Heidelberg Universität · Alemania" },
  { url: tuBerlinPhoto, title: "Technische Universität Berlin · Alemania" },
  { url: bonnPhoto, title: "Rheinische Friedrich-Wilhelms-Universität Bonn" },
  { url: daadPhoto1, title: "Campus Universitario DAAD · Alemania" }
];

export default function DaadPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const token = useAuthStore((s) => s.token);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [programId, setProgramId] = useState<number | null>(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Video Modal State (Ventana Emergente)
  const [modalVideo, setModalVideo] = useState<DaadVideo | null>(null);

  // Benefit Details Master-Detail Selection (Imagen 1 style)
  const [activeBenefitIdx, setActiveBenefitIdx] = useState<number>(0);

  // FAQ Search State
  const [faqSearch, setFaqSearch] = useState("");

  // Calculator State
  const [calcGpa, setCalcGpa] = useState<number>(82);
  const [calcExperienceYears, setCalcExperienceYears] = useState<number>(2);
  const [calcDegreeHeld, setCalcDegreeHeld] = useState<boolean>(true);
  const [calcLanguageLevel, setCalcLanguageLevel] = useState<boolean>(true);
  const [calcDegreeAge, setCalcDegreeAge] = useState<number>(3);

  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIdx((prev) => (prev + 1) % DAAD_HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const expPasses = calcExperienceYears >= 2;
  const degreeAgePasses = calcDegreeAge <= 6;
  const isFullyEligible = expPasses && degreeAgePasses && calcDegreeHeld && calcLanguageLevel && calcGpa >= 75;

  // Auto-open welcome video popup modal on entry after 1s
  useEffect(() => {
    const timer = setTimeout(() => {
      setModalVideo(DAAD_VIDEOS[0]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load backend program ID
  useEffect(() => {
    async function loadProgram() {
      try {
        const res = await axiosClient.get("/opportunities/daad-epos-beca");
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
      icon: Wallet,
      title: "Estipendio Mensual (934€ a 1.300€)",
      tagline: "Manutención Completa Garantizada",
      desc: "Asignación mensual de 934 euros para maestrías y 1.300 euros para doctorados durante toda la estancia en Alemania.",
      longDesc: "El Servicio Alemán de Intercambio Académico (DAAD) otorga una beca mensual de 934 € a estudiantes de máster y 1.300 € a becarios de doctorado depositados en una cuenta bancaria en Alemania.",
      checklist: [
        "934 € mensuales para estudiantes de Máster",
        "1.300 € mensuales para estudiantes de Doctorado",
        "Transferencias bancarias puntuales en euros SEPA",
        "Financiamiento durante periodo lectivo y recesos"
      ],
      advantages: [
        "Monto adecuado para el costo de vida en Alemania",
        "Estabilidad económica garantizada",
        "Sin deducciones fiscales"
      ],
      tip: "El estipendio mensual te permite cubrir el alquiler de vivienda y costo de vida holgadamente.",
      image: daadPhoto1,
      theme: { bg: "bg-[#00135B]/5", iconColor: "text-[#00135B]", badgeBg: "bg-[#00135B]/10 text-[#00135B]", accentColor: "#00135B" }
    },
    {
      icon: GraduationCap,
      title: "Matrícula y Tasas Universitarias",
      tagline: "Universidades Públicas de Alemania",
      desc: "Exención de aranceles académicos en maestrías y doctorados de la red de universidades EPOS.",
      longDesc: "Las universidades públicas alemanas participantes eximen los costos de matrícula académica. La beca cubre además las contribuciones semestrales (Semesterbeitrag) de transporte público.",
      checklist: [
        "Exención 100% de aranceles de matrícula universitaria",
        "Ticket semestral de transporte público regional (Semesterticket)",
        "Acceso a campus, bibliotecas y centros de investigación",
        "Expedición del título universitario al finalizar"
      ],
      advantages: [
        "Educación de rango mundial en Alemania",
        "Libre circulación en transporte público",
        "Sin tasas de investigación residuales"
      ],
      tip: "Puedes postular hasta a 3 programas máster del catálogo oficial EPOS en orden de preferencia.",
      image: bonnPhoto,
      theme: { bg: "bg-amber-50/50", iconColor: "text-amber-600", badgeBg: "bg-amber-50 text-amber-700", accentColor: "#d97706" }
    },
    {
      icon: Plane,
      title: "Pasajes Aéreos e Instalación",
      tagline: "Vuelos de Ida y Vuelta a Alemania",
      desc: "Subsidio de viaje internacional ida y vuelta + asignación única de instalación de 460 € al llegar.",
      longDesc: "Cubre los pasajes aéreos internacionales desde Latinoamérica hacia Alemania y de regreso al graduarse, junto con un estipendio único de 460 € para gastos iniciales de instalación.",
      checklist: [
        "Bolsa de viaje internacional de ida a Alemania",
        "Vuelo de regreso a Latinoamérica al concluir estudios",
        "Asignación única de instalación de 460 €",
        "Reembolso de gastos de visado nacional D"
      ],
      advantages: [
        "Emisión de boletos sin desembolso previo",
        "Subsidio adicional de llegada",
        "Tranquilidad logística internacional"
      ],
      tip: "EduLab te asiste en la reserva de tu cita de visado nacional D en la Embajada de Alemania.",
      image: gottingenPhoto,
      theme: { bg: "bg-blue-50/50", iconColor: "text-blue-600", badgeBg: "bg-blue-50 text-blue-700", accentColor: "#2563eb" }
    },
    {
      icon: Shield,
      title: "Seguro de Salud, Accidentes y RC",
      tagline: "Cobertura Médica Completa en Alemania",
      desc: "Póliza de seguro médico, de accidentes y de responsabilidad civil 100% pagada por el DAAD.",
      longDesc: "Cobertura sanitaria completa que cumple los estrictos requisitos alemanes de visado y residencia, incluyendo consultas médicas, especialidades, hospitalización y seguro de responsabilidad civil.",
      checklist: [
        "Atención médica primaria, especialistas y urgencias",
        "Cobertura hospitalaria y medicamentos con receta",
        "Seguro de responsabilidad civil (Haftpflichtversicherung)",
        "Cumplimiento 100% norma de extranjería en Alemania"
      ],
      advantages: [
        "Sin costo para el becario",
        "Acceso al prestigioso sistema médico alemán",
        "Respaldo total ante imprevistos"
      ],
      tip: "Recibirás tu certificado oficial de seguro médico digital antes de viajar a Alemania.",
      image: heidelbergPhoto,
      theme: { bg: "bg-emerald-50/50", iconColor: "text-emerald-600", badgeBg: "bg-emerald-50 text-emerald-700", accentColor: "#059669" }
    },
    {
      icon: Languages,
      title: "Curso Intensivo de Idioma Alemán",
      tagline: "Formación Lingüística Gratuita",
      desc: "Curso intensivo de idioma alemán de hasta 6 meses previo o paralelo a los estudios de posgrado.",
      longDesc: "Aunque el máster sea impartido en inglés, el DAAD ofrece un curso de idioma alemán totalmente gratuito antes de iniciar las clases para facilitar tu integración social y profesional en Alemania.",
      checklist: [
        "Curso intensivo de alemán de hasta 6 meses previo al inicio",
        "Alojamiento y estipendio mantenidos durante el curso de idioma",
        "Materiales didácticos y exámenes de nivel incluidos",
        "Acceso a la plataforma online de alemán del DAAD"
      ],
      advantages: [
        "Aprende alemán sin costo adicional",
        "Integración cultural acelerada en Alemania",
        "Aumento de empleabilidad europea"
      ],
      tip: "Saber alemán básico facilitará significativamente tus prácticas profesionales en empresas germanas.",
      image: tuBerlinPhoto,
      theme: { bg: "bg-purple-50/50", iconColor: "text-purple-600", badgeBg: "bg-purple-50 text-purple-700", accentColor: "#7c3aed" }
    },
    {
      icon: Sparkles,
      title: "Mentoría & Asistente IA EDULAB",
      tagline: "Acompañamiento Estratégico",
      desc: "Herramientas de IA para redactar la propuesta de desarrollo, CV Europass y preparar tu candidatura EPOS.",
      longDesc: "Soporte especializado para certificar los 2 años de experiencia profesional requeridos, estructurar tu carta de motivación (Letter of Motivation) ajustada a los ODS y preparar la documentación.",
      checklist: [
        "Asistente IA para carta de motivación dirigida al DAAD",
        "Revisión de certificados de trabajo de 2 años de experiencia",
        "Formato de CV Europass optimizado para Alemania",
        "Simulador de entrevista de preselección"
      ],
      advantages: [
        "Cumplimiento 100% de la rúbrica oficial DAAD EPOS",
        "Optimización de perfil profesional de desarrollo",
        "Asesoría personalizada paso a paso"
      ],
      tip: "Accede directamente al portal oficial del DAAD mediante el botón habilitado en esta página.",
      image: daadLogo,
      theme: { bg: "bg-pink-50/50", iconColor: "text-pink-600", badgeBg: "bg-pink-50 text-pink-700", accentColor: "#db2777" }
    }
  ];

  const requirements = [
    { name: "Título de Licenciatura / Grado", priority: "Obligatorio", color: "#ef4444", desc: "Poseer título universitario oficial de al menos 4 años de duración." },
    { name: "2 Años de Experiencia Profesional", priority: "Obligatorio", color: "#ef4444", desc: "Mínimo 2 años de experiencia laboral a tiempo completo tras graduarse (certificada por empleador)." },
    { name: "Antigüedad del Título < 6 Años", priority: "Obligatorio", color: "#ef4444", desc: "Su último título universitario no debe tener más de 6 años de haber sido emitido." },
    { name: "Idioma Inglés B2/C1 o Alemán", priority: "Obligatorio", color: "#ef4444", desc: "IELTS 6.0+, TOEFL iBT 80+ para programas en inglés, o TestDaF / DSH para alemán." },
    { name: "Carta de Motivación DAAD", priority: "Importante", color: "#f59e0b", desc: "Exposición detallada del impacto del programa en el desarrollo de tu país de origen." },
    { name: "2 Cartas de Recomendación", priority: "Importante", color: "#f59e0b", desc: "1 recomendación académica universitaria + 1 recomendación del empleador actual." },
    { name: "CV Formato Europass Firmado", priority: "Importante", color: "#f59e0b", desc: "Currículum Vitae firmado de puño y letra con historial profesional." },
    { name: "Compromiso de Retorno", priority: "Recomendado", color: "#22c55e", desc: "Plan para aplicar los conocimientos adquiridos en el sector público o privado de tu país." }
  ];

  // Official FAQ items for DAAD EPOS
  const OFFICIAL_FAQS = [
    {
      q: "¿Qué incluye la Beca DAAD EPOS en Alemania?",
      a: "La beca incluye un estipendio mensual de 934 € para máster (o 1.300 € para doctorado), exención total de matrícula universitaria, pasajes aéreos internacionales de ida y vuelta, seguro médico de salud y responsabilidad civil, asignación de instalación de 460 € y curso de idioma alemán gratuito."
    },
    {
      q: "¿Es obligatorio contar con 2 años de experiencia laboral?",
      a: "Sí. El programa EPOS (Development-Related Postgraduate Courses) exige acreditar al menos 2 años de experiencia profesional a tiempo completo en un área relevante para el desarrollo (ONGs, gobierno, empresas, investigación) tras haber obtenido el título de grado."
    },
    {
      q: "¿Se requiere saber idioma alemán para postular?",
      a: "No necesariamente. La mayoría de las maestrías EPOS se imparten totalmente en inglés y requieren certificado IELTS (6.0+) o TOEFL (80+). Sin embargo, para los programas dictados en alemán se exige certificado TestDaF o DSH."
    },
    {
      q: "¿A cuántos programas del catálogo EPOS puedo postular?",
      a: "Puedes solicitar un máximo de hasta 3 programas de posgrado del folleto oficial DAAD EPOS. Debes indicar el orden de prioridad (1ª, 2ª y 3ª opción) en la solicitud."
    },
    {
      q: "¿Existe un límite de antigüedad para el título universitario?",
      a: "Sí. Al momento de solicitar la beca, la fecha de expedición de tu título universitario no debe ser mayor a 6 años."
    },
    {
      q: "¿Dónde y cómo se presenta la solicitud?",
      a: "Para la mayoría de los programas EPOS, la postulación se envía directamente a la universidad alemana que imparte el máster, adjuntando el formulario oficial de solicitud del DAAD."
    },
    {
      q: "¿La beca cubre gastos para la familia del becario?",
      a: "Bajo ciertas condiciones y para estancias mayores a 6 meses, el DAAD puede otorgar complementos familiares para cónyuge e hijos, así como un subsidio de alquiler."
    },
    {
      q: "¿Cuándo vence el plazo de postulación?",
      a: "Los plazos varían según cada universidad del programa EPOS, habitualmente entre agosto y noviembre del año previo al inicio de los estudios (para iniciar en septiembre/octubre)."
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
          1. HERO SECTION WITH DYNAMIC BACKGROUND CAROUSEL & PROMINENT LOGO CARD
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="hero-pattern pt-28 pb-16 relative overflow-hidden text-white min-h-[580px] flex items-center">
        {/* Dynamic Background Carousel */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {DAAD_HERO_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlideIdx === idx ? "opacity-75 scale-105" : "opacity-0 scale-100"
              }`}
              style={{ transition: "opacity 1s ease-in-out, transform 7s ease-out" }}
            >
              <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
            </div>
          ))}
          {/* Deep Navy Gradient Overlay - Balanced for Vivid Background Photos */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 12, 48, 0.78) 0%, rgba(0, 19, 91, 0.52) 50%, rgba(0, 12, 48, 0.75) 100%)"
            }}
          />
        </div>

        {/* Interactive Slide Indicator (Bottom Right) */}
        <div className="absolute bottom-6 right-8 z-20 hidden md:flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-medium text-white shadow-xl">
          <span className="text-white/90 font-semibold">{DAAD_HERO_SLIDES[currentSlideIdx].title}</span>
          <div className="flex gap-1.5 ml-2">
            {DAAD_HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlideIdx === idx ? "w-6 bg-[#F5C542]" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-4 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Header */}
            <div className="lg:col-span-7 space-y-7 text-left drop-shadow-md">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold shadow-md"
                style={{ background: "rgba(0, 19, 91, 0.65)", borderColor: "rgba(245,197,66,0.5)", color: "#F5C542", backdropFilter: "blur(8px)" }}>
                <span className="w-2 h-2 rounded-full bg-[#F5C542] animate-pulse" />
                BECA INTERNACIONAL 🇩🇪 ALEMANIA — GOBIERNO ALEMÁN DAAD
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-lg">
                <span>Becas DAAD </span>
                <span style={{ color: "#F5C542" }}>EPOS Alemania</span>
              </h1>

              <p className="text-white/95 text-base sm:text-lg leading-relaxed max-w-xl font-medium drop-shadow-md">
                Posgrados orientados al desarrollo en las universidades públicas más destacadas de <strong className="text-white font-black underline decoration-[#F5C542]">Alemania</strong>. Financiamiento completo para profesionales.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { icon: "🇩🇪", text: "Alemania" },
                  { icon: "🎓", text: "Maestría / Doctorado" },
                  { icon: "💶", text: "934 € - 1.300 € / mes" },
                  { icon: "🗣", text: "Inglés / Alemán" },
                ].map(tag => (
                  <span key={tag.text} className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
                    style={{ background: "rgba(0,19,91,0.65)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}>
                    <span>{tag.icon}</span> <span>{tag.text}</span>
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {applySuccess ? (
                  <div className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-[#00135B] text-sm shadow-xl"
                    style={{ background: "#F5C542" }}>
                    <CheckCircle2 className="w-5 h-5" />
                    ¡Postulación iniciada! Ver en Dashboard
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex items-center gap-2 px-8 py-4 rounded-full font-extrabold text-[#00135B] text-sm transition-all hover:scale-105 cursor-pointer shadow-xl"
                    style={{ background: "#F5C542", boxShadow: "0 4px 25px rgba(245,197,66,0.5)" }}>
                    {applying ? "Iniciando..." : "Simular mi postulación"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white text-sm transition-all hover:bg-white/20 cursor-pointer shadow-lg"
                  style={{ border: "1px solid rgba(255,255,255,0.4)", background: "rgba(0,19,91,0.65)", backdropFilter: "blur(8px)" }}>
                  <Sparkles className="w-4 h-4 text-[#F5C542]" />
                  Aplicar con IA
                </button>

                <a
                  href="https://www.daad.de/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white text-sm transition-all hover:bg-white/20 cursor-pointer shadow-lg"
                  style={{ border: "1px solid rgba(255,255,255,0.4)", background: "rgba(0,19,91,0.65)", backdropFilter: "blur(8px)" }}
                >
                  <Globe className="w-4 h-4 text-[#F5C542]" />
                  Sitio Oficial DAAD
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              {/* Attributes Banner */}
              <div className="p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 w-full shadow-lg"
                style={{ background: "rgba(0, 19, 91, 0.65)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                {[
                  { icon: "💶", label: "Estipendio", val: "934€ - 1.300€/mes" },
                  { icon: "💼", label: "Experiencia", val: "2 años mín. oblig." },
                  { icon: "⏱", label: "Duración", val: "12 a 24 meses" },
                  { icon: "📅", label: "Plazo", val: "Agosto a Noviembre" },
                ].map(item => (
                  <div key={item.label} className="space-y-0.5 text-left">
                    <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span>{item.icon}</span> {item.label}
                    </div>
                    <div className="text-white font-black text-xs">{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-2 border-t border-white/20">
                {[
                  { val: "934 €", label: "Manutención mensual base" },
                  { val: "40+", label: "Maestrías EPOS en Alemania" },
                  { val: "100%", label: "Matrícula, Vuelos & Seguro" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-2xl font-black drop-shadow-md" style={{ color: "#F5C542" }}>{s.val}</div>
                    <div className="text-white/90 text-xs font-semibold mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column — Prominent Logo Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div
                className="w-full max-w-sm rounded-3xl p-7 border border-white/30 shadow-2xl relative overflow-hidden backdrop-blur-xl text-center space-y-5"
                style={{ background: "rgba(0, 19, 91, 0.82)" }}
              >
                {/* Red/Gold glowing backdrop circle */}
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl opacity-40 pointer-events-none"
                  style={{ background: "#DC2626" }}
                />

                {/* Main Prominent Official Logo Badge */}
                <div className="w-full max-w-[280px] h-24 mx-auto rounded-2xl bg-white p-3 shadow-2xl flex items-center justify-center border-2 border-[#F5C542] transition-transform hover:scale-105 duration-300">
                  <img
                    src={daadLogo}
                    alt="Logo DAAD Alemania"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                    Servicio Alemán <span style={{ color: "#F5C542" }}>DAAD</span>
                  </h3>
                  <p className="text-xs text-amber-300 mt-1 font-bold uppercase tracking-wider">
                    Entidad Convocante Oficial · Alemania
                  </p>
                </div>

                {/* Verified Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Beca 100% Verificada
                </div>

                {/* Metadata Details */}
                <div className="pt-4 border-t border-white/10 text-xs space-y-2.5 text-left text-white/80">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 font-medium">Sede:</span>
                    <span className="font-bold text-white flex items-center gap-1">🇩🇪 Bonn, Alemania</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 font-medium">Entidad Convocante:</span>
                    <span className="font-bold text-white">DAAD Deutscher Akademischer Austauschdienst</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 font-medium">Programa:</span>
                    <span className="font-bold text-[#F5C542]">EPOS Posgrados para el Desarrollo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 font-medium">Cobertura:</span>
                    <span className="font-bold text-emerald-400">Completa (Manutención + Matrícula)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          2. MANIFIESTO Y UNIVERSIDADES ASOCIADAS EN ALEMANIA
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-50/40 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-blue-100 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-28 rounded-2xl bg-white border border-gray-100 p-2 shadow-md flex items-center justify-center shrink-0">
              <img src={daadLogo} alt="Logo DAAD Alemania" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00135B]/5 border border-[#00135B]/15 text-[#00135B] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#5D8CE2]" />
                Servicio Alemán de Intercambio Académico (DAAD EPOS)
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#00135B] leading-snug border-l-4 border-[#F5C542] pl-4">
                &ldquo;Formar especialistas y líderes de países en desarrollo mediante maestrías de excelencia orientadas al crecimiento económico y social sostenible.&rdquo;
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                El programa EPOS (Development-Related Postgraduate Courses) financia cursos de posgrado en universidades de prestigio en Alemania. Los becarios reciben estipendio mensual, seguro médico completo, billetes de avión y cursos intensivos de idioma alemán.
              </p>

              {/* Official Social Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Canales Oficiales DAAD:</span>
                <a
                  href="https://www.facebook.com/DAAD.Bolivia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-all"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  DAAD Bolivia (Facebook)
                </a>
                <a
                  href="https://www.youtube.com/@DAAD_Chile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5 hover:bg-red-100 transition-all"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                  DAAD Latinoamérica (YouTube)
                </a>
                <a
                  href="https://www.daad.de/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition-all"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  Portal Oficial DAAD Portal
                </a>
              </div>
            </div>
          </div>

          {/* Associated Universities Showcase in Germany */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-geist">
                UNIVERSIDADES ALEMANAS DESTACADAS EN EL PROGRAMA EPOS
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Heidelberg University", logo: heidelbergLogo, photo: heidelbergPhoto, tag: "Salud Pública & Medicina Tropical" },
                { name: "University of Göttingen", logo: gottingenLogo, photo: gottingenPhoto, tag: "Desarrollo Agrícola & Ciencias" },
                { name: "TU Berlin", logo: daadLogo, photo: tuBerlinPhoto, tag: "Ingeniería Ambiental & Urbano" },
                { name: "University of Bonn", logo: bonnLogo, photo: bonnPhoto, tag: "Economía del Desarrollo & Recursos" },
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
              ¿Qué incluye la Beca DAAD EPOS?
            </h2>
            <p className="text-slate-500 text-sm md:text-base mt-4 max-w-2xl mx-auto font-light">
              Explora los beneficios integrales otorgados por el Gobierno Alemán para tus estudios de posgrado.
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
          4. CRITERIOS DE ELEGIBILIDAD Y REQUISITOS
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Requisitos de Admisión
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00135B]">
              Criterios Obligatorios DAAD EPOS
            </h2>
            <p className="text-slate-600 text-sm font-light">
              Condiciones requeridas para ser seleccionado como becario del programa EPOS en Alemania:
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
          5. SECCIÓN DEDICADA DE TESTIMONIOS Y REQUISITOS EN VIDEO
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider">
                Experiencias & Requisitos DAAD
              </span>
              <h2 className="text-3xl font-extrabold text-[#00135B] mt-2">
                Testimonios y Guía de Posgrado en Alemania
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Explora vivencias reales y la guía explicativa de requisitos para posgrados EPOS.
            </p>
          </div>

          {/* Video Cards Grid with Uniform Height & Aspect-Video */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {DAAD_VIDEOS.slice(1).map((v) => (
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
          6. CALCULADORA INTERACTIVA DE ELEGIBILIDAD DAAD EPOS
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-50/50 border-y border-blue-100">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-white text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Simulador en Tiempo Real
            </span>
            <h2 className="text-3xl font-extrabold text-[#00135B]">
              Calculadora de Elegibilidad DAAD EPOS
            </h2>
            <p className="text-slate-600 text-sm font-light">
              Comprueba si cumples los 2 años de experiencia profesional y requisitos del DAAD.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-blue-100 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                    1. Años de Experiencia Laboral (Mín. 2 Años)
                  </label>
                  <span className="text-sm font-extrabold text-[#DC2626]">{calcExperienceYears} años</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={calcExperienceYears}
                  onChange={(e) => setCalcExperienceYears(Number(e.target.value))}
                  className="w-full accent-[#00135B] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                    2. Antigüedad del Título de Grado (Máx. 6 Años)
                  </label>
                  <span className="text-sm font-extrabold text-[#5D8CE2]">{calcDegreeAge} años</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={calcDegreeAge}
                  onChange={(e) => setCalcDegreeAge(Number(e.target.value))}
                  className="w-full accent-[#00135B] cursor-pointer"
                />
              </div>

              <div className="space-y-2 text-xs md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input type="checkbox" checked={calcDegreeHeld} onChange={e => setCalcDegreeHeld(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Título universitario de Licenciatura oficial
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input type="checkbox" checked={calcLanguageLevel} onChange={e => setCalcLanguageLevel(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Nivel de Inglés B2/C1 o Alemán certificado
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input type="checkbox" checked={calcGpa >= 75} onChange={e => setCalcGpa(e.target.checked ? 82 : 70)} className="accent-[#00135B] w-4 h-4" />
                  Promedio académico superior al 75/100
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
                    {isFullyEligible ? "¡Perfil Elegible para Becas DAAD EPOS en Alemania!" : "Revisión de Requisitos Necesaria"}
                  </h3>
                  <p className="text-xs sm:text-sm font-light">
                    {isFullyEligible ? (
                      <>Tus {calcExperienceYears} años de experiencia laboral a tiempo completo y antigüedad de título ({calcDegreeAge} años) cumplen con las condiciones oficiales del DAAD EPOS.</>
                    ) : (
                      <>Se requieren al menos 2 años de experiencia profesional tras la graduación y que el título no supere los 6 años de haber sido emitido.</>
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
              Banco Oficial de Respuestas DAAD
            </span>
            <h2 className="text-3xl font-extrabold text-[#00135B]">
              Preguntas Frecuentes — Becas DAAD EPOS
            </h2>
            <p className="text-slate-500 text-sm font-light">
              Respuestas oficiales para la convocatoria de posgrados en desarrollo en Alemania:
            </p>

            <div className="pt-4 max-w-md mx-auto relative">
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Buscar duda (ej: experiencia, inglés, estipendio, plazo)..."
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
            ¿Listo para cursar tu posgrado en <span style={{ color: "#F5C542" }}>Alemania</span>?
          </h2>

          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Comienza hoy tu preparación para las Becas DAAD EPOS con el acompañamiento inteligente de EDULAB.
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
              href="https://www.daad.de/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-full font-bold text-white text-base hover:bg-white/10 border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#F5C542]" />
              Portal Oficial DAAD (daad.de)
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
          </div>

          {/* Social Media Links */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/70">
            <span>Canales Oficiales DAAD:</span>
            <a
              href="https://www.facebook.com/DAAD.Bolivia"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <FacebookIcon className="w-4 h-4 text-blue-400" />
              DAAD Bolivia (Facebook)
            </a>
            <a
              href="https://www.youtube.com/@DAAD_Chile"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <YoutubeIcon className="w-4 h-4 text-red-400" />
              DAAD Latinoamérica (YouTube)
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
              className="bg-slate-900 border border-white/20 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-4 p-6 relative"
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
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
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
            <p className="text-sm text-slate-500">Crea tu cuenta gratis o inicia sesión para postularte a las Becas DAAD EPOS con el apoyo de IA de EDULAB.</p>
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
