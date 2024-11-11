<template>
	<v-app>
	  <!-- Header/navbar section -->
	  <div :style="{ '--v-layout-top': '0px' }">
		<v-app-bar style="position: sticky !important;">
		  <v-toolbar-title><h2>SpaceX</h2></v-toolbar-title>
		  <v-spacer></v-spacer>
		  <v-btn text to="/" class="font-weight-bold">Home</v-btn>
		  <v-btn text to="/launch" class="font-weight-bold">Launch</v-btn>
		  <v-btn text to="/rocket" class="font-weight-bold">Rockets</v-btn> 
		  <v-btn text to="/favorites" class="font-weight-bold">Favorites</v-btn> 
		</v-app-bar>
	  </div>
  
	  <!-- Main content of the page -->
	  <v-main>
		<slot />
	  </v-main>
  
	  <!-- Global footer that appears on all pages -->
	  <v-footer class="d-flex flex-column flex-0-0 pa-0 mt-auto">
		<div class="bg-teal d-flex w-100 align-center px-3">
		  <strong>Get connected with us on social networks!</strong>
		  <v-spacer></v-spacer>
		  <div class="d-flex">
			<v-btn
			  v-for="icon in icons"
			  :key="icon"
			  :icon="icon"
			  class="mx-4"
			  size="small"
			  variant="plain"
			>
			  <v-icon>{{ icon }}</v-icon> <!-- Added v-icon component to render the icons -->
			</v-btn>
		  </div>
		</div>
  
		<div class="px-4 py-2 bg-black text-center w-100">
		  {{ new Date().getFullYear() }} - <strong>SpaceX</strong>
		</div>
	  </v-footer>
	</v-app>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Define the social media icons for footer
  const icons = ref([
	'mdi-facebook',
	'mdi-twitter',
	'mdi-linkedin',
	'mdi-instagram',
  ]);
  </script>
  
  <style scoped>
  /* Add custom styles if necessary */
  </style>
  