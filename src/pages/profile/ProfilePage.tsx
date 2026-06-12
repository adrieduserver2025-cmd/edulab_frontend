import React, { useState, useEffect } from "react";
import { getMyProfile, createProfile, updateProfile } from "../../services/profileService";
import type { StudentProfileData, StudentProfileResponse } from "../../services/profileService";
import { useAuthStore } from "../../store/useAuthStore";
import axiosClient from "../../services/api/axiosClient";
import { Building2, Globe, MapPin, User as UserIcon, Phone, Mail, FileText, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === "organization") {
    return <OrganizationProfileEditor />;
  }

  // Profile state
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Multi-step current step
  const [currentStep, setCurrentStep] = useState(1);

  // Form fields state
  const [formData, setFormData] = useState<StudentProfileData>({
    country: "",
    city: "",
    birth_date: "",
    phone: "",
    education_level: "Pregrado / Undergraduate",
    current_institution: "",
    area: "STEM",
    english_level: "Intermedio (B1/B2)",
    other_languages: [],
    interests: [],
    target_countries: [],
    target_program_types: [],
    linkedin_url: "",
    portfolio_url: "",
    bio: "",
    cv_url: "",
    expected_graduation_date: "",
    work_experience: [],
    volunteer_experience: [],
    general_motivation_letter: ""
  });

  // Auxiliary state for adding languages
  const [newLanguage, setNewLanguage] = useState("");

  const [tempWork, setTempWork] = useState({ company: "", position: "", start_date: "", end_date: "", description: "" });
  const [tempVolunteer, setTempVolunteer] = useState({ organization: "", role: "", start_date: "", end_date: "", description: "" });

  const handleAddWork = () => {
    if (tempWork.company.trim() && tempWork.position.trim()) {
      setFormData((prev) => ({
        ...prev,
        work_experience: [...(prev.work_experience || []), tempWork]
      }));
      setTempWork({ company: "", position: "", start_date: "", end_date: "", description: "" });
    }
  };

  const handleRemoveWork = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      work_experience: (prev.work_experience || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddVolunteer = () => {
    if (tempVolunteer.organization.trim() && tempVolunteer.role.trim()) {
      setFormData((prev) => ({
        ...prev,
        volunteer_experience: [...(prev.volunteer_experience || []), tempVolunteer]
      }));
      setTempVolunteer({ organization: "", role: "", start_date: "", end_date: "", description: "" });
    }
  };

  const handleRemoveVolunteer = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      volunteer_experience: (prev.volunteer_experience || []).filter((_, i) => i !== index)
    }));
  };

  // Load existing profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getMyProfile();
        if (data) {
          setProfile(data);
          setFormData({
            country: data.country || "",
            city: data.city || "",
            birth_date: data.birth_date || "",
            phone: data.phone || "",
            education_level: data.education_level || "Pregrado / Undergraduate",
            current_institution: data.current_institution || "",
            area: data.area || "STEM",
            english_level: data.english_level || "Intermedio (B1/B2)",
            other_languages: data.other_languages || [],
            interests: data.interests || [],
            target_countries: data.target_countries || [],
            target_program_types: data.target_program_types || [],
            linkedin_url: data.linkedin_url || "",
            portfolio_url: data.portfolio_url || "",
            bio: data.bio || "",
            cv_url: data.cv_url || "",
            expected_graduation_date: data.expected_graduation_date || "",
            work_experience: data.work_experience || [],
            volunteer_experience: data.volunteer_experience || [],
            general_motivation_letter: data.general_motivation_letter || ""
          });
        }
      } catch (err: any) {
        console.error(err);
        // Note: Controlled 404 is handled or empty profile remains
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Form input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle array item (used for pill selectors)
  const toggleArrayItem = (fieldName: keyof StudentProfileData, item: string) => {
    setFormData((prev) => {
      const arr = (prev[fieldName] as string[]) || [];
      const updated = arr.includes(item)
        ? arr.filter((i) => i !== item)
        : [...arr, item];
      return {
        ...prev,
        [fieldName]: updated
      };
    });
  };

  // Add a language to other_languages list
  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.other_languages?.includes(newLanguage.trim())) {
      setFormData((prev) => ({
        ...prev,
        other_languages: [...(prev.other_languages || []), newLanguage.trim()]
      }));
      setNewLanguage("");
    }
  };

  // Remove a language
  const handleRemoveLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      other_languages: (prev.other_languages || []).filter((l) => l !== lang)
    }));
  };

  // Calculate live completion progress based on 10 required fields in the UI
  const calculateLiveCompletion = (): number => {
    const required: (keyof StudentProfileData)[] = [
      "country",
      "city",
      "birth_date",
      "phone",
      "education_level",
      "area",
      "english_level",
      "interests",
      "target_countries",
      "target_program_types"
    ];
    let completed = 0;
    required.forEach((field) => {
      const val = formData[field];
      if (val !== undefined && val !== null) {
        if (typeof val === "string" && val.trim() !== "") completed++;
        else if (Array.isArray(val) && val.length > 0) completed++;
      }
    });
    return completed * 10;
  };

  // Validate fields for a given step
  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!formData.country.trim()) { setErrorMsg("El país es requerido."); return false; }
      if (!formData.city.trim()) { setErrorMsg("La ciudad es requerida."); return false; }
      if (!formData.birth_date) { setErrorMsg("La fecha de nacimiento es requerida."); return false; }
      if (!formData.phone.trim()) { setErrorMsg("El teléfono es requerido."); return false; }
    } else if (step === 2) {
      if (!formData.education_level) { setErrorMsg("El nivel de educación es requerido."); return false; }
      if (!formData.area) { setErrorMsg("El área de estudio o enfoque es requerida."); return false; }
    } else if (step === 3) {
      if (!formData.english_level) { setErrorMsg("El nivel de inglés es requerido."); return false; }
    } else if (step === 4) {
      if (!formData.interests || formData.interests.length === 0) {
        setErrorMsg("Selecciona al menos un interés académico/profesional.");
        return false;
      }
      if (!formData.target_countries || formData.target_countries.length === 0) {
        setErrorMsg("Selecciona al menos un país de destino.");
        return false;
      }
      if (!formData.target_program_types || formData.target_program_types.length === 0) {
        setErrorMsg("Selecciona al menos un tipo de programa de interés.");
        return false;
      }
    }
    return true;
  };

  // Next step handler
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  // Previous step handler
  const handlePrev = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit / Save profile to API
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (profile) {
        // Update existing profile
        const updated = await updateProfile(formData);
        setProfile(updated);
        setSuccessMsg("¡Perfil actualizado con éxito!");
      } else {
        // Create new profile
        const created = await createProfile(formData);
        setProfile(created);
        setSuccessMsg("¡Perfil creado y guardado con éxito!");
      }
      // Scroll to top of panel to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.detail ||
        "Hubo un error al guardar tu perfil EDULAB. Revisa los datos ingresados."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Constant select options
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

  const INTEREST_OPTIONS = [
    "Becas Completas",
    "Prácticas Profesionales",
    "Voluntariados",
    "Programas de Liderazgo",
    "Intercambios Académicos",
    "Cursos Cortos",
    "Investigación Científica"
  ];

  const COUNTRY_OPTIONS = [
    "Estados Unidos",
    "Canadá",
    "Reino Unido",
    "Alemania",
    "España",
    "Francia",
    "Australia",
    "Japón",
    "Corea del Sur",
    "Latinoamérica"
  ];

  const PROGRAM_TYPE_OPTIONS = [
    { key: "scholarship", label: "Beca (Scholarship)" },
    { key: "internship", label: "Pasantía (Internship)" },
    { key: "volunteering", label: "Voluntariado (Volunteering)" },
    { key: "leadership", label: "Liderazgo (Leadership)" },
    { key: "exchange", label: "Intercambio (Exchange)" },
    { key: "summer_school", label: "Escuela de Verano (Summer School)" }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        <p className="text-gray-400 text-sm">Cargando tu perfil EDULAB...</p>
      </div>
    );
  }

  const completionPercent = calculateLiveCompletion();

  return (
    <div className="space-y-6 text-slate-700 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-[#00135B]">
            Perfil EDULAB
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Completa tu perfil para recibir emparejamientos inteligentes con convocatorias internacionales.
          </p>
        </div>

        {/* Dynamic Completion Badge */}
        <div className="flex items-center gap-3 bg-[#00135B]/5 border border-gray-250 rounded-2xl px-4 py-2 self-start md:self-auto">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completitud del Perfil</p>
            <p className="text-lg font-extrabold text-[#5D8CE2]">{completionPercent}%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 flex items-center justify-center relative overflow-hidden bg-slate-50">
            <div
              className="absolute bottom-0 left-0 right-0 bg-[#5D8CE2] transition-all duration-500"
              style={{ height: `${completionPercent}%` }}
            />
            <span className="relative z-10 font-bold text-xs text-[#00135B]">{completionPercent}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-gray-250">
        <div
          className="bg-gradient-to-r from-[#5D8CE2] to-[#F5C542] h-full rounded-full transition-all duration-500"
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      {/* Success and Error Alerts */}
      {successMsg && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-2xl text-sm flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl text-sm flex items-center gap-3 animate-shake">
          <svg className="w-5 h-5 text-red-400 fill-current" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" /></svg>
          {errorMsg}
        </div>
      )}

      {/* Main Grid: Steps navigator & Active Form */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { step: 1, title: "Datos Personales", desc: "Ubicación e identificación" },
            { step: 2, title: "Educación", desc: "Nivel académico e institución" },
            { step: 3, title: "Idiomas", desc: "Inglés y otras lenguas" },
            { step: 4, title: "Intereses y Objetivos", desc: "Tus metas estratégicas" },
            { step: 5, title: "Links y CV", desc: "Portafolio, LinkedIn y CV" }
          ].map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => {
                // Allow switching steps if previous ones are valid
                if (s.step < currentStep || validateStep(currentStep)) {
                  setCurrentStep(s.step);
                }
              }}
              className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center gap-3 text-sm cursor-pointer ${currentStep === s.step
                  ? "bg-gradient-to-r from-[#00135B] to-[#5D8CE2] text-white border-transparent shadow-md"
                  : "bg-white hover:bg-slate-50 border-gray-150 text-slate-500 shadow-sm"
                }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep === s.step ? "bg-white text-[#00135B]" : "bg-slate-100 text-slate-400"
                }`}>
                {s.step}
              </div>
              <div>
                <p className={`font-semibold ${currentStep === s.step ? "text-white" : "text-[#00135B]"}`}>
                  {s.title}
                </p>
                <p className={`text-xs mt-0.5 ${currentStep === s.step ? "text-blue-100" : "text-slate-400"}`}>{s.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Wizard Form Panel */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSaveProfile} className="bg-white p-8 rounded-3xl border border-gray-150 shadow-lg space-y-8 text-slate-700">

            {/* STEP 1: PERSONAL DATA */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-xl font-bold font-display text-[#00135B]">1. Datos Personales</h2>
                  <p className="text-xs text-slate-400 mt-1">Ingresa tu ubicación y datos básicos de contacto.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">País de Residencia <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Ej. Costa Rica"
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Ciudad <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Ej. San José"
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Fecha de Nacimiento <span className="text-red-400">*</span></label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Teléfono de Contacto <span className="text-red-400">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Ej. +506 8888-8888"
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: EDUCATION */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-xl font-bold font-display text-[#00135B]">2. Nivel Académico</h2>
                  <p className="text-xs text-slate-400 mt-1">Cuéntanos sobre tu historial educativo actual.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nivel Educativo Máximo <span className="text-red-400">*</span></label>
                    <select
                      name="education_level"
                      value={formData.education_level}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                      required
                    >
                      {EDUCATION_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-white text-slate-800">{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Área de Enfoque / Disciplina <span className="text-red-400">*</span></label>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                      required
                    >
                      {AREA_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-white text-slate-800">{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Institución Actual (Colegio/Universidad)</label>
                    <input
                      type="text"
                      name="current_institution"
                      value={formData.current_institution || ""}
                      onChange={handleInputChange}
                      placeholder="Ej. Universidad de Costa Rica"
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Fecha Estimada de Graduación</label>
                    <input
                      type="date"
                      name="expected_graduation_date"
                      value={formData.expected_graduation_date || ""}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: LANGUAGES */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-xl font-bold font-display text-[#00135B]">3. Dominio de Idiomas</h2>
                  <p className="text-xs text-slate-400 mt-1">El inglés y otros idiomas amplían enormemente tu elegibilidad.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2 max-w-md">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nivel de Inglés <span className="text-red-400">*</span></label>
                    <select
                      name="english_level"
                      value={formData.english_level}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                      required
                    >
                      {ENGLISH_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-white text-slate-800">{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Otros Idiomas que hablas</label>
                    <div className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="Ej. Francés, Alemán"
                        className="flex-1 bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddLanguage}
                        className="bg-[#5D8CE2] hover:bg-[#5D8CE2]/80 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer"
                      >
                        Añadir
                      </button>
                    </div>

                    {/* Tag list for other_languages */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {formData.other_languages && formData.other_languages.length > 0 ? (
                        formData.other_languages.map((lang) => (
                          <span
                            key={lang}
                            className="bg-[#5D8CE2]/20 border border-[#5D8CE2]/45 rounded-full px-3 py-1 text-xs text-[#00135B] flex items-center gap-2 font-medium"
                          >
                            {lang}
                            <button
                              type="button"
                              onClick={() => handleRemoveLanguage(lang)}
                              className="text-rose-500 hover:text-rose-600 font-bold ml-1 cursor-pointer bg-transparent border-none"
                            >
                              &times;
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No has agregado otros idiomas.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: INTERESTS AND TARGETS */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-xl font-bold font-display text-[#00135B]">4. Intereses y Objetivos</h2>
                  <p className="text-xs text-slate-400 mt-1">Selecciona tus áreas de interés, destinos y tipos de programas favoritos.</p>
                </div>

                <div className="space-y-6">
                  {/* Interests selectors */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5D8CE2] block">Intereses Académicos y Profesionales <span className="text-red-400">*</span></label>
                    <p className="text-[10px] text-slate-400 font-medium">¿Qué tipo de oportunidades buscas de forma primaria?</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {INTEREST_OPTIONS.map((interest) => {
                        const isSelected = formData.interests?.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleArrayItem("interests", interest)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${isSelected
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

                  {/* Target countries selectors */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5D8CE2] block">Países de Destino Preferidos <span className="text-red-400">*</span></label>
                    <p className="text-[10px] text-slate-400 font-medium">¿Dónde te gustaría postular y estudiar?</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {COUNTRY_OPTIONS.map((country) => {
                        const isSelected = formData.target_countries?.includes(country);
                        return (
                          <button
                            key={country}
                            type="button"
                            onClick={() => toggleArrayItem("target_countries", country)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${isSelected
                                ? "bg-[#5D8CE2] border-[#5D8CE2] text-white shadow-sm"
                                : "bg-slate-50 border-gray-200 text-slate-500 hover:bg-slate-100"
                              }`}
                          >
                            {country}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target program types selectors */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5D8CE2] block">Tipos de Programa <span className="text-red-400">*</span></label>
                    <p className="text-[10px] text-slate-400 font-medium">¿Qué formatos de convocatorias te interesan?</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {PROGRAM_TYPE_OPTIONS.map((prog) => {
                        const isSelected = formData.target_program_types?.includes(prog.key);
                        return (
                          <button
                            key={prog.key}
                            type="button"
                            onClick={() => toggleArrayItem("target_program_types", prog.key)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${isSelected
                                ? "bg-[#F5C542] border-[#F5C542] text-[#00135B]"
                                : "bg-slate-50 border-gray-200 text-slate-500 hover:bg-slate-100"
                              }`}
                          >
                            {prog.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: LINKS, CV & EXPERIENCES */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-xl font-bold font-display text-[#00135B]">5. Enlaces, Experiencia y Carta</h2>
                  <p className="text-xs text-slate-400 mt-1">Completa tu perfil agregando enlaces a tus portafolios, tu currículum, tu trayectoria y carta de motivación.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Enlace de LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={formData.linkedin_url || ""}
                      onChange={handleInputChange}
                      placeholder="Ej. https://linkedin.com/in/usuario"
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Enlace de Portafolio / Web</label>
                    <input
                      type="url"
                      name="portfolio_url"
                      value={formData.portfolio_url || ""}
                      onChange={handleInputChange}
                      placeholder="Ej. https://miportafolio.com"
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">URL del CV en Nube (Google Drive/Dropbox)</label>
                    <input
                      type="url"
                      name="cv_url"
                      value={formData.cv_url || ""}
                      onChange={handleInputChange}
                      placeholder="Ej. https://drive.google.com/file/... (Compartido de forma pública)"
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Breve Biografía</label>
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Describe brevemente tus logros académicos, ambiciones profesionales y motivaciones..."
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all resize-none"
                    />
                  </div>

                  {/* General Motivation Letter (Opcional) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Carta de Motivación General (Opcional)</label>
                    <textarea
                      name="general_motivation_letter"
                      value={formData.general_motivation_letter || ""}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Escribe una carta de presentación general. Las organizaciones podrán verla al revisar tu perfil."
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all resize-none"
                    />
                  </div>

                  {/* Work Experience section */}
                  <div className="space-y-4 md:col-span-2 border-t border-gray-100 pt-6">
                    <h3 className="font-bold text-slate-800 text-sm text-left">Experiencia Laboral</h3>
                    
                    {/* List of current work experiences */}
                    <div className="space-y-2 text-left">
                      {formData.work_experience && formData.work_experience.length > 0 ? (
                        formData.work_experience.map((work, idx) => (
                          <div key={idx} className="bg-slate-50 border border-gray-150 p-4 rounded-2xl flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm text-[#00135B]">{work.position} en {work.company}</p>
                              <p className="text-xs text-slate-500">{work.start_date} - {work.end_date || "Presente"}</p>
                              {work.description && <p className="text-xs text-slate-600 mt-1">{work.description}</p>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveWork(idx)}
                              className="text-rose-500 hover:text-rose-600 font-bold text-xs bg-transparent border-none cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No has agregado experiencia laboral.</p>
                      )}
                    </div>

                    {/* Form to add a work experience */}
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-dashed border-gray-200 space-y-3 text-left">
                      <p className="text-xs font-bold text-slate-500 uppercase">Agregar Experiencia Laboral</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Empresa/Organización"
                          value={tempWork.company}
                          onChange={(e) => setTempWork({ ...tempWork, company: e.target.value })}
                          className="bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2]"
                        />
                        <input
                          type="text"
                          placeholder="Cargo/Posición"
                          value={tempWork.position}
                          onChange={(e) => setTempWork({ ...tempWork, position: e.target.value })}
                          className="bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2]"
                        />
                        <input
                          type="date"
                          placeholder="Fecha Inicio"
                          value={tempWork.start_date}
                          onChange={(e) => setTempWork({ ...tempWork, start_date: e.target.value })}
                          className="bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                        <input
                          type="date"
                          placeholder="Fecha Fin (Dejar vacío si es actual)"
                          value={tempWork.end_date}
                          onChange={(e) => setTempWork({ ...tempWork, end_date: e.target.value })}
                          className="bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                        <textarea
                          placeholder="Descripción de funciones"
                          value={tempWork.description}
                          onChange={(e) => setTempWork({ ...tempWork, description: e.target.value })}
                          rows={2}
                          className="bg-white border border-gray-200 text-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-[#5D8CE2] md:col-span-2 resize-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddWork}
                        className="bg-[#5D8CE2] hover:bg-[#5D8CE2]/80 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Añadir Experiencia
                      </button>
                    </div>
                  </div>

                  {/* Volunteer Experience section */}
                  <div className="space-y-4 md:col-span-2 border-t border-gray-100 pt-6">
                    <h3 className="font-bold text-slate-800 text-sm text-left">Experiencia de Voluntariado</h3>
                    
                    {/* List of current volunteer experiences */}
                    <div className="space-y-2 text-left">
                      {formData.volunteer_experience && formData.volunteer_experience.length > 0 ? (
                        formData.volunteer_experience.map((vol, idx) => (
                          <div key={idx} className="bg-slate-50 border border-gray-150 p-4 rounded-2xl flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm text-[#00135B]">{vol.role} en {vol.organization}</p>
                              <p className="text-xs text-slate-500">{vol.start_date} - {vol.end_date || "Presente"}</p>
                              {vol.description && <p className="text-xs text-slate-600 mt-1">{vol.description}</p>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveVolunteer(idx)}
                              className="text-rose-500 hover:text-rose-600 font-bold text-xs bg-transparent border-none cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No has agregado voluntariados.</p>
                      )}
                    </div>

                    {/* Form to add a volunteer experience */}
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-dashed border-gray-200 space-y-3 text-left">
                      <p className="text-xs font-bold text-slate-500 uppercase">Agregar Voluntariado / Experiencia Social</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Organización"
                          value={tempVolunteer.organization}
                          onChange={(e) => setTempVolunteer({ ...tempVolunteer, organization: e.target.value })}
                          className="bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2]"
                        />
                        <input
                          type="text"
                          placeholder="Rol/Función"
                          value={tempVolunteer.role}
                          onChange={(e) => setTempVolunteer({ ...tempVolunteer, role: e.target.value })}
                          className="bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5D8CE2]"
                        />
                        <input
                          type="date"
                          placeholder="Fecha Inicio"
                          value={tempVolunteer.start_date}
                          onChange={(e) => setTempVolunteer({ ...tempVolunteer, start_date: e.target.value })}
                          className="bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                        <input
                          type="date"
                          placeholder="Fecha Fin (Dejar vacío si es actual)"
                          value={tempVolunteer.end_date}
                          onChange={(e) => setTempVolunteer({ ...tempVolunteer, end_date: e.target.value })}
                          className="bg-white border border-gray-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                        <textarea
                          placeholder="Descripción de actividades"
                          value={tempVolunteer.description}
                          onChange={(e) => setTempVolunteer({ ...tempVolunteer, description: e.target.value })}
                          rows={2}
                          className="bg-white border border-gray-200 text-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-[#5D8CE2] md:col-span-2 resize-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddVolunteer}
                        className="bg-[#5D8CE2] hover:bg-[#5D8CE2]/80 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Añadir Voluntariado
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Navigation buttons inside the wizard panel */}
            <div className="border-t border-gray-150 pt-6 flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-slate-55 text-slate-600 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Anterior
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#5D8CE2] hover:bg-[#5D8CE2]/80 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all shadow-md shadow-[#5D8CE2]/25 cursor-pointer"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#F5C542] to-[#5D8CE2] hover:from-[#F5C542]/80 hover:to-[#5D8CE2]/80 text-[#00135B] font-extrabold px-10 py-3 rounded-xl text-sm transition-all shadow-md shadow-[#F5C542]/20 flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#00135B] border-t-transparent"></div>
                      Guardando...
                    </>
                  ) : (
                    "Guardar Perfil"
                  )}
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

// ==========================================================
// ORGANIZATION PROFILE EDITOR
// ==========================================================
function OrganizationProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile Fields State
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPosition, setContactPosition] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [verificationDocUrl, setVerificationDocUrl] = useState("");

  useEffect(() => {
    async function fetchOrgProfile() {
      setLoading(true);
      try {
        const response = await axiosClient.get("/organizations/me");
        const o = response.data;
        setName(o.name || "");
        setType(o.type || "Empresa");
        setCountry(o.country || "");
        setCity(o.city || "");
        setWebsite(o.website || "");
        setDescription(o.description || "");
        setLogoUrl(o.logo_url || "");
        setContactName(o.contact_name || "");
        setContactPosition(o.contact_position || "");
        setContactEmail(o.contact_email || "");
        setContactPhone(o.contact_phone || "");
        setVerificationDocUrl(o.verification_document_url || "");
      } catch (err) {
        console.error("Failed to load organization profile:", err);
        setErrorMsg("No se pudo cargar el perfil de la organización.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrgProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!name.trim() || !country.trim() || !city.trim() || !contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setErrorMsg("Por favor, completa todos los campos obligatorios (*).");
      return;
    }

    setSaving(true);
    try {
      const response = await axiosClient.put("/organizations/me", {
        name,
        type,
        country,
        city,
        website: website.trim() || null,
        description: description.trim() || null,
        logo_url: logoUrl.trim() || null,
        contact_name: contactName,
        contact_position: contactPosition,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        verification_document_url: verificationDocUrl.trim() || null
      });
      
      const o = response.data;
      setName(o.name || "");
      setType(o.type || "");
      setCountry(o.country || "");
      setCity(o.city || "");
      setWebsite(o.website || "");
      setDescription(o.description || "");
      setLogoUrl(o.logo_url || "");
      setContactName(o.contact_name || "");
      setContactPosition(o.contact_position || "");
      setContactEmail(o.contact_email || "");
      setContactPhone(o.contact_phone || "");
      setVerificationDocUrl(o.verification_document_url || "");

      setSuccessMsg("¡Perfil organizacional actualizado con éxito!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Failed to update organization profile:", err);
      setErrorMsg(err.response?.data?.detail || "Error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        <p className="text-gray-400 text-sm">Cargando perfil organizacional...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-700 animate-fadeIn max-w-4xl mx-auto pb-12 text-left">
      
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-display font-extrabold text-3xl text-[#00135B]">
          Perfil de la Organización
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Actualiza los datos institucionales de tu organización y la información de la persona responsable.
        </p>
      </div>

      {/* Success and Error Alerts */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-4 rounded-2xl text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-2xl text-sm flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-gray-150 shadow-lg space-y-8">
        
        {/* SECTION 1: ORG DETAILS */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#5D8CE2]" />
            <h2 className="text-lg font-bold font-display text-[#00135B]">1. Datos de la Organización</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre de la Organización *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tipo de Organización *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all bg-white"
              >
                <option value="ONG">ONG</option>
                <option value="Universidad">Universidad</option>
                <option value="Fundación">Fundación</option>
                <option value="Empresa">Empresa</option>
                <option value="Organismo Internacional">Organismo Internacional</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">País *</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-11 pr-4 bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Ciudad *</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-11 pr-4 bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Sitio Web Oficial</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-11 pr-4 bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">URL del Logo (Opcional)</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Descripción Breve</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT DETAILS */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-[#5D8CE2]" />
            <h2 className="text-lg font-bold font-display text-[#00135B]">2. Datos del Responsable</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre Completo *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Cargo en la Organización *</label>
              <input
                type="text"
                required
                value={contactPosition}
                onChange={(e) => setContactPosition(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Correo Electrónico Institucional *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full pl-11 pr-4 bg-slate-50 border border-gray-200 focus:bg-white text-slate-850 rounded-xl py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Teléfono / WhatsApp *</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full pl-11 pr-4 bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">URL del Documento de Respaldo</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={verificationDocUrl}
                  onChange={(e) => setVerificationDocUrl(e.target.value)}
                  className="w-full pl-11 pr-4 bg-slate-50 border border-gray-200 focus:bg-white text-slate-800 rounded-xl py-3 text-sm focus:outline-none focus:border-[#5D8CE2] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-gray-150 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <span>Guardar Cambios</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
