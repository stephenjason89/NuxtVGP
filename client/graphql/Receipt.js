export const receiptsPaginate = gql`
    query ($searchFallback: Mixed, $page: Int!, $first: Int!, $trashed: Trashed) {
        receiptsPaginate(
            trashed: $trashed
            page: $page
            first: $first
            where: { AND: [{ column: NUMBER, operator: LIKE, value: $searchFallback }] }
        ) {
            data {
                id
                receipt_book {
                    id
                    type
                    description
                }
                number
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

export const restoreReceipt = gql`
    mutation ($id: ID!) {
        restoreReceipt(id: $id) {
            id
        }
    }
`

export const dropReceipt = gql`
    mutation ($id: ID!) {
        dropReceipt(id: $id) {
            id
        }
    }
`
