export const companiesPaginate = gql`
    query ($searchFallback: Mixed, $page: Int!, $first: Int!, $trashed: Trashed) {
        companiesPaginate(
            trashed: $trashed
            page: $page
            first: $first
            where: { AND: [{ column: NAME, operator: LIKE, value: $searchFallback }] }
        ) {
            data {
                id
                name
                description
                created_at
                deleted_at
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
            }
            paginatorInfo {
                lastPage
                total
            }
        }
    }
`

export const companyFilter = gql`
    query {
        companies {
            id
            name
            description
            users {
                id
                name
            }
            branches {
                id
                name
            }
        }
    }
`

export const upsertCompany = gql`
    mutation ($input: CompanyInput!) {
        upsertCompany(input: $input) {
            id
            name
            description
            created_at
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
        }
    }
`

export const restoreCompany = gql`
    mutation ($id: ID!) {
        restoreCompany(id: $id) {
            id
        }
    }
`

export const dropCompany = gql`
    mutation ($id: ID!) {
        dropCompany(id: $id) {
            id
        }
    }
`
export const company = gql`
    query ($companyId: ID) {
        company(id: $companyId) {
            id
            name
            description
        }
    }
`
