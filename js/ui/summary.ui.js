import { qs } from '../utils/dom.js';
import { formatCurrency, getCurrentMonth } from '../utils/formatters.js';

/**
 * @param {{ onMonthChange: () => void }} handlers
 */
export function createSummaryUI({ onMonthChange }) {
  const totalIncome = qs('#total-income');
  const totalExpense = qs('#total-expense');
  const balance = qs('#balance');
  const monthInput = qs('#summary-month');
  const monthIncome = qs('#month-income');
  const monthExpense = qs('#month-expense');
  const monthNet = qs('#month-net');

  monthInput.value = getCurrentMonth();
  monthInput.addEventListener('change', onMonthChange);

  function renderTotals({ income, expense, balance: bal }) {
    totalIncome.textContent = formatCurrency(income);
    totalExpense.textContent = formatCurrency(expense);
    balance.textContent = formatCurrency(bal);
  }

  function renderMonthly({ income, expense, net }) {
    monthIncome.textContent = formatCurrency(income);
    monthExpense.textContent = formatCurrency(expense);
    monthNet.textContent = formatCurrency(net);
  }

  const getMonth = () => monthInput.value;

  return { renderTotals, renderMonthly, getMonth };
}
