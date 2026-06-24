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

export default function PublicNavbar({ onOpenAuth }: PublicNavbarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
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
              src="/src/assets/isotipo.png" 
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
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-[calc(100%-8px)] left-0 w-80 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl p-4 flex flex-col gap-2 z-50"
                  >
                    {menuData[menu]?.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (item.slug) {
                              // Fulbright and scholarships use /becas/ route (PremiumScholarshipPage)
                              if (item.slug === "fulbright-beca") {
                                navigate(`/becas/${item.slug}`);
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
                    })}
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
