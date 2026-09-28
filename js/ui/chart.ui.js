import { clearElement, createElement, qs } from '../utils/dom.js';
import { formatCurrency } from '../utils/formatters.js';

const COLORS = [
  '#4f46e5',
  '#16a34a',
  '#f59e0b',
  '#dc2626',
  '#0ea5e9',
  '#a855f7',
  '#ec4899',
  '#14b8a6',
  '#64748b',
];

const getColor = (index) => COLORS[index % COLORS.length];

/** Builds a conic-gradient string like 'red 0% 30%, blue 30% 100%'. */
function buildGradient(data) {
  const total = data.reduce((sum, item) => sum + item.total, 0);
  let start = 0;

  const stops = data.map((item, index) => {
    const end = index === data.length - 1 ? 100 : start + (item.total / total) * 100;
    const stop = `${getColor(index)} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    start = end;
    return stop;
  });

  return `conic-gradient(${stops.join(', ')})`;
}

export function createChartUI() {
  const chart = qs('#category-chart');
  const emptyState = qs('#chart-empty');

  function createPie(data) {
    const pie = createElement('div', { className: 'chart-pie' });
    pie.style.background = buildGradient(data);
    return pie;
  }

  function createRow({ category, total }, max, color) {
    const bar = createElement('div', { className: 'chart-bar' });
    bar.style.width = `${(total / max) * 100}%`;
    bar.style.background = color;

    return createElement('div', { className: 'chart-row' }, [
      createElement('span', {
        className: 'chart-label',
        textContent: category,
        title: category,
      }),
      createElement('div', { className: 'chart-bar-track' }, [bar]),
      createElement('span', {
        className: 'chart-value',
        textContent: formatCurrency(total),
      }),
    ]);
  }

  /** @param {{ category: string, total: number }[]} data sorted largest first */
  function render(data) {
    clearElement(chart);
    emptyState.hidden = data.length > 0;
    if (data.length === 0) return;

    const max = data[0].total;
    chart.append(
      createPie(data),
      ...data.map((item, index) => createRow(item, max, getColor(index)))
    );
  }

  return { render };
}
