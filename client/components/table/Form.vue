<template>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="$emit('next')">
        <v-container fluid>
            <LazyHydrate on-interaction>
                <LazyTableField
                    :fields="fields"
                    :models="models"
                    :is-parent="true"
                    @add-more="addMore($event)"
                    @remove="remove($event)"
                />
            </LazyHydrate>
        </v-container>
    </v-form>
</template>

<script>
export default {
    name: 'TableForm',
    components: {
        LazyHydrate: () => import('vue-lazy-hydration'),
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
        dataModels: {
            type: Object,
            default: null,
        },
    },
    emits: ['next'],
    data() {
        return {
            valid: false,
            lastModels: {},
        }
    },
    computed: {
        models() {
            const data = this.dataModels ?? this.data

            if (data.models && this.data.fields)
                for (const [key, v] of Object.entries(this.data.fields)) {
                    let value = data.models[key] ?? data.models[key.toLowerCase()]
                    if (this.getAddMoreName(v)?.includes('.') && data.models[key] === undefined) value = []

                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.$set(data.models, key, value)
                }
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            else if (!data.models) this.$set(data, 'models', {})

            return this.dataModels.models
        },
        fields() {
            const fields = {}
            const tempFields = {}

            for (const [key, value] of Object.entries(this.data.fields)) {
                if (value?.addMore) {
                    const addMoreKey = this.getAddMoreName(value)
                    tempFields[addMoreKey] = {
                        ...(isObject(value.addMore) && value.addMore),
                        ...tempFields[addMoreKey],
                        ...(value?.showGroup && { show: value.showGroup }),
                        count: value?.count ?? 1,
                        multi: {
                            ...tempFields[addMoreKey]?.multi,
                            [key]: value,
                        },
                    }
                    if (addMoreKey.includes('.')) {
                        const [parent, child] = addMoreKey.split('.')
                        fields[parent].multi = {
                            ...fields[parent].multi,
                            [child]: {
                                ...tempFields[addMoreKey],
                                ...(value?.count ?? { count: [1] }),
                            },
                        }
                    } else fields[addMoreKey] = tempFields[addMoreKey]
                } else fields[key] = value
            }
            return fields
        },
    },
    methods: {
        validate() {
            return this.$refs.form.validate()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
        addMore(data) {
            data.field?.onAdd?.(data)

            if (data.parentIndex !== undefined && data.parentName !== undefined) {
                this.fields[data.parentName].multi[data.model].count[data.parentIndex] += 1
            } else {
                this.fields[data.model].count += 1

                // set 1 count for each nested child
                for (const [key, value] of Object.entries(this.fields[data.model].multi))
                    if ('multi' in value) this.fields[data.model].multi[key].count[data.field.count] = 1
            }
        },
        remove(data) {
            data.field?.onRemove?.(data)
            this.addToDeleteGroupIds(data)

            const removeChild = (fields, parentIndex) => {
                for (const [key, value] of Object.entries(fields)) {
                    const model = this.models[key]?.[parentIndex] ?? this.models[key]
                    model?.splice(data.index, 1)

                    if (value?.multi) {
                        value.count.splice(data.index, 1)
                        removeChild(value.multi)
                    }
                }
            }

            const count =
                this.fields?.[data.model]?.count ??
                this.fields[data.parentName].multi[data.model].count[data.parentIndex]

            const fields =
                this.fields?.[data.model]?.multi ?? this.fields[data.parentName].multi[data.model].multi

            data.index = data.index === undefined ? count - 1 : data.index

            if (count !== 1) {
                if (data.parentIndex !== undefined && data.parentName) {
                    this.fields[data.parentName].multi[data.model].count[data.parentIndex] -= 1
                } else {
                    this.fields[data.model].count -= 1
                }

                removeChild(fields, data.parentIndex)
            }
        },
        getAddMoreName({ addMore }) {
            return addMore?.name ?? addMore
        },
        addToDeleteGroupIds(data) {
            const groupName = data.field.name?.split('.')?.at(-1) ?? data.model

            // Initialize toDeleteGroupIds
            if (!this.models?.toDeleteGroupIds) this.$set(this.models, 'toDeleteGroupIds', {})
            if (!this.models?.toDeleteGroupIds?.[groupName]) this.models.toDeleteGroupIds[groupName] = []

            for (const key of Object.keys(data.field.multi)) {
                if (this.models.groupIds && Object.keys(this.models.groupIds).includes(key)) {
                    const groupIds = this.models.groupIds[key]

                    let id = groupIds?.[data.index]?.id
                    if (data.parentIndex !== undefined) id = groupIds?.[data.parentIndex]?.[data.index]?.id

                    this.models.toDeleteGroupIds[groupName].push(id)
                    break
                }
            }
        },
    },
}
</script>
