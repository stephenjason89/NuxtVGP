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
        return this.submit('GET', url + '?' + this.formEncode(this), preventFormReset)
    }

    /**
     * Send a POST request to the given URL.
     * .
     * @param {string} url
     * @param preventFormReset
     */
    post(url, preventFormReset = false) {
        return this.submit('POST', url, preventFormReset)
    }

    /**
     * Send a PUT request to the given URL.
     * .
     * @param {string} url
     */
    put(url) {
        return this.submit('PUT', url)
    }

    /**
     * Send a PATCH request to the given URL.
     * .
     * @param {string} url
     */
    patch(url) {
        return this.submit('PATCH', url)
    }

    /**
     * Send a DELETE request to the given URL.
     * .
     * @param {string} url
     */
    delete(url) {
        return this.submit('DELETE', url)
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
            $fetch(url, { method: requestType, params: this })
                .then((response) => {
                    this.onSuccess(response, preventFormReset)
                    if (response.error_message || response.error) this.onFail(response)
                    resolve(response)
                })
                .catch((error) => {
                    this.onFail(error.response)
                    reject(error.response)
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
