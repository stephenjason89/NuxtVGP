export const unitFilter = gql`
    query {
        units {
            id
            name
        }
    }
`

export const unitsPaginate = gql`
    query (
        $searchFallback: Mixed! = "%%"
        $page: Int!
        $first: Int!
        $scope: Mixed
        $orderBy: [QueryUnitsPaginateOrderByOrderByClause!]
        $trashed: Trashed
    ) {
        unitsPaginate(
            where: {
                AND: [
                    { column: SCOPE, value: $scope }
                    {
                        OR: [
                            { column: NAME, operator: LIKE, value: $searchFallback }
                            { column: DESCRIPTION, operator: LIKE, value: $searchFallback }
                        ]
                    }
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

export const upsertUnit = gql`
    mutation ($input: UnitInput!) {
        upsertUnit(input: $input) {
            id
            name
            description
            created_at
        }
    }
`

export const deleteUnit = gql`
    mutation ($id: ID!) {
        deleteUnit(id: $id) {
            id
        }
    }
`

export const dropUnit = gql`
    mutation ($id: ID!) {
        dropUnit(id: $id) {
            id
        }
    }
`

export const restoreUnit = gql`
    mutation ($id: ID!) {
        restoreUnit(id: $id) {
            id
        }
    }
`
