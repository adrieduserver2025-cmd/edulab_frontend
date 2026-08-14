import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, CheckCircle2, ChevronDown, BookOpen,
  Star, ArrowRight, ArrowLeft, Sparkles, ExternalLink,
  HelpCircle, Users, Trophy, Lightbulb,
  GraduationCap, DollarSign, Clock, Calendar, Languages,
  MapPin, Building2, Zap, AlertTriangle, Play, Check, ShieldCheck,
  Compass, Target, AlertCircle, Globe, Plane, Wallet, Shield, Home, X, Video, FileText, Search
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";
import { useAuthStore } from "../../store/useAuthStore";
import axiosClient from "../../services/api/axiosClient";

// Import local assets from src/assets/becas_patiño/imagenes
import patinoLogo from "../../assets/becas_patiño/imagenes/logo.png";
import unigeLogo from "../../assets/becas_patiño/imagenes/logo Universidad de Ginebra.png";
import unilLogo from "../../assets/becas_patiño/imagenes/logo Universidad de Lausanne (UNIL).png";
import unigePhoto from "../../assets/becas_patiño/imagenes/University_of_Geneva_2015.jpg";
import patinoPhoto1 from "../../assets/becas_patiño/imagenes/patino_photo_1.jfif";
import patinoPhoto2 from "../../assets/becas_patiño/imagenes/patino_photo_2.jfif";
import patinoPhoto3 from "../../assets/becas_patiño/imagenes/758167633_1676636887799491_250056295907476497_n.jpg";
import patinoPhoto4 from "../../assets/becas_patiño/imagenes/759955133_1552403459705892_670248009908871381_n.jpeg";
import patinoPhoto5 from "../../assets/becas_patiño/imagenes/760023653_1676636764466170_7006265542364943308_n.jpg";

// Types for Videos
interface PatiñoVideo {
  id: string;
  title: string;
  category: string;
  desc: string;
  type: "youtube" | "mp4" | "facebook";
  url: string;
  heroEmbedUrl: string;
  modalEmbedUrl: string;
  thumb: string;
}

const PATINO_VIDEOS: PatiñoVideo[] = [
  {
    id: "v1",
    title: "Video de Ingreso a la Beca Patiño",
    category: "Ingreso & Convocatoria",
    desc: "Explicación detallada del proceso de selección y requisitos institucionales de la Fundación Simón I. Patiño.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=fWeT7x1U_Eo",
    heroEmbedUrl: "https://www.youtube.com/embed/fWeT7x1U_Eo?autoplay=0",
    modalEmbedUrl: "https://www.youtube.com/embed/fWeT7x1U_Eo?autoplay=1",
    thumb: patinoPhoto3
  },
  {
    id: "v2",
    title: "Trailer Bicentenario Simón I. Patiño",
    category: "Documental & Historia",
    desc: "Cortometraje oficial de la Fundación Patiño en conmemoración al compromiso histórico con Bolivia.",
    type: "mp4",
    url: "https://patino.org/wp-content/uploads/2025/04/trailer_bicentenario.mp4",
    heroEmbedUrl: "https://patino.org/wp-content/uploads/2025/04/trailer_bicentenario.mp4",
    modalEmbedUrl: "https://patino.org/wp-content/uploads/2025/04/trailer_bicentenario.mp4",
    thumb: unigePhoto
  },
  {
    id: "v3",
    title: "Espacio Patiño La Paz - Actividades",
    category: "Comunidad & Espacio Patiño",
    desc: "Recorrido por las iniciativas educativas, culturales y de formación del Espacio Patiño.",
    type: "facebook",
    url: "https://www.facebook.com/EspacioPatinoLaPaz/videos/1074716728316853",
    heroEmbedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FEspacioPatinoLaPaz%2Fvideos%2F1074716728316853&show_text=0",
    modalEmbedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FEspacioPatinoLaPaz%2Fvideos%2F1074716728316853&show_text=0",
    thumb: patinoPhoto4
  },
  {
    id: "v4",
    title: "Experiencia de Becario y Voluntario",
    category: "Testimonios",
    desc: "Vivencia real de profesionales bolivianos realizando maestrías y voluntariados en Europa.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=NJt_irYIr5o&t=17s",
    heroEmbedUrl: "https://www.youtube.com/embed/NJt_irYIr5o?autoplay=0&start=17",
    modalEmbedUrl: "https://www.youtube.com/embed/NJt_irYIr5o?autoplay=1&start=17",
    thumb: patinoPhoto5
  }
];

// Master Program Definition
interface MasterProgram {
  title: string;
  faculty: string;
  lang: string;
  ects: number;
  semesters: number;
  prerequisites: string;
  boliviaSupport: string;
  summary: string;
  brochureUrl?: string;
}

// Associated University Definition
interface AssociatedUniversity {
  id: string;
  name: string;
  shortName: string;
  city: string;
  country: string;
  flag: string;
  minGpa: number;
  logo: string | null;
  description: string;
  badge: string;
  color: string;
  programs: MasterProgram[];
}

const UNIVERSITIES: AssociatedUniversity[] = [
  {
    id: "unige",
    name: "Université de Genève",
    shortName: "UNIGE",
    city: "Ginebra",
    country: "Suiza",
    flag: "🇨🇭",
    minGpa: 80,
    logo: unigeLogo,
    description: "Una de las instituciones académicas más prestigiosas del mundo en ciencias naturales, derecho internacional y relaciones humanas.",
    badge: "Mínimo 80/100",
    color: "#2563eb",
    programs: [
      {
        title: "Master of Science in Economics",
        faculty: "Facultad de Economía y Gestión",
        lang: "Inglés",
        ects: 90,
        semesters: 3,
        prerequisites: "Licenciatura en Economía o un campo similar.",
        boliviaSupport: "Desarrollo económico, Desarrollo humano, Análisis de datos, Elaboración de políticas.",
        summary: "Desarrolla herramientas avanzadas de microeconomía, macroeconomía y econometría para instituciones públicas, privadas y organismos internacionales.",
        brochureUrl: "https://masters.unige.ch/masters/pdf/76/eng/ma/economics.pdf"
      },
      {
        title: "Master of Science in Statistics",
        faculty: "Facultad de Economía y Gestión",
        lang: "Inglés",
        ects: 90,
        semesters: 3,
        prerequisites: "Licenciatura en Economía, Matemáticas o un campo similar.",
        boliviaSupport: "Desarrollo económico, análisis de datos, desarrollo empresarial o gubernamental.",
        summary: "Se centra en el análisis de datos práctico, la resolución de problemas metodológicos y el aprendizaje de software estadístico avanzado.",
        brochureUrl: "https://masters.unige.ch/masters/pdf/52/eng/ma/statistics.pdf"
      },
      {
        title: "Master en Sciences de l'éducation – Analyse et intervención dans les systèmes éducatifs",
        faculty: "Psychologie et Sciences de l'éducation",
        lang: "Francés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licence en Sciences de l'éducation ou en Éducation.",
        boliviaSupport: "Educación, enseñanza, desarrollo de programas educativos.",
        summary: "Forma a los estudiantes para diseñar e intervenir en sistemas educativos inclusivos, atención a la discapacidad y fortalecimiento del tejido social.",
        brochureUrl: "https://masters.unige.ch/masters/pdf/15/fra/ma/sciences-de-l-educationanalyse-et-intervention-dans-les-systemes-educatifs.pdf"
      }
    ]
  },
  {
    id: "unil",
    name: "Université de Lausanne",
    shortName: "UNIL",
    city: "Lausana",
    country: "Suiza",
    flag: "🇨🇭",
    minGpa: 80,
    logo: unilLogo,
    description: "Líder en biología, medicina básica, ciencias ambientales, economía y humanidades con un campus a orillas del lago Lemán.",
    badge: "Mínimo 80/100",
    color: "#0284c7",
    programs: [
      {
        title: "Master of Science in Economics",
        faculty: "Business School (HEC) Lausanne",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Economía, Finanzas, Administración, Informática o similar.",
        boliviaSupport: "Desarrollo económico, análisis de datos, desarrollo empresarial.",
        summary: "Métodos recientes de investigación económica con menciones en Ciencia de Datos, Desarrollo Económico, Política Ambiental y Macroeconomía.",
        brochureUrl: "https://www.unil.ch/files/live/sites/unil/files/04-etudier/0402-masters/master-2025-en/ma_economics_25.pdf"
      },
      {
        title: "Master of Science in Environmental Science",
        faculty: "Facultad de Geociencias y Medio Ambiente",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Medio Ambiente, Ciencias Sociales, Relaciones Internacionales o similar.",
        boliviaSupport: "Desarrollo económico, Medio ambiente.",
        summary: "Formación científica en observación y seguimiento de fenómenos ambientales, capas freáticas y desarrollo sostenible.",
        brochureUrl: "https://www.unil.ch/files/live/sites/unil/files/04-etudier/0402-masters/master2025-en/Ma_environmental_science_2025_web.pdf"
      },
      {
        title: "Master of Science in Management",
        faculty: "Business School (HEC)",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en economía, gestión, informática empresarial o finanzas.",
        boliviaSupport: "Desarrollo económico, análisis de datos, desarrollo empresarial.",
        summary: "Especialidades en Business Analytics, Estrategia, Liderazgo, Marketing y Comportamiento Económico.",
        brochureUrl: "https://www.unil.ch/files/live/sites/unil/files/04-etudier/0402-masters/master2025-en/Master_management_2025_web.pdf"
      },
      {
        title: "Master of Science in Finance",
        faculty: "Business School (HEC)",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Economía, Finanzas, Administración o Informática.",
        boliviaSupport: "Desarrollo económico, gestión financiera, análisis de riesgos.",
        summary: "Finanzas corporativas, gestión de activos, cuantitativa y emprendimiento financiero con ciencia de datos.",
        brochureUrl: "https://www.unil.ch/files/live/sites/unil/files/04-etudier/0402-masters/master2025-en/Master_finance_2025_web.pdf"
      }
    ]
  },
  {
    id: "epfl",
    name: "École Polytechnique Fédérale de Lausanne",
    shortName: "EPFL",
    city: "Lausana",
    country: "Suiza",
    flag: "🇨🇭",
    minGpa: 90,
    logo: null,
    description: "Top 10 mundial en tecnología e ingeniería. Requiere la máxima exigencia académica (mínimo 90/100) para sus programas de maestría.",
    badge: "Exigencia Top: 90/100",
    color: "#dc2626",
    programs: [
      {
        title: "Master in Environmental Sciences and Engineering",
        faculty: "Facultad del Medio Natural, Arquitectura y Construcción (ENAC)",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Ciencias Ambientales e Ingeniería o similar.",
        boliviaSupport: "Medio ambiente, gestión del agua, electricidad y desarrollo tecnológico.",
        summary: "Ingeniería medioambiental avanzada en entornos naturales y urbanos complejos.",
        brochureUrl: "https://www.epfl.ch/education/master/programs/environmental-sciences-and-engineering/"
      },
      {
        title: "Master in Materials Science and Engineering",
        faculty: "Facultad de Ciencias y Técnicas de la Ingeniería",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Ciencia de Materiales, Física, Química o Ingeniería Mecánica.",
        boliviaSupport: "Gestión del litio, metalurgia, energía sostenible e industria.",
        summary: "Estudio del procesamiento, estructura y propiedades de materiales para el uso innovador en biotecnología y metalurgia.",
        brochureUrl: "https://www.epfl.ch/education/master/programs/materials-science-and-engineering/"
      },
      {
        title: "Master in Computer Science",
        faculty: "Facultad de Informática y Comunicaciones",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Informática, Sistemas, Matemáticas o Física.",
        boliviaSupport: "Desarrollo empresarial, software de alto nivel y tecnologías de información.",
        summary: "Plan de estudios en informática líder a nivel mundial para dirigir investigación y desarrollo de software/hardware.",
        brochureUrl: "https://www.epfl.ch/education/master/programs/computer-science/"
      },
      {
        title: "Master in Data Science",
        faculty: "Facultad de Informática y Comunicaciones",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Informática, Sistemas, Matemáticas o Física.",
        boliviaSupport: "Análisis de datos masivos, Machine Learning, inteligencia artificial para Bolivia.",
        summary: "Formación integral desde algoritmos y arquitectura de bases de datos hasta Aprendizaje Automático.",
        brochureUrl: "https://www.epfl.ch/education/master/programs/data-science/"
      }
    ]
  },
  {
    id: "bfh",
    name: "Berner Fachhochschule",
    shortName: "BFH",
    city: "Berna",
    country: "Suiza",
    flag: "🇨🇭",
    minGpa: 80,
    logo: null,
    description: "Universidad de Ciencias Aplicadas de Berna, orientada a la innovación práctica, ingeniería, agricultura y tecnologías sostenibles.",
    badge: "Mínimo 80/100",
    color: "#7c3aed",
    programs: [
      {
        title: "MSc in Life Sciences – Food, Nutrition and Health",
        faculty: "School of Agricultural, Forest and Food Sciences (HAFL)",
        lang: "Inglés",
        ects: 90,
        semesters: 3,
        prerequisites: "Licenciatura en Ciencia de Alimentos, Nutrición, Enología o similar.",
        boliviaSupport: "Alimentación, Nutrición, Desarrollo agroindustrial.",
        summary: "Nutrición, tecnología alimentaria y procesos de producción sostenibles para grupos específicos.",
        brochureUrl: "https://www.bfh.ch/en/studies/master/life-sciences-food-nutrition-health/"
      },
      {
        title: "MSc in Circular Innovation and Sustainability",
        faculty: "School of Architecture & HAFL Business School",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Economía, Ciencias de la Vida o Tecnología.",
        boliviaSupport: "Sostenibilidad, gestión de recursos, economía circular.",
        summary: "Gestión de transformaciones innovadoras en eficiencia de recursos y modelos económicos circulares.",
        brochureUrl: "https://www.bfh.ch/en/studies/master/circular-innovation-and-sustainability/"
      },
      {
        title: "MSc in Life Sciences – Agricultural Science",
        faculty: "School of Agricultural, Forest and Food Sciences (HAFL)",
        lang: "Inglés",
        ects: 90,
        semesters: 3,
        prerequisites: "Licenciatura en Agronomía, Recursos Naturales o Ciencias Forestales.",
        boliviaSupport: "Desarrollo rural, cadenas de valor agrícolas, seguridad alimentaria.",
        summary: "Soluciones innovadoras para la demanda agrícola sustentable en entornos complejos.",
        brochureUrl: "https://www.bfh.ch/en/studies/master/life-sciences-agricultural-science/"
      }
    ]
  },
  {
    id: "ulb",
    name: "Université Libre de Bruxelles",
    shortName: "ULB",
    city: "Bruselas",
    country: "Bélgica",
    flag: "🇧🇪",
    minGpa: 80,
    logo: null,
    description: "Referente europeo francófono en Bruselas, capital de Europa, con destacada trayectoria en ciencias aplicadas, ingeniería y ciberseguridad.",
    badge: "Mínimo 80/100",
    color: "#059669",
    programs: [
      {
        title: "Master in Computer Science",
        faculty: "Facultad de Ciencias",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Informática, Sistemas, Matemáticas o Física.",
        boliviaSupport: "Desarrollo empresarial, sistemas informáticos.",
        summary: "Capacidad de investigación y gestión de proyectos informáticos complejos aplicados a la realidad económica.",
        brochureUrl: "https://sciences.ulb.be/les-etudes/brochure-de-presentation-des-etudes-en-sciences"
      },
      {
        title: "Master in Cybersecurity",
        faculty: "Facultad de Ciencias ULB / UCL / VUB",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Informática, Sistemas, Matemáticas o Ingeniería.",
        boliviaSupport: "Seguridad de la información, protección de infraestructura digital.",
        summary: "Formación multidisciplinaria en ingeniería de seguridad, gestión y protección informática.",
        brochureUrl: "https://sciences.ulb.be/les-etudes/brochure-de-presentation-des-etudes-en-sciences"
      },
      {
        title: "Master in Chemistry and Bio-industries Bioengineering",
        faculty: "Facultad de Ciencias",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Química, Ciencias Agrícolas o Industriales.",
        boliviaSupport: "Biotecnología agroindustrial, gestión ambiental.",
        summary: "Diseño y producción agroindustrial mediante herramientas biotecnológicas y bioinformáticas.",
        brochureUrl: "https://sciences.ulb.be/les-etudes/brochure-de-presentation-des-etudes-en-sciences"
      },
      {
        title: "Master in Electromechanical Engineering",
        faculty: "Escuela de Ingeniería Bruface / ULB / VUB",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Ingeniería Civil, Química, Mecánica o Física.",
        boliviaSupport: "Energías renovables, automatización, robótica.",
        summary: "Competencias polivalentes en electricidad, robótica, automatización y energías limpias.",
        brochureUrl: "https://polytech.ulb.be/fr/etudes/masters/ingenieur-civil-electromecanicien"
      },
      {
        title: "Master in Electrical Engineering",
        faculty: "Escuela de Ingeniería Bruface / ULB / VUB",
        lang: "Inglés",
        ects: 120,
        semesters: 4,
        prerequisites: "Licenciatura en Ingeniería Electrónica, Física o Electromecánica.",
        boliviaSupport: "Gestión de redes eléctricas, telecomunicaciones e internet.",
        summary: "Desarrollo de dispositivos electrónicos complejos, microelectrónica y sistemas en tiempo real.",
        brochureUrl: "https://polytech.ulb.be/fr/etudes/masters/ingenieur-civil-en-electronique-et-telecommunications"
      }
    ]
  }
];

export default function PatinoPage() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [programId, setProgramId] = useState<number | null>(null);

  // Video Modal State (Ventana Emergente)
  const [modalVideo, setModalVideo] = useState<PatiñoVideo | null>(null);
  const [heroVideoIdx, setHeroVideoIdx] = useState(0);

  // University Master Programs Modal State
  const [selectedUniPrograms, setSelectedUniPrograms] = useState<AssociatedUniversity | null>(null);

  // Benefit Details Master-Detail Selection (Imagen 1 style)
  const [activeBenefitIdx, setActiveBenefitIdx] = useState<number>(0);

  // FAQ Search State
  const [faqSearch, setFaqSearch] = useState("");

  // Calculator State
  const [calcGpa, setCalcGpa] = useState<number>(85);
  const [calcUni, setCalcUni] = useState<string>("unige");
  const [calcAge, setCalcAge] = useState<number>(24);
  const [calcEnglish, setCalcEnglish] = useState<boolean>(true);
  const [calcBolivian, setCalcBolivian] = useState<boolean>(true);
  const [calcProject, setCalcProject] = useState<boolean>(true);

  const selectedUniObj = UNIVERSITIES.find(u => u.id === calcUni) || UNIVERSITIES[0];
  const gpaPasses = calcGpa >= selectedUniObj.minGpa;
  const agePasses = calcAge < 30;
  const isFullyEligible = gpaPasses && agePasses && calcEnglish && calcBolivian && calcProject;

  // Auto-open video popup modal on entry after 1s
  useEffect(() => {
    const timer = setTimeout(() => {
      setModalVideo(PATINO_VIDEOS[0]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load backend program ID
  useEffect(() => {
    async function loadProgram() {
      try {
        const res = await axiosClient.get("/opportunities/patino-beca");
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
      title: "Matrícula Completa",
      tagline: "100% Cubierta",
      desc: "Aranceles universitarios totalmente cubiertos en instituciones de excelencia académica mundial en Suiza y Bélgica.",
      longDesc: "La Beca Patiño otorga una cobertura 100% completa que comprende la matriculación oficial en las universidades participantes (UNIGE, UNIL, EPFL, ULB, BFH, VUB), aranceles de posgrado y tarifas académicas.",
      checklist: [
        "Matriculación universitaria 100%",
        "Derechos de examen y aranceles",
        "Acceso ilimitado a laboratorios",
        "Biblioteca y plataformas digitales"
      ],
      advantages: [
        "Sin deuda estudiantil",
        "Universidades top-tier globales",
        "Financiamiento institucional Patiño"
      ],
      tip: "Recuerda que no es necesario contar con la carta de aceptación de la universidad al momento de postular; la Fundación asesora el proceso a los seleccionados.",
      image: unigePhoto,
      theme: { bg: "bg-blue-50/50", iconColor: "text-blue-600", badgeBg: "bg-blue-50 text-blue-700", accentColor: "#2563eb" }
    },
    {
      icon: Plane,
      title: "Pasajes Internacionales",
      tagline: "Ida y Vuelta",
      desc: "Vuelos aéreos internacionales de ida y vuelta cubiertos desde Bolivia hasta el país de destino.",
      longDesc: "La Fundación Patiño cubre íntegramente los boletos internacionales de avión de ida al comenzar tus estudios de maestría en Suiza o Bélgica y de retorno a Bolivia al finalizar tu programa.",
      checklist: [
        "Boleto aéreo de ida al inicio",
        "Boleto aéreo de retorno a Bolivia",
        "Equipaje documentado completo",
        "Coordinación de itinerario de viaje"
      ],
      advantages: [
        "Cero costo de transporte internacional",
        "Emisión directa por la Fundación",
        "Flexibilidad al culminar el programa"
      ],
      tip: "EduLab te acompaña en la tramitación del visado Schengen ante las embajadas de Suiza o Bélgica en Bolivia.",
      image: patinoPhoto3,
      theme: { bg: "bg-sky-50/50", iconColor: "text-sky-600", badgeBg: "bg-sky-50 text-sky-700", accentColor: "#0284c7" }
    },
    {
      icon: Wallet,
      title: "Estipendio Mensual",
      tagline: "Gastos Personales & Vida",
      desc: "Asignación mensual suficiente para vivienda, alimentación y estipendio personal durante 18 a 24 meses.",
      longDesc: "Recibes una asignación económica mensual adaptada al costo de vida real en Ginebra, Lausana, Bruselas o Berna, cubriendo alquiler de vivienda, alimentación diaria y gastos personales.",
      checklist: [
        "Alojamiento universitario o privado",
        "Alimentación y víveres",
        "Materiales y libros de estudio",
        "Gastos personales cotidianos"
      ],
      advantages: [
        "Monto holgado según costo suizo/belga",
        "Depósitos mensuales puntuales",
        "Tranquilidad económica total"
      ],
      tip: "Asiste a los talleres de presupuesto de EduLab para optimizar tus asignaciones en francos suizos (CHF) u euros (EUR).",
      image: patinoPhoto4,
      theme: { bg: "bg-amber-50/50", iconColor: "text-amber-600", badgeBg: "bg-amber-50 text-amber-700", accentColor: "#d97706" }
    },
    {
      icon: Shield,
      title: "Seguro Médico",
      tagline: "Cobertura Integral",
      desc: "Seguro de salud internacional completo durante toda la permanencia académica en Europa.",
      longDesc: "La beca incluye un seguro médico completo que cubre consultas generales, especialidades, medicamentos recetados y emergencias hospitalarias durante los 2 años de maestría.",
      checklist: [
        "Consultas médicas y urgencias",
        "Cobertura hospitalaria 100%",
        "Medicamentos e insumos",
        "Cumplimiento visa Schengen"
      ],
      advantages: [
        "Sin copagos en emergencias",
        "Red médica de primer nivel en Suiza/Bélgica",
        "Protección las 24 horas"
      ],
      tip: "El certificado médico de postulación debe descargarse del Ministerio de Salud de Bolivia y estar avalado por médico matriculado.",
      image: patinoPhoto5,
      theme: { bg: "bg-emerald-50/50", iconColor: "text-emerald-600", badgeBg: "bg-emerald-50 text-emerald-700", accentColor: "#059669" }
    },
    {
      icon: Home,
      title: "Apoyo Inicial de Instalación",
      tagline: "Ambientación Tranquila",
      desc: "Orientación institucional y acompañamiento continuo en la etapa de ambientación en el país destino.",
      longDesc: "La Fundación Simón I. Patiño acompaña de forma cercana al becario durante la etapa de ambientación, facilitando su instalación en la residencia universitaria y adaptación cultural.",
      checklist: [
        "Acompañamiento institucional continuo",
        "Orientación de llegada y vivienda",
        "Trámites de residencia cantonal",
        "Integración con la comunidad"
      ],
      advantages: [
        "Tutoría personalizada",
        "Respaldo institucional en Europa",
        "Disminución del choque cultural"
      ],
      tip: "Si bien el beneficio no es familiar, estar casado o tener hijos no es impedimento para postular a la Beca Patiño.",
      image: patinoPhoto1,
      theme: { bg: "bg-purple-50/50", iconColor: "text-purple-600", badgeBg: "bg-purple-50 text-purple-700", accentColor: "#7c3aed" }
    },
    {
      icon: Users,
      title: "Red & Tutoria Fundación Patiño",
      tagline: "Compromiso de Retorno",
      desc: "Acceso a la red de líderes y tutores comprometidos con la transferencia de conocimiento a Bolivia.",
      longDesc: "Red internacional de ex-becarios e investigadores Patiño. La beca incluye la preparación y seguimiento de tu proyecto de aplicación de conocimientos para tu retorno a Bolivia por un mínimo de 3 años.",
      checklist: [
        "Red de ex-becarios en Bolivia y Europa",
        "Seguimiento de proyecto de desarrollo (1-3 págs)",
        "Compromiso de retorno a Bolivia",
        "Mentoría profesional permanente"
      ],
      advantages: [
        "Retorno con impacto real en Bolivia",
        "Conexiones de alto valor profesional",
        "Prestigio académico de por vida"
      ],
      tip: "El proyecto de aplicación (1 a 3 páginas) valora la claridad y relevancia del impacto que generarás en Bolivia.",
      image: patinoPhoto2,
      theme: { bg: "bg-pink-50/50", iconColor: "text-pink-600", badgeBg: "bg-pink-50 text-pink-700", accentColor: "#db2777" }
    }
  ];

  const requirements = [
    { name: "Nacionalidad Boliviana", priority: "Obligatorio", color: "#ef4444", desc: "Bolivianos titulados en Bolivia (admitida doble nacionalidad)" },
    { name: "Menos de 30 años de edad", priority: "Obligatorio", color: "#ef4444", desc: "Cumplidos al momento de su postulación" },
    { name: "Título de Licenciatura Boliviana", priority: "Obligatorio", color: "#ef4444", desc: "Titulados en universidades de Bolivia (no técnico superior)" },
    { name: "Promedio ≥ 80/100 (ó ≥ 90/100 EPFL)", priority: "Obligatorio", color: "#ef4444", desc: "Certificado de notas oficial y legalizado" },
    { name: "Inglés C1 / TOEFL ≥ 90 / IELTS 7.0", priority: "Obligatorio", color: "#ef4444", desc: "O idioma oficial de impartición de la maestría" },
    { name: "Proyecto para Bolivia (1 a 3 págs)", priority: "Importante", color: "#f59e0b", desc: "Plan claro de aplicación de conocimientos tras retorno" },
    { name: "Carta de motivación manuscrita", priority: "Importante", color: "#f59e0b", desc: "Carta personal sobre motivaciones y proyección" },
    { name: "Exclusión: No Medicina / Odontología", priority: "Recomendado", color: "#22c55e", desc: "Carreras de salud médica excluidas" }
  ];

  // Official FAQ questions provided by user
  const OFFICIAL_FAQS = [
    { q: "¿Qué cubre la beca?", a: "La cobertura que otorga la Fundación Patiño es completa: comprende el pago de la matriculación, seguros, vivienda, boletos de avión (ida y vuelta) y gastos personales." },
    { q: "¿Cuánto tiempo dura la beca?", a: "La beca tiene una duración entre 18 y 24 meses (1.5 a 2 años)." },
    { q: "¿Qué evalúa la Fundación para seleccionar a los becarios?", a: "Evaluará el rendimiento académico del postulante, la coherencia entre su licenciatura y la maestría elegida, la pertinencia de su proyección académica/profesional y la solidez de su plan de contribución al desarrollo de Bolivia al retornar." },
    { q: "¿Qué pasa si no tengo un buen desempeño académico en el extranjero?", a: "La Fundación hace un acompañamiento cercano durante la ambientación. Sin embargo, en caso de no cumplir con los requisitos preestablecidos, la beca será revocada y el becario retornará a Bolivia." },
    { q: "Soy boliviano pero tengo doble nacionalidad, ¿puedo postular?", a: "Sí, se puede siempre y cuando el postulante tenga la nacionalidad boliviana y el título de licenciatura haya sido emitido en Bolivia." },
    { q: "Tengo una licenciatura del extranjero, ¿puedo aplicar?", a: "No, las Becas Patiño están destinadas exclusivamente a profesionales titulados en universidades de Bolivia." },
    { q: "Ya tengo una maestría en el extranjero, ¿puedo postular?", a: "No. La Fundación busca dar oportunidad a personas que no tengan previa especialización de posgrado internacional." },
    { q: "¿Hasta qué edad puedo postular a la beca?", a: "Hasta los 30 años cumplidos al momento de presentar su postulación." },
    { q: "¿Se debe tener ya una carta de aceptación de la universidad para postular?", a: "No, no es necesario iniciar con el proceso de aplicación ni presentar carta de aceptación. El proceso de aplicación a las universidades se iniciará con la guía de la Fundación únicamente con los becarios seleccionados." },
    { q: "¿Puedo aplicar a más de una maestría?", a: "No. La Fundación valora el enfoque del postulante con la maestría que elija, por lo que solo se puede aplicar a una maestría." },
    { q: "¿Cuál es el nivel de inglés requerido?", a: "Para los programas en inglés, el nivel requerido es C1. Esto equivale a obtener al menos 90 puntos en el examen TOEFL iBT o un puntaje de 7.0 en IELTS." },
    { q: "No tengo el certificado TOEFL/DALF vigente aún, ¿puedo postular?", a: "Sí, puede postular a la beca. Como parte del proceso de selección, la Fundación realizará evaluaciones del idioma. Posteriormente se necesitará la certificación formal para la universidad." },
    { q: "¿Qué nivel de detalle debe tener el proyecto de aplicación de conocimientos?", a: "El documento puede tener entre 1 y 3 páginas. Se describe el plan para aplicar los conocimientos al retornar a Bolivia. Se valorará la claridad, relevancia y pertinencia de la propuesta." },
    { q: "¿Tengo que enviar documentos físicos en la primera fase?", a: "No, en la primera fase es suficiente con subir los documentos escaneados al formulario en línea. Solamente deberás enviar documentos físicos si resultas preseleccionado(a)." }
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
        .check-item { transition: background 0.2s; }
        .adv-badge { transition: background 0.2s, border-color 0.2s; }
        .adv-badge:hover { background: #FEF3C7; border-color: #F59E0B; }
      `}</style>

      <PublicNavbar onOpenAuth={() => setShowAuthModal(true)} />

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HERO SECTION (ROYAL NAVY #00135B WITH FULBRIGHT STYLE BUTTONS & HERO PLAYER)
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
                BECA INTERNACIONAL 🇨🇭🇧🇪 SUIZA & BÉLGICA
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                <span>Becas Simón I. </span>
                <span style={{ color: "#F5C542" }}>Patiño</span>
              </h1>

              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl font-light">
                Estudia una maestría de excelencia en las universidades más prestigiosas de <strong className="text-white font-semibold">Suiza y Bélgica</strong> con financiamiento 100% integral.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2.5">
                {[
                  { icon: "🇨🇭🇧🇪", text: "Suiza y Bélgica" },
                  { icon: "🎓", text: "Maestría / Investigación" },
                  { icon: "💰", text: "100% Financiada" },
                  { icon: "🗣", text: "Inglés C1 / Francés / Alemán" },
                ].map(tag => (
                  <span key={tag.text} className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1.5"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                    <span>{tag.icon}</span> <span>{tag.text}</span>
                  </span>
                ))}
              </div>

              {/* Action Buttons — Styled Exactly Like Fulbright Page */}
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
              </div>

              {/* Attributes Banner */}
              <div className="p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 w-full"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {[
                  { icon: "💲", label: "Financiamiento", val: "100% Completo" },
                  { icon: "⏱", label: "Duración", val: "18 – 24 meses" },
                  { icon: "📅", label: "Fecha límite", val: "31 Oct 2025" },
                  { icon: "🌐", label: "Modalidad", val: "Presencial" },
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
                  { val: "100%", label: "Financiado completo" },
                  { val: "6", label: "Universidades Top" },
                  { val: "≥ 80 - 90", label: "Promedio requerido" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-2xl font-black" style={{ color: "#F5C542" }}>{s.val}</div>
                    <div className="text-white/70 text-xs font-medium mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Video Player Box (Without Autoplay Conflict) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950 relative border border-white/20 p-2 space-y-3">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black group">
                  {PATINO_VIDEOS[heroVideoIdx].type === "mp4" ? (
                    <video
                      controls
                      className="w-full h-full object-cover"
                      src={PATINO_VIDEOS[heroVideoIdx].heroEmbedUrl}
                      poster={PATINO_VIDEOS[heroVideoIdx].thumb}
                    />
                  ) : (
                    <iframe
                      key={PATINO_VIDEOS[heroVideoIdx].id}
                      className="w-full h-full border-none"
                      src={PATINO_VIDEOS[heroVideoIdx].heroEmbedUrl}
                      title={PATINO_VIDEOS[heroVideoIdx].title}
                      allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}

                  <button
                    onClick={() => setModalVideo(PATINO_VIDEOS[heroVideoIdx])}
                    className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-[#00135B] text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-[#F5C542]" />
                    Modo Ventana Emergente
                  </button>
                </div>

                {/* Video Selector Tabs */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {PATINO_VIDEOS.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setHeroVideoIdx(idx)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        heroVideoIdx === idx
                          ? "bg-[#00135B] border-[#F5C542] text-white shadow"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Play className={`w-3.5 h-3.5 shrink-0 ${heroVideoIdx === idx ? "text-[#F5C542] fill-current" : "text-white/40"}`} />
                      <div className="truncate">
                        <div className="text-[11px] font-bold truncate">{v.title}</div>
                        <div className="text-[9px] text-white/50 truncate">{v.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          2. MANIFIESTO "NUESTRAS BECAS"
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-50/40 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-blue-100 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 rounded-2xl bg-white border border-gray-100 p-3 shadow-md flex items-center justify-center shrink-0">
              <img src={patinoLogo} alt="Logo Fundación Patiño" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00135B]/5 border border-[#00135B]/15 text-[#00135B] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#5D8CE2]" />
                Nuestras Becas — Manifiesto Patiño
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#00135B] leading-snug border-l-4 border-[#F5C542] pl-4">
                &ldquo;A quienes encarnan la excelencia y el compromiso, la Fundación Patiño ofrece mucho más que apoyo: ofrece confianza.&rdquo;
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                Nuestras becas apoyan trayectorias profesionales prometedoras, tanto en Bolivia como a nivel internacional, para que cada talento pueda desarrollarse plenamente, con rigor, altos estándares y una sensación de recompensa.
              </p>

              <p className="text-slate-800 text-sm font-semibold italic bg-amber-50 p-4 rounded-xl border border-amber-200">
                &ldquo;Aprender es crecer. Transmitir el conocimiento es asegurar su impacto perdurable. Creemos que las mentes iluminadas, nutridas por el conocimiento y la responsabilidad, son las artífices de una Bolivia orgullosa, justa y radiante.&rdquo;
              </p>

              {/* Official Social Links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Redes Oficiales Fundación Patiño:</span>
                <a
                  href="https://www.youtube.com/@Fundaci%C3%B3nPati%C3%B1oEducaci%C3%B3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5 hover:bg-red-100 transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  YouTube Educación Patiño
                </a>
                <a
                  href="https://www.facebook.com/EspacioPatinoSantaCruz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Facebook Espacio Patiño
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
              Explora los seis pilares de cobertura integral otorgados por la Fundación Patiño para tus estudios de maestría en Suiza y Bélgica.
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
          4. NUESTRAS UNIVERSIDADES ASOCIADAS & CATÁLOGO DE MAESTRÍAS AUTORIZADAS (2026-2028)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="p-8 sm:p-10 rounded-3xl bg-[#00135B] text-white space-y-4 shadow-xl">
            <span className="text-xs font-black text-[#F5C542] uppercase tracking-widest">
              🇨🇭 SUIZA & 🇧🇪 BÉLGICA — CONVOCATORIA 2026–2028
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Nuestras universidades asociadas
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-4xl font-light">
              Son la vanguardia del conocimiento, tanto en Bolivia como a nivel internacional. Distinguidos y de mente abierta, cultivan el rigor, la curiosidad y la excelencia. Guardianes del progreso, forman las mentes que transformarán el mundo del mañana. Son un orgullo para nuestra red de excelencia.
            </p>
          </div>

          {/* Grid of 5 Associated Universities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {UNIVERSITIES.map((u) => (
              <div
                key={u.id}
                className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-lg transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {u.logo ? (
                      <div className="w-12 h-12 rounded-xl bg-white p-1 border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                        <img src={u.logo} alt={u.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#00135B] text-white flex items-center justify-center font-black text-sm shrink-0">
                        {u.shortName}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-slate-500">{u.flag} {u.country} • {u.city}</div>
                      <h3 className="text-base font-bold text-[#00135B]">{u.name}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    {u.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-[#00135B] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-block">
                      {u.programs.length} maestrías autorizadas (2026–2028)
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedUniPrograms(u)}
                    className="text-xs font-bold text-[#2563eb] hover:text-[#00135B] flex items-center gap-1 cursor-pointer"
                  >
                    Ver maestrías autorizadas <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-extrabold"
                    style={{ background: `${u.color}15`, color: u.color, border: `1px solid ${u.color}30` }}
                  >
                    {u.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          5. CRITERIOS DE ELECCIÓN
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Requisitos Institucionales
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00135B]">
              Criterios de Elección Exigidos
            </h2>
            <p className="text-slate-600 text-sm font-light">
              Condiciones requeridas para ser considerado candidato elegible a las Becas Simón I. Patiño:
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
          6. CALCULADORA INTERACTIVA DE ELEGIBILIDAD PATIÑO
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-blue-50/50 border-y border-blue-100">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-white text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Simulador en Tiempo Real
            </span>
            <h2 className="text-3xl font-extrabold text-[#00135B]">
              Calculadora de Elegibilidad Patiño
            </h2>
            <p className="text-slate-600 text-sm font-light">
              Verifica si tu promedio universitario (80/100 ó 90/100 EPFL) y tu perfil cumplen las exigencias.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-blue-100 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                  1. Universidad de Destino
                </label>
                <select
                  value={calcUni}
                  onChange={(e) => setCalcUni(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-slate-800 font-semibold text-sm focus:outline-none focus:border-[#5D8CE2]"
                >
                  {UNIVERSITIES.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.flag} {u.shortName} - {u.name} (Exige {u.minGpa}/100)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                    2. Tu Promedio Académico (0 a 100)
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

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider">
                    3. Tu Edad Actual
                  </label>
                  <span className={`text-sm font-extrabold ${calcAge < 30 ? "text-emerald-600" : "text-rose-600"}`}>
                    {calcAge} años
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="40"
                  value={calcAge}
                  onChange={(e) => setCalcAge(Number(e.target.value))}
                  className="w-full accent-[#00135B] cursor-pointer"
                />
              </div>

              <div className="space-y-2 text-xs">
                <label className="text-xs font-bold text-[#00135B] uppercase tracking-wider block mb-2">
                  4. Requisitos de Perfil
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" checked={calcBolivian} onChange={e => setCalcBolivian(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Nacionalidad boliviana y licenciatura en Bolivia
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" checked={calcEnglish} onChange={e => setCalcEnglish(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Inglés C1 / TOEFL ≥ 90 pts (o idioma de impartición)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="checkbox" checked={calcProject} onChange={e => setCalcProject(e.target.checked)} className="accent-[#00135B] w-4 h-4" />
                  Proyecto de aplicación para Bolivia (1 a 3 págs)
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
                    {isFullyEligible ? "¡Perfil Elegible para la Beca Patiño!" : "Revisión de Requisitos Necesaria"}
                  </h3>
                  <p className="text-xs sm:text-sm font-light">
                    {isFullyEligible ? (
                      <>Cumples con el promedio de nota exigido ({selectedUniObj.minGpa}/100) para <strong>{selectedUniObj.name}</strong> y las condiciones institucionales.</>
                    ) : (
                      <>
                        {!gpaPasses && `Tu promedio (${calcGpa}/100) es menor al exigido por ${selectedUniObj.shortName} (${selectedUniObj.minGpa}/100). `}
                        {!agePasses && `Se exige ser menor de 30 años (tienes ${calcAge}). `}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          7. GALERÍA DE VIDEOS CON VENTANA EMERGENTE
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-blue-50 text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
                Reproductor en Ventana Emergente
              </span>
              <h2 className="text-3xl font-extrabold text-[#00135B] mt-2">
                Conoce la Beca Patiño en Video
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Haz clic en cualquier video para reproducirlo directamente en una ventana emergente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PATINO_VIDEOS.map((v) => (
              <div
                key={v.id}
                onClick={() => setModalVideo(v)}
                className="p-4 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg card-hover cursor-pointer space-y-4 flex flex-col justify-between"
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

                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                    {v.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#00135B] leading-tight">{v.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 font-light">{v.desc}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#00135B]">
                  <span>Abrir ventana emergente</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#5D8CE2]" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          8. PREGUNTAS FRECUENTES OFICIALES CON BÚSQUEDA Y FILTRADO (CONVOCATORIA 2026-2028)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 text-[#00135B] border border-blue-200 text-xs font-bold uppercase tracking-wider">
              Banco Oficial de Respuestas 2026-2028
            </span>
            <h2 className="text-3xl font-extrabold text-[#00135B]">
              Preguntas Frecuentes — Becas Patiño
            </h2>
            <p className="text-slate-500 text-sm font-light">
              Consulta las respuestas oficiales de la Fundación Simón I. Patiño para maestrías en Suiza y Bélgica:
            </p>

            <div className="pt-4 max-w-md mx-auto relative">
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Buscar duda (ej: edad, promedio, maestría, TOEFL)..."
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
          9. FOOTER BANNER CTA
         ───────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#00135B] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-[#F5C542]">
            <GraduationCap className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black leading-tight">
            ¿Listo para tu maestría en <span style={{ color: "#F5C542" }}>Suiza o Bélgica</span>?
          </h2>

          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Comienza hoy tu preparación con el acompañamiento inteligente de EDULAB para la Fundación Simón I. Patiño.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleApply}
              className="px-8 py-4 rounded-full font-bold text-[#00135B] text-base transition-all hover:scale-105 cursor-pointer"
              style={{ background: "#F5C542", boxShadow: "0 4px 20px rgba(245,197,66,0.4)" }}
            >
              Iniciar postulación con IA
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-4 rounded-full font-bold text-white text-base hover:bg-white/10 border border-white/30 transition-all cursor-pointer"
            >
              Volver al Inicio
            </button>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/70">
            <span>Canales Oficiales Fundación Patiño:</span>
            <a
              href="https://www.youtube.com/@Fundaci%C3%B3nPati%C3%B1oEducaci%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-red-400" />
              YouTube Educación Patiño
            </a>
            <a
              href="https://www.facebook.com/EspacioPatinoSantaCruz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              Facebook Espacio Patiño Santa Cruz
            </a>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────────────
          MODAL DE PROGRAMAS DE MAESTRÍA AUTORIZADOS POR UNIVERSIDAD (2026-2028)
         ───────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedUniPrograms && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative border border-gray-100"
            >
              {/* Header */}
              <div className="p-6 bg-[#00135B] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {selectedUniPrograms.logo ? (
                    <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                      <img src={selectedUniPrograms.logo} alt={selectedUniPrograms.name} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center shrink-0">
                      {selectedUniPrograms.shortName}
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Maestrías Autorizadas 2026–2028</span>
                    <h3 className="text-lg font-bold text-white leading-tight">{selectedUniPrograms.name}</h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUniPrograms(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Programs List */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {selectedUniPrograms.programs.map((prog, pIdx) => (
                  <div key={pIdx} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white transition-all space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {prog.faculty}
                        </span>
                        <h4 className="text-base font-extrabold text-[#00135B] mt-1">{prog.title}</h4>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                          {prog.ects} ECTS • {prog.semesters} semestres
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1 font-medium">Idioma: {prog.lang}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-light">{prog.summary}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-200/80">
                      <div>
                        <strong className="text-[#00135B] font-bold block">Estudios previos requeridos:</strong>
                        <span className="text-slate-600">{prog.prerequisites}</span>
                      </div>
                      <div>
                        <strong className="text-[#00135B] font-bold block">Áreas de apoyo a Bolivia:</strong>
                        <span className="text-slate-600">{prog.boliviaSupport}</span>
                      </div>
                    </div>

                    {prog.brochureUrl && (
                      <div className="pt-2 text-right">
                        <a
                          href={prog.brochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] hover:text-[#00135B]"
                        >
                          Descargar folleto oficial (PDF) <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 text-right shrink-0">
                <button
                  onClick={() => setSelectedUniPrograms(null)}
                  className="px-5 py-2 rounded-xl bg-[#00135B] text-white font-bold text-xs hover:bg-blue-900 transition-all"
                >
                  Cerrar catálogo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


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
              className="bg-slate-900 border border-white/20 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 p-6 relative"
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
                {modalVideo.type === "mp4" ? (
                  <video controls autoPlay className="w-full h-full object-cover" src={modalVideo.modalEmbedUrl} />
                ) : (
                  <iframe
                    className="w-full h-full border-none"
                    src={modalVideo.modalEmbedUrl}
                    title={modalVideo.title}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Footer info */}
              <div className="text-xs text-slate-300 font-light flex items-center justify-between">
                <span>{modalVideo.desc}</span>
                <button
                  onClick={() => setModalVideo(null)}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
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
            <p className="text-sm text-slate-500">Crea tu cuenta gratis o inicia sesión para postularte a la Beca Patiño con el apoyo de IA de EDULAB.</p>
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
