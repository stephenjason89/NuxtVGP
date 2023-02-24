// Queries
export const adjustmentFilter = gql`
    query ($whereProductCondition: QueryInventoryAdjustmentsWhereWhereConditions! = {}) {
        inventoryAdjustments(where: { AND: [$whereProductCondition, { column: STATUS, value: 0 }] }) {
            id
            product_id
            name
        }
    }
`
// Mutation

export const UpsertAdjustmentInventory = gql`
    mutation ($input: InventoryAdjustmentInput!) {
        UpsertAdjustmentInventory(input: $input) {
            id
        }
    }
`
