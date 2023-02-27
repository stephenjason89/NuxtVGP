<template>
    <v-row>
        <template v-for="(field, model) in fields" :key="model">
            <v-col :align-self="field?.multi ? 'auto' : 'end'" cols="12" :sm="getCols(field?.cols)">
                <v-row v-if="'multi' in field && show(field)">
                    <v-col cols="12">
                        <v-hover
                            v-for="(count, countIndex) in getFieldCount(field)"
                            v-slot="{ hover }"
                            :key="countIndex"
                        >
                            <v-row :class="getBackgroundHoverColor(hover)">
                                <v-col :cols="showRemove(field) ? 11 : 12">
                                    <LazyHydrate on-idle>
                                        <LazyTableField
                                            :index="countIndex"
                                            :fields="field.multi"
                                            :models="getModels"
                                            :parent-index="getParentIndex"
                                            @add-more="
                                                $emit('addMore', {
                                                    ...$event,
                                                    parentName: model,
                                                    parentIndex: countIndex,
                                                })
                                                $forceUpdate()
                                            "
                                            @remove="
                                                $emit('remove', {
                                                    ...$event,
                                                    parentName: model,
                                                    parentIndex: countIndex,
                                                })
                                                $forceUpdate()
                                            "
                                        />
                                    </LazyHydrate>
                                </v-col>

                                <v-col
                                    v-if="showRemove(field)"
                                    :cols="showRemove(field) ? 1 : ''"
                                    :class="[
                                        'pl-0 d-flex justify-center',
                                        {
                                            'align-center':
                                                (isParent && hasNestedChild(field)) ||
                                                Object.values(field.multi).find((f) => f?.header),
                                        },
                                    ]"
                                >
                                    <v-btn
                                        icon
                                        :class="{ white: hover }"
                                        @click="
                                            $emit('remove', { model, field, index: countIndex })
                                            $forceUpdate()
                                        "
                                    >
                                        <Icon
                                            color="red"
                                            :name="
                                                isParent && hasNestedChild(field)
                                                    ? 'Close'
                                                    : 'TrashCanOutline'
                                            "
                                        />
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-hover>
                    </v-col>

                    <!-- Bottom Add/Remove-->
                    <v-col cols="12" class="mt-n3">
                        <v-btn
                            v-if="canAddOrRemove(field, 'canAdd')"
                            :color="companyInfo.theme.color"
                            :icon="!isParent"
                            outlined
                            @click="
                                $emit('addMore', { model, field })
                                $forceUpdate()
                            "
                        >
                            <Icon v-if="!isParent" :color="companyInfo.theme.color" name="Plus" />
                            <span v-else>Add More</span>
                        </v-btn>

                        <v-btn
                            v-if="isParent && showRemove(field, index)"
                            color="red"
                            outlined
                            @click="
                                $emit('remove', { model, field, index: field.count - 1 })
                                $forceUpdate()
                            "
                        >
                            Remove
                        </v-btn>
                    </v-col>
                </v-row>

                <LazyHydrate v-if="!!field.method" on-idle>
                    <LazyTableDataInput
                        :value="getModels"
                        :data="{ [model]: field }"
                        :variables="field.variables"
                        :index="index"
                        :parent-index="parentIndex"
                    />
                </LazyHydrate>
                <LazyHydrate v-else on-idle>
                    <LazyTableInput
                        :value="parentIndex !== undefined ? getModels[model][parentIndex] : getModels[model]"
                        :data="field"
                        :index="index"
                        :parent-index="parentIndex"
                        @input="
                            parentIndex !== undefined
                                ? (getModels[model][parentIndex] = $event)
                                : (getModels[model] = $event)
                        "
                    />
                </LazyHydrate>
            </v-col>
            <template v-if="field?.emptyCols">
                <v-col
                    v-for="i in +field?.emptyCols"
                    :key="model + 'EmptyCol' + i"
                    cols="12"
                    :sm="getCols(field?.cols)"
                />
            </template>
        </template>
    </v-row>
</template>

<script>
export default {
    name: 'TableField',
    components: {
        LazyHydrate: () => import('vue-lazy-hydration'),
    },
    props: {
        fields: {
            type: Object,
            default: () => ({}),
        },
        models: {
            type: Object,
            default: () => ({}),
        },
        index: {
            type: Number,
            default: 0,
        },
        parentIndex: {
            type: Number,
            default: undefined,
        },
        isParent: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['remove', 'addMore'],
    data: () => ({
        companyInfo: useUser().companyInfo,
    }),
    computed: {
        getModels() {
            return this.models
        },
        getParentIndex() {
            return this.isParent ? undefined : this.index
        },
    },
    methods: {
        getFieldCount(field) {
            return Array.isArray(field.count) ? field.count[this.index] : field.count
        },
        getBackgroundHoverColor(hover) {
            if (hover) return ['blue-grey rounded', this.isParent ? 'lighten-5' : 'lighten-4']
        },
        getCols(cols) {
            return cols ? (isFunction(cols) ? cols() : cols) : 12
        },
        hasNestedChild(field) {
            for (const value of Object.values(field.multi)) if (value?.multi) return this.show(value)
            return false
        },
        showRemove(field) {
            return this.getFieldCount(field, this.index) > 1 && this.canAddOrRemove(field, 'canRemove')
        },
        canAddOrRemove(field, condition) {
            const { [condition]: method } = field
            return method !== undefined ? (isFunction(method) ? method(field) : method) : true
        },
        show(field) {
            const show = field?.show ?? true
            return isFunction(show)
                ? show({ field, index: this.index, parentIndex: this.getParentIndex, model: this.models })
                : show
        },
    },
}
</script>
