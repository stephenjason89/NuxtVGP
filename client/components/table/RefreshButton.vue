<template>
    <v-tooltip bottom>
        <template #activator="{ on, attrs }">
            <v-btn color="blue lighten-2" v-bind="attrs" icon @click="refresh" v-on="on">
                <Icon
                    color="blue lighten-2"
                    name="Refresh"
                    :style="{ transform: 'rotate(' + turn + 'deg)', transition: '.5s ease-in' }"
                    size="22"
                />
            </v-btn>
        </template>
        <span>Refresh</span>
    </v-tooltip>
</template>

<script>
import Vue from 'vue'
export default {
    name: 'TableRefreshButton',
    props: {
        query: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        turn: 0,
    }),
    mounted() {
        this.attachListener()
    },
    activated() {
        this.attachListener()
    },
    deactivated() {
        Vue.prototype.$eventBus.$off('refresh')
    },
    methods: {
        refresh() {
            this.turn = this.turn + 360
            this.query?.refetch()
        },
        attachListener() {
            Vue.prototype.$eventBus.$on('refresh', () => {
                this.refresh()
            })
        },
    },
}
</script>
