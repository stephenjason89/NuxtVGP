<template>
    <v-app>
        <Sidebar />
        <v-app-bar :color="theme.appBar" class="v-bar--underline" height="70" flat app>
            <v-btn icon class="ml-3" @click="app.sidebar.drawer.local = !app.sidebar.drawer.local">
                <Icon :name="app.sidebar.drawer.local ? 'PagePreviousOutline' : 'PageNextOutline'" />
            </v-btn>
            <v-btn icon class="ml-3">
                <v-badge color="red" overlap>
                    <template #badge>
                        <span>5</span>
                    </template>

                    <Icon name="Bell" />
                </v-badge>
            </v-btn>

            <v-spacer />

            <div @mouseover="profileView = true" @mouseleave="profileView = false">
                <client-only>
                    <v-btn :color="theme?.profileFontColor" ripple text>
                        {{ user.name }}
                    </v-btn>
                </client-only>
                <!--                <transition name="slide-fade">-->
                <!--                    &lt;!&ndash;                    <ProfileEdit v-if="profileView" />&ndash;&gt;-->
                <!--                </transition>-->
                <v-avatar class="mr-3">
                    <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
                </v-avatar>
            </div>
        </v-app-bar>
        <v-fade-transition leave-absolute>
            <div v-if="isExtraSpaceAdded" style="height: 70px" />
        </v-fade-transition>
        <v-main class="min-h-screen" :class="theme?.body">
            <slot />
        </v-main>
    </v-app>
</template>
<script>
import { labels } from '~/graphql/Label'
export default {
    name: 'DefaultLayout',
    data: () => ({
        theme: useTheme(),
        drawer: false,
        profileView: false,
        extraHeight: 0,
        app: useApp(),
        isExtraSpaceAdded: true,
    }),
    computed: {
        user() {
            return useAuth().user
        },
    },
    created() {
        this.$vuetify.theme.dark = this.theme.darkMode
    },
    mounted() {
        this.isExtraSpaceAdded = false
    },
    apollo: {
        labels: {
            query: labels,
            result({ data }) {
                useLabel().updateLabels(data?.labels ?? [])
            },
        },
    },
}
</script>
