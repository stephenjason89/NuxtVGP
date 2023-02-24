import { productFragment } from './Fragment'

// Queries

export const productFilter = gql`
    query ($search: String) {
        products(search: $search) {
            id
            item_code
        }
    }
`

export const bundleFilter = gql`
    query {
        products(where: { column: PACKAGE_TYPE, value: 1 }) {
            id
            item_code
        }
    }
`

export const products = gql`
    query {
        products {
            ...product
        }
    }
    ${productFragment}
`

export const productsPaginate = gql`
    query (
        $search: String
        $RackCondition: QueryProductsPaginateWhereWhereConditions
        $BranchCondition: QueryProductsPaginateWhereWhereConditions
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
            }
            paginatorInfo {
                total
            }
        }
    }
    ${productFragment}
`

export const productPriceListPaginate = gql`
    query (
        $first: Int!
        $page: Int
        $orderBy: [QueryProductsPaginateOrderByOrderByClause!]
        $searchFallback: Mixed! = "%%"
    ) {
        productsPaginate(
            first: $first
            page: $page
            orderBy: $orderBy
            where: { AND: [{ column: ITEM_CODE, operator: LIKE, value: $searchFallback }] }
        ) {
            data {
                id
                item_code
                price {
                    amount
                    effective_at
                    created_at
                }
                priceListGroup {
                    id
                    amount
                    created_at
                    price_group {
                        id
                        name
                        branch {
                            id
                            name
                        }
                    }
                }
            }
            paginatorInfo {
                total
            }
        }
    }
`

export const productBundleList = gql`
    query (
        $first: Int!
        $page: Int
        $orderBy: [QueryProductsPaginateOrderByOrderByClause!]
        $searchFallback: Mixed! = "%%"
    ) {
        productsPaginate(
            first: $first
            page: $page
            orderBy: $orderBy
            where: {
                AND: [
                    { column: ITEM_CODE, operator: LIKE, value: $searchFallback }
                    { column: PACKAGE_TYPE, value: 1 }
                ]
            }
        ) {
            data {
                id
                item_code
                description
                components {
                    id
                    component {
                        id
                        item_code
                        description
                    }
                    qty
                }
            }
            paginatorInfo {
                total
            }
        }
    }
`

export const product = gql`
    query ($productID: ID) {
        product(id: $productID) {
            ...product
            reviews {
                rate
                title
                comment
                user {
                    first_name
                    last_name
                }
            }
            uploads {
                id
                name
                filename
                url
            }
            coverPhoto {
                id
                name
                filename
            }
            created_at
        }
    }
    ${productFragment}
`

export const productPriceGroupHistory = gql`
    query ($productID: ID, $priceGroupID: Mixed) {
        product(id: $productID) {
            id
            prices(
                where: { HAS: { relation: "price_group", condition: { column: ID, value: $priceGroupID } } }
            ) {
                id
                amount
                effective_at
                created_at
            }
        }
    }
`

export const pendingProduct = gql`
    query ($id: ID, $branch: Mixed) {
        product(id: $id) {
            id
            pending(branch: $branch) {
                stocks
                order
                bundle
                service
                assembly
                remaining
            }
        }
    }
`

// Mutations
export const upsertProduct = gql`
    mutation ($input: ProductInput) {
        upsertProduct(input: $input) {
            ...product
        }
    }
    ${productFragment}
`

export const deleteProduct = gql`
    mutation ($id: ID!) {
        deleteProduct(id: $id) {
            id
        }
    }
`

export const restoreProduct = gql`
    mutation ($id: ID!) {
        restoreProduct(id: $id) {
            id
        }
    }
`
