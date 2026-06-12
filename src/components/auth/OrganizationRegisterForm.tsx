import React, { useState } from "react";
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Globe, 
  MapPin, 
  Phone, 
  FileText, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert, 
  Camera 
} from "lucide-react";
import axiosClient from "../../services/api/axiosClient";

interface OrganizationRegisterFormProps {
  onBack: () => void;
}

export default function OrganizationRegisterForm({ onBack }: OrganizationRegisterFormProps) {
  // Wizard steps: 1 = Organization Details, 2 = Contact / Responsible Details & Password
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form Fields
  // Step 1: Org details
  const [name, setName] = useState("");
  const [type, setType] = useState("Empresa");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  
  // Step 2: Contact details & Password
  const [contactName, setContactName] = useState("");
  const [contactPosition, setContactPosition] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationDocUrl, setVerificationDocUrl] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate Step 1
    if (!name.trim()) {
      setError("El nombre de la organización es obligatorio.");
      return;
    }
    if (!country.trim()) {
      setError("El país es obligatorio.");
      return;
    }
    if (!city.trim()) {
      setError("La ciudad es obligatoria.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate Step 2
    if (!contactName.trim()) {
      setError("El nombre completo del responsable es obligatorio.");
      return;
    }
    if (!contactPosition.trim()) {
      setError("El cargo es obligatorio.");
      return;
    }
    if (!contactEmail.trim()) {
      setError("El correo institucional es obligatorio.");
      return;
    }
    if (!contactPhone.trim()) {
      setError("El teléfono o WhatsApp es obligatorio.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post("/organizations/register", {
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
        password,
        confirm_password: confirmPassword,
        verification_document_url: verificationDocUrl.trim() || null
      });

      setSuccess(true);
    } catch (err: any) {
      console.error("Org Registration Error:", err);
      const msg = err.response?.data?.detail || "Ocurrió un error al registrar la organización. Reintente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center py-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-display font-extrabold text-2xl text-[#00135B]">
            ¡Registro Enviado!
          </h3>
          <p className="text-sm text-[#00135B] font-bold">
            Tu organización ha quedado registrada correctamente.
          </p>
          <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl text-xs text-slate-500 leading-relaxed text-left space-y-2">
            <p className="font-semibold text-slate-600">🔔 Próximos pasos:</p>
            <p>“Tu solicitud será revisada por el equipo de EDULAB. Este proceso puede demorar hasta 24 horas. Te notificaremos por correo electrónico cuando tu organización sea aprobada.”</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 font-bold text-white text-xs tracking-wider uppercase cursor-pointer transition-all shadow-md"
        >
          Volver al Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
        <button 
          onClick={step === 2 ? () => setStep(1) : onBack}
          className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          {step === 2 ? "Atrás al Paso 1" : "Volver al Login"}
        </span>
        <span className="ml-auto text-[10px] bg-[#5D8CE2]/10 text-[#00135B] font-bold px-2 py-0.5 rounded">
          Paso {step} de 2
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-2xl text-[#00135B]">
          Registra tu Organización
        </h3>
        <p className="text-xs text-gray-500">
          {step === 1 
            ? "Paso 1: Completa los datos generales de la organización." 
            : "Paso 2: Completa la información del responsable y acceso."}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-rose-500" />
          <span className="text-left font-medium">{error}</span>
        </div>
      )}

      {step === 1 ? (
        // STEP 1: ORGANIZATION INFO
        <form onSubmit={handleNextStep} className="space-y-3.5">
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la Organización *"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 text-left pl-1">
                Tipo de Organización *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all bg-white"
              >
                <option value="ONG">ONG</option>
                <option value="Universidad">Universidad</option>
                <option value="Fundación">Fundación</option>
                <option value="Empresa">Empresa</option>
                <option value="Organismo Internacional">Organismo Internacional</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1 text-left pl-1">
                País *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="País (ej. Bolivia) *"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ciudad (ej. La Paz) *"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
              />
            </div>

            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Sitio Web (ej. https://edulab.com)"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
              />
            </div>
          </div>

          <div className="relative">
            <Camera className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="URL del Logo (Opcional)"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
            />
          </div>

          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción breve de la organización"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 font-bold text-white text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <span>Siguiente Paso</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        // STEP 2: RESPONSIBLE & PASSWORDS
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Nombre del Responsable *"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
              />
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={contactPosition}
                onChange={(e) => setContactPosition(e.target.value)}
                placeholder="Cargo *"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Correo Institucional *"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Teléfono / WhatsApp *"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña *"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar Contraseña *"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
              />
            </div>
          </div>

          <div className="relative">
            <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={verificationDocUrl}
              onChange={(e) => setVerificationDocUrl(e.target.value)}
              placeholder="URL Respaldo de Organización (Opcional)"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5D8CE2] focus:outline-none text-sm text-gray-700 transition-all"
            />
          </div>

          {/* Info Banner */}
          <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl text-[10px] text-slate-500 text-left leading-normal">
            ⚙️ Al registrarte, un administrador de EDULAB revisará tu solicitud de aprobación en un plazo de hasta 24 horas. Te enviaremos un correo cuando el acceso sea habilitado.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00135B] to-[#5D8CE2] hover:opacity-95 font-bold text-white text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
          >
            {loading ? "Procesando Registro..." : "Registrar Organización"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
