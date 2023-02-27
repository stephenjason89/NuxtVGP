<template>
    <TableHeader :title="labels[header ?? data.header] ?? header ?? data.header">
        <div class="d-flex">
            <!-- ............... Setup Permissions Table ............... -->
            <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                    <v-btn
                        icon
                        color="black"
                        retain-focus-on-click
                        v-bind="attrs"
                        v-on="on"
                        @click="useModal({ ...permissionsModal, model }, savePermissions, permissions.active)"
                    >
                        <Icon color="black" name="AccountKey" size="22" />
                    </v-btn>
                </template>
                <span>Permissions</span>
            </v-tooltip>

            <!-- ............... Add Button ............... -->
            <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                    <v-btn
                        v-if="crud.create !== false && crud.disabled !== true"
                        retain-focus-on-click
                        v-bind="attrs"
                        icon
                        color="green"
                        :loading="!!actionLoading.create"
                        v-on="on"
                        @click="
                            actionStart('create')
                            actionCreate()
                        "
                    >
                        <Icon color="green" name="Plus" size="22" />
                    </v-btn>
                </template>
                <span>Add</span>
            </v-tooltip>

            <!-- ............... Refresh Button ............... -->
            <TableRefreshButton :query="dataPaginationQuery" />

            <!-- ............... Download XLS/PSF File Button ............... -->
            <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                    <v-btn v-bind="attrs" color="brown" icon @click="downloadFile = !downloadFile" v-on="on">
                        <Icon color="brown" name="FileDownloadOutline" size="22" />
                    </v-btn>
                </template>
                <span>Download</span>
            </v-tooltip>

            <Doc :name="userManual" />
        </div>
    </TableHeader>
    <!-- eslint-disable vue/v-on-event-hyphenation -->
    <TableDataPagination
        ref="dataPagination"
        :actions="dataTable.actions"
        :disable-actions="dataTable.disableActions"
        :expanded-headers="dataTable.expandedHeaders"
        :filters="dataTable.filters"
        :filter-model="filterModel"
        :main-headers="dataTable.mainHeaders"
        :queries="dataTable.queries"
        :variables="vars"
        :component="dataTable.component"
        :view="dataTable.view"
        :on-download="downloadFile"
        v-bind="parseAttrs($attrs)"
        @_READ="read"
        @_UPDATE="
            typeof crud.update === 'string'
                ? $emit(crud.update.toLowerCase() === 'emit' ? 'update' : crud.update, $event)
                : useModal(updateModal, update, $event)
        "
        @_DELETE="
            defaultModal.message = `Are you sure you want to delete ${title || model} with an ID of ${
                $event.id
            } ?`
            useModal(defaultModal, destroy, $event)
        "
        @_RESTORE="
            defaultModal.message = `Are you sure you want to restore ${title || model} with an ID of ${
                $event.id
            } ?`
            useModal(defaultModal, restore, $event)
        "
        @_SETUP="setup"
        @_LOGS="logs"
        @variables="apolloVariables = $event"
    />
</template>
<script>
import cloneDeep from 'lodash.clonedeep'
import updateCache from '~/mixins/updateCache'
import { useLabels } from '~/store/labels'

import {
    upsertPermission,
    permissions as permissionsQuery,
    restorePermission,
    deletePermission,
} from '~/graphql/Permission'

export default {
    name: 'TableCRUD',
    props: {
        /**
         * Prop to define Table Header
         */
        header: {
            type: String,
            default: null,
        },
        /**
         * Prop to override component's data method
         *
         * @type {object} data
         * @example
         {
             data:{
                 // check respective prop for more info
                 queries,
                 mutations,
                 fields,
                 crud,

                 // defines table header and values
                 mainHeaders: [
                    { text: 'ID', value: 'id' },
                    { text: 'Name', value: 'name' },
                    // value can accept functions to transform field values
                    { text: 'Type', value: (row)=>'Transformation:'+row.status },
                ],
             }
         }
         */
        data: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Prop to pass on TableDataPagination's component
         *
         * Note: Defining queries prop inside data will ignore this property.
         * @example
         {
            queries:{
                // model name, will be used to find client/graphql/{Model}.js
                Branch: {
                    // method inside {Model}.js
                    method: 'branchSearch',
                },
            }
         }
         */
        queries: {
            type: Object,
            default: null,
        },
        /**
         * Additional apollo queries to be cache updated
         *
         * Note: If {model}Filter exists, it will be automatically included
         * @example
         {
            updateQueries:[
                // model name, will be used to find client/graphql/{Model}.js
                {model: 'Branch', method: 'customQuery'},
                ...
            ]
         }
         */
        updateQueries: {
            type: Array,
            default: () => [],
        },
        /**
         * Note: Override default mutations upsert, create, read, update {Model}
         * Method should be defined inside client/graphql/{Model.js}
         * @example
         {
            mutations:{
                // default values
                delete: 'deleteBranch',
                upsert: 'upsertBranch',
                create: 'createBranch',
                update: 'updateBranch',
            }
         }
         */
        mutations: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Prop to pass on TableDataPagination component
         * Create filters for Data Table
         * @example
         {
            filters: {
                // Refer to DataInput.vue and Input.vue for more info
                Branch: {
                    type: 'comboBox',
                    method: 'branchFilter',
                    attrs: {
                        label: 'Branch',
                        'item-text': 'name',
                    },
                },
                Rack: {
                    type: 'comboBox',
                    method: 'rackFilter',
                    attrs: {
                        label: 'Rack',
                        'item-text': 'name',
                    },
                    parent: 'Branch',
                },
                status: {
                        type: 'select',
                        link: {             // Links table fields to the filter
                            // Optional field transformation
                            label: (item) => (item.status < 0 ? 'Returned' : 'Normal'),
                            // Conditional Chip color, defaults to #BBB
                            color: (item) => (item.status < 0 ? 'red' : 'green'),
                        },
                        attrs: {
                            label: 'Type',
                            items: [
                                { text: 'Normal', value: this.stepIndex + 1 },
                                { text: 'Returned', value: -(this.stepIndex + 1) },
                            ],
                        },
                    },
         }
         */
        filters: {
            type: Object,
            default: null,
        },
        /**
         * Prop to pass a Filter model
         * to control filters programmatically
         * in parent component
         **/
        filterModel: {
            type: Object,
            default: undefined,
        },
        /**
         * Prop to pass on TableDataPagination component
         * Custom data table actions
         * @example
         {
            actions:{
                // custom button
                Example: {
                    event: 'somethingCool',
                    icon: 'Mdi Icon Name',
                    attrs: {
                        color: 'green',
                        size: 20,
                    },
                }
                // default values
                Details: {
                    event: '_READ',
                    icon: 'Eye',
                    attrs: {
                        color: 'blue',
                        size: 20,
                    },
                },
                Setup: {
                    event: '_SETUP',
                    icon: 'StateMachine',
                    attrs: {
                        color: 'brown lighten-1',
                        size: 20,
                    },
                },
                Edit: {
                    event: '_UPDATE',
                    icon: 'Pencil',
                    attrs: {
                        color: 'orange',
                        size: 20,
                    }
                },
                Delete: {
                    event: '_DELETE',
                    icon: 'TrashCanOutline',
                    attrs: {
                        color: 'red',
                        size: 20,
                    }
                }
         }
         */
        actions: {
            type: Object,
            default: null,
        },
        /**
         * Components' options to add: create, read, update, delete, setup functionality.
         *
         * @type {object} crud
         * @example
         {
            crud:{
                // default value: true when available
                // pass a string 'eventName' to emit a custom event without the modal or
                // 'emit' to emit a create event together with returned data from modal
                create: true,
                // pass an object to customize event and text
                create: {
                    event: 'emit', // emit an event to be handled by the parent after modal confirmation
                                   // if its value is not 'emit', emit an event without modal
                    text: 'Name' // Label of the button
                }
                //  pass an object with modal options or true to emit an event
                read: {

                    // refer to Modal.vue for more options
                    title: "Example",
                    subtitle: "Test subtitle",

                    // pass a headers array to render a TableSimple & use rowData
                    headers: [
                        {
                            text: 'Dessert',
                            value: 'name',
                        },
                        {
                            text: 'Calories',
                            // dot notation to reference a nested prop
                            value: 'details.calories',
                        },
                    ]
                    // you can also create your own table
                    table:{
                        items:[]
                        headers:[]
                    }
                },
                // setup will emit a setup event together with modal data when done
                setup: {

                    // same options with read but usually used together with a form
                    title: "Example",

                    // define fields to create a form
                    // the response will have an id associated to the row.id
                    fields: {

                        // row.id is included by default (optional)
                        id: {
                            type: 'textField',
                            attrs: {
                                label: 'Id',
                                type: 'text',
                                disabled: true,
                            },
                        },

                        // if name key exist in the row, row.name will be used
                        name: {
                            type: 'textField',
                            required: true,
                            attrs: {
                                label: 'Name',
                                type: 'text',
                            },
                        },
                    }

                    // TableSimple
                    headers: [...]
                },

                // emit an update event to be handled by the parent
                update: 'emit', // update

                // removes delete action
                delete: false,

                // activate log action
                // make sure to include logs on your query and mutations
                logs: true,

                // if set to true, disable all crud actions
                disabled: null
            }
         }
         */
        crud: {
            type: Object, // {create:true,read:true,update:'emit',delete:true,disabled:false}
            default: () => ({}),
        },
        /**
         * Additional data for overriding or extending this.createModal and this.updateModal data
         */
        modal: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Fields to generate inside Modal component
         *
         * Applies to create, update Modal
         * @example
         {
            // refer to Input.vue for more details
            fields: {
                barcode: {
                    type: 'textField',
                    cols: 4,
                    header: 'Product Information',
                    attrs: {
                        label: 'Barcode',
                    },
                },
                item_code: {
                    type: 'textField',
                    cols: 4,
                    required: true,
                    attrs: {
                        label: 'Item Code*',
                    },
                },
            }
         }
         */
        fields: {
            type: Object,
            default: null,
        },
        /**
         * Prop to pass in TableDataPagination component
         *
         * Additional query variables like
         * @example
         {
            variables:{
                company_id:1
            }
         }
         */
        variables: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Additional variables to be included in this.createModal.model, this.updateModal.model
         * This variables can be used for mutation
         */
        mutationVariables: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Variables to be included in both query and mutation
         */
        globalVariables: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Loading status of Modal component
         */
        loading: {
            type: Boolean,
            default: false,
        },
        /**
         * Title of the Modal component, if not defined it will use this.model instead
         */
        title: {
            type: String,
            default: null,
        },
        userManual: {
            type: String,
            default: null,
        },
    },
    emits: ['read', 'setup', 'delete', 'restore'],
    data: () => ({
        useModal,
        app: useApp(),
        labels: useLabels(),
        /**
         * Base data table pagination object
         */
        dataTable: {
            queries: {},
            actions: {},
            filters: {},
            mainHeaders: [
                { text: 'ID', value: 'id' },
                { text: 'Name', value: 'name' },
            ],
        },
        /**
         * Modal data for create, this will also be used as a base object where fields will be merged
         */
        createModal: {
            confirmation: true,
            title: 'Create ',
            returnObject: true,
            fields: {
                name: {
                    type: 'textField',
                    required: true,
                    attrs: {
                        label: 'Name',
                        type: 'text',
                    },
                },
            },
        },
        /**
         * Modal data for update, this will also be used as a base object where fields will be merged
         */
        updateModal: {
            confirmation: true,
            title: 'Update ',
            positiveBtn: 'Update',
            returnObject: true,
            fields: {
                id: {
                    type: 'textField',
                    attrs: {
                        label: 'Id',
                        type: 'text',
                        disabled: true,
                    },
                },
                name: {
                    type: 'textField',
                    required: true,
                    attrs: {
                        label: 'Name',
                        type: 'text',
                    },
                },
            },
        },
        /**
         * Modal data for delete confirmation
         */
        defaultModal: {
            title: 'Please confirm',
            message: 'Are you sure you want to delete/restore this?',
            positiveBtn: 'Yes',
        },
        permissions: { active: {}, deleted: {} },
        /**
         * Modal data for permissions
         */
        permissionsModal: {
            tabs: {
                TablePermissions: {},
                InputFields: {},
            },
        },
        /**
         * Dynamically imported gql queries and mutations
         */
        gql: {
            queries: [],
        },
        /**
         * Model name
         * Example: Branch, User, Product
         * Extracted from queries property on created
         */
        model: null,
        /**
         * Variables used in datatable query
         * Will be used for updating apollo cache
         */
        apolloVariables: null,
        /**
         * Used to refresh datatable
         */
        dataPaginationQuery: {},
        downloadFile: false,
        /**
         * Used to for loading status of action buttons
         */
        actionLoading: {},
        permissionActions: ['create', 'read', 'update', 'delete', 'upsert', 'restore', 'forceDelete'],
    }),
    computed: {
        /**
         * Additional variables to be used in datatable query
         * @returns {Object}
         */
        vars() {
            return Object.assign(
                {},
                this.data.variables,
                this.data.globalVariables,
                this.variables,
                this.globalVariables,
            )
        },
    },
    watch: {
        /**
         * Assign global modal loading state
         */
        loading() {
            this.app.modal.loading = this.loading
        },
        'data.filters': {
            handler(newVal) {
                this.$set(this.dataTable, 'filters', newVal)
            },
            deep: true,
        },
    },
    async created() {
        /**
         * Recreate dataTable object with whatever data is available in props
         */
        if (this.data.queries) this.dataTable = Object.assign({}, { actions: {} }, this.data)

        // Combine crud
        for (const [key, value] of Object.entries(this.data?.crud ?? {})) this.$set(this.crud, key, value)

        // Create actions object
        if (this.actions) this.$set(this.dataTable, 'actions', { ...this.dataTable.actions, ...this.actions })

        // Create filters object
        if (this.filters) this.$set(this.dataTable, 'filters', this.filters)

        // Create an actions column inside datatable if needed
        if (!this.dataTable.view || this.dataTable.view?.type === 'data') {
            if (
                !this.dataTable.mainHeaders.find(
                    (header) =>
                        typeof header.value !== 'function' && header?.value?.toLowerCase() === 'actions',
                ) &&
                Object.values(this.crud).reduce((a, item) => a + (item === false ? 1 : 0), 0) < 6 &&
                !(this.crud.disabled === true && !(this.crud.setup || this.crud.logs || this.crud.restore))
            )
                this.dataTable.mainHeaders.push({
                    text: 'Actions',
                    value: 'actions',
                    sortable: false,
                    align: 'center',
                })
        }

        // Create updateQueries object
        this.$set(this.dataTable, 'updateQueries', [
            ...this.updateQueries,
            ...(this.data.updateQueries ?? []),
        ])

        const queries = this.data.queries ? this.data.queries : this.queries
        this.$set(this.dataTable, 'queries', queries)
        // Identify model used in query
        this.model = Object.keys(queries)[0]
        // Assign modal title
        this.createModal.title += this.title ?? this.model
        this.updateModal.title += this.title ?? this.model

        // Dynamically import gql queries
        for (const query of Object.values(queries)) {
            if (query.method) {
                const { [query.method]: gql } = await import(`~/graphql/${this.model}`)
                const { [this.model.toLowerCase() + 'Filter']: filter } = await import(
                    `~/graphql/${this.model}`
                )
                this.gql.queries.push(gql, filter)
            }
        }

        for (const query of this.dataTable.updateQueries) {
            if (query.model && query.method) {
                const { [query.method]: gql } = await import(`~/graphql/${query.model}`)
                this.gql.queries.push(gql)
            }
        }

        // Try to predict and use mutation if available
        const mutations = {
            delete: 'delete' + this.model,
            restore: 'restore' + this.model,
            upsert: 'upsert' + this.model,
            create: 'create' + this.model,
            update: 'update' + this.model,
            ...this.mutations,
            ...this.data.mutations,
        }

        // Assign a new model if a different model will be used for mutation
        if (mutations.model) this.model = mutations.model

        // Dynamically import gql mutations
        try {
            for (const [action, mutation] of Object.entries(mutations)) {
                const { [mutation]: gql } = await import(`~/graphql/${this.model}`)
                const mutation2 = mutation.charAt(0).toUpperCase() + mutation.slice(1)
                const { [mutation2]: gql2 } = await import(`~/graphql/${this.model}`)

                this.$set(this.gql, action, { q: gql ?? gql2, method: gql ? mutation : mutation2 })
                if (action === 'upsert' && (gql || gql2)) {
                    this.$set(this.gql, 'create', { q: gql ?? gql2, method: gql ? mutation : mutation2 })
                    this.$set(this.gql, 'update', { q: gql ?? gql2, method: gql ? mutation : mutation2 })
                    mutations.create = gql ? mutation : mutation2
                    mutations.update = gql ? mutation : mutation2
                    break
                }
            }
        } catch (error) {
            console.error('check graphql mutations CRUD : ' + error)
        }

        if (this.crud.setup !== undefined && this.crud.setup)
            this.$set(this.dataTable.actions, 'Setup', {
                event: '_SETUP',
                icon: 'StateMachine',
                attrs: {
                    color: 'brown lighten-1',
                    size: 20,
                },
            })

        // Add CRUD action buttons if needed
        if (this.crud.disabled !== true) {
            if (this.crud.read !== undefined && this.crud.read)
                this.$set(this.dataTable.actions, 'Details', {
                    event: '_READ',
                    icon: 'Eye',
                    attrs: {
                        color: 'blue',
                        size: 20,
                    },
                })
            if (this.crud.update !== false)
                this.$set(this.dataTable.actions, 'Edit', {
                    event: '_UPDATE',
                    icon: 'Pencil',
                    attrs: {
                        color: this.gql.update.q ? 'orange' : 'grey',
                        disabled: !this.gql.update.q,
                        size: 20,
                    },
                })
            if (this.crud.delete !== false)
                this.$set(this.dataTable.actions, 'Delete', {
                    event: '_DELETE',
                    icon: 'TrashCanOutline',
                    attrs: {
                        color: this.gql.delete.q ? 'red' : 'grey',
                        disabled: !this.gql.delete.q,
                        size: 20,
                    },
                })
        }
        if (this.crud.restore !== undefined)
            this.$set(this.dataTable.actions, 'Restore', {
                event: '_RESTORE',
                icon: 'RecycleVariant',
                attrs: {
                    color: this.gql.restore.q ? 'green' : 'grey',
                    disabled: !this.gql.restore.q,
                    size: 20,
                },
            })
        if (this.crud.logs !== undefined && this.crud.logs)
            this.$set(this.dataTable.actions, 'Logs', {
                event: '_LOGS',
                icon: 'FileDocumentMultipleOutline',
                attrs: {
                    color: 'indigo',
                    size: 20,
                },
            })

        // Assign model used to modal for optimistic response creation
        this.createModal.model = this.model
        this.updateModal.model = this.model

        // Dynamically add watcher to update modal
        this.$watch(
            (vm) => [vm.modal, vm.fields, vm.data.fields, vm.data.tabs],
            () => {
                this.setModalFields()
            },
            {
                immediate: true,
                deep: true,
            },
        )
        this.dataPaginationQuery = this.$refs.dataPagination?.$apollo?.queries?.items ?? {}
    },
    methods: {
        // Save Permissions into server
        savePermissions(data) {
            const mutations = []
            for (const [key, value] of Object.entries(data)) {
                // If deleted record already exist then restore
                if (value?.id && value?.deleted_at)
                    mutations.push(
                        this.$apollo.mutate({
                            mutation: value?.id ? restorePermission : upsertPermission,
                            variables: {
                                id: value?.id ?? undefined,
                            },
                        }),
                    )
                // Upsert record
                else if (value)
                    mutations.push(
                        this.$apollo.mutate({
                            mutation: upsertPermission,
                            variables: {
                                input: {
                                    id: value?.id ?? undefined,
                                    action: `${key.split('-').shift()}`,
                                    model: useApp().modal.data.model,
                                    description: `Allow a specific user to ${
                                        key.includes('-') ? key.split('-').shift() : key
                                    } a ${useApp().modal.data.model} ${
                                        key.includes('-') ? key.split('-').pop() : ''
                                    }.`,
                                    field: key.includes('-') ? key.split('-').pop() : null,
                                },
                            },
                        }),
                    )
                // Delete record
                else if (this.permissions.active?.[key]?.id) {
                    mutations.push(
                        this.$apollo.mutate({
                            mutation: deletePermission,
                            variables: {
                                id: this.permissions.active[key].id,
                            },
                        }),
                    )
                }
            }
            Promise.all(mutations).then(() => {
                this.$iziToast.success({
                    title: 'Done',
                    message: 'Permissions are successfully updated!',
                })
            })
        },
        // Trigger a brief loading animation upon action button click
        actionStart(name) {
            this.$set(this.actionLoading, name, true)
            setTimeout(() => (this.actionLoading[name] = false), 350)
        },
        setPermissionFields() {
            const fields = { ...this.permissionsModal.tabs.InputFields.fields }
            const permissions = { ...this.permissions.active, ...this.permissions.deleted }
            for (const [key, value] of Object.entries(this.createModal.fields)) {
                for (const [i, action] of this.permissionActions.entries()) {
                    const fieldName = action + '-' + (value?.fieldName ?? key)
                    fields[fieldName] = {
                        type: 'switch',
                        header: +i === 0 ? value.attrs.label.replace('*', '') : '',
                        cols: 3,
                        emptyCols: +i === 6 ? 1 : null,
                        attrs: {
                            label: kebabize(action, ' '),
                            'true-value': permissions?.[fieldName] ?? true,
                        },
                    }
                }
            }
            this.$set(this.permissionsModal.tabs.TablePermissions, 'fields', {
                ...this.permissionsModal.tabs.TablePermissions.fields,
                ...this.permissionActions.reduce((a, c) => {
                    a[c] = {
                        type: 'switch',
                        cols: 3,
                        attrs: {
                            label: kebabize(c, ' '),
                            value: permissions?.[c] ?? true,
                            'true-value': permissions?.[c] ?? true,
                        },
                    }
                    return a
                }, {}),
            })
            this.$set(this.permissionsModal.tabs.InputFields, 'fields', fields)
        },
        // Create or update the modal data
        setModalFields() {
            Object.assign(this.modal, this.data.modal ?? {})
            if (Object.keys(this.modal.tabs ?? {})?.length) {
                // When using tabs, remove default fields
                this.$set(this.createModal, 'fields', {})
                this.$set(this.updateModal, 'fields', {})
            }

            if (this.fields || this.data.fields) {
                // Set default fields
                this.$set(this.createModal, 'fields', this.fields || this.data.fields)
                this.$set(this.updateModal, 'fields', {
                    id: {
                        type: 'textField',
                        attrs: {
                            label: 'Id',
                            type: 'text',
                            disabled: true,
                        },
                    },
                    ...(this.fields || this.data.fields),
                })
            }

            const variables = {
                ...this.data.mutationVariables,
                ...this.data.globalVariables,
                ...this.mutationVariables,
                ...this.globalVariables,
            }
            this.createModal = { ...this.createModal, ...cloneDeep(this.modal) }
            this.updateModal = { ...this.updateModal, ...cloneDeep(this.modal) }

            this.filterFields(this.createModal, 'create')
            this.filterFields(this.updateModal, 'update')

            this.createModal = {
                ...this.createModal,
                variables,
                models: {
                    ...variables,
                    ...this.createModal.models,
                },
            }
            this.updateModal = {
                ...this.updateModal,
                variables,
                models: {
                    ...variables,
                    ...this.updateModal.models,
                },
            }
        },
        filterFields(data, type) {
            const removeKey = (val) => {
                for (const key in val) if (val[key]?.hideOn?.toLowerCase() === type) this.$delete(val, key)
            }
            removeKey(data.fields)
            for (const key in data?.tabs) {
                if (data.tabs[key]?.hideOn?.toLowerCase() === type) this.$delete(data.tabs, key)
                else removeKey(data.tabs[key].fields)
            }
        },
        // Create a new record
        actionCreate() {
            if (isString(this.crud.create)) {
                /**
                 * Triggers when this.crud.create = 'emit'
                 *
                 * Use this if you want to emit a custom event without the modal
                 *
                 * @property {string} this.crud.create 'emit' to emit create or 'custom' to emit a custom event
                 */
                this.$emit(this.crud.create === 'emit' ? 'create' : this.crud.create)
            } else this.useModal(this.createModal, this.create)
        },
        // Create database record
        create(data, uploaderCallback) {
            if (isString(this.crud.create?.event)) {
                /**
                 * Triggers when this.crud.create.event = 'emit'
                 *
                 * Use this if you want to emit a custom/create event after filling up the modal
                 *
                 * @event create
                 * @property {object} data returned data from create modal
                 */
                this.$emit(
                    this.crud.create?.event?.toLowerCase() === 'emit' ? 'create' : this.crud.create?.event,
                    data,
                )
                return
            }
            this.app.modal.loading = true
            const { input, inputValues } = data
            if (input?.id && !this.gql.create.method?.toLowerCase()?.includes('upsert')) {
                console.warn('Deleting id from input because mutation is not upsert.')
                delete input.id
                delete inputValues.id
            }
            this.$apollo
                .mutate({
                    mutation: this.gql.create.q,
                    variables: { input, ...inputValues },
                    update: async (cache, { data: { [this.gql.create.method]: mutationResult } }) => {
                        let uploads = []
                        if (this.app.modal.files > 0)
                            uploads = await uploaderCallback(mutationResult.id, this.model)
                        updateCache({
                            cache,
                            queries: this.gql.queries,
                            mutationResult: { ...mutationResult, uploads },
                            variables: this.apolloVariables,
                        })
                    },
                })
                .then(() => {
                    this.$iziToast.success({
                        title: 'Created',
                        message: (this.title || this.model) + ' creation successful!',
                    })
                })
                .catch((err) => {
                    console.error(err?.graphQLErrors)
                    this.$iziToast.error({
                        title: 'Update Error',
                        message: err?.graphQLErrors?.[0]?.message ?? 'Mutation not found',
                    })
                })
                .finally(() => {
                    this.app.modal.loading = false
                })
        },
        read(data) {
            if (typeof this.crud.read === 'object') {
                const { headers, ...modalOptions } = this.crud.read
                this.useModal({
                    positiveBtn: false,
                    table: {
                        items: data,
                        headers,
                    },
                    ...modalOptions,
                })
                return
            }

            /**
             * Event emitted when read action is commenced
             *
             * @event read
             * @param {object} data returned data from TableDataPagination's row
             */
            this.$emit('read', data)
        },
        setup(data) {
            if (typeof this.crud.setup === 'object') {
                const { headers, ...modalOptions } = this.crud.setup
                this.useModal(
                    {
                        table: {
                            items: data,
                            headers,
                        },
                        variables: { id: data.id },
                        ...modalOptions,
                    },
                    (data) => this.$emit('setup', data),
                    data,
                )
                return
            }

            /**
             * Event emitted when setup action is commenced
             *
             * @event setup
             * @param {object} data returned data from TableDataPagination's row or modal
             */
            this.$emit('setup', data)
        },
        logs(data) {
            if (data?.logs)
                this.useModal({
                    title: 'Logs',
                    positiveBtn: false,
                    negativeBtn: 'Close',
                    maxWidth: 900,
                    table: {
                        items: data.logs,
                        headers: [
                            { text: 'ID', align: 'start', value: 'id' },
                            { text: 'User', value: 'user.name' },
                            { text: 'Event', value: 'event' },
                            { text: 'Old Values', value: 'old_values' },
                            { text: 'New Values', value: 'new_values' },
                            { text: 'IP Address', value: 'ip_address' },
                            { text: 'Date', value: 'created_at' },
                        ],
                    },
                })
            else
                console.error(
                    'Please return logs in your query. Also make sure that you implement LoggableContract and add "logs: [Log!]! @morphMany" in your graphql schema.',
                )
        },
        // Update database record
        update(data, uploaderCallback) {
            if (isString(this.crud.update?.event)) {
                /**
                 * Triggers when this.crud.update is a string
                 *
                 * Use this if you want complete control on update method
                 *
                 * @event update (string) 'emit' to emit update event or any string to emit a custom event
                 * @property {object} data returned data from update modal
                 */
                this.$emit(
                    this.crud.update?.event?.toLowerCase() === 'emit' ? 'update' : this.crud.update?.event,
                    data,
                )
                return
            }
            const { input, inputValues, optimisticResponse } = data
            let switchVars = null
            if (Object.keys(this.vars).length) {
                switchVars = { first: 10, page: 1, searchFallback: '%%' }
                for (const key in this.vars) switchVars[key] = input[key] ?? this.vars[key]
            }

            if (this.app.modal.files > 0) this.app.modal.loading = true
            this.$apollo
                .mutate({
                    mutation: this.gql.update.q,
                    variables: { input, ...inputValues },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        [this.gql.update.method]: {
                            __typename: this.model,
                            ...optimisticResponse,
                        },
                    },
                    update: async (cache, { data: { [this.gql.create.method]: mutationResult } }) => {
                        let uploads
                        if (this.app.modal.files > 0 || switchVars) {
                            if (this.app.modal.files > 0 && !mutationResult.__isOptimistic) {
                                uploads = await uploaderCallback(mutationResult.id, this.model)
                                this.app.modal.loading = false
                            }
                            updateCache({
                                cache,
                                queries: this.gql.queries,
                                mutationResult: { ...mutationResult, uploads },
                                variables: this.apolloVariables,
                                ...(switchVars ? { operation: 'MOVE', switchVars } : {}),
                            })
                        }
                    },
                })
                .then(() => {
                    this.$iziToast.success({
                        title: 'Updated',
                        message: (this.title || this.model) + ' update successful!',
                    })
                })
                .catch((err) => {
                    console.error(err?.graphQLErrors)
                    this.$iziToast.error({
                        title: 'Update Error',
                        message: err?.graphQLErrors?.[0]?.message,
                    })
                })
        },
        // Delete database record
        destroy(data) {
            if (this.crud.delete?.toString()?.toLowerCase() === 'emit') {
                /**
                 * Triggers when this.crud.delete = 'emit'
                 *
                 * Use this if you want complete control on destroy method.
                 *
                 * @event delete
                 * @param {object} data returned data from TableDataPagination's row
                 */
                this.$emit('delete', data)
                return
            }

            let variables = { id: data.id }
            let mutation = this.gql.delete.q
            let method = 'delete' + this.model
            let optimisticResponse = {
                __typename: 'Mutation',
                [method]: {
                    __typename: this.model,
                    id: data.id,
                },
            }
            if (this.dataTable.queries.use && this.gql.update && this.gql.delete.method === method) {
                method = this.gql.update.method
                mutation = this.gql.update.q
                variables = { input: { id: data.pid, [this.dataTable.queries.use]: { disconnect: data.id } } }
                optimisticResponse = false
            }

            if (!optimisticResponse) this.app.modal.loading = true
            this.$apollo
                .mutate({
                    mutation,
                    variables,
                    optimisticResponse,
                    update: (cache, { data: { [method]: mutationResult } }) => {
                        if (
                            !(
                                this.dataTable.queries.use &&
                                this.gql.update.q &&
                                this.gql.delete.method === 'delete' + this.model
                            )
                        )
                            updateCache({
                                cache,
                                queries: this.gql.queries,
                                mutationResult,
                                variables: this.apolloVariables,
                                operation: 'MOVE',
                                switchVars: { trashed: 'ONLY', first: 10, page: 1, searchFallback: '%%' },
                            })
                    },
                })
                .then(() => {
                    this.$iziToast.success({
                        title: 'Deleted',
                        message: (this.title || this.model) + ' deletion successful!',
                    })
                })
                .catch((err) => {
                    console.error(err?.graphQLErrors)
                    this.$iziToast.error({
                        title: 'Delete Error',
                        message: err?.graphQLErrors?.[0]?.message,
                    })
                })
                .finally(() => {
                    if (!optimisticResponse) this.app.modal.loading = false
                })
        },

        // Restore a record from Trash
        restore(data) {
            if (this.crud.restore?.toString()?.toLowerCase() === 'emit') {
                /**
                 * Triggers when this.crud.restore = 'emit'
                 *
                 * Use this if you want complete control on restore method.
                 *
                 * @event delete
                 * @param {object} data returned data from TableDataPagination's row
                 */
                this.$emit('restore', data)
                return
            }

            const variables = { id: data.id }
            const mutation = this.gql.restore.q
            const method = 'restore' + this.model
            const optimisticResponse = {
                __typename: 'Mutation',
                [method]: {
                    __typename: this.model,
                    id: data.id,
                },
            }

            this.$apollo
                .mutate({
                    mutation,
                    variables,
                    optimisticResponse,
                    update: (cache, { data: { [method]: mutationResult } }) => {
                        updateCache({
                            cache,
                            queries: this.gql.queries,
                            mutationResult,
                            variables: this.apolloVariables,
                            operation: 'MOVE',
                            switchVars: {
                                first: 10,
                                page: 1,
                                searchFallback: '%%',
                            },
                        })
                    },
                })
                .then(() => {
                    this.$iziToast.success({
                        title: 'Restored',
                        message: (this.title || this.model) + ' restoration successful!',
                    })
                })
                .catch((err) => {
                    console.error(err?.graphQLErrors)
                    this.$iziToast.error({
                        title: 'Restore Error',
                        message: err?.graphQLErrors?.[0]?.message,
                    })
                })
        },
    },
    apollo: {
        permissions: {
            query: permissionsQuery,
            variables() {
                return {
                    whereCondition: { column: `MODEL`, value: this.model },
                }
            },
            skip() {
                return !this.model
            },
            update(data) {
                return data.permissions.reduce(
                    (acc, permission) => {
                        acc[permission?.deleted_at ? 'deleted' : 'active'][
                            permission?.field ? `${permission.action}-${permission.field}` : permission.action
                        ] = permission
                        return acc
                    },
                    { active: {}, deleted: {} },
                )
            },
            result() {
                this.setPermissionFields()
            },
        },
    },
}
</script>
