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
  ArrowRight
} from "lucide-react";

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
import { getMyProfile, createProfile, updateProfile, updateUser } from "../../services/profileService";
import type { StudentProfileResponse } from "../../services/profileService";

const EDUCATION_OPTIONS = [
  "Secundario / High School",
  "Pregrado / Undergraduate",
  "Posgrado / Graduate",
  "Doctorado / PhD",
  "Otro / Other"
];

const AREA_OPTIONS = [
  "STEM (Ciencia y Tecnología)",
  "Negocios y Finanzas",
  "Humanidades y Ciencias Sociales",
  "Artes y Diseño",
  "Ciencias de la Salud",
  "Leyes y Derecho",
  "Otro / Other"
];

const ENGLISH_OPTIONS = [
  "Ninguno / None",
  "Básico (A1/A2)",
  "Intermedio (B1/B2)",
  "Avanzado (C1/C2)",
  "Nativo / Native"
];


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
  required_profile_fields?: string[];
  custom_questions?: Array<{
    id: string;
    text: string;
    type: "short_text" | "long_text" | "single_choice";
    required?: boolean;
    options?: string[];
  }>;
  required_documents?: string[];
}

export default function OpportunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Auth & Profile states
  const { isAuthenticated, user, setUser } = useAuthStore();
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

  // Multi-step postulation states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const [applyError, setApplyError] = useState<string | null>(null);
  const [localProfileForm, setLocalProfileForm] = useState<any>({
    full_name: "",
    country: "",
    city: "",
    birth_date: "",
    phone: "",
    education_level: "Pregrado / Undergraduate",
    current_institution: "",
    area: "STEM (Ciencia y Tecnología)",
    english_level: "Intermedio (B1/B2)",
    cv_url: "",
    expected_graduation_date: "",
    general_motivation_letter: "",
    work_experience: [],
    volunteer_experience: [],
    interests: [],
    target_countries: [],
    target_program_types: []
  });

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
        console.error("Failed to fetch opportunity from backend. Falling back to static check.", err);
        // Fallback static load specifically for 'aiesec-voluntariado' to prevent blank view if backend is rebuilding
        if (slug === "aiesec-voluntariado") {
          setOpportunity({
            id: 4,
            title: "Voluntariado en AIESEC",
            description: "El voluntariado de AIESEC es una experiencia internacional de corta duración que permite a jóvenes participar en proyectos sociales en distintos países, con el objetivo de generar impacto positivo en comunidades mientras desarrollan habilidades personales y profesionales.\n\nMás allá del trabajo voluntario, AIESEC busca formar líderes globales. Durante el programa, los jóvenes fortalecen competencias como comunicación intercultural, trabajo en equipo, adaptabilidad y resolución de problemas en entornos reales.\n\nAdemás, el voluntariado incluye acompañamiento antes, durante y después de la experiencia, así como espacios de integración cultural que permiten al participante sumergirse en la realidad del país anfitrión.",
            type: "volunteering",
            organization: "AIESEC International",
            country: "Global",
            deadline: "2026-09-30",
            eligibility: "Jóvenes entre 18 y 30 años con ganas de generar impacto social.",
            benefits: "Hospedaje local, desarrollo de liderazgo y certificado internacional.",
            slots: 50,
            slug: "aiesec-voluntariado",
            organization_name: "AIESEC",
            status: "open",
            short_description: "Vive una experiencia internacional que transforma tu forma de ver el mundo.",
            activities: [
              "Enseñanza en comunidades 📚",
              "Proyectos sociales 🤝",
              "Campañas ambientales 🌱",
              "Actividades interculturales 🌍"
            ],
            requirements: [
              "Tener entre 18 y 30 años",
              "Interés en voluntariado internacional",
              "Nivel básico/intermedio de inglés",
              "Disponibilidad para viajar",
              "Pasaporte si el destino lo requiere",
              "Motivación y apertura cultural",
              "Membresía aproximada Bs. 2430"
            ],
            benefits_json: [
              "Experiencia internacional 🌍",
              "Desarrollo de liderazgo 🧠",
              "Red global de contactos 🤝",
              "Certificado internacional 📜",
              "Crecimiento personal 🌱"
            ],
            dates_info: "Convocatoria: Abierta durante el año | Salidas: Según proyecto, varias fechas disponibles",
            support_ai: [
              "Elegir el mejor voluntariado según el perfil del usuario",
              "Preparar la aplicación",
              "Redactar carta de motivación con IA"
            ],
            facebook_url: "https://www.facebook.com/AIESECglobal",
            instagram_url: "https://www.instagram.com/aiesecglobal/",
            youtube_url: "https://www.youtube.com/@aiesecglobal",
            video_url: "https://www.youtube.com/watch?v=7h43WCAVXdY",
            image_url: "/assets/images/aiesec_hero.jpg",
            is_demo: false
          });
          setShowVideoPopup(true);
        } else {
          setError("Oportunidad no encontrada. Por favor, regresa al listado.");
        }
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

    // Prefill localProfileForm with profile data if available
    setLocalProfileForm({
      full_name: user?.displayName || "",
      country: profile?.country || "",
      city: profile?.city || "",
      birth_date: profile?.birth_date || "",
      phone: profile?.phone || "",
      education_level: profile?.education_level || "Pregrado / Undergraduate",
      current_institution: profile?.current_institution || "",
      area: profile?.area || "STEM (Ciencia y Tecnología)",
      english_level: profile?.english_level || "Intermedio (B1/B2)",
      cv_url: profile?.cv_url || "",
      expected_graduation_date: profile?.expected_graduation_date || "",
      general_motivation_letter: profile?.general_motivation_letter || "",
      work_experience: profile?.work_experience || [],
      volunteer_experience: profile?.volunteer_experience || [],
      interests: profile?.interests || [],
      target_countries: profile?.target_countries || [],
      target_program_types: profile?.target_program_types || []
    });

    // Initialize custom questions answers and document uploads state
    const initialAnswersObj: Record<string, string> = {};
    if (opportunity.custom_questions) {
      opportunity.custom_questions.forEach((q) => {
        initialAnswersObj[q.id] = "";
      });
    }
    const initialDocs: Record<string, string> = {};
    if (opportunity.required_documents) {
      opportunity.required_documents.forEach((d) => {
        initialDocs[d] = "";
      });
    }
    setAnswers(initialAnswersObj);
    setUploadedDocs(initialDocs);
    setApplyStep(1);
    setApplyError(null);
    setShowApplyModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!opportunity) return;
    
    // Client-side validations
    if (opportunity.custom_questions) {
      const missingQs = opportunity.custom_questions
        .filter((q) => q.required && !answers[q.id]?.trim())
        .map((q) => q.text);
      if (missingQs.length > 0) {
        setApplyError(`Debes responder a las siguientes preguntas obligatorias: ${missingQs.join(", ")}`);
        return;
      }
    }

    if (opportunity.required_documents) {
      const missingDocs = opportunity.required_documents
        .filter((doc) => !uploadedDocs[doc]?.trim());
      if (missingDocs.length > 0) {
        setApplyError(`Falta subir los siguientes documentos obligatorios: ${missingDocs.map(d => d.toUpperCase()).join(", ")}`);
        return;
      }
    }

    setPostulating(true);
    setApplyError(null);
    try {
      const answersList = Object.entries(answers).map(([qid, ans]) => ({
        question_id: qid,
        answer: ans
      }));

      await axiosClient.post("/applications/", {
        program_id: opportunity.id,
        answers: answersList,
        uploaded_documents: uploadedDocs
      });

      setShowApplyModal(false);
      setShowPostulationModal(true);
    } catch (err: any) {
      console.error(err);
      setApplyError(err.response?.data?.detail || "Hubo un error al enviar tu postulación. Revisa los datos.");
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

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col justify-between overflow-x-hidden pt-20">
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
        
        {/* Tech Grid Background lines */}
        <div className="absolute inset-0 tech-grid opacity-35 pointer-events-none z-0"></div>

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

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSave}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all bg-white/5 cursor-pointer ${
                    savedPrograms.includes(opportunity.id)
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

            {/* Badge & Title */}
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F5C542] text-[#00135B] text-[10px] font-extrabold uppercase tracking-wider">
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
                className="px-8 py-3.5 rounded-xl bg-[#F5C542] hover:bg-[#ebd035] text-[#00135B] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
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
                    <h3 className="font-bold text-sm font-display text-[#F5C542]">Conoce la experiencia AIESEC</h3>
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
              className={`py-4 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
                activeTab === tab.id
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main details) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Descripción */}
            <div id="descripcion" className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6 text-left">
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
            <div id="beneficios" className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6 text-left">
              <span className="text-[10px] text-[#5D8CE2] uppercase font-extrabold tracking-wider">Beneficios</span>
              <h2 className="font-display font-bold text-2xl text-[#00135B] mt-1">Lo que ganarás con esta experiencia</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(opportunity.benefits_json || [
                  "Experiencia internacional 🌍",
                  "Desarrollo de liderazgo 🧠",
                  "Red global de contactos 🤝",
                  "Certificado internacional 📜",
                  "Crecimiento personal 🌱"
                ]).map((ben, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-gray-200/50 rounded-2xl flex flex-col justify-between space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#5D8CE2]/10 border border-[#5D8CE2]/20 flex items-center justify-center text-[#5D8CE2] font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <span className="font-bold text-xs text-[#00135B] leading-snug">{ben}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actividades */}
            <div id="actividades" className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6 text-left">
              <span className="text-[10px] text-[#5D8CE2] uppercase font-extrabold tracking-wider">Actividades</span>
              <h2 className="font-display font-bold text-2xl text-[#00135B] mt-1">¿Qué harás?</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(opportunity.activities || [
                  "Enseñanza en comunidades 📚",
                  "Proyectos sociales 🤝",
                  "Campañas ambientales 🌱",
                  "Actividades interculturales 🌍"
                ]).map((act, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-gray-200/50 rounded-2xl flex flex-col justify-between space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F5C542]/10 border border-[#F5C542]/30 flex items-center justify-center text-[#00135B] font-bold text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <span className="font-bold text-xs text-slate-700 leading-snug">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requisitos */}
            <div id="requisitos" className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6 text-left">
              <span className="text-[10px] text-[#5D8CE2] uppercase font-extrabold tracking-wider">Requisitos</span>
              <h2 className="font-display font-bold text-2xl text-[#00135B] mt-1">Lo que necesitas para participar</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(opportunity.requirements || [
                  "Tener entre 18 y 30 años",
                  "Interés en voluntariado internacional",
                  "Nivel básico/intermedio de inglés",
                  "Disponibilidad para viajar"
                ]).map((req, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonios */}
            <div id="testimonios" className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6 text-left">
              <span className="text-[10px] text-[#5D8CE2] uppercase font-extrabold tracking-wider">Testimonios</span>
              <h2 className="font-display font-bold text-2xl text-[#00135B] mt-1">Historias de voluntarios</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Video Card 1 */}
                <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400" 
                      alt="AIESEC volunteer story 1" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <button className="w-10 h-10 rounded-full bg-[#F5C542] hover:scale-105 transition-all text-[#00135B] flex items-center justify-center shadow-lg cursor-pointer">
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </button>
                  </div>
                  <div className="p-4 text-left space-y-1">
                    <h4 className="font-bold text-xs text-[#00135B]">Experiencias AIESEC alrededor del mundo</h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Conoce historias reales de jóvenes que participaron en voluntariados internacionales y vivieron una experiencia de crecimiento cultural.
                    </p>
                  </div>
                </div>

                {/* Video Card 2 */}
                <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400" 
                      alt="AIESEC volunteer story 2" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <button className="w-10 h-10 rounded-full bg-[#F5C542] hover:scale-105 transition-all text-[#00135B] flex items-center justify-center shadow-lg cursor-pointer">
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </button>
                  </div>
                  <div className="p-4 text-left space-y-1">
                    <h4 className="font-bold text-xs text-[#00135B]">Voluntariado internacional con impacto</h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Mira cómo los participantes desarrollan liderazgo, trabajan con comunidades y se adaptan a nuevas culturas durante su experiencia.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column (Sidebar details) */}
          <div className="space-y-6">
            
            {/* Lo que necesitas */}
            <div className="bg-[#00135B] text-white p-6 rounded-3xl space-y-4 shadow-sm text-left">
              <h3 className="font-bold text-sm text-[#F5C542] uppercase tracking-wider">Lo que necesitas</h3>
              
              <ul className="space-y-3.5 text-xs text-slate-200 font-medium">
                {(opportunity.requirements || [
                  "Tener entre 18 y 30 años",
                  "Interés en voluntariado internacional",
                  "Nivel básico/intermedio de inglés",
                  "Disponibilidad para viajar"
                ]).map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#F5C542] shrink-0 mt-0.5 stroke-[3]" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

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
                className="w-full mt-4 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#ebd035] text-[#00135B] font-extrabold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md"
              >
                <span>Preparar postulación</span>
                <ArrowRight className="w-3 h-3 text-[#00135B] stroke-[3]" />
              </button>
            </div>

            {/* Organización */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4 text-left">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Organización</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center font-extrabold text-[#00135B]">
                  {opportunity.organization_name?.substring(0, 3).toUpperCase() || "ORG"}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#00135B]">{opportunity.organization}</h4>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Socio Oficial</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
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

            {/* ¿Por qué ser voluntario? */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4 text-left">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">¿Por qué ser voluntario?</h3>
              
              <ul className="space-y-3 text-xs font-semibold text-[#00135B]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#5D8CE2]" />
                  <span>Contribuyes a causas reales</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#5D8CE2]" />
                  <span>Desarrollas habilidades blandas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#5D8CE2]" />
                  <span>Fortaleces tu CV y perfil</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#5D8CE2]" />
                  <span>Conoces nuevas realidades</span>
                </li>
              </ul>
            </div>

          </div>

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



      {/* MULTI-STEP POSTULATION FORM MODAL */}
      {showApplyModal && opportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl relative space-y-6 text-left animate-scaleUp max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-[10px] text-[#5D8CE2] uppercase font-extrabold tracking-wider">Formulario de Aplicación</span>
              <h3 className="font-display font-extrabold text-xl text-[#00135B] mt-1">
                Postular a {opportunity.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Llene los requisitos específicos de esta oportunidad.</p>
            </div>

            {/* Stepper Indicators */}
            {(() => {
              const steps: string[] = ["Perfil EDULAB"];
              if (opportunity.custom_questions && opportunity.custom_questions.length > 0) steps.push("Preguntas");
              if (opportunity.required_documents && opportunity.required_documents.length > 0) steps.push("Documentos");
              
              const currentStepName = steps[applyStep - 1];

              const validateAndNext = async () => {
                setApplyError(null);
                if (currentStepName === "Perfil EDULAB") {
                  // Standard validation for required fields in the profile schema
                  if (!localProfileForm.full_name?.trim()) { setApplyError("El nombre completo es requerido."); return; }
                  if (!localProfileForm.country?.trim()) { setApplyError("El país es requerido."); return; }
                  if (!localProfileForm.city?.trim()) { setApplyError("La ciudad es requerida."); return; }
                  if (!localProfileForm.phone?.trim()) { setApplyError("El teléfono es requerido."); return; }
                  if (!localProfileForm.birth_date) { setApplyError("La fecha de nacimiento es requerida."); return; }
                  if (!localProfileForm.education_level?.trim()) { setApplyError("El nivel de educación es requerido."); return; }
                  if (!localProfileForm.area?.trim()) { setApplyError("El área o carrera es requerida."); return; }
                  if (!localProfileForm.english_level?.trim()) { setApplyError("El nivel de inglés es requerido."); return; }

                  // Dynamic check for custom profile fields requested by opportunity
                  const required = opportunity.required_profile_fields || [];
                  const missing: string[] = [];
                  required.forEach((field: string) => {
                    switch (field) {
                      case "university":
                      case "current_institution":
                        if (!localProfileForm.current_institution?.trim()) missing.push("Universidad / Institución");
                        break;
                      case "cv":
                      case "cv_url":
                        if (!localProfileForm.cv_url?.trim()) missing.push("Enlace a tu CV");
                        break;
                      case "expected_graduation_date":
                      case "graduation_date":
                        if (!localProfileForm.expected_graduation_date) missing.push("Fecha Estimada de Graduación");
                        break;
                      case "general_motivation_letter":
                      case "motivation_letter":
                        if (!localProfileForm.general_motivation_letter?.trim()) missing.push("Carta de Motivación General");
                        break;
                    }
                  });

                  if (missing.length > 0) {
                    setApplyError(`Falta completar los campos requeridos por la organización: ${missing.join(", ")}`);
                    return;
                  }

                  // Save profile to backend
                  setPostulating(true);
                  try {
                    let updatedProfile;
                    const cleanForm = {
                      country: localProfileForm.country,
                      city: localProfileForm.city,
                      birth_date: localProfileForm.birth_date,
                      phone: localProfileForm.phone,
                      education_level: localProfileForm.education_level,
                      current_institution: localProfileForm.current_institution || null,
                      area: localProfileForm.area,
                      english_level: localProfileForm.english_level,
                      cv_url: localProfileForm.cv_url || null,
                      expected_graduation_date: localProfileForm.expected_graduation_date || null,
                      general_motivation_letter: localProfileForm.general_motivation_letter || null
                    };

                    if (profile) {
                      updatedProfile = await updateProfile(cleanForm);
                    } else {
                      updatedProfile = await createProfile({
                        ...cleanForm,
                        interests: ["Voluntariados"],
                        target_countries: ["Latinoamérica"],
                        target_program_types: ["volunteering"],
                        other_languages: [],
                        work_experience: [],
                        volunteer_experience: [],
                        linkedin_url: null,
                        portfolio_url: null,
                        bio: null
                      });
                    }
                    
                    // Update user's name if changed
                    if (localProfileForm.full_name && localProfileForm.full_name !== user?.displayName) {
                      const updatedUser = await updateUser({ full_name: localProfileForm.full_name });
                      if (user) {
                        setUser({ ...user, displayName: updatedUser.full_name });
                      }
                    }

                    setProfile(updatedProfile);
                    
                    if (steps.length > 1) {
                      setApplyStep(prev => prev + 1);
                    } else {
                      await handleFinalSubmit();
                    }
                  } catch (err: any) {
                    console.error("Error saving profile inside modal:", err);
                    setApplyError(err.response?.data?.detail || "Hubo un error al guardar tu perfil. Revisa los datos.");
                  } finally {
                    setPostulating(false);
                  }
                } else if (currentStepName === "Preguntas") {
                  if (opportunity.custom_questions) {
                    const missing = opportunity.custom_questions
                      .filter(q => q.required && !answers[q.id]?.trim());
                    if (missing.length > 0) {
                      setApplyError(`Falta responder las preguntas marcadas con asterisco.`);
                      return;
                    }
                  }
                  if (steps.includes("Documentos")) {
                    setApplyStep(prev => prev + 1);
                  } else {
                    await handleFinalSubmit();
                  }
                } else if (currentStepName === "Documentos") {
                  if (opportunity.required_documents) {
                    const missing = opportunity.required_documents
                      .filter(d => !uploadedDocs[d]?.trim());
                    if (missing.length > 0) {
                      setApplyError(`Debes ingresar la URL de todos los documentos solicitados.`);
                      return;
                    }
                  }
                  await handleFinalSubmit();
                }
              };

              return (
                <div className="space-y-6">
                  {/* Visual Stepper */}
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                    {steps.map((st, idx) => (
                      <div key={st} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          applyStep === idx + 1 
                            ? "bg-[#00135B] text-white" 
                            : applyStep > idx + 1 
                              ? "bg-emerald-500 text-white" 
                              : "bg-slate-100 text-slate-400"
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-xs font-bold ${
                          applyStep === idx + 1 ? "text-[#00135B]" : "text-slate-400"
                        }`}>
                          {st}
                        </span>
                        {idx < steps.length - 1 && <span className="text-slate-300 text-xs">/</span>}
                      </div>
                    ))}
                  </div>

                  {/* Active Step Content */}
                  {currentStepName === "Perfil EDULAB" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-gray-150 space-y-4">
                        <h4 className="font-bold text-xs text-[#00135B] uppercase tracking-wider">Completa / Edita tus Datos de Perfil</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-left">
                          
                          {/* Full Name */}
                          <div className="md:col-span-2 space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Nombre Completo <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={localProfileForm.full_name}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, full_name: e.target.value })}
                              placeholder="Ej. Juan Pérez"
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            />
                          </div>

                          {/* Country */}
                          <div className="space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              País <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={localProfileForm.country}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, country: e.target.value })}
                              placeholder="Ej. Costa Rica"
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            />
                          </div>

                          {/* City */}
                          <div className="space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Ciudad <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={localProfileForm.city}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, city: e.target.value })}
                              placeholder="Ej. San José"
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            />
                          </div>

                          {/* Phone */}
                          <div className="space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Teléfono <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={localProfileForm.phone}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, phone: e.target.value })}
                              placeholder="Ej. +506 8888-8888"
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            />
                          </div>

                          {/* Birth Date */}
                          <div className="space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Fecha de Nacimiento <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={localProfileForm.birth_date}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, birth_date: e.target.value })}
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            />
                          </div>

                          {/* Education Level */}
                          <div className="space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Nivel de Educación <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={localProfileForm.education_level}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, education_level: e.target.value })}
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            >
                              {EDUCATION_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>

                          {/* Area / Carrera */}
                          <div className="space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Carrera / Área <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={localProfileForm.area}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, area: e.target.value })}
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            >
                              {AREA_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>

                          {/* Current Institution */}
                          <div className="space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Universidad / Institución {opportunity.required_profile_fields?.includes("university") || opportunity.required_profile_fields?.includes("current_institution") ? <span className="text-rose-500">*</span> : ""}
                            </label>
                            <input
                              type="text"
                              value={localProfileForm.current_institution}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, current_institution: e.target.value })}
                              placeholder="Ej. Universidad de Costa Rica"
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            />
                          </div>

                          {/* English Level */}
                          <div className="space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Nivel de Inglés <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={localProfileForm.english_level}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, english_level: e.target.value })}
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            >
                              {ENGLISH_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>

                          {/* CV URL */}
                          <div className="md:col-span-2 space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Enlace a tu CV (Google Drive/Dropbox) {opportunity.required_profile_fields?.includes("cv") || opportunity.required_profile_fields?.includes("cv_url") ? <span className="text-rose-500">*</span> : ""}
                            </label>
                            <input
                              type="url"
                              value={localProfileForm.cv_url}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, cv_url: e.target.value })}
                              placeholder="Ej. https://drive.google.com/file/d/..."
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            />
                          </div>

                          {/* Graduation Date */}
                          <div className="md:col-span-2 space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Fecha Estimada de Graduación {opportunity.required_profile_fields?.includes("expected_graduation_date") || opportunity.required_profile_fields?.includes("graduation_date") ? <span className="text-rose-500">*</span> : ""}
                            </label>
                            <input
                              type="date"
                              value={localProfileForm.expected_graduation_date}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, expected_graduation_date: e.target.value })}
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            />
                          </div>

                          {/* General Motivation Letter */}
                          <div className="md:col-span-2 space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Carta de Motivación General {opportunity.required_profile_fields?.includes("general_motivation_letter") || opportunity.required_profile_fields?.includes("motivation_letter") ? <span className="text-rose-500">*</span> : ""}
                            </label>
                            <textarea
                              rows={3}
                              value={localProfileForm.general_motivation_letter}
                              onChange={(e) => setLocalProfileForm({ ...localProfileForm, general_motivation_letter: e.target.value })}
                              placeholder="Escribe tu carta de motivación..."
                              className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all resize-none"
                            />
                          </div>

                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        * Nota: Los datos ingresados se guardarán automáticamente en tu **Perfil EDULAB** para futuras aplicaciones.
                      </p>
                    </div>
                  )}

                  {currentStepName === "Preguntas" && (
                    <div className="space-y-4 animate-fadeIn text-left">
                      {opportunity.custom_questions?.map((q) => (
                        <div key={q.id} className="space-y-2">
                          <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider flex items-center gap-1">
                            <span>{q.text}</span>
                            {q.required && <span className="text-rose-500">*</span>}
                          </label>
                          
                          {q.type === "long_text" ? (
                            <textarea
                              rows={3}
                              value={answers[q.id] || ""}
                              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                              placeholder="Escribe tu respuesta aquí..."
                              className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all resize-none"
                            />
                          ) : q.type === "single_choice" ? (
                            <select
                              value={answers[q.id] || ""}
                              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                              className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all bg-white"
                            >
                              <option value="">Selecciona una opción...</option>
                              {q.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={answers[q.id] || ""}
                              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                              placeholder="Escribe tu respuesta corta..."
                              className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStepName === "Documentos" && (
                    <div className="space-y-4 animate-fadeIn text-left">
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-[#00135B]">
                        💡 Sube tus documentos a una nube pública (Google Drive, OneDrive, Dropbox, etc.) y pega los enlaces a continuación. Asegúrate de dar permisos de lectura.
                      </div>
                      {opportunity.required_documents?.map((d) => (
                        <div key={d} className="space-y-2">
                          <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider flex items-center gap-1">
                            <span>{d}</span>
                            <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="url"
                            value={uploadedDocs[d] || ""}
                            onChange={(e) => setUploadedDocs({ ...uploadedDocs, [d]: e.target.value })}
                            placeholder="Ej. https://drive.google.com/file/d/..."
                            className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Error display */}
                  {applyError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3.5 rounded-xl text-xs font-semibold">
                      {applyError}
                    </div>
                  )}

                  {/* Buttons Row */}
                  <div className="border-t border-gray-150 pt-5 flex justify-between gap-4">
                    <button
                      type="button"
                      disabled={applyStep === 1}
                      onClick={() => setApplyStep(prev => prev - 1)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      Anterior
                    </button>

                    <button
                      type="button"
                      disabled={postulating}
                      onClick={validateAndNext}
                      className="bg-[#00135B] hover:bg-[#0d288c] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      {postulating ? (
                        <>
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                          <span>Enviando...</span>
                        </>
                      ) : applyStep === steps.length ? (
                        <span>Enviar Postulación</span>
                      ) : (
                        <span>Siguiente</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

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
                ¡Postulación Recibida!
              </h3>
              
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Tu postulación al **{opportunity.title}** ha sido registrada con éxito en EDULAB con estado <span className="font-extrabold text-emerald-600">PENDING</span>.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-emerald-700 font-semibold leading-relaxed">
                El equipo del programa y de la organización revisarán tus respuestas y tu Perfil EDULAB. Te enviaremos notificaciones internas y por correo cuando cambie el estado de tu postulación.
              </p>
            </div>

            {/* Actions Button Group */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setShowPostulationModal(false);
                  navigate("/dashboard");
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 text-white font-extrabold text-xs tracking-wider transition-all duration-200 cursor-pointer active:scale-95 text-center border-none shadow-sm"
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
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F5C542] text-[#00135B] text-[8px] font-extrabold uppercase tracking-wider">
                  Impacto Global
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  {opportunity.title} — Presentación Oficial
                </h3>
                <p className="text-xs text-slate-400">Vive una experiencia internacional que transforma tu forma de ver el mundo.</p>
              </div>
              <button
                onClick={() => setShowVideoPopup(false)}
                className="px-6 py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#ebd035] text-[#00135B] font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer border-none shadow-md shrink-0 self-start sm:self-center"
              >
                Comenzar a explorar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
