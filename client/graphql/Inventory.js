import { productFragment } from '~/graphql/Fragment'

export const inventories = gql`
    query ($condition: QueryInventoriesWhereWhereConditions) {
        inventories(where: $condition, first: 1) {
            data {
                id
                qty
            }
        }
    }
`

export const UpsertInventory = gql`
    mutation ($input: InventoryInput!) {
        UpsertInventory(input: $input) {
            id
            qty
            rack {
                id
                name
                branch {
                    id
                    name
                }
            }
            product {
                id
                totalQty
            }
        }
    }
`

export const upsertInventory = gql`
    mutation ($input: InventoryInput!) {
        upsertInventory(input: $input) {
            id
            qty
            rack {
                id
                name
                branch {
                    id
                    name
                }
            }
            product {
                id
                totalQty
            }
        }
    }
`

export const inventoriesPaginate = gql`
    query (
        $search: String
        $RackCondition: QueryProductsPaginateWhereWhereConditions
        $RackConditionExtra: ProductInventoriesWhereWhereConditions
        $BranchCondition: QueryProductsPaginateWhereWhereConditions
        $BranchConditionExtra: ProductInventoriesWhereWhereConditions
        $Rack: Mixed
        $Branch: Mixed
        $first: Int!
        $page: Int
        $orderBy: [QueryProductsPaginateOrderByOrderByClause!]
        $trashed: Trashed
    ) {
        productsPaginate(
            search: $search
            first: $first
            page: $page
            where: {
                AND: [
                    { HAS: { relation: "inventories.rack.branch", condition: $BranchCondition } }
                    { HAS: { relation: "inventories.rack", condition: $RackCondition } }
                ]
            }
            orderBy: $orderBy
            trashed: $trashed
        ) {
            data {
                ...product
                totalQty(rack: $Rack, branch: $Branch)
                inventories(
                    where: {
                        AND: [
                            { HAS: { relation: "branch", condition: $BranchConditionExtra } }
                            { HAS: { relation: "rack", condition: $RackConditionExtra } }
                        ]
                    }
                ) {
                    id
                    rack {
                        id
                        name
                        branch {
                            id
                            name
                        }
                    }
                    qty
                }
            }
            paginatorInfo {
                total
            }
        }
    }
    ${productFragment}
`

export const getInventories = gql`
    query ($page: Int!, $first: Int!) {
        inventories(page: $page, first: $first) {
            data {
                id
                rack {
                    id
                    name
                    branch {
                        id
                        name
                    }
                }
                product {
                    id
                    barcode
                    description
                    item_code
                }
                qty
                created_at
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
`

export const inventoriesTotal = gql`
    query dashboardInventoryStockValue(
        $filters: InventoryStockValueInput
        $groupBy: InventoryStockValueGroupBy
        $take: Int = null
        $skip: Int = null
        $page: Int = null
        $itemsPerPage: Int = null
        $groupByItem: Boolean! = false
        $groupByBranch: Boolean! = true
    ) {
        dashboardInventoryStockValue(
            filters: $filters
            groupBy: $groupBy
            take: $take
            skip: $skip
            page: $page
            itemsPerPage: $itemsPerPage
        ) {
            total
            BRANCH: branch @skip(if: $groupByItem)
            ITEM: item @skip(if: $groupByBranch)
        }
    }
`
