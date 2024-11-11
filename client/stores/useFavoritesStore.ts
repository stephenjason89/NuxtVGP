export const useFavoritesStore = defineStore('favorites', {
	state: () => ({
		favoriteRockets: [] as string[],
	}),
	getters: {
		getFavoriteRockets(): string[] {
			return this.favoriteRockets
		},
	},
	actions: {
		addFavoriteRocket(rocketName: string) {
			this.favoriteRockets.push(rocketName)
		},
		removeFavoriteRocket(rocketName: string) {
			const index = this.favoriteRockets.indexOf(rocketName)
			if (index !== -1) {
				this.favoriteRockets.splice(index, 1)
			}
		},
	},
})