class Form {
    [x: string]: any
    /**
     * Create a new Form instance.
     *
     * @param {object} data
     */
    constructor(data: { [x: string]: any; errors: any }) {
        Object.assign(this, data)
        this.errors = new Errors(data.errors)
    }

    /**
     * Reset the form fields.
     */
    reset(preventFormReset = false) {
        // @ts-ignore
        if (!preventFormReset) for (const field in this) if (field !== 'errors') this[field] = ''
        this.errors.clear()
    }

    /**
     * Send a GET request to the given URL.
     * .
     * @param {string} url
     * @param preventFormReset
     */
    get(url: string, preventFormReset = false): any {
        return this.submit('GET', url + '?' + this.formEncode(this), preventFormReset)
    }

    /**
     * Send a POST request to the given URL.
     * .
     * @param {string} url
     * @param preventFormReset
     */
    post(url: string, preventFormReset = false): any {
        return this.submit('POST', url, preventFormReset)
    }

    /**
     * Send a PUT request to the given URL.
     * .
     * @param {string} url
     */
    put(url: string): any {
        return this.submit('PUT', url)
    }

    /**
     * Send a PATCH request to the given URL.
     * .
     * @param {string} url
     */
    patch(url: string): any {
        return this.submit('PATCH', url)
    }

    /**
     * Send a DELETE request to the given URL.
     * .
     * @param {string} url
     */
    delete(url: string): any {
        return this.submit('DELETE', url)
    }

    /**
     * Submit the form.
     *
     * @param {string} requestType
     * @param {string} url
     * @param preventFormReset
     */
    submit(requestType: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string, preventFormReset = false) {
        return new Promise((resolve, reject) => {
            $fetch(url, { method: requestType, params: this })
                .then((response: any) => {
                    this.reset(preventFormReset)
                    if (response.error_message || response.error) this.errors.record(response)
                    resolve(response)
                })
                .catch((error) => {
                    this.errors.record(error.response)
                    reject(error.response)
                })
        })
    }

    formEncode(obj: this) {
        const str = []
        for (const p in obj) str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
        return str.join('&')
    }
}

class Errors {
    [x: string]: any
    constructor(data: { [x: string]: any }) {
        for (const field in data) this[field] = ''
    }

    /**
     * Record the new errors.
     *
     * @param {object} errors
     */
    record(errors: object) {
        Object.assign(this, errors)
    }

    /**
     * Clear one or all error fields.
     *
     * @param {string|null} field
     */
    clear(field = null) {
        for (const key in this) {
            // @ts-ignore
            if (!field) this[key] = ''
            else if (field === key) {
                // @ts-ignore
                this[key] = ''
                break
            }
        }
    }
}

export default Form
