import { getTodayISO } from './formatters.js';

const CSV_HEADERS = ['Date', 'Type', 'Category', 'Description', 'Amount'];

/** Quotes a CSV cell, and neutralizes spreadsheet formulas (e.g. a description starting with "="). */
function escapeCell(value) {
  let text = String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCSV(transactions) {
  const rows = transactions.map((t) =>
    [t.date, t.type, t.category, t.description, t.amount].map(escapeCell).join(',')
  );
  return [CSV_HEADERS.join(','), ...rows].join('\r\n');
}

export function toJSON(transactions) {
  // Internal fields (id, createdAt) are not useful in an export
  const clean = transactions.map(({ date, type, category, description, amount }) => ({
    date,
    type,
    category,
    description,
    amount,
  }));
  return JSON.stringify(clean, null, 2);
}

export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const getExportFilename = (extension) =>
  `transactions-${getTodayISO()}.${extension}`;
