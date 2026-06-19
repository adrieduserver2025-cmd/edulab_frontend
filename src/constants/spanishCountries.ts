/**
 * Lista de países de habla hispana/castellana con su bandera emoji.
 * Ordenados alfabéticamente.
 */
export const SPANISH_SPEAKING_COUNTRIES = [
  { flag: "🇦🇷", name: "Argentina" },
  { flag: "🇧🇴", name: "Bolivia" },
  { flag: "🇨🇱", name: "Chile" },
  { flag: "🇨🇴", name: "Colombia" },
  { flag: "🇨🇷", name: "Costa Rica" },
  { flag: "🇨🇺", name: "Cuba" },
  { flag: "🇩🇴", name: "República Dominicana" },
  { flag: "🇪🇨", name: "Ecuador" },
  { flag: "🇸🇻", name: "El Salvador" },
  { flag: "🇬🇶", name: "Guinea Ecuatorial" },
  { flag: "🇬🇹", name: "Guatemala" },
  { flag: "🇭🇳", name: "Honduras" },
  { flag: "🇲🇽", name: "México" },
  { flag: "🇳🇮", name: "Nicaragua" },
  { flag: "🇵🇦", name: "Panamá" },
  { flag: "🇵🇾", name: "Paraguay" },
  { flag: "🇵🇪", name: "Perú" },
  { flag: "🇵🇷", name: "Puerto Rico" },
  { flag: "🇪🇸", name: "España" },
  { flag: "🇺🇾", name: "Uruguay" },
  { flag: "🇻🇪", name: "Venezuela" },
];

export type SpanishCountry = typeof SPANISH_SPEAKING_COUNTRIES[number];
