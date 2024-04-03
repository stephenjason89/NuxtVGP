<template>
	<v-container>
		<!-- <h2>
			<v-icon icon="mdi-vuetify" />
			Starter Template
		</h2>
		<h5>Nuxt 3 / Vuetify / Graphql / Pinia</h5>
		<h3 class="my-5">
			Example Pinia
			<v-chip color="blue">useCounter</v-chip>
		</h3>
		<v-card class="mx-auto my-12" max-width="374">
			<v-card-title class="text-blue">Pinia useCounter()</v-card-title>
			<v-card-item>
				<v-card-text>
					<v-chip>count:</v-chip>
					{{ store.count }}
				</v-card-text>
				<v-card-text>
					<v-chip>doubleCount:</v-chip>
					{{ store.doubleCount }}
				</v-card-text>
			</v-card-item>

			<v-card-actions><v-btn color="blue" @click="store.increment()">Increment</v-btn></v-card-actions>
		</v-card>

		<h3 class="my-5">
			Example Vuetify
			<v-chip color="blue">Card</v-chip>
		</h3>
		<v-card class="mx-auto my-12" max-width="374">
			<template #progress>
				<v-progress-linear color="deep-purple" height="10" indeterminate />
			</template>

			<v-img height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png" />

			<v-card-title>Cafe Badilico</v-card-title>

			<v-card-text>
				<v-row align="center" class="mx-0">
					<v-rating :value="4.5" color="amber" dense half-increments readonly size="14" />

					<div class="grey--text ms-4">4.5 (413)</div>
				</v-row>

				<div class="my-4 text-subtitle-1">$ • Italian, Cafe</div>

				<div>
					Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio
					seating.
				</div>
			</v-card-text>

			<v-divider class="mx-4" />

			<v-card-title>Tonight's availability</v-card-title>

			<v-card-text>
				<v-chip-group v-model="selection" active-class="deep-purple accent-4 white--text" column>
					<v-chip>5:30PM</v-chip>

					<v-chip>7:30PM</v-chip>

					<v-chip>8:00PM</v-chip>

					<v-chip>9:00PM</v-chip>
				</v-chip-group>
			</v-card-text>

			<v-card-actions>
				<v-btn color="deep-purple lighten-2">Reserve</v-btn>
			</v-card-actions>
		</v-card>
		<h3 class="my-5">
			Example Vuetify
			<v-chip color="blue">SimpleTable</v-chip>
			<v-chip color="orange">Data from spaceX graphql</v-chip>
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
		</v-table> -->
		<v-text-field 	label="Year" 
						hide-details="auto"
						placeholder="Enter year"
						type="year"
						theme="dark"
						@update:model-value="OnChange">
		</v-text-field>
		<v-radio-group 	v-model="sortString"
						@update:model-value="OnRadioChange">
			<label>Sort</label>
			<v-radio label="Ascending" value="Ascending"></v-radio>
			<v-radio label="Descending" value="Descending"></v-radio>
		</v-radio-group>
		<v-table 	theme="dark"
					density="comfortable"
					height="980px"
					fixed-header>
			<thead>
				<tr>
					<th class="text-left">Mission Name</th>
					<th class="text-left">Launch Date</th>
					<th class="text-left">Launch Site Name</th>
					<th class="text-left">Rocket Name</th>
					<th class="text-left">Details</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="launch in getLaunches" :key="launch.mission_name">
					<td>{{ launch.mission_name }}</td>
					<td width="232px">{{ convertToDate(launch.launch_date_local, launch.launch_year) }}</td>
					<td v-if="NULL" width="132px">{{ 'No Launch Site Name' }}</td>
					<td v-else width="132px">{{ launch.launch_site.site_name }}</td>
					<td width="132px">{{ launch.rocket.rocket_name }}</td>
					<td>{{ launch.details }}</td>
				</tr>
			</tbody>
		</v-table>
	</v-container>
</template>
<script lang="ts" setup>
import { NULL } from 'sass'

const query = gql`
	query Query($find: LaunchFind, $sort: String, $limit: Int) {
		launches(find: $find, sort: $sort, limit: $limit) {
			mission_name
			launch_site {
			site_name
			}
			rocket {
			rocket_name
			}
			details
			id
			launch_date_local
			launch_year
		}
	}
`

const { data } = await useAsyncQuery<{
	launches: {
		id: number
		mission_name: string
		launch_site: {
			site_name: string
		}
		rocket: {
			rocket_name: string
		}
		details: string
		launch_date_local: string
		launch_year: string
	}[]
}>(query)

const launches = data.value.launches;
const launchesToShow = ref(launches)

const yearFilters = ref(['All']);
const yearActiveFilter = ref('All');

function filterLaunches(filter:string){
	yearActiveFilter.value = filter;
}

const sortString = ref("Ascending")

const getLaunches = computed(() => {
	let launchArray = [...launchesToShow.value]
	
	if(sortString.value === 'Ascending')
	{
		launchArray.sort((itemA, itemB) => {
			if(itemA.launch_year > itemB.launch_year)
			{
				return 1;
			}
			if(itemA.launch_year < itemB.launch_year)
			{
				return -1;
			}
			return 0;
		})
	}else{
		launchArray.sort((itemA, itemB) => {
			if(itemA.launch_year > itemB.launch_year)
			{
				return -1;
			}
			if(itemA.launch_year < itemB.launch_year)
			{
				return 1;
			}
			return 0;
		})
	}
	if (yearActiveFilter.value === 'All')
	{
		return launchArray;
	}
	
	return launchArray.filter((item) => item.launch_year === yearActiveFilter.value)
})

function convertToDate(dateString: string, yearStr: string) {
	const dStr: string = dateString
	const res: Date = new Date(dStr)
	if(!yearFilters.value.includes(yearStr))
	{
		yearFilters.value.push(yearStr);
	}
	return res
}

function OnRadioChange(input: any){
	sortString.value = input
}

function OnChange(inputString: string) {
	if(inputString === "")
	{
		filterLaunches("All");
		return;
	}
	filterLaunches(inputString);
	
}

</script>
