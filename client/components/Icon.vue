<template>
    <img v-bind="$attrs" :style="'filter:' + fill" :width="width" :src="src" :alt="name" />
</template>
<script>
import { hexToCSSFilter } from 'hex-to-css-filter'
import colors from 'vuetify/lib/util/colors'
export default {
    name: 'Icon',
    props: {
        name: {
            default: '',
            type: String,
        },
        size: {
            type: [Number, String],
            default: null,
        },
        color: {
            type: String,
            default: null,
        },
    },
    data: () => ({
        icon: null,
    }),

    computed: {
        width() {
            return this.size ?? this.$attrs.width ?? 28
        },
        src() {
            return '/icons/' + kebabize(this.name ?? '') + '.svg'
        },
        fill() {
            let cssFilter
            const defaultColor = this.$vuetify.theme.dark ? '#FFF' : '#000'
            let [color, modifier] = (this.color || defaultColor).replace(/'/g, '').toLowerCase().split(' ')
            color = color.replace(/-./g, (x) => x[1].toUpperCase())
            modifier = (modifier ?? 'base').replace('-', '')
            if (color === 'white') color = '#FFF'
            if (color.charAt(0) === '#') cssFilter = hexToCSSFilter(color)?.filter
            else cssFilter = hexToCSSFilter(colors[color]?.[modifier] || defaultColor)?.filter
            return cssFilter
        },
    },
}
</script>
