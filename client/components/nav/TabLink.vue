<template>
    <v-card class="pa-2" :color="theme?.cardColor">
        <v-card-title class="pb-0">
            <slot name="icon" :color="theme?.cardColor" :icon-name="icon">
                <Icon size="35" :color="color" :name="icon" class="mr-3" />
            </slot>
            <span v-show="count" class="font-weight-bold mr-2">{{ count }}</span>
            {{ labels[title] ?? title }}
        </v-card-title>

        <v-card-actions class="pb-0">
            <v-btn :to="to" :color="color" class="ml-auto" text small nuxt>
                <span id="gotoNameId" class="card-name">
                    {{ gotoName }}
                </span>
                <slot name="actionIcon" :color="color" :icon-name="icon">
                    <Icon size="18" :color="color" name="ArrowRight" class="ml-2" />
                </slot>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'NavTabLink',
    props: {
        title: {
            type: String,
            required: true,
        },

        color: {
            type: String,
            default: 'primary',
        },

        icon: {
            type: String,
            required: false,
            default: '',
        },

        to: {
            type: [String, Object],
            required: true,
        },

        count: {
            type: [String, Number],
            required: false,
            default: null,
        },

        actionText: {
            type: String,
            required: false,
            default: null,
        },
    },
    data: () => ({
        labels: useLabel(),
        theme: useTheme(),
        data: null,
        cardNameWidth: '100%',
    }),
    computed: {
        gotoName() {
            return this.actionText ?? `Go to ${this.labels[this.title] ?? this.title}`
        },
    },
}
</script>

<style scoped>
@media (max-width: 575px) {
    .card-name {
        font-size: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 300px;
    }
}

/* Small devices (landscape phones, 576px and up)  */
@media (min-width: 576px) and (max-width: 767px) {
    .card-name {
        font-size: 12px;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 210px;
    }
}

/* Medium devices (tablets, 768px and up)  */

@media (min-width: 962px) and (max-width: 1034px) {
    .card-name {
        font-size: 12px;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 210px;
    }
}

/* Large devices (desktops, 992px and up)  */

/* @media (min-width: 992px) and (max-width: 1199px) {
} */

/* Extra large devices (large desktops, 1200px and up)  */

@media (min-width: 1258px) {
    .card-name {
        white-space: nowrap;
        font-size: 12px;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 200px;
    }
}

@media (min-width: 1372px) {
    .card-name {
        max-width: 100%;
    }
}
</style>
