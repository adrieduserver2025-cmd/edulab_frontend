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
  HelpCircle
} from "lucide-react";

interface SubmenuItem {
  title: string;
  desc: string;
  icon: any;
  highlight?: boolean;
}

export default function PublicNavbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const menuData: Record<string, SubmenuItem[]> = {
    Oportunidades: [
      { title: "Becas de Excelencia", desc: "Financiamiento completo para postgrados y pregrados.", icon: GraduationCap },
      { title: "Intercambios Académicos", desc: "Semestres en las mejores universidades del mundo.", icon: Globe },
      { title: "Summer Schools", desc: "Cursos cortos e intensivos de verano en el extranjero.", icon: BookOpen },
    ],
    Voluntariados: [
      { 
        title: "VOLUNTARIADO EN AIESEC", 
        desc: "Desarrolla tu liderazgo en proyectos sociales globales.", 
        icon: HeartHandshake, 
        highlight: true 
      },
      { title: "Voluntariado Ambiental ONU", desc: "Acción climática y conservación ecológica global.", icon: Globe },
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
    <nav className="w-full bg-white h-20 px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      {/* Brand Identity */}
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-[#00135B] flex items-center justify-center shadow-md shadow-[#00135B]/15 group-hover:scale-105 transition-all duration-200">
            <GraduationCap className="w-5.5 h-5.5 text-[#F5C542]" />
          </div>
          <span className="font-display font-extrabold text-2xl tracking-wider text-[#00135B]">
            EDU<span className="text-[#5D8CE2] font-semibold">LAB</span>
          </span>
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
                          onClick={() => handleLinkClick("/login")}
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
          <Link 
            to="/login" 
            className="text-[#00135B]/85 hover:text-[#5D8CE2] font-semibold text-sm cursor-pointer transition-colors duration-200"
          >
            Testimonios
          </Link>
        </div>
      </div>

      {/* Auth Control Buttons */}
      <div className="flex items-center gap-6">
        <Link 
          to="/login" 
          className="text-[#00135B]/85 hover:text-[#5D8CE2] font-bold text-sm transition-colors duration-200"
        >
          Iniciar Sesión
        </Link>
        
        <Link
          to="/login"
          className="px-6 py-2.5 rounded-full bg-[#00135B] hover:bg-[#0d288c] text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-md shadow-[#00135B]/20 hover:scale-102 hover:shadow-[#00135B]/30 cursor-pointer"
        >
          Registrarse
        </Link>
      </div>
    </nav>
  );
}
