import { labelFragment, logFragment } from './Fragment'

export const labels = gql`
    query {
        labels {
            id
            name
            alias
            logs {
                ...log
            }
        }
    }
    ${logFragment}
`

export const labelsPaginate = gql`
    query ($search: String, $first: Int!, $page: Int, $trashed: Trashed) {
        labelsPaginate(search: $search, first: $first, page: $page, trashed: $trashed) {
            data {
                ...label
                logs {
                    ...log
                }
            }
            paginatorInfo {
                total
            }
        }
    }
    ${labelFragment}
    ${logFragment}
`

// Mutations
export const upsertLabel = gql`
    mutation ($input: LabelInput!) {
        upsertLabel(input: $input) {
            ...label
            logs {
                ...log
            }
        }
    }
    ${labelFragment}
    ${logFragment}
`

export const deleteLabel = gql`
    mutation ($id: ID!) {
        deleteLabel(id: $id) {
            id
        }
    }
`
