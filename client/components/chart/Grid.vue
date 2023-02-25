<template>
    <div v-if="activeCollection?.charts" class="pa-3">
        <div class="d-flex align-center mb-3">
            <template v-if="onEdit">
                <v-btn-toggle dense>
                    <ChartMenu :collection="activeCollection" />

                    <v-btn small depressed class="light-green darken-1 white--text" @click="saveGrids">
                        <Icon name="ContentSaveCheck" color="white" size="20" />
                    </v-btn>
                </v-btn-toggle>

                <v-spacer />

                <v-btn icon depressed @click="cancelEditing">
                    <Icon name="Close" size="20" />
                </v-btn>
            </template>

            <template v-else>
                <Icon color="blue" name="ChartBar" />
                <h2 class="text-h6 ml-3 secondary--text chart-title">{{ activeCollection?.title }}</h2>

                <v-spacer />

                <v-btn depressed icon @click="toggleEditing">
                    <Icon name="Drag" size="20" />
                </v-btn>
            </template>
        </div>

        <div :style="onEdit === true ? 'border: .5px dotted black' : ''">
            <div class="grid-stack">
                <template v-for="(chart, index) in activeCollection?.charts">
                    <ChartWidget
                        v-if="chart.active !== false"
                        :key="index + link"
                        :chart="chart"
                        :on-cancel-editing="onCancelEditing"
                        :on-editing="onEdit"
                        :style="onEdit === true ? 'cursor: grabbing' : ''"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import 'gridstack/dist/gridstack.min.css'
import cloneDeep from 'lodash.clonedeep'
import { Charts } from '~/composables/useChart'

type ChartCollection = {
    [name: string]: Charts
}

/**
 * Available charts from useChart composable
 */
const availableCharts = useChart()

/**
 * Charts available for modules
 */
const chartCollections = reactive<ChartCollection>({
    dashboard: {
        title: 'Dashboard Charts',
        charts: [
            { ...availableCharts.salesPerformance, gsW: 12, gsH: 1 },
            { ...availableCharts.inventory },
            { ...availableCharts.products },
            { ...availableCharts.branch, active: false },
            { ...availableCharts.procurement, active: false },
            { ...availableCharts.client, active: false },
            { ...availableCharts.quota, active: false },
        ],
    },
    procurement: {
        title: 'Procurement Charts',
        charts: [
            { ...availableCharts.salesPerformance },
            { ...availableCharts.inventory },
            { ...availableCharts.products },
            { ...availableCharts.branch },
            { ...availableCharts.procurement },
            { ...availableCharts.client },
        ],
    },
    inventories: {
        title: 'Inventories Charts',
        charts: [
            { ...availableCharts.salesPerformance },
            { ...availableCharts.inventory },
            { ...availableCharts.products },
            { ...availableCharts.branch },
            { ...availableCharts.procurement },
            { ...availableCharts.client },
        ],
    },
    products: {
        title: 'Dashboard Charts',
        charts: [
            { ...availableCharts.salesPerformance },
            { ...availableCharts.inventory },
            { ...availableCharts.products },
            { ...availableCharts.branch },
            { ...availableCharts.procurement },
            { ...availableCharts.client },
        ],
    },
    branch: {
        title: 'Branch Charts',
        charts: [
            { ...availableCharts.salesPerformance },
            { ...availableCharts.inventory },
            { ...availableCharts.products },
            { ...availableCharts.branch },
            { ...availableCharts.procurement },
            { ...availableCharts.client },
        ],
    },
    client: {
        title: 'Client Charts',
        charts: [
            { ...availableCharts.salesPerformance },
            { ...availableCharts.inventory },
            { ...availableCharts.products },
            { ...availableCharts.branch },
            { ...availableCharts.procurement },
            { ...availableCharts.client },
        ],
    },
    users: {
        title: 'Users Charts',
        charts: [
            { ...availableCharts.salesPerformance },
            { ...availableCharts.inventory },
            { ...availableCharts.products },
            { ...availableCharts.branch },
            { ...availableCharts.procurement },
            { ...availableCharts.client },
        ],
    },

    orders: {
        title: 'Orders Charts',
        charts: [
            { ...availableCharts.salesPerformance },
            { ...availableCharts.inventory },
            { ...availableCharts.products },
        ],
    },

    sales: {
        title: 'Sales Charts',
        charts: [
            { ...availableCharts.salesPerformance },
            { ...availableCharts.inventory },
            { ...availableCharts.products },
        ],
    },
})

/**
 * Current module link
 * example: dashboard, products, branch, procurement, etc....
 */
const link = (useRoute().params.module as string) ?? 'dashboard'

/**
 * Use saved active state
 */
const savedCharts = useChartGrid().grids?.[link]
for (const chart of chartCollections[link]?.charts ?? [])
    if (savedCharts?.[chart.title]) chart.active = useChartGrid().grids?.[link]?.[chart.title]?.active

/**
 * ex. chartCollections['dashboard'], chartCollections['branch'], chartCollections['products']
 */
const activeCollection = computed<Charts>(() => chartCollections?.[link] ?? {})
let activeCollectionInitialState: Charts
const onEdit = ref(false)

let grid: any

/**
 * Options parameters for GridStack.init()
 */
const gridOptions = reactive({
    cellHeight: 240,
    styleInHead: true,
    margin: '2.5px',
})

onDeactivated(() => {
    cancelEditing()
})

/**
 * Function to enable moving and resizing charts
 */
function toggleEditing() {
    onEdit.value = !onEdit.value
    if (onEdit.value) activeCollectionInitialState = cloneDeep(activeCollection.value)
}

function cancelEditing() {
    if (!onEdit.value) return
    toggleEditing()
    onCancelEditing.value = !onCancelEditing.value
    chartCollections[link] = activeCollectionInitialState
}
/**
 * Function for cancel editing chart grids
 */
const onCancelEditing = ref(false)

/**
 * Function for saving charts grids [gs-x, gs-y, gs-w, gs-h, gs-max-w, gs-min-w, gs-max-h]
 */
function saveGrids() {
    toggleEditing()
    useChartGrid().$patch({
        grids: {
            [link]: grid.engine.nodes.reduce((acc: any, v: any) => {
                acc[v.el.id] = {
                    'gs-x': v.x,
                    'gs-y': v.y,
                    'gs-w': v.w,
                    'gs-h': v.h,
                    active:
                        activeCollection.value?.charts?.find((c) => c.title === v.el.id)?.active !== false,
                }
                return acc
            }, {}),
        },
    })

    useToast().success({
        title: 'Success',
        message: 'Charts saved',
    })
}

/**
 * Reinitialize grid everytime charts are activated/deactivated
 */
watch(
    [activeCollection, onEdit],
    () => {
        grid?.destroy(false)
        nextTick(async () => {
            if (!activeCollection.value?.charts || process.server) return
            const { GridStack } = await import('gridstack')
            grid = GridStack.init({
                ...gridOptions,
                disableResize: !onEdit.value,
                disableDrag: !onEdit.value,
            })
        })
    },
    { deep: true, immediate: true },
)
</script>
