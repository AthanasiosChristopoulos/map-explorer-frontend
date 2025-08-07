import { ref } from 'vue';

export const filters = ref({
    languages: null,
    categories: null,
    isIndoors: null
});

export function getFilters(key) {
    return filters.value[key];
};   

export function setFilters(key, value) {
    filters.value[key] = value;
};

export function pushFilters(key, value) {
  if (!Array.isArray(filters.value[key])) {
    filters.value[key] = [];
  }

  if (!filters.value[key].includes(value)) {
    filters.value[key].push(value);
  }
}

export function removeFilters(key, value) {
  if (Array.isArray(filters.value[key])) {
    filters.value[key] = filters.value[key].filter(item => item !== value);

    if (filters.value[key].length === 0) {
      filters.value[key] = null;
    }
  }
}
export function clearAllFilters() {
  for (const key in filters.value) {
    filters.value[key] = null;
  }
}
