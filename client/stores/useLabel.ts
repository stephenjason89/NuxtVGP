export const useLabel = defineStore('label', {
    state: () => ({} as { [name: string]: string }),
    actions: {
        updateLabels(labels: { name: string; alias: string }[]) {
            for (const label of labels) this.$patch({ [label.name]: label.alias })
        },
    },
    ...(process.client
        ? {
              persist: {
                  key: 'labels',
                  storage: localStorage,
              },
          }
        : {}),
})
