import { printLayoutFragment } from './Fragment'

export const printLayoutPaginate = gql`
    query ($trashed: Trashed, $first: Int!, $page: Int, $search: String) {
        printLayoutPaginate(first: $first, page: $page, trashed: $trashed, search: $search) {
            data {
                ...printLayouts
            }

            paginatorInfo {
                total
            }
        }
    }

    ${printLayoutFragment}
`

export const deletePrintLayout = gql`
    mutation ($id: ID!) {
        deletePrintLayout(id: $id) {
            id
        }
    }
`

export const printLayouts = gql`
    query {
        printLayouts {
            ...printLayouts
            company {
                id
                name
                description
            }
        }
    }

    ${printLayoutFragment}
`

export const upsertPrintLayout = gql`
    mutation ($input: PrintLayoutInput!) {
        upsertPrintLayouts(input: $input) {
            ...printLayouts
        }
    }

    ${printLayoutFragment}
`

export const printLayout = gql`
    query ($id: ID!) {
        printLayout(id: $id) {
            ...printLayouts
        }
    }
    ${printLayoutFragment}
`
