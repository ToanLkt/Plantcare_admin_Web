import type { ChartValue, StatValue } from "../types/admin";

export function asCount(value: StatValue | undefined) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return Number(value.count) || 0;
}

export function chartRows(value: ChartValue | undefined) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => ({ name: item.key || "Unknown", value: Number(item.count) || 0 }));
  }
  return Object.entries(value).map(([name, count]) => ({ name, value: Number(count) || 0 }));
}

export function formatDate(value?: string) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function formatMoney(amount?: number, currency = "VND") {
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount || 0);
}

export function userIdOf(user: { id?: string | number; userId?: string | number; userID?: string | number; _id?: string | number }) {
  return String(user.id ?? user.userId ?? user.userID ?? user._id ?? "");
}
