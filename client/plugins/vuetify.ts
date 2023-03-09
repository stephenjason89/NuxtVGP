import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as labs from 'vuetify/labs/components'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components: { ...labs },
        icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
        ssr: true,
    })

    nuxtApp.vueApp.use(vuetify)
})
