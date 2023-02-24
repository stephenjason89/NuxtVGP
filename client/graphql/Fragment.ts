export const uploadFragment = gql`
    fragment upload on Upload {
        id
        name
        filename
        url
        created_at
        updated_at
    }
`

export const logFragment = gql`
    fragment log on Log {
        id
        user {
            name
        }
        event
        new_values
        old_values
        ip_address
        created_at
    }
`

export const productFragment = gql`
    fragment product on Product {
        id
        barcode
        item_code
        description
        deleted_at
        categories {
            id
            name
        }
        characteristics {
            id
            name
        }
        prices(
            where: {
                AND: [{ column: PRICE_GROUP_ID, operator: IS_NULL }, { column: USER_ID, operator: IS_NULL }]
            }
        ) {
            id
            amount
            effective_at
        }
        price {
            amount
            effective_at
            created_at
        }
        units {
            id
            name
        }
        components {
            id
            component {
                id
                item_code
                description
            }
            qty
        }
        initial_product_cost
        warranty
        for_assembly
        for_freebies
        has_serial
        package_type
    }
`

export const roleFragment = gql`
    fragment role on Role {
        id
        name
        description
        created_at
        deleted_at
        permissions {
            id
            name
            field
            model
            created_at
            updated_at
        }
    }
`

export const subUserFragment = gql`
    fragment subUser on User {
        id
        name
        birthday
        nickname
        gender
        first_name
        last_name
        middle_name
        email
        created_at
        updated_at
        deleted_at
        roles {
            id
            name
        }
        branches {
            id
            name
        }
        permissions {
            id
            name
        }
        addresses {
            id
            name
        }
        contact_details {
            id
            number
            type
            emergency_name
        }
        points
    }
`

export const referralFragment = gql`
    fragment referrals on User {
        ...subUser
        children: referrals {
            ...subUser
            referrer {
                ...subUser
            }
            children: referrals {
                ...subUser
                referrer {
                    ...subUser
                }
                children: referrals {
                    ...subUser
                    referrer {
                        ...subUser
                    }
                    children: referrals {
                        ...subUser
                        referrer {
                            ...subUser
                        }
                    }
                }
            }
        }
    }
    ${subUserFragment}
`

export const userFragment = gql`
    fragment user on User {
        ...subUser
        ...referrals
        referrer {
            ...subUser
            ...referrals
            referrer {
                ...subUser
                ...referrals
                referrer {
                    ...subUser
                    ...referrals
                    referrer {
                        ...subUser
                        ...referrals
                    }
                }
            }
        }
    }
    ${subUserFragment}
    ${referralFragment}
`

export const rackFragment = gql`
    fragment rack on Rack {
        id
        name
        description
        category {
            id
            name
        }
        branch {
            id
            name
        }
        created_at
        deleted_at
    }
`

export const categoryFragment = gql`
    fragment category on Category {
        id
        name
        characteristics {
            id
            name
        }
        permissions {
            id
            name
        }
    }
`

export const branchFragment = gql`
    fragment branch on Branch {
        id
        name
        price_group {
            id
            name
        }
        racks {
            id
            name
        }
        uploads {
            ...upload
        }
        created_at
        updated_at
        deleted_at
    }
    ${uploadFragment}
`

export const orderFragment = gql`
    fragment order on Order {
        id
        status
        from_status
        type
        total
        is_priority
        branch {
            id
            name
        }
        to_branch {
            id
            name
        }
        user {
            ...user
        }
        customer {
            ...user
        }
        courier {
            id
            name
        }
        order_details {
            id
            price_adjustment
            qty
            original_qty
            unit_qty
            preferred_unit
            hide_discount
            product {
                id
                barcode
                item_code
                description
            }
            price {
                id
                amount
                price_group {
                    id
                    name
                }
            }
        }
        notes {
            id
            details
        }
        created_at
        updated_at
        deleted_at
    }
    ${userFragment}
`

export const transferInventoryFragment = gql`
    fragment transferInventory on TransferInventory {
        id
        status
        from_status
        type
        branch_from {
            id
            name
            addresses {
                complete_address
            }
        }
        branch_to {
            id
            name
            addresses {
                complete_address
            }
        }
        user {
            id
            name
        }
        transfer_inventory_details {
            id
            qty
            product {
                id
                item_code
                inventories {
                    id
                    rack {
                        id
                        name
                    }
                    qty
                }
            }
            from_racks {
                id
                rack_from {
                    id
                    name
                }
                qty
            }
            to_racks {
                id
                rack_to {
                    id
                    name
                }
                qty
            }
        }
        schedules {
            id
            schedule
            notes {
                id
                details
            }
        }
    }
`
export const labelFragment = gql`
    fragment label on Label {
        id
        name
        alias
    }
`

export const domainFragment = gql`
    fragment domain on Domain {
        id
        domain
        tenant_id
        created_at
        updated_at
    }
`

export const tenantFragment = gql`
    fragment tenant on Tenant {
        id
        created_at
        updated_at
        tenancy_db_name
        domains {
            ...domain
        }
    }
    ${domainFragment}
`
export const messageFragment = gql`
    fragment message on Message {
        id
        user {
            id
            name
        }
        content
    }
`

export const messageRoomFragment = gql`
    fragment messageRoom on MessageRoom {
        id
        name
        peer
        type
        on_call
        created_at
        updated_at
        status {
            id
            last_seen_message
            message_room_id
            marked_as_read
            message_roomable_id
            message_roomable_type
            created_at
            updated_at
        }
    }
`

export const messageRoomMessagesFragment = gql`
    fragment messageRoomMessages on MessageRoom {
        messages(first: $first) {
            edges {
                node {
                    id
                    content
                    user {
                        id
                        name
                    }
                    created_at
                    updated_at
                }
            }

            pageInfo {
                endCursor
                startCursor
                hasNextPage
            }
        }
    }
`
export const printLayoutFragment = gql`
    fragment printLayouts on PrintLayout {
        id
        layout_name
        border
        description
        date
        data
        company_id
        created_at
    }
`
export const permissionFragment = gql`
    fragment permissions on Permission {
        id
        action
        field
        model
        description
        created_at
        updated_at
        deleted_at
    }
`
