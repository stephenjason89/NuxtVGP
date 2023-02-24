import { rackFragment } from './Fragment'

export const rackFilter = gql`
    query ($filterCondition: QueryRacksWhereWhereConditions! = {}) {
        racks(where: { HAS: { relation: "branch" }, AND: [$filterCondition] }) {
            id
            name
            branch {
                id
                name
            }
            branch_id
        }
    }
`

// Queries
export const racksPaginate = gql`
    query (
        $BranchConditionFK: QueryRacksPaginateWhereWhereConditions! = {}
        $GroupConditionFK: QueryRacksPaginateWhereWhereConditions! = {}
        $searchFallback: Mixed! = "%%"
        $page: Int!
        $first: Int!
        $orderBy: [QueryRacksPaginateOrderByOrderByClause!]
        $trashed: Trashed
    ) {
        racksPaginate(
            where: {
                AND: [
                    $BranchConditionFK
                    $GroupConditionFK
                    { column: NAME, operator: LIKE, value: $searchFallback }
                ]
            }
            first: $first
            page: $page
            orderBy: $orderBy
            trashed: $trashed
        ) {
            data {
                ...rack
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
    ${rackFragment}
`

export const racksAuditPaginate = gql`
    query (
        $BranchConditionFK: QueryRacksPaginateWhereWhereConditions! = {}
        $CategoryConditionHasMany: QueryRacksPaginateWhereWhereConditions! = {}
        $searchFallback: Mixed! = "%%"
        $page: Int!
        $first: Int!
        $orderBy: [QueryRacksPaginateOrderByOrderByClause!]
    ) {
        racks: racksPaginate(
            where: {
                AND: [
                    $BranchConditionFK
                    $CategoryConditionHasMany
                    { column: NAME, operator: LIKE, value: $searchFallback }
                ]
            }
            first: $first
            page: $page
            orderBy: $orderBy
        ) {
            data {
                ...rack
                inventory_audit {
                    id
                    status
                    percent
                    updated_at
                    details {
                        product {
                            id
                            item_code
                            description
                        }
                        to_qty
                        from_qty
                    }
                }
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
    ${rackFragment}
`

export const getGroupRackFilter = gql`
    query {
        categories(where: { column: SCOPE, value: "Rack" }) {
            id
            name
            created_at
        }
    }
`

// Mutations

export const createGroupRack = gql`
    mutation ($name: String!) {
        createCategory(input: { name: $name, scope: "Rack" }) {
            id
            name
            created_at
        }
    }
`

export const updateGroupRack = gql`
    mutation ($id: ID, $name: String!) {
        updateCategory(input: { id: $id, name: $name }) {
            id
            name
        }
    }
`

export const createRack = gql`
    mutation ($input: RackInput!) {
        createRack(input: $input) {
            ...rack
        }
    }
    ${rackFragment}
`

export const updateRack = gql`
    mutation ($input: RackInput!) {
        updateRack(input: $input) {
            ...rack
        }
    }
    ${rackFragment}
`

export const restoreRack = gql`
    mutation ($input: RackInput!) {
        restoreRack(input: $input) {
            ...rack
        }
    }
    ${rackFragment}
`

export const dropRack = gql`
    mutation ($input: RackInput!) {
        dropRack(input: $input) {
            ...rack
        }
    }
    ${rackFragment}
`
