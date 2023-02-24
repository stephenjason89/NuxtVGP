import { logFragment, branchFragment } from './Fragment'

// Queries
export const branchFilter = gql`
    query {
        branches {
            id
            name
        }
    }
`

export const branchesPaginate = gql`
    query ($search: String, $first: Int!, $page: Int, $trashed: Trashed) {
        branchesPaginate(search: $search, first: $first, page: $page, trashed: $trashed) {
            data {
                ...branch
                logs {
                    ...log
                }
            }
            paginatorInfo {
                total
            }
        }
    }
    ${logFragment}
    ${branchFragment}
`

export const branchesInventoriesCriticalLevel = gql`
    query (
        $searchFallback: Mixed
        $page: Int!
        $first: Int!
        $criticalLevel: Boolean = true
        $BranchCondition: QueryBranchesPaginateWhereWhereConditions! = {}
    ) {
        branchesPaginate(page: $page, first: $first, where: $BranchCondition) {
            data {
                id
                name
                inventories(
                    criticalLevel: $criticalLevel
                    where: {
                        HAS: {
                            relation: "product"
                            condition: { column: ITEM_CODE, operator: LIKE, value: $searchFallback }
                        }
                    }
                ) {
                    id
                    branch_qty
                    product {
                        id
                        item_code
                        barcode
                    }
                    order_qty
                    reorder_point
                    order_to_branch
                    created_at
                }
                created_at
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
`

export const branchesInventories = gql`
    query {
        branches {
            id
            name
            racks {
                id
                name
            }
            inventories {
                id
                product_id
                product {
                    id
                    item_code
                }
                qty
                rack_id
            }
        }
    }
`

export const upsertBranch = gql`
    mutation ($input: BranchInput!) {
        upsertBranch(input: $input) {
            ...branch
            logs {
                ...log
            }
        }
    }
    ${logFragment}
    ${branchFragment}
`

export const deleteBranch = gql`
    mutation ($id: ID!) {
        deleteBranch(id: $id) {
            id
        }
    }
`

export const dropBranch = gql`
    mutation ($id: ID!) {
        dropBranch(id: $id) {
            id
            name
        }
    }
`

export const restoreBranch = gql`
    mutation ($id: ID!) {
        restoreBranch(id: $id) {
            id
        }
    }
`
