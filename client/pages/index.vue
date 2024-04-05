<template>
	<v-container>
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
					<th class="text-left"></th>
					<th class="text-left">Mission Name</th>
					<th class="text-left">Launch Date</th>
					<th class="text-left">Launch Site Name</th>
					<th class="text-left">Rocket Name</th>
					<th class="text-left">Details</th>
				</tr>
			</thead>
			<tbody>
				
				<tr v-for="launch in getLaunches" :key="launch.id">
					<v-col cols="auto">
						<v-btn @click.native="(e: any) => {storeFavorite.addFave(launch.rocket.rocket_name)}" :key="launch.id" ref="favBtn">Favorite</v-btn>
					</v-col>
					<td>{{ launch.mission_name }}</td>
					<td width="232px">{{ convertToDate(launch.launch_date_local, launch.launch_year, filters) }}</td>
					<td v-if="NULL" width="132px">{{ 'No Launch Site Name' }}</td>
					<td v-else width="132px">{{ launch.launch_site.site_name }}</td>
					<td width="132px">{{ launch.rocket.rocket_name }}</td>
					<td>{{ launch.details }}</td>
				</tr>
			</tbody>
		</v-table>
	</v-container>
</template>
<script setup lang="ts" >
import { NULL } from 'sass'
import { useFilters } from '#imports'
import { useSort } from '#imports'
import { useConvertToDate } from '#imports'
import { useFavorite } from '@/stores/useFavorite'

const { filters, activeFilter, filter } = useFilters();
const { sortString, sort} = useSort();
const { convertToDate } = useConvertToDate();
const storeFavorite  = useFavorite();

const GET_LAUNCHES = gql`
	query Query($find: LaunchFind, $sort: String, $limit: Int) {
		launches(find: $find, sort: $sort, limit: $limit) {
			mission_name
			launch_site 
			{
				site_name
			}
			rocket 
			{
				rocket_name
			}
			details
			id
			launch_date_local
			launch_year
		}
	}
`

const { data: launchData } = await useAsyncQuery<{
	launches: {
		"id": number,
		"mission_name": string,
		"launch_site": {
			"site_name": string
		},
		"rocket": {
			"rocket_name": string
		},
		"details": string,
		"launch_date_local": string,
		"launch_year": string
	}[]
}>(GET_LAUNCHES)

const launches = launchData.value.launches;
const launchesToShow = ref(launches)

const getLaunches = computed(() => {
	let launchArray = [...launchesToShow.value]
	
	sort(launchArray)

	if (activeFilter.value === 'All')
	{
		return launchArray;
	}
	
	return launchArray.filter((item) => item.launch_year === activeFilter.value)
})

function OnRadioChange(input: any){
	sortString.value = input
}

function OnChange(inputString: string) {
	if(inputString === "")
	{
		filter("All");
		return;
	}
	filter(inputString);
}

function OnBtnSelect(input: any) {

}

</script>
