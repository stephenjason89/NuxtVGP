import { permissionFragment } from '~/graphql/Fragment'

// Queries
export const permissions = gql`
    query ($whereCondition: QueryPermissionsWhereWhereConditions, $trashed: Trashed = WITH) {
        permissions(trashed: $trashed, where: $whereCondition) {
            ...permissions
        }
    }
    ${permissionFragment}
`

export const permissionsPaginate = gql`
    query ($searchFallback: Mixed, $page: Int!, $first: Int!) {
        permissionsPaginate(
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
                ...permissions
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
    ${permissionFragment}
`

// Mutations

export const upsertPermission = gql`
    mutation ($input: PermissionInput) {
        upsertPermission(input: $input) {
            ...permissions
        }
    }
    ${permissionFragment}
`

export const restorePermission = gql`
    mutation ($id: ID!) {
        restorePermission(id: $id) {
            ...permissions
        }
    }
    ${permissionFragment}
`

export const deletePermission = gql`
    mutation ($id: ID!) {
        deletePermission(id: $id) {
            ...permissions
        }
    }
    ${permissionFragment}
`
