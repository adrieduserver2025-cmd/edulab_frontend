import {
  FileText,
  Mail,
  ClipboardCheck,
  Video,
  type LucideIcon,
} from "lucide-react";

export interface ProductItem {
  id: string;
  title: string;
  cardShortDesc: string;
  modalTitle: string;
  modalSubtitle: string;
  icon: LucideIcon;
  featuresHeader: string;
  features: string[];
  stepsHeader: string;
  steps: string[];
  tutorialVideoUrl?: string | null;
  actionLabel: string;
  secondaryActionLabel?: string;
}

export const productsData: ProductItem[] = [
  {
    id: "cv-inteligente",
    title: "CV Inteligente",
    cardShortDesc: "Crea, revisa y adapta tu currículum con IA",
    modalTitle: "CV Inteligente",
    modalSubtitle: "Prepara un currículum más claro, completo y adaptado a cada oportunidad.",
    icon: FileText,
    featuresHeader: "¿Qué puedes hacer?",
    features: [
      "Crear tu CV desde tu perfil",
      "Revisar un CV existente",
      "Detectar errores y aspectos a mejorar",
      "Adaptar tu CV a una oportunidad específica",
      "Recibir recomendaciones de IA",
    ],
    stepsHeader: "¿Cómo funciona?",
    steps: [
      "Completa o revisa la información de tu perfil.",
      "Carga tu CV o utiliza los datos de tu perfil.",
      "Selecciona la oportunidad a la que deseas postular.",
      "La IA analiza tu información y los requisitos.",
      "Recibe recomendaciones y genera una versión mejorada.",
    ],
    tutorialVideoUrl: null,
    actionLabel: "Probar CV Inteligente",
  },
  {
    id: "carta-motivacion",
    title: "Carta de Motivación",
    cardShortDesc: "Genera y mejora cartas personalizadas con IA",
    modalTitle: "Carta de Motivación",
    modalSubtitle: "Crea una carta personalizada que conecte tu experiencia con la oportunidad a la que quieres postular.",
    icon: Mail,
    featuresHeader: "¿Qué puedes hacer?",
    features: [
      "Generar una carta desde tu perfil",
      "Revisar una carta existente",
      "Adaptarla a una oportunidad específica",
      "Mejorar estructura y redacción",
      "Ajustarla al límite de palabras solicitado",
    ],
    stepsHeader: "¿Cómo funciona?",
    steps: [
      "Selecciona la oportunidad.",
      "Proporciona o confirma la información de tu perfil.",
      "Indica tus motivaciones y objetivos.",
      "La IA genera o analiza la carta.",
      "Revisa las recomendaciones y obtén una versión mejorada.",
    ],
    tutorialVideoUrl: null,
    actionLabel: "Probar Carta de Motivación",
  },
  {
    id: "simulador-postulacion",
    title: "Simulador de Postulación",
    cardShortDesc: "Comprueba si estás listo para postular a una oportunidad",
    modalTitle: "Simulador de Postulación",
    modalSubtitle: "Descubre qué necesitas antes de enviar tu postulación y organiza tus próximos pasos.",
    icon: ClipboardCheck,
    featuresHeader: "¿Qué puedes revisar?",
    features: [
      "Requisitos personales",
      "Requisitos académicos",
      "Idiomas",
      "Experiencia",
      "Documentos de respaldo",
      "Fechas límite",
      "Pendientes de tu postulación",
    ],
    stepsHeader: "¿Cómo funciona?",
    steps: [
      "Selecciona una oportunidad.",
      "La plataforma analiza sus requisitos.",
      "Compara los requisitos con la información de tu perfil.",
      "Identifica lo que cumples y lo que falta.",
      "Recibe un plan de acción para completar tu postulación.",
    ],
    tutorialVideoUrl: null,
    actionLabel: "Simular mi postulación",
  },
  {
    id: "preparacion-entrevistas",
    title: "Preparación de Entrevistas",
    cardShortDesc: "Practica tus entrevistas y mejora tus respuestas",
    modalTitle: "Preparación de Entrevistas",
    modalSubtitle: "Prepárate para responder con seguridad y comunicar mejor tus experiencias, objetivos y logros.",
    icon: Video,
    featuresHeader: "¿Qué puedes hacer?",
    features: [
      "Practicar preguntas frecuentes",
      "Simular una entrevista",
      "Mejorar tus respuestas",
      "Preparar tu presentación personal",
      "Identificar puntos que puedes mejorar",
      "Acceder a una sesión personalizada",
    ],
    stepsHeader: "¿Cómo funciona?",
    steps: [
      "Selecciona la oportunidad.",
      "Elige el tipo de entrevista.",
      "Practica las preguntas.",
      "Responde y recibe retroalimentación.",
      "Mejora tus respuestas antes de la entrevista real.",
    ],
    tutorialVideoUrl: null,
    actionLabel: "Practicar con IA",
    secondaryActionLabel: "Ver sesión personalizada",
  },
];
