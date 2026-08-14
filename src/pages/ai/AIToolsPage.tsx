import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BrainCircuit, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Edit3,
  Layers,
  Upload,
  Trash2,
  Download
} from "lucide-react";
import axiosClient from "../../services/api/axiosClient";
import { getMyProfile } from "../../services/profileService";
import { useAuthStore } from "../../store/useAuthStore";
import type { StudentProfileResponse } from "../../services/profileService";
// @ts-ignore
import html2pdf from "html2pdf.js";

interface AIReviewData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations_cv: string[];
  recommendations_letter: string[];
  comparison_summary: string;
  improved_cv?: string;
  improved_letter?: string;
}

export default function AIToolsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"free" | "eval">("free"); // Default to free simulation as requested

  // DB data states
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loadingInit, setLoadingInit] = useState(true);
  
  // Free simulation input methods: "text" or "file"
  const [cvInputMethod, setCvInputMethod] = useState<"text" | "file">("file"); // Default to file upload!
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Free simulation form states (prefilled with premium mock data for quick testing)
  const [freeProgramId, setFreeProgramId] = useState<number | "">("");
  const [freeCvText, setFreeCvText] = useState(
    "Ubicación: Santa Cruz, Bolivia\n" +
    "Nivel de Educación: Pregrado / Universitario\n" +
    "Institución: Universidad de Santa Cruz\n" +
    "Área de Especialidad: Ingeniería de Sistemas\n" +
    "Nivel de Inglés: Intermedio (B2)\n" +
    "Otros Idiomas: Portugués\n" +
    "Intereses: Tecnología, Liderazgo, Voluntariado\n" +
    "Biografía: Estudiante apasionado por el desarrollo de software y la inteligencia artificial, buscando aplicar tecnología para resolver problemas sociales.\n\n" +
    "Experiencia Laboral:\n" +
    "  1. Desarrollador Frontend Junior en Software SRL - Desarrollo de interfaces responsivas utilizando React y Tailwind CSS.\n\n" +
    "Experiencia de Voluntariado:\n" +
    "  1. Mentor de Tecnología en Voluntarios Bolivia - Enseñanza de computación básica a jóvenes en centros comunitarios."
  );
  const [freeLetterText, setFreeLetterText] = useState(
    "Estimado equipo de selección,\n\n" +
    "Me pongo en contacto con ustedes con gran entusiasmo para postular al programa. " +
    "Como estudiante de Ingeniería de Sistemas en Bolivia, he visto de primera mano cómo la tecnología y la educación " +
    "pueden transformar comunidades. Mi experiencia previa como mentor de tecnología me enseñó a adaptarme a diferentes contextos " +
    "y a comunicar conceptos complejos de manera simple.\n\n" +
    "Deseo participar en este programa para expandir mi visión del mundo, desarrollar mis habilidades de liderazgo y colaborar " +
    "en proyectos de impacto social tangible. Estoy convencido de que mi perfil técnico y mi motivación personal aportarán " +
    "valor al proyecto asignado.\n\n" +
    "Quedo a su disposición para cualquier entrevista.\n\n" +
    "Atentamente,\n" +
    "Sebastian Soliz Paniagua"
  );

  // Interaction states
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [reviewFeedback, setReviewFeedback] = useState<AIReviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Optimized documents view states
  const [optTab, setOptTab] = useState<"cv" | "letter">("cv");
  const [copiedText, setCopiedText] = useState(false);
  const [letterInputMethod, setLetterInputMethod] = useState<"text" | "file">("text");
  const [letterFile, setLetterFile] = useState<File | null>(null);

  // Automatically switch tab depending on what is generated
  useEffect(() => {
    if (reviewFeedback) {
      if (reviewFeedback.improved_cv) {
        setOptTab("cv");
      } else if (reviewFeedback.improved_letter) {
        setOptTab("letter");
      }
    }
  }, [reviewFeedback]);

  const handleCopyText = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => {
      setCopiedText(false);
    }, 2000);
  };

  const handleDownloadMarkdown = (text: string, filename: string) => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerPrintFallback = (htmlContent: string, docTitle: string) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.zIndex = "-1000";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${docTitle}</title>
            <style>
              @page { size: letter; margin: 18mm; }
              body { font-family: 'Georgia', serif; color: #1e293b; margin: 0; padding: 0; background: #ffffff; }
              .watermark { position: fixed; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 36px; font-weight: 900; font-family: system-ui, sans-serif; color: rgba(0, 19, 91, 0.07); white-space: nowrap; pointer-events: none; text-transform: uppercase; letter-spacing: 3px; z-index: 9999; }
              ul { margin: 4px 0 10px 0; padding-left: 18px; }
              p { margin: 4px 0; }
              strong { color: #00135B; }
            </style>
          </head>
          <body>
            <div class="watermark">EDULAB • COPIA VERIFICADA IA</div>
            <div class="content">${htmlContent}</div>
          </body>
        </html>
      `);
      iframeDoc.close();
      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }
        setTimeout(() => { document.body.removeChild(iframe); }, 2000);
      }, 300);
    }
  };

  const handleDownloadHarvardPDF = (text?: string, isCv: boolean = true) => {
    if (!text) return;

    const lines = text.split("\n");
    let htmlContent = "";
    let inList = false;

    lines.forEach((line) => {
      if (line.startsWith("- ") || line.startsWith("* ")) {
        if (!inList) {
          htmlContent += `<ul style="margin: 4px 0 10px 0; padding-left: 18px;">`;
          inList = true;
        }
        const clean = line.substring(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        htmlContent += `<li style="font-size: 11px; line-height: 1.5; margin-bottom: 3px; color: #334155;">${clean}</li>`;
      } else {
        if (inList) {
          htmlContent += `</ul>`;
          inList = false;
        }
        if (line.startsWith("# ")) {
          htmlContent += `<h1 style="text-align: center; font-family: 'Georgia', serif; font-size: 22px; text-transform: uppercase; margin-bottom: 6px; font-weight: 800; letter-spacing: 1px; color: #00135B;">${line.replace("# ", "")}</h1>`;
        } else if (line.startsWith("## ")) {
          htmlContent += `<h2 style="font-family: 'Georgia', serif; font-size: 13px; text-transform: uppercase; border-bottom: 1.5px solid #00135B; padding-bottom: 2px; margin-top: 16px; margin-bottom: 8px; font-weight: 700; letter-spacing: 1px; color: #00135B;">${line.replace("## ", "")}</h2>`;
        } else if (line.startsWith("### ")) {
          htmlContent += `<h3 style="font-family: 'Georgia', serif; font-size: 12px; margin-top: 10px; margin-bottom: 4px; font-weight: 700; color: #1e293b;">${line.replace("### ", "")}</h3>`;
        } else if (line.trim()) {
          const clean = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
          htmlContent += `<p style="font-size: 11px; line-height: 1.5; margin-bottom: 6px; color: #334155;">${clean}</p>`;
        }
      }
    });

    if (inList) {
      htmlContent += `</ul>`;
    }

    const docTitle = isCv ? "CV_Optimizado_Harvard_EduLab" : "Carta_Motivacion_EduLab";
    const filename = `${docTitle}.pdf`;

    // Create container for html2pdf
    const element = document.createElement("div");
    element.style.padding = "24px 28px";
    element.style.fontFamily = "'Georgia', 'Times New Roman', serif";
    element.style.color = "#1e293b";
    element.style.backgroundColor = "#ffffff";
    element.style.position = "relative";
    
    element.innerHTML = `
      <div style="position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 32px; font-weight: 900; font-family: system-ui, sans-serif; color: rgba(0, 19, 91, 0.05); white-space: nowrap; pointer-events: none; text-transform: uppercase; letter-spacing: 3px; z-index: 0;">
        EDULAB • COPIA VERIFICADA IA
      </div>
      <div style="position: relative; z-index: 1;">
        ${htmlContent}
      </div>
    `;

    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      html2pdf().set(opt).from(element).save().catch((err: any) => {
        console.warn("html2pdf failed, using print fallback:", err);
        triggerPrintFallback(htmlContent, docTitle);
      });
    } catch (e) {
      triggerPrintFallback(htmlContent, docTitle);
    }
  };

  const handleGenerateWinnerLetter = () => {
    setFreeLetterText(
      "Por favor redactar una Carta de Motivación de alto impacto inspirada en los perfiles de postulantes ganadores históricos para esta oportunidad."
    );
    setLetterInputMethod("text");
    setLetterFile(null);
    setReviewFeedback(null);
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="font-bold text-[#00135B]">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMarkdown = (text?: string, isCv: boolean = true) => {
    if (!text) return <p className="text-slate-400 italic text-xs">No hay contenido disponible.</p>;

    // Auto-clean any residual bracket placeholders if rendering a cover letter
    let cleanedText = text;
    if (!isCv && programs && programs.length > 0) {
      const selectedProgram = programs.find(p => p.id === freeProgramId) || programs[0];
      const orgName = selectedProgram?.organization || "Comité de Selección";
      const progTitle = selectedProgram?.title || "Programa de Beca";

      const replacements: Record<string, string> = {
        "LUGAR, FECHA": "**Santa Cruz, Bolivia — 14 de Agosto de 2026**",
        "[LUGAR, FECHA]": "**Santa Cruz, Bolivia — 14 de Agosto de 2026**",
        "[Lugar, Fecha]": "**Santa Cruz, Bolivia — 14 de Agosto de 2026**",
        "[NOMBRE DEL DESTINATARIO]": `**Comité de Selección de ${orgName}**`,
        "[Nombre del Destinatario]": `Comité de Selección de ${orgName}`,
        "[Posición]": "Dirección de Admisiones y Becas",
        "[Institución]": orgName,
        "[Dirección]": `Convocatoria: ${progTitle}`,
        "Estimado/a [Nombre del Destinatario]": `Estimados miembros del Comité de Selección de ${orgName}`,
        "Estimado/a [Nombre]": `Estimados miembros del Comité de Selección de ${orgName}`,
      };

      for (const [key, val] of Object.entries(replacements)) {
        cleanedText = cleanedText.split(key).join(val);
      }
    }

    const lines = cleanedText.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("# ")) {
        return <h1 key={idx} className={`font-extrabold text-xl text-[#00135B] mt-4 mb-2 ${isCv ? "text-center font-serif uppercase tracking-wider" : "font-display"}`}>{line.replace("# ", "")}</h1>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className={`font-bold text-sm text-[#00135B] mt-4 mb-1.5 border-b border-[#00135B]/30 pb-0.5 ${isCv ? "font-serif uppercase tracking-widest" : "font-display"}`}>{line.replace("## ", "")}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="font-bold text-xs text-slate-800 mt-2.5 mb-1 font-serif">{line.replace("### ", "")}</h3>;
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const cleanLine = line.substring(2);
        return (
          <ul key={idx} className="list-disc list-inside pl-3 text-xs text-slate-700 space-y-0.5 my-0.5">
            <li>{parseBoldText(cleanLine)}</li>
          </ul>
        );
      }
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <ol key={idx} className="list-decimal list-inside pl-3 text-xs text-slate-700 space-y-0.5 my-0.5">
            <li>{parseBoldText(numMatch[2])}</li>
          </ol>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-2"></div>;
      }
      return <p key={idx} className={`text-xs text-slate-700 leading-relaxed my-1 ${isCv ? "font-serif" : "font-sans"}`}>{parseBoldText(line)}</p>;
    });
  };

  // Load initial data
  useEffect(() => {
    async function initData() {
      try {
        // Fetch public programs list first (no auth needed)
        const progRes = await axiosClient.get("/programs/");
        const fetchedPrograms = progRes.data || [];
        setPrograms(fetchedPrograms);
        if (fetchedPrograms.length > 0) {
          setFreeProgramId(fetchedPrograms[0].id);
        }

        // Fetch auth-based data if authenticated
        if (isAuthenticated) {
          try {
            const [profData, appsRes] = await Promise.all([
              getMyProfile(),
              axiosClient.get("/applications/")
            ]);
            setProfile(profData);
            const userApps = appsRes.data || [];
            setApplications(userApps);
            
            if (userApps.length > 0) {
              const firstApp = userApps[0];
              setSelectedAppId(firstApp.id);
              // If they are on eval tab, pre-load its feedback
              if (activeTab === "eval" && firstApp.ai_review_feedback) {
                const parsed = typeof firstApp.ai_review_feedback === "string" 
                  ? JSON.parse(firstApp.ai_review_feedback) 
                  : firstApp.ai_review_feedback;
                setReviewFeedback(parsed);
              }
            }
          } catch (authErr: any) {
            console.warn("Auth token invalid or expired. Silently falling back to unauthenticated mode.", authErr);
            if (authErr.response?.status === 401) {
              useAuthStore.getState().logout();
            }
          }
        }
      } catch (err) {
        console.error("Failed to initialize AIToolsPage data", err);
      } finally {
        setLoadingInit(false);
      }
    }
    initData();
  }, [isAuthenticated]);

  // Handle selected application change (Eval Tab)
  const handleAppChange = (appId: number) => {
    setSelectedAppId(appId);
    setError(null);
    setReviewFeedback(null);
    
    const app = applications.find(a => a.id === appId);
    if (app && app.ai_review_feedback) {
      try {
        const parsed = typeof app.ai_review_feedback === "string" 
          ? JSON.parse(app.ai_review_feedback) 
          : app.ai_review_feedback;
        setReviewFeedback(parsed);
      } catch (e) {
        console.error("Failed to parse feedback for selected app", e);
      }
    }
  };

  // Handle tab change
  const handleTabChange = (tab: "eval" | "free") => {
    setActiveTab(tab);
    setError(null);
    setReviewFeedback(null);

    if (tab === "eval" && selectedAppId) {
      const app = applications.find(a => a.id === selectedAppId);
      if (app && app.ai_review_feedback) {
        try {
          const parsed = typeof app.ai_review_feedback === "string" 
            ? JSON.parse(app.ai_review_feedback) 
            : app.ai_review_feedback;
          setReviewFeedback(parsed);
        } catch (e) {
          console.error("Failed to parse feedback for selected app", e);
        }
      }
    }
  };

  // Simulate loader steps
  const steps = [
    "Leyendo los requisitos de la oportunidad...",
    "Extrayendo y mapeando tu perfil de postulante (CV)...",
    "Analizando estructura y coherencia de tu carta de motivación...",
    "Comparando tu postulación con ganadores anteriores...",
    "Consolidando el reporte de compatibilidad de EduLab IA..."
  ];

  useEffect(() => {
    let interval: any;
    if (loadingReview) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loadingReview]);

  // Trigger AI review
  const handleRunReview = async () => {
    setLoadingReview(true);
    setLoadingStep(0);
    setError(null);
    setReviewFeedback(null);

    try {
      let data: any;
      if (activeTab === "eval") {
        if (!selectedAppId) return;
        const response = await axiosClient.post(`/applications/${selectedAppId}/ai-review`);
        data = response.data;
        
        // Update local applications state to cache the feedback
        setApplications(prev => prev.map(app => {
          if (app.id === selectedAppId) {
            return { ...app, ai_review_feedback: data };
          }
          return app;
        }));
      } else {
        // Free simulation
        if (!freeProgramId) {
          setError("Por favor selecciona una oportunidad.");
          setLoadingReview(false);
          return;
        }

        if (cvInputMethod === "file") {
          if (!cvFile) {
            setError("Por favor sube tu archivo de CV (.pdf, .txt o .md).");
            setLoadingReview(false);
            return;
          }
          if (!freeLetterText.trim()) {
            setError("Por favor escribe tu carta de motivación.");
            setLoadingReview(false);
            return;
          }

          const formData = new FormData();
          formData.append("program_id", String(freeProgramId));
          formData.append("motivation_letter", freeLetterText);
          formData.append("cv_file", cvFile);

          const response = await axiosClient.post("/applications/direct-ai-review-file", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          data = response.data;
        } else {
          if (!freeCvText.trim() || !freeLetterText.trim()) {
            setError("Por favor rellena el CV y la Carta de Motivación.");
            setLoadingReview(false);
            return;
          }
          const response = await axiosClient.post("/applications/direct-ai-review", {
            program_id: Number(freeProgramId),
            cv_text: freeCvText,
            motivation_letter: freeLetterText
          });
          data = response.data;
        }
      }
      setReviewFeedback(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        "Hubo un problema al procesar la revisión por IA. Asegúrate de que el archivo tenga texto legible y de tener configurada tu API key de OpenAI."
      );
    } finally {
      setLoadingReview(false);
    }
  };

  if (loadingInit) {
    return (
      <div className="space-y-6 text-slate-700 animate-fadeIn min-h-[50vh] flex flex-col justify-center items-center">
        <div className="w-10 h-10 rounded-full border-t-2 border-r-2 border-[#5D8CE2] animate-spin"></div>
        <p className="text-xs font-bold text-slate-400">Cargando Copiloto IA...</p>
      </div>
    );
  }

  const selectedApp = applications.find(a => a.id === selectedAppId);
  const cvCompletitud = profile?.cv_url ? "completo" : "faltante";
  const cartaCompletitud = (selectedApp?.motivation_letter_draft || profile?.general_motivation_letter) ? "completo" : "faltante";

  return (
    <div className="space-y-6 text-slate-700 animate-fadeIn text-left">
      {/* Title Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-display font-extrabold text-3xl text-[#00135B] flex items-center gap-2">
          Copiloto IA Académico <Sparkles className="w-6 h-6 text-[#F5C542] fill-current" />
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Optimiza tus postulaciones con IA basándote en las exigencias de la convocatoria y el perfil de ganadores históricos.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 border-b border-gray-100 pb-2">
        <button
          onClick={() => handleTabChange("free")}
          className={`pb-2 px-4 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === "free"
              ? "border-[#00135B] text-[#00135B]"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Simulador Libre (Sin Postular)</span>
        </button>

        {isAuthenticated && (
          <button
            onClick={() => handleTabChange("eval")}
            className={`pb-2 px-4 font-bold text-xs uppercase tracking-wider border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === "eval"
                ? "border-[#00135B] text-[#00135B]"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Evaluar Postulación Activa</span>
          </button>
        )}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left panel: Inputs / Controls */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* TAB 1: Free Simulation Form */}
          {activeTab === "free" && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
              <div>
                <h3 className="font-display font-bold text-base text-[#00135B]">Simulación Rápida</h3>
                <p className="text-xs text-slate-400 mt-0.5">Compara cualquier texto o archivo de CV y Carta contra una oportunidad.</p>
              </div>

              {/* Opportunity Select */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Oportunidad destino</label>
                <div className="relative">
                  <select
                    value={freeProgramId}
                    onChange={(e) => {
                      setFreeProgramId(Number(e.target.value));
                      setReviewFeedback(null);
                    }}
                    className="w-full bg-slate-50 border border-gray-200 text-slate-700 py-3 px-4 pr-10 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#5D8CE2] appearance-none cursor-pointer"
                  >
                    {programs.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.title} ({prog.organization})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* CV Input Method Toggle */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Método de ingreso de CV</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-gray-200/60">
                  <button
                    type="button"
                    onClick={() => {
                      setCvInputMethod("file");
                      setReviewFeedback(null);
                    }}
                    className={`py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      cvInputMethod === "file"
                        ? "bg-white text-[#00135B] shadow-sm border border-gray-200"
                        : "text-slate-400 hover:text-slate-600 font-medium"
                    }`}
                  >
                    Subir PDF / Documento
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCvInputMethod("text");
                      setReviewFeedback(null);
                    }}
                    className={`py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      cvInputMethod === "text"
                        ? "bg-white text-[#00135B] shadow-sm border border-gray-200"
                        : "text-slate-400 hover:text-slate-600 font-medium"
                    }`}
                  >
                    Escribir / Pegar Texto
                  </button>
                </div>
              </div>

              {/* CV File / Textarea conditional view */}
              {cvInputMethod === "text" ? (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Tu CV / Perfil Profesional</label>
                  <textarea
                    value={freeCvText}
                    onChange={(e) => {
                      setFreeCvText(e.target.value);
                      setReviewFeedback(null);
                    }}
                    rows={6}
                    placeholder="Pega aquí el contenido de tu currículum o perfil (experiencia, educación, idiomas)..."
                    className="w-full bg-slate-50 border border-gray-200 text-slate-700 p-4 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#5D8CE2] resize-y"
                  />
                </div>
              ) : (
                <div className="space-y-1.5 text-left font-display">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-semibold">Cargar Archivo de CV</label>
                  {!cvFile ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-all cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-slate-400 mb-2 animate-pulse" />
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Haga clic para subir</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">PDF, TXT o MD (Max. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.txt,.md"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setCvFile(e.target.files[0]);
                            setReviewFeedback(null);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-[#00135B]/5 border border-[#5D8CE2]/20 rounded-2xl">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#5D8CE2]/20 flex items-center justify-center text-[#5D8CE2] shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#00135B] truncate">{cvFile.name}</p>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                            {(cvFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCvFile(null);
                          setReviewFeedback(null);
                        }}
                        className="p-1.5 rounded-full hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer border-none bg-transparent"
                        title="Eliminar archivo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Motivation Letter Section Card */}
              <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-gray-200/80">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-extrabold text-[#00135B] uppercase tracking-wider">Tu Carta de Motivación</label>
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-current" /> Clave para Selección
                  </span>
                </div>

                {/* Prominent Action Banner for AI Letter Generation */}
                <button
                  type="button"
                  onClick={handleGenerateWinnerLetter}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-[#00135B] via-[#0d288c] to-[#5D8CE2] hover:from-[#000e42] hover:to-[#4b7ad1] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-between gap-2 border border-white/10 group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#F5C542] fill-current animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold leading-tight text-white">Generar Carta Ganadora con IA</p>
                      <p className="text-[9px] text-slate-200 font-medium">Basada en perfiles de postulantes aceptados</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Letter Input Method Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setLetterInputMethod("text");
                      setLetterFile(null);
                      setReviewFeedback(null);
                    }}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      letterInputMethod === "text"
                        ? "bg-[#00135B] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 font-medium"
                    }`}
                  >
                    Escribir / Pegar Texto
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLetterInputMethod("file");
                      setReviewFeedback(null);
                    }}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      letterInputMethod === "file"
                        ? "bg-[#00135B] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 font-medium"
                    }`}
                  >
                    Subir PDF / Documento
                  </button>
                </div>

                {letterInputMethod === "text" ? (
                  <textarea
                    value={freeLetterText}
                    onChange={(e) => {
                      setFreeLetterText(e.target.value);
                      setReviewFeedback(null);
                    }}
                    rows={7}
                    placeholder="Pega aquí el borrador de tu carta de motivación..."
                    className="w-full bg-white border border-gray-200 text-slate-700 p-3.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#5D8CE2] focus:ring-1 focus:ring-[#5D8CE2] resize-y shadow-inner"
                  />
                ) : (
                  <div>
                    {!letterFile ? (
                      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-2xl bg-white hover:bg-slate-50 transition-all cursor-pointer">
                        <div className="flex flex-col items-center justify-center py-4">
                          <Upload className="w-7 h-7 text-slate-400 mb-1 animate-pulse" />
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Subir Carta (.pdf, .txt, .md)</p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.txt,.md"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const f = e.target.files[0];
                              setLetterFile(f);
                              if (f.name.endsWith(".txt") || f.name.endsWith(".md")) {
                                const text = await f.text();
                                setFreeLetterText(text);
                              }
                              setReviewFeedback(null);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-3.5 bg-white border border-[#5D8CE2]/20 rounded-2xl">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-5 h-5 text-[#5D8CE2] shrink-0" />
                          <p className="text-xs font-bold text-[#00135B] truncate">{letterFile.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setLetterFile(null);
                            setReviewFeedback(null);
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer border-none bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleRunReview}
                disabled={loadingReview}
                className="w-full py-3.5 bg-[#00135B] hover:bg-[#0d288c] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {loadingReview ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : reviewFeedback ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Re-analizar CV y Carta</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4" />
                    <span>Analizar CV y Carta con IA</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: Evaluate Active Application Form */}
          {activeTab === "eval" && isAuthenticated && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <h3 className="font-display font-bold text-base text-[#00135B]">Postulación a evaluar</h3>
                <p className="text-xs text-slate-400 mt-0.5">Elige cuál de tus postulaciones quieres analizar.</p>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-4 space-y-3">
                  <p className="text-xs text-slate-400">No tienes postulaciones en borrador.</p>
                  <button 
                    onClick={() => navigate("/programs")}
                    className="px-4 py-2 bg-[#F5C542] text-[#00135B] font-extrabold text-[10px] uppercase rounded-xl"
                  >
                    Iniciar una postulación
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <select 
                      value={selectedAppId || ""} 
                      onChange={(e) => handleAppChange(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-gray-200 text-slate-700 py-3 px-4 pr-10 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#5D8CE2] appearance-none cursor-pointer"
                    >
                      {applications.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.program_title} ({app.program_organization})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-4">
                    <h4 className="font-bold text-xs text-[#00135B] uppercase tracking-wider">Insumos de Postulación</h4>
                    
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        cvCompletitud === "completo" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                      }`}>
                        {cvCompletitud === "completo" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-slate-700">Perfil Académico & CV</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">
                          {cvCompletitud === "completo" ? "✓ CV registrado en tu Perfil" : "⚠ Falta adjuntar CV en tu perfil"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        cartaCompletitud === "completo" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                      }`}>
                        {cartaCompletitud === "completo" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-slate-700">Carta de Motivación</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">
                          {cartaCompletitud === "completo" ? "✓ Carta de motivación detectada" : "⚠ Falta redactar borrador de carta"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleRunReview}
                    disabled={loadingReview}
                    className="w-full py-3.5 bg-[#00135B] hover:bg-[#0d288c] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loadingReview ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Procesando...</span>
                      </>
                    ) : reviewFeedback ? (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Re-analizar Postulación</span>
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="w-4 h-4" />
                        <span>Analizar Postulación</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

        </div>

        {/* Right Area: Results / Loaders */}
        <div className="lg:col-span-2 space-y-6">

          {/* Error view */}
          {error && (
            <div className="bg-rose-50 border border-rose-500/10 text-rose-800 p-4 rounded-3xl text-xs font-semibold flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading view */}
          {loadingReview && (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center space-y-8 flex flex-col items-center">
              <div className="relative animate-pulse">
                <div className="w-20 h-20 rounded-full bg-[#00135B]/5 flex items-center justify-center relative z-10">
                  <BrainCircuit className="w-10 h-10 text-[#5D8CE2]" />
                </div>
                <div className="w-20 h-20 rounded-full bg-[#5D8CE2]/10 absolute inset-0 animate-ping z-0"></div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-[#00135B]">EduLab IA está trabajando</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Analizando la coherencia gramatical, de tono y de perfil profesional contra las bases históricas de la convocatoria.
                </p>
              </div>

              {/* Animated Steps */}
              <div className="w-full max-w-md space-y-3 text-left border-t border-gray-100 pt-6">
                {steps.map((st, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      loadingStep > idx 
                        ? "bg-emerald-500 text-white" 
                        : loadingStep === idx 
                          ? "bg-[#00135B] text-white animate-pulse" 
                          : "bg-slate-100 text-slate-400"
                    }`}>
                      {loadingStep > idx ? "✓" : idx + 1}
                    </div>
                    <span className={`font-semibold ${
                      loadingStep === idx ? "text-[#00135B] font-bold" : loadingStep > idx ? "text-slate-500" : "text-slate-300"
                    }`}>
                      {st}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Default State: Awaiting action */}
          {!loadingReview && !reviewFeedback && (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center space-y-4 text-slate-700 min-h-[350px] flex flex-col justify-center items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#00135B]/5 flex items-center justify-center shadow-sm">
                <BrainCircuit className="w-7 h-7 text-[#5D8CE2]" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#00135B]">Revisión por Inteligencia Artificial</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {activeTab === "free" 
                  ? "Configura tu oportunidad a la izquierda, sube tu currículum o usa el cuadro de texto, y presiona el botón para simular tu análisis."
                  : "Selecciona tu postulación activa de la izquierda y haz clic en Analizar Postulación para obtener tu reporte."
                }
              </p>
            </div>
          )}

          {/* Review Results Rendered */}
          {!loadingReview && reviewFeedback && (
            <div className="space-y-6">
              
              {/* Compatibility Banner */}
              <div className="bg-gradient-to-r from-[#00052a] to-[#00135B] text-white p-8 rounded-3xl shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5D8CE2]/25 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="space-y-2 text-left relative z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[#F5C542] text-[9px] font-extrabold uppercase tracking-wider">
                    Reporte de Coherencia IA
                  </span>
                  <h3 className="font-display font-extrabold text-2xl text-white">Análisis de Postulación</h3>
                  <p className="text-[11px] text-slate-300 max-w-md font-medium leading-relaxed">
                    El score calcula la coherencia entre tu CV, carta de motivación y los requisitos específicos de la oportunidad.
                  </p>
                </div>

                <div className="relative shrink-0 flex items-center justify-center w-28 h-28 rounded-full border-4 border-white/10 bg-white/5 shadow-inner">
                  <div className="text-center">
                    <p className="text-3xl font-black font-display text-[#F5C542]">{reviewFeedback.score}%</p>
                    <p className="text-[8px] text-slate-300 font-extrabold uppercase tracking-widest mt-0.5">Compatibilidad</p>
                  </div>
                </div>
              </div>

              {/* Narrative Comparison */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#5D8CE2]" />
                  <h4 className="font-display font-bold text-sm text-[#00135B]">Comparativa con Ganadores Previos</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {reviewFeedback.comparison_summary}
                </p>
              </div>

              {/* Strengths & Weaknesses (Dual column) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strengths Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <ThumbsUp className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-display font-bold text-xs text-[#00135B] uppercase tracking-wider">Fortalezas</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {reviewFeedback.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600 font-medium leading-normal">{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <ThumbsDown className="w-4 h-4 text-amber-500" />
                    <h4 className="font-display font-bold text-xs text-[#00135B] uppercase tracking-wider">Puntos a Reforzar</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {reviewFeedback.weaknesses.map((weak, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600 font-medium leading-normal">{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Optimizations & Recommendations details */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                  <TrendingUp className="w-5 h-5 text-[#5D8CE2]" />
                  <h4 className="font-display font-bold text-sm text-[#00135B]">Plan de Acción Recomendado</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CV recommendations */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-xs text-[#00135B] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5D8CE2]"></span>
                      Optimización para tu CV
                    </h5>
                    <ul className="space-y-2 pl-3">
                      {reviewFeedback.recommendations_cv.map((rec, idx) => (
                        <li key={idx} className="text-xs text-slate-600 leading-relaxed font-medium list-decimal pl-1">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Letter recommendations */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-xs text-[#00135B] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5D8CE2]"></span>
                      Optimización para tu Carta
                    </h5>
                    <ul className="space-y-2 pl-3">
                      {reviewFeedback.recommendations_letter.map((rec, idx) => (
                        <li key={idx} className="text-xs text-slate-600 leading-relaxed font-medium list-decimal pl-1">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {(reviewFeedback.improved_cv || reviewFeedback.improved_letter) && (
                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#F5C542] fill-current" />
                        <h4 className="font-display font-bold text-sm text-[#00135B]">Propuesta de Documentos Optimizados por IA</h4>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#00135B]/5 text-[#00135B] text-[8px] font-extrabold uppercase tracking-wider">
                        Versión Mejorada ✨
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium leading-normal">
                      Esta es una copia de tus documentos reescritos automáticamente por la IA para integrar las recomendaciones y resolver los puntos débiles de tu postulación.
                    </p>

                    {/* Sub tabs */}
                    <div className="flex gap-2 border-b border-gray-100 pb-2">
                      {reviewFeedback.improved_cv && (
                        <button
                          type="button"
                          onClick={() => setOptTab("cv")}
                          className={`pb-1.5 px-3 font-bold text-[10px] uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
                            optTab === "cv"
                              ? "border-[#00135B] text-[#00135B]"
                              : "border-transparent text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          CV Optimizado
                        </button>
                      )}
                      {reviewFeedback.improved_letter && (
                        <button
                          type="button"
                          onClick={() => setOptTab("letter")}
                          className={`pb-1.5 px-3 font-bold text-[10px] uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
                            optTab === "letter"
                              ? "border-[#00135B] text-[#00135B]"
                              : "border-transparent text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          Carta de Motivación Optimizada
                        </button>
                      )}
                    </div>

                    {/* Content Box with Watermark */}
                    <div className="relative bg-slate-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5 overflow-hidden shadow-inner space-y-3">
                      {/* EduLab Watermark backdrop */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden opacity-[0.05] rotate-[-25deg]">
                        <div className="text-center font-black font-display tracking-widest text-[#00135B] text-3xl sm:text-4xl uppercase whitespace-nowrap">
                          EDULAB • COPIA VERIFICADA IA
                        </div>
                      </div>

                      {/* Header bar with controls */}
                      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Vista previa del documento
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const text = optTab === "cv" ? reviewFeedback.improved_cv : reviewFeedback.improved_letter;
                              handleCopyText(text || "");
                            }}
                            className={`p-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer border flex items-center gap-1 shadow-sm ${
                              copiedText
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600"
                                : "bg-white hover:bg-slate-50 text-slate-600 border-gray-200"
                            }`}
                            title="Copiar texto al portapapeles"
                          >
                            {copiedText ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5 rotate-180" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const text = optTab === "cv" ? reviewFeedback.improved_cv : reviewFeedback.improved_letter;
                              const filename = optTab === "cv" ? "CV_Optimizado_Harvard_EduLab.md" : "Carta_Motivacion_Optimizada_EduLab.md";
                              handleDownloadMarkdown(text || "", filename);
                            }}
                            className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-gray-200 rounded-xl text-[10px] font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1"
                            title="Descargar archivo Markdown (.md)"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#5D8CE2]" />
                            <span>.MD</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const text = optTab === "cv" ? reviewFeedback.improved_cv : reviewFeedback.improved_letter;
                              handleDownloadHarvardPDF(text || "", optTab === "cv");
                            }}
                            className="p-2 bg-[#00135B] hover:bg-[#0d288c] text-white rounded-xl text-[10px] font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                            title="Descargar documento PDF en Formato Harvard"
                          >
                            <Download className="w-3.5 h-3.5 text-[#F5C542]" />
                            <span>Descargar PDF (Formato Harvard)</span>
                          </button>
                        </div>
                      </div>

                      {/* Content rendering */}
                      <div className="relative z-10 min-h-[350px] max-h-[550px] overflow-y-auto pr-3 text-left select-text bg-white/70 p-5 rounded-xl border border-slate-200/50 shadow-inner">
                        {renderMarkdown(
                          optTab === "cv" ? reviewFeedback.improved_cv : reviewFeedback.improved_letter,
                          optTab === "cv"
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Action Link to profile to modify profile details */}
                <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                  <p className="text-[10px] text-slate-400 font-medium">
                    Modifica tu CV y tu Carta de Motivación con estas recomendaciones para mejorar tu score.
                  </p>
                  <button
                    onClick={() => navigate("/profile")}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-[#00135B] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Ir a Mi Perfil para actualizar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}
          
        </div>

      </div>

    </div>
  );
}
