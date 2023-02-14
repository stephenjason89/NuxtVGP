import { createPersistedState } from 'pinia-plugin-persistedstate'
import cookies from 'cookie-universal'
export default defineNuxtPlugin((nuxtApp) => {
    const event = nuxtApp.ssrContext
    const Cookies = cookies(event?.req, event?.res)

    function handleCookie(data: any, key: string, value = '', numberOfCookies = 5, cookie = '') {
        for (let i = 0; i < numberOfCookies; i++)
            if (value) {
                const length = Math.ceil(value.length / numberOfCookies)
                const start = i * length
                const end = start + length
                data(key + (i || ''), value.toString()?.substring(start, end), {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 90,
                })
            } else cookie += data(key + (i || ''))
        return cookie
    }

    nuxtApp.$pinia.use(
        createPersistedState({
            storage: {
                getItem: (key) => {
                    return handleCookie(Cookies.get, key)
                },
                setItem: (key, value) => {
                    handleCookie(Cookies.set, key, value)
                },
            },
        }),
    )
})
