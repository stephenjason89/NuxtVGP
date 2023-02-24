import { orderFragment } from './Fragment'

// export const ordersPaginate = gql`
//     query (
//         $first: Int!
//         $page: Int
//         $status: Mixed
//         $returns: Mixed
//         $orderBy: [QueryOrdersPaginateOrderByOrderByClause!]
//     ) {
//         ordersPaginate(
//             first: $first
//             page: $page
//             where: { OR: [{ column: STATUS, value: $status }, { column: STATUS, value: $returns }] }
//             orderBy: $orderBy
//         ) {
//             data {
//                 ...order
//             }

//             paginatorInfo {
//                 lastPage
//                 total
//             }
//         }
//     }
//     ${orderFragment}
// `

export const ordersPaginate = gql`
    query (
        $first: Int!
        $page: Int
        $status: QueryOrdersPaginateWhereWhereConditions = {}
        $orderBy: [QueryOrdersPaginateOrderByOrderByClause!]
    ) {
        ordersPaginate(first: $first, page: $page, where: $status, orderBy: $orderBy) {
            data {
                ...order
            }

            paginatorInfo {
                lastPage
                total
            }
        }
    }
    ${orderFragment}
`

export const upsertOrder = gql`
    mutation ($input: OrderInput) {
        upsertOrder(input: $input) {
            ...order
        }
    }
    ${orderFragment}
`

export const UpsertUserProject = gql`
    mutation ($input: OrderInput) {
        UpsertUserProject(input: $input) {
            ...order
        }
    }
    ${orderFragment}
`

export const ordersTotal = gql`
    query monthlySalesChartData($filters: OrdersTotalInput) {
        orders(
            monthlyTotal: $filters
            orderBy: [{ column: YEAR, order: DESC }, { column: MONTH, order: ASC }]
        ) {
            total
            year
            month
            branch_name
        }
    }
`

export const dashboardOrderSales = gql`
    query dashboardOrderSales(
        $filters: OrderSalesInput
        $groupBy: [OrderSalesGroupBy!]
        $orderBy: [OrderSalesOrderBy!]
        $take: Int
    ) {
        dashboardOrderSales(filters: $filters, groupBy: $groupBy, orderBy: $orderBy, take: $take) {
            total
            date
            status
        }
    }
`
