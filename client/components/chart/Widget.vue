<template>
    <div v-bind="savedAttributes" :id="chart.title" ref="gridItemComponent" class="grid-stack-item">
        <div class="grid-stack-item-content">
            <LazyChartBase v-bind="chart" />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    chart: {
        type: Object,
        required: true,
    },
    onCancelEditing: {
        type: Boolean,
        default: false,
    },
    onEditing: {
        type: Boolean,
        default: false,
    },
})

/**
 * Current module link
 * example: dashboard, products, branch, procurement, etc....
 */
const link = useRoute().params.module[0] ?? 'dashboard'

/**
 * Ref Component for grid-stack-item
 */
const gridItemComponent: any = ref(null)

/**
 * Saved grids attribute or default attribute
 */
const savedAttributes = computed(() => ({
    'gs-w': props.chart.gsW ?? 4,
    'gs-h': props.chart.gsH ?? 2,
    'gs-min-h': props.chart.gsMinH ?? 1,
    'gs-min-w': props.chart.gsMinW ?? 1,
    ...useChartGrid().grids[link]?.[props.chart.title],
}))

/**
 * Set chart grids initial state
 */
let initialAttributes: { name: string; value: string }[] = []
watch(toRefs(props).onEditing, () => {
    if (!props.onEditing) return
    initialAttributes = Object.values(gridItemComponent.value.attributes as NamedNodeMap).flatMap(
        ({ name, value }) => (name.startsWith('gs') ? { name, value } : []),
    )
})

/**
 * Set chart grids to their previous position
 */
watch(toRefs(props).onCancelEditing, () => {
    for (const { name, value } of initialAttributes) gridItemComponent.value.setAttribute(name, value)
})
</script>
