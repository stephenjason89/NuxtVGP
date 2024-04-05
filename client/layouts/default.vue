<template>
	<v-app>
		<v-main>
			<v-card>
			<v-tabs
				v-model="tab"
				align-tabs="center"
				color="deep-purple-accent-4"
				>
				<v-tab :to="`/`">Launches</v-tab>
				<v-tab :to="`/rockets`">Rockets</v-tab>
				<v-tab :to="`/favorites`">Favorites</v-tab>
    		</v-tabs>
			</v-card>
			
				<slot />
			<v-footer 
				class="flex-column text-center">
				<h1>Learning is fun!</h1>
			</v-footer>
		</v-main>
	</v-app>
</template>
<script>
export default {
	name: 'DefaultLayout',
}
</script>
