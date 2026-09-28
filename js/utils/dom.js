export const qs = (selector, parent = document) => parent.querySelector(selector);

export const qsa = (selector, parent = document) => [
  ...parent.querySelectorAll(selector),
];

export function clearElement(element) {
  element.replaceChildren();
}

/**
 * Small helper to build elements without innerHTML (avoids XSS from user input).
 * createElement('li', { className: 'x', textContent: 'hi' }, [child1, child2])
 */
export function createElement(tag, props = {}, children = []) {
  const element = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'dataset') {
      Object.entries(value).forEach(([k, v]) => {
        element.dataset[k] = v;
      });
    } else {
      element[key] = value;
    }
  });
  children.forEach((child) => element.append(child));
  return element;
}

export function populateSelect(
  select,
  options,
  { includeAll = false, allLabel = 'All' } = {}
) {
  clearElement(select);
  if (includeAll) {
    select.append(createElement('option', { value: 'all', textContent: allLabel }));
  }
  options.forEach((option) => {
    select.append(createElement('option', { value: option, textContent: option }));
  });
}
