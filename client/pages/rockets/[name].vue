<template>
    <h1>THIS IS DETAILS OF {{ name }}</h1>
    <v-container>
        <v-table 	theme="dark"
					density="comfortable"
					height="980px"
					fixed-header>
			<thead>
				<tr>
					<th class="text-left">Rocket Name</th>
					<th class="text-left">First Flight Date</th>
					<th class="text-left">Height</th>
					<th class="text-left">Diameter</th>
					<th class="text-left">Mass</th>
                    <th class="text-left">Stages</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="r in getRockets" :key="r.name">
					<td>{{ r.name }}</td>
					<td>{{ convertToDate(r.first_flight, "", [""]) }}</td>
					<td>{{ r.height.meters }}</td>
					<td>{{ r.diameter.meters }}</td>
					<td>{{ r.mass.kg }}</td>
					<td>{{ r.stages }}</td>
				</tr>
			</tbody>
		</v-table>
    </v-container>
</template>

<script setup lang="ts">
	import { useGetRockets } from '#imports';
	import { useConvertToDate } from '#imports';
    const { name } = useRoute().params

    const { rocketsToShow } = await useGetRockets();
    const { convertToDate } = useConvertToDate();

    const getRockets = computed(() => {
        let rocketArray = [...rocketsToShow.value]
        return rocketArray;
    })
</script>