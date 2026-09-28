import { clearElement, createElement, qs } from '../utils/dom.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { TRANSACTION_TYPES } from '../config/constants.js';

function createActionButton(action, label, className, description) {
  const button = createElement('button', {
    type: 'button',
    className: `btn btn--small ${className}`,
    textContent: label,
    dataset: { action },
  });
  button.setAttribute('aria-label', `${label} ${description}`);
  return button;
}

function createTransactionItem(transaction) {
  const { id, type, amount, category, date, description } = transaction;
  const sign = type === TRANSACTION_TYPES.INCOME ? '+' : '-';

  const info = createElement('div', { className: 'transaction-info' }, [
    createElement('p', {
      className: 'transaction-description',
      textContent: description,
    }),
    createElement('p', {
      className: 'transaction-meta',
      textContent: `${category} · ${formatDate(date)}`,
    }),
  ]);

  const amountEl = createElement('span', {
    className: `transaction-amount transaction-amount--${type}`,
    textContent: `${sign}${formatCurrency(amount)}`,
  });

  const actions = createElement('div', { className: 'transaction-actions' }, [
    createActionButton('edit', 'Edit', 'btn--secondary', description),
    createActionButton('delete', 'Delete', 'btn--danger', description),
  ]);

  return createElement(
    'li',
    { className: `transaction-item transaction-item--${type}`, dataset: { id } },
    [info, amountEl, actions]
  );
}

/**
 * @param {{ onEdit: (id: string) => void, onDelete: (id: string) => void }} handlers
 */
export function createListUI({ onEdit, onDelete }) {
  const list = qs('#transaction-list');
  const emptyState = qs('#empty-state');

  // Event delegation: one listener for all edit/delete buttons
  list.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const { id } = button.closest('li').dataset;
    if (button.dataset.action === 'edit') onEdit(id);
    if (button.dataset.action === 'delete') onDelete(id);
  });

  function render(transactions) {
    clearElement(list);
    emptyState.hidden = transactions.length > 0;
    list.append(...transactions.map(createTransactionItem));
  }

  return { render };
}
