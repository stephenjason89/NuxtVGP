<template>
    <v-card elevation="2">
        <v-treeview activatable hoverable :items="$parent.results">
            <template #label="{ item }">
                <v-row class="pa-2">
                    <v-col>
                        <div style="display: flex" class="content mt-2">
                            <div v-if="$parent.view.attrs?.icon" class="mr-2">
                                <Icon
                                    :name="
                                        typeof $parent.view.attrs?.icon == 'object'
                                            ? $parent.view.attrs.icon.name
                                            : $parent.view.attrs?.icon
                                    "
                                    :size="$parent.view.attrs?.icon?.size ?? 23"
                                    :color="$parent.view.attrs?.icon?.color ?? $parent.view.attrs?.color"
                                />
                            </div>
                            <div>
                                <span :style="'color:' + $parent.view.attrs?.color">
                                    {{ $parent.getDetail(item, $parent.view?.value ?? 'name') }}
                                </span>
                            </div>
                        </div>
                    </v-col>
                    <v-col>
                        <div style="text-align: right">
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
                                        :loading="
                                            !!$parent.$parent.actionLoading[value.event + item?.id + name]
                                        "
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
                        </div>
                    </v-col>
                </v-row>
            </template>
        </v-treeview>
    </v-card>
</template>

<script>
export default {
    name: 'TableTreeView',
}
</script>
