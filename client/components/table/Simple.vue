<template>
    <v-table
        :class="data?.theme"
        :style="{
            backgroundColor: data?.color ? 'rgba(0, 0, 0, 0.1)' : '',
            textAlign: data?.textAlign,
        }"
    >
        <thead v-if="Data.length">
            <tr>
                <th
                    v-for="({ text }, i) in Headers"
                    :key="i"
                    :style="{
                        width: data.headers[i].width + '%',
                        border: data?.border?.toggle
                            ? '1px ' + data?.border?.lineStyle + ' ' + data?.color
                            : '0px',
                        color: data?.theme === 'fancy' ? 'white' : '',
                        fontSize: data?.fontSize * 0.75 + 'px',
                        textAlign: data?.textAlign,
                    }"
                >
                    <p v-show="i !== 0">{{ text }}</p>
                </th>
            </tr>
        </thead>

        <tbody v-if="Data.length">
            <tr v-for="(rowData, index) in Data" :key="index">
                <!-- eslint-disable vue/no-v-html -->
                <td
                    v-for="({ value }, i) in Headers"
                    :key="i"
                    :data-label="Headers[i].text"
                    :style="{
                        height: data?.rows?.height + 'px',
                        border: data?.border?.toggle
                            ? '1px ' + data?.border?.lineStyle + ' ' + data?.color
                            : '0px',
                        fontSize: data?.fontSize + 'px',
                        textAlign: data?.textAlign,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }"
                    v-html="toHumanReadable(traverseValue(rowData, value))"
                />
            </tr>
        </tbody>
        <tbody v-else>
            <tr>
                <td class="text-center" colspan="8">
                    <i class="text-caption">No Data Available</i>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>
<script>
import { traverseValue } from '~/assets/js/utils'

export default {
    name: 'TableSimple',
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
        items: {
            type: [Object, Array],
            default: null,
        },
        headers: {
            type: Array,
            default: () => [],
        },
    },
    data: () => ({ traverseValue }),
    computed: {
        Headers() {
            return [...this.headers, ...(this.data.headers ?? [])]
        },
        Data() {
            let hasList
            let data =
                Array.isArray(this.items) || Array.isArray(this.data.items)
                    ? [...(this.items ?? []), ...(this.data.items ?? [])]
                    : null
            data = data ?? Object.assign({}, this.items ?? {}, this.data.items ?? {})

            if (!Array.isArray(data)) {
                const potentialList = this.Headers.filter((header) => header.value.includes('.'))
                for (const { value } of potentialList) {
                    hasList = traverseValue(data, value) === undefined ? value : false
                    if (hasList) break
                }

                if (hasList) {
                    const listPropertyName = hasList.replace(/\..+/g, '')
                    data = data[listPropertyName]?.map((item) => ({
                        ...data,
                        [listPropertyName]: { ...item },
                    }))
                } else data = [data]
            }
            return data
        },
    },
    methods: {
        toHumanReadable(data) {
            if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
                let newData = ''
                for (const [key, value] of Object.entries(data)) {
                    newData += `<small>${key}: ${value}</small><br>`
                }
                data = newData.slice(0, -4)
            }
            return data
        },

        // TODO: can render image
    },
}
</script>

<style scoped>
table tr {
    border-bottom: 1px solid #ddd;
    padding: 1.1em 0.3em 0;
}

/* Print component themes */

.fancy {
    font-family: Arial, Helvetica, sans-serif;
    border: 1px v-bind('data?.border?.lineStyle') v-bind('data?.color');
    width: 100%;
}

.fancy tr:nth-child(even) {
    background-color: #f2f2f2;
}

.fancy th {
    background-color: v-bind('data?.color');
    color: white;
}

.basic {
    border: 1px v-bind('data?.border?.lineStyle') v-bind('data?.color');
    width: 100%;
}

.basic tr:nth-child(even) {
    background-color: #f2f2f2;
}

.basic th {
    color: black;
}

@media screen and (max-width: 600px) {
    table thead {
        border: none;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
    }

    table tr {
        display: block;
    }

    table td {
        border-bottom: 0 !important;
        display: block;
        text-align: right;
    }

    table td::before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        text-transform: uppercase;
    }
}
</style>
