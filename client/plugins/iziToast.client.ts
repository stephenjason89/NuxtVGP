import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'
import IziToastProp from '~/types/IziToast'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.$iziToast = <IziToastProp>{
        ...iziToast,
        hideToast(title, message, status) {
            const color: { [index: string]: string } = {
                info: 'blue',
                success: 'green',
                warning: 'orange',
                error: 'red',
                question: 'yellow',
            }

            let newId = btoa(encodeURIComponent(title + message + color[status]))
            newId = newId.replace(/=/g, '')
            const settings = {
                title,
                message,
                id: newId,
            }

            document.querySelectorAll('.iziToast' + '#' + newId).forEach((element: any) => {
                iziToast.hide(settings, element, 'replaced')
            })
        },
        data(data) {
            const timeout = data.timeout ?? 2500
            const layout = data.layout ?? 1
            const position = data.position ?? 'bottomRight'
            const displayMode = data.displayMode ?? 0
            const pauseOnHover = !data.pauseOnHover
            const close = !data.close
            const maxWidth = data.maxWidth ?? undefined

            const THEMES: { [index: string]: { color: string; icon: string } } = {
                info: {
                    color: 'blue',
                    icon: 'ico-info',
                },
                success: {
                    color: 'green',
                    icon: 'ico-success',
                },
                warning: {
                    color: 'orange',
                    icon: 'ico-warning',
                },
                error: {
                    color: 'red',
                    icon: 'ico-error',
                },
                question: {
                    color: 'yellow',
                    icon: 'ico-question',
                },
            }

            const settings = {
                title: data.title,
                message: data.message,
                color: THEMES[data.status].color,
                icon: THEMES[data.status].icon,
                timeout,
                layout,
                close,
                displayMode,
                position,
                pauseOnHover,
                maxWidth,
            }

            iziToast.show(settings)
        },
    }
})
