export const useTheme = defineStore('theme', {
    /**
     * Theme state properties used to store data and be accessed publicly throughout components
     * @property {string} selected current selected theme. Default is 'None'
     * @property {string} body background color of the theme
     * @property {string} appBar top bar color of the theme
     * @property {string} cardColor card color of the theme
     * @property {string} profileFontColor font color of the theme. Default is 'black'
     * @property {string} fontColor font color of the theme
     */
    state: () => ({
        name: 'None',
        body: '',
        appBar: '#ccc',
        cardBar: '#eee',
        cardColor: 'white',
        profileFontColor: 'black',
        fontColor: '#373d3f',
        darkMode: false,
    }),
    actions: {
        /**
         * Theme actions. Used to switch themes and display assigned colors of each theme throughout components
         * @param {String} name committed theme
         */
        switchTheme(name: string) {
            this.name = name
            this.body = 'body-theme-' + name.toLowerCase()
            /**
             * switch case to change colors depending on theme
             * Affected components are:
             * @see (\erp\client\layouts\default.vue)
             * @see (\erp\client\components\dashboard\DashboardHeadChartsFirst.vue)
             * @see (\erp\client\components\nav\TabLink.vue)
             erp\client\components\chart\collection
             */

            switch (name) {
                case 'Day':
                    this.appBar = 'red'
                    this.cardBar = '#ff3648'
                    this.profileFontColor = 'white'
                    this.cardColor = '#FFFF8D'
                    this.fontColor = '#373d3f'
                    this.darkMode = false
                    break
                case 'Night':
                    this.appBar = 'purple'
                    this.cardBar = '#A5A'
                    this.profileFontColor = 'white'
                    this.cardColor = '#424242'
                    this.fontColor = 'white'
                    this.darkMode = true
                    break
                case 'Spring':
                    this.appBar = 'green'
                    this.cardBar = '#58CD56'
                    this.profileFontColor = 'white'
                    this.cardColor = '#F1F8E9'
                    this.fontColor = '#373d3f'
                    this.darkMode = false
                    break
                case 'Summer':
                    this.appBar = 'orange'
                    this.cardBar = '#FF9D33'
                    this.profileFontColor = 'white'
                    this.cardColor = '#FBE9E7'
                    this.fontColor = '#373d3f'
                    break
                case 'Autumn':
                    this.appBar = 'red'
                    this.cardBar = '#ff3648'
                    this.profileFontColor = 'white'
                    this.cardColor = '#EFEBE9'
                    this.fontColor = '#373d3f'
                    this.darkMode = false
                    break
                case 'Winter':
                    this.appBar = 'blue'
                    this.cardBar = '#46adec'
                    this.profileFontColor = 'white'
                    this.cardColor = '#263238'
                    this.fontColor = 'white'
                    this.darkMode = true
                    break
                default:
                    this.body = ''
                    this.appBar = '#ccc'
                    this.cardBar = '#eee'
                    this.cardColor = 'white'
                    this.profileFontColor = 'black'
                    this.fontColor = '#373d3f'
                    this.darkMode = false
            }

            /**
             * turns on vuetify night mode depending on selected theme
             */
            useNuxtApp().$vuetify.theme.dark = this.darkMode
        },
    },
    ...(process.client
        ? {
              persist: {
                  key: 'themes',
                  storage: localStorage,
              },
          }
        : {}),
})
