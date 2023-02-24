<template>
    <v-menu absolute :close-on-content-click="false">
        <template #activator="{ props }">
            <v-btn small depressed class="blue" v-bind="props">
                <Icon name="ChevronDown" color="white" size="20" />
            </v-btn>
        </template>

        <v-card width="500">
            <v-list-item>
                <Icon name="ChartBar" size="20" class="mr-3" />
                Select Chart
            </v-list-item>

            <v-divider />

            <v-list-item v-for="(chart, index) in collection.charts" :key="index">
                <v-checkbox
                    :input-value="chart.active !== false"
                    class="mr-3"
                    @change="changeChartStatus(chart)"
                />
                <v-list-item-action>
                    <v-list-item-title>{{ chart.title }} Chart</v-list-item-title>
                </v-list-item-action>
            </v-list-item>
        </v-card>
    </v-menu>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Charts, Chart } from '~/composables/useChart'

const Props = defineProps({
    collection: {
        type: Object as PropType<Charts>,
        default: () => ({}),
    },
})

/**
 * Function for changing chart status (active)
 */
function changeChartStatus(chart: Chart) {
    chart.active = !(chart?.active ?? true)

    // eslint-disable-next-line vue/no-mutating-props
    Props.collection.charts = [...Props.collection.charts]
}
</script>
