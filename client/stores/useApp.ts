export const useApp = defineStore('app', {
    state: () => ({
        isLoading: false,
        modal: {
            data: { dialog: false },
            serverModels: {},
            callback: null,
            loading: false,
            files: 0,
        },
        sidebar: {
            drawer: {
                main: true,
                local: false,
            },
            pinned: false,
        },
    }),
    actions: {
        resetModal() {
            this.modal.data.dialog = false
            setTimeout(() => {
                this.modal = {
                    data: { dialog: false },
                    serverModels: {},
                    callback: null,
                    loading: false,
                    files: 0,
                }
            }, 50)
        },
    },
})
