export const receiptBooksPaginate = gql`
    query ($searchFallback: Mixed, $page: Int!, $first: Int!, $trashed: Trashed) {
        receiptBooksPaginate(
            trashed: $trashed
            page: $page
            first: $first
            where: {
                AND: [
                    { column: TYPE, operator: LIKE, value: $searchFallback }
                    { column: DESCRIPTION, operator: LIKE, value: $searchFallback }
                ]
            }
        ) {
            data {
                id
                type
                description
                start
                current
                end
                limit
                active
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

export const restoreReceiptBook = gql`
    mutation ($id: ID!) {
        restoreReceiptBook(id: $id) {
            id
        }
    }
`

export const dropReceiptBook = gql`
    mutation ($id: ID!) {
        dropReceiptBook(id: $id) {
            id
        }
    }
`
