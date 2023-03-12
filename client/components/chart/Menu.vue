<template>
    <v-menu :close-on-content-click="false" absolute>
        <template #activator="{ props }">
            <v-btn class="bg-blue-darken-1" icon size="x-small" v-bind="props" variant="flat">
                <Icon color="white" name="ChevronDown" size="20" />
            </v-btn>
        </template>

        <v-card width="450">
            <v-list lines="two" select-strategy="classic">
                <v-list-subheader class="font-weight-bold">Select Chart</v-list-subheader>

                <v-divider></v-divider>

                <v-list-item
                    v-for="(chart, index) in collection.charts"
                    :key="index"
                    :subtitle="chart.description"
                    :title="chart.title"
                    value="notifications"
                >
                    <template #prepend="{ isActive }">
                        <v-list-item-action start>
                            <v-checkbox-btn
                                :input-value="chart.active !== false"
                                :model-value="isActive"
                                @change="changeChartStatus(chart)"
                            ></v-checkbox-btn>
                        </v-list-item-action>
                    </template>

                    <v-list-item-subtitle>
                        This is a sample Chart Description: Lorem ipsum dolor sit amet, consectetur
                        adipisicing elit. Architecto asperiores facilis illo iste maiores minus nisi, voluptas
                    </v-list-item-subtitle>
                </v-list-item>
            </v-list>
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
