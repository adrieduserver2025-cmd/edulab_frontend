import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, CheckCircle2, ChevronDown, Globe, BookOpen,
  AlertCircle, Star, ArrowRight, ArrowLeft, Sparkles, ExternalLink,
  HelpCircle, Users, Trophy, Lightbulb,
  GraduationCap, DollarSign, Clock, Calendar, Languages,
  MapPin, Building2, Zap, Heart, X, Plane, Wallet, Shield, Home, Check
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import axiosClient from "../../services/api/axiosClient";
import isotipo from "../../assets/isotipo.png";
import fulbrightLogo from "../../assets/fulbright/becafulbright.jpg";
import fulbrightBadgeLogo from "../../assets/fulbright/logo_principal.png";

const FULBRIGHT_HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80",
    title: "Harvard University · Cambridge, MA"
  },
  {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80",
    title: "Columbia University · New York"
  },
  {
    url: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1600&q=80",
    title: "Georgetown University · Washington D.C."
  },
  {
    url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1600&q=80",
    title: "Stanford University · California"
  },
  {
    url: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1600&q=80",
    title: "MIT · Massachusetts"
  }
];

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
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group text-left">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src={isotipo} 
              alt="EDULAB"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center leading-none">
            <span className="font-display text-2xl font-medium tracking-tight text-white">
              edu
            </span>
            <span className="font-display text-2xl font-medium tracking-tight text-[#F5A400]">
              lab
            </span>
          </div>
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } }
};

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
  const [activeBenefitIdx, setActiveBenefitIdx] = useState<number | null>(null);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIdx((prev) => (prev + 1) % FULBRIGHT_HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const benefitsList = [
    {
      icon: GraduationCap,
      title: "Matrícula Completa",
      tagline: "100% cubierto",
      desc: "Aranceles universitarios totalmente cubiertos en instituciones de excelencia académica mundial.",
      longDesc: "La beca Fulbright cubre el 100% de los costos de matrícula en instituciones partner, eliminando por completo la barrera económica del acceso a la educación superior internacional.",
      checklist: [
        "Arancel de posgrado completo",
        "Costos de inscripción",
        "Tarifas administrativas",
        "Acceso a bibliotecas y laboratorios"
      ],
      advantages: [
        "Sin deuda estudiantil",
        "Instituciones top-tier globales",
        "Múltiples disciplinas elegibles"
      ],
      tip: "Prepara tu expediente académico con 12 meses de anticipación. EduLab ofrece revisión de documentos y simulacros de entrevista gratuitos.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
      theme: {
        bg: "bg-blue-50/50",
        iconColor: "text-blue-600",
        badgeBg: "bg-blue-50 text-blue-700",
        accentColor: "#2563eb"
      }
    },
    {
      icon: Plane,
      title: "Pasajes Internacionales",
      tagline: "Ida y vuelta",
      desc: "Vuelos de ida y vuelta cubiertos desde tu país de origen hasta el destino del programa.",
      longDesc: "Fulbright cubre los pasajes aéreos internacionales de ida al comenzar el programa y de regreso al finalizarlo, garantizando que el acceso geográfico nunca sea un obstáculo.",
      checklist: [
        "Vuelo de ida al inicio del programa",
        "Vuelo de regreso al finalizar",
        "Equipaje documentado incluido",
        "Escala cubierta cuando corresponda"
      ],
      advantages: [
        "Cero gastos de transporte aéreo",
        "Coordinación directa con Fulbright",
        "Flexibilidad de fechas"
      ],
      tip: "Coordina tu vuelo con 8 semanas de anticipación. Los asesores EduLab te acompañan en el proceso de booking y tramitación de visa.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
      theme: {
        bg: "bg-sky-50/50",
        iconColor: "text-sky-600",
        badgeBg: "bg-sky-50 text-sky-700",
        accentColor: "#0284c7"
      }
    },
    {
      icon: Wallet,
      title: "Estipendio Mensual",
      tagline: "Hasta USD 3,000/mes",
      desc: "Asignación mensual ajustada al costo de vida local para alojamiento, alimentación y más.",
      longDesc: "Recibes una asignación mensual calculada según el costo de vida real en tu ciudad destino, para que puedas enfocarte completamente en tus estudios sin preocupaciones económicas.",
      checklist: [
        "Alojamiento en ciudad destino",
        "Alimentación y transporte local",
        "Materiales y útiles académicos",
        "Gastos personales cotidianos"
      ],
      advantages: [
        "Monto ajustado al costo local real",
        "Depósitos mensuales puntuales",
        "Hasta USD 3,000 según destino"
      ],
      tip: "EduLab ofrece talleres de planificación financiera gratuitos. Aprende a optimizar tu estipendio con estrategias probadas por ex-Fulbrighters.",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
      theme: {
        bg: "bg-amber-50/50",
        iconColor: "text-amber-600",
        badgeBg: "bg-amber-50 text-amber-700",
        accentColor: "#d97706"
      }
    },
    {
      icon: Shield,
      title: "Seguro Médico",
      tagline: "Cobertura integral",
      desc: "Seguro de salud completo durante todo el programa, incluyendo emergencias y salud mental.",
      longDesc: "Fulbright incluye un seguro médico de clase mundial que cubre desde consultas de rutina hasta emergencias, con acceso a telemedicina 24/7 y atención en salud mental.",
      checklist: [
        "Consultas médicas generales",
        "Emergencias y hospitalización",
        "Medicamentos recetados",
        "Atención en salud mental"
      ],
      advantages: [
        "Sin copago en emergencias",
        "Red de clínicas certificadas global",
        "Telemedicina 24/7"
      ],
      tip: "Lleva tu historial médico traducido al idioma del país destino. EduLab ofrece plantillas certificadas en 15 idiomas.",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
      theme: {
        bg: "bg-emerald-50/50",
        iconColor: "text-emerald-600",
        badgeBg: "bg-emerald-50 text-emerald-700",
        accentColor: "#059669"
      }
    },
    {
      icon: Home,
      title: "Apoyo de Instalación",
      tagline: "Llegada sin estrés",
      desc: "Subsidio inicial único para los primeros gastos al establecerte en el país destino.",
      longDesc: "Un subsidio único al llegar cubre los gastos iniciales críticos del proceso de instalación, para que tu llegada sea tranquila y puedas concentrarte desde el primer día.",
      checklist: [
        "Depósito y primer mes de arriendo",
        "Equipamiento básico del hogar",
        "Conexiones de servicios básicos",
        "Traslado local desde el aeropuerto"
      ],
      advantages: [
        "Pago único al llegar",
        "Hasta USD 1,500 disponibles",
        "Orientación presencial de Fulbright"
      ],
      tip: "Únete al canal de becarios EduLab en tu ciudad destino antes de llegar. La comunidad comparte recomendaciones de barrios y contactos confiables.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      theme: {
        bg: "bg-purple-50/50",
        iconColor: "text-purple-600",
        badgeBg: "bg-purple-50 text-purple-700",
        accentColor: "#7c3aed"
      }
    },
    {
      icon: Globe,
      title: "Red Global Fulbright",
      tagline: "+400K alumni",
      desc: "Acceso vitalicio a la mayor red de líderes académicos y profesionales del mundo.",
      longDesc: "Al convertirte en becario Fulbright accedes de por vida a una comunidad de más de 400,000 líderes en 160 países: académicos, diplomáticos, emprendedores y premios Nobel.",
      checklist: [
        "+400,000 alumni en 160 países",
        "Eventos y conferencias exclusivos",
        "Plataforma digital de networking",
        "Programa de mentorías activo"
      ],
      advantages: [
        "Conexiones con líderes globales",
        "Oportunidades laborales exclusivas",
        "Membresía de por vida"
      ],
      tip: "EduLab conecta a becarios activos con mentores Fulbright en tu área de expertise. Agenda tu sesión de mentoría gratuita antes de que comience el programa.",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80",
      theme: {
        bg: "bg-pink-50/50",
        iconColor: "text-pink-600",
        badgeBg: "bg-pink-50 text-pink-700",
        accentColor: "#db2777"
      }
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600;700&display=swap');
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .font-geist {
          font-family: 'Geist Mono', monospace;
        }
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
      {/* HERO SECTION WITH DYNAMIC BACKGROUND CAROUSEL & PROMINENT LOGO CARD */}
      {/* ===================================== */}
      <section className="hero-grid-pattern pt-28 pb-12 relative overflow-hidden text-white min-h-[580px] flex flex-col justify-between">
        {/* Dynamic Background Carousel */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {FULBRIGHT_HERO_SLIDES.map((slide, idx) => (
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
        <div className="absolute bottom-16 right-8 z-20 hidden md:flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-medium text-white shadow-xl">
          <span className="text-white/90 font-semibold">{FULBRIGHT_HERO_SLIDES[currentSlideIdx].title}</span>
          <div className="flex gap-1.5 ml-2">
            {FULBRIGHT_HERO_SLIDES.map((_, idx) => (
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

        <div className="max-w-7xl mx-auto px-6 py-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-7 text-left drop-shadow-md">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold shadow-md"
                style={{ background: "rgba(0,19,91,0.65)", borderColor: "rgba(245,197,66,0.5)", color: "#F5C542", backdropFilter: "blur(8px)" }}
              >
                <span className="w-2 h-2 rounded-full bg-[#F5C542] animate-pulse" />
                BECA INTERNACIONAL 🇺🇸 ESTADOS UNIDOS — DEPARTAMENTO DE ESTADO
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-lg">
                <span className="text-white">Beca </span>
                <span style={{ color: "#F5C542" }}>Fulbright</span>
              </h1>

              <p className="text-white/95 text-base sm:text-lg leading-relaxed max-w-xl font-medium drop-shadow-md">
                Programa oficial del Gobierno de EE.UU. que ofrece becas integrales para estudios de posgrado e investigación en prestigiosas universidades estadounidenses.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { icon: "🇺🇸", text: "Estados Unidos" },
                  { icon: "🎓", text: "Maestría / Doctorado" },
                  { icon: "💰", text: "100% Financiada" },
                  { icon: "🗣", text: "Inglés" },
                ].map(tag => (
                  <span
                    key={tag.text}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
                    style={{ background: "rgba(0,19,91,0.65)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}
                  >
                    <span>{tag.icon}</span> <span>{tag.text}</span>
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {applySuccess ? (
                  <div
                    className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-[#00135B] text-sm shadow-xl"
                    style={{ background: "#F5C542" }}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    ¡Postulación iniciada! Ver en Dashboard
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="flex items-center gap-2 px-8 py-4 rounded-full font-extrabold text-[#00135B] text-sm transition-all hover:scale-105 cursor-pointer shadow-xl"
                    style={{ background: "#F5C542", boxShadow: "0 4px 25px rgba(245,197,66,0.5)" }}
                  >
                    {applying ? "Iniciando..." : "Simular mi postulación"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 px-6 py-4 rounded-full font-bold text-white text-sm transition-all hover:bg-white/20 cursor-pointer shadow-lg"
                  style={{ border: "1px solid rgba(255,255,255,0.4)", background: "rgba(0,19,91,0.65)", backdropFilter: "blur(8px)" }}
                >
                  <Sparkles className="w-4 h-4 text-[#F5C542]" />
                  Aplicar con IA
                </button>
              </div>

              {/* Attributes Banner */}
              <div
                className="p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 w-full shadow-lg"
                style={{ background: "rgba(0, 19, 91, 0.65)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                {[
                  { label: "FINANCIAMIENTO", val: "100% completa" },
                  { label: "DURACIÓN", val: "1-2 años" },
                  { label: "FECHA LÍMITE", val: "Convocatoria Abierta" },
                  { label: "MODALIDAD", val: "Presencial" }
                ].map(item => (
                  <div key={item.label} className="space-y-0.5 text-left">
                    <div className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-white font-black text-xs">{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-2 w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                {[
                  { val: "+3,000", label: "Becados / año" },
                  { val: "170+", label: "Países participantes" },
                  { val: "70+", label: "Años de historia" }
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
                {/* Gold glowing backdrop circle */}
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl opacity-40 pointer-events-none"
                  style={{ background: "#F5C542" }}
                />

                {/* Main Prominent Official Logo Badge */}
                <div className="w-full max-w-[280px] h-24 mx-auto rounded-2xl bg-white p-3 shadow-2xl flex items-center justify-center border-2 border-[#F5C542] transition-transform hover:scale-105 duration-300">
                  <img
                    src={fulbrightLogo}
                    alt="Logo Beca Fulbright"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                    Beca <span style={{ color: "#F5C542" }}>Fulbright</span>
                  </h3>
                  <p className="text-xs text-amber-300 mt-1 font-bold uppercase tracking-wider">
                    Gobierno de EE.UU. & Departamento de Estado
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
                    <span className="font-bold text-white flex items-center gap-1">🇺🇸 Estados Unidos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 font-medium">Entidad Convocante:</span>
                    <span className="font-bold text-white">Comisión Fulbright</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 font-medium">Convenio:</span>
                    <span className="font-bold text-[#F5C542]">Programa Internacional</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 font-medium">Cobertura:</span>
                    <span className="font-bold text-emerald-400">100% Completa</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Wave SVG */}
        <svg viewBox="0 0 1440 80" className="w-full block relative z-10" preserveAspectRatio="none" style={{ height: 50 }}>
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
      {/* BENEFICIOS - Layout tipo Figma */}
      {/* ===================================== */}
      <section className="py-20 bg-white relative overflow-hidden font-jakarta text-[#0f172a]">
        <style>{`
          .benefit-list-item {
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .benefit-list-item:hover {
            background: rgba(93,140,226,0.04);
            border-color: rgba(93,140,226,0.25) !important;
          }
          .benefit-list-item.active {
            background: #EEF4FF;
            border-color: #5D8CE2 !important;
            box-shadow: 0 4px 16px rgba(37,99,235,0.10);
          }
          .benefit-panel-enter {
            animation: panelFadeIn 0.35s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes panelFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .check-item {
            transition: background 0.2s;
          }
          .adv-badge {
            transition: background 0.2s, border-color 0.2s;
          }
          .adv-badge:hover {
            background: #FEF3C7;
            border-color: #F59E0B;
          }
        `}</style>

        {/* Subtle bg glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-[#d97706]/20 text-[#d97706] text-xs font-bold font-geist mb-4 uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-[#d97706]" />
              Beneficios
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0f172a] font-jakarta">
              ¿Qué incluye la beca?
            </h2>
            <p className="text-slate-500 text-sm md:text-base mt-4 max-w-2xl mx-auto">
              Explora los seis pilares de cobertura completa diseñados para asegurar tu excelencia académica y bienestar en los Estados Unidos.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* LEFT — Benefit list */}
            <div className="lg:w-[38%] flex flex-col gap-3">
              {benefitsList.map((b, i) => {
                const IconComponent = b.icon;
                const isActive = (activeBenefitIdx ?? 0) === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveBenefitIdx(i)}
                    className={`benefit-list-item w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left cursor-pointer ${isActive ? "active" : "border-slate-100 bg-white"}`}
                  >
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${b.theme.bg}`}>
                      <IconComponent className={`w-5 h-5 ${b.theme.iconColor}`} />
                    </div>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#0f172a] font-jakarta leading-tight">{b.title}</p>
                      <p className={`text-xs mt-0.5 font-medium ${isActive ? "text-[#2563eb]" : "text-slate-400"}`}>
                        {isActive ? "Mostrando detalles" : "Ver cobertura e información"}
                      </p>
                    </div>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* RIGHT — Detail panel */}
            <div className="lg:flex-1 min-h-[520px]">
              {(() => {
                const idx = activeBenefitIdx ?? 0;
                const b = benefitsList[idx];
                const IconComponent = b.icon;
                const accentColor = b.theme.accentColor;
                return (
                  <div key={idx} className="benefit-panel-enter bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden flex flex-col">
                    
                    {/* Top image strip */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {/* Badge on image */}
                      <div
                        className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold font-geist text-white uppercase tracking-wider shadow-md"
                        style={{ backgroundColor: accentColor }}
                      >
                        <IconComponent className="w-3 h-3" />
                        {b.title}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7 flex flex-col gap-6">

                      {/* Title block */}
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${b.theme.bg}`}>
                          <IconComponent className={`w-6 h-6 ${b.theme.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold text-[#0f172a] font-jakarta leading-tight">{b.title}</h3>
                          <span className={`inline-block font-geist text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1.5 ${b.theme.badgeBg}`}>
                            {b.tagline}
                          </span>
                        </div>
                      </div>

                      {/* Long description */}
                      <p className="text-slate-600 text-sm leading-relaxed font-jakarta">
                        {b.longDesc}
                      </p>

                      {/* Qué incluye */}
                      <div className="space-y-2.5">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-geist">
                          Qué incluye
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                          {b.checklist.map((item, idx2) => (
                            <div key={idx2} className="check-item flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-1 px-2 rounded-lg hover:bg-blue-50/50">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `${accentColor}18` }}>
                                <Check className="w-3 h-3" style={{ color: accentColor }} />
                              </div>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ventajas clave */}
                      <div className="space-y-2.5">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-geist">
                          Ventajas clave
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {b.advantages.map((adv, idx2) => (
                            <span key={idx2} className="adv-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-800 font-jakarta">
                              <Star className="w-3 h-3 text-[#d97706] fill-[#d97706]" />
                              {adv}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* EduLab Tip */}
                      <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: "rgba(93,140,226,0.05)", border: "1px solid rgba(93,140,226,0.15)" }}>
                        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="block font-geist text-[9px] font-bold text-[#00135B] uppercase tracking-wider">
                            Consejo EduLab
                          </span>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed font-jakarta">
                            {b.tip}
                          </p>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-3 pt-1">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleApply}
                          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-white cursor-pointer shadow-lg transition-colors"
                          style={{ background: `linear-gradient(135deg, ${accentColor}, #00135B)`, boxShadow: `0 4px 20px ${accentColor}35` }}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Comenzar postulación</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>

                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

          {/* Footer Section */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left space-y-1">
              <h4 className="font-bold text-base text-[#0f172a] font-jakarta">
                ¿Listo para postular?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-jakarta">
                Nuestra plataforma con inteligencia artificial te guía paso a paso en tu aplicación Fulbright.
              </p>
            </div>
            <button
              onClick={() => navigate("/opportunities")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-250 hover:border-[#2563eb] hover:bg-blue-50/20 text-[#2563eb] font-bold text-xs transition-all cursor-pointer bg-transparent"
            >
              <span>Ver todos los programas Fulbright</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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


