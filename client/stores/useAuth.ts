import Form from '~/assets/js/forms/Form.js'

export const useAuth = defineStore('auth', {
    state: () => ({
        userId: '',
        token: '',
        tokenExpiration: 0,
        refreshToken: null,
        refreshTokenExpiration: 0,
        isRefreshing: false,
    }),
    getters: {
        user: () => useUser(),
    },
    actions: {
        isTokenExpired() {
            return this.tokenExpiration < new Date().getTime()
        },
        isRefreshTokenExpired() {
            return this.refreshTokenExpiration < new Date().getTime()
        },
        /* eslint-disable */
        async login(data: any) {
            const form = data instanceof Form ? data : new Form(data)
            const { token_type, access_token, refresh_token, expires_in, user, error, message } =
                // @ts-ignore
                await form.post(useRuntimeConfig().public.graphqlEndpoint + '/api/get-token', true)
            if (!error) {
                const tokenExpiration = new Date().getTime() + expires_in * 1000
                const refreshTokenExpiration = new Date().getTime() + 60 * 60 * 24 * 30 * 1000
                this.user.setUser(user)
                this.$patch({
                    userId: user?.id,
                    token: `${token_type} ${access_token}`,
                    tokenExpiration,
                    refreshToken: refresh_token,
                    refreshTokenExpiration,
                    isRefreshing: false,
                })
                // @ts-ignore
                if (useNuxtApp().$router.currentRoute.name === 'login')
                    useNuxtApp().$router.push('/dashboard')
            } else {
                console.error('Login error:', error, message)
                this.logout()
            }
            console.log(form)
            return form
        },
        /* eslint-enable */
        logout(expired = false) {
            this.$reset()
            this.user.$reset()
            // @ts-ignore
            if (useNuxtApp().$router.currentRoute.name !== 'login') useNuxtApp().$router.push('/login')
            if (expired)
                useToast().error({
                    title: 'Session Expired',
                    message: 'Please re-login',
                })
        },
        async refresh() {
            if (this.isTokenExpired() && !this.isRefreshing)
                if (!this.isRefreshTokenExpired()) {
                    this.isRefreshing = true
                    await this.login({ refresh_token: this.refreshToken })
                    this.isRefreshing = false
                } else this.logout(true)
        },
        setUser(user: any) {
            this.user.setUser(user)
        },
    },
    persist: true,
})
