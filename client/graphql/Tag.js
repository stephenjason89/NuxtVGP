export const tagsPaginate = gql`
    query ($searchFallback: Mixed, $page: Int!, $first: Int!, $trashed: Trashed) {
        tagsPaginate(
            trashed: $trashed
            page: $page
            first: $first
            where: {
                OR: [
                    { column: SCOPE, operator: LIKE, value: $searchFallback }
                    { column: NAME, operator: LIKE, value: $searchFallback }
                ]
            }
        ) {
            data {
                id
                name
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

export const restoreTag = gql`
    mutation ($id: ID!) {
        restoreTag(id: $id) {
            id
        }
    }
`

export const dropTag = gql`
    mutation ($id: ID!) {
        dropTag(id: $id) {
            id
        }
    }
`
