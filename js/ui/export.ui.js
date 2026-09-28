import { qs } from '../utils/dom.js';
import { downloadFile, getExportFilename, toCSV, toJSON } from '../utils/exporters.js';

// '\uFEFF' (BOM) makes Excel read the CSV as UTF-8
const FORMATS = {
  csv: {
    build: toCSV,
    mimeType: 'text/csv;charset=utf-8;',
    prefix: '\uFEFF',
  },
  json: {
    build: toJSON,
    mimeType: 'application/json',
    prefix: '',
  },
};

/**
 * @param {{ getTransactions: () => object[] }} handlers
 */
export function createExportUI({ getTransactions }) {
  const menu = qs('#export-menu');

  menu.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-format]');
    if (!button) return;

    const transactions = getTransactions();
    menu.open = false;

    if (transactions.length === 0) {
      window.alert('There are no transactions to export.');
      return;
    }

    const format = button.dataset.format;
    const { build, mimeType, prefix } = FORMATS[format];
    downloadFile(prefix + build(transactions), getExportFilename(format), mimeType);
  });

  // Close the menu on outside click or Escape
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') menu.open = false;
  });
}
