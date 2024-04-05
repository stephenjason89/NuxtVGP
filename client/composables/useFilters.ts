export function useFilters() {
    const filters = ref(['All']);
    const activeFilter = ref('All');

    function filter(filter:string){
        activeFilter.value = filter;
    }

    return {
        filters,
        activeFilter,
        filter
    }
}