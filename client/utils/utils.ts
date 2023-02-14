export function getSubdomain(url: string | undefined) {
    return (url?.match(/localhost/g)?.length && url?.match(/\./g)?.length === 1) ||
        url?.match(/\./g)?.length === 2
        ? url?.split('.')[0]
        : ''
}
