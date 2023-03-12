<template>
    <v-navigation-drawer
        v-model="app.sidebar.drawer.local"
        :temporary="!app.sidebar.pinned"
        app
        color="#424242"
        image="/img/nav-bg.jpg"
        mini-variant-width="80"
        theme="dark"
        touchless
        width="300"
    >
        <v-list-item prepend-avatar="/img/msi-logo.png" subtitle="Systems" title="Apollo">
            <template #append>
                <v-btn icon size="x-small" variant="flat" @click="pin">
                    <Icon
                        :name="app.sidebar.pinned ? 'PinOff' : 'Pin'"
                        class="v-icon--link"
                        color="#ccc"
                        size="15"
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
                :color="companyInfo.theme.color"
                :to="link.to"
                class="pa-3"
                exact
                @click="link.action ? link.action(logoutModal, logout) : () => {}"
            >
                <template #prepend>
                    <Icon :name="link.icon" class="mr-5" color="white" />
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
