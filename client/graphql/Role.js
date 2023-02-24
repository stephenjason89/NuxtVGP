import { roleFragment } from './Fragment'

// Queries
export const rolesFilter = gql`
    query {
        roles {
            id
            name
        }
    }
`
export const rolesPaginate = gql`
    query ($searchFallback: Mixed, $page: Int!, $first: Int!, $trashed: Trashed) {
        rolesPaginate(
            trashed: $trashed
            page: $page
            first: $first
            where: {
                OR: [
                    { column: DESCRIPTION, operator: LIKE, value: $searchFallback }
                    { column: NAME, operator: LIKE, value: $searchFallback }
                ]
            }
        ) {
            data {
                id
                name
                description
                created_at
                deleted_at
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
`

export const findRole = gql`
    query ($id: ID) {
        role(id: $id) {
            ...role
        }
    }
    ${roleFragment}
`

// Mutations

export const upsertRole = gql`
    mutation ($input: RoleInput) {
        upsertRole(input: $input) {
            ...role
        }
    }
    ${roleFragment}
`

export const deleteRole = gql`
    mutation ($id: ID!) {
        deleteRole(id: $id) {
            ...role
        }
    }
    ${roleFragment}
`

export const restoreRole = gql`
    mutation ($id: ID!) {
        restoreRole(id: $id) {
            ...role
        }
    }
    ${roleFragment}
`

export const dropRole = gql`
    mutation ($id: ID!) {
        dropRole(id: $id) {
            ...role
        }
    }
    ${roleFragment}
`
