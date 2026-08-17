import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  FileText,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Menu,
  Search,
  Sparkles,
  Target,
  UserRound,
  Award,
  Clock3,
  Send,
  UserPlus,
  FileCheck,
  MessageSquare,
  X,
  Brain,
  TrendingUp,
  Heart,
  BadgeCheck,
  MapPin,
  Quote,
  User,
} from "lucide-react";
import AuthModal from "../../components/auth/AuthModal";
import { useAuthStore } from "../../store/useAuthStore";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import { productsData, type ProductItem } from "../../constants/productsData";
import ProductInfoModal from "../../components/landing/ProductInfoModal";

interface LandingPageV2Props {
  initialAuthMode?: "login" | "register";
}

const opportunities = [
  {
    title: "Becas internacionales",
    description: "Encuentra convocatorias de pregrado, maestría, doctorado e intercambio.",
    icon: GraduationCap,
    accent: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    title: "Voluntariados",
    description: "Descubre programas sociales, culturales y ambientales en otros países.",
    icon: HeartHandshake,
    accent: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    title: "Intercambios",
    description: "Vive una experiencia académica internacional y amplía tu red global.",
    icon: Globe2,
    accent: "text-violet-700",
    bg: "bg-violet-50",
  },
  {
    title: "Pasantías",
    description: "Accede a experiencias profesionales en empresas e instituciones internacionales.",
    icon: BriefcaseBusiness,
    accent: "text-amber-700",
    bg: "bg-amber-50",
  },
];


const winnerProfiles = [
  {
    id: 1,
    name: "Cristian Siye Ortiz",
    scholarship: "Experiencia docente internacional",
    country: "Perú, Guatemala y Brasil",
    flag: "🌎",
    image:
      "https://ui-avatars.com/api/?background=EAF1FF&color=00135B&name=Cristian+Siye+Ortiz",
    traits: ["Docencia", "Adaptación cultural", "Trabajo"],
    quote:
      "Vive la experiencia con la mente abierta: muchas veces quien llega termina aprendiendo incluso más de lo que esperaba aportar.",
    accent: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    name: "Arminda Corrales Aguilar",
    scholarship: "Beca del Instituto Confucio",
    country: "China",
    flag: "🇨🇳",
    image:
      "https://ui-avatars.com/api/?background=F3EEFF&color=5B21B6&name=Arminda+Corrales+Aguilar",
    traits: ["Beca", "Idioma", "Visado"],
    quote:
      "Construir una buena base del idioma y anticipar el trámite de la visa son pasos clave para aprovechar la oportunidad.",
    accent: "from-violet-500 to-indigo-400",
  },
  {
    id: 3,
    name: "Rodrigo Aguilar Fernández",
    scholarship: "Programa cultural de la Fundación Japón",
    country: "Japón",
    flag: "🇯🇵",
    image:
      "https://ui-avatars.com/api/?background=FFF0F3&color=BE123C&name=Rodrigo+Aguilar+Fernandez",
    traits: ["Cultura", "Idioma japonés", "Movilidad"],
    quote:
      "Tramita el pasaporte y la visa con anticipación, y procura tener conexión a internet desde el primer día para movilizarte con seguridad.",
    accent: "from-pink-500 to-rose-400",
  },
  {
    id: 4,
    name: "Amanda Alvarez Rocha",
    scholarship: "Beca estudiantil y formación dual",
    country: "Alemania",
    flag: "🇩🇪",
    image:
      "https://ui-avatars.com/api/?background=FFF7E6&color=9A3412&name=Amanda+Alvarez+Rocha",
    traits: ["Beca", "Pasantías", "Formación dual"],
    quote:
      "Estudia, consigue una certificación oficial del idioma y no te rindas: el único límite es el que tú misma te pones.",
    accent: "from-amber-500 to-orange-400",
  },
  {
    id: 5,
    name: "Shaemi Mariam Choque Choque",
    scholarship: "Asistente lingüística e intercambio internacional",
    country: "Francia, Japón y Europa",
    flag: "🌍",
    image:
      "https://ui-avatars.com/api/?background=ECFDF5&color=047857&name=Shaemi+Mariam+Choque+Choque",
    traits: ["Intercambio", "Voluntariado", "Idiomas"],
    quote:
      "No esperes a aterrizar para empezar tu aventura: investiga la cultura y las normas del país antes de viajar.",
    accent: "from-emerald-500 to-teal-400",
  },
];

const services = [
  {
    title: "Encuentra oportunidades compatibles",
    description: "Filtra convocatorias según tu nivel, área, país e intereses.",
    icon: Target,
  },
  {
    title: "Mejora tus documentos",
    description: "Fortalece tu CV, cartas de motivación y respuestas de postulación.",
    icon: FileText,
  },
  {
    title: "Organiza tu postulación",
    description: "Controla requisitos, documentos y fechas importantes desde un solo lugar.",
    icon: CheckCircle2,
  },
  {
    title: "Prepárate mejor",
    description: "Practica entrevistas y recibe orientación para cada etapa del proceso.",
    icon: Sparkles,
  },
];

// 6 Steps Data with Color-Matched styling
const steps = [
  {
    num: "01",
    title: "Completa tu perfil",
    desc: "Registra tus notas, idiomas y preferencias académicas de forma sencilla.",
    icon: UserPlus,
    borderColor: "border-[#0ea5e9]/20 hover:border-[#0ea5e9]/50",
    textColor: "text-[#0ea5e9]",
    iconBg: "bg-[#0ea5e9]/10",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
    overlay: "from-slate-950/95 via-[#0c243d]/85 to-transparent",
    tags: ["PERFIL", "REGISTRO"],
    hoverShadow: "hover:shadow-sky-500/20",
    glowBg: "bg-sky-500"
  },
  {
    num: "02",
    title: "Analiza tus fortalezas",
    desc: "EduLab analiza tu perfil y encuentra oportunidades con mayor compatibilidad.",
    icon: Sparkles,
    borderColor: "border-[#ec4899]/20 hover:border-[#ec4899]/50",
    textColor: "text-[#ec4899]",
    iconBg: "bg-[#ec4899]/10",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    overlay: "from-slate-950/95 via-[#300c24]/85 to-transparent",
    tags: ["IA CO-PILOT", "ANÁLISIS"],
    hoverShadow: "hover:shadow-pink-500/20",
    glowBg: "bg-pink-500"
  },
  {
    num: "03",
    title: "Encuentra oportunidades compatibles",
    desc: "Accede instantáneamente a becas y voluntariados 100% compatibles contigo.",
    icon: Search,
    borderColor: "border-[#f59e0b]/20 hover:border-[#f59e0b]/50",
    textColor: "text-[#f59e0b]",
    iconBg: "bg-[#f59e0b]/10",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80",
    overlay: "from-slate-950/95 via-[#291708]/85 to-transparent",
    tags: ["MATCHING", "BECAS"],
    hoverShadow: "hover:shadow-amber-500/20",
    glowBg: "bg-amber-500"
  },
  {
    num: "04",
    title: "Optimiza tus documentos",
    desc: "Adapta tu currículum y genera cartas persuasivas guiado por copilotos IA.",
    icon: FileCheck,
    borderColor: "border-[#10b981]/20 hover:border-[#10b981]/50",
    textColor: "text-[#10b981]",
    iconBg: "bg-[#10b981]/10",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80",
    overlay: "from-slate-950/95 via-[#0b2417]/85 to-transparent",
    tags: ["CV Y CARTAS", "OPTIMIZACIÓN"],
    hoverShadow: "hover:shadow-emerald-500/20",
    glowBg: "bg-emerald-500"
  },
  {
    num: "05",
    title: "Prepárate para entrevistas",
    desc: "Simula cuestionarios interactivos por audio y texto con feedback real.",
    icon: MessageSquare,
    borderColor: "border-[#8b5cf6]/20 hover:border-[#8b5cf6]/50",
    textColor: "text-[#8b5cf6]",
    iconBg: "bg-[#8b5cf6]/10",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    overlay: "from-slate-950/95 via-[#1d0a2e]/85 to-transparent",
    tags: ["SIMULADOR", "ENTREVISTAS"],
    hoverShadow: "hover:shadow-purple-500/20",
    glowBg: "bg-purple-500"
  },
  {
    num: "06",
    title: "Postula estratégicamente",
    desc: "Completa tus aplicaciones con un perfil robusto y seguimiento en tiempo real.",
    icon: Send,
    borderColor: "border-[#fb7185]/20 hover:border-[#fb7185]/50",
    textColor: "text-[#fb7185]",
    iconBg: "bg-[#fb7185]/10",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
    overlay: "from-slate-950/95 via-[#330c15]/85 to-transparent",
    tags: ["APLICACIÓN", "POSTULACIÓN"],
    hoverShadow: "hover:shadow-rose-500/20",
    glowBg: "bg-rose-500"
  }
];


const closingSoonOpportunities = [
  {
    id: 1,
    type: "Posgrado & Doctorado",
    title: "Becas Fundación Carolina 2026-2027",
    country: "España",
    flag: "🇪🇸",
    deadline: "Cierra en 12 días",
    route: "/becas/fundacion-carolina-beca",
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&auto=format&fit=crop&q=80",
    badgeClass: "bg-red-50 text-red-700 border border-red-200",
  },
  {
    id: 2,
    type: "Maestría Integral",
    title: "Becas Simón I. Patiño en Suiza y Bélgica",
    country: "Suiza / Bélgica",
    flag: "🇨🇭🇧🇪",
    deadline: "Cierra en 15 días",
    route: "/becas/patino-beca",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80",
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  {
    id: 3,
    type: "Maestría Conjunta",
    title: "Becas Erasmus Mundus (EMJM) 100% Financiadas",
    country: "Unión Europea",
    flag: "🇪🇺",
    deadline: "Cierra en 20 días",
    route: "/becas/erasmus-mundus-beca",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80",
    badgeClass: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  },
  {
    id: 4,
    type: "Pregrado & Posgrado",
    title: "Becas GKS Corea del Sur (Global Korea Scholarship)",
    country: "Corea del Sur",
    flag: "🇰🇷",
    deadline: "Cierra en 25 días",
    route: "/becas/gks-korea-beca",
    image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&auto=format&fit=crop&q=80",
    badgeClass: "bg-pink-50 text-pink-700 border border-pink-200",
  },
  {
    id: 5,
    type: "Posgrado en Desarrollo",
    title: "Becas DAAD EPOS para Posgrados en Alemania",
    country: "Alemania",
    flag: "🇩🇪",
    deadline: "Cierra en 28 días",
    route: "/becas/daad-epos-beca",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&auto=format&fit=crop&q=80",
    badgeClass: "bg-amber-50 text-amber-800 border border-amber-200",
  },
  {
    id: 6,
    type: "Maestría & Doctorado",
    title: "Programa de Becas Fulbright en EE.UU.",
    country: "Estados Unidos",
    flag: "🇺🇸",
    deadline: "Cierra en 30 días",
    route: "/becas/fulbright-beca",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80",
    badgeClass: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  },
];

const scholarshipCarouselItems = [
  {
    id: "carolina",
    type: "Beca 100% Integral",
    title: "Becas Fundación Carolina",
    country: "España",
    flag: "🇪🇸",
    desc: "736 becas para realizar maestrías, doctorados y estancias de investigación en universidades de España.",
    specs: [{ label: "Estipendio", val: "Alojamiento & Manutención" }, { label: "Idioma", val: "Español" }, { label: "Nivel", val: "Posgrado / Doctorado" }],
    route: "/becas/fundacion-carolina-beca",
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&auto=format&fit=crop&q=80",
    badgeColor: "bg-red-50 text-red-700 border border-red-200"
  },
  {
    id: "patino",
    type: "Beca de Excelencia",
    title: "Becas Simón I. Patiño",
    country: "Suiza / Bélgica",
    flag: "🇨🇭🇧🇪",
    desc: "Becas completas en la Universidad de Ginebra, Lausanne, EPFL y ULB para jóvenes profesionales bolivianos.",
    specs: [{ label: "Estipendio", val: "Completo + Pasajes" }, { label: "Idioma", val: "Inglés / Francés" }, { label: "Nivel", val: "Maestría (18-24m)" }],
    route: "/becas/patino-beca",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80",
    badgeColor: "bg-blue-50 text-blue-700 border border-blue-200"
  },
  {
    id: "erasmus",
    type: "Maestría Conjunta",
    title: "Becas Erasmus Mundus (EMJM)",
    country: "Unión Europea",
    flag: "🇪🇺",
    desc: "Estudia un máster conjunto itinerante en al menos 3 países europeos con 1.400 € al mes de estipendio.",
    specs: [{ label: "Estipendio", val: "1.400 € / mes" }, { label: "Idioma", val: "Inglés" }, { label: "Nivel", val: "Maestría (12-24m)" }],
    route: "/becas/erasmus-mundus-beca",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80",
    badgeColor: "bg-indigo-50 text-indigo-700 border border-indigo-200"
  },
  {
    id: "gks",
    type: "Beca Estatal NIIED",
    title: "Becas GKS Corea del Sur",
    country: "Corea del Sur",
    flag: "🇰🇷",
    desc: "Beca 100% financiada por el Gobierno de Corea del Sur con 1 año de idioma coreano + estipendio mensual.",
    specs: [{ label: "Estipendio", val: "1.000.000 KRW/mes" }, { label: "Idioma", val: "Coreano / Inglés" }, { label: "Nivel", val: "Pregrado & Posgrado" }],
    route: "/becas/gks-korea-beca",
    image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&auto=format&fit=crop&q=80",
    badgeColor: "bg-pink-50 text-pink-700 border border-pink-200"
  },
  {
    id: "daad",
    type: "Posgrado en Desarrollo",
    title: "Becas DAAD EPOS Alemania",
    country: "Alemania",
    flag: "🇩🇪",
    desc: "Maestrías en universidades alemanas orientadas al desarrollo con 934 €/mes de estipendio y curso de alemán.",
    specs: [{ label: "Estipendio", val: "934 € - 1.300 €/mes" }, { label: "Idioma", val: "Inglés / Alemán" }, { label: "Nivel", val: "Posgrado & PhD" }],
    route: "/becas/daad-epos-beca",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&auto=format&fit=crop&q=80",
    badgeColor: "bg-amber-50 text-amber-800 border border-amber-200"
  },
  {
    id: "fulbright",
    type: "Beca de Gobierno",
    title: "Programa de Becas Fulbright",
    country: "Estados Unidos",
    flag: "🇺🇸",
    desc: "Financiamiento 100% para realizar maestrías o doctorados en universidades de prestigio en EE.UU.",
    specs: [{ label: "Estipendio", val: "100% Completo + Visado" }, { label: "Idioma", val: "Inglés (TOEFL)" }, { label: "Nivel", val: "Posgrado & PhD" }],
    route: "/becas/fulbright-beca",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80",
    badgeColor: "bg-cyan-50 text-cyan-700 border border-cyan-200"
  }
];

const volunteerCarouselItems = [
  {
    id: "aiesec",
    type: "Impacto Social & Liderazgo",
    title: "Voluntariado Global AIESEC",
    country: "Internacional",
    flag: "🌎",
    desc: "Proyectos de impacto social y liderazgo en educación, medio ambiente y comunidad internacional.",
    specs: [{ label: "Cobertura", val: "Hospedaje & Formación" }, { label: "Idioma", val: "Español / Inglés" }, { label: "Nivel", val: "Jóvenes 18-30 años" }],
    route: "/voluntariados/aiesec-voluntariado",
    image: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=800&auto=format&fit=crop&q=80",
    badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200"
  },
  {
    id: "esc",
    type: "Cuerpo Solidario UE",
    title: "Cuerpo Europeo de Solidaridad",
    country: "Unión Europea",
    flag: "🇪🇺",
    desc: "Voluntariado subvencionado con pasajes, hospedaje, seguro médico y estipendio en Europa.",
    specs: [{ label: "Cobertura", val: "100% Cubierto + Dinero de bolsillo" }, { label: "Idioma", val: "Español / Inglés" }, { label: "Nivel", val: "Jóvenes 18-30 años" }],
    route: "/voluntariados/esc-voluntariado",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop&q=80",
    badgeColor: "bg-blue-50 text-blue-700 border border-blue-200"
  },
  {
    id: "techo",
    type: "Desarrollo Comunitario",
    title: "Voluntarios TECHO Bolivia",
    country: "Bolivia & Latam",
    flag: "🇧🇴",
    desc: "Construcción de viviendas de emergencia y superación de la pobreza en asentamientos populares.",
    specs: [{ label: "Modalidad", val: "Trabajo de Campo" }, { label: "Idioma", val: "Español" }, { label: "Nivel", val: "Todos los niveles" }],
    route: "/voluntariados/techo-voluntariado",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
    badgeColor: "bg-amber-50 text-amber-800 border border-amber-200"
  },
  {
    id: "unv",
    type: "Misiones ONU",
    title: "Voluntarios de las Naciones Unidas (UNV)",
    country: "Internacional",
    flag: "🇺🇳",
    desc: "Misiones de paz y desarrollo comunitario sostenible respaldadas por el programa UNV de la ONU.",
    specs: [{ label: "Estipendio", val: "Subsidio de Vida UNV" }, { label: "Idioma", val: "Inglés / Francés" }, { label: "Nivel", val: "Profesionales & Jóvenes" }],
    route: "/voluntariados/un-voluntariado",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=800&auto=format&fit=crop&q=80",
    badgeColor: "bg-indigo-50 text-indigo-700 border border-indigo-200"
  }
];

function SingleCategoryCarousel({
  badge,
  badgeColor,
  title,
  subtitle,
  items,
  icon: HeaderIcon
}: {
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  items: typeof scholarshipCarouselItems;
  icon: any;
}) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, items.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const visibleItems = [
    items[currentIndex % items.length],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ];

  return (
    <div
      className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-8 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1.5 text-left">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
            <HeaderIcon className="w-3.5 h-3.5" />
            {badge}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#061b58] tracking-tight">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-light">{subtitle}</p>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrev}
            type="button"
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#061b58] font-bold flex items-center justify-center transition-all cursor-pointer border-none"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            type="button"
            className="w-10 h-10 rounded-xl bg-[#061b58] hover:bg-[#2455bb] text-white font-bold flex items-center justify-center transition-all cursor-pointer border-none"
          >
            <ArrowRight className="w-4 h-4 text-[#ffc928]" />
          </button>
        </div>
      </div>

      {/* Grid Track */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleItems.map((item, idx) => (
          <motion.div
            key={`${item.id}-${currentIndex}-${idx}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm backdrop-blur-md ${item.badgeColor}`}>
                  {item.type}
                </span>
                <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1">
                  <span>{item.flag}</span>
                  <span>{item.country}</span>
                </span>
              </div>

              <div className="space-y-1.5 text-left">
                <h4 className="text-lg font-extrabold text-[#061b58] leading-tight group-hover:text-[#2455bb] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-2">
                  {item.desc}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                {item.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-semibold uppercase">{spec.label}:</span>
                    <span className="font-bold text-[#061b58]">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(item.route)}
              className="w-full py-3 rounded-xl bg-[#061b58] hover:bg-[#2455bb] text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none shadow-sm"
            >
              Ver Detalles
              <ArrowRight className="w-3.5 h-3.5 text-[#ffc928]" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer border-none ${currentIndex % items.length === idx ? "w-6 bg-[#2455bb]" : "w-2 bg-slate-300"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

function ExploreOpportunitiesCarousel() {
  const [activeTab, setActiveTab] = useState<"all" | "becas" | "voluntariados">("all");

  return (
    <section id="opportunities" className="w-full bg-slate-50/70 py-20 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#2455bb]">
              Catálogo Interactivo de Convocatorias
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#061b58] tracking-tight">
              Explora Oportunidades
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-light">
              Filtra convocatorias por categoría. Navega en carruseles independientes para Becas y Voluntariados.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm shrink-0">
            <button
              onClick={() => setActiveTab("all")}
              type="button"
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border-none ${activeTab === "all" ? "bg-[#061b58] text-white shadow-sm" : "text-slate-600 hover:text-[#061b58]"
                }`}
            >
              Ver Ambos Carruseles
            </button>
            <button
              onClick={() => setActiveTab("becas")}
              type="button"
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border-none flex items-center gap-1.5 ${activeTab === "becas" ? "bg-[#061b58] text-white shadow-sm" : "text-slate-600 hover:text-[#061b58]"
                }`}
            >
              <GraduationCap className="w-4 h-4 text-[#ffc928]" />
              Becas (6)
            </button>
            <button
              onClick={() => setActiveTab("voluntariados")}
              type="button"
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border-none flex items-center gap-1.5 ${activeTab === "voluntariados" ? "bg-[#061b58] text-white shadow-sm" : "text-slate-600 hover:text-[#061b58]"
                }`}
            >
              <Heart className="w-4 h-4 text-emerald-400" />
              Voluntariados (4)
            </button>
          </div>
        </div>

        {/* CAROUSEL 1: BECAS INTERNACIONALES */}
        {(activeTab === "all" || activeTab === "becas") && (
          <SingleCategoryCarousel
            badge="Becas Internacionales 100% Financiadas"
            badgeColor="bg-blue-50 text-[#2455bb] border border-blue-200"
            title="🎓 Carrusel de Becas Académicas"
            subtitle="Maestrías, doctorados y licencias universitarias en España, Suiza, Alemania, Corea del Sur y EE.UU."
            items={scholarshipCarouselItems}
            icon={GraduationCap}
          />
        )}

        {/* CAROUSEL 2: VOLUNTARIADOS & LIDERAZGO */}
        {(activeTab === "all" || activeTab === "voluntariados") && (
          <SingleCategoryCarousel
            badge="Programas de Voluntariado & Impacto Social"
            badgeColor="bg-emerald-50 text-emerald-700 border border-emerald-200"
            title="🤝 Carrusel de Voluntariados e Intercambio Social"
            subtitle="Proyectos de liderazgo, desarrollo comunitario y solidaridad con AIESEC, Cuerpo Europeo, TECHO y la ONU."
            items={volunteerCarouselItems}
            icon={Heart}
          />
        )}
      </div>
    </section>
  );
}

// Productos y servicios principales de EduLab
const aiFeatures = [
  {
    title: "Recomendador de oportunidades",
    desc: "Encuentra becas y voluntariados relacionados con tu perfil, considerando países de interés, tipo de programa, área de estudio, nivel académico, inglés y duración preferida.",
    icon: Target,
    badge: "Según tu perfil",
    availability: "Disponible dentro de EduLab",
    color: "bg-[#3b82f6]"
  },
  {
    title: "Simulador de postulación a becas",
    desc: "Revisa requisitos personales, académicos, de idioma y experiencia; controla documentos de respaldo y recibe un resultado con pendientes, fecha límite y plan de acción.",
    icon: FileCheck,
    badge: "Solo para becas",
    availability: "Proceso guiado de postulación",
    color: "bg-[#8b5cf6]"
  },
  {
    title: "Generador y revisor de currículum vitae",
    desc: "Crea un CV desde tu perfil, revisa uno existente y adáptalo a becas, voluntariados, intercambios y otros programas académicos.",
    icon: User,
    badge: "Crear, revisar y adaptar",
    availability: "Disponible de forma independiente o en el simulador",
    color: "bg-[#f59e0b]"
  },
  {
    title: "Generador y revisor de cartas de motivación",
    desc: "Prepara una carta personalizada con información real de tu perfil o revisa una carta existente según la oportunidad, sus objetivos y el límite de palabras.",
    icon: FileText,
    badge: "Contenido personalizado",
    availability: "Disponible de forma independiente o en el simulador",
    color: "bg-[#ec4899]"
  },
  {
    title: "Preparación de entrevistas",
    desc: "Accede a una sesión individual por videollamada con una persona especializada para practicar preguntas, mejorar respuestas y comunicar mejor tus experiencias, objetivos y logros.",
    icon: MessageSquare,
    badge: "Orientación especializada",
    availability: "Contratable al avanzar a la etapa de entrevista",
    color: "bg-[#10b981]"
  }
];


const pricingPlans = [
  {
    title: "Impulsa",
    price: "Bs 29",
    description: "Genera un nuevo CV o revisa y adapta uno que ya tengas para una oportunidad específica.",
    features: [
      "Hasta 3 generaciones de CV",
      "Hasta 3 revisiones de tu cv existente",
      "Estructura, claridad y redacción",
      "Revisión de información faltante",
      "Adaptación a becas o voluntariados",
      "Documento editable y descargable",
    ],
    icon: User,
    button: "Preparar mi CV",
    accent: "from-amber-400 to-orange-500",
    priceNote: "",
    featured: false,
  },
  {
    title: "Convence",
    price: "Bs 39",
    description: "Crea una carta personalizada o mejora una carta existente con base en tu experiencia real.",
    features: [
      "Hasta 3 generaciones de cartas de motivación",
      "Hasta 3 revisiones de tu carta de motivación existente",
      "Adaptación a la oportunidad",
      "Revisión de claridad y coherencia",
      "Detección de frases genéricas",
      "Recomendaciones de mejora",
    ],
    icon: FileText,
    button: "Preparar mi carta",
    accent: "from-pink-500 to-rose-500",
    priceNote: "",
    featured: false,
  },
  {
    title: "Avanza",
    price: "Bs 79",
    description: "Organiza tu candidatura a una beca y conoce qué necesitas completar antes de postular.",
    features: [
      "Hasta 3 simulaciones de postulación",
      "Revisión de perfil ",
      "Incluye plan Impulsa",
      "Incluye plan Convence",
      "Verificación de requisitos",
      "Control de documentos de respaldo",
      "Plan de acción",
    ],
    icon: FileCheck,
    button: "Simular mi postulación",
    accent: "from-violet-500 to-blue-500",
    priceNote: "",
    featured: true,
  },
  {
    title: "Destaca",
    price: "Bs 149",
    priceNote: "por sesión",
    description: "Prepare para tu entrevista con una persona especializada en una sesión individual de 30 a 45 minutos .",
    features: [
      "Simulación de entrevista",
      "Preparación de preguntas probables",
      "Evaluación de respuestas",
      "Retroalimentación personalizada",
    ],
    icon: MessageSquare,
    button: "Preparar mi entrevista",
    accent: "from-emerald-500 to-teal-500",
    featured: false,
  },
];

const getDaysUntilDeadline = (deadline: string) => {
  const today = new Date();
  const closingDate = new Date(deadline);

  today.setHours(0, 0, 0, 0);
  closingDate.setHours(0, 0, 0, 0);

  const difference = closingDate.getTime() - today.getTime();
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  if (days < 0) return "Convocatoria cerrada";
  if (days === 0) return "Cierra hoy";
  if (days === 1) return "Cierra mañana";

  return `Cierra en ${days} días`;
};


export default function LandingPageV2({ initialAuthMode }: LandingPageV2Props) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(Boolean(initialAuthMode));
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
    initialAuthMode ?? "login",
  );
  useEffect(() => {
    if (!initialAuthMode) return;
    setAuthModalMode(initialAuthMode);
    setShowAuthModal(true);
  }, [initialAuthMode]);

  const openAuth = (mode: "login" | "register") => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
    setMenuOpen(false);
  };

  const goToPrograms = () => {
    if (isAuthenticated) {
      navigate("/programs");
      return;
    }
    openAuth("register");
  };

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const openProductModal = (product: ProductItem) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
  };

  const handleProductAction = (_product: ProductItem, _isSecondary?: boolean) => {
    setIsProductModalOpen(false);
    if (!isAuthenticated) {
      openAuth("register");
      return;
    }
    navigate("/ai-tools");
  };

  return (
    <main className="min-h-screen bg-white text-[#061b58]">
      <PublicNavbar onOpenAuth={openAuth} />
      <section className="landing-v2-hero" aria-labelledby="hero-title">
        <video
          className="landing-v2-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/hero-edulab-poster.jpg"
          aria-hidden="true"
        >
          <source src="/videos/hero-edulab.webm" type="video/webm" />
        </video>

        <div className="landing-v2-overlay" />
        <div className="landing-v2-vignette" />


        <div className="landing-v2-content">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="mx-auto flex max-w-5xl flex-col items-center text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur-md sm:text-sm">
              <Globe2 className="h-4 w-4 text-[#ffc928]" />
              Becas, voluntariados y oportunidades internacionales
            </div>

            <h1 id="hero-title" className="landing-v2-title">
              Tu futuro internacional comienza aquí
              <span> con edulab </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base font-medium leading-relaxed text-white/82 sm:text-lg md:text-xl">
              EduLab reúne información confiable y herramientas para ayudarte a descubrir oportunidades,
              preparar tus documentos y avanzar con más claridad en cada postulación.
            </p>

            <div className="mt-9 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={goToPrograms}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#ffc928] px-8 text-base font-extrabold text-[#061b58] shadow-xl shadow-amber-300/20 transition hover:-translate-y-1 hover:bg-[#ffd34f]"
              >
                Explorar oportunidades <ArrowRight className="h-5 w-5" />
              </button>
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => openAuth("register")}
                  className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/18"
                >
                  Regístrate Gratis
                </button>
              )}
            </div>

            <div className="mt-12 grid w-full max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {productsData.map((prod) => {
                const Icon = prod.icon;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => openProductModal(prod)}
                    className="group relative flex flex-col justify-between items-start text-left p-5 rounded-2xl border border-white/15 bg-[#021448]/55 backdrop-blur-md transition-all duration-300 hover:border-[#ffc928]/60 hover:bg-[#021448]/80 hover:-translate-y-1 shadow-lg cursor-pointer border-none overflow-hidden"
                    aria-label={`Ver detalles de ${prod.title}`}
                  >
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#ffc928]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#ffc928]/25 transition duration-500" />

                    <div className="flex items-center gap-3 mb-3 w-full">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#ffc928]/35 bg-[#ffc928]/15 text-[#ffc928] group-hover:scale-105 group-hover:bg-[#ffc928] group-hover:text-[#061b58] transition duration-300 shadow-sm">
                        <Icon className="h-5.5 w-5.5" />
                      </div>
                      <h3 className="text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-[#ffc928] transition-colors">
                        {prod.title}
                      </h3>
                    </div>

                    <p className="text-xs text-white/80 font-normal leading-relaxed mb-4 flex-1">
                      {prod.cardShortDesc}
                    </p>

                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#ffc928] group-hover:translate-x-1 transition-transform">
                      <span>Ver producto</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-white/72 sm:text-sm">
              <span>Información verificada</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffc928]" />
              <span>Actualizada constantemente</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffc928]" />
              <span>Gratis para explorar</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="convocatorias"
        className="bg-[#f8faff] px-5 py-16 sm:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          {/* Encabezado */}
          <div className="mb-9 flex items-end justify-between gap-5">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#2455bb]">
                No pierdas la fecha
              </span>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#061b58] sm:text-3xl lg:text-4xl">
                Convocatorias que cierran pronto
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Revisa las oportunidades que están próximas a cerrar y prepara tu
                postulación con anticipación.
              </p>
            </div>

            <button
              type="button"
              onClick={goToPrograms}
              className="hidden shrink-0 items-center gap-2 text-sm font-extrabold text-[#2455bb] transition hover:text-[#061b58] sm:inline-flex"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Tarjetas */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {closingSoonOpportunities.map((opportunity, index) => (
              <motion.article
                key={opportunity.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                onClick={() => navigate(opportunity.route)}
                className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl cursor-pointer"
              >
                <div className="flex w-full flex-col">
                  {/* Imagen */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-slate-200">
                    <img
                      src={opportunity.image}
                      alt={opportunity.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#061b58]/30 via-transparent to-transparent" />

                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-extrabold shadow-sm ${opportunity.badgeClass}`}
                    >
                      {opportunity.type}
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="flex flex-1 flex-col p-5 justify-between">
                    <div className="space-y-3">
                      <h3 className="min-h-[56px] text-lg font-extrabold leading-snug text-[#061b58] group-hover:text-[#2455bb] transition-colors">
                        {opportunity.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span className="text-base">{opportunity.flag}</span>
                        <span>{opportunity.country}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-bold text-rose-500">
                        <Clock3 className="h-4 w-4" />
                        <span>{opportunity.deadline}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); navigate(opportunity.route); }}
                      className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-[#061b58] transition hover:border-[#2455bb] hover:bg-blue-50 hover:text-[#2455bb] cursor-pointer"
                    >
                      Ver detalles
                      <ArrowRight className="h-4 w-4 text-[#ffc928]" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Botón móvil */}
          <button
            type="button"
            onClick={goToPrograms}
            className="mx-auto mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-[#2455bb] sm:hidden"
          >
            Ver todas las convocatorias
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          EXPLORA OPORTUNIDADES — CARRUSEL CIRCULAR INFINITO EN TARJETAS VERTICALES
         ───────────────────────────────────────────────────────────────────────────── */}
      <ExploreOpportunitiesCarousel />


      <section className="relative w-full bg-gradient-to-b from-[#00135B] to-[#001a7a] text-white py-24 px-6 z-10 flex flex-col items-center">

        {/* Isolated Moving Square Grid Layer */}
        <div className="absolute inset-0 tech-grid opacity-75 pointer-events-none z-0"></div>

        {/* Glow Spheres */}
        <div className="absolute top-[20%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[#5D8CE2]/10 filter blur-[130px] pointer-events-none -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl w-full space-y-16 relative z-10"
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-4xl text-white tracking-tight">
              Productos para preparar tu oportunidad
            </h2>
            <p className="text-sm text-gray-300 font-medium leading-relaxed">
              Encuentra oportunidades, organiza tu postulación y fortalece tus documentos con acompañamiento claro en cada etapa
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {aiFeatures.map((feat, idx) => {
              const Icon = feat.icon;

              return (
                <motion.article
                  key={feat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.55,
                    ease: "easeOut",
                    delay: idx * 0.07,
                  }}
                  className="
          group relative min-h-[245px] overflow-hidden
          rounded-[24px] border border-white/10
          bg-gradient-to-br from-white/[0.09] via-white/[0.045] to-white/[0.02]
          p-7 backdrop-blur-xl
          shadow-[0_18px_50px_-22px_rgba(0,0,0,0.65)]
          transition-all duration-300
          hover:-translate-y-1
          hover:border-white/20
          hover:bg-white/[0.10]
          hover:shadow-[0_24px_60px_-24px_rgba(93,140,226,0.40)]
        "
                >
                  {/* Brillo decorativo */}
                  <div
                    className={`
            pointer-events-none absolute -right-16 -top-16
            h-40 w-40 rounded-full opacity-10 blur-3xl
            transition duration-500 group-hover:opacity-20
            ${feat.color}
          `}
                  />

                  {/* Línea superior */}
                  <div
                    className={`
            absolute inset-x-8 top-0 h-[2px]
            rounded-full opacity-60
            ${feat.color}
          `}
                  />

                  <div className="relative z-10 flex h-full flex-col">
                    {/* Encabezado */}
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`
                flex h-12 w-12 shrink-0 items-center justify-center
                rounded-2xl shadow-lg ring-1 ring-white/15
                transition duration-300
                group-hover:scale-105 group-hover:rotate-2
                ${feat.color}
              `}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>

                      <span
                        className="
                rounded-full border border-[#F5C542]/30
                bg-[#F5C542]/[0.07]
                px-3 py-1
                text-[10px] font-extrabold uppercase
                tracking-[0.12em] text-[#F5C542]
              "
                      >
                        {feat.badge}
                      </span>
                    </div>

                    {/* Contenido */}
                    <div className="mt-6">
                      <h3 className="font-display text-xl font-extrabold tracking-tight text-white">
                        {feat.title}
                      </h3>

                      <p className="mt-3 max-w-sm text-sm font-medium leading-6 text-slate-300/75">
                        {feat.desc}
                      </p>
                    </div>

                    {/* Pie informativo, no es botón */}
                    <div className="mt-auto flex items-center gap-2 border-t border-white/[0.08] pt-5">
                      <CheckCircle2 className="h-4 w-4 text-[#F5C542]" />

                      <span className="text-xs font-bold tracking-wide text-white/60">
                        {feat.availability}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </section>



      <section className="relative w-full overflow-hidden bg-[#f7f9ff] px-6 py-24 z-20">
        <div className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-yellow-200/30 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto max-w-7xl"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-[#00135B] md:text-5xl">
              Encuentra oportunidades gratis. Prepárate cuando estés listo.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600 md:text-base">
              Explora becas y voluntariados sin pagar. Cuando encuentres una oportunidad importante para ti, elige solamente la herramienta que necesites.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-[28px] border border-blue-100 bg-white p-7 shadow-[0_24px_70px_-35px_rgba(0,19,91,0.35)] md:p-9">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#00135B]">
                    <Globe2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-500">Todo comienza gratis</p>
                    <h3 className="font-display text-2xl font-extrabold text-[#00135B]">Explora oportunidades</h3>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-2">
                  {["Crear tu perfil EduLab", "Recibir recomendaciones", "Explorar becas y voluntariados", "Guardar tus oportunidades favoritas", "Una generación de cv o carta de motivación", "Una revision de cv o carta de motivacion"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
                <div>
                  <span className="font-display text-4xl font-extrabold text-[#00135B]">Gratis</span>
                </div>
                {!isAuthenticated ? (
                  <button
                    onClick={() => openAuth("register")}
                    className="rounded-xl border-none bg-[#F5C542] px-7 py-3.5 text-sm font-extrabold text-[#00135B] shadow-md shadow-yellow-300/30 transition hover:-translate-y-0.5 hover:bg-[#ebd035] cursor-pointer"
                  >
                    Crear mi perfil gratis
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/programs")}
                    className="rounded-xl border-none bg-[#F5C542] px-7 py-3.5 text-sm font-extrabold text-[#00135B] shadow-md shadow-yellow-300/30 transition hover:-translate-y-0.5 hover:bg-[#ebd035] cursor-pointer"
                  >
                    Explorar oportunidades
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <article
                  key={plan.title}
                  className={`relative flex h-full flex-col overflow-hidden rounded-[26px] border bg-white p-7 transition duration-300 hover:-translate-y-1 ${plan.featured
                    ? "border-violet-300 shadow-[0_26px_65px_-28px_rgba(124,58,237,0.5)] ring-2 ring-violet-100"
                    : "border-slate-200 shadow-[0_20px_55px_-32px_rgba(0,19,91,0.35)]"
                    }`}
                >
                  {plan.featured && (
                    <div className="absolute right-0 top-0 rounded-bl-2xl bg-[#00135B] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white">
                      Preparación completa
                    </div>
                  )}

                  {/* CONTENIDO SUPERIOR */}
                  <div className="flex flex-1 flex-col">

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.accent} text-white shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-6 font-display text-xl font-extrabold leading-tight text-[#00135B]">
                      {plan.title}
                    </h3>

                    <div className="mt-4 flex h-12 items-end gap-2">
                      <span className="font-display text-4xl font-extrabold text-[#00135B]">
                        {plan.price}
                      </span>

                      {plan.priceNote && (
                        <span className="pb-1 text-xs font-bold text-slate-400">
                          {plan.priceNote}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 h-[96px] text-sm font-medium leading-6 text-slate-600">                      {plan.description}
                    </p>

                    {/* BOTÓN */}
                    <button
                      onClick={() =>
                        isAuthenticated ? navigate("/programs") : openAuth("register")
                      }
                      className={`mt-6 w-full rounded-xl border-none px-5 py-3.5 text-sm font-extrabold transition hover:-translate-y-0.5 cursor-pointer ${plan.featured
                        ? "bg-[#00135B] text-white shadow-md shadow-blue-900/20 hover:bg-[#0d288c]"
                        : "bg-blue-50 text-[#00135B] hover:bg-blue-100"
                        }`}
                    >
                      {isAuthenticated ? "Elegir Plan" : plan.button}
                    </button>

                    {/* CARACTERÍSTICAS */}
                    <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-2.5 text-sm font-semibold leading-5 text-slate-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section
        id="perfiles-destacados"
        className="relative z-0 overflow-hidden bg-[#f7f9ff] px-5 py-20 sm:px-8 lg:py-24"
      >
        {/* Decoración de fondo */}
        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-200/30 blur-[110px]" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-amber-100/50 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl">
          {/* Encabezado */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-amber-700">
              <Award className="h-4 w-4" />
              Perfiles destacados
            </span>

            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[#00135B] sm:text-4xl lg:text-5xl">
              Inspírate en perfiles que lograron oportunidades internacionales
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-500 sm:text-lg">
              Conoce experiencias, fortalezas y aprendizajes que pueden ayudarte a
              preparar una postulación más sólida.
            </p>
          </motion.div>

          {/* Tarjetas */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {winnerProfiles.map((profile, index) => (
              <motion.article
                key={profile.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                className="
            group relative overflow-hidden rounded-[26px]
            border border-slate-200 bg-white p-6
            shadow-[0_18px_50px_-30px_rgba(0,19,91,0.25)]
            transition-all duration-300
            hover:-translate-y-1
            hover:border-blue-200
            hover:shadow-[0_24px_65px_-30px_rgba(36,85,187,0.35)]
          "
              >
                {/* Línea superior con color */}
                <div
                  className={`absolute inset-x-6 top-0 h-[3px] rounded-full bg-gradient-to-r ${profile.accent}`}
                />

                {/* Cabecera del perfil */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={profile.image}
                      alt={`Perfil de ${profile.name}`}
                      loading="lazy"
                      className="h-16 w-16 rounded-2xl object-cover ring-4 ring-blue-50"
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://ui-avatars.com/api/?background=EAF1FF&color=00135B&name=" +
                          encodeURIComponent(profile.name);
                      }}
                    />

                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#2455bb]">
                      <BadgeCheck className="h-3.5 w-3.5 text-white" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-lg font-extrabold text-[#00135B]">
                      {profile.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs font-bold leading-relaxed text-[#2455bb]">
                      {profile.scholarship}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <span>{profile.flag}</span>
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{profile.country}</span>
                    </div>
                  </div>
                </div>

                {/* Características */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {profile.traits.map((trait) => (
                    <span
                      key={trait}
                      className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold text-[#2455bb]"
                    >
                      {trait}
                    </span>
                  ))}
                </div>

                {/* Frase */}
                <div className="relative mt-6 rounded-2xl bg-slate-50 p-4">
                  <Quote className="absolute right-3 top-3 h-5 w-5 text-blue-100" />

                  <p className="relative pr-4 text-sm font-medium leading-6 text-slate-600">
                    “{profile.quote}”
                  </p>
                </div>

                {/* Pie */}
                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                  <span className="text-xs font-bold text-slate-500">
                    Experiencia compartida con EduLab
                  </span>
                </div>
              </motion.article>
            ))}
          </div>


        </div>
      </section>


      <section id="recursos" className="px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#07206a] to-[#123f9e] px-7 py-10 text-center text-white md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Empieza a explorar tu próxima oportunidad</h2>
            <p className="mt-2 text-white/70">Crea tu perfil y reúne en un solo lugar todo lo necesario para postular.</p>
          </div>
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => openAuth("register")}
              className="shrink-0 rounded-xl bg-[#ffc928] px-7 py-4 font-extrabold text-[#061b58] transition hover:-translate-y-0.5 hover:bg-[#ffd34f]"
            >
              Regístrate gratis
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/programs")}
              className="shrink-0 rounded-xl bg-[#ffc928] px-7 py-4 font-extrabold text-[#061b58] transition hover:-translate-y-0.5 hover:bg-[#ffd34f]"
            >
              Explorar oportunidades
            </button>
          )}
        </div>
      </section>

      <footer className="relative w-full bg-[#00135B] text-white overflow-hidden pt-16 pb-8 px-8 z-10 flex flex-col items-center">

        {/* Isolated Moving Square Grid Layer */}
        <div className="absolute inset-0 tech-grid opacity-50 pointer-events-none z-0"></div>

        {/* Glow Spheres */}
        <div className="absolute top-[-50%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#5D8CE2]/10 filter blur-[100px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10 relative z-10">

          {/* Column 1: Brand info */}
          <div className="space-y-4 text-left">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#00135B]" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider text-white">
                EDU<span className="text-[#5D8CE2] font-semibold">LAB</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed font-medium max-w-xs">
              Plataforma inteligente para empoderar estudiantes y conectarlos con becas de excelencia y voluntariados internacionales.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-gray-400 hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-gray-400 hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.95 4.57a10 10 0 01-2.82.77 4.96 4.96 0 002.16-2.72c-.95.55-2 .96-3.12 1.18a4.92 4.92 0 00-8.38 4.48A14 14 0 011.67 3.15a4.93 4.93 0 001.52 6.57c-.8-.03-1.57-.25-2.24-.62v.06a4.92 4.92 0 003.95 4.83 4.9 4.9 0 01-2.22.08 4.93 4.93 0 004.6 3.42A9.9 9.9 0 010 19.54a13.9 13.9 0 007.55 2.21c9.05 0 14-7.5 14-14 0-.21 0-.43-.02-.64A10 10 0 0024 4.56l-.05.01z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-gray-400 hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-gray-400 hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-gray-400 hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.519 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.869.508 9.388.508 9.388.508s7.519 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Oportunidades links */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Oportunidades</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li><button onClick={() => openAuth("login")} className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer">Becas Internacionales</button></li>
              <li><button onClick={() => openAuth("login")} className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer">Voluntariados Globales</button></li>
            </ul>
          </div>

          {/* Column 3: Recursos links */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Recursos</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li><button onClick={() => openAuth("login")} className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer">Blog & Noticias</button></li>
              <li><button onClick={() => openAuth("login")} className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer">Guías de Postulación</button></li>
              <li><button onClick={() => openAuth("login")} className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer">Preguntas Frecuentes</button></li>
              <li><button onClick={() => openAuth("login")} className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer">Casos de Éxito</button></li>
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Contacto</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li>soporte@edulab.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Latinoamérica & Global</li>
            </ul>
            <button className="px-5 py-2 mt-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-bold text-white transition-all duration-200 cursor-pointer">
              Contáctanos
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 text-[11px] text-gray-500 font-semibold relative z-10">
          <p>© 2026 EDULAB - EduServer Platform. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Configuración de Cookies</a>
          </div>
          {/* Badge Final */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] text-[#F5C542] font-extrabold uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Powered by EduServer Tech</span>
          </span>
        </div>

      </footer>

      <ProductInfoModal
        isOpen={isProductModalOpen}
        product={selectedProduct}
        onClose={closeProductModal}
        onAction={handleProductAction}
      />

      <AuthModal
        key={authModalMode}
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
    </main>
  );
}
