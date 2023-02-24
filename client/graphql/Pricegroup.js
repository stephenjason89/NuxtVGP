// Queries

export const priceGroupFilter = gql`
    query {
        priceGroups {
            id
            name
        }
    }
`

export const priceGroupsPaginate = gql`
    query (
        $first: Int!
        $page: Int
        $orderBy: [QueryPriceGroupsPaginateOrderByOrderByClause!]
        $searchFallback: Mixed! = "%%"
    ) {
        priceGroupsPaginate(
            first: $first
            page: $page
            orderBy: $orderBy
            where: {
                AND: [
                    { column: NAME, operator: LIKE, value: $searchFallback }
                    { HAS: { relation: "prices" } }
                ]
            }
        ) {
            data {
                id
                name
                created_at
            }
            paginatorInfo {
                total
            }
        }
    }
`

export const priceGroup = gql`
    query ($id: ID) {
        priceGroup(id: $id) {
            id
            name
            priceListGroup {
                product {
                    id
                    item_code
                }
                id
                amount
                created_at
            }
        }
    }
`

export const upsertPricegroup = gql`
    mutation ($input: PriceGroupInput!) {
        upsertPriceGroup(input: $input) {
            id
            name
            created_at
            priceListGroup {
                product {
                    id
                    item_code
                }
                id
                amount
                created_at
            }
        }
    }
`

export const deletePricegroup = gql`
    mutation ($id: ID!) {
        deletePriceGroup(id: $id) {
            id
        }
    }
`
