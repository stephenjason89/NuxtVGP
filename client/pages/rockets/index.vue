<template>
    <v-container>
        <h1>ROCKETS</h1>
        <div>
            <div v-for="r in getRockets">
                <NuxtLink :to="`/rockets/${r.name}`">{{ r.name }}</NuxtLink>
            </div>
        </div>
    </v-container>
</template>

<script setup lang="ts">

const { rocketsToShow } = await useGetRockets();

const getRockets = computed(() => {
    let rocketArray = [...rocketsToShow.value]
    return rocketArray;
})

</script>