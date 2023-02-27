<template>
    <v-data-table
        v-model:expanded="$parent.expanded"
        :headers="$parent.mainHeaders"
        :items="$parent.results"
        :options="$parent.options"
        :show-expand="!!$parent.expandedHeaders.length"
        :server-items-length="
            $parent.downloaded || $parent.queries.use ? undefined : $parent.items.paginatorInfo.total
        "
        :loading="$parent.$apollo.queries.items.loading"
        :search="$parent.search"
        :mobile-breakpoint="$parent.mBreakpoint"
        class="elevation-1 px-5"
        @update:options="$parent.options = !$parent.queries.use ? $event : $parent.options"
    >
        <template #[`item.actions`]="{ item }">
            <v-tooltip
                v-for="(value, name) in $parent.filterActions(item)"
                :key="name + item?.id"
                bottom
                :attach="true"
            >
                <template #activator="{ on, attrs }">
                    <v-btn
                        class="mr-1"
                        v-bind="Object.assign(attrs, value.attrs)"
                        :icon="!!value.icon"
                        :disabled="$parent.disableAction(item, value)"
                        :loading="!!$parent.$parent.actionLoading[value.event + item?.id + name]"
                        v-on="on"
                        @click="
                            $parent.$parent.actionStart(value.event + item?.id + name)
                            $parent.emitter(name, value, item)
                        "
                    >
                        {{ value.text }}
                        <Icon v-if="!!value.icon" v-bind="value.attrs" :name="value.icon" />
                    </v-btn>
                </template>
                <span>{{ name }}</span>
            </v-tooltip>
        </template>
        <template v-if="!!$parent.expandedHeaders.length" #expanded-item="{ headers, item }">
            <td :colspan="headers.length">
                <v-container style="max-width: 70%">
                    <v-simple-table>
                        <template #default>
                            <thead v-if="item[$parent.queries.expandedItems]?.length">
                                <tr>
                                    <th
                                        v-for="header in $parent.expandedHeaders"
                                        :key="header.value + header.text"
                                    >
                                        {{ header.text }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(i, key) in item[$parent.queries.expandedItems]"
                                    :key="$parent.queries.expandedItems + key"
                                >
                                    <td
                                        v-for="(header, key2) in $parent.expandedHeaders"
                                        :key="header.value + key + key2"
                                    >
                                        {{ $parent.getDetail(i, header.value) }}
                                    </td>
                                </tr>
                                <tr v-if="!item[$parent.queries.expandedItems]?.length">
                                    <td class="text-center" colspan="8">
                                        <i class="text-caption">No Data Available</i>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-container>
            </td>
        </template>

        <template v-for="field in $parent.transforms" #[`item.`+field.value]="{ item }">
            {{ field.value(item) }}
        </template>

        <template v-for="(link, key) in $parent.filterLinks" :key="key" #[`item.`+link.column]="{ item }">
            <v-chip
                style="min-width: 50%; justify-content: center"
                :color="link.color(item)"
                dark
                :outlined="$parent.$apollo.queries.items.loading || !$parent.filterModel[link.modelKey]"
                @click="
                    $parent.filterModel[link.modelKey]
                        ? $set($parent.filterModel, link.modelKey, null)
                        : $set($parent.filterModel, link.modelKey, link.modelValue(item))
                "
            >
                {{ link.label(item) }}
            </v-chip>
        </template>
    </v-data-table>
</template>

<script>
export default {
    name: 'TableDataView',
}
</script>
