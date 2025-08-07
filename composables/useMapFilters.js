import { ref } from 'vue';

export const filters = ref({
    language: null,
    category: null,
    isIndoors: null
});
export function useMapFilters() {
    function setFilters(key, value) {
        filters.value[key] = value;
    };
    return { filters, setFilters } 
}