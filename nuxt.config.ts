import vuetify from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    buildDir: '_nuxt',
    srcDir: 'client/',
    css: ['vuetify/lib/styles/main.sass'],
    build: {
        transpile: ['vuetify', '@apollo/client/core', '@vue/apollo-composable', 'vue-apollo/ssr'],
    },
    imports: {
        dirs: ['./stores'],
    },
    // apollo: {
    //     autoImports: true,
    //     proxyCookies: true,
    //     clients: {
    //         default: {
    //             httpEndpoint: 'https://spacex-production.up.railway.app/',
    //         },
    //     },
    // },
    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    modules: [
        ['@pinia/nuxt', { autoImports: ['defineStore', 'acceptHMRUpdate'] }],
        async (options, nuxt) => {
            await nuxt.hooks.hook('vite:extendConfig', (config: any) => config.plugins.push(vuetify()))
        },
    ],
    runtimeConfig: {
        public: {
            nuxtURL: process.env.NUXT_URL,
            graphqlEndpoint: process.env.GRAPHQL_URL,
            pusherKey: process.env.PUSHER_APP_KEY,
            wsHostname: process.env.WS_HOSTNAME,
            wsPort: process.env.WS_PORT,
        },
    },
})
