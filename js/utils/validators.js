import { CATEGORIES, LIMITS, TRANSACTION_TYPES } from '../config/constants.js';

/**
 * Validates raw form data.
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateTransaction({ type, amount, category, date, description }) {
  const errors = {};

  if (!Object.values(TRANSACTION_TYPES).includes(type)) {
    errors.type = 'Please select a transaction type.';
  }

  const parsedAmount = Number(amount);
  if (amount === '' || amount === null || Number.isNaN(parsedAmount)) {
    errors.amount = 'Amount is required.';
  } else if (parsedAmount <= 0) {
    errors.amount = 'Amount must be greater than zero.';
  } else if (parsedAmount > LIMITS.MAX_AMOUNT) {
    errors.amount = 'Amount is too large.';
  }

  if (!category) {
    errors.category = 'Please select a category.';
  } else if (!CATEGORIES[type]?.includes(category)) {
    errors.category = 'Invalid category for this transaction type.';
  }

  if (!date) {
    errors.date = 'Date is required.';
  } else if (Number.isNaN(Date.parse(date))) {
    errors.date = 'Please enter a valid date.';
  }

  const trimmed = (description ?? '').trim();
  if (!trimmed) {
    errors.description = 'Description is required.';
  } else if (trimmed.length > LIMITS.MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be ${LIMITS.MAX_DESCRIPTION_LENGTH} characters or fewer.`;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
