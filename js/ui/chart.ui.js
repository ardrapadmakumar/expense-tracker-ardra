import { clearElement, createElement, qs } from '../utils/dom.js';
import { formatCurrency } from '../utils/formatters.js';

export function createChartUI() {
  const chart = qs('#category-chart');
  const emptyState = qs('#chart-empty');

  function createRow({ category, total }, max) {
    const bar = createElement('div', { className: 'chart-bar' });
    bar.style.width = `${(total / max) * 100}%`;

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
    chart.append(...data.map((item) => createRow(item, max)));
  }

  return { render };
}
