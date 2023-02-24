import { useQuery } from '@vue/apollo-composable'
import { DocumentParameter } from '@vue/apollo-composable/dist/useQuery'
import { numberFormatPeso } from '~/assets/js/utils'

export type ChartSeries = { data: number[]; name: string }
export type Variables = {
    filters: { years?: number[]; effective_at?: number }
    props: {
        query: { model: string; method: string }
        multiple: string
        minimal: boolean
        // fontColor: string
        labels: {
            x: undefined | boolean
            y: string | boolean | undefined
            data: boolean | undefined
        }
        data: {
            multiple: { key: string; alias: { [name: string]: string } }
            x: string
            y: string
        }
    }
}

export default function useChartData(vars: Variables, query: DocumentParameter<any>) {
    const theme = useTheme()
    /**
     * apexcharts options
     */
    const options = {
        chart: {
            foreColor: theme.fontColor,
            toolbar: {
                tools: {
                    download: false,
                    pan: false,
                },
            },
        },
        xaxis: {
            labels: {
                show: !vars.props.minimal && vars.props.labels.x !== false,
            },
            type: 'category',
        },
        yaxis: {
            show: !vars.props.minimal && vars.props.labels.y !== false,
            title: { text: vars.props.labels.y },
            type: 'numeric',
            labels: {
                formatter: (val: any) => numberFormatPeso(val, { notation: 'compact' }),
            },
        },
        annotations: {
            xaxis: [
                {
                    x: new Date().toLocaleString('default', { month: 'short' }),
                    strokeDashArray: 0,
                    borderColor: '#2E93fA',
                    label: {
                        borderColor: '#2E93fA',
                        style: {
                            color: '#fff',
                            background: '#2E93fA',
                        },
                        orientation: 'horizontal',
                        text: 'Current',
                    },
                },
            ],
        },
        grid: {
            show: false,
        },
        dataLabels: {
            orientation: 'vertical',
            enabled: !vars.props.minimal && vars.props.labels.data !== false,
            formatter: (val: any) => (val ? numberFormatPeso(val) : ''),
        },
        tooltip: {
            y: {
                formatter: (y: any) => numberFormatPeso(Number(y)),
            },
            theme: theme.darkMode ? 'dark' : 'light',
        },
        colors: ['#43A047', '#546E7A'],
        stroke: {
            width: 3,
            curve: 'smooth',
            dashArray: 0,
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    orientation: 'vertical',
                    position: 'center', // bottom/center/top
                },
            },
        },
        fill: {
            colors: undefined,
            opacity: 0.9,
            type: 'solid',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 100],
                colorStops: [],
            },
            image: {
                src: [],
                width: undefined,
                height: undefined,
            },
            pattern: {
                style: 'verticalLines',
                width: 6,
                height: 6,
                strokeWidth: 2,
            },
        },
    }

    /**
     * chart gql data
     */
    const { result, loading } = useQuery(query, vars, { prefetch: false })

    /**
     * update chart data. format gql response to apexchart options and series
     */
    const series = ref<ChartSeries[]>([])

    watch(
        result,
        () => {
            const value = <[]>Object.values(result.value ?? {})?.[0]
            if (value?.length) {
                const newData = value.reduce(
                    (acc: any, cur: any) => {
                        const x = cur[vars.props.data.x]
                        const y = cur[vars.props.data.y]

                        if (vars.props.data.multiple?.key) {
                            const multiple = cur[vars.props.data.multiple.key]
                            if (!acc[multiple]) acc[multiple] = newMonthsArray()
                            if (cur[vars.props.data.x]) acc[multiple][x - 1].y = y
                        } else acc.push({ x, y })

                        return acc
                    },
                    vars.props.data.multiple?.key ? ({} as { [year: string]: number[] }) : ([] as any),
                )

                series.value = []

                if (vars.props.data.multiple) {
                    for (const [key, data] of <[string, any][]>Object.entries(newData)) {
                        series.value.push({
                            name: vars.props.data.multiple?.alias?.[key] ?? key,
                            data: data ?? newMonthsArray(),
                        })
                    }
                } else
                    series.value.push({
                        name: 'Data',
                        data: newData,
                    })
            }
        },
        { immediate: true },
    )

    return {
        options,
        series,
        loading,
    }
}

function newMonthsArray() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return Array.from(Array(12).keys(), (m) => ({ x: months[m], y: 0 }))
}
