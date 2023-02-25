import vuetify from 'vite-plugin-vuetify'
import dynamicImport from 'vite-plugin-dynamic-import'
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    buildDir: '_nuxt',
    srcDir: 'client/',
    css: ['vuetify/lib/styles/main.sass', '~/assets/css/main.css'],
    build: {
        transpile: ['vuetify', '@apollo/client/core', '@vue/apollo-composable', 'vue-apollo/ssr'],
    },
    typescript: {
        strict: true,
        tsConfig: {
            compilerOptions: {
                lib: ['ESNext', 'DOM'],
                types: ['@types/lodash'],
            },
        },
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
            await nuxt.hooks.hook('vite:extendConfig', (config: any) => {
                config.plugins.push(vuetify())
                config.plugins.push(dynamicImport())
            })
        },
    ],
    runtimeConfig: {
        public: {
            nuxtURL: process.env.NUXT_URL,
            graphqlEndpoint: process.env.LARAVEL_URL,
            pusherKey: process.env.PUSHER_APP_KEY,
            pusherCluster: process.env.PUSHER_APP_CLUSTER,
            wsHostname: process.env.WS_HOSTNAME,
            wsPort: process.env.WS_PORT,
        },
    },
})
