import { tenantFragment } from './Fragment'

export const tenantFilter = gql`
    query {
        tenants {
            ...tenant
        }
    }
    ${tenantFragment}
`

export const tenantsPaginate = gql`
    query ($search: String, $first: Int!, $page: Int, $trashed: Trashed) {
        tenantsPaginate(search: $search, first: $first, page: $page, trashed: $trashed) {
            data {
                ...tenant
            }

            paginatorInfo {
                total
            }
        }
    }
    ${tenantFragment}
`

export const UpsertTenant = gql`
    mutation ($input: TenantInput!) {
        UpsertTenant(input: $input) {
            ...tenant
        }
    }
    ${tenantFragment}
`

export const deleteTenant = gql`
    mutation ($id: ID!) {
        deleteTenant(id: $id) {
            id
        }
    }
`
