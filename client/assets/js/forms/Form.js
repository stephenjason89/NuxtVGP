import axios from 'axios'
import Errors from './Errors'

class Form {
    /**
     * Create a new Form instance.
     *
     * @param {object} data
     */
    constructor(data) {
        for (const field in data) this[field] = data[field]
        this.errors = new Errors(data.errors)
    }

    /**
     * Reset the form fields.
     */
    reset(preventFormReset = false) {
        if (!preventFormReset) for (const field in this) if (field !== 'errors') this[field] = ''
        this.errors.clear()
    }

    /**
     * Send a GET request to the given URL.
     * .
     * @param {string} url
     * @param preventFormReset
     */
    get(url, preventFormReset = false) {
        return this.submit('get', url + '?' + this.formEncode(this), preventFormReset)
    }

    /**
     * Send a POST request to the given URL.
     * .
     * @param {string} url
     * @param preventFormReset
     */
    post(url, preventFormReset = false) {
        return this.submit('post', url, preventFormReset)
    }

    /**
     * Send a PUT request to the given URL.
     * .
     * @param {string} url
     */
    put(url) {
        return this.submit('put', url)
    }

    /**
     * Send a PATCH request to the given URL.
     * .
     * @param {string} url
     */
    patch(url) {
        return this.submit('patch', url)
    }

    /**
     * Send a DELETE request to the given URL.
     * .
     * @param {string} url
     */
    delete(url) {
        return this.submit('delete', url)
    }

    /**
     * Submit the form.
     *
     * @param {string} requestType
     * @param {string} url
     * @param preventFormReset
     */
    submit(requestType, url, preventFormReset = false) {
        return new Promise((resolve, reject) => {
            axios[requestType](url, this)
                .then((response) => {
                    this.onSuccess(response.data, preventFormReset)
                    if (response.data.error_message || response.data.error) this.onFail(response.data)
                    resolve(response.data)
                })
                .catch((error) => {
                    this.onFail(error.response.data)

                    reject(error.response.data)
                })
        })
    }

    /**
     * Handle a successful form submission.
     *
     * @param {object} data
     * @param preventFormReset
     */

    onSuccess(data, preventFormReset = false) {
        this.reset(preventFormReset)
    }

    /**
     * Handle a failed form submission.
     *
     * @param {object} errors
     */
    onFail(errors) {
        this.errors.record(errors)
    }

    formEncode(obj) {
        const str = []
        for (const p in obj) str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
        return str.join('&')
    }
}

export default Form
