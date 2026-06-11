import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Globe2,
  Brain,
  Network,
  ScrollText,
  Sparkles,
  School,
  Sprout,
  UsersRound,
  Handshake

} from "lucide-react";


//iconos para beneficios
const benefitIcons = [Globe2, Brain, Network, ScrollText, Sparkles, Award];


const activityIcons = [School, Sparkles, Sprout, Globe2, UsersRound];
const activityMedia = [
  {
    title: "Enseñanza en comunidades",
    type: "image",
    media:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    description:
      "Participa en actividades educativas y de apoyo comunitario junto a jóvenes voluntarios.",
  },
  {
    title: "Proyectos sociales",
    type: "image",
    media:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Colabora en iniciativas sociales orientadas a generar impacto positivo en comunidades.",
  },
  {
    title: "Campañas ambientales",
    type: "image",
    media:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    description:
      "Forma parte de campañas ambientales y actividades vinculadas al cuidado del entorno.",
  },
  {
    title: "Actividades interculturales",
    type: "video",
    media:
      "https://www.youtube.com/embed/47iHjBi9VRw",
    description:
      "Comparte experiencias con jóvenes de distintos países y fortalece tus habilidades interculturales.",
  },
  {
    title: "Apoyo a jóvenes y niños",
    type: "image",
    media:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    description:
      "Apoya actividades formativas, recreativas o sociales dirigidas a jóvenes y niños.",
  },
];
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);


const emojiIconMap: Record<string, any> = {
  "🌍": Globe2,
  "🌎": Globe2,
  "🌏": Globe2,
  "🧠": Brain,
  "🤝": Handshake,
  "📜": ScrollText,
  "🌱": Sprout,
  "📚": School,
  "✨": Sparkles,
};

function getEmojiFromText(text: string) {
  return Object.keys(emojiIconMap).find((emoji) => text.includes(emoji));
}

function removeEmojis(text: string) {
  return text
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .trim();
}

function parseIconText(text: string, fallbackIcon = Sparkles) {
  const emoji = getEmojiFromText(text);

  return {
    text: removeEmojis(text),
    Icon: emoji ? emojiIconMap[emoji] : fallbackIcon,
  };
}

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);
import PublicNavbar from "../../components/navigation/PublicNavbar";
import AuthModal from "../../components/auth/AuthModal";
import axiosClient from "../../services/api/axiosClient";
import { useAuthStore } from "../../store/useAuthStore";
import { getMyProfile } from "../../services/profileService";
import type { StudentProfileResponse } from "../../services/profileService";

interface ProgramDetail {
  id: number;
  title: string;
  description: string;
  type: string;
  organization: string;
  country: string;
  deadline: string;
  eligibility?: string;
  benefits?: string;
  slots?: number;
  slug: string;
  organization_name?: string;
  status?: string;
  short_description?: string;
  activities?: string[];
  requirements?: string[];
  benefits_json?: string[];
  dates_info?: string;
  support_ai?: string[];
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  video_url?: string;
  image_url?: string;
  is_demo?: boolean;
}

export default function OpportunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Auth & Profile states
  const { isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);

  // Detail States
  const [opportunity, setOpportunity] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI Interactivity States
  const [activeTab, setActiveTab] = useState("descripcion");
  const [savedPrograms, setSavedPrograms] = useState<number[]>(() => {
    const saved = localStorage.getItem("edulab_saved_programs");
    return saved ? JSON.parse(saved) : [];
  });

  // Video embed inline toggle
  const [playVideo, setPlayVideo] = useState(false);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [showPostulationModal, setShowPostulationModal] = useState(false);
  const [postulating, setPostulating] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Load Opportunity Data
  useEffect(() => {
    async function fetchOpportunity() {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/opportunities/${slug}`);
        setOpportunity(response.data);
        if (slug === "aiesec-voluntariado") {
          setShowVideoPopup(true);
        }
      } catch (err: any) {
        console.error("Failed to fetch opportunity from backend.", err);
        setError("Oportunidad no encontrada o backend no disponible.");
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunity();
  }, [slug]);

  // Load student profile for completeness check
  useEffect(() => {
    if (isAuthenticated) {
      getMyProfile()
        .then((data) => setProfile(data))
        .catch((err) => console.error("Could not fetch profile:", err));
    } else {
      setProfile(null);
    }
  }, [isAuthenticated]);

  const openAuthModal = (mode: "login" | "register") => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const toggleSave = () => {
    if (!opportunity) return;
    const nextSaved = savedPrograms.includes(opportunity.id)
      ? savedPrograms.filter((x) => x !== opportunity.id)
      : [...savedPrograms, opportunity.id];
    setSavedPrograms(nextSaved);
    localStorage.setItem("edulab_saved_programs", JSON.stringify(nextSaved));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
  };

  // Start Postulation Flow
  const handleStartPostulation = async () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    if (!opportunity) return;

    setPostulating(true);
    try {
      // POST application to backend (status will default to "started")
      await axiosClient.post("/applications/", { program_id: opportunity.id });
      setShowPostulationModal(true);
    } catch (err) {
      console.error("Failed to start postulation in backend:", err);
      // Fallback show modal if backend has offline sync issues
      setShowPostulationModal(true);
    } finally {
      setPostulating(false);
    }
  };

  // Convert YouTube normal URL to embed format
  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("embed/")) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : "";
  };

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 160; // Offset for sticky navbar + subnavbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col justify-between pt-20">
        <PublicNavbar onOpenAuth={openAuthModal} />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#5D8CE2] animate-spin"></div>
          <p className="text-sm font-semibold text-slate-400">Cargando detalles de oportunidad...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col justify-between pt-20">
        <PublicNavbar onOpenAuth={openAuthModal} />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center p-6">
          <AlertTriangle className="w-12 h-12 text-rose-500 animate-bounce" />
          <h2 className="text-xl font-bold text-[#00135B]">{error || "Oportunidad no encontrada"}</h2>
          <button
            onClick={() => navigate("/programs")}
            className="px-6 py-2 bg-[#00135B] text-white rounded-xl text-xs font-bold hover:bg-[#0d288c] transition-colors"
          >
            Volver a Programas
          </button>
        </div>
      </div>
    );
  }

  const completionPercent = profile ? profile.profile_completion : 0;
  const isProfileComplete = completionPercent === 100;

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col justify-between pt-20">
      <PublicNavbar onOpenAuth={openAuthModal} />

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>¡Enlace copiado al portapapeles con éxito!</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-[#00135B] via-[#001a7a] to-[#0d288c] text-white overflow-hidden py-16 px-6 md:px-12 z-10 flex flex-col items-center">
        <div className="absolute inset-0">
          <img
            src={opportunity.image_url}
            alt={opportunity.title}
            onError={(event) => {
              event.currentTarget.src = "/assets/images/hero_default.png";
            }}
            className="h-full w-full object-cover object-[center_70%]"
          />

          <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(4,17,58,0.95)_0%,rgba(4,17,58,0.82)_34%,rgba(4,17,58,0.38)_58%,rgba(4,17,58,0.12)_78%,rgba(4,17,58,0.03)_100%)]' />
          <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(4,17,58,0.12)_0%,rgba(4,17,58,0.42)_62%,rgba(4,17,58,0.72)_100%)]' />
        </div>


        {/* Tech Grid Background lines */}
        <div className="absolute inset-0 tech-grid opacity-35 pointer-events-none z-0"></div>
        <div className="pointer-events-none absolute inset-x-0 top-12 z-30">
          <div className="mx-auto flex max-w-7xl justify-end px-6 md:px-12">
            <div className="pointer-events-auto flex items-center gap-3">
              <button
                onClick={toggleSave}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all bg-white/5 cursor-pointer ${savedPrograms.includes(opportunity.id)
                  ? "border-rose-400/50 text-rose-400 bg-rose-500/10"
                  : "border-white/20 text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Heart className={`w-3.5 h-3.5 ${savedPrograms.includes(opportunity.id) ? "fill-current" : ""}`} />
                <span>{savedPrograms.includes(opportunity.id) ? "Guardado" : "Guardar para después"}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 rounded-full border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 bg-white/5 cursor-pointer"
                title="Compartir oportunidad"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl w-full flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10 text-left">

          {/* Left Block Details */}
          <div className="space-y-6 flex-1">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/programs")}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver a voluntariados</span>
              </button>
            </div>

            {/* Badge & Title */}
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F5C542] text-[#00135B] text-[10px] font-extrabold uppercase tracking-wider gold-premium-static">
                {opportunity.status === "open" ? "Convocatoria Abierta" : "Cerrado"}
              </span>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight">
                {opportunity.title}
              </h1>
              <p className="text-slate-300 text-sm md:text-base font-medium max-w-2xl">
                {opportunity.short_description}

              </p>
            </div>

            {/* Horizontal Specs Bar */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-[11px] text-slate-300 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#F5C542]" />
                <span className="font-bold">Internacional ({opportunity.country})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#F5C542]" />
                <span className="font-bold">Presencial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#F5C542]" />
                <span className="font-bold">Corta duración</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#F5C542]" />
                <span className="font-bold">Español / Inglés</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#F5C542]" />
                <span className="font-bold">18 - 30 años</span>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={handleStartPostulation}
                disabled={postulating}
                className="px-8 py-3.5 rounded-xl gold-premium fx-neon text-[#04113a] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {postulating ? "Procesando..." : "Iniciar mi postulación"}
              </button>

              <button
                onClick={() => scrollToSection("requisitos")}
                className="px-6 py-3.5 rounded-xl border border-white/30 hover:border-white text-white font-bold text-xs uppercase tracking-wider transition-all bg-transparent cursor-pointer"
              >
                Ver requisitos
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Video Card */}
          <div className="w-full lg:w-[400px] shrink-0 z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 overflow-hidden p-3 shadow-2xl relative aspect-video flex flex-col justify-end min-h-[250px] group text-left">
              {playVideo && opportunity.video_url ? (
                <iframe
                  className="absolute inset-0 w-full h-full rounded-2xl border-none"
                  src={getEmbedUrl(opportunity.video_url)}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  <img
                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600"
                    alt="Welcome to AIESEC video cover"
                    className="absolute inset-0 w-full h-full object-cover opacity-75 filter brightness-75 transition-transform duration-500 group-hover:scale-103"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#00135B]/90 via-[#00135B]/30 to-transparent"></div>

                  <button
                    onClick={() => setPlayVideo(true)}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#F5C542] hover:bg-[#ebd035] hover:scale-110 flex items-center justify-center text-[#00135B] shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </button>

                  <div className="relative z-10 p-4 space-y-1 text-white">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 border border-white/25 text-[8px] font-extrabold uppercase tracking-wider mb-1">
                      Video de Bienvenida
                    </span>
                    <h3 className="font-bold text-sm font-display text-[#F5C542]">Conoce más sobre {opportunity.organization_name || opportunity.organization}</h3>
                    <p className="text-[10px] text-slate-300 leading-snug">
                      Mira cómo funciona el voluntariado internacional antes de postular.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Sub-Navigation Sticky Bar */}
      <div className="w-full bg-white border-b border-gray-200/80 sticky top-20 z-40 shadow-sm max-md:hidden">
        <div className="max-w-7xl mx-auto px-8 flex gap-8">
          {[
            { id: "descripcion", label: "Descripción" },
            { id: "beneficios", label: "Beneficios" },
            { id: "actividades", label: "Actividades" },
            { id: "requisitos", label: "Requisitos" },
            { id: "testimonios", label: "Testimonios" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`py-4 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${activeTab === tab.id
                ? "border-[#00135B] text-[#00135B]"
                : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Body */}
      <section className="max-w-7xl w-full mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start overflow-visible">

          {/* Left Column (Main details) */}
          <div className="lg:col-span-2 space-y-12">

            {/* Descripción */}
            <div id="descripcion" className="bg-white p-8 rounded-3xl border border-[#EBDDC5] shadow-[0_12px_35px_rgba(3,26,51,0.05)] space-y-6 text-left">
              <span className="text-[10px] text-[#5D8CE2] uppercase font-extrabold tracking-wider">Descripción</span>
              <h2 className="font-display font-bold text-2xl text-[#00135B] mt-1">¿De qué se trata este voluntariado?</h2>

              <div className="text-slate-600 text-sm leading-relaxed space-y-4 font-medium">
                {opportunity.description.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="bg-amber-50 border-l-4 border-[#F5C542] p-4 text-xs font-semibold text-[#00135B] rounded-r-xl">
                Vivo una experiencia internacional con acompañamiento antes, durante y después del programa.
              </div>
            </div>

            {/* Beneficios */}
            <div id="beneficios" className="bg-white p-8 rounded-3xl border border-[#EBDDC5] shadow-[0_12px_35px_rgba(3,26,51,0.05)] space-y-6 text-left">
              <span className="text-[10px] text-[#5D8CE2] uppercase font-extrabold tracking-wider">Beneficios</span>
              <h2 className="font-display font-bold text-2xl text-[#00135B] mt-1">Lo que ganarás con esta experiencia</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(opportunity.benefits_json || [
                  "Experiencia internacional",
                  "Desarrollo de liderazgo",
                  "Red global de contactos",
                  "Certificado internacional",
                  "Crecimiento personal"
                ]).map((ben, idx) => {
                  const rawText = String(ben);
                  const fallbackIcon = benefitIcons[idx] || Sparkles;
                  const { text, Icon } = parseIconText(rawText, fallbackIcon);

                  return (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 border border-gray-200/50 rounded-2xl flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#5D8CE2]/10 border border-[#5D8CE2]/20 flex items-center justify-center text-[#5D8CE2] shrink-0">
                        <Icon className="w-4 h-4" strokeWidth={2.2} />
                      </div>

                      <span className="font-bold text-xs text-[#00135B] leading-snug">
                        {text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actividades */}
            {/* Actividades */}
            <div id="actividades" className="bg-white p-8 rounded-3xl border border-[#EBDDC5] shadow-[0_12px_35px_rgba(3,26,51,0.05)] space-y-6 text-left">
              <span className="text-[10px] text-[#5D8CE2] uppercase font-extrabold tracking-wider">
                Actividades
              </span>

              <h2 className="font-display font-bold text-2xl text-[#00135B] mt-1">
                ¿Qué harás?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {(opportunity.activities || [
                  "Enseñanza en comunidades",
                  "Proyectos sociales",
                  "Campañas ambientales",
                  "Actividades interculturales"
                ]).map((act, idx) => {
                  const rawText = String(act);
                  const fallbackIcon = activityIcons[idx] || Sparkles;
                  const { text: cleanTitle, Icon } = parseIconText(rawText, fallbackIcon);
                  const mediaInfo = activityMedia[idx] || {
                    title: cleanTitle,
                    type: "image",
                    media:
                      "https://www.youtube.com/embed/47iHjBi9VRw",
                    description:
                      "Conoce más sobre esta actividad y cómo forma parte de la experiencia del voluntariado.",
                  };

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setSelectedActivity({
                          ...mediaInfo,
                          title: cleanTitle,
                        })
                      }
                      className="group min-h-[150px] p-4 bg-slate-50 border border-gray-200/50 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:-translate-y-1 hover:border-[#5D8CE2]/40 hover:bg-[#5D8CE2]/5 hover:shadow-[0_14px_30px_rgba(3,26,51,0.08)] cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#5D8CE2]/10 border border-[#5D8CE2]/20 flex items-center justify-center text-[#5D8CE2] transition group-hover:scale-105 group-hover:bg-[#5D8CE2]/15">
                        <Icon className="w-6 h-6" strokeWidth={2.1} />
                      </div>

                      <span className="font-bold text-xs text-[#00135B] leading-snug">
                        {cleanTitle}
                      </span>

                      <span className="text-[11px] font-extrabold text-[#5D8CE2] opacity-0 transition group-hover:opacity-100">
                        Ver detalle
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Requisitos */}
            <div id="requisitos" className="bg-white p-8 rounded-3xl border border-[#EBDDC5] shadow-[0_12px_35px_rgba(3,26,51,0.05)] space-y-6 text-left">
              <span className="text-[10px] text-[#5D8CE2] uppercase font-extrabold tracking-wider">Requisitos</span>
              <h2 className="font-display font-bold text-2xl text-[#00135B] mt-1">Lo que necesitas para participar</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(opportunity.requirements || [
                  "Tener entre 18 y 30 años",
                  "Interés en voluntariado internacional",
                  "Nivel básico/intermedio de inglés",
                  "Disponibilidad para viajar"
                ]).map((req, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 bg-slate-50 border border-gray-200/50 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-[#5D8CE2]/10 border border-[#5D8CE2]/20 flex items-center justify-center text-[#5D8CE2] shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonios */}
            <div id="testimonios" className="bg-white p-8 rounded-3xl border border-[#EBDDC5] shadow-[0_12px_35px_rgba(3,26,51,0.05)] space-y-6 text-left">
              <span className="text-[10px] text-[#5D8CE2] uppercase font-extrabold tracking-wider">Testimonios</span>
              <h2 className="font-display font-bold text-2xl text-[#00135B] mt-1">Historias de voluntarios</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Video Card 1 */}
                <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                    <img
                      src="/src/assets/alysandra.png"
                      alt="AIESEC volunteer story 1"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <a
                      href="https://www.youtube.com/watch?v=apYz97XhpgM"
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-[#F5C542] hover:scale-105 transition-all text-[#00135B] flex items-center justify-center shadow-lg cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </a>
                  </div>
                  <div className="p-5 text-left space-y-1">
                    <h4 className="font-bold text-sm text-[#00135B]">Conoce la experiencia de Alysandra en su voluntariado internacional</h4>

                  </div>
                </div>

                {/* Video Card 2 */}
                <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                    <img
                      src="/src/assets/ahmad.png"
                      alt="AIESEC volunteer story 2"
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <a
                      href="https://www.youtube.com/watch?v=BJruDJdnxU0&t=17s"
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-[#F5C542] hover:scale-105 transition-all text-[#00135B] flex items-center justify-center shadow-lg cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </a>
                  </div>
                  <div className="p-5 text-left space-y-1">
                    <h4 className="font-bold text-sm text-[#00135B]">Conoce la experiencia de Ahmad en su voluntariado internacional</h4>

                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column (Sidebar details) */}
          <aside className="space-y-6 lg:sticky lg:top-36 lg:self-start">

            {/* Acompañamiento EDULAB */}
            <div className="bg-[#00135B] text-white p-6 rounded-3xl space-y-4 shadow-sm text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#5D8CE2]/10 rounded-full blur-xl pointer-events-none"></div>

              <h3 className="font-bold text-sm text-[#F5C542] uppercase tracking-wider">Acompañamiento EDULAB</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Te ayudamos a prepararte mejor antes de aplicar, ordenando tu perfil, tu motivación y los pasos básicos de la postulación.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-200 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#F5C542] shrink-0 stroke-[3]" />
                  <span>Construir tu perfil como voluntario</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#F5C542] shrink-0 stroke-[3]" />
                  <span>Organizar tus motivaciones</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#F5C542] shrink-0 stroke-[3]" />
                  <span>Preparar cartas o respuestas</span>
                </li>
              </ul>

              <button
                onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
                className="w-full mt-4 py-2.5 rounded-xl gold-premium fx-neon text-[#04113a] font-extrabold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md"
              >
                <span>Preparar postulación</span>
                <ArrowRight className="w-3 h-3 text-[#00135B] stroke-[3]" />
              </button>
            </div>

            {/* Organización */}
            <div className="bg-[#00135B] text-white p-6 rounded-3xl space-y-4 shadow-sm text-left relative overflow-hidden">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Organización</h3>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {opportunity.organization_name?.toLowerCase().includes("aiesec") ? (
                    <img
                      src="/src/assets/man_aiesec.png"
                      alt="AIESEC"
                      className="h-9 w-9 object-contain"
                    />
                  ) : (
                    <span className="font-extrabold text-[#F5C542]">
                      {opportunity.organization_name?.substring(0, 3).toUpperCase() || "ORG"}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#F5C542]">{opportunity.organization}</h4>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Socio Oficial</span>
                </div>
              </div>

              <p className="text-[11px] text-xs text-slate-300 leading-relaxed font-medium">
                Organización global liderada por jóvenes enfocada en liderazgo, intercambio cultural y experiencias internacionales con impacto social.
              </p>

              <div className="pt-2 flex gap-4 items-center border-t border-gray-100">
                {opportunity.facebook_url && (
                  <a href={opportunity.facebook_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#00135B] transition-colors">
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}
                {opportunity.instagram_url && (
                  <a href={opportunity.instagram_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#00135B] transition-colors">
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
                {opportunity.youtube_url && (
                  <a href={opportunity.youtube_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#00135B] transition-colors">
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </aside>

        </div>
      </section>

      {/* Footer CTA Banner Section */}
      <section className="bg-[#00135B] py-16 px-6 md:px-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-25 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left">

          <div className="space-y-2 max-w-lg">
            <span className="text-[9px] text-[#F5C542] uppercase font-bold tracking-widest">Próximo Paso</span>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl leading-snug">¿Listo para generar impacto?</h2>
            <p className="text-xs text-slate-300 font-medium">
              Da el primer paso para participar en este voluntariado y aportar a una causa con propósito global.
            </p>
          </div>

          {/* Center yellow CTA card */}
          <div className="bg-[#F5C542] p-6 rounded-3xl text-[#00135B] flex flex-col md:flex-row items-center gap-6 shadow-xl max-w-md w-full shrink-0">
            <div className="text-left flex-1 space-y-1">
              <h4 className="font-bold text-sm">Comenzar postulación</h4>
              <p className="text-[10px] text-[#00135B]/80 font-semibold">
                Da el primer paso para vivir una experiencia que te transformará.
              </p>
            </div>
            <button
              onClick={handleStartPostulation}
              className="px-5 py-3 rounded-xl bg-[#00135B] hover:bg-[#0d288c] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0 border-none cursor-pointer"
            >
              Quiero postular ahora
            </button>
          </div>

          <div className="space-y-2 max-w-xs text-left">
            <HelpCircle className="w-5 h-5 text-[#F5C542]" />
            <h4 className="font-bold text-sm text-white">¿Tienes dudas?</h4>
            <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
              Chatea con nuestro chatbot y recibe orientación académica antes de postular.
            </p>
            <button
              onClick={() => navigate("/ai-tools")}
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#F5C542] hover:underline bg-transparent border-none cursor-pointer"
            >
              <span>Chatear ahora</span>
              <ArrowRight className="w-3 h-3 stroke-[3]" />
            </button>
          </div>

        </div>
      </section>

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      {/* POSTULATION SUCCESS MODAL */}
      {showPostulationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl relative space-y-6 text-left animate-scaleUp">

            {/* Close Button */}
            <button
              onClick={() => setShowPostulationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Alert Header */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
                <ShieldCheck className="w-8 h-8 fill-emerald-100" />
              </div>

              <h3 className="font-display font-extrabold text-xl text-[#00135B]">
                ¡Postulación Iniciada!
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Tu intención de postular al **{opportunity.title}** ha sido registrada con éxito en EDULAB con estado <span className="font-bold text-[#5D8CE2]">started</span>.
              </p>
            </div>

            {/* Profile incompleteness alert */}
            {!isProfileComplete ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-xs text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                  <span>Perfil Académico Incompleto ({completionPercent}%)</span>
                </h4>
                <p className="text-[10px] text-amber-700 leading-relaxed font-semibold">
                  Debes completar tu perfil académico estratégico al 100% en la sección 'Mi Perfil' para que nuestro equipo pueda validar tu postulación final y desbloquear el envío definitivo al socio internacional.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-[10px] text-emerald-700 font-semibold">
                  ¡Tu perfil está completado al 100%! Nuestro equipo revisará tus detalles y te contactará en breve.
                </p>
              </div>
            )}

            {/* Next steps list */}
            <div className="space-y-2">
              <span className="text-[9px] text-[#5D8CE2] uppercase font-bold tracking-wider">Próximos Pasos</span>
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2 text-emerald-600">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Intención de postulación iniciada</span>
                </li>
                <li className={`flex items-center gap-2 ${isProfileComplete ? "text-emerald-600" : "text-slate-400"}`}>
                  {isProfileComplete ? <Check className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-400 shrink-0">2</div>}
                  <span>Completar perfil al 100%</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <div className="w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-400 shrink-0">3</div>
                  <span>Generar carta de motivación con IA</span>
                </li>
              </ul>
            </div>

            {/* Actions Button Group */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setShowPostulationModal(false);
                  navigate("/profile");
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 text-white font-extrabold text-xs tracking-wider transition-all duration-200 cursor-pointer active:scale-95 text-center border-none shadow-sm"
              >
                Completar Perfil
              </button>

              <button
                onClick={() => {
                  setShowPostulationModal(false);
                  navigate("/dashboard");
                }}
                className="flex-1 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-gray-200 text-xs font-bold text-slate-500 transition-all duration-200 cursor-pointer active:scale-95"
              >
                Ir a mi Panel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* AUTO VIDEO POPUP MODAL */}
      {showVideoPopup && opportunity?.video_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-4xl bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative animate-scaleUp">

            {/* Close Button */}
            <button
              onClick={() => setShowVideoPopup(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video container */}
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full border-none"
                src={getEmbedUrl(opportunity.video_url)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Title / Description area */}
            <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1 text-left">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F5C542] text-[#00135B] text-[8px] font-extrabold uppercase tracking-wider gold-premium-static">
                  Impacto Global
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  {opportunity.title} — Presentación Oficial
                </h3>
                <p className="text-xs text-slate-400">Vive una experiencia internacional que transforma tu forma de ver el mundo.</p>
              </div>
              <button
                onClick={() => setShowVideoPopup(false)}
                className="px-6 py-2.5 rounded-xl gold-premium fx-neon text-[#04113a] font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer border-none shadow-md shrink-0 self-start sm:self-center"
              >
                Comenzar a explorar
              </button>
            </div>

          </div>
        </div>
      )}
      <ActivityModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
}

{ /* Actividad Modal: Sirve para mostrar detalles de una actividad */ }
function ActivityModal({
  activity,
  onClose,
}: {
  activity: any;
  onClose: () => void;
}) {
  if (!activity) return null;

  const isVideo = activity.type === "video";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#00135B]/80 px-4 py-6 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Cerrar modal"
      />

      <article className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-2xl shadow-black/30">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#00135B]/75 text-white backdrop-blur-md transition hover:bg-[#00135B]"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative min-h-[280px] bg-[#00135B]">
            {isVideo ? (
              <iframe
                src={activity.media}
                title={activity.title}
                className="h-full min-h-[320px] w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={activity.media}
                  alt={activity.title}
                  className="h-full min-h-[320px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00135B]/55 to-transparent" />
              </>
            )}

            {!isVideo && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5D8CE2] text-white shadow-xl">
                  <Play className="w-6 h-6" fill="currentColor" />
                </div>
              </div>
            )}
          </div>

          <div className="p-7 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#5D8CE2]">
              Actividad del voluntariado
            </p>

            <h3 className="mt-3 text-3xl font-black leading-tight text-[#00135B]">
              {activity.title}
            </h3>

            <p className="mt-5 text-base leading-8 text-slate-600">
              {activity.description}
            </p>

            <div className="mt-7 rounded-2xl border border-gray-200 bg-slate-50 p-4">
              <p className="text-sm font-bold leading-6 text-[#00135B]">
                Esta actividad puede variar según el país, proyecto y organización anfitriona.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 inline-flex rounded-2xl bg-[#5D8CE2] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#00135B]"
            >
              Entendido
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
