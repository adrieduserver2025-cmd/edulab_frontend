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
    
    const mapper: Record<string, { desc: string; image: string; color: string; bg: string }> = {
      "matricula completa": {
        desc: "Financiamiento integral del 100% de la matrícula académica y tasas obligatorias de la universidad seleccionada para todo tu periodo de estudios.",
        image: fulbrightAboutImg,
        color: "#3b82f6",
        bg: "rgba(59,130,246,0.05)"
      },
      "pasajes internacionales": {
        desc: "Vuelos de ida hacia la universidad de destino y de retorno al país de origen al finalizar de forma exitosa el programa académico.",
        image: fulbrightPhoto,
        color: "#10b981",
        bg: "rgba(16,185,129,0.05)"
      },
      "estipendio mensual": {
        desc: "Subsidio mensual para cubrir alojamiento, alimentación, transporte local y libros, ajustado al costo de vida de la ciudad de destino.",
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.05)"
      },
      "seguro medico": {
        desc: "Seguro de salud y accidentes con cobertura médica internacional integral durante la validez de tu estancia y programa de becas.",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        color: "#ec4899",
        bg: "rgba(236,72,153,0.05)"
      },
      "apoyo inicial de instalacion": {
        desc: "Asignación única al llegar al país de destino para ayudarte con los gastos de establecimiento, depósitos de alquiler y compra de materiales básicos.",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
        color: "#8b5cf6",
        bg: "rgba(139,92,246,0.05)"
      },
      "acceso a red internacional fulbright": {
        desc: "Conexión directa con una de las redes de exbecarios más influyentes del mundo, facilitando mentoría, oportunidades de carrera y proyectos globales.",
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
        color: "#06b6d4",
        bg: "rgba(6,182,212,0.05)"
      }
    };

    for (const key of Object.keys(mapper)) {
      if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
        return mapper[key];
      }
    }

    const fallbacks = [
      { desc: "Apoyo financiero completo para cubrir los costos esenciales del programa académico y matrícula.", image: fulbrightAboutImg, color: "#3b82f6", bg: "rgba(59,130,246,0.05)" },
      { desc: "Transporte y traslados cubiertos para facilitar tu llegada e integración al programa.", image: fulbrightPhoto, color: "#10b981", bg: "rgba(16,185,129,0.05)" },
      { desc: "Estipendio periódico para garantizar tu bienestar y sustento diario durante el programa.", image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80", color: "#f59e0b", bg: "rgba(245,158,11,0.05)" },
      { desc: "Seguro de salud para brindarte asistencia y protección médica en todo momento.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80", color: "#ec4899", bg: "rgba(236,72,153,0.05)" },
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
      })
      .catch(() => {
        setError("No se encontró la beca. Verifica la URL o intenta más tarde.");
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
                    {applying ? "Procesando..." : "Iniciar postulación"}
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

{/* Right - Image/Video card with floating attributes */}
            <div className="relative pl-0 lg:pl-6">
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl group border border-white/10"
                style={{ aspectRatio: "4/3" }}
              >
                {playHeroVideo ? (
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-3xl border-none"
                    src={
                      program.slug === "fulbright-beca"
                        ? "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1006564038828442&show_text=0&autoplay=1"
                        : "https://www.youtube.com/embed/iS3qREybbeI?autoplay=1"
                    }
                    title={program.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={
                        program.slug === "fulbright-beca"
                          ? fulbrightBg
                          : program.image_url || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700&q=80"
                      }
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                      }}
                    />
                    
                    {/* Fulbright circular logo */}
                    {program.slug === "fulbright-beca" && (
                      <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border border-amber-400/40">
                        <img src={fulbrightLogo} alt="Fulbright" className="w-8 h-8 object-contain" />
                      </div>
                    )}

                    {/* Convocatoria abierta badge */}
                    <div
                      className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold text-white"
                      style={{ background: "#22c55e" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Convocatoria Abierta
                    </div>

                    {/* Play button */}
                    <button
                      onClick={() => setPlayHeroVideo(true)}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border-4 border-white/20 bg-[#F5C542]"
                      style={{ width: 64, height: 64, top: "50%", left: "50%", transform: "translate(-50%, -50%)", position: "absolute" }}
                      aria-label="Ver video"
                    >
                      <svg viewBox="0 0 24 24" fill="#000" width="24" height="24">
                        <polygon points="6,4 20,12 6,20" />
                      </svg>
                    </button>

                    {/* Info text */}
                    <div className="absolute bottom-6 left-6 right-6 z-10 space-y-1 text-left">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider"
                        style={{
                          background: "rgba(245,197,66,0.2)",
                          border: "1px solid rgba(245,197,66,0.4)",
                          color: "#F5C542",
                        }}
                      >
                        {program.slug === "fulbright-beca" ? "🎓 Video Oficial Fulbright" : "🎬 Video Oficial"}
                      </span>
                      <p className="text-white font-extrabold text-sm leading-tight">
                        {program.slug === "fulbright-beca" ? "Becas Fulbright: La oportunidad de tu vida" : `${program.title}: Conoce más`}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Floating glassmorphism card */}
              <div
                className="absolute -bottom-6 left-6 right-6 p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-left shadow-lg border border-white/10"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {[
                  { icon: "💲", label: "Financiamiento", val: program.funding_type || "Completo" },
                  { icon: "⏱", label: "Duración", val: program.duration || "Variable" },
                  {
                    icon: "📅",
                    label: "Fecha límite",
                    val: program.deadline
                      ? new Date(program.deadline).toLocaleDateString("es", { month: "short", year: "numeric" })
                      : program.dates_info?.substring(0, 20) || "Variable",
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
                  { icon: Globe, title: "Programa global", sub: "160+ países participantes" },
                  { icon: Trophy, title: "Reconocimiento", sub: "Prestigio mundial" },
                  { icon: Users, title: "Red alumni", sub: "+400,000 exbecarios" },
                  { icon: Lightbulb, title: "Impacto real", sub: "Liderazgo y cambio" },
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
            {program.slug === "fulbright-beca" ? (
              <div className="relative flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100/80 w-full">
                <div
                  className="w-full max-w-[280px] rounded-3xl overflow-hidden shadow-2xl bg-black relative border border-white/10"
                  style={{ aspectRatio: "9/16" }}
                >
                  <iframe
                    key={currentVideoIdx}
                    className="w-full h-full border-none"
                    src={heroVideos[currentVideoIdx].url}
                    title={heroVideos[currentVideoIdx].title}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                {/* Carousel controls */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentVideoIdx((prev) => (prev === 0 ? heroVideos.length - 1 : prev - 1))}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all cursor-pointer active:scale-95 shadow-sm"
                    aria-label="Video anterior"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1.5">
                    {heroVideos.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentVideoIdx(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          currentVideoIdx === idx ? "bg-[#5D8CE2] w-4" : "bg-slate-300"
                        }`}
                        aria-label={`Ir al video ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentVideoIdx((prev) => (prev === heroVideos.length - 1 ? 0 : prev + 1))}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all cursor-pointer active:scale-95 shadow-sm"
                    aria-label="Siguiente video"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Title indicator */}
                <p className="text-slate-600 text-[10px] uppercase font-bold tracking-wider mt-2.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
                  🎬 {heroVideos[currentVideoIdx].title}
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=700&q=80"
                  alt="Graduación universitaria"
                  className="w-full rounded-3xl object-cover shadow-2xl"
                  style={{ aspectRatio: "4/3" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = SCHOLARSHIP_IMAGES[1];
                  }}
                />
                {/* Floating stat */}
                <div
                  className="absolute -bottom-6 -left-6 p-5 rounded-2xl shadow-xl"
                  style={{ background: "white", border: "1px solid rgba(93,140,226,0.15)" }}
                >
                  <p
                    className="text-3xl font-black"
                    style={{ color: "#F5C542" }}
                  >
                    400k+
                  </p>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Alumni en el mundo
                  </p>
                </div>
              </div>
            )}
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
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                          <div className="space-y-3">
                            <h3 className="text-xl font-extrabold text-[#00135B]">
                              Detalle de Cobertura
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              {details.desc}
                            </p>
                          </div>

                          <div
                            className="p-4.5 rounded-2xl flex items-start gap-3.5 border text-left"
                            style={{
                              background: details.bg,
                              borderColor: `${details.color}25`
                            }}
                          >
                            <Sparkles className="w-5 h-5 shrink-0 mt-0.5" style={{ color: details.color }} />
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-[#00135B]">
                                Ventaja de Postulación con EduLab
                              </p>
                              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                Optimizamos tus cartas de motivación para justificar tu necesidad y mérito para la obtención de este beneficio al 100%.
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
