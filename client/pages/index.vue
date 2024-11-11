<template>
	<v-container>
	  <h2>
		<v-icon icon="mdi-vuetify" />
		Starter Template
	  </h2>
	  <h5>Nuxt 3 / Vuetify / Graphql</h5>
  
	  <h3 class="my-5">
		Example Vuetify
		<v-chip color="blue">SimpleTable</v-chip>
		<v-chip color="orange">Data from SpaceX GraphQL</v-chip>
	  </h3>
	  <p>There are {{ ships?.length || 0 }} ships.</p>
	  <v-table>
		<thead>
		  <tr>
			<th class="text-left">Name</th>
			<th class="text-left">Active</th>
		  </tr>
		</thead>
		<tbody>
		  <tr v-for="ship in ships" :key="ship.name">
			<td>{{ ship.name }}</td>
			<td>
			  <v-chip :color="ship.active ? 'green' : 'red'">{{ ship.active }}</v-chip>
			</td>
		  </tr>
		</tbody>
	  </v-table>
	</v-container>
  </template>
  
  <script lang="ts" setup>
  const query = gql`
	query getShips {
	  ships {
		id
		name
		active
	  }
	}
  `
  
  const { data } = useAsyncQuery<{
	ships: {
	  id: String
	  name: String
	  active: Boolean
	}
  }>(query)
  
  const ships = computed(() => data.value?.ships ?? [])
  </script>
  