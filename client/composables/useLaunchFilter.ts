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

export default function useLaunchesFilter(launches: Ref<Launch[]>) {
	const selectedYear = ref<string | null>(null)

	const filteredLaunches = computed(() => {
		if (!selectedYear.value) {
			return launches.value
		}

		return launches.value.filter((launch: Launch) => {
			const launchYear = new Date(launch.launch_date_utc).getFullYear().toString()
			return launchYear === selectedYear.value
		})
	})

	return {
		selectedYear,
		filteredLaunches,
	}
}