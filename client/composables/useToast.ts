import Toast from '~/types/IziToast'

export default function (): Toast {
    return useNuxtApp().$iziToast
}
