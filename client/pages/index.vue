<template>
    <v-container>
        <h2>APOLLO SYSTEMS WEBSITE</h2>
        <h5>Under Construction</h5>
        <v-btn class="justify-center mt-16" x-large dark outlined color="green" @click="redirectToLogin">
            Go to login
        </v-btn>
    </v-container>
</template>

<script lang="ts">
export default defineComponent({
    name: 'Home',
    layout: 'blank',
    middleware: 'auth',
    methods: {
        redirectToLogin() {
            if (getSubdomain(window.location.host)) this.$router.push('/login')
            else window.location.href = 'http://erp.localhost:3000/login'
        },
    },
})
</script>
