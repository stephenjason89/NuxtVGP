// Queries
export const terminalsPaginate = gql`
    query ($searchFallback: Mixed, $page: Int!, $first: Int!, $trashed: Trashed) {
        terminalsPaginate(
            trashed: $trashed
            page: $page
            first: $first
            where: { AND: [{ column: NAME, operator: LIKE, value: $searchFallback }] }
        ) {
            data {
                id
                name
                is_assigned
                branch {
                    id
                    name
                }
                created_at
                deleted_at
                receipt_books {
                    id
                    type
                    description
                    start
                    current
                    end
                    limit
                    active
                    created_at
                }
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
`

export const terminal = gql`
    query ($id: ID) {
        terminal(id: $id) {
            id
            receipt_books {
                id
                type
                description
                start
                current
                end
                limit
                active
                created_at
            }
        }
    }
`

// Mutations

export const upsertTerminal = gql`
    mutation ($input: TerminalInput!) {
        upsertTerminal(input: $input) {
            id
            name
            is_assigned
            branch {
                id
                name
            }
            receipt_books {
                id
                type
                description
                start
                current
                end
                limit
                active
                created_at
            }
            created_at
        }
    }
`

export const deleteTerminal = gql`
    mutation ($id: ID!) {
        deleteTerminal(id: $id) {
            id
            name
            is_assigned
            branch {
                id
                name
            }
            created_at
        }
    }
`

export const restoreTerminal = gql`
    mutation ($id: ID!) {
        restoreTerminal(id: $id) {
            id
            name
            is_assigned
            branch {
                id
                name
            }
            created_at
        }
    }
`

export const dropTerminal = gql`
    mutation ($id: ID!) {
        dropTerminal(id: $id) {
            id
            name
            is_assigned
            branch {
                id
                name
            }
            created_at
        }
    }
`
