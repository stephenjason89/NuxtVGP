export const accountTitlesPaginate = gql`
    query ($searchFallback: Mixed, $page: Int!, $first: Int!, $trashed: Trashed) {
        accountTitlesPaginate(
            trashed: $trashed
            page: $page
            first: $first
            where: {
                OR: [
                    { column: DESCRIPTION, operator: LIKE, value: $searchFallback }
                    { column: CODE, operator: LIKE, value: $searchFallback }
                    { column: NAME, operator: LIKE, value: $searchFallback }
                ]
            }
        ) {
            data {
                id
                company {
                    id
                    name
                }
                code
                name
                description
                status
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

export const restoreAccountTitle = gql`
    mutation ($id: ID!) {
        restoreAccountTitle(id: $id) {
            id
        }
    }
`

export const dropAccountTitle = gql`
    mutation ($id: ID!) {
        dropAccountTitle(id: $id) {
            id
        }
    }
`
