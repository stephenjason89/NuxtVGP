export const inventoryOrderPointsPaginate = gql`
    query (
        $BranchConditionFK: QueryInventoryOrderPointsPaginateWhereWhereConditions! = {}
        $first: Int!
        $page: Int
        $searchFallback: Mixed
        $trashed: Trashed
    ) {
        inventoryOrderPointsPaginate(
            where: {
                AND: [$BranchConditionFK]
                HAS: {
                    relation: "product"
                    condition: { column: ITEM_CODE, operator: LIKE, value: $searchFallback }
                }
            }
            first: $first
            page: $page
            trashed: $trashed
        ) {
            data {
                id
                product {
                    id
                    item_code
                }
                branch {
                    id
                    name
                }
                order_to {
                    id
                    name
                }
                inventory_order_point_details {
                    id
                    reorder_point
                    order_qty
                    month
                    monthLabel
                }
                created_at
                updated_at
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
`

export const UpsertInventoryOrderPoint = gql`
    mutation ($input: InventoryOrderPointInput) {
        UpsertInventoryOrderPoint(input: $input) {
            id
            product {
                id
                item_code
            }
            branch {
                id
                name
            }
            order_to {
                id
                name
            }
            inventory_order_point_details {
                id
                reorder_point
                order_qty
                month
                monthLabel
            }
            created_at
            updated_at
            deleted_at
        }
    }
`

export const deleteInventoryOrderPoint = gql`
    mutation ($id: ID!) {
        deleteInventoryOrderPoint(id: $id) {
            id
        }
    }
`

export const restoreInventoryOrderPoint = gql`
    mutation ($id: ID!) {
        restoreInventoryOrderPoint(id: $id) {
            id
        }
    }
`

export const dropInventoryOrderPoint = gql`
    mutation ($id: ID!) {
        dropInventoryOrderPoint(id: $id) {
            id
        }
    }
`
