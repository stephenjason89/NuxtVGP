// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    buildDir: '_nuxt',
    srcDir: 'client/',
    css: ['vuetify/lib/styles/main.sass'],
    build: {
        transpile: ['vuetify'],
    },
})
