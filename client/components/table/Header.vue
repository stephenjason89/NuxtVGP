<template>
    <div class="pa-2" :style="{ background: theme?.cardBar }">
        <div class="d-flex justify-space-between" style="height: 38px">
            <div class="d-flex">
                <div style="min-width: 38px">
                    <v-tooltip v-if="hasBackButton" bottom>
                        <template #activator="{ on, attrs }">
                            <v-btn
                                class="align-self-center"
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click="$router.go(-1)"
                            >
                                <Icon name="ArrowLeftThick" />
                            </v-btn>
                        </template>
                        <span>Go back</span>
                    </v-tooltip>
                </div>
                <span v-if="title" class="text-h5 ml-3 align-self-center">{{ title }}</span>
            </div>
            <v-spacer />
            <slot />
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: null,
    },
    hasBackButton: {
        type: Boolean,
        default: true,
    },
})

const theme = useTheme()
</script>
<script>
export default {
    name: 'TableHeader',
}
</script>
