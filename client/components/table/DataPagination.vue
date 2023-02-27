<template>
    <LazyHydrate on-interaction>
        <LazyTableDrawer>
            <v-list-item class="mt-2">
                <v-list-item-content>
                    <small class="mb-3">Search:</small>
                    <v-text-field v-model="search" dense outlined placeholder="Search" clearable>
                        <template #append>
                            <Icon name="Magnify" />
                        </template>
                    </v-text-field>
                </v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-list-group v-if="Object.keys(filters)?.length" no-action :value="true">
                <template #activator>
                    <v-list-item-content color="success">
                        <v-list-item-title>
                            <small>Filters:</small>
                        </v-list-item-title>
                    </v-list-item-content>
                </template>

                <v-list-item-content>
                    <v-row no-gutters class="pa-3">
                        <!-- eslint-disable vue/no-mutating-props-->
                        <v-col v-for="(filter, key) in filters" :key="key" class="col-12 pa-1">
                            <TableDataInput
                                v-if="!!filter.method"
                                v-model="filterModel"
                                :data="filters"
                                :data-key="key"
                                @input="$emit('filter', { [key]: $event })"
                            />
                            <TableInput
                                v-else
                                v-model="filterModel[key]"
                                :data="filter"
                                @input="$emit('filter', { [key]: $event })"
                            />
                        </v-col>
                        <!-- eslint-enable -->
                    </v-row>
                </v-list-item-content>
            </v-list-group>
        </LazyTableDrawer>
    </LazyHydrate>
    <LazyTableDataView v-if="!view || view?.type === 'data'" v-bind="parseAttrs($attrs)" />
    <LazyTableTreeView v-else-if="view?.type === 'tree'" v-bind="parseAttrs($attrs)" />
    <LazyTableGridView v-else-if="view?.type === 'grid'" v-bind="parseAttrs($attrs)" />

    <LazyHydrate when-idle>
        <!-- Modal for Excel and PDF Exporters -->
        <LazyModal :data="modal" :loading="!!$apollo.queries.items.loading" @cancel="modal.dialog = false">
            <!-- Excel Download button -->
            <v-btn color="#388E3C" class="mx-4" dark fab @click="downloadXLS()">Excel</v-btn>
            <!-- PDF Download Button -->
            <v-btn color="#D32F2F" class="mx-4" dark fab @click="downloadPdf()">PDF</v-btn>
        </LazyModal>
    </LazyHydrate>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import { removeNull, traverseValue, plural } from '~/assets/js/utils.js'

export default {
    name: 'TableDataPagination',
    components: {
        LazyHydrate: () => import('vue-lazy-hydration'),
    },
    props: {
        queries: {
            type: Object,
            required: true,
        },
        actions: {
            type: Object,
            default: () => ({}),
        },
        disableActions: {
            type: Object,
            default: () => ({}),
        },
        variables: {
            type: Object,
            default: () => ({}),
        },
        mainHeaders: {
            type: Array,
            default: () => [],
        },
        view: {
            type: Object,
            default: null,
        },
        expandedHeaders: {
            type: Array,
            default: () => [],
        },
        filters: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Prop to pass a Filter model
         * to control filters programmatically
         * in parent component
         **/
        filterModel: {
            type: Object,
            default: () => ({}),
        },
        drawerPosition: {
            type: String,
            default: 'bottom',
        },
        onDownload: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        expanded: [],
        expansionPanel: undefined,
        search: '',
        searchQuery: {
            timeout: null,
            text: '',
        },
        filterQuery: { timeout: null },
        importedQuery: null,
        items: { data: [], paginatorInfo: { total: 0 } },
        options: {
            itemsPerPage: 10,
            page: 1,
        },
        orderBy: [],
        pageChangeDelayQuery: null,
        whereConditions: {},
        withoutFilters: true,
        mBreakpoint: 0,
        downloaded: false,
        modal: {
            title: 'Download',
            dialog: false,
            positiveBtn: false,
            waitBeforeOpen: true,
        },
        excelColumns: [],
    }),
    computed: {
        transforms() {
            return this.mainHeaders.filter((item) => typeof item?.value === 'function')
        },
        filterLinks() {
            return Object.entries(this.filters).reduce((result, [key, filter]) => {
                // Assign a child property to the filter
                if (filter?.parent) Object.assign(this.filters[filter.parent], { _child: key })

                if (filter?.link) {
                    const modelKey = filter?.fieldName ?? key
                    const column =
                        filter.link.column ?? filter?.attrs?.['item-text']
                            ? modelKey.toLowerCase() + '.' + filter?.attrs?.['item-text']
                            : modelKey.toLowerCase()

                    const label = filter?.link?.label ?? ((item) => traverseValue(item, column))

                    result.push({
                        modelKey,
                        modelValue: (item) => {
                            const index = filter.attrs.items.findIndex(({ text }) => text === label(item))

                            return filter.attrs.items[index]?.value ?? label(item)
                        },
                        column,
                        color: filter.link.color ?? (() => '#BBB'),
                        label,
                    })
                }
                return result
            }, [])
        },
        results() {
            const newData = { ...this.items }
            if (this.queries.use)
                if (Array.isArray(newData.data)) {
                    newData.data = newData.data.reduce((acc, v) => {
                        return [...acc, ...v[this.queries.use]?.map((vv) => ({ ...vv, pid: v.id }))]
                    }, [])
                } else newData.data = newData[this.queries.use]?.map((v) => ({ ...v, pid: newData.id }))

            return newData.data
        },
        apolloVariables() {
            const vars = removeNull(
                Object.assign({}, this.variables, this.whereConditions, {
                    first:
                        this.downloaded ||
                        this.options.itemsPerPage < 0 ||
                        this.options.itemsPerPage === 'All'
                            ? this.items?.paginatorInfo?.total * 100
                            : this.options.itemsPerPage,
                    page: this.downloaded ? 1 : this.options.page,
                    search: this.searchQuery.text === '' ? null : this.searchQuery.text,
                    searchFallback: '%' + this.searchQuery.text + '%',
                    orderBy: this.orderBy.length ? this.orderBy : null,
                }),
            )
            this.$emit('variables', vars)
            return vars
        },
    },
    watch: {
        filterModel: {
            handler() {
                const filters = {}
                this.withoutFilters = !Object.values(this.filterModel).some((x) => x !== null && x !== '')

                if (this.withoutFilters) {
                    this.whereConditions = Object.assign({})
                } else {
                    for (const [key, filter] of Object.entries(this.filterModel)) {
                        const id = filter?.id ?? filter
                        filters[key] = id
                        filters[key + 'Condition'] = id ? { column: 'ID', value: id } : null
                        filters[key + 'ConditionExtra'] = id ? { column: 'ID', value: id } : null
                        filters[key + 'ConditionFK'] = id
                            ? { column: key.toUpperCase() + '_ID', value: id }
                            : null
                        filters[key + 'ConditionFKExtra'] = id
                            ? { column: key.toUpperCase() + '_ID', value: id }
                            : null
                        filters[key + 'ConditionField'] = id ? { column: key.toUpperCase(), value: id } : null
                        filters[key + 'ConditionFieldExtra'] = id
                            ? { column: key.toUpperCase(), value: id }
                            : null
                        filters[key + 'ConditionHasMany'] = id
                            ? {
                                  HAS: {
                                      relation: plural(key),
                                      condition: { column: 'ID', value: id },
                                  },
                              }
                            : null
                        filters[key + 'ConditionHasManyExtra'] = id
                            ? { HAS: { relation: plural(key), condition: { column: 'ID', value: id } } }
                            : null
                    }
                }
                this.options.page = 1
                this.whereConditions = filters
            },
            deep: true,
        },
        search() {
            clearTimeout(this.searchQuery.timeout)
            this.searchQuery.timeout = setTimeout(() => {
                this.searchQuery.text = this.search
                this.options.page = 1
            }, 1000)
        },
        options: {
            handler(newVal, oldVal) {
                if (!this.downloaded) {
                    const orderBy = []
                    for (const [key, field] of Object.entries(this.options?.sortBy ?? {})) {
                        orderBy.push({
                            column: field.toUpperCase(),
                            order: this.options.sortDesc[key] ? 'DESC' : 'ASC',
                        })
                    }

                    if (orderBy.length || this.orderBy.length) {
                        this.filterQuery.timeout = setTimeout(() => {
                            this.orderBy = orderBy
                        }, 250)
                    }

                    clearTimeout(this.pageChangeDelayQuery)
                    if (oldVal.groupBy)
                        this.pageChangeDelayQuery = setTimeout(() => {
                            this.pageChangeDelayQuery = null
                        }, 400)
                }
            },
            deep: true,
        },
        onDownload: {
            handler() {
                this.downloaded = this.items.paginatorInfo.total
                this.modal.dialog = true
            },
        },
    },
    async created() {
        for (const [model, value] of Object.entries(this.queries)) {
            if (model === 'expandedItems' || model === 'use') continue
            try {
                const { [value.method]: gql } = await import(`~/graphql/${model}`)
                this.importedQuery = {
                    gql,
                    scope:
                        value.scope ??
                        function (i) {
                            return i
                        },
                }
            } catch (error) {
                console.error('check dataTable method and model : ' + error)
            }
        }
    },
    mounted() {
        this.mBreakpoint = 600
        for (const [key, value] of Object.entries(this.filters))
            if (value?.attrs?.initialValue) this.$set(this.filterModel, key, value.attrs.initialValue)

        setTimeout(() => {
            this.expansionPanel = 0
            setTimeout(() => {
                this.expansionPanel = undefined
            }, 1100)
        }, 900)
    },
    methods: {
        async downloadXLS(createXLSLFormatObj = []) {
            const columns = this.mainHeaders.filter((header) => header.text !== 'Actions')
            if (columns.length === 0) return console.error('No columns defined')
            if (this.results.length === 0) return console.warn('No available data to download')
            const { utils, writeFile } = await import('xlsx/xlsx')

            createXLSLFormatObj.push(columns.map((col) => col.text))
            for (const value of this.results) {
                const innerRowData = []
                for (const column of columns) {
                    const fieldValue = traverseValue(value, column.value)
                    if (isFunction(column?.dataFormat)) innerRowData.push(column.dataFormat(fieldValue))
                    else innerRowData.push(fieldValue)
                }
                createXLSLFormatObj.push(innerRowData)
            }
            const fileName = 'msi-report-' + Math.round(+new Date() / 1000) + '.xlsx'
            const sheetName = 'Sheet 1'
            const wb = utils.book_new()
            const ws = utils.aoa_to_sheet(createXLSLFormatObj)
            utils.book_append_sheet(wb, ws, sheetName)
            writeFile(wb, fileName)
        },
        /**
         * @slot The PDF Downloader
         * Enables downloading of data to PDF files
         * @see {@link https://www.npmjs.com/package/jspdf}
         * @see {@link https://www.npmjs.com/package/jspdf-autotable}
         */
        async downloadPdf() {
            await import('jspdf-autotable')
            const { jsPDF } = await import('jspdf')
            /**
             * Paper Adjustments
             */
            const doc = jsPDF({
                orientation: 'portrait',
                unit: 'in',
                format: [12, 8.5],
            })
            /**
             * Table Organizer
             */
            doc.autoTable({
                columnStyles: { halign: 'center' },
                /**
                 * @property {Object} body data to be inserted
                 */
                body: this.results,
                /**
                 * @property {Object} columns columns to sort data in a table
                 */
                columns: Object.values(this.mainHeaders).map((obj) => {
                    return obj.text !== 'Actions'
                        ? {
                              header: obj.text,
                              dataKey: obj.value,
                          }
                        : {}
                }),
            })
            /**
             * name and type of file to be exported. uses local unix time to name the documents uniquely each download
             */
            doc.save('msi-report-' + Math.round(+new Date() / 1000) + '.pdf')
        },
        disableAction(item, value) {
            if (!value.attrs?.disabled) {
                let field = {}
                if (this.disableActions.field) {
                    for (const f of this.disableActions.field.split('.'))
                        field = Object.keys(field).length ? field[f] : item[f]
                    return this.disableActions.condition(field)
                }
            } else return value.attrs?.disabled
        },
        getDetail(item, field) {
            try {
                if (typeof field === 'string') {
                    field = field.split('.')
                    const length = field.length
                    let i
                    let property = item || this

                    for (i = 0; i < length; i++) {
                        property = property?.[field[i]]
                    }
                    return property
                } else {
                    return field(item)
                }
            } catch (e) {
                console.error('Check your header values', e)
            }
        },
        filterActions(data) {
            return Object.fromEntries(
                Object.entries(this.actions).filter(
                    ([key, val]) => val?.show === undefined || val.show(data, key),
                ),
            )
        },
        emitter(name, action, rowData) {
            this.$emit(action.event, {
                ...rowData,
                _action: name,
            })
        },
    },
    apollo: {
        items: {
            query() {
                return this.importedQuery.gql
            },
            variables() {
                return this.apolloVariables
            },
            update(data) {
                let newData = Object.values(data)[0]
                newData = this.importedQuery.scope(cloneDeep(newData), this.options)

                return Array.isArray(newData?.data)
                    ? newData
                    : { data: [newData], paginatorInfo: { total: 0 } }
            },
            watchLoading(isLoading) {
                useApp().isLoading = isLoading
            },
            skip() {
                return !this.importedQuery?.gql || this.pageChangeDelayQuery
            },
        },
    },
}
</script>
