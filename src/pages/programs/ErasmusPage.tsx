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

// Import local assets from src/assets/becas_erasmus_mundus/iamgenes
import logoErasmus from "../../assets/becas_erasmus_mundus/iamgenes/logo-erasmus.jfif";
import emPhoto1 from "../../assets/becas_erasmus_mundus/iamgenes/482083906_944270707884370_608454939234030465_n.jpg";
import emPhoto2 from "../../assets/becas_erasmus_mundus/iamgenes/51300159413_3b88c167d5_o-scaled-40b9bf05.jpg";
import emPhoto3 from "../../assets/becas_erasmus_mundus/iamgenes/em-2-e1633954067462-1024x728.jpg";
import emPhoto4 from "../../assets/becas_erasmus_mundus/iamgenes/erasmus-mundus-master-scholarship-1.jpg";
import emPhoto5 from "../../assets/becas_erasmus_mundus/iamgenes/images (3).jfif";
import emPhoto6 from "../../assets/becas_erasmus_mundus/iamgenes/studenten_internationaal_bib_MG_6677s_def.jpg";

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

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

// Types for Videos
interface ErasmusVideo {
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

const ERASMUS_VIDEOS: ErasmusVideo[] = [
  {
    id: "v1",
    title: "Video de Bienvenida Erasmus Mundus",
    category: "Presentación Oficial",
    desc: "Explicación integral sobre los programas de máster conjunto y la experiencia de estudiar en múltiples países europeos.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=9jgEyL74eQ0",
    embedUrl: "https://www.youtube.com/embed/9jgEyL74eQ0?autoplay=1",
    thumb: emPhoto3
  },
  {
    id: "v2",
    title: "Experiencia Erasmus Mundus - Vivencia Iberoamericana",
    category: "Testimonio & Movilidad",
    desc: "Recorrido por la vida estudiantil, itinerario de movilidad en 3 países y aprendizaje multicultural.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=3hk0iBQx7Ng",
    embedUrl: "https://www.youtube.com/embed/3hk0iBQx7Ng?autoplay=1",
    thumb: emPhoto6
  },
  {
    id: "v3",
    title: "Testimonio Becario Erasmus - Consejos de Postulación",
    category: "Testimonios",
    desc: "Recomendaciones prácticas para la carta de motivación, selección de consorcio y visados comunitarios.",
    type: "youtube",
    url: "https://youtu.be/NO5NFaV0Dfk",
    embedUrl: "https://www.youtube.com/embed/NO5NFaV0Dfk?autoplay=1",
    thumb: emPhoto1
  },
  {
    id: "v4",
    title: "Guía Rápida Erasmus Mundus (Video Vertical)",
    category: "Short Informativo",
    desc: "Resumen ágil en formato vertical de los beneficios, estipendio de 1.400€/mes y requisitos clave.",
    type: "shorts",
    url: "https://www.youtube.com/watch?v=Cmtg0T3ugng",
    embedUrl: "https://www.youtube.com/embed/Cmtg0T3ugng?autoplay=1",
    thumb: emPhoto4,
    isVertical: true
  }
];

export default function ErasmusPage() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [programId, setProgramId] = useState<number | null>(null);

  // Video Modal State (Ventana Emergente)
  const [modalVideo, setModalVideo] = useState<ErasmusVideo | null>(null);

  // Benefit Details Master-Detail Selection (Imagen 1 style)
  const [activeBenefitIdx, setActiveBenefitIdx] = useState<number>(0);

  // FAQ Search State
  const [faqSearch, setFaqSearch] = useState("");

  // Calculator State
  const [calcGpa, setCalcGpa] = useState<number>(85);
  const [calcEnglish, setCalcEnglish] = useState<boolean>(true);
  const [calcDegree, setCalcDegree] = useState<boolean>(true);
  const [calcMobility, setCalcMobility] = useState<boolean>(true);
  const [calcNationality, setCalcNationality] = useState<string>("bolivia");

  const gpaPasses = calcGpa >= 75;
  const isFullyEligible = gpaPasses && calcEnglish && calcDegree && calcMobility;

  // Auto-open welcome video popup modal on entry after 1s
  useEffect(() => {
    const timer = setTimeout(() => {
      setModalVideo(ERASMUS_VIDEOS[0]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load backend program ID
  useEffect(() => {
    async function loadProgram() {
      try {
        const res = await axiosClient.get("/opportunities/erasmus-mundus-beca");
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
      title: "Matrícula Completa 100%",
      tagline: "Consorcio Universitario UE",
      desc: "Cobertura total de aranceles académicos, seguros universitarios y derechos de examen en todas las instituciones del consorcio.",
      longDesc: "La beca Erasmus Mundus cubre íntegramente el coste de matrícula en todas las universidades europeas que integran el programa de máster conjunto elegido (entre 2 y 4 universidades de diferentes países).",
      checklist: [
        "Matriculación 100% en todas las universidades del consorcio",
        "Derechos de examen, laboratorios y bibliotecas",
        "Gestión centralizada de expedientes académicos",
        "Expedición final del título conjunto o múltiple"
      ],
      advantages: [
        "Sin tasa universitaria residual",
        "Instituciones europeas acreditadas",
        "Respaldo directo de la Comisión Europea"
      ],
      tip: "Puedes solicitar hasta 3 másteres conjuntos Erasmus Mundus simultáneamente en cada ciclo de convocatoria.",
      image: emPhoto3,
      theme: { bg: "bg-blue-50/50", iconColor: "text-blue-600", badgeBg: "bg-blue-50 text-blue-700", accentColor: "#2563eb" }
    },
    {
      icon: Wallet,
      title: "Estipendio Mensual (1.400€/mes)",
      tagline: "Manutención Garantizada",
      desc: "Asignación mensual fija de 1.400 euros durante un máximo de 24 meses continuos.",
      longDesc: "Recibes 1.400 € al mes depositados directamente en tu cuenta bancaria europea para cubrir alquiler de vivienda, alimentación, libros y gastos personales durante toda la duración del máster.",
      checklist: [
        "1.400 € mensuales de libre disponibilidad",
        "Transferencias puntuales SEPA en euros",
        "Financiamiento durante periodos lectivos y vacaciones",
        "Continuidad durante la movilidad entre países"
      ],
      advantages: [
        "Monto holgado para cualquier ciudad europea",
        "Sin requisito de rendición de cuentas personales",
        "Tranquilidad económica total"
      ],
      tip: "Te sugerimos abrir una cuenta bancaria digital en euros (Revolut/N26) al llegar a tu primer país destino.",
      image: emPhoto6,
      theme: { bg: "bg-[#00135B]/5", iconColor: "text-[#00135B]", badgeBg: "bg-[#00135B]/10 text-[#00135B]", accentColor: "#00135B" }
    },
    {
      icon: Plane,
      title: "Bolsa de Viaje e Instalación",
      tagline: "Movilidad Internacional",
      desc: "Subsidio adicional anual para pasajes aéreos internacionales y costes de instalación en los países del itinerario.",
      longDesc: "Erasmus Mundus incluye una ayuda económica adicional para cubrir los costes de transporte internacional entre tu país de origen y Europa, así como los traslados de movilidad académica obligatorios.",
      checklist: [
        "Bolsa anual de viaje internacional",
        "Ayuda a la instalación al inicio del programa",
        "Cobertura de movilidad interna entre países del consorcio",
        "Reembolso de tasas de visado comunitario"
      ],
      advantages: [
        "Cero coste de pasajes aéreos",
        "Flexibilidad de trayectos inter-europeos",
        "Subsidio inicial de llegada"
      ],
      tip: "EduLab te asiste en la planificación de tu visado nacional con las embajadas europeas correspondientes en tu país.",
      image: emPhoto2,
      theme: { bg: "bg-amber-50/50", iconColor: "text-amber-600", badgeBg: "bg-amber-50 text-amber-700", accentColor: "#d97706" }
    },
    {
      icon: Shield,
      title: "Seguro Médico Internacional",
      tagline: "Cobertura Completa UE",
      desc: "Seguro médico de salud completo que cumple con todos los estándares mínimos fijados por la Unión Europea.",
      longDesc: "Póliza internacional de salud no farmacéutica con atención primaria, urgencias, hospitalización, repatriación y cobertura durante las estancias en todos los países de movilidad.",
      checklist: [
        "Atención médica en cualquier país de la UE",
        "Urgencias y hospitalización 100%",
        "Seguro de accidentes y repatriación",
        "Válido para solicitud de visados Schengen"
      ],
      advantages: [
        "Sin copagos en atención de urgencia",
        "Red médica internacional de alta calidad",
        "Tranquilidad total para el estudiante"
      ],
      tip: "Conserva tu certificado de seguro en PDF; será requerido para la tarjeta de residencia temporal en cada país.",
      image: emPhoto5,
      theme: { bg: "bg-emerald-50/50", iconColor: "text-emerald-600", badgeBg: "bg-emerald-50 text-emerald-700", accentColor: "#059669" }
    },
    {
      icon: Trophy,
      title: "Título Máster Conjunto u Oficial",
      tagline: "Reconocimiento Multilateral",
      desc: "Obtención de un título máster conjunto o títulos dobles/múltiples reconocidos oficialmente en toda Europa.",
      longDesc: "Al graduarte, obtienes un Título Conjunto (Joint Degree) emitido colectivamente por las universidades del consorcio o Títulos Múltiples reconocidos de pleno derecho en todos los Estados miembros de la UE.",
      checklist: [
        "Diploma oficial con Sello de Excelencia UE",
        "Suplemento al Título Europeo (Diploma Supplement)",
        "Reconocimiento académico y profesional automático",
        "Validez para acceso directo a programas de Doctorado (PhD)"
      ],
      advantages: [
        "Máximo prestigio académico internacional",
        "Doble o triple titulación europea",
        "Oportunidades laborales en multinacionales"
      ],
      tip: "El Suplemento al Título detalla cada semestre y universidad en la que cursaste asignaturas.",
      image: emPhoto4,
      theme: { bg: "bg-purple-50/50", iconColor: "text-purple-600", badgeBg: "bg-purple-50 text-purple-700", accentColor: "#7c3aed" }
    },
    {
      icon: Sparkles,
      title: "Mentoría & Asistente IA EDULAB",
      tagline: "Acompañamiento Estratégico",
      desc: "Herramientas de IA para seleccionar consorcios del catálogo oficial EACEA y estructurar tu candidatura.",
      longDesc: "Soporte especializado para navegar los más de 200 másteres del catálogo oficial EACEA, redactar cartas de motivación de alto impacto y preparar los documentos para la preselección.",
      checklist: [
        "Filtro inteligente de consorcios del catálogo EACEA",
        "Generador de carta de motivación ajustada a rúbrica UE",
        "Revisión de cartas de recomendación académicas",
        "Simulacro de entrevista de admisión"
      ],
      advantages: [
        "Navegación guiada en la oferta de la UE",
        "Optimización de perfil para alta competitividad",
        "Soporte continuo en todo el proceso"
      ],
      tip: "Consulta directamente la base de datos oficial EACEA mediante el botón interactivo habilitado en esta página.",
      image: logoErasmus,
      theme: { bg: "bg-pink-50/50", iconColor: "text-pink-600", badgeBg: "bg-pink-50 text-pink-700", accentColor: "#db2777" }
    }
  ];

  const requirements = [
    { name: "Título de Licenciatura / Grado", priority: "Obligatorio", color: "#ef4444", desc: "Poseer título universitario oficial o estar en condición de obtenerlo antes del inicio del máster." },
    { name: "Inglés Nivel B2 / C1", priority: "Obligatorio", color: "#ef4444", desc: "Acreditar competencia en idioma inglés (IELTS, TOEFL, Cambridge o prueba de consorcio)." },
    { name: "Movilidad en al menos 2 Países", priority: "Obligatorio", color: "#ef4444", desc: "Disponibilidad para cursar estudios presenciales en mínimo 2 países europeos distintos." },
    { name: "Regla de los 12 Meses", priority: "Obligatorio", color: "#ef4444", desc: "No haber residido ni realizado actividad principal en la UE por más de 12 meses en los últimos 5 años." },
    { name: "Cartas de Recomendación", priority: "Importante", color: "#f59e0b", desc: "2 cartas de recomendación de profesores o supervisores profesionales." },
    { name: "Carta de Motivación", priority: "Importante", color: "#f59e0b", desc: "Exposición de motivos y coherencia con la trayectoria académica." },
    { name: "Certificado de Notas Traducido", priority: "Importante", color: "#f59e0b", desc: "Expediente de calificaciones oficiales traducido al inglés." },
    { name: "Selección de Nacionalidad", priority: "Recomendado", color: "#22c55e", desc: "Si posees doble nacionalidad, debes elegir bajo qué marco aplicar." }
  ];

  // Official FAQ items extracted from the 2 screenshots provided by the user
  const OFFICIAL_FAQS = [
    {
      q: "¿Puedo solicitar un máster Erasmus Mundus antes de graduarme?",
      a: "Si está solicitando un programa de maestría Erasmus Mundus y aún no ha obtenido el título universitario requerido, comuníquese directamente con el coordinador del programa máster. Muchos consorcios permiten la postulación condicionada a presentar el título antes del inicio oficial del curso."
    },
    {
      q: "¿Cómo se selecciona a los estudiantes para un programa de máster Erasmus Mundus?",
      a: "Los estudiantes son seleccionados directamente por los programas de máster individuales de Erasmus Mundus (el consorcio universitario), que tienen sus propios procedimientos de selección, criterios de evaluación académicos y comités de admisión independientes."
    },
    {
      q: "Tengo dos nacionalidades. ¿En qué marco debo solicitar un programa de máster Erasmus Mundus?",
      a: "Usted tiene que elegir bajo qué nacionalidad desea aplicar. Debe indicar claramente una sola nacionalidad en el formulario de postulación del consorcio."
    },
    {
      q: "¿Dónde se reconocerán mis títulos de máster Erasmus Mundus? ¿Qué tipo de título obtendré?",
      a: "Los estudiantes de posgrado de un programa de máster Erasmus Mundus obtienen un título doble, múltiple o conjunto en función de las universidades del consorcio. El título es reconocido de pleno derecho en todos los países participantes de la Unión Europea que otorgan la titulación."
    },
    {
      q: "¿Puedo interrumpir o posponer mis estudios Erasmus Mundus?",
      a: "Si necesita interrumpir temporalmente sus estudios por causas justificadas, debe ponerse inmediatamente en contacto con el coordinador del programa. Cualquier interrupción debe ser aprobada institucionalmente por la agencia EACEA."
    },
    {
      q: "¿Puedo trabajar durante mis estudios en un programa de máster Erasmus Mundus?",
      a: "Las becas Erasmus Mundus están diseñadas como becas a tiempo completo. Como tal, proporcionan suficientes recursos económicos (1.400€/mes) para que los estudiantes se dediquen plenamente a sus estudios y movilidad académica."
    },
    {
      q: "¿Puedo realizar prácticas durante mis estudios Erasmus Mundus?",
      a: "Sí. La mayoría de los programas Erasmus Mundus incluyen prácticas profesionales obligatorias u opcionales en empresas, laboratorios u organismos internacionales asociados al consorcio como parte de su plan de estudios."
    },
    {
      q: "Al asistir a un programa de máster Erasmus Mundus, ¿puedo elegir los países en los que quiero estudiar?",
      a: "Los países donde puedes estudiar están definidos por el itinerario del programa maestro elegido. Cada máster cuenta con un consorcio de al menos 3 universidades en países europeos distintos donde cursarás semestres consecutivos."
    },
    {
      q: "¿Cómo puedo obtener mi visado para cursar un máster Erasmus Mundus?",
      a: "El coordinador del curso que estudiará le proporcionará orientación y documentos de soporte oficiales para solicitar la visa. Sin embargo, el estudiante es el responsable directo de tramitar la visa ante la embajada o consulado del primer país de destino."
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
          background: rgba(37,99,235,0.04);
          border-color: rgba(37,99,235,0.25) !important;
        }
        .benefit-list-item.active {
          background: #EEF4FF;
          border-color: #2563eb !important;
          box-shadow: 0 4px 16px rgba(37,99,235,0.10);
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
          style={{ background: "radial-gradient(circle, #5D8CE2, transparent)" }} />
        <div className="absolute bottom-10 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #F5C542, transparent)" }} />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Header */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold"
                style={{ background: "rgba(245,197,66,0.15)", borderColor: "rgba(245,197,66,0.3)", color: "#F5C542" }}>
                <span className="w-2 h-2 rounded-full bg-[#F5C542] animate-pulse" />
                BECA INTERNACIONAL DE EXCELENCIA 🇪🇺 UNIÓN EUROPEA
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                <span>Becas Erasmus </span>
                <span style={{ color: "#F5C542" }}>Mundus (EMJM)</span>
              </h1>

              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl font-light">
                Estudia un máster conjunto internacional cursando semestres en al menos <strong className="text-white font-semibold">3 países europeos</strong> con financiamiento 100% integral.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { icon: "🇪🇺", text: "Unión Europea" },
                  { icon: "🎓", text: "Maestría Conjunta (120 ECTS)" },
                  { icon: "💶", text: "1.400 €/mes Estipendio" },
                  { icon: "🗣", text: "Inglés" },
                ].map(tag => (
                  <span key={tag.text} className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1.5"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                    <span>{tag.icon}</span> <span>{tag.text}</span>
                  </span>
                ))}
              </div>

              {/* Action Buttons — Main Apply + AI Apply + Official Catalogue Link */}
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

                {/* OFFICIAL EACEA CATALOGUE BUTTON — DO NOT DELETE */}
                <a
                  href="https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white text-sm transition-all hover:bg-white/10 cursor-pointer"
                  style={{ border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
                >
                  <Globe className="w-4 h-4 text-[#F5C542]" />
                  Catálogo Oficial EACEA
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              {/* Attributes Banner */}
              <div className="p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 w-full"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {[
                  { icon: "💶", label: "Financiamiento", val: "1.400 € / mes" },
                  { icon: "✈️", label: "Movilidad", val: "Mínimo 2-3 países" },
                  { icon: "⏱", label: "Duración", val: "12 a 24 meses" },
                  { icon: "📅", label: "Convocatoria", val: "Octubre a Enero" },
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
                  { val: "1.400 €", label: "Asignación mensual fija" },
                  { val: "200+", label: "Consorcios de Máster" },
                  { val: "100%", label: "Matrícula & Seguro Cubierto" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-2xl font-black" style={{ color: "#F5C542" }}>{s.val}</div>
                    <div className="text-white/70 text-xs font-medium mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Video Player Box — ONLY THE WELCOME VIDEO AS REQUESTED BY USER */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950 relative border border-white/20 p-2 space-y-3">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black group">
                  <iframe
                    className="w-full h-full border-none"
                    src={ERASMUS_VIDEOS[0].embedUrl.replace("autoplay=1", "autoplay=0")}
                    title={ERASMUS_VIDEOS[0].title}
                    allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />

                  <button
                    onClick={() => setModalVideo(ERASMUS_VIDEOS[0])}
                    className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-[#00135B] text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-[#F5C542]" />
                    Modo Ventana Emergente
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#F5C542] text-[#00135B] font-extrabold text-[10px] uppercase">
                      {ERASMUS_VIDEOS[0].category}
                    </span>
                    <span className="text-xs font-bold truncate">{ERASMUS_VIDEOS[0].title}</span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-relaxed font-light">{ERASMUS_VIDEOS[0].desc}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          2. MANIFIESTO E INSTITUCIONAL ERASMUS MUNDUS
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-50/40 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-blue-100 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div className="w-36 h-28 rounded-2xl bg-white border border-gray-100 p-2 shadow-md flex items-center justify-center shrink-0">
              <img src={logoErasmus} alt="Logo Erasmus Mundus" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00135B]/5 border border-[#00135B]/15 text-[#00135B] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#5D8CE2]" />
                Excelencia Académica sin Fronteras — Unión Europea
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#00135B] leading-snug border-l-4 border-[#F5C542] pl-4">
                &ldquo;Obtén un Título Conjunto o Múltiple de Máster estudiando en al menos 2 o 3 universidades líderes en distintos países europeos.&rdquo;
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                Los programas Erasmus Mundus Joint Master Degrees (EMJM) son maestrías integradas de alto nivel académico impartidas por consorcios internacionales de educación superior. Financian la matrícula, pasajes aéreos y otorgan 1.400 € al mes de estipendio para candidatos de todo el mundo.
              </p>

              {/* Official Social Links & Official Catalogue */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Canales Oficiales UE en Bolivia:</span>
                <a
                  href="https://www.facebook.com/UEenBolivia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-all"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  UE en Bolivia (Facebook)
                </a>
                <a
                  href="https://www.youtube.com/@unioneuropeaenbolivia963"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5 hover:bg-red-100 transition-all"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                  YouTube UE en Bolivia
                </a>
                <a
                  href="https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition-all"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  Sitio Oficial Catálogo EACEA
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
              Explora los pilares de cobertura completa otorgados por la Comisión Europea para tus estudios de máster en Europa.
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
                      <p className={`text-xs mt-0.5 font-medium ${isActive ? "text-[#2563eb]" : "text-slate-400"}`}>
                        {isActive ? "Mostrando detalles" : "Ver cobertura e información"}
                      </p>
                    </div>

                    {isActive && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb] shrink-0" />
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
                            <div key={idx2} className="check-item flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-1.5 px-2 rounded-lg hover:bg-blue-50/50">
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
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-start gap-3 mt-2">
                        <Sparkles className="w-4 h-4 text-[#5D8CE2] shrink-0 mt-0.5" />
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
          4. REQUISITOS Y CRITERIOS DE ELECCIÓN
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Criterios de Admisión
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00135B]">
              Requisitos de Elección Exigidos
            </h2>
            <p className="text-slate-600 text-sm font-light">
              Condiciones requeridas para ser considerado candidato elegible a los Másteres Conjuntos Erasmus Mundus:
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
          5. SECCIÓN DEDICADA DE TESTIMONIOS Y EXPERIENCIAS (LOS OTROS VIDEOS ABAJO)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-300 text-xs font-bold uppercase tracking-wider">
                Experiencias de Becarios
              </span>
              <h2 className="text-3xl font-extrabold text-[#00135B] mt-2">
                Vivencias y Consejos de Movilidad Erasmus
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Explora los testimonios reales de estudiantes iberoamericanos realizando maestrías conjuntos en Europa.
            </p>
          </div>

          {/* Video Cards Grid for Testimonials & Shorts (Videos 2, 3, 4) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {ERASMUS_VIDEOS.slice(1).map((v) => (
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
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1 shadow">
                        <Smartphone className="w-3 h-3" /> YouTube Short
                      </span>
                    )}
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
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
          6. CALCULADORA INTERACTIVA DE ELEGIBILIDAD ERASMUS MUNDUS
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-50/50 border-y border-blue-100">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-white text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Simulador de Admisión
            </span>
            <h2 className="text-3xl font-extrabold text-[#00135B]">
              Calculadora de Elegibilidad Erasmus Mundus
            </h2>
            <p className="text-slate-600 text-sm font-light">
              Comprueba si cumples las condiciones institucionales para postular a los consorcios de máster conjuntos.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-blue-100 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                  1. Marco de Nacionalidad (Candidatura)
                </label>
                <select
                  value={calcNationality}
                  onChange={(e) => setCalcNationality(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 font-semibold text-sm focus:outline-none focus:border-[#5D8CE2]"
                >
                  <option value="bolivia">Nacionalidad Boliviana (País Socio - Partner Country)</option>
                  <option value="latam">Otra Nacionalidad Latinoamericana</option>
                  <option value="doble">Doble Nacionalidad (Seleccionar un solo marco)</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                    2. Promedio Académico (0 a 100)
                  </label>
                  <span className="text-sm font-extrabold text-[#5D8CE2]">{calcGpa} / 100</span>
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
                  <input type="checkbox" checked={calcEnglish} onChange={e => setCalcEnglish(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Nivel de Inglés B2 / C1 certificado
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input type="checkbox" checked={calcDegree} onChange={e => setCalcDegree(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Título de Licenciatura en mano (o por titularse)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input type="checkbox" checked={calcMobility} onChange={e => setCalcMobility(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Disponibilidad de movilidad en al menos 2 países UE
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
                    {isFullyEligible ? "¡Perfil Elegible para Becas Erasmus Mundus!" : "Revisión de Requisitos Necesaria"}
                  </h3>
                  <p className="text-xs sm:text-sm font-light">
                    {isFullyEligible ? (
                      <>Tu nivel de notas ({calcGpa}/100), suficiencia de idioma inglés y disposición de movilidad te posicionan como candidato apto para postular a 3 consorcios del catálogo EACEA.</>
                    ) : (
                      <>Asegúrate de contar con la acreditación de idioma inglés, título de grado y disposición para cursar estudios presenciales en Europa.</>
                    )}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          7. PREGUNTAS FRECUENTES OFICIALES (BASADAS EN LAS CAPTURAS ADJUNTAS)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Banco Oficial de Respuestas UE
            </span>
            <h2 className="text-3xl font-extrabold text-[#00135B]">
              Preguntas Frecuentes — Erasmus Mundus
            </h2>
            <p className="text-slate-500 text-sm font-light">
              Respuestas oficiales sobre condiciones de admisión, títulos conjuntos y movilidad académica:
            </p>

            <div className="pt-4 max-w-md mx-auto relative">
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Buscar duda (ej: título, trabajo, visado, graduarme)..."
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
            ¿Listo para cursar tu máster conjunto en <span style={{ color: "#F5C542" }}>Europa</span>?
          </h2>

          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Comienza hoy tu preparación con el acompañamiento inteligente de EDULAB para las Becas Erasmus Mundus (EMJM).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleApply}
              className="px-8 py-4 rounded-full font-bold text-[#00135B] text-base transition-all hover:scale-105 cursor-pointer"
              style={{ background: "#F5C542", boxShadow: "0 4px 20px rgba(245,197,66,0.4)" }}
            >
              Iniciar postulación con IA
            </button>

            {/* OFFICIAL CATALOGUE LINK BUTTON IN FOOTER TOO */}
            <a
              href="https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-full font-bold text-white text-base hover:bg-white/10 border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#F5C542]" />
              Catálogo Oficial EACEA
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
          </div>

          {/* Official Social Media Links */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/70">
            <span>Canales Oficiales Unión Europea en Bolivia:</span>
            <a
              href="https://www.facebook.com/UEenBolivia"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <FacebookIcon className="w-4 h-4 text-blue-400" />
              UE en Bolivia (Facebook)
            </a>
            <a
              href="https://www.youtube.com/@unioneuropeaenbolivia963"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <YoutubeIcon className="w-4 h-4 text-red-400" />
              YouTube UE en Bolivia
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
            <p className="text-sm text-slate-500">Crea tu cuenta gratis o inicia sesión para postularte a las Becas Erasmus Mundus con el apoyo de IA de EDULAB.</p>
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
        borderColor: open ? "#2563eb" : "rgba(37,99,235,0.15)",
        background: open ? "rgba(37,99,235,0.04)" : "white",
        boxShadow: open ? "0 4px 20px rgba(37,99,235,0.1)" : "none"
      }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer">
        <span className="font-semibold text-[#00135B] text-sm pr-4">{q}</span>
        <ChevronDown
          className="w-5 h-5 text-[#2563eb] shrink-0 transition-transform duration-300"
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
