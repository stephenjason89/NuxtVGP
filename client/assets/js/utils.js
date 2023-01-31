// import * as pluralize from 'pluralize'
import localforage from 'localforage'

export function getSubdomain(url) {
    return (url?.match(/localhost/g)?.length && url?.match(/\./g)?.length === 1) ||
        url?.match(/\./g)?.length === 2
        ? url.split('.')[0]
        : ''
}

export function toHMS(refDate, dateTime) {
    const ms = new Date(dateTime) - refDate
    let seconds = ms / 1000
    const hours = parseInt(seconds / 3600)
    seconds = seconds % 3600
    const minutes = parseInt(seconds / 60)
    seconds = parseInt(seconds % 60)
    return hours + ':' + minutes + ':' + seconds
}

export function plural(word, capitalizeFirst = true, count = 0, prefixCount = false) {
    word = word.toLowerCase()
    if (capitalizeFirst) word = word.charAt(0).toUpperCase() + word.slice(1)
    return pluralize(word, count, prefixCount)
}

export function singular(word, capitalizeFirst = true) {
    word = word.toLowerCase()
    if (capitalizeFirst) word = word.charAt(0).toUpperCase() + word.slice(1)
    return pluralize.singular(word)
}

export function convertDateTime(dateTime, toLocal = true) {
    if (toLocal) return dateTime?.split(' ')?.join('T')?.slice(0, -3)
    else return dateTime?.split('T')?.join(' ') + ':00'
}

export function dateTimeNow() {
    const date = new Date()
    return (
        date.getFullYear() +
        '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('00' + date.getDate()).slice(-2) +
        ' ' +
        ('00' + date.getHours()).slice(-2) +
        ':' +
        ('00' + date.getMinutes()).slice(-2) +
        ':' +
        ('00' + date.getSeconds()).slice(-2)
    )
}

export function removeNull(arrObj, props = null) {
    const deleteKey = (obj, propName) => {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName]
        }
    }
    const removeNullFrom = (obj) => {
        if (props) for (const propName of props) deleteKey(obj, propName)
        else for (const propName in obj) deleteKey(obj, propName)
    }

    if (Array.isArray(arrObj)) for (const obj of arrObj) removeNullFrom(obj)
    else removeNullFrom(arrObj)

    return arrObj
}

export function canUseWebP() {
    const elem = document.createElement('canvas')

    if (elem.getContext && elem.getContext('2d')) {
        // was able or not to get WebP representation
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }
    // very old browser like IE 8, canvas not supported
    return false
}

export async function rememberTour(name, userId, data = {}, key = 'tours', isRemember = true) {
    try {
        const tourData = (await localforage.getItem(key)) ?? {}

        return localforage.setItem(key, {
            ...tourData,
            [name]: { ...tourData[name], [userId]: { ...data, isRemember } },
        })
    } catch (e) {
        return new Promise((resolve, reject) => reject(e))
    }
}

export async function isRememberTour(name, userId, key = 'tours') {
    try {
        return (await localforage.getItem(key))?.[name]?.[userId].isRemember ?? false
    } catch {
        return new Promise((resolve) => resolve(false))
    }
}

export function traverseValue(obj, key) {
    return key.split('.').reduce((item, k) => {
        item = item?.[k]
        return item
    }, obj)
}

export function isEmptyFunction(func) {
    return func.toString().replace(/ |\n/g, '') === '()=>{}'
}

/**
 * @param {number} number
 * @param {Intl.NumberFormatOptions} options
 * @returns {string}
 */
export function numberFormatPeso(number, options = {}) {
    return Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', ...options }).format(number)
}

export function isFunction(value) {
    return typeof value === 'function'
}

export function isObject(value) {
    return typeof value === 'object' && !Array.isArray(value) && value !== null
}

export function isString(value) {
    return typeof value === 'string'
}

export function isNumber(value) {
    return typeof value === 'number'
}

export function isBoolean(value) {
    return typeof value === 'boolean'
}

export function range(start, stop, step = 1, includeStart = true, includeStop = true) {
    const list = []

    if (start && stop) {
        if (includeStart) list.push(start)

        for (let i = start + step; i < stop; i += step) {
            list.push(i)
        }

        if (includeStop) list.push(stop)
    }

    return list
}

export function between(start, stop, step = 1) {
    return range(start, stop, step, false, false)
}

export function deepMerge(current, updates) {
    for (key of Object.keys(updates)) {
        if (!Object.prototype.hasOwnProperty.call(current, key) || typeof updates[key] !== 'object')
            current[key] = updates[key]
        else deepMerge(current[key], updates[key])
    }
    return current
}

export function kebabize(str, delim = '-') {
    return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? delim : '') + $.toLowerCase())
}
