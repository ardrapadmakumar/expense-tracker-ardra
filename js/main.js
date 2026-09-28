import { StorageService } from './services/storage.service.js';
import { TransactionService } from './services/transaction.service.js';
import { createFormUI } from './ui/form.ui.js';
import { createListUI } from './ui/list.ui.js';
import { createSummaryUI } from './ui/summary.ui.js';
import { createFiltersUI } from './ui/filters.ui.js';
import { createChartUI } from './ui/chart.ui.js';
import { createExportUI } from './ui/export.ui.js';

const service = new TransactionService(new StorageService());

const formUI = createFormUI({
  onSubmit: handleSubmit,
  onCancel: () => formUI.reset(),
});
const listUI = createListUI({ onEdit: handleEdit, onDelete: handleDelete });
const summaryUI = createSummaryUI({ onMonthChange: render });
const filtersUI = createFiltersUI({ onChange: render });
const chartUI = createChartUI();
createExportUI({ getTransactions: () => service.getAll() });

function handleSubmit(data, id) {
  if (id) service.update(id, data);
  else service.add(data);

  formUI.reset();
  render();
}

function handleEdit(id) {
  const transaction = service.getById(id);
  if (transaction) formUI.startEdit(transaction);
}

function handleDelete(id) {
  if (!window.confirm('Delete this transaction?')) return;

  service.remove(id);
  // Don't leave the form editing a transaction that no longer exists
  if (formUI.getEditingId() === id) formUI.reset();
  render();
}

function render() {
  listUI.render(service.filter(filtersUI.getFilters()));
  summaryUI.renderTotals(service.calculateTotals());

  const month = summaryUI.getMonth();
  summaryUI.renderMonthly(
    month ? service.getMonthlySummary(month) : { income: 0, expense: 0, net: 0 }
  );
  chartUI.render(month ? service.getExpenseByCategory(month) : []);
}

render();
