import { CURRENCY } from '../config/constants.js';

const currencyFormatter = new Intl.NumberFormat(CURRENCY.locale, {
  style: 'currency',
  currency: CURRENCY.code,
});

export const formatCurrency = (amount) => currencyFormatter.format(amount);

/** Formats 'YYYY-MM-DD' as e.g. '28 Sep 2026' (parsed manually to avoid timezone shifts). */
export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const pad = (n) => String(n).padStart(2, '0');

export function getTodayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Returns the current month as 'YYYY-MM' (format used by <input type="month">). */
export function getCurrentMonth() {
  return getTodayISO().slice(0, 7);
}

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
