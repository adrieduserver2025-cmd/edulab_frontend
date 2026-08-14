import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Play,
  ArrowRight,
  Sparkles,
  UserCheck,
} from "lucide-react";
import type { ProductItem } from "../../constants/productsData";

interface ProductInfoModalProps {
  isOpen: boolean;
  product: ProductItem | null;
  onClose: () => void;
  onAction: (product: ProductItem, isSecondary?: boolean) => void;
}

export default function ProductInfoModal({
  isOpen,
  product,
  onClose,
  onAction,
}: ProductInfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const Icon = product.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
          aria-modal="true"
          role="dialog"
          aria-labelledby={`product-title-${product.id}`}
        >
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#01071c]/80 backdrop-blur-md"
          />

          {/* Modal Card Window */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-[#09226e] via-[#05174f] to-[#030e36] p-6 sm:p-8 text-white shadow-2xl z-10 custom-scrollbar"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar ventana de información"
              className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white cursor-pointer border-none"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 pr-10">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#ffc928]/40 bg-[#ffc928]/15 text-[#ffc928] shadow-lg">
                <Icon className="h-7 w-7" />
              </div>
              <div className="space-y-1 text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ffc928]/30 bg-[#ffc928]/10 px-3 py-0.5 text-[11px] font-bold text-[#ffc928] uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  Herramienta EDULAB
                </div>
                <h2
                  id={`product-title-${product.id}`}
                  className="text-2xl sm:text-3xl font-black text-white tracking-tight"
                >
                  {product.modalTitle}
                </h2>
                <p className="text-sm sm:text-base font-normal text-slate-300 leading-relaxed max-w-2xl">
                  {product.modalSubtitle}
                </p>
              </div>
            </div>

            {/* Content Grid (2 Cols on Desktop, 1 Col on Mobile) */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Funcionalidades & Pasos */}
              <div className="lg:col-span-7 space-y-7 text-left">
                {/* ¿Qué puedes hacer? / ¿Qué puedes revisar? */}
                <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-base font-extrabold text-[#ffc928] flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {product.featuresHeader}
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ffc928]/20 text-[#ffc928] text-[10px] font-bold">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ¿Cómo funciona? */}
                <div className="space-y-3.5 bg-white/5 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#ffc928]" />
                    {product.stepsHeader}
                  </h3>
                  <div className="space-y-3">
                    {product.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffc928]/15 border border-[#ffc928]/40 text-[#ffc928] text-xs font-black">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-slate-200 leading-snug pt-0.5">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => onAction(product, false)}
                    className="flex-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc928] px-6 text-sm font-extrabold text-[#061b58] shadow-lg shadow-amber-300/10 transition hover:-translate-y-0.5 hover:bg-[#ffd34f] cursor-pointer border-none"
                  >
                    {product.actionLabel}
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {product.secondaryActionLabel && (
                    <button
                      type="button"
                      onClick={() => onAction(product, true)}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/20 cursor-pointer"
                    >
                      <UserCheck className="h-4 w-4 text-[#ffc928]" />
                      {product.secondaryActionLabel}
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Video Tutorial Area */}
              <div className="lg:col-span-5 w-full space-y-3">
                <div className="text-left">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                    Tutorial de uso
                  </h3>
                  <p className="text-xs text-slate-400">
                    Aprende a utilizar esta herramienta paso a paso
                  </p>
                </div>

                {product.tutorialVideoUrl ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-black">
                    <iframe
                      src={product.tutorialVideoUrl}
                      title={`Video tutorial de ${product.title}`}
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-xl overflow-hidden group">
                    <div className="absolute inset-0 bg-radial from-[#ffc928]/10 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition duration-500 pointer-events-none" />
                    
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#ffc928]/40 bg-[#ffc928]/15 text-[#ffc928] shadow-inner group-hover:scale-110 transition duration-300">
                      <Play className="h-6 w-6 ml-0.5" />
                    </div>

                    <div className="relative z-10 space-y-1">
                      <h4 className="text-base font-extrabold text-white">
                        Tutorial próximamente
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                        Estamos preparando una guía visual paso a paso para ayudarte a aprovechar al máximo esta herramienta.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
