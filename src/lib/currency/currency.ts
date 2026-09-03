// ─── Currency Configuration ───────────────────────────────────
// Base currency: INR. All prices stored in INR.
// Rates are managed in the database (Currency model).
// This file provides client-side formatting utilities.

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rate: number;          // relative to INR (1 INR = X currency)
  decimalPlaces: number;
  position: "before" | "after";
  spaceBetween: boolean;
}

// Default currency configs (overridden by DB values at runtime)
export const DEFAULT_CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    rate: 1,
    decimalPlaces: 0,
    position: "before",
    spaceBetween: false,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 0.012,
    decimalPlaces: 2,
    position: "before",
    spaceBetween: false,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.011,
    decimalPlaces: 2,
    position: "before",
    spaceBetween: false,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    rate: 0.0094,
    decimalPlaces: 2,
    position: "before",
    spaceBetween: false,
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    name: "Singapore Dollar",
    rate: 0.016,
    decimalPlaces: 2,
    position: "before",
    spaceBetween: false,
  },
  AED: {
    code: "AED",
    symbol: "د.إ",
    name: "UAE Dirham",
    rate: 0.044,
    decimalPlaces: 2,
    position: "after",
    spaceBetween: true,
  },
};

// ─── Convert price from INR to target currency ────────────────
export function convertPrice(
  priceInINR: number,
  toCurrency: string,
  currencies: Record<string, CurrencyConfig> = DEFAULT_CURRENCIES
): number {
  const config = currencies[toCurrency];
  if (!config) return priceInINR;
  return priceInINR * config.rate;
}

// ─── Format price with currency symbol ───────────────────────
export function formatPrice(
  amount: number,
  currencyCode: string,
  currencies: Record<string, CurrencyConfig> = DEFAULT_CURRENCIES
): string {
  const config = currencies[currencyCode] || DEFAULT_CURRENCIES.INR;

  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces,
  }).format(amount);

  const space = config.spaceBetween ? " " : "";

  return config.position === "before"
    ? `${config.symbol}${space}${formatted}`
    : `${formatted}${space}${config.symbol}`;
}

// ─── Format price from INR with conversion ────────────────────
export function formatConvertedPrice(
  priceInINR: number,
  toCurrency: string,
  currencies: Record<string, CurrencyConfig> = DEFAULT_CURRENCIES
): string {
  const converted = convertPrice(priceInINR, toCurrency, currencies);
  return formatPrice(converted, toCurrency, currencies);
}

// ─── Currency flag emojis ─────────────────────────────────────
export const CURRENCY_FLAGS: Record<string, string> = {
  INR: "🇮🇳",
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  SGD: "🇸🇬",
  AED: "🇦🇪",
};
