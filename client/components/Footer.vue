<template>
    <v-footer class="d-flex flex-column flex-0-0 pa-0 mt-auto">
      <div class="bg-teal d-flex w-100 align-center px-3">
        <strong>Get connected with us on social networks!</strong>
        <v-spacer></v-spacer>
        <v-btn
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          class="mx-4"
          size="small"
          variant="plain"
        ></v-btn>
      </div>
  
      <div class="px-4 py-2 bg-black text-center w-100">
        {{ new Date().getFullYear() }} - <strong>SpaceX</strong>
      </div>
    </v-footer>
  </template>


  <script>
    export default {
    setup() {
      const icons = ref([
          'mdi-facebook',
          'mdi-twitter',
          'mdi-linkedin',
          'mdi-instagram',
        ])
      return {
        icons
      }
    },
  }    
  </script>