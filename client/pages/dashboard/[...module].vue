<template>
    <div class="ma-6">
        <Header :title="activeModuleAlias" :icon="{ name: activeModule?.icon, color: activeModule?.color }" />

        <ChartGrid />

        <div v-if="activeModule?.items">
            <div class="mt-5 d-flex align-center mb-3">
                <Icon name="OpenInNew" color="blue" />
                <h2 class="text-h6 ml-3" :style="{ color: theme.fontColor }">Navigation</h2>
            </div>
            <v-row>
                <v-col v-for="link in activeModule?.items" :key="link.title" cols="12" sm="6" md="4" lg="3">
                    <NavTabLink v-bind="link" />
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script setup lang="ts">
const { links } = useModuleLinks()

const labels = useLabel()
const theme = computed(() => useTheme())

const activeModule = computed(
    () =>
        ({ ...{ color: 'blue' }, ...links[useRoute().params.module[0] ?? 'dashboard'] } ?? {
            icon: 'CloseOctagonOutline',
            color: 'red',
            title: 'Page Not Found',
        }),
)

const activeModuleAlias = computed(() => labels[activeModule.value?.title] ?? activeModule.value?.title)
</script>
<script lang="ts">
export default { name: 'Module' }
</script>
