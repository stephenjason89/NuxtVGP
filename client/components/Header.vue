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
        to: `/dashboard`,
        exact: true,
    },
])

const theme = useTheme()

const route = useRoute()
const texts = route.fullPath.split('/')
for (let i = 0; i < texts.length; i++) {
    if (texts[i] === '') continue
    items.value.push({
        title: texts[i]?.charAt(0)?.toUpperCase() + texts[i].slice(1),
        to: i === 1 ? (texts[i] !== 'dashboard' ? `/dashboard/${texts[i]}` : '/dashboard/') : texts[i],
        disabled: texts.length - 1 === i,
    })
}
</script>
