import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Award, CheckCircle2, ChevronDown, Globe, BookOpen,
  AlertCircle, Star, ArrowRight, ArrowLeft, Sparkles, ExternalLink,
  HelpCircle, Users, Trophy, Lightbulb,
  GraduationCap, DollarSign, Clock, Calendar, Languages,
  MapPin, Building2, Zap, Loader2, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import fulbrightAboutImg from "../../assets/fulbright/becafulbright.jpg";
import fulbrightPhoto from "../../assets/fulbright/images (2).jpeg";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import { useAuthStore } from "../../store/useAuthStore";
import axiosClient from "../../services/api/axiosClient";
import fulbrightBg from "../../assets/fulbright/662bb8d0a1a92_.png";
import fulbrightLogo from "../../assets/fulbright/images (1).png";


// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface IdealProfileItem {
  emoji: string;
  title: string;
  tags: string[];
}

interface Testimonial {
  name: string;
  country: string;
  year: string;
  university: string;
  program: string;
  quote: string;
  avatar: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ScholarshipProgram {
  id: number;
  title: string;
  slug: string;
  type: string;
  country: string;
  city?: string;
  institution?: string;
  level?: string;
  funding_type?: string;
  area?: string;
  language?: string;
  duration?: string;
  deadline?: string;
  description: string;
  short_description?: string;
  organization?: string;
  organization_name?: string;
  status: string;
  image_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  official_url?: string;
  eligibility?: string;
  benefits_json?: string[];
  requirements?: string[];
  activities?: string[];
  support_ai?: string[];
  ideal_profile?: IdealProfileItem[];
  testimonials?: Testimonial[];
  faq?: FaqItem[];
  dates_info?: string;
  is_demo: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODAL
// ─────────────────────────────────────────────────────────────────────────────
function AuthRequiredModal({
  onClose,
  onLogin,
  onRegister,
}: {
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-5 border border-gray-100">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: "rgba(0,19,91,0.08)" }}
        >
          <GraduationCap className="w-8 h-8 text-[#00135B]" />
        </div>
        <h3 className="font-extrabold text-xl text-[#00135B]">
          Inicia sesión para postular
        </h3>
        <p className="text-sm text-slate-500">
          Crea tu cuenta gratis o inicia sesión para postularte a esta beca con
          el apoyo de IA de EDULAB.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onLogin}
            className="w-full py-3 rounded-xl bg-[#00135B] text-white font-bold text-sm hover:bg-[#0d288c] transition-all"
          >
            Iniciar sesión
          </button>
          <button
            onClick={onRegister}
            className="w-full py-3 rounded-xl border border-[#00135B] text-[#00135B] font-bold text-sm hover:bg-[#00135B]/5 transition-all"
          >
            Crear cuenta gratis
          </button>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ ITEM
// ─────────────────────────────────────────────────────────────────────────────
function FaqAccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        borderColor: open ? "#5D8CE2" : "rgba(93,140,226,0.15)",
        background: open ? "rgba(93,140,226,0.04)" : "white",
        boxShadow: open ? "0 4px 20px rgba(93,140,226,0.1)" : "none",
      }}
      onClick={() => setOpen(!open)}
    >
      <div className="w-full flex items-center justify-between px-6 py-5">
        <span className="font-semibold text-[#00135B] text-sm pr-4 text-left">
          {q}
        </span>
        <ChevronDown
          className="w-5 h-5 text-[#5D8CE2] shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────
function ProgressBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-white/80 text-xs font-medium">{label}</span>
        <span className="font-black text-xs" style={{ color: "#F5C542" }}>
          {pct}%
        </span>
      </div>
      <div
        className="h-2 rounded-full"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="h-2 rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #5D8CE2, #F5C542)",
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO IMAGES for scholarships (fallback gallery)
// ─────────────────────────────────────────────────────────────────────────────
const SCHOLARSHIP_IMAGES = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80", // students USA
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=80", // graduation
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=900&q=80", // university
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=900&q=80", // studying
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT — PremiumScholarshipPage (dynamic & reusable)
// ─────────────────────────────────────────────────────────────────────────────
export default function PremiumScholarshipPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();

  const [program, setProgram] = useState<ScholarshipProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [, setAuthMode] = useState<"login" | "register">("login");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [heroImgIdx] = useState(() => Math.floor(Math.random() * SCHOLARSHIP_IMAGES.length));
  const [playHeroVideo, setPlayHeroVideo] = useState(false);
  const [showIntroVideo, setShowIntroVideo] = useState(false);

  const heroVideos = [
    {
      title: "Conoce la experiencia Fulbright",
      url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1006564038828442&show_text=0"
    },
    {
      title: "Testimonio de ex-becarios",
      url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F991543300065303&show_text=0"
    }
  ];
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [activeBenefitIdx, setActiveBenefitIdx] = useState(0);

  const getBenefitDetails = (title: string, index: number) => {
    const cleanTitle = title.replace(/[^\w\saféíóúÁÉÍÓÚñÑ]/gu, "").trim().toLowerCase();

    type BenefitDetail = {
      desc: string; longDesc: string; image: string; color: string; bg: string;
      checklist: string[]; advantages: string[]; tip: string;
    };

    const mapper: Record<string, BenefitDetail> = {
      "matricula completa": {
        desc: "Aranceles universitarios totalmente cubiertos en instituciones de excelencia académica mundial.",
        longDesc: "La beca cubre el 100% de los costos de matrícula en las instituciones participantes, eliminando por completo la barrera económica del acceso a la educación superior internacional.",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        color: "#2563eb",
        bg: "rgba(37,99,235,0.05)",
        checklist: ["Arancel de posgrado completo", "Costos de inscripción", "Tarifas administrativas", "Acceso a bibliotecas y laboratorios"],
        advantages: ["Sin deuda estudiantil", "Instituciones top-tier globales", "Múltiples disciplinas elegibles"],
        tip: "Prepara tu expediente académico con anticipación. EduLab ofrece revisión de documentos y simulacros de entrevista gratuitos."
      },
      "pasajes internacionales": {
        desc: "Vuelos de ida y vuelta cubiertos desde tu país de origen hasta el destino del programa.",
        longDesc: "La beca cubre los pasajes aéreos internacionales de ida al comenzar el programa y de regreso al finalizarlo, garantizando que el acceso geográfico nunca sea un obstáculo.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
        color: "#0284c7",
        bg: "rgba(2,132,199,0.05)",
        checklist: ["Vuelo de ida al inicio del programa", "Vuelo de regreso al finalizar", "Equipaje documentado incluido", "Escala cubierta cuando corresponda"],
        advantages: ["Cero gastos de transporte aéreo", "Coordinación directa institucional", "Flexibilidad de fechas"],
        tip: "Coordina tu vuelo con 8 semanas de anticipación. Los asesores EduLab te acompañan en el proceso de reserva y tramitación de visa."
      },
      "estipendio mensual": {
        desc: "Asignación mensual ajustada al costo de vida local para alojamiento, alimentación y más.",
        longDesc: "Recibes una asignación mensual calculada según el costo de vida real en tu ciudad destino, para que puedas enfocarte completamente en tus estudios sin preocupaciones económicas.",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
        color: "#d97706",
        bg: "rgba(217,119,6,0.05)",
        checklist: ["Alojamiento en ciudad destino", "Alimentación y transporte local", "Materiales y útiles académicos", "Gastos personales cotidianos"],
        advantages: ["Monto ajustado al costo local real", "Depósitos mensuales puntuales", "Manutención garantizada"],
        tip: "EduLab ofrece talleres de planificación financiera gratuitos. Aprende a optimizar tu estipendio con estrategias probadas por ex-becarios."
      },
      "seguro medico": {
        desc: "Seguro de salud completo durante todo el programa, incluyendo emergencias y salud mental.",
        longDesc: "La beca incluye un seguro médico internacional que cubre desde consultas de rutina hasta emergencias, con acceso a salud preventiva y atención de calidad.",
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
        color: "#059669",
        bg: "rgba(5,150,105,0.05)",
        checklist: ["Consultas médicas generales", "Emergencias y hospitalización", "Medicamentos recetados", "Atención en salud mental"],
        advantages: ["Sin copago en emergencias", "Red de clínicas certificadas global", "Telemedicina 24/7"],
        tip: "Lleva tu historial médico traducido al idioma del país destino. EduLab ofrece plantillas certificadas en diversos idiomas."
      },
      "apoyo inicial de instalacion": {
        desc: "Subsidio inicial único para los primeros gastos al establecerte en el país destino.",
        longDesc: "Un subsidio único al llegar cubre los gastos iniciales críticos del proceso de instalación, para que tu llegada sea tranquila y puedas concentrarte desde el primer día.",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
        color: "#7c3aed",
        bg: "rgba(124,58,237,0.05)",
        checklist: ["Depósito y primer mes de arriendo", "Equipamiento básico del hogar", "Conexiones de servicios básicos", "Traslado local desde el aeropuerto"],
        advantages: ["Pago único al llegar", "Orientación presencial", "Cubre imprevistos de llegada"],
        tip: "Únete a la comunidad EduLab en tu ciudad destino antes de llegar para recibir recomendaciones de alojamiento confiables."
      },
      "acceso a red internacional": {
        desc: "Acceso vitalicio a la red de líderes académicos y profesionales del programa.",
        longDesc: "Accedes de por vida a una comunidad internacional de graduados y profesionales líderes en sus áreas alrededor del mundo.",
        image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80",
        color: "#db2777",
        bg: "rgba(219,39,119,0.05)",
        checklist: ["Comunidad de ex-becarios mundial", "Eventos y conferencias exclusivos", "Plataforma digital de networking", "Programa de mentorías activo"],
        advantages: ["Conexiones con líderes globales", "Oportunidades laborales exclusivas", "Membresía de por vida"],
        tip: "EduLab conecta a becarios activos con mentores experimentados en tu área. Agenda tu sesión de mentoría."
      }
    };

    for (const key of Object.keys(mapper)) {
      if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
        return mapper[key];
      }
    }

    const fallbacks: BenefitDetail[] = [
      { desc: "Apoyo financiero completo para cubrir los costos esenciales del programa académico y matrícula.", longDesc: "La beca cubre al 100% los costos del programa académico seleccionado, eliminando barreras económicas de acceso.", image: fulbrightAboutImg, color: "#3b82f6", bg: "rgba(59,130,246,0.05)", checklist: ["Cobertura completa", "Sin costos adicionales"], advantages: ["100% financiado"], tip: "Consulta a los asesores de EduLab para maximizar tus posibilidades de obtener este beneficio." },
      { desc: "Transporte y traslados cubiertos para facilitar tu llegada e integración al programa.", longDesc: "Los traslados necesarios para el desarrollo del programa están completamente cubiertos por la beca.", image: fulbrightPhoto, color: "#10b981", bg: "rgba(16,185,129,0.05)", checklist: ["Traslados incluidos", "Coordinación directa"], advantages: ["Sin gastos de transporte"], tip: "EduLab te asesora en la coordinación logística de tu traslado." },
      { desc: "Estipendio periódico para garantizar tu bienestar y sustento diario durante el programa.", longDesc: "Recibirás un estipendio mensual ajustado al costo de vida real de tu ciudad destino.", image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80", color: "#f59e0b", bg: "rgba(245,158,11,0.05)", checklist: ["Alojamiento", "Alimentación", "Transporte"], advantages: ["Depósitos puntuales"], tip: "Optimiza tu estipendio con los talleres financieros gratuitos de EduLab." },
      { desc: "Seguro de salud para brindarte asistencia y protección médica en todo momento.", longDesc: "Cobertura médica completa durante todo el programa, incluyendo emergencias y consultas de rutina.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80", color: "#ec4899", bg: "rgba(236,72,153,0.05)", checklist: ["Consultas generales", "Emergencias"], advantages: ["Cobertura global"], tip: "Prepara tu historial médico con antelación." },
    ];
    return fallbacks[index % fallbacks.length];
  };

  // Load program from backend
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    axiosClient
      .get(`/opportunities/${slug}`)
      .then((res) => {
        setProgram(res.data);
        setLoading(false);
        if (slug === "fulbright-beca") {
          setTimeout(() => setShowIntroVideo(true), 800);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  // Apply handler
  const handleApply = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }
    if (!program) return;
    setApplying(true);
    setApplyError(null);
    try {
      await axiosClient.post("/applications/", { program_id: program.id });
      setApplySuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Error al crear postulación.";
      if (
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("ya existe")
      ) {
        setApplySuccess(true);
      } else {
        setApplyError(msg);
      }
    } finally {
      setApplying(false);
    }
  }, [isAuthenticated, token, program]);

  // Open auth modal from navbar
  const handleOpenAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // ── LOADING STATE ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <PublicNavbar onOpenAuth={handleOpenAuth} />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 mt-20">
          <Loader2 className="w-10 h-10 text-[#5D8CE2] animate-spin" />
          <p className="text-[#00135B] font-semibold text-sm">
            Cargando beca...
          </p>
        </div>
      </div>
    );
  }

  // ── ERROR STATE ────────────────────────────────────────────────────────────
  if (error || !program) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <PublicNavbar onOpenAuth={handleOpenAuth} />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 mt-20 px-4">
          <AlertTriangle className="w-12 h-12 text-amber-400" />
          <h2 className="font-bold text-xl text-[#00135B]">
            Beca no encontrada
          </h2>
          <p className="text-slate-500 text-sm max-w-sm text-center">
            {error}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 px-6 py-3 rounded-xl bg-[#00135B] text-white font-bold text-sm"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ── DERIVED DATA ────────────────────────────────────────────────────────────
  // const heroImage =
  //   program.image_url && program.image_url.startsWith("http")
  //     ? program.image_url
  //     : SCHOLARSHIP_IMAGES[heroImgIdx];

  const benefits = program.benefits_json || [];
  const requirements = program.requirements || [];
  const aiTools = program.support_ai || [];
  const idealProfile: IdealProfileItem[] = program.ideal_profile || [];
  const testimonials: Testimonial[] = program.testimonials || [];
  const faqs: FaqItem[] = program.faq || [];

  const requirementPriority = (i: number) =>
    i < 3
      ? { label: "Obligatorio", color: "#ef4444" }
      : i < 6
      ? { label: "Importante", color: "#f59e0b" }
      : { label: "Recomendado", color: "#22c55e" };

  const aiToolIcons: Record<number, { color: string; tag: string; emoji: string }> = {
    0: { color: "#5D8CE2", tag: "Más popular", emoji: "✍️" },
    1: { color: "#F5C542", tag: "Recomendado", emoji: "📄" },
    2: { color: "#22c55e", tag: "Nuevo", emoji: "🎤" },
    3: { color: "#a855f7", tag: "Esencial", emoji: "📑" },
    4: { color: "#ef4444", tag: "Clave", emoji: "📬" },
  };

  // ── MAIN RENDER ────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,19,91,0.12); }
        .benefit-card:hover .benefit-accent { opacity: 1; }
        .benefit-accent { opacity: 0; transition: opacity 0.3s ease; }
        .hero-dots { background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='2' cy='2' r='1.5'/%3E%3C/g%3E%3C/svg%3E"); }
      `}</style>

      <PublicNavbar onOpenAuth={handleOpenAuth} />

      {/* ── INTRO VIDEO MODAL (Fulbright) ── */}
      <AnimatePresence>
        {showIntroVideo && program.slug === "fulbright-beca" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowIntroVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative flex flex-col items-center w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Horizontal Video Container */}
              <div
                className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/20"
                style={{ aspectRatio: "16/9" }}
              >
                <iframe
                  className="w-full h-full border-none"
                  src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1006564038828442&show_text=0"
                  title="Beca Fulbright - Conoce la experiencia"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                />
                {/* Fulbright badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg pointer-events-none" style={{ background: "rgba(0,19,91,0.85)" }}>
                  🎓 Beca Fulbright Official
                </div>
              </div>

              {/* Close button */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => setShowIntroVideo(false)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-[#00135B] bg-[#F5C542] hover:bg-[#f5b81a] transition-all cursor-pointer shadow-lg"
                >
                  <span>Explorar la beca</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowIntroVideo(false)}
                  className="text-white/60 text-xs hover:text-white transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION ── */}
      <section
        className="relative overflow-hidden pt-28 pb-10 hero-dots"
        style={{
          background:
            "linear-gradient(165deg, #00135B 0%, #001e87 40%, #0b34a6 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-7">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold"
                style={{
                  background: "rgba(245,197,66,0.15)",
                  borderColor: "rgba(245,197,66,0.3)",
                  color: "#F5C542",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-[#F5C542] animate-pulse" />
                BECA INTERNACIONAL
              </div>

              {/* Title */}
              <h1
                className="font-black leading-none tracking-tight"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}
              >
                <span className="text-white">
                  {program.title.split(" ")[0]}{" "}
                </span>
                <span style={{ color: "#F5C542" }}>
                  {program.title.split(" ").slice(1).join(" ")}
                </span>
              </h1>

              <p className="text-white/75 text-lg leading-relaxed max-w-lg">
                {program.short_description || program.description.substring(0, 140) + "…"}
              </p>

              {/* Quick tags */}
              <div className="flex flex-wrap gap-3">
                {[
                  program.country && { icon: "🌎", text: program.country },
                  program.level && { icon: "🎓", text: program.level },
                  program.funding_type && { icon: "💰", text: program.funding_type },
                  program.language && { icon: "🗣", text: program.language },
                ]
                  .filter(Boolean)
                  .map((tag: any) => (
                    <span
                      key={tag.text}
                      className="px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {tag.icon} {tag.text}
                    </span>
                  ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                {applySuccess ? (
                  <div
                    className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-[#00135B] text-sm cursor-pointer"
                    style={{ background: "#F5C542" }}
                    onClick={() => navigate("/dashboard")}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    ¡Postulación iniciada! Ver Dashboard
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[#00135B] text-sm transition-all hover:scale-105 disabled:opacity-70"
                    style={{
                      background: "#F5C542",
                      boxShadow: "0 4px 20px rgba(245,197,66,0.4)",
                    }}
                  >
                    {applying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    {applying ? "Procesando..." : "Simular mi postulación"}
                    {!applying && <ArrowRight className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white text-sm transition-all hover:bg-white/10"
                  style={{
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Sparkles className="w-4 h-4 text-[#F5C542]" />
                  Aplicar con IA
                </button>
              </div>
              {applyError && (
                <p className="text-red-300 text-sm">{applyError}</p>
              )}



              {/* Stats row */}
              <div
                className="flex flex-wrap gap-8 pt-4 w-full"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
              >
                {[
                  { val: "+3,000", label: "Becados / año" },
                  { val: "170+", label: "Países participantes" },
                  { val: "70+", label: "Años de historia" },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      className="text-2xl font-black"
                      style={{ color: "#F5C542" }}
                    >
                      {s.val}
                    </div>
                    <div className="text-white/55 text-xs font-medium mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

{/* Right side of Hero Section */}
            <div className="relative flex flex-col justify-center">
              {program.slug === "fulbright-beca" ? (
                <div className="relative w-full">
                  <div
                    className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black w-full"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <iframe
                      key="hero-fulbright-video-horizontal"
                      className="w-full h-full border-none"
                      src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1006564038828442&show_text=0"
                      title="Beca Fulbright - Video"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <div
                      className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold text-white pointer-events-none shadow-md"
                      style={{ background: "#22c55e" }}
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Convocatoria Abierta
                    </div>
                  </div>

                  {/* Attributes bar */}
                  <div
                    className="mt-4 p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border border-white/10 w-full"
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    {[
                      { icon: "💲", label: "Financiamiento", val: program.funding_type || "Completo" },
                      { icon: "⏱", label: "Duración", val: program.duration || "1-2 años" },
                      {
                        icon: "📅",
                        label: "Fecha límite",
                        val: program.dates_info?.substring(0, 25) || "Variable",
                      },
                      { icon: "🌐", label: "Modalidad", val: "Presencial" },
                    ].map((item) => (
                      <div key={item.label} className="space-y-0.5">
                        <div className="text-white/40 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <span>{item.icon}</span> {item.label}
                        </div>
                        <div className="text-white font-extrabold text-xs">{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Ficha Técnica oficial para becas sin video */
                <div
                  className="p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6 text-white"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-[#F5C542] uppercase tracking-wider">Ficha Técnica Oficial</span>
                      <h3 className="text-2xl font-black">{program.title}</h3>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Convocatoria Verificada
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">País Destino</span>
                      <p className="font-extrabold text-sm text-white">{program.country}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Entidad</span>
                      <p className="font-extrabold text-sm text-white truncate">{program.organization_name || program.organization}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Duración</span>
                      <p className="font-extrabold text-sm text-white">{program.duration || "1-2 años"}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Financiamiento</span>
                      <p className="font-extrabold text-sm text-[#F5C542]">{program.funding_type || "Total"}</p>
                    </div>
                  </div>

                  {program.dates_info && (
                    <div className="p-4 rounded-2xl bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#F5C542] shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5C542]">Plazo / Convocatoria</span>
                        <p className="text-xs font-semibold text-white/90">{program.dates_info}</p>
                      </div>
                    </div>
                  )}

                  {program.official_url && (
                    <a
                      href={program.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center gap-2 text-sm font-bold text-white transition-all"
                    >
                      <ExternalLink className="w-4 h-4 text-[#F5C542]" />
                      Verificar en sitio oficial ({new URL(program.official_url).hostname})
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <svg
          viewBox="0 0 1440 80"
          className="w-full block mt-8"
          preserveAspectRatio="none"
          style={{ height: 60 }}
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div className="space-y-8">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: "rgba(0,19,91,0.06)", color: "#00135B" }}
              >
                <Award className="w-4 h-4" />
                ¿Qué es esta beca?
              </div>
              <h2 className="text-4xl font-black text-[#00135B] leading-tight">
                Una oportunidad para líderes con{" "}
                <span style={{ color: "#5D8CE2" }}>visión global</span>
              </h2>
              <div className="text-slate-600 leading-relaxed text-base space-y-3">
                {program.description
                  .split("\n\n")
                  .slice(0, 2)
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Globe, title: "Programa global", sub: `${program.country} - ${program.level || "Posgrado"}` },
                  { icon: Trophy, title: "Reconocimiento", sub: "Prestigio internacional" },
                  { icon: Users, title: "Red alumni", sub: "Comunidad global de becarios" },
                  { icon: Lightbulb, title: "Impacto real", sub: "Desarrollo profesional y profesional" },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.title}
                      className="p-4 rounded-2xl border border-gray-100 card-hover"
                      style={{ background: "rgba(93,140,226,0.03)" }}
                    >
                      <Icon
                        className="w-5 h-5 mb-2"
                        style={{ color: "#5D8CE2" }}
                      />
                      <p className="font-bold text-sm text-[#00135B]">
                        {card.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{card.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right side of About Section */}
            <div className="flex flex-col items-center justify-center">
              {program.slug === "fulbright-beca" ? (
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-black border-[7px] border-slate-900"
                    style={{ width: 320, aspectRatio: "9/16" }}
                  >
                    <iframe
                      className="w-full h-full border-none"
                      src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F991543300065303&show_text=0"
                      title="Testimonio Ex-Becarios Fulbright"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-full pointer-events-none flex items-center justify-end px-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    </div>
                  </div>
                  <span className="text-[#00135B] text-xs uppercase font-extrabold tracking-wider bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100/80 shadow-sm flex items-center gap-2">
                    <span>🎬</span> Testimonio de Ex-Becarios Fulbright
                  </span>
                </div>
              ) : (
                <div className="w-full bg-gradient-to-br from-[#00135B] to-[#002d9c] p-8 rounded-3xl text-white shadow-xl space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#F5C542]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5C542]">Orientación EduLab</span>
                      <h4 className="font-extrabold text-lg text-white">Consejos para postular a {program.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed">
                    {program.eligibility || program.short_description}
                  </p>

                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">Requisitos clave de la convocatoria:</span>
                    <div className="space-y-2">
                      {program.requirements?.slice(0, 4).map((req, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-white/90">
                          <CheckCircle2 className="w-4 h-4 text-[#F5C542] shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {program.official_url && (
                    <a
                      href={program.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F5C542] hover:bg-[#f5b81a] text-[#00135B] font-extrabold text-xs transition-all shadow-md mt-2"
                    >
                      Ir al sitio oficial <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* ── GENERAL INFO ── */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
              style={{ background: "rgba(93,140,226,0.1)", color: "#5D8CE2" }}
            >
              <BookOpen className="w-4 h-4" />
              Información General
            </div>
            <h2 className="text-3xl font-black text-[#00135B]">
              Todo lo que necesitas saber
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: "Programa", val: program.institution || program.organization || "—" },
              { icon: MapPin, label: "País", val: program.country ? `🌎 ${program.country}` : "—" },
              { icon: Building2, label: "Institución", val: program.institution || program.organization_name || "—" },
              { icon: GraduationCap, label: "Nivel académico", val: program.level || "—" },
              { icon: DollarSign, label: "Financiamiento", val: program.funding_type || "—" },
              { icon: Languages, label: "Idioma requerido", val: program.language || "—" },
              { icon: Clock, label: "Duración", val: program.duration || "—" },
              {
                icon: Calendar,
                label: "Fecha límite",
                val: program.deadline
                  ? new Date(program.deadline).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })
                  : program.dates_info?.substring(0, 30) || "Variable",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border card-hover"
                  style={{ borderColor: "rgba(93,140,226,0.12)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: "rgba(93,140,226,0.1)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#5D8CE2" }} />
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="font-bold text-[#00135B] text-sm leading-snug">
                    {item.val}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA Banner */}
          <div
            className="mt-8 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{
              background: "linear-gradient(135deg, #00135B, #0d2a8a)",
            }}
          >
            <p className="text-white font-bold text-base">
              ¿Quieres saber si calificas para esta beca?
            </p>
            <button
              onClick={handleApply}
              className="px-6 py-3 rounded-xl font-bold text-[#00135B] text-sm transition-all hover:scale-105 shrink-0"
              style={{ background: "#F5C542" }}
            >
              Evaluar mi perfil con IA
            </button>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      {benefits.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
                style={{ background: "rgba(245,197,66,0.15)", color: "#b8860b" }}
              >
                ✨ Beneficios
              </div>
              <h2 className="text-3xl font-black text-[#00135B]">
                ¿Qué incluye la beca?
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left sidebar: Benefit triggers */}
              <div className="lg:col-span-5 space-y-3">
                {benefits.map((b, i) => {
                  const emojis = ["💵", "✈️", "💰", "❤️", "📦", "🌐"];
                  const text = b.replace(/[^\w\saféíóúÁÉÍÓÚñÑ]/gu, "").trim();
                  const emoji = emojis[i] || "🎁";
                  const isActive = activeBenefitIdx === i;
                  const details = getBenefitDetails(b, i);
                  
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveBenefitIdx(i)}
                      className={`w-full flex items-center gap-4 p-4.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "shadow-lg scale-[1.03]"
                          : "opacity-75 scale-[0.97] hover:opacity-100 hover:scale-[1.00] bg-slate-50 border-gray-200 text-slate-500 hover:bg-slate-100"
                      }`}
                      style={{
                        borderColor: isActive ? details.color : "rgba(229,231,235,1)",
                        background: isActive ? details.bg : "#ffffff",
                        boxShadow: isActive ? `0 10px 25px -5px ${details.color}18` : "none",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300"
                        style={{
                          background: isActive ? `${details.color}20` : "rgba(241,245,249,1)",
                          transform: isActive ? "rotate(8deg) scale(1.1)" : "none",
                        }}
                      >
                        {emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-bold text-sm truncate"
                          style={{ color: isActive ? "#00135B" : "#475569" }}
                        >
                          {text || b}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                          {isActive ? "Mostrando detalles" : "Ver cobertura e información"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right content display: Active Benefit Details */}
              <div className="lg:col-span-7 flex">
                <AnimatePresence mode="wait">
                  {(() => {
                    const b = benefits[activeBenefitIdx];
                    if (!b) return null;
                    const emojis = ["💵", "✈️", "💰", "❤️", "📦", "🌐"];
                    const text = b.replace(/[^\w\saféíóúÁÉÍÓÚñÑ]/gu, "").trim();
                    const emoji = emojis[activeBenefitIdx] || "🎁";
                    const details = getBenefitDetails(b, activeBenefitIdx);

                    return (
                      <motion.div
                        key={activeBenefitIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex flex-col rounded-3xl border overflow-hidden shadow-xl bg-white"
                        style={{ borderColor: "rgba(93,140,226,0.12)" }}
                      >
                        {/* Benefit Image */}
                        <div className="h-60 relative overflow-hidden group">
                          <img
                            src={details.image}
                            alt={text || b}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          />
                          {/* Absolute floating badge */}
                          <div
                            className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                            style={{ background: details.color }}
                          >
                            <span>{emoji}</span>
                            <span>{text || b}</span>
                          </div>
                        </div>

                        {/* Benefit Description */}
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                          <div className="space-y-2">
                            <h3 className="text-xl font-extrabold text-[#00135B]">
                              {text || b}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              {details.longDesc}
                            </p>
                          </div>

                          {/* Qué incluye */}
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qué incluye</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                              {details.checklist.map((item: string, ci: number) => (
                                <div key={ci} className="flex items-center gap-2 text-xs font-semibold text-slate-700 py-1 px-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: `${details.color}18` }}>
                                    <svg className="w-2.5 h-2.5" fill="none" stroke={details.color} strokeWidth={3} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                                  </div>
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Ventajas clave */}
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ventajas clave</p>
                            <div className="flex flex-wrap gap-2">
                              {details.advantages.map((adv: string, ai: number) => (
                                <span key={ai} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-800">
                                  <svg className="w-3 h-3 fill-[#d97706] text-[#d97706]" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                  {adv}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* EduLab Tip */}
                          <div
                            className="p-4 rounded-2xl flex items-start gap-3 border text-left"
                            style={{ background: details.bg, borderColor: `${details.color}25` }}
                          >
                            <Sparkles className="w-5 h-5 shrink-0 mt-0.5" style={{ color: details.color }} />
                            <div className="space-y-0.5">
                              <p className="text-[9px] font-bold text-[#00135B] uppercase tracking-wider">Consejo EduLab</p>
                              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                {details.tip}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* ── IDEAL PROFILE ── */}
      {idealProfile.length > 0 && (
        <section className="py-20" style={{ background: "#f0f4ff" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
                style={{ background: "rgba(93,140,226,0.1)", color: "#5D8CE2" }}
              >
                🎯 Perfil Ideal
              </div>
              <h2 className="text-3xl font-black text-[#00135B]">
                ¿Esta beca es para ti?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {idealProfile.map((p, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border card-hover text-center space-y-4"
                  style={{ borderColor: "rgba(93,140,226,0.12)" }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-3xl"
                    style={{ background: "rgba(93,140,226,0.08)" }}
                  >
                    {p.emoji}
                  </div>
                  <h3 className="font-bold text-[#00135B] text-sm">
                    {p.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: "rgba(93,140,226,0.1)",
                          color: "#5D8CE2",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button
                onClick={handleApply}
                className="text-[#5D8CE2] font-semibold text-sm hover:underline flex items-center gap-1 mx-auto"
              >
                ¿No sabes si calificas? Evalúa tu perfil con IA en 2 minutos
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── REQUIREMENTS ── */}
      {requirements.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
                style={{ background: "rgba(0,19,91,0.06)", color: "#00135B" }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Requisitos
              </div>
              <h2 className="text-3xl font-black text-[#00135B]">
                ¿Qué necesitas para postular?
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checklist */}
              <div className="lg:col-span-2 space-y-3">
                {requirements.map((req, i) => {
                  const prio = requirementPriority(i);
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-2xl border transition-all hover:border-[#5D8CE2]/30"
                      style={{
                        background: "rgba(248,250,255,0.8)",
                        borderColor: "rgba(93,140,226,0.12)",
                      }}
                    >
                      <CheckCircle2
                        className="w-5 h-5 shrink-0 mt-0.5"
                        style={{ color: "#22c55e" }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#00135B]">
                            {req}
                          </span>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: `${prio.color}15`,
                              color: prio.color,
                            }}
                          >
                            {prio.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Difficulty sidebar */}
              <div>
                <div
                  className="sticky top-24 rounded-2xl p-6 space-y-5"
                  style={{
                    background: "linear-gradient(135deg, #00135B, #0d2a8a)",
                    boxShadow: "0 8px 32px rgba(0,19,91,0.2)",
                  }}
                >
                  <h3 className="font-bold text-white text-base">
                    Nivel de Exigencia
                  </h3>
                  {[
                    { label: "Académico", pct: 85 },
                    { label: "Idioma (inglés)", pct: 80 },
                    { label: "Liderazgo", pct: 90 },
                    { label: "Ensayos", pct: 75 },
                    { label: "Experiencia", pct: 70 },
                  ].map((bar) => (
                    <ProgressBar key={bar.label} label={bar.label} pct={bar.pct} />
                  ))}
                  <div
                    className="flex items-start gap-2 p-3 rounded-xl mt-2"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <AlertCircle
                      className="w-4 h-4 text-[#F5C542] shrink-0 mt-0.5"
                    />
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      Esta beca es altamente competitiva. EDULAB te ayuda a
                      maximizar tu perfil con IA.
                    </p>
                  </div>
                  <button
                    onClick={handleApply}
                    className="w-full py-3 rounded-xl font-bold text-[#00135B] text-sm transition-all hover:scale-[1.02]"
                    style={{ background: "#F5C542" }}
                  >
                    Preparar mi postulación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── AI TOOLS ── */}
      {aiTools.length > 0 && (
        <section
          className="py-20 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #00135B 0%, #001f8a 60%, #0a2490 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-4"
                style={{
                  background: "rgba(245,197,66,0.12)",
                  borderColor: "rgba(245,197,66,0.3)",
                  color: "#F5C542",
                }}
              >
                <Zap className="w-4 h-4" />
                Powered by EDULAB AI
              </div>
              <h2 className="text-4xl font-black text-white mb-3">
                Prepara tu postulación con{" "}
                <span style={{ color: "#F5C542" }}>Inteligencia Artificial</span>
              </h2>
              <p className="text-white/65 max-w-xl mx-auto">
                Nuestras herramientas de IA están diseñadas para optimizar cada
                parte de tu postulación.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {aiTools.map((tool, i) => {
                const meta = aiToolIcons[i] || { color: "#5D8CE2", tag: "", emoji: "🔧" };
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 group"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(12px)",
                    }}
                    onClick={handleApply}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ background: `${meta.color}20` }}
                      >
                        {meta.emoji}
                      </div>
                      {meta.tag && (
                        <span
                          className="text-[10px] font-bold px-2 py-1 rounded-full"
                          style={{ background: `${meta.color}20`, color: meta.color }}
                        >
                          {meta.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white mb-1 text-sm">{tool}</h3>
                    <span className="text-[#F5C542] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Usar herramienta <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                );
              })}

              {/* CTA Card */}
              <div
                className="p-6 rounded-2xl flex flex-col justify-between"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(245,197,66,0.12), rgba(93,140,226,0.12))",
                  border: "1px solid rgba(245,197,66,0.25)",
                }}
              >
                <div>
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="font-bold text-white mb-1">Suite completa</h3>
                  <p className="text-white/60 text-sm">
                    Accede a todas las herramientas de IA para maximizar tus
                    posibilidades.
                  </p>
                </div>
                <button
                  onClick={handleApply}
                  className="mt-4 w-full py-3 rounded-xl font-bold text-[#00135B] text-sm transition-all hover:scale-105"
                  style={{ background: "#F5C542" }}
                >
                  Empezar gratis
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="py-20" style={{ background: "#f8faff" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
                style={{ background: "rgba(93,140,226,0.1)", color: "#5D8CE2" }}
              >
                💬 Testimonios
              </div>
              <h2 className="text-3xl font-black text-[#00135B]">
                Historias de becarios reales
              </h2>
            </div>

            {/* Testimonial images/video row */}
            {program.slug !== "fulbright-beca" && (
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80",
                  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=500&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <img
                      src={src}
                      alt={`Becario ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border card-hover space-y-4"
                  style={{ borderColor: "rgba(93,140,226,0.12)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #00135B, #5D8CE2)",
                        border: "2px solid rgba(93,140,226,0.2)",
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-[#00135B] text-sm">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-500">{t.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{
                        background: "rgba(93,140,226,0.1)",
                        color: "#5D8CE2",
                      }}
                    >
                      {t.university}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{
                        background: "rgba(34,197,94,0.1)",
                        color: "#16a34a",
                      }}
                    >
                      Becario {t.year}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className="w-4 h-4 fill-[#F5C542] text-[#F5C542]"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {faqs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
                style={{ background: "rgba(0,19,91,0.06)", color: "#00135B" }}
              >
                <HelpCircle className="w-4 h-4" />
                Preguntas Frecuentes
              </div>
              <h2 className="text-3xl font-black text-[#00135B]">
                ¿Tienes dudas sobre {program.organization_name || "esta beca"}?
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FaqAccordionItem key={i} q={faq.question} a={faq.answer} />
              ))}
            </div>
            <div
              className="mt-8 p-5 rounded-2xl text-center"
              style={{
                background: "rgba(93,140,226,0.06)",
                border: "2px dashed rgba(93,140,226,0.2)",
              }}
            >
              <p className="text-[#00135B] font-semibold text-sm mb-2">
                ¿Tienes más preguntas?
              </p>
              <button
                onClick={handleApply}
                className="text-[#5D8CE2] font-bold text-sm hover:underline flex items-center gap-1 mx-auto"
              >
                Chatea con nuestro asistente de IA
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER CTA ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #00135B 0%, #0d2a8a 50%, #001a7a 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative space-y-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold"
            style={{
              background: "rgba(245,197,66,0.12)",
              borderColor: "rgba(245,197,66,0.3)",
              color: "#F5C542",
            }}
          >
            ⚡ EDULAB — Tu puerta al mundo
          </div>

          <h2
            className="font-black text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
          >
            Tu próxima gran oportunidad{" "}
            <span style={{ color: "#F5C542" }}>comienza hoy</span>
          </h2>

          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            No dejes que la complejidad del proceso te detenga. Con EDULAB e IA,
            preparas la mejor postulación posible para{" "}
            {program.title}.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleApply}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[#00135B] transition-all hover:scale-105"
              style={{
                background: "#F5C542",
                boxShadow: "0 4px 20px rgba(245,197,66,0.4)",
              }}
            >
              Iniciar postulación <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <Sparkles className="w-4 h-4 text-[#F5C542]" />
              Aplicar con IA
            </button>
            {program.official_url && (
              <a
                href={program.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <ExternalLink className="w-4 h-4" />
                Ir al sitio oficial
              </a>
            )}
          </div>

          <div
            className="flex flex-wrap justify-center gap-8 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            {[
              { val: "500+", label: "Becas gestionadas" },
              { val: "92%", label: "Satisfacción" },
              { val: "40+", label: "Países" },
              { val: "IA", label: "Tecnología" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-2xl font-black"
                  style={{ color: "#F5C542" }}
                >
                  {s.val}
                </div>
                <div className="text-white/55 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURSOS EDULAB ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
              style={{ background: "rgba(245,197,66,0.15)", color: "#b8860b" }}
            >
              <Sparkles className="w-4 h-4" />
              Cursos de Preparación EduLab
            </div>
            <h2 className="text-3xl font-black text-[#00135B]">
              Prepárate con nuestros expertos para {program.title}
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-xl mx-auto">
              Cursos diseñados por ex-becarios y asesores internacionales para maximizar tus posibilidades de ser seleccionado.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              {
                title: `Redacción de Ensayos & Postulación`,
                instructor: "Dr. Marcos Villanueva",
                tag: "Más vendido",
                tagColor: "#22c55e",
                rating: "4.9",
                students: "1,240",
                price: "Gratuito",
                image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
                badge: "🏆"
              },
              {
                title: "Inglés para Entrevistas Académicas",
                instructor: "Prof. Sarah Kimura",
                tag: "Nuevo",
                tagColor: "#3b82f6",
                rating: "4.8",
                students: "890",
                price: "Gratuito",
                image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80",
                badge: "🎤"
              },
              {
                title: "Simulacro de Entrevista de Selección",
                instructor: "Lic. Andrea Quispe",
                tag: "Popular",
                tagColor: "#f59e0b",
                rating: "4.9",
                students: "2,100",
                price: "Gratuito",
                image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80",
                badge: "🎯"
              },
              {
                title: "Construye tu Perfil con IA de EduLab",
                instructor: "EduLab AI Team",
                tag: "IA",
                tagColor: "#8b5cf6",
                rating: "5.0",
                students: "3,400",
                price: "Gratuito",
                image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80",
                badge: "🤖"
              }
            ].map((course, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,19,91,0.12)" }}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col cursor-pointer group"
                  style={{ transition: "all 0.3s ease" }}
                >
                  {/* Vertical image (3:4 ratio) */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {/* Tag */}
                    <div
                      className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold text-white"
                      style={{ background: course.tagColor }}
                    >
                      {course.tag}
                    </div>
                    {/* Badge emoji */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-base shadow">
                      {course.badge}
                    </div>
                    {/* Price on image bottom */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#F5C542] text-[#00135B]">
                        {course.price}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-bold text-[#00135B] text-sm leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">{course.instructor}</p>
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <span className="text-[#f59e0b] text-xs font-bold">★ {course.rating}</span>
                      <span className="text-[10px] text-slate-400">({course.students} alumnos)</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => navigate("/courses")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-[#00135B] border border-[#00135B]/20 hover:bg-[#00135B]/5 transition-all"
              >
                Ver todos los cursos
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

      {/* Footer dark */}
      <footer
        className="py-6"
        style={{ background: "#000d3d" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-xl font-black"
          >
            <span style={{ color: "#F5C542" }}>EDU</span>
            <span className="text-white">LAB</span>
          </button>
          <p className="text-white/40 text-xs">
            © 2026 EDULAB. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            {["Términos", "Privacidad", "Contacto"].map((link) => (
              <button
                key={link}
                className="text-white/40 hover:text-white/70 text-xs transition-colors bg-transparent border-none cursor-pointer"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* ── AUTH MODAL ── */}
      {showAuthModal && (
        <AuthRequiredModal
          onClose={() => setShowAuthModal(false)}
          onLogin={() => {
            setShowAuthModal(false);
            navigate("/login");
          }}
          onRegister={() => {
            setShowAuthModal(false);
            navigate("/register");
          }}
        />
      )}

      {/* ── SUCCESS TOAST ── */}
      {applySuccess && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white font-bold text-sm"
          style={{
            background: "linear-gradient(135deg, #00135B, #5D8CE2)",
          }}
        >
          <CheckCircle2 className="w-5 h-5 text-[#F5C542]" />
          ¡Postulación iniciada! Ve a tu dashboard.
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[#F5C542] underline text-xs font-bold ml-1 bg-transparent border-none cursor-pointer"
          >
            Ver
          </button>
        </div>
      )}
    </div>
  );
}
