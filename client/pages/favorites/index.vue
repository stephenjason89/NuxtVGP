<template>
    <v-container>
        <v-btn @click.native="(e:any) => { storeFavorite.clearFaves()}">CLEAR</v-btn>
        <h1>Favorite Rockets</h1>
        <div>
            <div v-for="fave in storeFavorite.favArray">
                <strong>{{ fave }}</strong>
            </div>
        </div>
    </v-container>
</template>

<script setup lang="ts">

import { useFavorite } from '@/stores/useFavorite'
const storeFavorite  = useFavorite();

</script>