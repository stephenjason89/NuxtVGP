<script lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import useLaunchesFilter from '@/composables/useLaunchFilter'
import useLaunchesSort from '@/composables/useLaunchSort'
import { useFavoritesStore } from '@/stores/useFavoritesStore'

export default {
  setup() {
    interface Launch {
      mission_name: string
      launch_date_utc: Date
      launch_site: {
        site_name: string
      }
      rocket: {
        rocket_name: string
      }
      details: string
    }

    // Add loading state and a flag to check if data is fetched
    const loading = ref(true)
    const dataLoaded = ref(false)

    const { data, refetch } = useAsyncQuery<{ launches: Launch[] }>(gql`
      query getLaunches {
        launches {
          id
          mission_name
          launch_date_utc
          launch_site {
            site_name
          }
          rocket {
            rocket_name
          }
          details
        }
      }
    `)

    const launches = ref<Launch[]>([])

    // Function to set data and stop loading
    const setData = () => {
      if (data.value) {
        launches.value = data.value.launches
        loading.value = false
        dataLoaded.value = true
      }
    }

    // If data is already fetched, don't make another request
    onMounted(() => {
      if (!dataLoaded.value) {
        setData()
      }
    })

    // Watch for changes in data and update if necessary
    watch(data, (newData) => {
      if (newData && !dataLoaded.value) {
        setData()
      }
    })

    const { selectedYear, filteredLaunches } = useLaunchesFilter(launches)
    const { sortDirection, sortedLaunches, toggleSortDirection } = useLaunchesSort(filteredLaunches)

    const availableYears = computed(() => {
      const years = new Set<string>()
      launches.value.forEach((launch) => {
        const launchYear = new Date(launch.launch_date_utc).getFullYear().toString()
        years.add(launchYear)
      })
      return Array.from(years)
    })

    const favoriteStore = useFavoritesStore()
    const isFavorite = (rocketName: string) => favoriteStore.getFavoriteRockets.includes(rocketName)

    const toggleFavorite = (rocketName: string) => {
      if (isFavorite(rocketName)) {
        favoriteStore.removeFavoriteRocket(rocketName)
      } else {
        favoriteStore.addFavoriteRocket(rocketName)
      }
    }

    return {
      loading,
      selectedYear,
      filteredLaunches,
      availableYears,
      sortDirection,
      sortedLaunches,
      toggleSortDirection,
      isFavorite,
      toggleFavorite,
    }
  },
}
</script>

<template>
  <v-container>
    <h3 class="my-5">SpaceX Mission List</h3>

    <!-- Display loading spinner while fetching data -->
    <v-spinner v-if="loading" color="primary" size="64"></v-spinner>
    <p v-if="loading" class="d-flex justify-center align-center" >Loading missions...</p>

    <!-- Content shown when data is available -->
    <v-select v-if="!loading" v-model="selectedYear" :items="availableYears" clearable label="Filter by Year" />
    <v-btn class="mb-3" color="primary" @click="toggleSortDirection" v-if="!loading">
      {{ sortDirection === 'asc' ? 'Ascending' : 'Descending' }}
    </v-btn>
    <v-btn class="mb-3 ml-2" to="/favorites" v-if="!loading">View Favorites</v-btn>

    <p v-if="!loading">There are {{ filteredLaunches.length || 0 }} missions.</p>

    <v-table v-if="!loading">
      <thead>
        <tr>
          <th class="text-center">Mission Name</th>
          <th class="text-center">Launch Date</th>
          <th class="text-center">Site</th>
          <th class="text-center w-25">Rocket Name</th>
          <th class="text-center">Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="launch in sortedLaunches" :key="(launch.mission_name as string)">
          <td class="text-center">{{ launch.mission_name }}</td>
          <td class="text-center">{{ launch.launch_date_utc }}</td>
          <td class="text-center">
            {{ launch.launch_site ? launch.launch_site.site_name : 'N/A' }}
          </td>
          <td class="text-center">
            {{ launch.rocket ? launch.rocket.rocket_name : 'N/A' }}
            <v-icon
              :color="isFavorite(launch.rocket?.rocket_name) ? 'yellow' : ''"
              @click="toggleFavorite(launch.rocket?.rocket_name)"
            >
              {{ isFavorite(launch.rocket?.rocket_name) ? 'mdi-star' : 'mdi-star-outline' }}
            </v-icon>
          </td>
          <td class="text-center">{{ launch.details ? launch.details : 'N/A' }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
