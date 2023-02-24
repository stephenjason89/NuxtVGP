export type Chart = {
    description?: string
    active?: boolean
    gsW?: number
    gsH?: number
    gsMinW?: number
    gsMinH?: number
    height?: number
    title: string
    query: { model: string; method: string }
    data?: any
    type?: string
    options?: any
    labels?: any
    minimal?: boolean
    pagination?: boolean
    variables?: any
    filters?: any
}

export type Charts = {
    title: string
    charts: Chart[]
}

export default (): { [name: string]: Chart } => ({
    salesPerformance: {
        title: 'Sales Performance',
        query: { model: 'Order', method: 'ordersTotal' },
        options: {
            fill: {
                opacity: 0.2,
            },
        },
    },
    inventory: {
        title: 'Inventory Stock Value',
        query: { model: 'Inventory', method: 'inventoriesTotal' },
        variables: { groupBy: 'BRANCH' },
        data: { multiple: false, x: 'BRANCH', y: 'total' },
        pagination: true,
        type: 'bar',
        labels: { data: false },
        filters: {
            groupBy: {
                type: 'select',
                attrs: {
                    label: 'Group Type',
                    items: [
                        { text: 'Branch', value: 'BRANCH' },
                        { text: 'Item', value: 'ITEM' },
                    ],
                },
            },
            effective_at: {
                type: 'textField',
                attrs: {
                    label: 'Price Effectivity*',
                    type: 'date',
                    initialValue: new Date().toISOString().substring(0, 10),
                },
            },
        },
        gsMinW: 4,
        gsMinH: 2,
    },
    products: {
        title: 'Products',
        type: 'line',
        query: { model: 'Order', method: 'ordersTotal' },
        description: 'Chart for Products',
    },
    branch: {
        title: 'Branch',
        type: 'line',
        query: { model: 'Order', method: 'ordersTotal' },
        description: 'Chart for Branch',
    },
    procurement: {
        title: 'Procurement',
        type: 'line',
        query: { model: 'Order', method: 'ordersTotal' },
        description: 'Chart for Procurement',
    },
    client: {
        title: 'Client',
        type: 'line',
        query: { model: 'Order', method: 'ordersTotal' },
        description: 'Chart for Client',
    },
    quota: {
        title: 'Quota',
        type: 'line',
        query: { model: 'Order', method: 'ordersTotal' },
        height: 100,
        minimal: true,
    },
})
