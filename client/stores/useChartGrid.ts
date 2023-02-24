export const useChartGrid = defineStore('chartGrid', {
    state: () => ({
        grids: {} as any,
    }),
    ...(process.client
        ? {
              persist: {
                  key: 'grids',
                  storage: localStorage,
              },
          }
        : {}),
})
