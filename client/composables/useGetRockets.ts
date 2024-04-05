export async function useGetRockets() {
    const GET_ROCKETS = gql`
    query Rocket {
        rockets {
            id
            name
            description
            first_flight
            height 
            {
                meters
            }
            diameter 
            {
                meters
            }
            mass 
            {
                kg
            }
            stages
        }
    }
`
const { data: rocketData } = await useAsyncQuery<{
    rockets: {
        "id": number,
        "name": string,
        "description": string,
        "first_flight": string,
        "height": {
            "meters": number
        },
        "diameter": {
            "meters": number
        },
        "mass": {
            "kg": number
        },
        "stages": number
    }[]
}>(GET_ROCKETS)

const rockets = rocketData.value.rockets;
const rocketsToShow = ref(rockets);

return {
    rocketsToShow
}
}