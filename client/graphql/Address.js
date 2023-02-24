export const addressPaginate = gql`
    query ($searchFallback: Mixed, $page: Int!, $first: Int!, $trashed: Trashed) {
        addressesPaginate(
            trashed: $trashed
            page: $page
            first: $first
            where: {
                OR: [
                    { column: COMPLETE_ADDRESS, operator: LIKE, value: $searchFallback }
                    { column: REGION, operator: LIKE, value: $searchFallback }
                    { column: NAME, operator: LIKE, value: $searchFallback }
                ]
            }
        ) {
            data {
                id
                name
                complete_address
                region
                country
                deleted_at
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
`

export const restoreAddress = gql`
    mutation ($id: ID!) {
        restoreAddress(id: $id) {
            id
            name
        }
    }
`

export const dropAddress = gql`
    mutation ($id: ID!) {
        dropAddress(id: $id) {
            id
        }
    }
`
