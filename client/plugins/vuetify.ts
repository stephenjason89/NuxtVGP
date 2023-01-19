import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labs from 'vuetify/labs/components'

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        components:{...components, ...labs},
        directives,
        ssr: true,
    })

    nuxtApp.vueApp.use(vuetify)
})