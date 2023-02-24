import { logFragment, categoryFragment } from './Fragment'

// Queries

export const categoryFilter = gql`
    query (
        $search: String
        $scope: Mixed
        $hasCharacteristics: QueryCategoriesHasCharacteristicsWhereHasConditions = null
    ) {
        categories(
            search: $search
            where: { column: SCOPE, value: $scope }
            hasCharacteristics: $hasCharacteristics
        ) {
            ...category
        }
    }
    ${categoryFragment}
`

export const categoriesPaginate = gql`
    query (
        $searchFallback: Mixed! = "%%"
        $page: Int!
        $first: Int!
        $scope: Mixed
        $orderBy: [QueryCategoriesPaginateOrderByOrderByClause!]
        $trashed: Trashed
    ) {
        categoriesPaginate(
            where: {
                AND: [
                    { column: SCOPE, value: $scope }
                    { column: NAME, operator: LIKE, value: $searchFallback }
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
                parent {
                    id
                    name
                }
                logs {
                    ...log
                }
                created_at
                deleted_at
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
    ${logFragment}
`

// Mutations

export const upsertCategory = gql`
    mutation ($input: CategoryInput!) {
        upsertCategory(input: $input) {
            ...category
            parent {
                id
                name
            }
            logs {
                ...log
            }
            created_at
        }
    }
    ${logFragment}
    ${categoryFragment}
`

export const deleteCategory = gql`
    mutation ($id: ID!) {
        deleteCategory(id: $id) {
            id
        }
    }
`

export const dropCategory = gql`
    mutation ($id: ID!) {
        dropCategory(id: $id) {
            id
            name
        }
    }
`

export const restoreCategory = gql`
    mutation ($id: ID!) {
        restoreCategory(id: $id) {
            id
        }
    }
`
