import { IziToast, IziToastSettings } from 'izitoast'

export default interface Toast extends IziToast {
    hideToast(title: string, message: string, status: string): void
    data(data: IziToastSettings & { status: string }): void
}
