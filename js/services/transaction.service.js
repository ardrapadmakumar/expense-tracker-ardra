import { FILTER_ALL, TRANSACTION_TYPES } from '../config/constants.js';

// Avoids floating point artifacts like 0.1 + 0.2 = 0.30000000000000004
const round = (value) => Math.round(value * 100) / 100;

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export class TransactionService {
  /** @param {import('./storage.service.js').StorageService} storage */
  constructor(storage) {
    this.storage = storage;
    this.transactions = storage.load();
  }

  /** Newest first (by date, then by creation time). */
  getAll() {
    return [...this.transactions].sort(
      (a, b) => b.date.localeCompare(a.date) || (b.createdAt ?? 0) - (a.createdAt ?? 0)
    );
  }

  getById(id) {
    return this.transactions.find((t) => t.id === id) ?? null;
  }

  add(data) {
    const transaction = {
      id: generateId(),
      ...this.#normalize(data),
      createdAt: Date.now(),
    };
    this.transactions.push(transaction);
    this.#persist();
    return transaction;
  }

  update(id, data) {
    const index = this.transactions.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.transactions[index] = {
      ...this.transactions[index],
      ...this.#normalize(data),
    };
    this.#persist();
    return this.transactions[index];
  }

  remove(id) {
    const before = this.transactions.length;
    this.transactions = this.transactions.filter((t) => t.id !== id);
    const removed = this.transactions.length < before;
    if (removed) this.#persist();
    return removed;
  }

  /**
   * @param {{ type?: string, category?: string }} filters
   */
  filter({ type = FILTER_ALL, category = FILTER_ALL } = {}) {
    return this.getAll().filter(
      (t) =>
        (type === FILTER_ALL || t.type === type) &&
        (category === FILTER_ALL || t.category === category)
    );
  }

  /** Totals for the given list (defaults to all transactions). */
  calculateTotals(list = this.transactions) {
    const totals = list.reduce(
      (acc, t) => {
        if (t.type === TRANSACTION_TYPES.INCOME) acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return {
      income: round(totals.income),
      expense: round(totals.expense),
      balance: round(totals.income - totals.expense),
    };
  }

  /** @param {string} month 'YYYY-MM' */
  getMonthlySummary(month) {
    const { income, expense } = this.calculateTotals(this.#byMonth(month));
    return { income, expense, net: round(income - expense) };
  }

  /**
   * Expense totals per category for a month, largest first.
   * @param {string} month 'YYYY-MM'
   * @returns {{ category: string, total: number }[]}
   */
  getExpenseByCategory(month) {
    const totals = new Map();

    this.#byMonth(month)
      .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
      .forEach((t) => totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount));

    return [...totals.entries()]
      .map(([category, total]) => ({ category, total: round(total) }))
      .sort((a, b) => b.total - a.total);
  }

  #byMonth(month) {
    return this.transactions.filter((t) => t.date.startsWith(month));
  }

  #normalize({ type, amount, category, date, description }) {
    return {
      type,
      amount: round(Number(amount)),
      category,
      date,
      description: description.trim(),
    };
  }

  #persist() {
    this.storage.save(this.transactions);
  }
}
