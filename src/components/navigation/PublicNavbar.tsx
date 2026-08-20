import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  ChevronDown, 
  Sparkles, 
  Globe, 
  BookOpen, 
  HeartHandshake, 
  Cpu, 
  Briefcase, 
  MessageSquare,
  HelpCircle,
  Bell,
  User,
  Settings,
  Moon,
  Grid,
  DollarSign,
  ShoppingCart,
  Laptop,
  LogOut,
  Building,
  ChevronRight
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import isotipo from "../../assets/isotipo.png";

interface SubmenuItem {
  title: string;
  desc: string;
  icon: any;
  highlight?: boolean;
  slug?: string;
}

interface PublicNavbarProps {
  onOpenAuth?: (mode: "login" | "register") => void;
}

const OPPORTUNITIES_BY_CONTINENT = [
  {
    continent: "América",
    emoji: "🌎",
    color: "#2563eb",
    items: [
      { title: "Beca Fulbright", desc: "Estudia en EE.UU. con financiamiento 100%.", slug: "fulbright-beca", flag: "🇺🇸", tag: "EE.UU." },
      { title: "Beca OEA - GCUB", desc: "Maestrías y posgrados en 50+ universidades de Brasil.", slug: "oea-gcub-brasil-beca", flag: "🇧🇷", tag: "Brasil" },
      { title: "Fulbright Visiting Scholar", desc: "Investigación avanzada de 3 a 9 meses en EE.UU.", slug: "fulbright-visiting-scholar-beca", flag: "🇺🇸", tag: "EE.UU." },
      { title: "ELAP Canadá", desc: "Intercambios de 4 a 6 meses financiados en Canadá.", slug: "elap-canada-beca", flag: "🇨🇦", tag: "Canadá", highlight: true },
      { title: "Programa SUSI EE.UU.", desc: "Inmersión académica y de liderazgo de 5 a 6 semanas.", slug: "susi-eeuu-beca", flag: "🇺🇸", tag: "EE.UU." },
      { title: "Becas OEA Cursos Cortos", desc: "Capacitación profesional presencial y online.", slug: "oea-cursos-desarrollo-beca", flag: "🌎", tag: "Américas" },
      { title: "Becas TWAS Sur Global", desc: "Estancias doctorales y posdoctorales en Brasil/Sur Global.", slug: "twas-desarrollo-beca", flag: "🇧🇷", tag: "Brasil" }
    ]
  },
  {
    continent: "Europa",
    emoji: "🇪🇺",
    color: "#059669",
    items: [
      { title: "Becas Patiño", desc: "Maestría para bolivianos en Suiza y Bélgica.", slug: "patino-beca", flag: "🇨🇭🇧🇪", tag: "Suiza/Bélgica", highlight: true },
      { title: "Fundación Carolina", desc: "Posgrado y doctorado en España.", slug: "fundacion-carolina-beca", flag: "🇪🇸", tag: "España" },
      { title: "Chevening UK", desc: "Maestrías de 1 año 100% financiadas en el Reino Unido.", slug: "chevening-uk-beca", flag: "🇬🇧", tag: "Reino Unido", highlight: true },
      { title: "Erasmus Mundus", desc: "Maestrías conjuntas internacionales.", slug: "erasmus-mundus-beca", flag: "🇪🇺", tag: "Unión Europea" },
      { title: "Politécnico de Milán", desc: "Becas de excelencia para maestrías en Italia.", slug: "politecnico-milano-beca", flag: "🇮🇹", tag: "Italia", highlight: true },
      { title: "Beca DAAD EPOS", desc: "Posgrados en desarrollo en Alemania.", slug: "daad-epos-beca", flag: "🇩🇪", tag: "Alemania" },
      { title: "Gobierno Suizo Research", desc: "Estancias de investigación de posgrado en Suiza.", slug: "suiza-research-fellowship-beca", flag: "🇨🇭", tag: "Suiza" },
      { title: "Stipendium Hungaricum", desc: "Grado y posgrados en inglés en Hungría (SEGIB).", slug: "stipendium-hungaricum-beca", flag: "🇭🇺", tag: "Hungría" },
      { title: "SI Scholarships Suecia", desc: "Maestrías con 11.000 SEK/mes de estipendio.", slug: "swedish-institute-siss-beca", flag: "🇸🇪", tag: "Suecia" },
      { title: "Becas ARES Bélgica", desc: "Maestrías de especialización en la Bélgica francófona.", slug: "ares-belgica-beca", flag: "🇧🇪", tag: "Bélgica" },
      { title: "DAAD Investigación", desc: "Estancias doctorales de 1 a 6 meses en Alemania.", slug: "daad-investigacion-beca", flag: "🇩🇪", tag: "Alemania" },
      { title: "Humboldt Research", desc: "Becas postdoctorales autónomas en Alemania.", slug: "humboldt-research-beca", flag: "🇩🇪", tag: "Alemania" }
    ]
  },
  {
    continent: "Asia",
    emoji: "🌏",
    color: "#7c3aed",
    items: [
      { title: "GKS Corea del Sur", desc: "Beca integral + 1 año de idioma coreano.", slug: "gks-korea-beca", flag: "🇰🇷", tag: "Corea del Sur" },
      { title: "Beca MEXT Japón", desc: "Pregrado completo + 1 año intensivo de japonés.", slug: "mext-japon-beca", flag: "🇯🇵", tag: "Japón", highlight: true },
      { title: "Beca Türkiye Burslari", desc: "Pregrado y posgrado con residencia y turco gratis.", slug: "turkiye-burslari-beca", flag: "🇹🇷", tag: "Turquía" }
    ]
  }
];

const VOLUNTEERS_BY_CONTINENT = [
  {
    continent: "América",
    emoji: "🌎",
    color: "#2563eb",
    items: [
      { title: "Voluntariado AIESEC", desc: "Proyectos de impacto social internacional.", slug: "aiesec-voluntariado", flag: "🌎", tag: "AIESEC" },
      { title: "Voluntariado TECHO", desc: "Construcción comunitaria y desarrollo social.", slug: "techo-voluntariado", flag: "🇧🇴", tag: "TECHO", highlight: true },
      { title: "Fellows América Solidaria", desc: "Superación de la pobreza por 1 año en las Américas.", slug: "america-solidaria-voluntariado", flag: "🌎", tag: "América Solidaria", highlight: true }
    ]
  },
  {
    continent: "Global",
    emoji: "🇺🇳",
    color: "#0284c7",
    items: [
      { title: "UN Youth Volunteers", desc: "Proyectos humanitarios y de desarrollo con agencias de la ONU.", slug: "un-voluntariado", flag: "🇺🇳", tag: "ONU", highlight: true }
    ]
  }
];

export default function PublicNavbar({ onOpenAuth }: PublicNavbarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeContinent, setActiveContinent] = useState<string>("Europa");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Auth Store details
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLinkClick = (path: string) => {
    if (path === "/login" || path === "/register") {
      onOpenAuth?.(path === "/register" ? "register" : "login");
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    await logout();
    setProfileMenuOpen(false);
    window.location.href = "/";
  };

  const menuData: Record<string, SubmenuItem[]> = {
    Oportunidades: [
      { title: "Becas de Excelencia", desc: "Financiamiento completo para postgrados y pregrados.", icon: GraduationCap, slug: "daad-beca" },
      { title: "Beca Fulbright 🇺🇸", desc: "Estudia una maestría en EE.UU. con financiamiento 100%.", icon: DollarSign, slug: "fulbright-beca", highlight: false },
      { title: "Intercambios Académicos", desc: "Semestres en las mejores universidades del mundo.", icon: Globe, slug: "u-tokyo-exchange" },
      { title: "Summer Schools", desc: "Cursos cortos e intensivos de verano en el extranjero.", icon: BookOpen, slug: "oxford-summer-school" },
    ],
    Voluntariados: [
      { 
        title: "VOLUNTARIADO EN AIESEC", 
        desc: "Desarrolla tu liderazgo en proyectos sociales globales.", 
        icon: HeartHandshake, 
        highlight: true,
        slug: "aiesec-voluntariado"
      },
      { 
        title: "VOLUNTARIADO CON TECHO", 
        desc: "Construcción comunitaria y desarrollo social en asentamientos.", 
        icon: HeartHandshake, 
        highlight: true,
        slug: "techo-voluntariado"
      },
      { title: "Voluntariado Ambiental ONU", desc: "Acción climática y conservación ecológica global.", icon: Globe, slug: "onu-voluntariado" },
      { title: "Cruz Roja Internacional", desc: "Apoyo humanitario y salud comunitaria.", icon: HeartHandshake },
    ],
    IA: [
      { title: "Matching Inteligente", desc: "Emparejamiento perfecto según tu historial académico.", icon: Cpu },
      { title: "Optimización de CV", desc: "Mejora y adapta tu perfil profesional a estándares globales.", icon: Briefcase },
      { title: "Simulador de Entrevista", desc: "Simulación conversacional interactiva por voz o texto.", icon: MessageSquare },
    ],
    "Cómo Funciona": [
      { title: "Diagnóstico de Perfil", desc: "Carga tu historial y detecta fortalezas académicas.", icon: HelpCircle },
      { title: "Optimización y Redacción", desc: "Generación guiada de cartas motivacionales.", icon: Sparkles },
    ]
  };

  return (
    <nav className="w-full bg-white h-20 px-8 flex items-center justify-between border-b border-gray-100 fixed top-0 left-0 right-0 z-50 shadow-sm text-gray-700">
      {/* Brand Identity */}
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src={isotipo} 
              alt="EDULAB"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center leading-none">
            <span className="font-display text-4xl font-medium tracking-tight text-[#0036A3]">
              edu
            </span>
            <span className="font-display text-4xl font-medium tracking-tight text-[#F5A400]">
              lab
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <div className="hidden lg:flex items-center gap-8 h-full">
          {["Oportunidades", "Voluntariados", "IA", "Cómo Funciona"].map((menu) => (
            <div
              key={menu}
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveMenu(menu)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center gap-1 text-[#00135B]/85 hover:text-[#5D8CE2] font-semibold text-sm py-2 cursor-pointer transition-colors duration-200">
                <span>{menu}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMenu === menu ? "rotate-180 text-[#5D8CE2]" : "text-[#00135B]/40"}`} />
              </button>

              {/* Hover Dropdowns */}
              <AnimatePresence>
                {activeMenu === menu && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className={`absolute top-[calc(100%-4px)] left-0 bg-white/98 backdrop-blur-2xl border border-slate-200/80 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 z-50 ${
                      menu === "Oportunidades" ? "w-[720px]" : menu === "Voluntariados" ? "w-[640px]" : "w-80"
                    }`}
                  >
                    {menu === "Oportunidades" || menu === "Voluntariados" ? (
                      <div className="flex gap-4">
                        {/* Left Column: Continentes / Regiones */}
                        <div className="w-44 shrink-0 border-r border-slate-100 pr-3 space-y-1.5">
                          <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Regiones & Filtros
                          </div>
                          {(menu === "Oportunidades" ? OPPORTUNITIES_BY_CONTINENT : VOLUNTEERS_BY_CONTINENT).map((group) => {
                            const isSelected = activeContinent === group.continent || 
                              (!OPPORTUNITIES_BY_CONTINENT.some(g => g.continent === activeContinent) && !VOLUNTEERS_BY_CONTINENT.some(g => g.continent === activeContinent) && group.continent === (menu === "Oportunidades" ? "Europa" : "América"));
                            return (
                              <div
                                key={group.continent}
                                onMouseEnter={() => setActiveContinent(group.continent)}
                                onClick={() => setActiveContinent(group.continent)}
                                className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 ${
                                  isSelected
                                    ? "bg-[#00135B] text-white font-bold shadow-md border-l-4 border-[#F5C542]"
                                    : "hover:bg-slate-100/80 text-slate-700 font-medium"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{group.emoji}</span>
                                  <span className="text-xs tracking-tight">{group.continent}</span>
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-[#F5C542]" : "text-slate-400"}`} />
                              </div>
                            );
                          })}
                        </div>

                        {/* Right Column: Grid of Items for Active Continent */}
                        <div className="flex-1 space-y-2.5 min-w-0">
                          {(() => {
                            const continentList = menu === "Oportunidades" ? OPPORTUNITIES_BY_CONTINENT : VOLUNTEERS_BY_CONTINENT;
                            const currentGroup = continentList.find(g => g.continent === activeContinent) || continentList[0];
                            
                            return (
                              <>
                                <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-[#00135B] to-[#0d288c] rounded-xl text-white shadow-sm">
                                  <span className="text-xs font-extrabold flex items-center gap-1.5">
                                    <span>{currentGroup.emoji}</span>
                                    <span>{currentGroup.continent}</span>
                                    <span className="text-white/60 font-normal">({menu})</span>
                                  </span>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#F5C542] text-[#00135B]">
                                    {currentGroup.items.length} {currentGroup.items.length === 1 ? "opción" : "opciones"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                                  {currentGroup.items.map((item) => (
                                    <div
                                      key={item.slug}
                                      onClick={() => {
                                        setActiveMenu(null);
                                        if (item.slug.includes("-beca")) {
                                          navigate(`/becas/${item.slug}`);
                                        } else if (item.slug.includes("voluntariado")) {
                                          navigate(`/voluntariados/${item.slug}`);
                                        } else {
                                          navigate(`/opportunities/${item.slug}`);
                                        }
                                      }}
                                      className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group/item border flex flex-col justify-between ${
                                        (item as any).highlight
                                          ? "bg-amber-500/5 hover:bg-amber-500/15 border-amber-200/80 hover:border-amber-400 shadow-sm"
                                          : "bg-white hover:bg-slate-50 border-slate-200/60 hover:border-[#5D8CE2]/60 hover:shadow-md"
                                      }`}
                                    >
                                      <div>
                                        <div className="flex items-start justify-between gap-1.5 mb-1">
                                          <span className="text-xs font-black text-[#00135B] group-hover/item:text-[#5D8CE2] flex items-center gap-1.5 leading-snug">
                                            <span className="text-sm shrink-0">{item.flag}</span>
                                            <span className="line-clamp-1">{item.title}</span>
                                          </span>
                                        </div>
                                        <p className="text-[10.5px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
                                          {item.desc}
                                        </p>
                                      </div>
                                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                          {item.tag}
                                        </span>
                                        <span className="text-[10px] font-bold text-[#5D8CE2] opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-0.5">
                                          Ver ficha →
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      menuData[menu]?.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setActiveMenu(null);
                              if (item.slug) {
                                if (item.slug.endsWith("-beca")) {
                                  navigate(`/becas/${item.slug}`);
                                } else if (item.slug === "techo-voluntariado" || item.slug === "techo") {
                                  navigate(`/voluntariados/techo-voluntariado`);
                                } else {
                                  navigate(`/opportunities/${item.slug}`);
                                }
                              } else {
                                if (isAuthenticated) {
                                  if (menu === "IA") navigate("/ai-tools");
                                  else if (menu === "Oportunidades" || menu === "Voluntariados") navigate("/programs");
                                } else {
                                  handleLinkClick("/login");
                                }
                              }
                            }}
                            className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group/item
                              ${item.highlight 
                                ? "bg-amber-500/5 hover:bg-amber-500/10 border border-[#F5C542]/20 hover:border-[#F5C542]/40" 
                                : "hover:bg-gray-50 border border-transparent"}`}
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border
                              ${item.highlight 
                                ? "bg-amber-500/10 border-[#F5C542]/30" 
                                : "bg-gray-50 border-gray-100 group-hover/item:border-[#5D8CE2]/20"}`}>
                              <Icon className={`w-4.5 h-4.5 ${item.highlight ? "text-[#F5C542]" : "text-[#00135B]/60 group-hover/item:text-[#5D8CE2]"}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold font-display ${item.highlight ? "text-[#00135B]" : "text-[#00135B]/90 group-hover/item:text-[#5D8CE2]"}`}>
                                  {item.title}
                                </span>
                                {item.highlight && (
                                  <Sparkles className="w-3.5 h-3.5 text-[#F5C542] animate-pulse" />
                                )}
                              </div>
                              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Testimonios Link */}
          <button 
            onClick={() => {
              if (isAuthenticated) {
                // Scroll to testimonials
                document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" });
              } else {
                onOpenAuth?.("login");
              }
            }}
            className="text-[#00135B]/85 hover:text-[#5D8CE2] font-semibold text-sm cursor-pointer transition-colors duration-200 bg-transparent border-none"
          >
            Testimonios
          </button>
        </div>
      </div>

      {/* Auth Control Buttons or Logged-in State */}
      <div className="flex items-center gap-6">
        {!isAuthenticated ? (
          <>
            <button 
              onClick={() => onOpenAuth?.("login")}
              className="text-[#00135B]/85 hover:text-[#5D8CE2] font-bold text-sm transition-colors duration-200 cursor-pointer bg-transparent border-none"
            >
              Iniciar Sesión
            </button>
            
            <button
              onClick={() => onOpenAuth?.("register")}
              className="px-6 py-2.5 rounded-full bg-[#00135B] hover:bg-[#0d288c] text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-md shadow-[#00135B]/20 hover:scale-102 hover:shadow-[#00135B]/30 cursor-pointer"
            >
              Registrarse
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {/* Notifications Bell */}
            <button className="relative p-2 rounded-xl text-gray-400 hover:text-[#00135B] hover:bg-gray-50 transition-all duration-200 cursor-pointer border-none bg-transparent">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F5C542] rounded-full animate-pulse"></span>
            </button>

            {/* "Tu Perfil" text link */}
            <button
              onClick={() => navigate("/profile")}
              className="text-xs font-bold text-[#00135B] hover:text-[#5D8CE2] transition-colors cursor-pointer bg-transparent border-none"
            >
              Tu Perfil
            </button>

            {/* Profile Avatar with Dropdown on Hover */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setProfileMenuOpen(true)}
              onMouseLeave={() => setProfileMenuOpen(false)}
            >
              {/* Avatar circle */}
              <button className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00135B] to-[#5D8CE2] hover:scale-105 transition-all duration-200 flex items-center justify-center font-bold text-xs text-white border-none cursor-pointer">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (user?.email || "EP").substring(0, 2).toUpperCase()
                )}
              </button>

              {/* Canva-style Hover Menu */}
              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-[100%] w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 flex flex-col gap-3 text-left"
                  >
                    {/* User Profile Summary */}
                    <div 
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group"
                    >
                      <div className="w-11 h-11 rounded-full bg-[#00135B] flex items-center justify-center text-white font-bold text-sm">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          (user?.email || "EP").substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#00135B] truncate leading-none mb-1">
                          {user?.displayName || user?.email?.split("@")[0]}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate leading-none">
                          {user?.email}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Team Section */}
                    <div className="p-2 border-t border-gray-50">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Equipos</p>
                      <button
                        disabled
                        className="w-full py-2 px-3 border border-dashed border-gray-200 rounded-xl text-[10px] font-semibold text-gray-400 flex items-center justify-center gap-2 bg-gray-50 cursor-not-allowed"
                      >
                        <Building className="w-3.5 h-3.5" />
                        <span>Crear un equipo (Próximamente)</span>
                      </button>
                    </div>

                    {/* Main Menu Actions */}
                    <div className="flex flex-col gap-1 border-t border-gray-50 pt-2">
                      
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold text-[#00135B] hover:bg-gray-50 transition-colors cursor-pointer bg-transparent border-none w-full"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span>Configuración</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold text-[#00135B] hover:bg-gray-50 transition-colors cursor-pointer bg-transparent border-none w-full"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span>Mi cuenta</span>
                      </button>

                      <div className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-gray-400 hover:bg-gray-50 transition-colors w-full cursor-not-allowed select-none">
                        <div className="flex items-center gap-3">
                          <Moon className="w-4 h-4 text-gray-300" />
                          <span>Tema</span>
                        </div>
                        <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">Próximamente</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-gray-400 hover:bg-gray-50 transition-colors w-full cursor-not-allowed select-none">
                        <div className="flex items-center gap-3">
                          <HelpCircle className="w-4 h-4 text-gray-300" />
                          <span>Ayuda y recursos</span>
                        </div>
                        <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">Próximamente</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-gray-400 hover:bg-gray-50 transition-colors w-full cursor-not-allowed select-none">
                        <div className="flex items-center gap-3">
                          <Grid className="w-4 h-4 text-gray-300" />
                          <span>Herramientas avanzadas</span>
                        </div>
                        <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">Beta</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-gray-400 hover:bg-gray-50 transition-colors w-full cursor-not-allowed select-none">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-gray-300" />
                          <span>Planes y precios</span>
                        </div>
                        <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">Próximamente</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-gray-400 hover:bg-gray-50 transition-colors w-full cursor-not-allowed select-none">
                        <div className="flex items-center gap-3">
                          <ShoppingCart className="w-4 h-4 text-gray-300" />
                          <span>Historial de compra</span>
                        </div>
                        <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">Próximamente</span>
                      </div>

                    </div>

                    {/* Download App & Logout */}
                    <div className="flex flex-col gap-1 border-t border-gray-50 pt-2 text-[11px]">
                      
                      <div className="flex items-center justify-between p-2 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors w-full cursor-not-allowed select-none">
                        <div className="flex items-center gap-3">
                          <Laptop className="w-4 h-4 text-gray-300" />
                          <span>Descargar app EDULAB</span>
                        </div>
                        <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">Próximamente</span>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer bg-transparent border-none w-full"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Cerrar sesión</span>
                      </button>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
