import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  Cpu,
  Heart,
  Target,
  FileText,
  User,
  MessageSquare,
  TrendingUp,
  Brain,
  UserPlus,
  Search,
  FileCheck,
  Send,
  Star,
  Award
} from "lucide-react";
import PublicNavbar from "../../components/navigation/PublicNavbar";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  // 6 AI Features Data
  const aiFeatures = [
    {
      title: "Matching Inteligente",
      desc: "Nuestro algoritmo de IA analiza tu perfil académico y encuentra las oportunidades con mayor probabilidad de éxito.",
      icon: Target,
      badge: "94% de precisión",
      color: "bg-[#3b82f6]"
    },
    {
      title: "Generador de Cartas",
      desc: "Crea cartas de motivación personalizadas y convincentes adaptadas a cada programa.",
      icon: FileText,
      badge: "500+ generadas",
      color: "bg-[#ec4899]"
    },
    {
      title: "Revisión de CV",
      desc: "IA que optimiza tu currículum según estándares internacionales y requisitos específicos.",
      icon: User,
      badge: "ATS Optimized",
      color: "bg-[#f59e0b]"
    },
    {
      title: "Simulación de Entrevistas",
      desc: "Practica con nuestro asistente IA y recibe feedback en tiempo real de tus respuestas.",
      icon: MessageSquare,
      badge: "Real time feedback",
      color: "bg-[#10b981]"
    },
    {
      title: "Comparación Competitiva",
      desc: "Compara tu perfil con becarios exitosos y descubre áreas clave de mejora.",
      icon: TrendingUp,
      badge: "Score dinámico",
      color: "bg-[#f43f5e]"
    },
    {
      title: "Score de Competitividad",
      desc: "Obtén un puntaje en tiempo real de tus probabilidades de aceptación.",
      icon: Brain,
      badge: "Actualización",
      color: "bg-[#8b5cf6]"
    }
  ];

  // 6 Steps Data with Color-Matched styling
  const steps = [
    { num: "01", title: "Completa tu perfil", desc: "Registra tus notas, idiomas y preferencias académicas de forma sencilla.", icon: UserPlus, borderColor: "border-[#0ea5e9]/40", textColor: "text-[#0ea5e9]", iconBg: "bg-[#0ea5e9]/10" },
    { num: "02", title: "La IA analiza tus fortalezas", desc: "Nuestros algoritmos de IA mapean tu perfil contra estándares globales.", icon: Sparkles, borderColor: "border-[#ec4899]/40", textColor: "text-[#ec4899]", iconBg: "bg-[#ec4899]/10" },
    { num: "03", title: "Encuentra oportunidades compatibles", desc: "Accede instantáneamente a becas y voluntariados 100% compatibles contigo.", icon: Search, borderColor: "border-[#f59e0b]/40", textColor: "text-[#f59e0b]", iconBg: "bg-[#f59e0b]/10" },
    { num: "04", title: "Optimiza tus documentos", desc: "Adapta tu currículum y genera cartas persuasivas guiado por copilotos IA.", icon: FileCheck, borderColor: "border-[#10b981]/40", textColor: "text-[#10b981]", iconBg: "bg-[#10b981]/10" },
    { num: "05", title: "Prepárate para entrevistas", desc: "Simula cuestionarios interactivos por audio y texto con feedback real.", icon: MessageSquare, borderColor: "border-[#8b5cf6]/40", textColor: "text-[#8b5cf6]", iconBg: "bg-[#8b5cf6]/10" },
    { num: "06", title: "Postula estratégicamente", desc: "Completa tus aplicaciones con un perfil robusto y seguimiento en tiempo real.", icon: Send, borderColor: "border-[#fb7185]/40", textColor: "text-[#fb7185]", iconBg: "bg-[#fb7185]/10" }
  ];

  // 6 Testimonials Data
  const testimonials = [
    { name: "María González", rol: "Beca Fulbright", prog: "MIT", quote: "El matching inteligente de la IA acertó al 100% con los requisitos que mi perfil cumplía en Boston.", country: "Colombia", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    { name: "Carlos Ramírez", rol: "Beca Chevening", prog: "Oxford University", quote: "El generador de cartas motivacionales me ayudó a pulir mi redacción y destacar mi liderazgo social.", country: "México", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
    { name: "Ana Martínez", rol: "Beca DAAD", prog: "TU Munich", quote: "La revisión de CV por IA optimizó mi currículum logrando pasar los filtros de selección alemanes.", country: "Chile", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
    { name: "Diego Torres", rol: "Beca Erasmus Mundus", prog: "Sorbonne / Bologna", quote: "Simular la entrevista académica con la IA de EDULAB redujo mis nervios y me dio las respuestas clave.", country: "Perú", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
    { name: "Sofía Vargas", rol: "Rhodes Scholar", prog: "Oxford University", quote: "EDULAB me permitió comparar mi perfil con ganadores previos, enfocando mis esfuerzos donde importaba.", country: "Ecuador", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
    { name: "Andrés Palacios", rol: "Beca MEXT", prog: "University of Tokyo", quote: "Lograr mi beca a Japón parecía imposible, pero el score de competitividad me guio paso a paso.", country: "Argentina", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150" }
  ];

  return (
    <div className="w-full min-h-screen bg-white text-[#00135B] flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. Navbar */}
      <PublicNavbar />

      {/* 2. Hero Section (Deep Blue Gradient Container with Separated Grid Layer) */}
      <section className="relative w-full bg-gradient-to-b from-[#00135B] via-[#001a7a] to-[#0d288c] text-white overflow-hidden py-24 px-6 z-10 flex flex-col items-center">
        
        {/* Isolated Moving Square Grid Layer (Fixes CSS Overwriting Conflict) */}
        <div className="absolute inset-0 tech-grid opacity-75 pointer-events-none z-0"></div>

        {/* Glow Orbs */}
        <div className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-[#5D8CE2]/20 filter blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[#F5C542]/10 filter blur-[130px] pointer-events-none -z-10"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl w-full flex flex-col items-center text-center space-y-8 relative z-10"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#5D8CE2] shadow-[0_0_15px_rgba(93,140,226,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-[#F5C542] animate-pulse" />
            <span className="font-display font-medium text-gray-300">Powered by Artificial Intelligence</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            className="font-display text-5xl md:text-8xl font-extrabold leading-tight tracking-tight max-w-5xl mx-auto"
          >
            Tu futuro internacional <br />
            <span className="mt-4 block font-extrabold">
              <span className="text-[#F5C542]">impulsado por</span> <span className="bg-gradient-to-r from-[#60A5FA] to-[#FFFFFF] bg-clip-text text-transparent">IA</span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Descubre becas, voluntariados y oportunidades internacionales con ayuda inteligente.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <a
              href="#opportunities"
              className="px-8 py-4 rounded-xl bg-[#F5C542] hover:bg-[#ebd035] text-[#00135B] font-bold text-base flex items-center gap-2.5 transition-all duration-300 shadow-[0_4px_30px_rgba(245,197,66,0.15)] hover:scale-105 cursor-pointer"
            >
              Explorar oportunidades 
              <ArrowRight className="w-5 h-5 text-[#00135B]" />
            </a>
            
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl border border-white/20 hover:border-[#5D8CE2]/50 bg-white/5 hover:bg-white/10 text-white font-bold text-base flex items-center gap-2.5 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Cpu className="w-5 h-5 text-[#5D8CE2]" />
              Analizar mi perfil con IA
            </Link>
          </motion.div>

          {/* Screenshot 4 Aligned Dashboard Mockup */}
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-5xl pt-16"
          >
            <div className="glass-panel p-8 rounded-[24px] border border-white/10 shadow-2xl relative bg-gradient-to-tr from-white/5 to-white/[0.01]">
              <div className="absolute inset-0 bg-[#00135B]/20 rounded-[24px] filter blur-xl -z-10"></div>
              
              <h3 className="font-display font-bold text-2xl mb-2 text-white">Dashboard Inteligente</h3>
              <p className="text-xs text-gray-400 mb-8">Toda tu información analizada en tiempo real</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Metric 1 */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-left space-y-3 shadow-inner">
                  <span className="text-[10px] text-[#F5C542] uppercase font-bold tracking-wider">Perfil Completado</span>
                  <p className="text-3xl font-extrabold font-display text-white">85%</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-gradient-to-r from-[#5D8CE2] to-[#F5C542] rounded-full"></div>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-left space-y-2 shadow-inner">
                  <span className="text-[10px] text-[#8b5cf6] uppercase font-bold tracking-wider">Oportunidades Match</span>
                  <p className="text-3xl font-extrabold font-display text-white">32</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">+8 esta semana</span>
                </div>

                {/* Metric 3 */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-left space-y-2 shadow-inner">
                  <span className="text-[10px] text-[#fb7185] uppercase font-bold tracking-wider">Score Competitivo</span>
                  <p className="text-3xl font-extrabold font-display text-white">A+</p>
                  <span className="text-[10px] text-gray-400 font-semibold">top 10% global</span>
                </div>

                {/* Metric 4 */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-left space-y-2 shadow-inner">
                  <span className="text-[10px] text-[#0ea5e9] uppercase font-bold tracking-wider">Postulaciones</span>
                  <p className="text-3xl font-extrabold font-display text-white">5</p>
                  <span className="text-[10px] text-gray-400 font-semibold">En proceso</span>
                </div>

              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 3. Programs Section (Pure White Solid Background - Covers the Grid) */}
      <section id="opportunities" className="w-full bg-white py-24 px-6 z-20 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-4xl text-[#00135B] tracking-tight">
              Explora Oportunidades
            </h2>
            <p className="text-sm text-gray-400 font-semibold leading-relaxed">
              Encuentra el programa perfecto para tu perfil académico y profesional
            </p>
          </div>

          {/* Centered column layout displaying ONLY Becas & Voluntariados (one per row) */}
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            
            {/* Card 1: Becas Internacionales */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white p-8 rounded-[20px] shadow-[0_15px_40px_-15px_rgba(0,19,91,0.08)] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group text-left"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                {/* Icon square */}
                <div className="w-14 h-14 rounded-[16px] bg-[#0ea5e9] flex items-center justify-center shadow-lg shadow-[#0ea5e9]/10 shrink-0">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                
                {/* Info Text */}
                <div className="space-y-2 flex-1">
                  <h3 className="font-display font-extrabold text-xl text-[#00135B] group-hover:text-[#5D8CE2] transition-colors duration-200">
                    Becas Internacionales
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    Financiamiento completo para estudios de grado y posgrado en universidades de prestigio global.
                  </p>
                  
                  {/* Horizontal Key Specifications */}
                  <div className="flex items-center gap-5 flex-wrap pt-2 text-[11px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 uppercase">País:</span>
                      <span className="text-[#00135B]">Global</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 uppercase">Financiamiento:</span>
                      <span className="text-[#5D8CE2]">100% Financiado</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 uppercase">Nivel:</span>
                      <span className="text-[#00135B]">Pregrado & Posgrado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Trigger Button */}
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:from-[#0d288c] hover:to-blue-400 text-white font-bold text-xs tracking-wider uppercase text-center shadow-md shadow-[#00135B]/10 shrink-0 hover:scale-102 transition-all duration-200 cursor-pointer"
              >
                Ver Detalles
              </Link>
            </motion.div>

            {/* Card 2: Voluntariados */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="bg-white p-8 rounded-[20px] shadow-[0_15px_40px_-15px_rgba(0,19,91,0.08)] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group text-left"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                {/* Icon square */}
                <div className="w-14 h-14 rounded-[16px] bg-[#ec4899] flex items-center justify-center shadow-lg shadow-[#ec4899]/10 shrink-0">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                
                {/* Info Text */}
                <div className="space-y-2 flex-1">
                  <h3 className="font-display font-extrabold text-xl text-[#00135B] group-hover:text-[#5D8CE2] transition-colors duration-200">
                    Voluntariados
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    Proyectos de impacto social y comunitario con la red de voluntariado más grande del mundo.
                  </p>
                  
                  {/* Horizontal Key Specifications */}
                  <div className="flex items-center gap-5 flex-wrap pt-2 text-[11px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 uppercase">País:</span>
                      <span className="text-[#00135B]">Europa & África</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 uppercase">Financiamiento:</span>
                      <span className="text-[#5D8CE2]">Gastos Cubiertos</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 uppercase">Nivel:</span>
                      <span className="text-[#00135B]">Todos los niveles</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Trigger Button */}
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:from-[#0d288c] hover:to-blue-400 text-white font-bold text-xs tracking-wider uppercase text-center shadow-md shadow-[#00135B]/10 shrink-0 hover:scale-102 transition-all duration-200 cursor-pointer"
              >
                Ver Detalles
              </Link>
            </motion.div>

          </div>

          <div className="text-center pt-8">
            <Link
              to="/login"
              className="inline-block px-8 py-3.5 rounded-xl bg-[#F5C542] hover:bg-[#ebd035] text-[#00135B] font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 cursor-pointer shadow-md shadow-[#F5C542]/20"
            >
              Ver Todas las Oportunidades
            </Link>
          </div>
        </div>
      </section>

      {/* 4. AI Features Section (Deep Navy with Separated Grid Layer) */}
      <section className="relative w-full bg-gradient-to-b from-[#00135B] to-[#001a7a] text-white py-24 px-6 z-10 flex flex-col items-center">
        
        {/* Isolated Moving Square Grid Layer */}
        <div className="absolute inset-0 tech-grid opacity-75 pointer-events-none z-0"></div>

        {/* Glow Spheres */}
        <div className="absolute top-[20%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[#5D8CE2]/10 filter blur-[130px] pointer-events-none -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl w-full space-y-16 relative z-10"
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-4xl text-white tracking-tight">
              Potencia tu Perfil con IA
            </h2>
            <p className="text-sm text-gray-300 font-medium leading-relaxed">
              Herramientas inteligentes diseñadas para maximizar tus oportunidades de éxito
            </p>
          </div>

          {/* Screenshot 3 Styled AI Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.08 }}
                  className="glass-panel p-7 rounded-[22px] border border-white/5 bg-white/[0.02] flex flex-col justify-between h-[310px] hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_8px_32px_0_rgba(93,140,226,0.06)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-[12px] ${feat.color} flex items-center justify-center shrink-0 shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Stat Gold outlined box badge */}
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-[#F5C542]/30 text-[#F5C542] font-bold uppercase tracking-wider">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-lg text-white pt-1">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                      {feat.desc}
                    </p>
                  </div>

                  <Link
                    to="/login"
                    className="w-full py-2.5 mt-4 rounded-xl border border-white/10 hover:border-[#5D8CE2]/50 hover:bg-white/5 text-[#5D8CE2] hover:text-white font-bold text-xs tracking-wider uppercase text-center transition-all duration-200 cursor-pointer"
                  >
                    Probar Ahora →
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* 5. How It Works Section (Solid White Background - Covers the Grid) */}
      <section className="w-full bg-white py-24 px-6 z-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto space-y-20"
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-4xl text-[#00135B] tracking-tight">
              ¿Cómo Funciona?
            </h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Un proceso simple y guiado para alcanzar tus metas internacionales
            </p>
          </div>

          {/* Timeline Pipeline */}
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00135B] via-[#5D8CE2] to-[#F5C542] max-md:left-4"></div>

            <div className="space-y-12">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ type: "spring", stiffness: 85, delay: 0.1 }}
                    className={`flex items-center w-full max-md:flex-row-reverse
                      ${isEven ? "flex-row" : "flex-row-reverse"}`}
                  >
                    {/* Left/Right Container with color-matched borders */}
                    <div className="w-1/2 px-8 max-md:w-full max-md:pl-12 max-md:pr-0">
                      <div className={`p-6 rounded-[20px] ${step.borderColor} border bg-[#f0f4f8]/30 shadow-sm text-left space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-4`}>
                        <div className={`w-10 h-10 rounded-xl ${step.iconBg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${step.textColor}`} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-display font-extrabold text-base text-[#00135B]">
                            <span className={`font-display font-extrabold text-lg mr-2 ${step.textColor}`}>{step.num}</span>
                            {step.title}
                          </h4>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Node dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white border-4 border-[#00135B] flex items-center justify-center z-10 shadow-sm max-md:left-4 max-md:-translate-x-0">
                      <div className="w-2 h-2 bg-[#F5C542] rounded-full"></div>
                    </div>

                    {/* Empty Space */}
                    <div className="w-1/2 max-md:hidden"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6. Testimonials Section (Solid Light Gray - Covers the Grid) */}
      <section className="w-full bg-[#f8fafc] py-24 px-6 z-20 relative border-t border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto space-y-20"
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-4xl text-[#00135B] tracking-tight">
              Historias de Éxito
            </h2>
            <p className="text-sm text-gray-500 font-medium">Testimonios de estudiantes reales de nuestra comunidad</p>
          </div>

          {/* Testimonios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.08 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between h-[250px] hover:shadow-md transition-shadow duration-300"
              >
                <div className="space-y-3">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F5C542] text-[#F5C542]" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-xs text-gray-500 italic leading-relaxed font-medium">
                    "{test.quote}"
                  </p>
                </div>

                {/* Profile Card */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <img 
                      src={test.img} 
                      alt={test.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#5D8CE2]/20" 
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[#00135B] leading-none mb-1">{test.name}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold leading-none">{test.rol} | {test.prog}</p>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-[#5D8CE2]/15 text-[#00135B] font-bold uppercase">
                    {test.country}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Metric Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-gray-200">
            {[
              { val: "2,500+", desc: "Becarios Exitosos" },
              { val: "78%", desc: "Tasa de Éxito IA" },
              { val: "45+", desc: "Países de Destino" },
              { val: "$120M+", desc: "Otorgados en Becas" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-1 p-4">
                <p className="text-3xl md:text-4xl font-extrabold font-display text-[#00135B]">{stat.val}</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.desc}</p>
              </div>
            ))}
          </div>

        </motion.div>
      </section>

      {/* 7. Footer (Deep Blue with Separated Grid Layer sutil) */}
      <footer className="relative w-full bg-[#00135B] text-white overflow-hidden pt-16 pb-8 px-8 z-10 flex flex-col items-center">
        
        {/* Isolated Moving Square Grid Layer */}
        <div className="absolute inset-0 tech-grid opacity-50 pointer-events-none z-0"></div>

        {/* Glow Spheres */}
        <div className="absolute top-[-50%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#5D8CE2]/10 filter blur-[100px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10 relative z-10">
          
          {/* Column 1: Brand info */}
          <div className="space-y-4 text-left">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#00135B]" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider text-white">
                EDU<span className="text-[#5D8CE2] font-semibold">LAB</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed font-medium max-w-xs">
              Plataforma SaaS inteligente para empoderar estudiantes y conectarlos con becas de excelencia y voluntariados internacionales.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-gray-400 hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-gray-400 hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.95 4.57a10 10 0 01-2.82.77 4.96 4.96 0 002.16-2.72c-.95.55-2 .96-3.12 1.18a4.92 4.92 0 00-8.38 4.48A14 14 0 011.67 3.15a4.93 4.93 0 001.52 6.57c-.8-.03-1.57-.25-2.24-.62v.06a4.92 4.92 0 003.95 4.83 4.9 4.9 0 01-2.22.08 4.93 4.93 0 004.6 3.42A9.9 9.9 0 010 19.54a13.9 13.9 0 007.55 2.21c9.05 0 14-7.5 14-14 0-.21 0-.43-.02-.64A10 10 0 0024 4.56l-.05.01z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-gray-400 hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-gray-400 hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-200">
                <svg className="w-4 h-4 fill-gray-400 hover:fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.519 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.869.508 9.388.508 9.388.508s7.519 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Oportunidades links */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Oportunidades</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li><Link to="/login" className="hover:text-white transition-colors duration-200">Becas Internacionales</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors duration-200">Voluntariados Globales</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors duration-200">Intercambios Académicos</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors duration-200">Programas de Liderazgo</Link></li>
            </ul>
          </div>

          {/* Column 3: Recursos links */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Recursos</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li><Link to="/login" className="hover:text-white transition-colors duration-200">Blog & Noticias</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors duration-200">Guías de Postulación</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors duration-200">Preguntas Frecuentes</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors duration-200">Casos de Éxito</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Contacto</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li>soporte@edulab.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Latinoamérica & Global</li>
            </ul>
            <button className="px-5 py-2 mt-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-bold text-white transition-all duration-200 cursor-pointer">
              Contáctanos
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 text-[11px] text-gray-500 font-semibold relative z-10">
          <p>© 2026 EDULAB - EduServer Platform. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Configuración de Cookies</a>
          </div>
          {/* Badge Final */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] text-[#F5C542] font-extrabold uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Powered by EduServer Tech</span>
          </span>
        </div>

      </footer>

    </div>
  );
}
