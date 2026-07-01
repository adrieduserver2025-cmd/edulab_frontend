import { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  BookOpen,
  Users,
  Leaf,
  Compass,
  Network
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import aiesecBg from "../../assets/iaesec/fondo3.png";
import aiesecLogo from "../../assets/iaesec/images.png";
import fulbrightBg from "../../assets/fulbright/662bb8d0a1a92_.png";
import fulbrightLogo from "../../assets/fulbright/images (1).png";
import fulbrightPhoto from "../../assets/fulbright/images (2).jpeg";
import { SPANISH_SPEAKING_COUNTRIES } from "../../constants/spanishCountries";





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

// Data structures for interactive accordions
const BENEFIT_ITEMS = [
  {
    emoji: "🌍",
    title: "Experiencia internacional",
    desc: "Vive una experiencia transformadora en otro país, sumérgete en una nueva cultura y amplía tu perspectiva del mundo. Trabaja junto a jóvenes de más de 120 países.",
    highlights: [
      "Intercambio cultural real",
      "Vivencia en el extranjero",
      "Red internacional activa"
    ],
    gradient: "from-[#3B82F6] to-[#1D4ED8]",
    openBg: "bg-blue-50/70 border-blue-200/60 shadow-blue-100/50",
    textColor: "text-blue-600",
    icon: Globe,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
    imageCaption: "Voluntarios en el mundo"
  },
  {
    emoji: "💖",
    title: "Desarrollo de liderazgo",
    desc: "Desarrolla habilidades blandas críticas como la inteligencia emocional, resolución de conflictos y adaptabilidad mientras lideras proyectos con impacto social.",
    highlights: [
      "Toma de decisiones",
      "Trabajo bajo presión",
      "Empatía y resiliencia"
    ],
    gradient: "from-[#F43F5E] to-[#BE123C]",
    openBg: "bg-rose-50/70 border-rose-200/60 shadow-rose-100/50",
    textColor: "text-rose-600",
    icon: Users,
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
    imageCaption: "Liderazgo en acción"
  },
  {
    emoji: "🤝",
    title: "Red global de contactos",
    desc: "Conéctate con una comunidad global de jóvenes líderes, profesionales y organizaciones que comparten tu visión de cambiar el mundo y generar un impacto duradero.",
    highlights: [
      "Contactos profesionales",
      "Eventos y networking",
      "Mentoría personalizada"
    ],
    gradient: "from-[#F59E0B] to-[#B45309]",
    openBg: "bg-amber-50/70 border-amber-200/60 shadow-amber-100/50",
    textColor: "text-amber-600",
    icon: Network,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
    imageCaption: "Red global activa"
  },
  {
    emoji: "📜",
    title: "Certificado internacional",
    desc: "Recibe una certificación oficial emitida por EDULAB y la organización anfitrióna al culminar tu programa, que validará tu experiencia y competencias adquiridas.",
    highlights: [
      "Acreditación formal",
      "Mejora para tu CV",
      "Reconocimiento global"
    ],
    gradient: "from-[#10B981] to-[#047857]",
    openBg: "bg-emerald-50/70 border-emerald-200/60 shadow-emerald-100/50",
    textColor: "text-emerald-600",
    icon: Award,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    imageCaption: "Certificado reconocido"
  }
];

const ACTIVITY_ITEMS = [
  {
    emoji: "📚",
    title: "Enseñanza en comunidades",
    desc: "Diseña e imparte talleres educativos para niños y jóvenes en comunidades vulnerables, promoviendo el aprendizaje continuo y el desarrollo de habilidades locales.",
    highlights: [
      "Planificación educativa",
      "Taller y dinámicas",
      "Impacto educativo directo"
    ],
    gradient: "from-[#8B5CF6] to-[#6D28D9]",
    openBg: "bg-violet-50/70 border-violet-200/60 shadow-violet-100/50",
    textColor: "text-violet-600",
    icon: BookOpen,
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800",
    imageCaption: "Educación comunitaria"
  },
  {
    emoji: "🤝",
    title: "Proyectos sociales",
    desc: "Colabora en iniciativas de desarrollo comunitario, empoderamiento social y estructuración de proyectos sostenibles que resuelven problemas del entorno real.",
    highlights: [
      "Gestión de proyectos",
      "Trabajo comunitario",
      "Soluciones de impacto social"
    ],
    gradient: "from-[#F97316] to-[#C2410C]",
    openBg: "bg-orange-50/70 border-orange-200/60 shadow-orange-100/50",
    textColor: "text-orange-600",
    icon: Users,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    imageCaption: "Proyectos con impacto"
  },
  {
    emoji: "🌱",
    title: "Campañas ambientales",
    desc: "Participa en jornadas de reforestación, educación ambiental, reciclaje y concientización ecológica para preservar los ecosistemas locales y promover el desarrollo verde.",
    highlights: [
      "Educación ecológica",
      "Acción ambiental directa",
      "Sostenibilidad comunitaria"
    ],
    gradient: "from-[#34D399] to-[#059669]",
    openBg: "bg-teal-50/70 border-teal-200/60 shadow-teal-100/50",
    textColor: "text-teal-600",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
    imageCaption: "Cuidado del planeta"
  },
  {
    emoji: "🌍",
    title: "Actividades interculturales",
    desc: "Comparte tus costumbres, gastronomía y cultura con voluntarios de otros países y familias anfitriónas, creando lazos de amistad e intercambio duraderos.",
    highlights: [
      "Intercambio cultural",
      "Presentaciones culinarias",
      "Integración global"
    ],
    gradient: "from-[#06B6D4] to-[#0E7490]",
    openBg: "bg-cyan-50/70 border-cyan-200/60 shadow-cyan-100/50",
    textColor: "text-cyan-600",
    icon: Compass,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    imageCaption: "Diversidad cultural"
  }
];


interface InteractiveAccordionCardProps {
  item: typeof BENEFIT_ITEMS[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function InteractiveAccordionCard({ item, index, isOpen, onToggle }: InteractiveAccordionCardProps) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      }}
    >
      <motion.div
        animate={{
          y: isOpen ? 0 : [0, -6, 0, -4, 0],
          rotate: isOpen ? 0 : [0, 0.6, 0, -0.6, 0],
        }}
        transition={{
          y: {
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
            delay: index * 0.4,
          },
          rotate: {
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
            delay: index * 0.4,
          }
        }}
        whileHover={{
          y: -14,
          scale: 1.02,
          boxShadow: "0 20px 48px -8px rgba(0,0,0,0.18)",
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none bg-white ${isOpen
            ? `${item.openBg} shadow-md border-opacity-100`
            : "border-gray-200/70 shadow-sm hover:border-gray-300"
          }`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md shadow-black/10 shrink-0`}>
              <Icon className="w-5.5 h-5.5 stroke-[2]" />
            </div>

            <div>
              <h3 className="font-display font-bold text-sm text-[#00135B] flex items-center gap-1.5 leading-snug">
                {item.title} <span className="text-base">{item.emoji}</span>
              </h3>
            </div>
          </div>

          <div className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-all duration-300 ${isOpen ? "rotate-180 bg-[#00135B] text-white" : "hover:bg-slate-200"
            }`}>
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.25, delay: 0.05 }
                }
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.15 }
                }
              }}
              style={{ overflow: "hidden" }}
            >
              <div className="pt-4 pl-15 pr-2 space-y-4">
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {item.desc}
                </p>

                <div className="flex flex-col gap-2 pt-1">
                  {item.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.gradient}`} />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}


export default function OpportunityDetailPage() {

  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const birthDateRef = useRef<HTMLInputElement>(null);
  const gradDateRef = useRef<HTMLInputElement>(null);

  const formatDateForInput = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "";
    const trimmed = dateStr.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    
    // Try DD/MM/YYYY
    const parts = trimmed.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (day.length <= 2 && month.length <= 2 && year.length === 4) {
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }
    return trimmed;
  };

  // Auth & Profile states
  const { isAuthenticated, user, setUser } = useAuthStore();
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

  // Detail States
  const [opportunity, setOpportunity] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI Interactivity States
  const [activeTab, setActiveTab] = useState("descripcion");
  const [openBenefitIndex, setOpenBenefitIndex] = useState<number | null>(0);
  const [openActivityIndex, setOpenActivityIndex] = useState<number | null>(0);
  const [savedPrograms, setSavedPrograms] = useState<number[]>(() => {
    const saved = localStorage.getItem("edulab_saved_programs");
    return saved ? JSON.parse(saved) : [];
  });

  // Video embed inline toggle
  const [playVideo, setPlayVideo] = useState(false);
  const [playTestimonial1, setPlayTestimonial1] = useState(false);
  const [playTestimonial2, setPlayTestimonial2] = useState(false);

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
        } else if (slug === "fulbright-beca") {
          setOpportunity({
            id: 5,
            title: "Beca Fulbright",
            description: "Fulbright es uno de los programas de becas más prestigiosos del mundo, financiado por el gobierno de los Estados Unidos. Ofrece becas completas para estudios de posgrado, investigación académica y actividades educativas en universidades de EE.UU., formando líderes con visión global e impacto social.\n\nLa Beca Fulbright cubre matrícula, gastos de subsistencia, seguro médico, viaje de ida y vuelta, y apoyo para el aprendizaje del idioma. Es la oportunidad perfecta para construir una red profesional internacional y acceder a las mejores universidades del mundo.\n\nCada año, más de 8,000 personas de 160 países participan en el programa, que tiene más de 70 años de historia transformando vidas académicas y profesionales.",
            type: "scholarship",
            organization: "U.S. Department of State",
            country: "Estados Unidos",
            deadline: "2026-10-15",
            eligibility: "Graduados universitarios, profesionales y académicos con excelente trayectoria.",
            benefits: "Beca 100% completa: matrícula, alojamiento, manutención, seguro médico y pasajes.",
            slots: 120,
            slug: "fulbright-beca",
            organization_name: "Comisión Fulbright",
            status: "open",
            short_description: "Fulbright ofrece becas completas para estudios de posgrado, investigación o actividades académicas en universidades de Estados Unidos, formando líderes con visión global e impacto social.",
            activities: [
              "Maestría y doctorado en EE.UU. 🎓",
              "Investigación académica 🔬",
              "Intercambio profesional 💼",
              "Conferencias y networking 🌐"
            ],
            requirements: [
              "Título universitario o equivalente",
              "Nivel avanzado de inglés (TOEFL/IELTS)",
              "Carta de motivación sólida",
              "Cartas de recomendación académica",
              "Propuesta de investigación detallada",
              "Ciudadanía o residencia permanente en el país participante"
            ],
            benefits_json: [
              "Beca 100% completa 💰",
              "Red global Fulbright Alumni 🤝",
              "Acceso a top universidades EE.UU. 🏛️",
              "Certificado Fulbright Scholar 📜",
              "Desarrollo académico y profesional 🚀"
            ],
            dates_info: "Convocatoria: Julio - Octubre | Inicio del programa: Agosto del año siguiente",
            support_ai: [
              "Redactar la propuesta de investigación",
              "Preparar la carta de motivación",
              "Optimizar el perfil de aplicación con IA"
            ],
            facebook_url: "https://www.facebook.com/FulbrightExchanges",
            instagram_url: "https://www.instagram.com/fulbrightexchange/",
            youtube_url: "https://www.youtube.com/@FulbrightExchanges",
            video_url: "https://www.youtube.com/watch?v=iS3qREybbeI",
            image_url: "/assets/fulbright/662bb8d0a1a92_.png",
            is_demo: false
          });
        } else {
          setError("Oportunidad no encontrada. Por favor, regresa al listado.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunity();
  }, [slug]);

  // Load student profile and applications for completeness and check-applied checks
  useEffect(() => {
    if (isAuthenticated) {
      getMyProfile()
        .then((data) => setProfile(data))
        .catch((err) => console.error("Could not fetch profile:", err));

      axiosClient.get("/applications/")
        .then((res) => setApplications(res.data))
        .catch((err) => console.error("Could not fetch applications:", err));
    } else {
      setProfile(null);
      setApplications([]);
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

    // Securely register the started draft in the backend database
    try {
      await axiosClient.post("/applications/", {
        program_id: opportunity.id,
        status: "started"
      });
      // Sync the profile and applications state in case the backend auto-created a stub profile/application draft
      const [updatedProfile, updatedAppsRes] = await Promise.all([
        getMyProfile(),
        axiosClient.get("/applications/")
      ]);
      setProfile(updatedProfile);
      setApplications(updatedAppsRes.data);
    } catch (draftErr) {
      console.warn("Could not save initial draft application in backend:", draftErr);
    }
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
        status: "pending",
        answers: answersList,
        uploaded_documents: uploadedDocs
      });

      // Refresh applications list
      const appsRes = await axiosClient.get("/applications/");
      setApplications(appsRes.data);

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

  const existingApp = opportunity ? applications.find((a) => a.program_id === opportunity.id) : null;

  const isScholarship = opportunity?.type === "scholarship";
  const isBeca = isScholarship; // alias
  // Background assets based on type
  const heroBg = isScholarship ? fulbrightBg : aiesecBg;
  const orgLogo = isScholarship ? fulbrightLogo : aiesecLogo;
  // const orgPhoto = isScholarship ? fulbrightPhoto : null;
  // Scholarship video
  const scholarshipVideoUrl = "https://www.youtube.com/watch?v=iS3qREybbeI";

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

      {/* Hero Section — Dinamic theme: blue for volunteering, golden for scholarship */}
      <section
        className="relative w-full overflow-hidden py-16 px-6 md:px-12 z-10 flex flex-col items-center"
        style={isBeca
          ? { background: "linear-gradient(135deg, #1a0d00 0%, #2d1800 30%, #3d2200 60%, #5c3400 100%)" }
          : { background: "linear-gradient(135deg, #00052a 0%, #000e45 40%, #001566 70%, #0d288c 100%)" }
        }
      >
        {/* Background photo wrapper to contain blurs and prevent page overflow */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          {/* Background photo with low opacity */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url(${heroBg})`, opacity: isBeca ? 0.45 : 0.22 }}
          />
          {/* Overlay gradient tint */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={isBeca
              ? { background: "linear-gradient(135deg, rgba(90,45,0,0.85) 0%, rgba(120,60,0,0.70) 50%, rgba(60,30,0,0.80) 100%)" }
              : { background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(93,140,226,0.18) 0%, transparent 70%)" }
            }
          />
          {/* Tech grid */}
          <div className="absolute inset-0 tech-grid opacity-15 pointer-events-none z-0"></div>

          {/* Scholarship golden shimmer accents */}
          {isBeca && (
            <>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-20" style={{ background: "radial-gradient(circle, #F5C542 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-15" style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />
            </>
          )}
        </div>

        <div className="max-w-7xl w-full flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10 text-left">

          {/* Left Block Details */}
          <div className="space-y-6 flex-1">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/programs")}
                className="flex items-center gap-1.5 text-xs font-bold transition-colors bg-transparent border-none cursor-pointer"
                style={{ color: isBeca ? "rgba(245,197,66,0.85)" : "rgba(203,213,225,0.85)" }}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isBeca ? "Volver a becas" : "Volver a voluntariados"}</span>
              </button>

              <div className="flex items-center gap-2">
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

            {/* Badge & Title */}
            <div className="space-y-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                style={isBeca
                  ? { background: "rgba(255,255,255,0.15)", color: "#F5C542", border: "1px solid rgba(245,197,66,0.4)" }
                  : { background: "#F5C542", color: "#00135B" }
                }
              >
                {isBeca ? "🎓 Beca Internacional" : (opportunity.status === "open" ? "Convocatoria Abierta" : "Cerrado")}
              </span>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight text-white">
                {isBeca
                  ? <>{opportunity.title.split(" ")[0]} <span style={{ color: "#F5C542" }}>{opportunity.title.split(" ").slice(1).join(" ")}</span></>
                  : opportunity.title
                }
              </h1>
              <p className="text-sm md:text-base font-medium max-w-2xl" style={{ color: isBeca ? "rgba(253,230,138,0.9)" : "rgba(203,213,225,0.9)" }}>
                {opportunity.short_description}
              </p>
            </div>

            {/* Horizontal Specs Bar */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-[11px] border-t"
              style={{ color: isBeca ? "rgba(253,230,138,0.85)" : "rgba(203,213,225,0.85)", borderColor: isBeca ? "rgba(245,197,66,0.2)" : "rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" style={{ color: isBeca ? "#F5C542" : "#F5C542" }} />
                <span className="font-bold">Internacional ({opportunity.country})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" style={{ color: isBeca ? "#F5C542" : "#F5C542" }} />
                <span className="font-bold">{isBeca ? "Presencial / Remoto" : "Presencial"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: isBeca ? "#F5C542" : "#F5C542" }} />
                <span className="font-bold">{isBeca ? "1-2 años" : "Corta duración"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" style={{ color: isBeca ? "#F5C542" : "#F5C542" }} />
                <span className="font-bold">{isBeca ? "Inglés requerido" : "Español / Inglés"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" style={{ color: isBeca ? "#F5C542" : "#F5C542" }} />
                <span className="font-bold">{isBeca ? "Graduados / Profesionales" : "18 - 30 años"}</span>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-4 pt-4">
              {!existingApp || existingApp.status === "started" ? (
                <button
                  onClick={handleStartPostulation}
                  disabled={postulating}
                  className="px-8 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                  style={isBeca
                    ? { background: "#F5C542", color: "#1a0d00" }
                    : { background: "#F5C542", color: "#00135B" }
                  }
                >
                  {postulating ? "Procesando..." : (existingApp?.status === "started" ? "Continuar postulación" : "Iniciar mi postulación")}
                </button>
              ) : (
                <button
                  disabled
                  className={`px-8 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider border cursor-not-allowed select-none transition-all shadow-sm ${existingApp.status === "pending"
                      ? "bg-amber-50 border-amber-250 text-amber-700"
                      : existingApp.status === "in_review"
                        ? "bg-blue-50 border-blue-250 text-blue-700"
                        : "bg-emerald-50 border-emerald-250 text-emerald-700"
                    }`}
                >
                  {existingApp.status === "pending" && "Postulado - Esperando revisión"}
                  {existingApp.status === "in_review" && "Postulación en revisión"}
                  {existingApp.status === "accepted" && "Postulación Aceptada 🎉"}
                </button>
              )}

              <button
                onClick={() => scrollToSection("requisitos")}
                className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all bg-transparent cursor-pointer"
                style={isBeca
                  ? { border: "1px solid rgba(245,197,66,0.45)", color: "rgba(253,230,138,0.9)" }
                  : { border: "1px solid rgba(255,255,255,0.3)", color: "white" }
                }
              >
                Ver requisitos
              </button>
            </div>
          </div>

          {/* Right Column: Large Circular Logo */}
          <div className="w-full lg:w-[400px] shrink-0 z-10 flex justify-center items-center">
            <div
              className="w-64 h-64 md:w-72 md:h-72 rounded-full shadow-2xl border-4 flex items-center justify-center overflow-hidden bg-white border-white transition-transform duration-300 hover:scale-103"
            >
              <img
                src={orgLogo}
                alt={isBeca ? "Fulbright logo" : "AIESEC logo"}
                className="object-contain p-6 w-full h-full"
              />
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
                Vive una experiencia internacional con acompañamiento antes, durante y después del programa.
              </div>
            </div>

            {/* Beneficios */}
            <div id="beneficios" className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-8 text-left">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold uppercase tracking-wider">
                  Beneficios
                </span>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-[#00135B] mt-1">Lo que ganarás con esta experiencia</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left: Accordion list */}
                <div className="space-y-4">
                  {BENEFIT_ITEMS.map((item, idx) => (
                    <InteractiveAccordionCard
                      key={idx}
                      item={item}
                      index={idx}
                      isOpen={openBenefitIndex === idx}
                      onToggle={() => setOpenBenefitIndex(openBenefitIndex === idx ? null : idx)}
                    />
                  ))}
                </div>

                {/* Right: Contextual image that changes with open accordion */}
                <div className="w-full self-start lg:sticky lg:top-28">
                  <AnimatePresence mode="wait">
                    {openBenefitIndex !== null && BENEFIT_ITEMS[openBenefitIndex] ? (
                      <motion.div
                        key={openBenefitIndex}
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -8 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="relative rounded-3xl overflow-hidden border border-gray-200/80 shadow-lg aspect-[4/3] bg-slate-900"
                      >
                        <img
                          src={BENEFIT_ITEMS[openBenefitIndex].image}
                          alt={BENEFIT_ITEMS[openBenefitIndex].imageCaption}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${BENEFIT_ITEMS[openBenefitIndex].gradient} flex items-center justify-center shadow-md shrink-0`}>
                            <span className="text-base">{BENEFIT_ITEMS[openBenefitIndex].emoji}</span>
                          </div>
                          <span className="text-white font-bold text-sm drop-shadow">{BENEFIT_ITEMS[openBenefitIndex].imageCaption}</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative rounded-3xl overflow-hidden border border-dashed border-gray-200 aspect-[4/3] bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400"
                      >
                        <Globe className="w-10 h-10 opacity-30" />
                        <p className="text-xs font-semibold">Selecciona un beneficio para ver su imagen</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Actividades */}
            <div id="actividades" className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-8 text-left">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-[10px] font-extrabold uppercase tracking-wider">
                  Actividades
                </span>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-[#00135B] mt-1">¿Qué harás?</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left: Contextual image (alternating position) */}
                <div className="w-full self-start lg:sticky lg:top-28 order-2 lg:order-1">
                  <AnimatePresence mode="wait">
                    {openActivityIndex !== null && ACTIVITY_ITEMS[openActivityIndex] ? (
                      <motion.div
                        key={openActivityIndex}
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -8 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="relative rounded-3xl overflow-hidden border border-gray-200/80 shadow-lg aspect-[4/3] bg-slate-900"
                      >
                        <img
                          src={ACTIVITY_ITEMS[openActivityIndex].image}
                          alt={ACTIVITY_ITEMS[openActivityIndex].imageCaption}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ACTIVITY_ITEMS[openActivityIndex].gradient} flex items-center justify-center shadow-md shrink-0`}>
                            <span className="text-base">{ACTIVITY_ITEMS[openActivityIndex].emoji}</span>
                          </div>
                          <span className="text-white font-bold text-sm drop-shadow">{ACTIVITY_ITEMS[openActivityIndex].imageCaption}</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder-act"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative rounded-3xl overflow-hidden border border-dashed border-gray-200 aspect-[4/3] bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400"
                      >
                        <Compass className="w-10 h-10 opacity-30" />
                        <p className="text-xs font-semibold">Selecciona una actividad para ver su imagen</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: Accordion list */}
                <div className="space-y-4 order-1 lg:order-2">
                  {ACTIVITY_ITEMS.map((item, idx) => (
                    <InteractiveAccordionCard
                      key={idx}
                      item={item}
                      index={idx}
                      isOpen={openActivityIndex === idx}
                      onToggle={() => setOpenActivityIndex(openActivityIndex === idx ? null : idx)}
                    />
                  ))}
                </div>
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
                    {playTestimonial1 ? (
                      <iframe
                        className="absolute inset-0 w-full h-full border-none rounded-t-3xl"
                        src="https://www.youtube.com/embed/7C7E1l5kpT8?autoplay=1"
                        title="Experiencias AIESEC"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <>
                        <img
                          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400"
                          alt="AIESEC volunteer story 1"
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        <button
                          onClick={() => setPlayTestimonial1(true)}
                          className="w-10 h-10 rounded-full bg-[#F5C542] hover:scale-105 transition-all text-[#00135B] flex items-center justify-center shadow-lg cursor-pointer z-10"
                        >
                          <Play className="w-4 h-4 fill-current translate-x-0.5" />
                        </button>
                      </>
                    )}
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
                    {playTestimonial2 ? (
                      <iframe
                        className="absolute inset-0 w-full h-full border-none rounded-t-3xl"
                        src="https://www.youtube.com/embed/h1I_q9PpjxA?autoplay=1"
                        title="Voluntariado internacional"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <>
                        <img
                          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"
                          alt="AIESEC volunteer story 2"
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        <button
                          onClick={() => setPlayTestimonial2(true)}
                          className="w-10 h-10 rounded-full bg-[#F5C542] hover:scale-105 transition-all text-[#00135B] flex items-center justify-center shadow-lg cursor-pointer z-10"
                        >
                          <Play className="w-4 h-4 fill-current translate-x-0.5" />
                        </button>
                      </>
                    )}
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

            {/* Interactive Video Card */}
            <div
              className="backdrop-blur-md rounded-3xl overflow-hidden p-3 shadow-md relative aspect-video flex flex-col justify-end min-h-[250px] group text-left bg-slate-900 border border-slate-200"
            >
              {playVideo && (isBeca ? scholarshipVideoUrl : opportunity.video_url) ? (
                <iframe
                  className="absolute inset-0 w-full h-full rounded-2xl border-none"
                  src={getEmbedUrl(isBeca ? scholarshipVideoUrl : opportunity.video_url)}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  {/* Cover image — Fulbright main photo or AIESEC stock */}
                  <img
                    src={isBeca
                      ? fulbrightBg
                      : "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600"
                    }
                    alt={isBeca ? "Becarios Fulbright" : "Welcome to AIESEC video cover"}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 filter brightness-75 transition-transform duration-500 group-hover:scale-103"
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t"
                    style={isBeca
                      ? { background: "linear-gradient(to top, rgba(90,45,0,0.92) 0%, rgba(45,24,0,0.3) 50%, transparent 100%)" }
                      : { background: "linear-gradient(to top, rgba(0,19,91,0.9) 0%, rgba(0,19,91,0.3) 50%, transparent 100%)" }
                    }
                  />

                  <button
                    onClick={() => setPlayVideo(true)}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full hover:scale-110 flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer"
                    style={{ background: "#F5C542", color: isBeca ? "#1a0d00" : "#00135B" }}
                  >
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </button>

                  <div className="relative z-10 p-4 space-y-1 text-white">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider mb-1"
                      style={isBeca
                        ? { background: "rgba(245,197,66,0.25)", border: "1px solid rgba(245,197,66,0.4)", color: "#F5C542" }
                        : { background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.25)", color: "white" }
                      }
                    >
                      {isBeca ? "🎓 Video Oficial Fulbright" : "Video de Bienvenida"}
                    </span>
                    <h3 className="font-bold text-sm font-display" style={{ color: "#F5C542" }}>
                      {isBeca ? "Becas Fulbright: La oportunidad de tu vida" : "Conoce la experiencia AIESEC"}
                    </h3>
                    <p className="text-[10px] text-slate-300 leading-snug">
                      {isBeca
                        ? "Mira cómo Fulbright transforma vidas académicas y profesionales alrededor del mundo."
                        : "Mira cómo funciona el voluntariado internacional antes de postular."
                      }
                    </p>
                  </div>
                </>
              )}
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

            {/* EduLab IA — Publicidad */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl text-left border border-[#5D8CE2]/30" style={{ background: "linear-gradient(145deg, #00052a 0%, #00135B 50%, #0d288c 100%)" }}>
              {/* Glowing orb decoration */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(93,140,226,0.35) 0%, transparent 70%)" }} />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(245,197,66,0.2) 0%, transparent 70%)" }} />

              <div className="relative z-10 p-6 space-y-4">
                {/* Header badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#F5C542] text-[9px] font-extrabold uppercase tracking-widest">
                    ✨ NUEVO
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Inteligencia Artificial</span>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-lg text-white leading-tight">EduLab <span className="text-[#F5C542]">IA</span></h3>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-medium">
                    Tu asistente personal de becas. Preparación 10× más rápida con inteligencia artificial.
                  </p>
                </div>

                {/* Feature list */}
                <ul className="space-y-2 text-xs text-slate-200">
                  {[
                    { icon: "🎯", text: "Matching inteligente con becas" },
                    { icon: "✍️", text: "Generador de cartas de motivación" },
                    { icon: "📄", text: "Optimizador de CV con IA" },
                    { icon: "🎤", text: "Simulador de entrevistas" },
                    { icon: "📊", text: "Score de competitividad" }
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 font-medium">
                      <span className="text-sm">{f.icon}</span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Pricing pills */}
                <div className="pt-2 space-y-2">
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Planes disponibles</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-[10px] text-slate-400 font-semibold">Básico</p>
                      <p className="text-white font-extrabold text-sm">Gratis</p>
                      <p className="text-[9px] text-slate-500">5 búsquedas/mes</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F5C542]/15 border border-[#F5C542]/40 text-center relative">
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-[#F5C542] text-[7px] font-extrabold text-[#00135B] uppercase">Popular</span>
                      <p className="text-[10px] text-[#F5C542] font-semibold">Pro</p>
                      <p className="text-white font-extrabold text-sm">$9.99<span className="text-[9px] font-medium text-slate-400">/mes</span></p>
                      <p className="text-[9px] text-slate-400">Ilimitado + IA</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/ia")}
                  className="w-full py-2.5 rounded-xl bg-[#F5C542] hover:bg-[#ebd035] text-[#00135B] font-extrabold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md active:scale-95"
                >
                  <span>Probar EduLab IA Gratis</span>
                  <ArrowRight className="w-3 h-3 text-[#00135B] stroke-[3]" />
                </button>

                <p className="text-center text-[9px] text-slate-500 font-medium">Sin tarjeta de crédito · Cancela cuando quieras</p>
              </div>
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
              <h4 className="font-bold text-sm font-display">
                {!existingApp || existingApp.status === "started" ? "Comenzar postulación" : "Estado de tu postulación"}
              </h4>
              <p className="text-[10px] text-[#00135B]/80 font-semibold font-medium">
                {!existingApp || existingApp.status === "started"
                  ? "Da el primer paso para vivir una experiencia que te transformará."
                  : "Tu postulación ha sido enviada con éxito y está bajo revisión."}
              </p>
            </div>
            {!existingApp || existingApp.status === "started" ? (
              <button
                onClick={handleStartPostulation}
                className="px-5 py-3 rounded-xl bg-[#00135B] hover:bg-[#0d288c] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0 border-none cursor-pointer"
              >
                {existingApp?.status === "started" ? "Continuar" : "Quiero postular ahora"}
              </button>
            ) : (
              <span className="px-5 py-3 rounded-xl bg-white/40 border border-white/20 text-[#00135B] font-extrabold text-xs uppercase tracking-wider select-none">
                {existingApp.status === "pending" && "Pendiente"}
                {existingApp.status === "in_review" && "En revisión"}
                {existingApp.status === "accepted" && "Aprobado 🎉"}
                {existingApp.status === "rejected" && "Rechazado"}
              </span>
            )}
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
                  if (!localProfileForm.interests || localProfileForm.interests.length === 0) { setApplyError("Selecciona al menos un área de interés."); return; }
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
                        // CV URL field removed from form
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
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${applyStep === idx + 1
                            ? "bg-[#00135B] text-white"
                            : applyStep > idx + 1
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-xs font-bold ${applyStep === idx + 1 ? "text-[#00135B]" : "text-slate-400"
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
                            <div className="relative">
                              <select
                                value={localProfileForm.country}
                                onChange={(e) => setLocalProfileForm({ ...localProfileForm, country: e.target.value })}
                                className="w-full bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all appearance-none cursor-pointer"
                              >
                                <option value="">-- Selecciona --</option>
                                {SPANISH_SPEAKING_COUNTRIES.map((c) => (
                                  <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                                ))}
                              </select>
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                              </div>
                            </div>
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
                            <div className="relative">
                              <input
                                ref={birthDateRef}
                                type="date"
                                value={formatDateForInput(localProfileForm.birth_date)}
                                onChange={(e) => setLocalProfileForm({ ...localProfileForm, birth_date: e.target.value })}
                                className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  try {
                                    birthDateRef.current?.showPicker();
                                  } catch (err) {
                                    birthDateRef.current?.focus();
                                  }
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer flex items-center justify-center"
                              >
                                <Calendar className="w-4 h-4" />
                              </button>
                            </div>
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

                          {/* Área de interés */}
                          <div className="md:col-span-2 space-y-2">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Área de Interés <span className="text-rose-500">*</span>
                            </label>
                            <p className="text-[10px] text-slate-400">Selecciona las áreas académicas/profesionales de tu interés:</p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {[
                                "Prácticas Profesionales",
                                "Programas de Liderazgo",
                                "Intercambios Académicos",
                                "Cursos Cortos",
                                "Investigación Científica",
                                "Medio Ambiente",
                                "Desarrollo Social",
                                "Tecnología para el Bien"
                              ].map((interest) => {
                                const isSelected = localProfileForm.interests?.includes(interest);
                                return (
                                  <button
                                    key={interest}
                                    type="button"
                                    onClick={() => {
                                      const current = localProfileForm.interests || [];
                                      const next = current.includes(interest)
                                        ? current.filter((i: string) => i !== interest)
                                        : [...current, interest];
                                      setLocalProfileForm({ ...localProfileForm, interests: next });
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-[#5D8CE2] border-[#5D8CE2] text-white shadow-sm"
                                        : "bg-slate-50 border-gray-200 text-slate-500 hover:bg-slate-100"
                                    }`}
                                  >
                                    {interest}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Graduation Date */}
                          <div className="md:col-span-2 space-y-1">
                            <label className="font-bold uppercase text-[9px] text-slate-400 block">
                              Fecha Estimada de Graduación {opportunity.required_profile_fields?.includes("expected_graduation_date") || opportunity.required_profile_fields?.includes("graduation_date") ? <span className="text-rose-500">*</span> : ""}
                            </label>
                            <div className="relative">
                              <input
                                ref={gradDateRef}
                                type="date"
                                value={formatDateForInput(localProfileForm.expected_graduation_date)}
                                onChange={(e) => setLocalProfileForm({ ...localProfileForm, expected_graduation_date: e.target.value })}
                                className="w-full bg-white border border-gray-200 focus:bg-white text-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs focus:outline-none focus:border-[#5D8CE2] transition-all"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  try {
                                    gradDateRef.current?.showPicker();
                                  } catch (err) {
                                    gradDateRef.current?.focus();
                                  }
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer flex items-center justify-center"
                              >
                                <Calendar className="w-4 h-4" />
                              </button>
                            </div>
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
