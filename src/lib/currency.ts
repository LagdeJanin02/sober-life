// Conversión de divisa simulada para el directorio médico.

export type Currency = "DOP" | "USD" | "EUR" | "COP" | "MXN";

export const CURRENCIES: { code: Currency; label: string; flag: string; symbol: string }[] = [
  { code: "DOP", label: "Peso Dominicano", flag: "🇩🇴", symbol: "RD$" },
  { code: "USD", label: "Dólar Americano", flag: "🇺🇸", symbol: "US$" },
  { code: "EUR", label: "Euro", flag: "🇪🇺", symbol: "€" },
  { code: "COP", label: "Peso Colombiano", flag: "🇨🇴", symbol: "COL$" },
  { code: "MXN", label: "Peso Mexicano", flag: "🇲🇽", symbol: "MX$" },
];

// Tasa: 1 USD -> X de cada divisa (aprox, simulado).
const RATE_FROM_USD: Record<Currency, number> = {
  USD: 1,
  DOP: 58.5,
  EUR: 0.92,
  COP: 4100,
  MXN: 18.7,
};

/** El precio base de cada profesional viene expresado en USD. */
export function convertFromUSD(amountUSD: number, to: Currency): number {
  return amountUSD * RATE_FROM_USD[to];
}

export function formatPrice(amountUSD: number, to: Currency): string {
  const v = convertFromUSD(amountUSD, to);
  const meta = CURRENCIES.find((c) => c.code === to)!;
  const rounded = to === "COP" ? Math.round(v / 100) * 100 : Math.round(v);
  return `${meta.symbol} ${rounded.toLocaleString("es")}`;
}