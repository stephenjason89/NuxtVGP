<template>
    <LazyHydrate on-idle>
        <LazyTableInput
            :value="parentIndex !== undefined ? models[key][parentIndex] : models[key]"
            :data="data[key]"
            :items="itemList"
            :return-values="!returnObject && !data[key].attrs['item-text'] && returnValues"
            :index="index"
            :disabled-by-parent="{
                value: parentInput.required,
                message: ` - << ${parentInput.label} is a prerequisite >> -`,
            }"
            :query-loading="$apollo.queries?.items?.loading || searchQuery.loading"
            :parent-index="parentIndex"
            @search="updateSearchQuery"
            @input="emitter($event, parentIndex)"
        />
    </LazyHydrate>
</template>

<script>
export default {
    name: 'TableDataInput',
    components: {
        LazyHydrate: () => import('vue-lazy-hydration'),
    },
    inheritAttrs: false,
    props: {
        /**
         * Collection of Inputs (use only one)
         * Refer to Input.vue for more details
         * @type {object} data
         * @example
         data: {
                Category: {                     // Key will be used as model name
                    type: 'comboBox',           // Type of Input (refer to Input.vue)

                    // Nested Mutation's connection (default: connect)
                    connection: 'connect',      // Optional
                    required: true,             // Force user to use input
                    method: 'categoryFilter',   // Method in graphql/{Model}.js
                    fieldName: 'categories',    // Override key as fieldName
                    variables: { scope: 'Product' },    // Variables for queries
                    queryOnDemand: false,      // Query on demand (default: false)
                    attrs: {
                        // Refer to Input.vue & vuetify documentation for more info
                        label: 'Category*',
                        'item-text': 'name',
                    },
                },
                Tag: {
                    type: 'comboBox',
                    cols: 4,
                    required: true,
                    // If acceptUserInput then mutation's connection (default: connectOrCreate)
                    connection: 'connectOrCreate | syncOrCreate', // Optional
                    method: 'tagFilter',
                    acceptUserInput: true,
                    attrs: {
                        label: 'Tag*',
                        'item-text': 'name',
                    },
                },
                characteristics: {
                    type: 'select',
                    model: 'Category',          // Used to override key as model name
                    method: 'categoryFilter',   // Method in graphql/Category.js
                    variables: { scope: 'Product', hasCharacteristics: {} },
                    expanded: 'characteristics',
                    attrs: {
                        label: 'Characteristics',
                        multiple: true,
                        'item-text': 'name',
                        chips: true,
                    },
                },
                packageComponents: {
                    type: 'comboBox',           // Type of input
                    addMore: 'components',      // Dynamically add more inputs
                    required: true,

                    // When grouped, use connectionGroup instead of connection
                    connectionGroup: 'upsert',

                    // Grouped under Product->components relationship
                    fieldGroup: 'components',

                    // Override packageComponents as fieldName
                    fieldName: 'component',
                    header: 'Package Component',// Header label before Input
                    model: 'Product',           // client/graphql/Product.js
                    method: 'productFilter',    // Method that will be imported
                    attrs: {
                        label: 'Product Component',
                        'item-text': 'item_code',
                    },
                },
                // Grouped together with packageComponents (Product->components)
                packageComponentsQty: {
                    type: 'textField',
                    addMore: 'components',
                    required: true,
                    connectionGroup: 'upsert',
                    fieldGroup: 'components',
                    fieldName: 'qty',
                    header: 'Package Quantity',
                    attrs: {
                        label: 'Component Qty',
                        type: 'number',
                    },
                },
          }
         */
        data: {
            type: Object,
            required: true,
        },
        /**
         * If data object has multiple properties
         * Define a key to be used
         * Otherwise, first property will be used as key
         *
         */
        dataKey: {
            type: String,
            default: null,
        },
        /**
         * Automatically declared if v-model was used
         * @type undefined
         */
        value: {
            type: undefined,
            default: null,
        },
        /**
         * Force to return object
         * Only values are returned by default
         * @type {boolean}
         */
        returnObject: {
            type: Boolean,
            default: false,
        },
        /**
         * Return Values
         * Object will be returned if set to false
         * @type {boolean}
         */
        returnValues: {
            type: Boolean,
            default: true,
        },
        /**
         * Used to add variables to the query
         * Usually for query scoping
         * @type {object}
         * @example
         Category: {
                    type: 'select',
                    method: 'categoryFilter',
                    variables: { scope: 'Product' },
                    attrs: {
                        label: 'Category',
                        multiple: true,
                        'item-text': 'name',
                    },
         },
         */
        variables: {
            type: Object,
            default: () => ({}),
        },
        index: {
            type: Number,
            default: undefined,
        },
        parentIndex: {
            type: Number,
            default: undefined,
        },
    },
    data: () => ({ searchQuery: { timeout: null, text: '', loading: false }, items: undefined }),
    computed: {
        key() {
            return this.dataKey ?? Object.keys(this.data)?.[0]
        },
        models() {
            return this.value ?? {}
        },
        parentInput() {
            const name = this.data[this.key]?.parent?.name ?? this.data[this.key].parent
            let model = this.models?.[name]
            if (Array.isArray(model)) model = model[this.index]

            return {
                id: model?.id || model,
                name,
                label: this.data[this.key]?.parent?.label ?? name,
                required: this.data[this.key]?.parent?.required && !this.models?.[name],
            }
        },
        itemList() {
            const newItems = []
            if (this.data[this.key].expanded && this.items) {
                for (const item of this.items) {
                    newItems.push({ header: item.name }, { divider: true })
                    newItems.push(...item[this.data[this.key].expanded])
                }
            }

            if (this.parentInput.id)
                return this.items?.filter(
                    (item) => this.parentInput.id === item[this.parentInput.name.toLowerCase() + '_id'],
                )

            return this.data[this.key]?.queryOnDemand && !this.searchQuery.text
                ? []
                : newItems.length
                ? newItems
                : this.items
        },
    },

    async created() {
        if (!Object.entries(this.data)?.[0]) console.error('Data is an empty object')
        const data = this.data[this.key]
        const method = data.method
        let model = (data.model ?? this.key).toLowerCase()
        model = model.charAt(0).toUpperCase() + model.slice(1)

        try {
            const { [method]: gql } = await import(`~/graphql/${model}`)
            await this.$apollo.addSmartQuery('items', {
                query: gql,
                variables() {
                    return { ...(data.variables ?? {}), search: this.searchQuery.text }
                },
                update(data) {
                    return Object.values(data)[0]
                },
                skip() {
                    return this.data[this.key]?.queryOnDemand
                        ? this.data[this.key]?.queryOnDemand && !this.searchQuery.text
                        : false
                },
            })
        } catch (e) {
            console.error('Check if you have graphql/' + model + '.js', e)
        }
    },
    methods: {
        emitter(newValue, parentIndex) {
            const models = {}
            if (parentIndex !== undefined) models[this.key][parentIndex] = newValue
            else models[this.key] = newValue

            // Set parent input value if null when child input changes
            // Child must have the parent object included in the query
            if (!this.parentInput?.id && this.data[this.key]?.parent) {
                let parent = newValue?.[this.parentInput.name?.toLowerCase()]
                parent = this.data[this.key].attrs['item-text'] ? parent : parent?.id
                if (parent) models[this.parentInput.name] = parent
            }

            // Clear child input value when parent input changes
            if (this.data[this.key]?._child) models[this.data[this.key]._child] = null

            // Set all changes to :value or v-model variable
            for (const [key, value] of Object.entries(models)) this.$set(this.value, key, value)
        },
        updateSearchQuery(text) {
            if (this.data[this.key]?.queryOnDemand) {
                this.searchQuery.loading = true
                if (text === undefined) return
                clearTimeout(this.searchQuery.timeout)
                if (text) {
                    this.searchQuery.timeout = setTimeout(() => {
                        this.searchQuery.text = text
                        this.searchQuery.loading = false
                    }, 1000)
                } else {
                    this.searchQuery.text = text
                    this.searchQuery.loading = false
                }
            }
        },
    },
}
</script>
