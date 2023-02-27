<template>
    <v-container class="my-5 px-10">
        <div style="min-height: 10px">
            <v-row class="mt-1 justify-center">
                <v-col
                    v-for="(data, i) in $parent.results"
                    v-bind="$parent.attrs"
                    :key="i"
                    align-self="end"
                    cols="4"
                >
                    <component
                        :is="$parent.view.component"
                        v-if="$parent.view.component"
                        :data="data"
                        v-bind="parseAttrs($attrs)"
                        @selectedCategory="$parent.category = $event"
                    />
                    <v-card
                        v-else
                        height="150"
                        style="cursor: pointer; color: #919191; border: 1px solid #00c853"
                        class="d-flex justify-center align-content-center"
                        @click="$emit(emitEvent, data)"
                    >
                        <h6 class="align-self-center">{{ data.name }}</h6>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <v-row justify="space-between">
            <v-col md="4">
                <v-container class="max-width">
                    <v-select
                        v-model="$parent.options.itemsPerPage"
                        :items="[5, 10, 20, 50, 100]"
                        hint="Item Per Page"
                        persistent-hint
                        class="w-20"
                        @change="$parent.options.page = 1"
                    />
                </v-container>
            </v-col>
            <v-col md="4">
                <v-pagination
                    v-model="$parent.options.page"
                    class="mt-8"
                    :length="$parent.items.paginatorInfo.lastPage"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'TableGridView',
    computed: {
        emitEvent() {
            return this.$parent.view.event ?? '_READ'
        },
    },
}
</script>
