<template>
    <v-navigation-drawer
        v-model="app.sidebar.drawer.local"
        app
        mini-variant-width="80"
        theme="dark"
        touchless
        width="350"
    >
        <div class="sidebar-list">
            <div class="sidebar-list-header d-flex">
                <span class="align-self-center ml-3">Apollo Systems</span>

                <v-spacer />
                <v-btn size="x-small" class="align-self-center mr-3" variant="flat" icon>
                    <Icon
                        :name="app.sidebar.pinned ? 'PinOff' : 'Pin'"
                        class="v-icon--link"
                        color="#ccc"
                        size="15"
                    />
                </v-btn>
            </div>
            <div class="sidebar-list-content">
                <v-list>
                    <v-list-group v-for="(link, i) in links" :key="i">
                        <template #activator="{ props }">
                            <v-list-item v-bind="props" class="pa-4">
                                <template #prepend>
                                    <Icon :name="link.icon" class="mr-5" color="white" size="30" />
                                </template>
                                <span>{{ link.title }}</span>
                            </v-list-item>
                        </template>

                        <v-list-item
                            v-for="(item, index) in link.items"
                            :key="index"
                            :to="item.to"
                            class="pa-3"
                        >
                            <div class="d-flex">
                                <Icon :name="item.icon" color="white" class="mr-3" />
                                <span>{{ item.title }}</span>
                            </div>
                        </v-list-item>
                    </v-list-group>
                </v-list>
            </div>
        </div>
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

<style scoped>
.sidebar-list {
    height: 100vh;
}

.sidebar-list-header {
    height: 64px;
    border-bottom: 0.5px solid #666;
}

.sidebar-list-content {
    height: calc(100vh - 64px);
    overflow: auto;
}
</style>
