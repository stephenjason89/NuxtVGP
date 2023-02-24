<template>
    <v-navigation-drawer
        v-model="app.sidebar.drawer.local"
        color="#424242"
        theme="dark"
        image="/img/nav-bg.jpg"
        width="260"
        mini-variant-width="80"
        app
        :temporary="!app.sidebar.pinned"
        touchless
    >
        <v-list-item title="Apollo" subtitle="Systems" prepend-avatar="/img/msi-logo.png">
            <template #append>
                <v-btn link text size="small" outlined @click="pin">
                    <Icon
                        class="v-icon--link"
                        size="15"
                        :name="app.sidebar.pinned ? 'PinOff' : 'Pin'"
                        color="#ccc"
                    />
                </v-btn>
            </template>
        </v-list-item>
        <v-divider />
        <v-list expand nav>
            <!-- Items -->
            <v-list-item
                v-for="(link, i) in links"
                :key="i"
                :to="link.to"
                exact
                :color="companyInfo.theme.color"
                class="py-1"
                @click="link.action ? link.action(logoutModal, logout) : () => {}"
            >
                <template #prepend>
                    <Icon color="white" :name="link.icon" />
                </template>
                <v-list-item-title>{{ labels[link.title] ?? link.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
import 'overlayscrollbars/overlayscrollbars.css'
import { OverlayScrollbars } from 'overlayscrollbars'
import localforage from 'localforage'

export default {
    name: 'SideBar',
    data: () => ({
        app: useApp(),
        auth: useAuth(),
        labels: useLabel(),
        companyInfo: useAuth().user.companyInfo,
        links: useModuleLinks().links,
        logoutModal: {
            title: 'Please confirm',
            message: 'Are you sure you want to logout?',
            positiveBtn: 'Yes',
        },
    }),
    async beforeMount() {
        this.app.sidebar.pinned = await localforage.getItem('sidebarPinned')
    },
    async mounted() {
        await this.$nextTick()
        OverlayScrollbars(document.querySelector('.v-navigation-drawer__content'), {
            className: 'os-theme-light',
            scrollbars: {
                autoHide: 'm',
            },
        })
    },
    methods: {
        logout() {
            this.auth.logout()
            this.$iziToast.success({
                title: 'OK',
                message: 'You have been logged out!',
            })
        },
        pin() {
            this.app.sidebar.pinned = !this.app.sidebar.pinned
            localforage.setItem('sidebarPinned', this.app.sidebar.pinned)
        },
    },
}
</script>
