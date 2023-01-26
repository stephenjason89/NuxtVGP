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
        dirs: ['client/stores'],
    },
    modules: [
        ['@pinia/nuxt', { autoImports: ['defineStore', 'acceptHMRUpdate'] }],
        async (options, nuxt) => {
            await nuxt.hooks.hook('vite:extendConfig', (config: any) => config.plugins.push(vuetify()))
        },
    ],
})
