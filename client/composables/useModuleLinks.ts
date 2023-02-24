interface LinkItem {
    title: string
    icon: string
    color?: string
    to?: string
    show?: boolean
    items?: LinkItem[]
    actionText?: string
    count?: number
    action?: Function
}

interface Links {
    [module: string]: LinkItem
}

export default function useModuleLinks() {
    const { result: total } = useQuery(
        gql`
            query dashboardTopLinks {
                branchCount
                clientCount
                productCount
            }
        `,
    )

    const links = reactive<Links>({
        dashboard: {
            icon: 'ViewDashboardOutline',
            color: 'Blue',
            title: 'Dashboard',
            show: true,
            to: '/dashboard',
            items: [
                {
                    title: 'Timekeeper Module',
                    icon: 'Fingerprint',
                    color: 'blue',
                    to: '/timekeeper',
                    actionText: 'Go to Timekeeper',
                },
                {
                    title: 'Products',
                    icon: 'PackageVariantClosed',
                    color: 'amber',
                    to: '/products/product-list',
                    count: total.value?.productCount,
                },
                {
                    title: 'Clients',
                    icon: 'AccountGroupOutline',
                    color: 'cyan',
                    to: '/client/client-list',
                    count: total.value?.clientCount,
                },
                {
                    title: 'Manage Price list',
                    icon: 'CurrencyPhp',
                    to: '/products/price-list',
                    color: 'red',
                },
                {
                    title: 'Branches',
                    icon: 'OfficeBuildingMarkerOutline',
                    color: 'green',
                    to: '/branch/manage-branch',
                    count: total.value?.branchCount,
                },
                {
                    title: 'Settings',
                    icon: 'Cog',
                    color: 'blue',
                    to: '/settings/company-info',
                },
            ],
        },
        products: {
            title: 'Products',
            icon: 'Barcode',
            show: true,
            to: '/dashboard/products',
            items: [
                {
                    title: 'Product List',
                    to: '/products/product-list',
                    icon: 'PlaylistEdit',
                    color: 'blue',
                },
                {
                    title: 'Categories',
                    to: '/products/categories',
                    icon: 'ViewList',
                    color: 'amber',
                },
                {
                    title: 'Characteristics',
                    to: '/products/characteristics',
                    icon: 'AccountSearch',
                    color: 'blue',
                },
                {
                    title: 'Units',
                    to: '/products/units',
                    icon: 'Ruler',
                    color: 'cyan',
                },
                {
                    title: 'Price List',
                    to: '/products/price-list',
                    icon: 'Receipt',
                    color: 'red',
                },
                {
                    title: 'Category Adjustment',
                    to: '/products/category-adjustment',
                    icon: 'Tune',
                    color: 'blue',
                },
                {
                    title: 'Bundles',
                    to: '/products/bundles',
                    icon: 'StackOverflow',
                    color: 'green',
                },
            ],
        },

        procurement: {
            title: 'Procurement',
            icon: 'Shopping',
            show: true,
            to: '/dashboard/procurement',
            items: [
                {
                    title: 'Manage Suppliers',
                    to: '/procurement/manage-supplier',
                    icon: 'Dropbox',
                    color: 'blue',
                },
                {
                    title: 'Purchase Inventory',
                    to: '/procurement/purchase-inventory',
                    icon: 'Forklift',
                    color: 'blue',
                },
            ],
        },

        inventories: {
            title: 'Inventories',
            icon: 'FormatListBulletedSquare',
            show: true,
            to: '/dashboard/inventories',
            items: [
                {
                    title: 'Manage Inventories',
                    to: '/inventories/manage-inventory',
                    icon: 'PlaylistEdit',
                    color: 'blue',
                },
                {
                    title: 'Manage Racks',
                    to: '/inventories/manage-rack',
                    icon: 'Trackpad',
                    color: 'green',
                },
                {
                    title: 'Audit Inventory',
                    to: '/inventories/audit-inventory',
                    icon: 'Warehouse',
                    color: 'red',
                },
                {
                    title: 'Inventory Issues',
                    to: '/inventories/issue-inventory',
                    icon: 'PencilBoxMultipleOutline',
                    color: 'blue',
                },
                {
                    title: 'Transfer Inventory',
                    to: '/inventories/transfer-inventory',
                    icon: 'FolderSwapOutline',
                    color: 'cyan',
                },
                {
                    title: 'Receive Inventory',
                    to: '/inventories/receive-inventory',
                    icon: 'CallReceived',
                    color: 'blue',
                },
                {
                    title: 'Bad Order',
                    to: '/inventories/bad-order',
                    icon: 'AlertCircle',
                    color: 'amber',
                },
                {
                    title: 'Item Pick up',
                    to: '/inventories/item-pickup',
                    icon: 'CarLiftedPickup',
                    color: 'blue',
                },
                {
                    title: 'Spare Part',
                    to: '/inventories/spare-part',
                    icon: 'Wrench',
                    color: 'teal',
                },
                {
                    title: 'Supplies',
                    to: '/inventories/supplies',
                    icon: 'PencilBoxMultipleOutline',
                    color: 'blue',
                },
                {
                    title: 'Swapping',
                    to: '/inventories/swapping',
                    icon: 'SwapHorizontalBold',
                    color: 'deep-orange',
                },
                { title: 'Report', to: '/inventories/report', icon: 'FileChart', color: 'blue' },
                { title: 'Serial', to: '/inventories/serial', icon: 'SerialPort', color: 'blue' },
                {
                    title: 'Forecast',
                    to: '/inventories/forecast',
                    icon: 'WhiteBalanceSunny',
                    color: 'indigo',
                },
            ],
        },

        branch: {
            title: 'Branch',
            icon: 'SourceBranch',
            show: true,
            to: '/dashboard/branch',
            items: [
                {
                    title: 'Manage Branches',
                    to: '/branch/manage-branch',
                    icon: 'PlaylistEdit',
                    color: 'blue',
                },
                {
                    title: 'Manage Terminals',
                    to: '/branch/manage-terminal',
                    icon: 'Console',
                    color: 'brown',
                },
                { title: 'Petty Cash', to: '/branch/petty-cash', icon: 'Cash', color: 'green' },
                {
                    title: 'Shipping Company',
                    to: '/branch/shipping-company',
                    icon: 'TruckFast',
                    color: 'blue',
                },
            ],
        },

        client: {
            title: 'Client',
            icon: 'AccountGroup',
            show: true,
            to: '/dashboard/client',
            items: [
                { title: 'Client List', to: '/client/client-list', icon: 'ViewList', color: 'blue' },
                {
                    title: 'Characteristics',
                    to: '/client/characteristics',
                    icon: 'AccountGroup',
                    color: 'blue',
                },
                {
                    title: 'Terms',
                    to: '/client/terms',
                    icon: 'ProgressClock',
                    color: 'teal',
                },
            ],
        },

        users: {
            title: 'Users',
            icon: 'Account',
            show: true,
            to: '/dashboard/users',
            items: [
                {
                    title: 'Manage Users',
                    to: '/users/manage-user',
                    icon: 'AccountEdit',
                    color: 'blue',
                },
                {
                    title: 'Manage Positions',
                    to: '/users/manage-position',
                    icon: 'ShieldAccount',
                    color: 'green',
                },
                {
                    title: 'Manage Permissions',
                    to: '/users/manage-permission',
                    icon: 'AccountKey',
                    color: 'red',
                },
                // {
                //     title: 'Deliver Helper',
                //     to: '/users/deliver-helper',
                //     icon: 'Handshake',
                //     color: 'indigo',
                // },
                // {
                //     title: 'Driver',
                //     to: '/users/drivers',
                //     icon: 'AccountTie',
                //     color: 'blue',
                // },
                {
                    title: 'Manage Couriers',
                    to: '/users/courier',
                    icon: 'AccountTie',
                    color: 'blue',
                },
            ],
        },

        receipts: {
            title: 'Receipts',
            icon: 'Receipt',
            show: true,
            to: '/dashboard/receipts',
            items: [
                {
                    title: 'Manage Layout',
                    to: '/receipts/manage-layout',
                    icon: 'Dropbox',
                    color: 'blue',
                },
            ],
        },

        orders: {
            title: 'Orders',
            icon: 'Note',
            show: true,
            to: '/dashboard/orders',
            items: [
                {
                    title: 'Manage Order Points',
                    to: '/orders/manage-order-point',
                    icon: 'PlaylistEdit',
                    color: 'blue',
                },
                {
                    title: 'Critical Order',
                    to: '/orders/critical-order',
                    icon: 'AlertCircle',
                    color: 'red',
                },
                {
                    title: 'Order Item',
                    to: '/orders/order-item',
                    icon: 'Receipt',
                    color: 'blue',
                },
                {
                    title: 'Item Service',
                    to: '/orders/item-service',
                    icon: 'FaceAgent',
                    color: 'light-blue',
                },
                {
                    title: 'Order Reports',
                    to: '/orders/order-reports',
                    icon: 'FileChart',
                    color: 'green',
                },
                {
                    title: 'Truck Reports',
                    to: '/orders/truck-reports',
                    icon: 'Dolly',
                    color: 'blue',
                },
                {
                    title: 'Manage Trucks',
                    to: '/orders/manage-trucks',
                    icon: 'TowTruck',
                    color: 'blue',
                },
                {
                    title: 'Item Summary',
                    to: '/orders/item-summary',
                    icon: 'NoteText',
                    color: 'blue',
                },
            ],
        },

        sales: {
            title: 'Sales',
            icon: 'CurrencyPhp',
            show: true,
            to: '/dashboard/sales',
            items: [
                {
                    title: 'Manage Sales',
                    to: '/sales/manage-sales',
                    icon: 'PlaylistEdit',
                    color: 'blue',
                },
                {
                    title: 'Custom Report',
                    to: '/sales/custom-report',
                    icon: 'FileChart',
                    color: 'green',
                },
                {
                    title: 'Collection',
                    to: '/sales/collection',
                    icon: 'Dropbox',
                    color: 'amber',
                },
                { title: 'Credits', to: '/sales/credits', icon: 'AccountCash', color: 'blue' },
                {
                    title: 'Refund',
                    to: '/sales/refund',
                    icon: 'CashRefund',
                    color: 'blue',
                },
                {
                    title: 'Cheque Monitoring',
                    to: '/sales/cheque-monitoring',
                    icon: 'Checkbook',
                    color: 'blue',
                },
                {
                    title: 'Cash Monitoring',
                    to: '/sales/cash-monitoring',
                    icon: 'CashCheck',
                    color: 'red',
                },
                {
                    title: 'Consumable Monitoring',
                    to: '/sales/consumable-monitoring',
                    icon: 'Monitor',
                    color: 'blue',
                },
                {
                    title: 'Credit Card Monitoring',
                    to: '/sales/credit-card-monitoring',
                    icon: 'Handshake',
                    color: 'red',
                },
                {
                    title: 'Bank Transfer Monitoring',
                    to: '/sales/bank-transfer-monitoring',
                    icon: 'BankTransfer',
                    color: 'blue',
                },
                {
                    title: 'Accounts Receivable',
                    to: '/sales/accounts-receivable',
                    icon: 'Bitcoin',
                    color: 'blue',
                },
                {
                    title: 'Agent CR',
                    to: '/sales/agent-cr',
                    icon: 'FaceAgent',
                    color: 'light-blue',
                },
                {
                    title: 'Discount List',
                    to: '/sales/discount-list',
                    icon: 'Sale',
                    color: 'blue',
                },
                {
                    title: 'Agent Sales',
                    to: '/sales/agent-sales',
                    icon: 'Cash',
                    color: 'green',
                },
                {
                    title: 'Reports',
                    to: '/sales/reports',
                    icon: 'FileChart',
                    color: 'blue',
                },
                {
                    title: 'Deduction Type',
                    to: '/sales/deduction-type',
                    icon: 'ContentCut',
                    color: 'blue',
                },
                {
                    title: 'Deduction List',
                    to: '/sales/deduction-list',
                    icon: 'PlaylistRemove',
                    color: 'orange',
                },
                {
                    title: 'Deposits',
                    to: '/sales/deposits',
                    icon: 'CashPlus',
                    color: 'blue',
                },
            ],
        },

        settings: {
            title: 'Settings',
            icon: 'Cog',
            show: true,
            to: '/dashboard/settings',
            items: [
                {
                    title: 'Company Info',
                    to: '/settings/company-info',
                    icon: 'InformationOutline',
                    color: 'blue',
                },
                {
                    title: 'Configurations',
                    to: '/settings/configurations',
                    icon: 'Cogs',
                    color: 'blue',
                },
                {
                    title: 'Themes',
                    to: '/settings/themes',
                    icon: 'Palette',
                    color: 'blue',
                },
                {
                    title: 'Station Settings',
                    to: '/settings/station-settings',
                    icon: 'GasStationOutline',
                    color: 'brown',
                },
                {
                    title: 'Member Settings',
                    to: '/settings/member-settings',
                    icon: 'AccountSettings',
                    color: 'blue',
                },
                {
                    title: 'Supplier Settings',
                    to: '/settings/supplier-settings',
                    icon: 'Dropbox',
                    color: 'red',
                },
                { title: 'Recycle Bin', to: '/settings/recycle-bin', icon: 'Recycle', color: 'blue' },
                {
                    title: 'Consumable',
                    to: '/settings/consumable',
                    icon: 'Basket',
                    color: 'blue',
                },
                {
                    title: 'Freebies Admin',
                    to: '/settings/freebies-admin',
                    icon: 'Tag',
                    color: 'cyan',
                },
                {
                    title: 'Upload Utilities',
                    to: '/settings/upload-utilities',
                    icon: 'Upload',
                    color: 'green',
                },
                {
                    title: 'Labels',
                    to: '/settings/labels',
                    icon: 'Label',
                    color: 'blue',
                },
                {
                    title: 'Tenancy',
                    to: '/settings/tenants',
                    icon: 'CityVariant',
                    color: 'orange',
                },
            ],
        },

        apollo: {
            title: 'Apollo',
            icon: 'Key',
            show: true,
            to: '/dashboard/apollo',
            items: [
                {
                    title: 'Users',
                    to: '/apollo/users',
                    icon: 'AccountGroup',
                    color: 'blue',
                },
                {
                    title: 'Companies',
                    to: '/apollo/companies',
                    icon: 'OfficeBuilding',
                    color: 'purple',
                },
            ],
        },

        userProcedure: {
            title: 'User Procedure',
            icon: 'Key',
            show: true,
            to: '/dashboard/userProcedure',
            items: [
                {
                    title: 'Procedure',
                    to: '/user-procedure/procedures',
                    icon: 'AccountGroup',
                    color: 'blue',
                },
                {
                    title: 'Users',
                    to: '/user-procedure/users',
                    icon: 'OfficeBuilding',
                    color: 'purple',
                },
            ],
        },
        messages: {
            title: 'Messages',
            icon: 'Chat',
            show: true,
            to: '/',
        },
        logout: {
            title: 'Logout',
            icon: 'Logout',
            show: true,
            action: useModal,
        },
    })

    return { links }
}
