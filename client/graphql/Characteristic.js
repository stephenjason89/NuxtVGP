import { logFragment } from './Fragment'

export const productCharacteristicFilter = gql`
    query {
        characteristics {
            id
            name
        }
    }
`

export const characteristicsPaginate = gql`
    query (
        $searchFallback: Mixed! = "%%"
        $page: Int!
        $first: Int!
        $scope: Mixed
        $orderBy: [QueryCharacteristicsPaginateOrderByOrderByClause!]
        $CategoryCondition: QueryCharacteristicsPaginateWhereWhereConditions! = {}
        $trashed: Trashed
    ) {
        characteristicsPaginate(
            where: {
                AND: [
                    { column: SCOPE, value: $scope }
                    { column: NAME, operator: LIKE, value: $searchFallback }
                    { HAS: { relation: "categories", condition: $CategoryCondition } }
                ]
            }
            first: $first
            page: $page
            orderBy: $orderBy
            trashed: $trashed
        ) {
            data {
                id
                name
                created_at
                updated_at
                deleted_at
                category {
                    id
                    name
                }
                logs {
                    ...log
                }
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
    ${logFragment}
`

export const upsertCharacteristic = gql`
    mutation ($input: CharacteristicInput!) {
        upsertCharacteristic(input: $input) {
            id
            name
            updated_at
            created_at
            logs {
                ...log
            }
        }
    }
    ${logFragment}
`

export const deleteCharacteristic = gql`
    mutation ($id: ID!) {
        deleteCharacteristic(id: $id) {
            id
        }
    }
`

export const restoreCharacteristic = gql`
    mutation ($id: ID!) {
        restoreCharacteristic(id: $id) {
            id
        }
    }
`

export const dropCharacteristic = gql`
    mutation ($id: ID!) {
        dropCharacteristic(id: $id) {
            id
        }
    }
`
