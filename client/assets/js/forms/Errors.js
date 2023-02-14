class Errors {
    constructor(data) {
        for (const field in data) this[field] = ''
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
        if (field) Object.assign(this, searchObj({ ...this }, field, 'delete'))
        else for (const key in this) this[key] = ''
    }
}

function searchObj(obj, query, newVal = '', fromInside = false) {
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
                if (newVal === 'delete') newObj[key] = ''
                else newObj[key] = newVal
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
