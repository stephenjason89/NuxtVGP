<template>
    <div class="d-flex align-center">
        <Icon v-if="icon" :name="icon.name" :color="icon.color" />
        <h1
            v-if="title"
            class="ml-2 text-h4 font-weight-medium secondary--text"
            :style="{ color: theme?.fontColor + ' !important' }"
        >
            {{ title }}
        </h1>
    </div>
    <v-breadcrumbs v-if="hasBreadcrumbs" class="py-1 px-0 mb-5" :items="items" divider=">" />
</template>

<script lang="ts" setup>
defineProps({
    title: {
        type: String,
        default: null,
    },
    icon: {
        type: Object,
        default: null,
    },
    hasBreadcrumbs: {
        type: Boolean,
        default: true,
    },
})

type Link = {
    title: string
    to: string
    exact?: boolean
    disabled?: boolean
}
const items = ref<Link[]>([
    {
        title: 'Home',
        to: `/dashboard/`,
        exact: true,
    },
])

const theme = useTheme()

const route = useRoute()
const texts = route.fullPath.split('/').filter(Boolean)
for (const [i, text] of texts.entries()) {
    items.value.push({
        title: text?.charAt(0)?.toUpperCase() + text.slice(1),
        to: text !== 'dashboard' ? `/dashboard/${text}` : '/dashboard/',
        disabled: texts.length - 1 === i,
    })
}
</script>
