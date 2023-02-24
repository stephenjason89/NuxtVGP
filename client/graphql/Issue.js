// Queries

export const issuesPaginate = gql`
    query ($page: Int!, $first: Int!) {
        inventories(
            page: $page
            first: $first
            where: {
                AND: [{ column: ISSUE_TYPE, operator: IS_NOT_NULL }, { column: QTY, operator: GT, value: 0 }]
            }
        ) {
            data {
                id
                branch {
                    id
                    name
                }
                issue_type
                product {
                    id
                    barcode
                    item_code
                }
                rack {
                    id
                    name
                }
                qty
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
`

// Mutations

export const transferRack = gql`
    mutation ($input: TransferRackInput) {
        transferRack(input: $input) {
            new {
                id
                issue_type
                rack {
                    id
                    name
                }
                qty
            }
            update {
                id
                issue_type
                rack {
                    id
                    name
                }
                qty
            }
            old {
                id
                issue_type
                rack {
                    id
                    name
                }
                qty
            }
        }
    }
`
