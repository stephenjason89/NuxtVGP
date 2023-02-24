// Queries

export const getBranches = gql`
    query ($id: ID) {
        branches: company(id: $id) {
            data: branches {
                id
                name
            }
        }
    }
`

export const inventories = gql`
    query ($searchFallback: Mixed, $id: Mixed, $page: Int!, $first: Int!, $auditId: Mixed = 0) {
        inventories(
            page: $page
            first: $first
            where: {
                HAS: {
                    relation: "product"
                    condition: { column: ITEM_CODE, operator: LIKE, value: $searchFallback }
                }
                AND: [{ column: RACK_ID, value: $id }, { column: ISSUE_TYPE, operator: IS_NULL }]
            }
        ) {
            data {
                id
                product {
                    id
                    item_code
                    barcode
                    description
                    inventory_audit_detail(audit_id: $auditId) {
                        id
                        witness1 {
                            id
                            name
                        }
                        witness2 {
                            id
                            name
                        }
                        remarks
                    }
                    inventories(where: { column: ISSUE_TYPE, operator: IS_NOT_NULL }) {
                        id
                        issue_type
                        qty
                    }
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

export const getWitness = gql`
    query ($id: ID!) {
        company(id: $id) {
            users {
                id
                last_name
                first_name
                middle_name
            }
        }
    }
`

export const inventoryAuditsPaginate = gql`
    query (
        $searchFallback: Mixed
        $page: Int!
        $first: Int!
        $RackCondition: QueryInventoryAuditsPaginateWhereWhereConditions
        $BranchCondition: QueryInventoryAuditsPaginateWhereWhereConditions
        $StatusConditionField: QueryInventoryAuditsPaginateWhereWhereConditions! = {}
        $trashed: Trashed
    ) {
        inventoryAuditsPaginate(
            trashed: $trashed
            page: $page
            first: $first
            where: {
                AND: [
                    $StatusConditionField
                    { HAS: { relation: "rack.branch", condition: $BranchCondition } }
                    { HAS: { relation: "rack", condition: $RackCondition } }
                    {
                        HAS: {
                            relation: "details.product"
                            condition: { column: ITEM_CODE, operator: LIKE, value: $searchFallback }
                        }
                    }
                ]
            }
        ) {
            data {
                id
                user {
                    id
                    name
                }
                branch {
                    id
                    name
                }
                rack {
                    id
                    name
                }
                status
                percent
                created_at
                deleted_at
                details(
                    where: {
                        HAS: {
                            relation: "product"
                            condition: { column: ITEM_CODE, operator: LIKE, value: $searchFallback }
                        }
                    }
                ) {
                    id
                    from_qty
                    to_qty
                    product {
                        id
                        item_code
                        description
                    }
                    witness1 {
                        id
                        name
                    }
                    witness2 {
                        id
                        name
                    }
                    remarks
                }
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
`

export const inventoryAuditInvestigations = gql`
    query (
        $searchFallback: Mixed
        $page: Int!
        $first: Int!
        $RackCondition: QueryInventoryAuditsPaginateWhereWhereConditions
        $BranchCondition: QueryInventoryAuditsPaginateWhereWhereConditions
        $Issue_typeConditionField: QueryInventoryAuditsPaginateWhereWhereConditions! = {}
        $Issue_typeConditionFieldExtra: InventoryAuditIssuesWhereWhereConditions! = {}
    ) {
        inventoryAuditsPaginate(
            page: $page
            first: $first
            where: {
                AND: [
                    { column: ISSUE_STATUS, value: 1 }
                    { HAS: { relation: "issues", condition: $Issue_typeConditionField } }
                    { HAS: { relation: "rack.branch", condition: $BranchCondition } }
                    { HAS: { relation: "rack", condition: $RackCondition } }
                    {
                        HAS: {
                            relation: "issues.product"
                            condition: { column: ITEM_CODE, operator: LIKE, value: $searchFallback }
                        }
                    }
                ]
            }
        ) {
            data {
                id
                user {
                    id
                    name
                }
                branch {
                    id
                    name
                }
                rack {
                    id
                    name
                }
                status
                percent
                created_at
                issues(
                    where: {
                        AND: [
                            $Issue_typeConditionFieldExtra
                            {
                                HAS: {
                                    relation: "product"
                                    condition: { column: ITEM_CODE, operator: LIKE, value: $searchFallback }
                                }
                            }
                        ]
                    }
                ) {
                    id
                    product {
                        id
                        item_code
                        description
                    }
                    issue_type
                    qty
                    created_at
                }
                inventory_adjustments(where: { column: STATUS, operator: IS_NULL }) {
                    id
                    status
                }
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
`

// Mutations

export const upsertInventoryAudit = gql`
    mutation ($input: InventoryAuditInput!) {
        upsertInventoryAudit(input: $input) {
            id
            percent
            status
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
            inventory_adjustments {
                id
                status
            }
            issues {
                id
            }
        }
    }
`

export const amendAuditInventory = gql`
    mutation ($input: InventoryAuditDetailInput!, $rackId: Mixed, $auditId: Mixed) {
        createInventoryAuditDetail(input: $input) {
            id
            witness1 {
                name
            }
            witness2 {
                name
            }
            remarks
            inventory_audit {
                id
                percent
            }
            product {
                id
                inventories(where: { column: RACK_ID, value: $rackId }) {
                    id
                    qty
                    issue_type
                }
                inventory_audit_detail(audit_id: $auditId) {
                    id
                    witness1 {
                        id
                        name
                    }
                    witness2 {
                        id
                        name
                    }
                    remarks
                }
            }
        }
    }
`

export const restoreInventoryAudit = gql`
    mutation ($id: ID!) {
        restoreInventoryAudit(id: $id) {
            id
            name
        }
    }
`

export const dropInventoryAudit = gql`
    mutation ($id: ID!) {
        dropInventoryAudit(id: $id) {
            id
        }
    }
`
