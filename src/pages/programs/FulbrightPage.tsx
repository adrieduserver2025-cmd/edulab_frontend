import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award, CheckCircle2, ChevronDown, Globe, BookOpen,
  AlertCircle, Star, ArrowRight, ArrowLeft, Sparkles, ExternalLink,
  HelpCircle, Users, Trophy, Lightbulb,
  GraduationCap, DollarSign, Clock, Calendar, Languages,
  MapPin, Building2, Zap, Heart
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import axiosClient from "../../services/api/axiosClient";

// ==========================
// AUTH MODAL (simplified)
// ==========================
function AuthRequiredModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-5 border border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-[#00135B]/10 flex items-center justify-center mx-auto">
          <GraduationCap className="w-8 h-8 text-[#00135B]" />
        </div>
        <h3 className="font-extrabold text-xl text-[#00135B]">Inicia sesión para postular</h3>
        <p className="text-sm text-slate-500">Crea tu cuenta gratis o inicia sesión para postularte a la Beca Fulbright con el apoyo de IA.</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => { onClose(); navigate("/login"); }}
            className="w-full py-3 rounded-xl bg-[#00135B] text-white font-bold text-sm hover:bg-[#0d288c] transition-all">
            Iniciar sesión
          </button>
          <button onClick={() => { onClose(); navigate("/register"); }}
            className="w-full py-3 rounded-xl border border-[#00135B] text-[#00135B] font-bold text-sm hover:bg-[#00135B]/5 transition-all">
            Crear cuenta gratis
          </button>
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600 transition-all">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================
// NAVBAR
// ==========================
function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
      style={{ background: "#00135B" }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="text-2xl font-black tracking-tight">
          <span style={{ color: "#F5C542" }}>EDU</span><span className="text-white">LAB</span>
        </button>
        <div className="hidden md:flex items-center gap-8">
          {["Oportunidades", "Voluntariados", "IA", "Cómo Funcionamos", "Testimonios"].map(link => (
            <button key={link} className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              {link}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="text-white/60 hover:text-white transition-colors p-2">
            <span className="text-lg">🔔</span>
          </button>
          <button
            onClick={() => navigate(user ? "/dashboard" : "/login")}
            className="px-4 py-2 rounded-full font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
            style={{ background: "#F5C542", color: "#00135B" }}>
            {user ? "Mi Dashboard" : "Tu Perfil"}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ==========================
// FAQ ITEM
// ==========================
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        borderColor: open ? "#5D8CE2" : "rgba(93,140,226,0.15)",
        background: open ? "rgba(93,140,226,0.04)" : "white",
        boxShadow: open ? "0 4px 20px rgba(93,140,226,0.1)" : "none"
      }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer">
        <span className="font-semibold text-[#00135B] text-sm pr-4">{q}</span>
        <ChevronDown
          className="w-5 h-5 text-[#5D8CE2] shrink-0 transition-transform duration-300"
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

// ==========================
// MAIN PAGE COMPONENT
// ==========================
export default function FulbrightPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const token = useAuthStore(s => s.token);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [programId, setProgramId] = useState<number | null>(null);
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

  const benefitsList = [
    {
      emoji: "💸",
      title: "Matrícula completa",
      desc: "Cubierta al 100% en cualquier universidad participante.",
      longDesc: "Financiamiento integral del 100% de la matrícula académica y tasas obligatorias de la universidad estadounidense seleccionada, para que estudies con total tranquilidad.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"
    },
    {
      emoji: "✈️",
      title: "Pasajes internacionales",
      desc: "Vuelos de ida y vuelta de clase económica cubiertos.",
      longDesc: "Pasajes aéreos internacionales de ida y vuelta para el becario entre su país de origen y los Estados Unidos, al inicio y finalización oficial del programa académico.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
    },
    {
      emoji: "💵",
      title: "Estipendio mensual",
      desc: "Apoyo mensual para vivienda, libros y manutención.",
      longDesc: "Asignación mensual de manutención adaptada al costo de vida de la ciudad de destino para cubrir alojamiento, alimentación, transporte y material académico obligatorio.",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80"
    },
    {
      emoji: "❤️",
      title: "Seguro médico",
      desc: "Cobertura médica integral provista por EE.UU.",
      longDesc: "Plan de cobertura médica complementaria contra accidentes y enfermedades provisto directamente por el Departamento de Estado (cobertura ASPE) durante todo tu programa.",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80"
    },
    {
      emoji: "🏢",
      title: "Apoyo inicial de instalación",
      desc: "Subvención única al llegar a los EE.UU.",
      longDesc: "Un desembolso económico inicial y único al llegar a territorio norteamericano para ayudarte a solventar depósitos de alquiler, ropa de invierno u otros gastos de mudanza.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"
    },
    {
      emoji: "🌍",
      title: "Acceso a red internacional",
      desc: "+400,000 exbecarios influyentes a nivel mundial.",
      longDesc: "Forma parte de una comunidad de prestigio mundial con más de 400,000 exbecarios. Conéctate con líderes de diversos sectores, incluyendo premios Nobel y jefes de Estado.",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80"
    }
  ];

  // Load the Fulbright program from backend to get the real ID
  useEffect(() => {
    async function loadProgram() {
      try {
        const res = await axiosClient.get("/opportunities/fulbright-beca");
        setProgramId(res.data.id);
      } catch {
        // fallback silently
      }
    }
    loadProgram();
  }, []);

  const handleApply = async () => {
    if (!isAuthenticated || !token) {
      setShowAuthModal(true);
      return;
    }
    if (!programId) {
      setApplyError("No se pudo cargar el programa. Intenta de nuevo.");
      return;
    }
    setApplying(true);
    setApplyError(null);
    try {
      await axiosClient.post("/applications/", { program_id: programId });
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

  const requirements = [
    { name: "Título universitario", priority: "Obligatorio", color: "#ef4444", desc: "Licenciatura o equivalente completada" },
    { name: "TOEFL iBT 79+ o IELTS 6.5+", priority: "Obligatorio", color: "#ef4444", desc: "Certificado oficial vigente requerido" },
    { name: "Ensayos de motivación", priority: "Obligatorio", color: "#ef4444", desc: "Historia personal y plan de estudios" },
    { name: "Cartas de recomendación (mín. 3)", priority: "Importante", color: "#f59e0b", desc: "De profesores o empleadores relevantes" },
    { name: "Experiencia profesional relevante (2+ años)", priority: "Importante", color: "#f59e0b", desc: "En el área de estudio propuesto" },
    { name: "Historial académico sólido", priority: "Importante", color: "#f59e0b", desc: "Promedio destacado en estudios previos" },
    { name: "Ciudadanía del país postulante", priority: "Obligatorio", color: "#ef4444", desc: "Según programa de cada país" },
    { name: "No haber sido becario Fulbright antes", priority: "Recomendado", color: "#22c55e", desc: "Aplica para la mayoría de categorías" },
  ];

  const aiTools = [
    { emoji: "✍️", title: "Generar ensayo", tag: "Más popular", color: "#5D8CE2", desc: "Redacta tu historia personal y plan de estudios con IA" },
    { emoji: "📄", title: "Mejorar perfil", tag: "Recomendado", color: "#F5C542", desc: "Optimiza tu perfil para maximizar compatibilidad" },
    { emoji: "🎤", title: "Simular entrevista", tag: "Nuevo", color: "#22c55e", desc: "Practica con preguntas reales de Fulbright" },
    { emoji: "📑", title: "Revisar requisitos", tag: "Esencial", color: "#a855f7", desc: "Verifica si cumples todos los requisitos antes de postular" },
    { emoji: "📬", title: "Optimizar cartas", tag: "Clave", color: "#ef4444", desc: "Genera y mejora tus cartas de recomendación con IA" },
  ];

  const timeline = [
    { num: "1946", label: "Fundación", title: "Nace Fulbright", desc: "El senador Fulbright propone el programa de intercambio educativo entre naciones." },
    { num: "2", label: "Postula", title: "Selección rigurosa", desc: "El proceso evalúa académico, liderazgo, ensayos y entrevistas personalizadas." },
    { num: "3", label: "Ganas", title: "Financiamiento total", desc: "Recibes matrícula, pasajes, estipendio y seguro médico cubiertos al 100%." },
    { num: "4", label: "Retorna", title: "Impacto en tu país", desc: "Aplicas tus conocimientos y te unes a la red global de 400,000+ alumni." },
  ];

  const testimonials = [
    { name: "Valeria Montoya", country: "🇧🇴 Bolivia", year: "2023", university: "Columbia University", program: "Políticas Públicas", quote: "Fulbright cambió mi vida. No solo aprendí en las mejores aulas del mundo, sino que construí una red de contactos que me permite generar impacto real en Bolivia.", avatar: "VM" },
    { name: "Carlos Quispe", country: "🇧🇴 Bolivia", year: "2022", university: "Johns Hopkins", program: "Salud Pública", quote: "El proceso de aplicación fue desafiante, pero EDULAB me ayudó a preparar mis ensayos y simular entrevistas. Hoy trabajo en políticas de salud pública.", avatar: "CQ" },
    { name: "Sofía Gutiérrez", country: "🇵🇪 Perú", year: "2024", university: "Georgetown University", program: "Derecho Internacional", quote: "Lo que más valoro de Fulbright es la red alumni. Hay ex-becarios en cada ministerio, empresa global y organismo internacional.", avatar: "SG" },
  ];

  const faqs = [
    { q: "¿Necesito experiencia laboral para postular?", a: "Sí, se recomienda tener al menos 2 años de experiencia profesional relevante. Fulbright valora el impacto que has tenido en tu campo y tu potencial de liderazgo." },
    { q: "¿Qué nivel de inglés exigen?", a: "Se requiere TOEFL iBT 79+ o IELTS 6.5+ mínimo. Los puntajes exactos pueden variar según el programa y universidad destino." },
    { q: "¿Puedo aplicar desde Bolivia?", a: "Sí. La Comisión Fulbright Bolivia gestiona las aplicaciones locales. Debes contactarles directamente para conocer las fechas exactas de la convocatoria." },
    { q: "¿Cuándo abre la convocatoria?", a: "Generalmente la convocatoria abre entre junio y agosto, con cierre en octubre. Las fechas varían según el país. EDULAB te notifica cuando abre." },
    { q: "¿Puedo elegir en qué universidad estudiar?", a: "En parte. Fulbright trabaja con más de 1,500 universidades. Puedes proponer preferencias, aunque la asignación final depende de disponibilidad y tu perfil." },
    { q: "¿Tengo que regresar después de la beca?", a: "Sí, el programa requiere que los becarios regresen a su país de origen para aplicar sus conocimientos. Esto forma parte del compromiso J-1 visa." },
    { q: "¿Cómo me ayuda EDULAB en el proceso?", a: "EDULAB te ayuda a preparar tus ensayos con IA, simular entrevistas, optimizar tu CV, revisar requisitos y hacer seguimiento de tu aplicación en tiempo real." },
  ];

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Inter', sans-serif", scrollBehavior: "smooth" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        .hero-grid-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .progress-bar-fill {
          background: linear-gradient(90deg, #5D8CE2, #F5C542);
        }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,19,91,0.12);
        }
        .benefit-card:hover .benefit-accent {
          opacity: 1;
        }
        .benefit-accent {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
      `}</style>

      <Navbar />

      {/* ===================================== */}
      {/* HERO */}
      {/* ===================================== */}
      <section
        className="hero-grid-pattern pt-24 pb-0 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #00135B 0%, #001a7a 50%, #0a2490 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #5D8CE2, transparent)" }} />
        <div className="absolute bottom-20 left-0 w-72 h-72 rounded-full opacity-8 blur-3xl"
          style={{ background: "radial-gradient(circle, #F5C542, transparent)" }} />

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold"
                style={{ background: "rgba(245,197,66,0.15)", borderColor: "rgba(245,197,66,0.3)", color: "#F5C542" }}>
                <span className="w-2 h-2 rounded-full bg-[#F5C542] animate-pulse" />
                BECA INTERNACIONAL
              </div>

              {/* Title */}
              <h1 className="text-6xl font-black leading-none tracking-tight">
                <span className="text-white">Beca </span>
                <span style={{ color: "#F5C542" }}>Fulbright</span>
              </h1>

              <p className="text-white/75 text-lg leading-relaxed max-w-lg">
                Estudia una maestría o desarrolla investigación en universidades de Estados Unidos con financiamiento completo.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: "🇺🇸", text: "Estados Unidos" },
                  { icon: "🎓", text: "Maestría / Investigación" },
                  { icon: "💰", text: "100% Financiada" },
                  { icon: "🗣", text: "Inglés" },
                ].map(tag => (
                  <span key={tag.text} className="px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                    {tag.icon} {tag.text}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
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
                    className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[#00135B] text-sm transition-all hover:scale-105"
                    style={{ background: "#F5C542", boxShadow: "0 4px 20px rgba(245,197,66,0.4)" }}>
                    {applying ? "Iniciando..." : "Iniciar postulación"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white text-sm transition-all hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>
                  <Sparkles className="w-4 h-4 text-[#F5C542]" />
                  Aplicar con IA
                </button>
              </div>
              {applyError && <p className="text-red-300 text-sm">{applyError}</p>}

              {/* Glassmorphic program attributes banner */}
              <div className="p-4 rounded-3xl grid grid-cols-2 sm:grid-cols-4 gap-4 w-full"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {[
                  { icon: "💲", label: "Financiamiento", val: "Completo" },
                  { icon: "⏱", label: "Duración", val: "1 – 2 años" },
                  { icon: "📅", label: "Fecha límite", val: "Oct 2025" },
                  { icon: "🌐", label: "Modalidad", val: "Presencial" },
                ].map(item => (
                  <div key={item.label} className="space-y-0.5 text-left">
                    <div className="text-white/40 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span>{item.icon}</span> {item.label}
                    </div>
                    <div className="text-white font-extrabold text-xs">{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-4 w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {[
                  { val: "+3,000", label: "Becados / año" },
                  { val: "170+", label: "Países participantes" },
                  { val: "70+", label: "Años de historia" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-2xl font-black" style={{ color: "#F5C542" }}>{s.val}</div>
                    <div className="text-white/55 text-xs font-medium mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Video Experiences Carousel */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-full max-w-[280px] rounded-3xl overflow-hidden shadow-2xl bg-black relative border border-white/10" style={{ aspectRatio: "9/16" }}>
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
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer active:scale-95"
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
                        currentVideoIdx === idx ? "bg-[#F5C542] w-4" : "bg-white/30"
                      }`}
                      aria-label={`Ir al video ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentVideoIdx((prev) => (prev === heroVideos.length - 1 ? 0 : prev + 1))}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer active:scale-95"
                  aria-label="Siguiente video"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Title indicator */}
              <p className="text-white/65 text-[10px] uppercase font-bold tracking-wider mt-2.5 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5 shadow-sm">
                🎬 {heroVideos[currentVideoIdx].title}
              </p>
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <svg viewBox="0 0 1440 80" className="w-full block mt-8" preserveAspectRatio="none" style={{ height: 60 }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </section>

      {/* ===================================== */}
      {/* ¿QUÉ ES ESTA BECA? */}
      {/* ===================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: "rgba(0,19,91,0.06)", color: "#00135B" }}>
                <Award className="w-4 h-4" />
                ¿Qué es esta beca?
              </div>
              <h2 className="text-4xl font-black text-[#00135B] leading-tight">
                Una oportunidad para líderes con{" "}
                <span style={{ color: "#5D8CE2" }}>visión global</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                El programa Fulbright es la beca académica más prestigiosa del gobierno de Estados Unidos. Promueve el intercambio educativo y cultural, formando líderes que regresan a sus países a generar impacto real. No solo evalúa notas: valora liderazgo, experiencia y compromiso con la comunidad.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Globe, title: "Programa global", sub: "160+ países participantes" },
                  { icon: Trophy, title: "Reconocimiento", sub: "Prestigio mundial" },
                  { icon: Users, title: "Red alumni", sub: "+400,000 exbecarios" },
                  { icon: Lightbulb, title: "Impacto real", sub: "Liderazgo y cambio" },
                ].map(card => {
                  const Icon = card.icon;
                  return (
                    <div key={card.title} className="p-4 rounded-2xl border border-gray-100 hover:border-[#5D8CE2]/30 transition-all card-hover"
                      style={{ background: "rgba(93,140,226,0.03)" }}>
                      <Icon className="w-5 h-5 mb-2" style={{ color: "#5D8CE2" }} />
                      <p className="font-bold text-sm text-[#00135B]">{card.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{card.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right - Timeline */}
            <div className="relative pl-8">
              <div className="absolute left-3 top-4 bottom-4 w-0.5"
                style={{ background: "linear-gradient(to bottom, #5D8CE2, #F5C542)" }} />
              <div className="space-y-10">
                {timeline.map((item, i) => (
                  <div key={i} className="relative flex gap-6">
                    <div className="absolute -left-5 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white shadow-lg"
                      style={{ background: i === 0 || i === 3 ? "#F5C542" : "#5D8CE2", color: i === 0 || i === 3 ? "#00135B" : "white", boxShadow: `0 0 0 4px white, 0 0 0 6px ${i === 0 || i === 3 ? "rgba(245,197,66,0.3)" : "rgba(93,140,226,0.2)"}` }}>
                      {item.num.length > 2 ? <span className="text-[8px]">{item.num}</span> : item.num}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5D8CE2" }}>{item.label}</span>
                      <h4 className="font-bold text-[#00135B]">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* BENEFICIOS */}
      {/* ===================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
              style={{ background: "rgba(245,197,66,0.15)", color: "#b8860b" }}>
              ✨ Beneficios
            </div>
            <h2 className="text-3xl font-black text-[#00135B]">¿Qué incluye la beca?</h2>
            <p className="text-slate-400 text-xs mt-2 font-medium">Haz clic en cualquier beneficio para explorar los detalles e imágenes de la cobertura.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {benefitsList.map((b, i) => {
              const isActive = activeBenefitIdx === i;
              return (
                <div
                  key={i}
                  onClick={() => setActiveBenefitIdx(i)}
                  className={`relative p-6 rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between select-none ${
                    isActive
                      ? "col-span-1 md:col-span-2 bg-[#00135B] text-white border-[#5D8CE2] shadow-2xl scale-[1.01] ring-1 ring-[#5D8CE2]/20"
                      : "col-span-1 bg-slate-50/50 border-gray-150 text-slate-700 opacity-65 scale-[0.97] hover:opacity-90 hover:scale-[0.99] hover:bg-slate-100/50"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-4xl">{b.emoji}</div>
                      {isActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#F5C542] border border-[#F5C542]/30 text-[8px] font-extrabold uppercase tracking-widest animate-pulse">
                          Cobertura Activa
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-extrabold text-base transition-colors ${isActive ? "text-[#F5C542]" : "text-[#00135B]"}`}>
                        {b.title}
                      </h3>
                      <p className={`text-xs mt-1 leading-relaxed ${isActive ? "text-slate-200" : "text-slate-500"}`}>
                        {isActive ? b.longDesc : b.desc}
                      </p>
                    </div>
                  </div>

                  {isActive && b.image && (
                    <div className="mt-5 rounded-2xl overflow-hidden h-40 w-full relative animate-fadeIn shadow-inner border border-white/5">
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}

                  <div className="benefit-accent absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#5D8CE2] to-[#F5C542] transition-all" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* INFORMACIÓN GENERAL */}
      {/* ===================================== */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
              style={{ background: "rgba(93,140,226,0.1)", color: "#5D8CE2" }}>
              <BookOpen className="w-4 h-4" />
              Información General
            </div>
            <h2 className="text-3xl font-black text-[#00135B]">Todo lo que necesitas saber</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: "Programa", val: "Fulbright Foreign Student Program" },
              { icon: MapPin, label: "País", val: "🇺🇸 Estados Unidos de América" },
              { icon: Building2, label: "Institución", val: "Universities Fulbright Program" },
              { icon: GraduationCap, label: "Nivel académico", val: "Maestría / Investigación (Ph.D.)" },
              { icon: DollarSign, label: "Financiamiento", val: "100% — Cobertura completa" },
              { icon: Languages, label: "Idioma requerido", val: "Inglés (TOEFL / IELTS)" },
              { icon: Clock, label: "Duración", val: "1 a 2 años académicos" },
              { icon: Calendar, label: "Fecha límite", val: "Octubre (varía por país)" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border card-hover"
                  style={{ borderColor: "rgba(93,140,226,0.12)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: "rgba(93,140,226,0.1)" }}>
                    <Icon className="w-5 h-5" style={{ color: "#5D8CE2" }} />
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{item.label}</p>
                  <p className="font-bold text-[#00135B] text-sm leading-snug">{item.val}</p>
                </div>
              );
            })}
          </div>

          {/* CTA Banner */}
          <div className="mt-8 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ background: "linear-gradient(135deg, #00135B, #0d2a8a)" }}>
            <p className="text-white font-bold text-base">¿Quieres saber si calificas para la Beca Fulbright?</p>
            <button onClick={handleApply}
              className="px-6 py-3 rounded-xl font-bold text-[#00135B] text-sm transition-all hover:scale-105 shrink-0"
              style={{ background: "#F5C542" }}>
              Evaluar mi perfil con IA
            </button>
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* PERFIL IDEAL */}
      {/* ===================================== */}
      <section className="py-20" style={{ background: "#f0f4ff" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
              style={{ background: "rgba(93,140,226,0.1)", color: "#5D8CE2" }}>
              🎯 Perfil Ideal
            </div>
            <h2 className="text-3xl font-black text-[#00135B]">¿Esta beca es para ti?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🏆", title: "Profesionales con liderazgo", tags: ["Liderazgo probado", "Gestión de equipos"] },
              { emoji: "🤝", title: "Compromiso social", tags: ["Voluntariado", "Impacto comunitario"] },
              { emoji: "🌐", title: "Visión global", tags: ["Mentalidad global", "Diversidad cultural"] },
              { emoji: "💡", title: "Interés en generar impacto", tags: ["Innovación", "Retorno al país"] },
            ].map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border card-hover text-center space-y-4"
                style={{ borderColor: "rgba(93,140,226,0.12)" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-3xl"
                  style={{ background: "rgba(93,140,226,0.08)" }}>
                  {p.emoji}
                </div>
                <h3 className="font-bold text-[#00135B] text-sm">{p.title}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {p.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(93,140,226,0.1)", color: "#5D8CE2" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={handleApply} className="text-[#5D8CE2] font-semibold text-sm hover:underline flex items-center gap-1 mx-auto">
              ¿No sabes si calificas? Evalúa tu perfil con IA en 2 minutos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* REQUISITOS */}
      {/* ===================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
              style={{ background: "rgba(0,19,91,0.06)", color: "#00135B" }}>
              <CheckCircle2 className="w-4 h-4" />
              Requisitos
            </div>
            <h2 className="text-3xl font-black text-[#00135B]">¿Qué necesitas para postular?</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checklist */}
            <div className="lg:col-span-2 space-y-3">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border transition-all hover:border-[#5D8CE2]/30"
                  style={{ background: "rgba(248,250,255,0.8)", borderColor: "rgba(93,140,226,0.12)" }}>
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#00135B]">{req.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${req.color}15`, color: req.color }}>
                        {req.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{req.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar - Nivel de Exigencia */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl p-6 space-y-5"
                style={{ background: "linear-gradient(135deg, #00135B, #0d2a8a)", boxShadow: "0 8px 32px rgba(0,19,91,0.2)" }}>
                <h3 className="font-bold text-white text-base">Nivel de Exigencia</h3>
                {[
                  { label: "Académico", pct: 85 },
                  { label: "Idioma (inglés)", pct: 80 },
                  { label: "Liderazgo", pct: 90 },
                  { label: "Ensayos", pct: 75 },
                  { label: "Experiencia", pct: 70 },
                ].map(bar => (
                  <div key={bar.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-white/80 text-xs font-medium">{bar.label}</span>
                      <span className="font-black text-xs" style={{ color: "#F5C542" }}>{bar.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <div className="h-2 rounded-full progress-bar-fill transition-all duration-1000"
                        style={{ width: `${bar.pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-2 p-3 rounded-xl mt-2"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <AlertCircle className="w-4 h-4 text-[#F5C542] shrink-0 mt-0.5" />
                  <p className="text-white/70 text-[11px] leading-relaxed">
                    Esta beca es altamente competitiva. EDULAB te ayuda a maximizar tu perfil con IA.
                  </p>
                </div>
                <button onClick={handleApply}
                  className="w-full py-3 rounded-xl font-bold text-[#00135B] text-sm transition-all hover:scale-[1.02]"
                  style={{ background: "#F5C542" }}>
                  Preparar mi aplicación
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* APLICA CON IA */}
      {/* ===================================== */}
      <section className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #00135B 0%, #001f8a 60%, #0a2490 100%)" }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-4"
              style={{ background: "rgba(245,197,66,0.12)", borderColor: "rgba(245,197,66,0.3)", color: "#F5C542" }}>
              <Zap className="w-4 h-4" />
              Powered by EDULAB AI
            </div>
            <h2 className="text-4xl font-black text-white mb-3">
              Prepara tu aplicación con{" "}
              <span style={{ color: "#F5C542" }}>Inteligencia Artificial</span>
            </h2>
            <p className="text-white/65 max-w-xl mx-auto">
              Nuestras herramientas de IA están diseñadas específicamente para optimizar cada parte de tu postulación Fulbright.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiTools.map((tool, i) => (
              <div key={i}
                className="p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 group"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
                onClick={handleApply}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${tool.color}20` }}>
                    {tool.emoji}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ background: `${tool.color}20`, color: tool.color }}>
                    {tool.tag}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-1">{tool.title}</h3>
                <p className="text-white/60 text-sm mb-4">{tool.desc}</p>
                <span className="text-[#F5C542] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Usar herramienta <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}

            {/* CTA card */}
            <div className="p-6 rounded-2xl flex flex-col justify-between"
              style={{ background: "linear-gradient(135deg, rgba(245,197,66,0.12), rgba(93,140,226,0.12))", border: "1px solid rgba(245,197,66,0.25)" }}>
              <div>
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="font-bold text-white mb-1">Suite completa</h3>
                <p className="text-white/60 text-sm">Accede a todas las herramientas de IA para maximizar tus posibilidades.</p>
              </div>
              <button onClick={handleApply}
                className="mt-4 w-full py-3 rounded-xl font-bold text-[#00135B] text-sm transition-all hover:scale-105"
                style={{ background: "#F5C542" }}>
                Empezar gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* TESTIMONIOS */}
      {/* ===================================== */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
              style={{ background: "rgba(93,140,226,0.1)", color: "#5D8CE2" }}>
              💬 Testimonios
            </div>
            <h2 className="text-3xl font-black text-[#00135B]">Historias de becarios reales</h2>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border card-hover space-y-4"
                style={{ borderColor: "rgba(93,140,226,0.12)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-sm"
                    style={{ background: "linear-gradient(135deg, #00135B, #5D8CE2)", border: "2px solid rgba(93,140,226,0.2)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-[#00135B] text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.country}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ background: "rgba(93,140,226,0.1)", color: "#5D8CE2" }}>
                    {t.university}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ background: "rgba(93,140,226,0.1)", color: "#5D8CE2" }}>
                    {t.program}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>
                    Becario {t.year}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">"{t.quote}"</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-[#F5C542] text-[#F5C542]" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* FAQ */}
      {/* ===================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
              style={{ background: "rgba(0,19,91,0.06)", color: "#00135B" }}>
              <HelpCircle className="w-4 h-4" />
              Preguntas Frecuentes
            </div>
            <h2 className="text-3xl font-black text-[#00135B]">¿Tienes dudas sobre Fulbright?</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
          <div className="mt-8 p-5 rounded-2xl text-center"
            style={{ background: "rgba(93,140,226,0.06)", border: "2px dashed rgba(93,140,226,0.2)" }}>
            <p className="text-[#00135B] font-semibold text-sm mb-2">¿Tienes más preguntas?</p>
            <button onClick={handleApply} className="text-[#5D8CE2] font-bold text-sm hover:underline flex items-center gap-1 mx-auto">
              Chatea con nuestro asistente de IA
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* FOOTER CTA */}
      {/* ===================================== */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #00135B 0%, #0d2a8a 50%, #001a7a 100%)" }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: "radial-gradient(circle, #5D8CE2, transparent)" }} />

        <div className="max-w-4xl mx-auto px-6 text-center relative space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold"
            style={{ background: "rgba(245,197,66,0.12)", borderColor: "rgba(245,197,66,0.3)", color: "#F5C542" }}>
            ⚡ EDULAB — Tu puerta al mundo
          </div>

          <h2 className="text-5xl font-black text-white leading-tight">
            Tu próxima gran oportunidad{" "}
            <span style={{ color: "#F5C542" }}>comienza hoy</span>
          </h2>

          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            No dejes que la complejidad del proceso te detenga. Con EDULAB e IA, preparas la mejor aplicación posible a la Beca Fulbright.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleApply}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[#00135B] transition-all hover:scale-105"
              style={{ background: "#F5C542", boxShadow: "0 4px 20px rgba(245,197,66,0.4)" }}>
              Iniciar postulación <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={handleApply}
              className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}>
              <Sparkles className="w-4 h-4 text-[#F5C542]" />
              Aplicar con IA
            </button>
            <a href="https://foreign.fulbrightonline.org/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
              <ExternalLink className="w-4 h-4" />
              Ir al sitio oficial
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {[
              { val: "500+", label: "Becas gestionadas" },
              { val: "92%", label: "Satisfacción" },
              { val: "40+", label: "Países" },
              { val: "IA", label: "Tecnología" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black" style={{ color: "#F5C542" }}>{s.val}</div>
                <div className="text-white/55 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer dark */}
      <footer className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 px-6 max-w-7xl mx-auto"
        style={{ background: "#000d3d" }}>
        <button onClick={() => navigate("/")} className="text-xl font-black">
          <span style={{ color: "#F5C542" }}>EDU</span><span className="text-white">LAB</span>
        </button>
        <p className="text-white/40 text-xs">© 2026 EDULAB. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          {["Términos", "Privacidad", "Contacto"].map(link => (
            <button key={link} className="text-white/40 hover:text-white/70 text-xs transition-colors">{link}</button>
          ))}
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && <AuthRequiredModal onClose={() => setShowAuthModal(false)} />}

      {/* Apply success toast */}
      {applySuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #00135B, #5D8CE2)" }}>
          <CheckCircle2 className="w-5 h-5 text-[#F5C542]" />
          ¡Postulación a Fulbright iniciada! Ve a tu dashboard.
          <button onClick={() => navigate("/dashboard")} className="text-[#F5C542] underline text-xs font-bold">Ver</button>
        </div>
      )}
    </div>
  );
}


