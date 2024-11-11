import { createVuetify } from 'vuetify'
import * as labs from 'vuetify/labs/components'
import 'vuetify/styles'
// Use this if you want only icons used by Vuetify components internally should be imported
// import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
export default defineNuxtPlugin((nuxtApp) => {
	const vuetify = createVuetify({
		components: { ...labs },
		// Refer to https://vuetifyjs.com/en/features/icon-fonts/
		// icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
		ssr: true,
	})

	nuxtApp.vueApp.use(vuetify)
})
