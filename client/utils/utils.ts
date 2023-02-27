export const isString = (value: any) => typeof value === 'string'
export const isNumber = (value: any) => typeof value === 'number'
export const isBoolean = (value: any) => typeof value === 'boolean'
export const isObject = (value: any) => typeof value === 'object' && !Array.isArray(value) && value !== null
export const isFunction = (value: any) => typeof value === 'function'

export const getSubdomain = (url: string | undefined) =>
    (url?.match(/localhost/g)?.length && url?.match(/\./g)?.length === 1) || url?.match(/\./g)?.length === 2
        ? url?.split('.')[0]
        : ''

export const parseAttrs = ($attrs: any, listeners = true) =>
    // fn returns listeners only or removes listeners from $attrs
    $attrs.entries().reduce((obj: { [x: string]: any }, [key, value]: any) => {
        if (listeners === /^on[^a-z]/.test(key)) obj[key] = value
        return obj
    }, {})

export const kebabize = (str: string, delim = '-') =>
    str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? delim : '') + $.toLowerCase())
