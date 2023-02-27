<template>
    <v-card-title>
        <span class="headline">Summary</span>
    </v-card-title>
    <v-divider />
    <v-card-text>
        <!-- {{ fields }} -->
        <v-row v-for="(field, model) in fields" :key="data.title + model">
            <v-col cols="3">
                <div v-if="showHeader(field, model)">
                    {{ getHeader(field, model) }}
                </div>
            </v-col>
            <v-col cols="3" />
            <v-col :class="getTextColor(field, model)">
                <div v-if="!hasAddMore(field)">
                    {{ getValue(field, model, data.models[model]) }}
                </div>

                <div v-else-if="isAddMoreGroupHeader(field, model)" class="ml-n4">
                    <div v-if="!hasItems(field)" class="ml-4">N/A</div>

                    <TableSimple v-else :data="getAddMoreTable(field)" />
                </div>
            </v-col>
        </v-row>
    </v-card-text>
</template>

<script>
import { convertDateTime } from '~/assets/js/utils'

export default {
    name: 'TableConfirmation',
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    computed: {
        fields() {
            const fields = {}
            for (const [model, field] of Object.entries(this.data.fields)) {
                if (field.type === 'removeItem') continue
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.$set(fields, model, field)
            }

            return {
                ...fields,
                ...Object.values(this.data.tabs ?? {})?.reduce((acc, v) => {
                    return { ...acc, ...v?.fields }
                }, {}),
                ...Object.keys(this.data?.stepper ?? {})?.reduce((acc, v) => {
                    return { ...acc, ...this.data?.stepper[v]?.fields }
                }, {}),
            }
        },
        addMoreGroup() {
            const addMore = {}
            for (const [key, value] of Object.entries(this.data.fields)) {
                const name = this.getAddMoreName(value)

                if (isString(name))
                    if (addMore[name]) addMore[name].push(key)
                    else addMore[name] = [key]
            }
            return addMore
        },
    },
    methods: {
        getValue(field, model, value) {
            const itemText = field?.attrs?.['item-text'] ?? null
            const isCurrency = /amount|price|cost/.test(model.toLowerCase()) && value !== '' && value !== null
            const isDate =
                /created_at|effective_at|date/.test(model.toLowerCase()) ||
                field.attrs?.type === 'date' ||
                field.attrs?.type === 'datetime-local'
            const isBlank = isString(value)
                ? value?.trim() === ''
                : value === null || value === undefined || isNaN(value)

            return Array.isArray(value)
                ? this.joinLists(field, model, value, itemText)
                : isObject(value)
                ? this.getValue(field, model, value[itemText])
                : isCurrency
                ? parseFloat(value).toFixed(2)
                : isDate
                ? convertDateTime(value, false)
                : isBlank
                ? 'N/A'
                : this.getValueFromItems(field, model, value, itemText)
        },
        getValueFromItems(field, model, value, itemText) {
            const items = field.attrs?.items ?? field.items ?? []
            let itemValue = field?.attrs?.['item-value'] ?? 'id'
            if (!itemText && items.length > 0) [itemText, itemValue] = ['text', 'value']
            const item = items.find((i) => i[itemValue] === value)
            return item ? item[itemText] : value
        },
        joinLists(field, model, value, itemText) {
            return value
                .map((v) => {
                    return this.getValue(field, model, v?.[itemText] ?? v)
                })
                .join(', ')
        },
        // methods return class text color
        getTextColor(field, model) {
            let color = ''
            // condition if the value is to be created
            if (
                field.type === 'comboBox' &&
                typeof this.data.models[model] !== 'object' &&
                this.data.models[model]
            )
                color = 'green--text'

            return color
        },
        getAddMoreTable(field) {
            const table = {}

            for (const [key, names] of Object.entries(this.addMoreGroup)) {
                const items = []
                const headers = []

                for (const name of names) {
                    if (this.data.models[name]?.length) {
                        for (const [index, value] of Object.entries(this.data.models[name])) {
                            items[index] = {
                                ...items[index],
                                [name]: this.getValue(this.fields?.[name], name, value),
                            }
                        }

                        headers.push({
                            text: this.fields?.[name]?.attrs?.label ?? name,
                            value: name,
                        })
                    }
                }

                table[key] = { items, headers }
            }

            return table?.[this.getAddMoreName(field)] ?? {}
        },
        getAddMoreName({ fieldGroup, addMore }) {
            let name = fieldGroup ?? addMore?.name ?? addMore
            if (name && name.includes('.')) name = name.split('.')[0]

            return name
        },
        hasAddMore(field) {
            return field?.addMore
        },
        isAddMoreGroupHeader(field, model) {
            return (
                this.addMoreGroup[this.getAddMoreName(field)].indexOf(model) === 0 &&
                this.getAddMoreTable(field).items.length
            )
        },
        showHeader(field, model) {
            return !this.hasAddMore(field) || this.isAddMoreGroupHeader(field, model)
        },
        getHeader(field, model) {
            return this.hasAddMore(field) && this.isAddMoreGroupHeader(field, model)
                ? field.header
                : field.attrs?.label
        },
        hasItems(field) {
            return this.getAddMoreTable(field)?.items?.length
        },
    },
}
</script>
