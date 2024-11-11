<template>
   <div :style="{ '--v-layout-top': '0px' }">
  	<v-app-bar style="position: sticky !important;">
		  <v-toolbar-title><h2>SpaceX</h2></v-toolbar-title>
		  <v-spacer></v-spacer>
		  <v-btn text to="/" class="font-weight-bold">Home</v-btn>
		  <v-btn text to="/launches" class="font-weight-bold">Launches</v-btn>
		  <v-btn text to="/rocket" class="font-weight-bold">Rockets</v-btn> 
		  <v-btn text to="/favorites" class="font-weight-bold">Favorites</v-btn> 
		</v-app-bar>
  </div>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
  }
  </script>
  