export const STORAGE_KEY = 'expense-tracker:transactions';

export const TRANSACTION_TYPES = Object.freeze({
  INCOME: 'income',
  EXPENSE: 'expense',
});

export const CATEGORIES = Object.freeze({
  [TRANSACTION_TYPES.INCOME]: [
    'Salary',
    'Freelance',
    'Investments',
    'Gift',
    'Other Income',
  ],
  [TRANSACTION_TYPES.EXPENSE]: [
    'Food',
    'Transport',
    'Rent',
    'Utilities',
    'Shopping',
    'Health',
    'Entertainment',
    'Education',
    'Other',
  ],
});

// Unique list of every category, used by the filter dropdown
export const ALL_CATEGORIES = [...new Set([...CATEGORIES.income, ...CATEGORIES.expense])];

export const FILTER_ALL = 'all';

export const CURRENCY = Object.freeze({
  locale: 'en-IN',
  code: 'INR',
});

export const LIMITS = Object.freeze({
  MAX_AMOUNT: 1_000_000_000,
  MAX_DESCRIPTION_LENGTH: 100,
});
