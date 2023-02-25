<template>
    <client-only>
        <v-card class="dashboard-card-shadow fill-height" :loading="chart.loading?.value" flat outlined>
            <v-card v-show="showChartOptions" class="chart-option rounded-0" flat>
                <div class="d-flex justify-space-between pa-2">
                    <strong>Options</strong>
                    <v-btn small icon depressed class="align-self-center" @click="showChartOptions = false">
                        <Icon name="Close" width="20" />
                    </v-btn>
                </div>
                <v-divider />
                <div class="chart-option-content pa-2 mt-2">
                    <div v-for="(filter, key) in filterInputs" :key="key">
                        <TableDataInput
                            v-if="!!filter.method"
                            v-model="params.filters[key]"
                            :data="{ [key]: filter }"
                        />
                        <TableInput v-else v-model="params.filters[key]" :data="filter" />
                    </div>
                </div>
            </v-card>
            <div class="d-flex justify-space-between pa-2">
                <v-card-text class="font-weight-bold">
                    {{ title }}
                </v-card-text>

                <v-btn small icon depressed class="align-self-center" @click="showChartOptions = true">
                    <Icon name="DotsVertical" width="20" />
                </v-btn>
            </div>
            <div style="height: calc(100% - 115px)">
                <ApexChart
                    v-if="chart.options?.dataLabels"
                    v-bind="$attrs"
                    :type="type"
                    height="100%"
                    :options="chart.options"
                    :series="chart.series"
                />
            </div>

            <template v-if="!minimal">
                <v-card-actions>
                    <!-- <v-btn text small @click="showOptions = !showOptions">
                        <Icon
                            :color="themeColor"
                            :name="showOptions ? 'ChevronUp' : 'ChevronDown'"
                            class="mr-1"
                        />
                        Options
                    </v-btn>
                    <v-spacer /> -->
                    <template v-if="pagination">
                        <v-btn
                            :color="themeColor"
                            text
                            small
                            :disabled="params.page === 1 || chart.loading?.value"
                            @click="changePage('previous')"
                        >
                            Prev
                        </v-btn>
                        <v-btn
                            :color="themeColor"
                            text
                            small
                            :disabled="
                                chart.series?.value?.[0]?.data.length < params.itemsPerPage ||
                                chart.loading?.value
                            "
                            @click="changePage('next')"
                        >
                            Next
                        </v-btn>
                    </template>
                </v-card-actions>

                <!-- <v-expand-transition>
                    <div v-show="showOptions">
                        <v-card-actions class="px-5">
                            <v-row>
                                <v-col cols="12">
                                    <div v-for="(filter, key) in filterInputs" :key="key">
                                        <TableDataInput
                                            v-if="!!filter.method"
                                            v-model="params.filters[key]"
                                            :data="{ [key]: filter }"
                                        />
                                        <TableInput v-else v-model="params.filters[key]" :data="filter" />
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-actions>
                    </div>
                </v-expand-transition> -->
            </template>
        </v-card>

        <!--        <template #placeholder>-->
        <!--            <v-skeleton-loader class="mx-auto" :min-height="height" type="card" />-->
        <!--        </template>-->
    </client-only>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import ApexChart from 'vue3-apexcharts'
import { deepMerge } from '~/assets/js/utils'
import { ChartSeries } from '~/composables/useChartData'

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    query: {
        type: Object,
        default: () => ({ model: 'Order', method: 'ordersTotal' }),
    },
    data: {
        type: Object,
        default: () => ({
            multiple: { key: 'year', alias: { 2021: 'Last Year', 2022: 'Current Year' } },
            x: 'month',
            y: 'total',
        }),
    },
    type: {
        type: String,
        default: 'area',
    },
    height: {
        type: Number,
        default: 350,
    },
    options: {
        type: Object,
        default: null,
    },
    labels: {
        type: Object,
        default: () => ({ x: true, y: 'Total', data: true }),
    },
    minimal: {
        type: Boolean,
        default: false,
    },
    pagination: {
        type: Boolean,
        default: false,
    },
    variables: {
        type: Object,
        default: null,
    },
    filters: {
        type: Object,
        default: () => ({}),
    },
})

const fullYearsFunc = () => {
    const year = new Date().getFullYear()
    const years = []
    for (let i = 0; i < 10; i++) years.push(year - i)
    return years
}

const years = fullYearsFunc()

const filterInputs = computed(() => {
    return Object.keys(props.filters).length
        ? props.filters
        : { years: { type: 'select', attrs: { multiple: true, label: 'Select year', items: years } } }
})

const params: any = reactive({
    ...{
        filters: {},
        props,
        page: 1,
        itemsPerPage: 25,
    },
    ...props.variables,
})

const page: { [key: string]: any } = { timeout: null, current: params.page }
function changePage(direction: 'previous' | 'next') {
    if (direction === 'next') page.current++
    else page.current--
    clearTimeout(page.timeout)
    page.timeout = setTimeout(() => {
        params.page = page.current
    }, 400)
}
interface chartData {
    options: object
    series?: Ref<ChartSeries[]>
    loading?: Ref<Boolean>
}
const chart: chartData = reactive({ options: {} })
// const showOptions = ref<boolean>(false)
const themeColor = useUser().companyInfo.theme?.color
const theme = useTheme()

import('~/graphql/' + props.query.model).then(({ [props.query.method]: query }) => {
    if (props.data.multiple) params.filters = { ...params.filters, ...{ years: [years[0], years[1]] } }
    for (const [key, value] of Object.entries(props.filters))
        if (value?.attrs?.initialValue)
            params.filters = { ...params.filters, ...{ [key]: value.attrs.initialValue } }
    ;({ options: chart.options, series: chart.series, loading: chart.loading } = useChartData(params, query))
    if (props.options) deepMerge(chart.options, props.options)
})

watch(
    () => theme.darkMode,
    () => {
        chart.options = {
            ...deepMerge(chart.options, {
                chart: { foreColor: theme.fontColor },
                tooltip: { theme: theme.darkMode ? 'dark' : 'light' },
            }),
        }
    },
)

const showChartOptions = ref(false)
</script>

<script lang="ts">
export default defineComponent({
    inheritAttrs: false,
})
</script>

<style scoped>
.dashboard-card-shadow {
    z-index: 0;
}

.chart-option {
    height: 100%;
    width: 100%;
    position: absolute;
    background: white;
    z-index: 1;
}
</style>
