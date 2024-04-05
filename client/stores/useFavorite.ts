export const useFavorite = defineStore('favorites',{
    state: () => {
        return{
            favArray: [] as number[]
        }
    },
    getters: {

    },
    actions: {
        addFave(name: any){
            if(!this.favArray.includes(name))
            {
                this.favArray.push(name)
            }
                
        },
        clearFaves(){
            this.favArray.length = 0;
        }
    }
})