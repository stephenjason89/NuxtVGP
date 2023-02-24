import { userFragment, logFragment } from './Fragment'

// Queries
export const users = gql`
    query filterUsers($where: QueryUsersWhereWhereConditions) {
        users(where: $where) {
            id
            first_name
            nickname
            name
            roles {
                id
                name
            }
        }
    }
`

export const usersPaginate = gql`
    query (
        $searchFallback: Mixed
        $page: Int!
        $first: Int!
        $is_customer: Mixed = null
        $is_courier: Mixed = null
        $is_seller: Mixed = null
        $trashed: Trashed
    ) {
        usersPaginate(
            page: $page
            first: $first
            where: {
                AND: [
                    { column: IS_CUSTOMER, value: $is_customer }
                    { column: IS_COURIER, value: $is_courier }
                    { column: IS_SELLER, value: $is_seller }
                    {
                        OR: [
                            { column: FIRST_NAME, operator: LIKE, value: $searchFallback }
                            { column: MIDDLE_NAME, operator: LIKE, value: $searchFallback }
                            { column: LAST_NAME, operator: LIKE, value: $searchFallback }
                        ]
                    }
                ]
            }
            trashed: $trashed
        ) {
            data {
                ...user
                logs {
                    ...log
                }
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
    ${userFragment}
    ${logFragment}
`

export const findUser = gql`
    query ($id: ID) {
        user(id: $id) {
            ...user
        }
    }
    ${userFragment}
`

export const userPermission = gql`
    query ($id: ID) {
        user(id: $id) {
            ...user
        }
    }
    ${userFragment}
`

// Mutations

export const deleteUser = gql`
    mutation ($id: ID!) {
        deleteUser(id: $id) {
            id
        }
    }
`

export const restoreUser = gql`
    mutation ($id: ID!) {
        restoreUser(id: $id) {
            id
        }
    }
`

export const dropUser = gql`
    mutation ($id: ID!) {
        dropUser(id: $id) {
            id
        }
    }
`

export const upsertUser = gql`
    mutation ($input: UserInput) {
        upsertUser(input: $input) {
            ...user
            logs {
                ...log
            }
        }
    }
    ${userFragment}
    ${logFragment}
`

export const userFilter = gql`
    query ($isCustomer: Mixed = null, $isCourier: Mixed = null, $isSeller: Mixed = null) {
        users(
            where: {
                AND: [
                    { column: IS_CUSTOMER, value: $isCustomer }
                    { column: IS_COURIER, value: $isCourier }
                    { column: IS_SELLER, value: $isSeller }
                ]
            }
        ) {
            id
            name
        }
    }
`
export const userCompanyBranches = gql`
    query ($id: ID) {
        user(id: $id) {
            companies {
                id
                name
                branches {
                    id
                    name
                }
            }
        }
    }
`

export const usersFilter = gql`
    query ($search: String, $page: Int!, $first: Int!) {
        usersPaginate(page: $page, first: $first, search: $search) {
            data {
                ...user
                logs {
                    ...log
                }
            }
            paginatorInfo {
                lastPage
                total
                hasMorePages
                currentPage
            }
        }
    }
    ${userFragment}
    ${logFragment}
`

export const usersRelay = gql`
    query usersRelay(
        $first: Int!
        $after: String
        $search: String
        $UserCondition: QueryUsersRelayWhereWhereConditions
    ) {
        usersRelay(first: $first, after: $after, search: $search, where: $UserCondition) {
            edges {
                node {
                    id
                    name
                    first_name
                    last_name
                    roles {
                        id
                        name
                    }
                }
            }

            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`
