import { domainFragment, logFragment } from './Fragment'

export const domainFilter = gql`
    query {
        domains {
            id
            domain
            logs {
                ...log
            }
        }
    }
    ${logFragment}
`

export const domainsPaginate = gql`
    query ($search: String, $first: Int!, $page: Int, $trashed: Trashed) {
        domainsPaginate(search: $search, first: $first, page: $page, trashed: $trashed) {
            data {
                ...domain
                logs {
                    ...log
                }
            }

            paginatorInfo {
                total
            }
        }
    }
    ${domainFragment}
    ${logFragment}
`

export const upsertDomain = gql`
    mutation ($input: DomainInput!) {
        upsertDomain(input: $input) {
            ...domain
            logs {
                ...log
            }
        }
    }
    ${domainFragment}
    ${logFragment}
`

export const deleteDomain = gql`
    mutation ($id: ID!) {
        deleteDomain(id: $id) {
            id
        }
    }
`
