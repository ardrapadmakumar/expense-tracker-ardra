import { ALL_CATEGORIES, FILTER_ALL } from '../config/constants.js';
import { populateSelect, qs } from '../utils/dom.js';

/**
 * @param {{ onChange: () => void }} handlers
 */
export function createFiltersUI({ onChange }) {
  const typeSelect = qs('#filter-type');
  const categorySelect = qs('#filter-category');
  const clearBtn = qs('#clear-filters-btn');

  populateSelect(categorySelect, ALL_CATEGORIES, {
    includeAll: true,
    allLabel: 'All categories',
  });

  const getFilters = () => ({
    type: typeSelect.value,
    category: categorySelect.value,
  });

  typeSelect.addEventListener('change', onChange);
  categorySelect.addEventListener('change', onChange);
  clearBtn.addEventListener('click', () => {
    typeSelect.value = FILTER_ALL;
    categorySelect.value = FILTER_ALL;
    onChange();
  });

  return { getFilters };
}
