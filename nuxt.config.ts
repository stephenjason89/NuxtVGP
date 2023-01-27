import vuetify from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    buildDir: '_nuxt',
    srcDir: 'client/',
    css: ['vuetify/lib/styles/main.sass'],
    build: {
        transpile: ['vuetify'],
    },
    imports: {
        dirs: ['./stores'],
    },
    apollo: {
        autoImports: true,
        proxyCookies: true,
        clients: {
            default: {
                httpEndpoint: 'https://spacex-production.up.railway.app/',
            },
        },
    },
    modules: [
        '@nuxtjs/apollo',
        ['@pinia/nuxt', { autoImports: ['defineStore', 'acceptHMRUpdate'] }],
        async (options, nuxt) => {
            await nuxt.hooks.hook('vite:extendConfig', (config: any) => config.plugins.push(vuetify()))
        },
    ],
})
