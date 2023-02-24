<template>
    <v-menu
        :value="openMenu"
        :offset-x="isOffsetX"
        :offset-y="isOffsetY"
        :transition="transition"
        :open-on-hover="isOpenOnHover"
        :close-on-content-click="false"
        content-class="ml-1 mt-1"
    >
        <template #activator="{ on }">
            <v-btn v-if="icon" :color="color" v-on="on">
                <v-icon>{{ icon }}</v-icon>
            </v-btn>

            <v-list-item
                v-else-if="isSubMenu"
                :class="['d-flex justify-space-between'].concat(itemClass)"
                v-on="on"
            >
                <v-list-item-title :class="textClass">{{ formatText(text) }}</v-list-item-title>
                <div class="flex-grow-1" />
                <Icon name="ChevronRight" />
            </v-list-item>

            <v-btn
                v-else
                :loading="loading"
                :disabled="disabled"
                :color="companyInfo.theme.color"
                class="white--text ml-2"
                v-on="on"
                @click="openMenu = true"
            >
                {{ text }}
            </v-btn>
        </template>

        <v-list>
            <template v-for="(item, index) in items">
                <v-divider v-if="item.isDivider" :key="index" />
                <TableNestedMenu
                    v-else-if="item.items.length"
                    :key="item.text + index"
                    :text="item.text"
                    :items="item.items"
                    :item-class="item.itemClass"
                    :text-class="item.textClass"
                    :is-sub-menu="true"
                    :is-offset-x="true"
                    :is-offset-y="false"
                    :is-open-on-hover="false"
                    @click="click({ ...$event })"
                />
                <v-list-item
                    v-else
                    :key="item.text + index"
                    :disabled="item.disabled"
                    :class="[{ 'd-none': !item.show }].concat(item.itemClass)"
                    @click="click({ item, index })"
                >
                    <v-list-item-title :class="item.textClass">
                        {{ formatText(item.text) }}
                    </v-list-item-title>
                </v-list-item>
            </template>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    name: 'TableNestedMenu',
    props: {
        text: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            default: '',
        },
        items: {
            type: Array,
            required: true,
        },
        textClass: {
            type: [String, Array],
            default: '',
        },
        itemClass: {
            type: [String, Array],
            default: '',
        },
        loading: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        isOffsetY: {
            type: Boolean,
            default: true,
        },
        isSubMenu: {
            type: Boolean,
            default: false,
        },
        isOffsetX: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: 'secondary',
        },
        isOpenOnHover: {
            type: Boolean,
            default: false,
        },
        transition: {
            type: String,
            default: 'scale-transition',
        },
    },
    data: () => ({ companyInfo: useUser().companyInfo, openMenu: false }),
    methods: {
        click(data) {
            this.$emit('click', data)
            this.openMenu = false
        },
        formatText(text) {
            return text.replace(/([A-Z])/g, ' $1')
        },
    },
}
</script>
