class Errors {
    constructor(data) {
        this.originalErrors = data
        for (const field in data) this[field] = ''
    }

    /**
     * Determine if an errors exists for the given field.
     *
     * @param {string} field
     */
    has(field) {
        return searchObj(this, field)
    }

    /**
     * Determine if we have any errors.
     */
    any() {
        return this.errors ? Object.keys(this.errors).length > 0 : Object.keys(this).length > 0
    }

    /**
     * Retrieve the error message for a field.
     *
     * @param {string} field
     */
    get(field) {
        const error = searchObj(this, field)
        return typeof error === 'string' ? error : error?.[0]
    }

    /**
     * Record the new errors.
     *
     * @param {object} errors
     */
    record(errors) {
        Object.assign(this, errors)
    }

    /**
     * Clear one or all error fields.
     *
     * @param {string|null} field
     */
    clear(field = null) {
        const copy = { ...this }
        for (const key in this) {
            if (key === 'originalErrors') continue
            if (key in this.originalErrors) this[key] = ''
            else delete this[key]
        }

        if (field) Object.assign(this, searchObj(copy, field, 'delete'))
    }
}

function searchObj(obj, query, newVal = false, fromInside = false) {
    let found = false
    let newObj = {}
    if (Array.isArray(obj)) newObj = []

    for (const key in obj) {
        let value = obj[key]

        if (typeof value === 'object') {
            value = searchObj(value, query, newVal, [key, newObj])
            found = value[1] ? value[1] : found
            value = value[0]
        }
        newObj[key] = value

        if (key === query) {
            if (newVal) {
                if (newVal === 'delete') {
                    if (key === 'originalErrors') continue
                    if (key in this.originalErrors) newObj[key] = ''
                    else delete newObj[key]
                } else newObj[key] = newVal
            }
            found = value
        }
    }
    if (fromInside) {
        return [newObj, found]
    }
    return newVal ? newObj : found
}

export default Errors
