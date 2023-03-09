import vuetify from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    srcDir: 'client/',
    build: { transpile: ['vuetify'] },
    imports: { dirs: ['./stores'] },
    apollo: {
        autoImports: true,
        proxyCookies: true,
        clients: {
            default: { httpEndpoint: 'https://spacex-production.up.railway.app/' },
        },
    },
    modules: ['@nuxtjs/apollo', ['@pinia/nuxt', { autoImports: ['defineStore', 'acceptHMRUpdate'] }]],
    hooks: {
        'vite:extendConfig': (config) => {
            config?.plugins?.push(vuetify())
        },
    },
})
