<template>
    <div
        ref="drawerElement"
        :class="`drawer drawer-${position} ${drawer ? 'active' : 'hidden'}`"
        :style="position === 'bottom' ? bottomWidth : position === 'left' ? leftWidth : ''"
    >
        <v-btn
            depressed
            class="toggler light-greend darken-1"
            :style="{ cursor: 'pointer' }"
            @click="toggleDrawer"
        >
            <Icon
                :name="
                    position === 'right' ? 'ChevronLeft' : position === 'left' ? 'ChevronRight' : 'ChevronUp'
                "
                :style="{ transform: `rotate(${turn}deg)`, transition: '.5s' }"
            />
        </v-btn>
        <div class="drawer-content" :class="theme.body ? theme.body : 'drawer-content-light'">
            <v-list class="white fill-height overflow-auto">
                <v-btn-toggle
                    v-model="position"
                    borderless
                    rounded
                    class="mx-4 mb-2"
                    @change="
                        position === undefined && (position = 'right')
                        localforage.setItem('drawerPosition', position)
                    "
                >
                    <v-btn
                        v-for="pos in ['Left', 'Bottom', 'Right']"
                        :key="pos"
                        :value="pos.toLowerCase()"
                        small
                    >
                        <Icon :name="'Border' + pos" size="22" />
                    </v-btn>
                </v-btn-toggle>
                <v-divider />
                <slot />
            </v-list>
        </div>
    </div>
</template>

<script setup lang="ts">
import localforage from 'localforage'

const app = useApp()
const theme = useTheme()
const drawer = ref<boolean>(false)
const drawerElement = ref<HTMLElement>()
const turn = ref<number>(0)
const position = ref<any>('right')

const toggleDrawer = () => {
    drawer.value = !drawer.value
    turn.value = turn.value + 180
}

const listener = (e: { target: any }) => {
    if (drawer.value)
        if (!(drawerElement.value === e.target || drawerElement.value?.contains(e.target))) toggleDrawer()
}

onMounted(async () => {
    document.addEventListener('click', listener)
    position.value = await localforage.getItem('drawerPosition')
    if (!position.value) position.value = 'right'
})

onBeforeUnmount(() => {
    document.removeEventListener('click', listener)
})

const bottomWidth = computed(() =>
    app.sidebar.drawer.local
        ? 'width: calc(100% - 260px)!important'
        : app.sidebar.pinned
        ? 'width: calc(100% - 80px)!important'
        : '',
)

const leftWidth = computed(() =>
    app.sidebar.drawer.local
        ? 'transform: translateX(260px)'
        : app.sidebar.pinned
        ? 'transform: translateX(80px)'
        : '',
)
</script>

<style scoped>
/* ............ Default ............... */
.drawer {
    position: fixed;
    z-index: 5;
    transition: 0.5s;
}

.toggler {
    position: absolute;
    padding: 10px !important;
    border-radius: 0;
}

.drawer-content {
    width: 500px;
    height: 100vh;
    box-shadow: 0 0 3px #cbcbcb;
}

/* .............. Drawer right ................. */
.drawer-right {
    top: 0;
    right: 0;
}

.drawer-right .toggler {
    top: 40vh;
    min-width: 50px !important;
    height: 200px !important;
    transform: translateX(-50px);
    border-radius: 25px 0 0 25px;
}

.drawer-right.hidden {
    transform: translateX(100%);
}

/* .............. Drawer left ................. */
.drawer-left {
    top: 0;
    left: 0;
}

.drawer-left .toggler {
    top: 40vh;
    min-width: 50px !important;
    height: 200px !important;
    transform: translateX(500px);
    border-radius: 0 25px 25px 0;
}

.drawer-left.hidden {
    /* transform: translateX(-100%); */
    left: -500px;
}

/* .............. Drawer left ................. */

.drawer-bottom {
    width: 100%;
    right: 0;
    height: 50vh;
    bottom: 0;
}

.drawer-bottom .drawer-content {
    height: 100%;
    width: 100%;
}

.drawer-bottom .toggler {
    top: -36px;
    right: 0;
    width: 200px;
    border-radius: 15px 15px 0 0;
}

.drawer-bottom.hidden {
    transform: translateY(100%);
}

.v-application .white {
    background: transparent !important;
}

.drawer-content-light {
    background: white;
}
</style>
