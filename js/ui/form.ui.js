import { CATEGORIES } from '../config/constants.js';
import { qs, qsa, populateSelect } from '../utils/dom.js';
import { getTodayISO } from '../utils/formatters.js';
import { validateTransaction } from '../utils/validators.js';

const FIELDS = ['amount', 'category', 'date', 'description'];

/**
 * @param {{ onSubmit: (data: object, id: string|null) => void, onCancel: () => void }} handlers
 */
export function createFormUI({ onSubmit, onCancel }) {
  const form = qs('#transaction-form');
  const idInput = qs('#transaction-id');
  const title = qs('#form-title');
  const submitBtn = qs('#submit-btn');
  const cancelBtn = qs('#cancel-btn');
  const typeRadios = qsa('input[name="type"]', form);
  const controls = {
    amount: qs('#amount'),
    category: qs('#category'),
    date: qs('#date'),
    description: qs('#description'),
  };

  const getType = () => typeRadios.find((radio) => radio.checked)?.value ?? '';

  function renderCategories(selected) {
    populateSelect(controls.category, CATEGORIES[getType()] ?? []);
    if (selected) controls.category.value = selected;
  }

  function getValues() {
    return {
      type: getType(),
      amount: controls.amount.value,
      category: controls.category.value,
      date: controls.date.value,
      description: controls.description.value,
    };
  }

  function clearErrors() {
    FIELDS.forEach((field) => {
      qs(`#${field}-error`).textContent = '';
      controls[field].classList.remove('is-invalid');
    });
  }

  function showErrors(errors) {
    FIELDS.forEach((field) => {
      qs(`#${field}-error`).textContent = errors[field] ?? '';
      controls[field].classList.toggle('is-invalid', Boolean(errors[field]));
    });
    const firstInvalid = FIELDS.find((field) => errors[field]);
    if (firstInvalid) controls[firstInvalid].focus();
  }

  function setMode(isEditing) {
    title.textContent = isEditing ? 'Edit Transaction' : 'Add Transaction';
    submitBtn.textContent = isEditing ? 'Save Changes' : 'Add Transaction';
    cancelBtn.hidden = !isEditing;
  }

  function reset() {
    form.reset();
    idInput.value = '';
    renderCategories();
    controls.date.value = getTodayISO();
    clearErrors();
    setMode(false);
  }

  function startEdit(transaction) {
    reset();
    idInput.value = transaction.id;
    typeRadios.forEach((radio) => {
      radio.checked = radio.value === transaction.type;
    });
    renderCategories(transaction.category);
    controls.amount.value = transaction.amount;
    controls.date.value = transaction.date;
    controls.description.value = transaction.description;
    setMode(true);
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    controls.amount.focus();
  }

  const getEditingId = () => idInput.value || null;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = getValues();
    const { isValid, errors } = validateTransaction(data);

    if (!isValid) {
      showErrors(errors);
      return;
    }

    clearErrors();
    onSubmit(data, getEditingId());
  });

  typeRadios.forEach((radio) =>
    radio.addEventListener('change', () => renderCategories())
  );
  cancelBtn.addEventListener('click', onCancel);

  // Clear a field's error as soon as the user edits it
  FIELDS.forEach((field) => {
    controls[field].addEventListener('input', () => {
      qs(`#${field}-error`).textContent = '';
      controls[field].classList.remove('is-invalid');
    });
  });

  reset();

  return { reset, startEdit, getEditingId };
}
