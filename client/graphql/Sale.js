// Queries
export const salesPaginate = gql`
    query ($page: Int!, $first: Int!, $trashed: Trashed) {
        salesPaginate(page: $page, first: $first, trashed: $trashed) {
            data {
                id
                total
                created_at
                deleted_at
                orders {
                    id
                    customer {
                        id
                        name
                    }
                    receipts {
                        id
                        number
                        receipt_book {
                            id
                            type
                        }
                    }
                }
                order_details {
                    id
                    product {
                        id
                        item_code
                        description
                        price {
                            id
                            amount
                        }
                    }
                    price_adjustment
                    price {
                        id
                        amount
                    }
                }
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
`

export const restoreSale = gql`
    mutation ($input: SaleInput!) {
        restoreSale(input: $input) {
            id
        }
    }
`

export const dropSale = gql`
    mutation ($input: SaleInput!) {
        dropSale(input: $input) {
            id
        }
    }
`

// Mutations
export const upsertSale = gql`
    mutation ($input: SaleInput!) {
        upsertSale(input: $input) {
            id
            total
            created_at
            orders {
                id
                customer {
                    id
                    name
                }
                receipts {
                    id
                    number
                    receipt_book {
                        id
                        type
                    }
                }
            }
            order_details {
                id
                product {
                    id
                    item_code
                    description
                    price {
                        id
                        amount
                    }
                }
                price_adjustment
                price {
                    id
                    amount
                }
            }
        }
    }
`
