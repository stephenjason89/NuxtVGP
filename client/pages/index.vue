<template>
    <v-container>
        <h2>Starter Template</h2>
        <h5>Nuxt 3 / Vuetify / Graphql / Pinia</h5>

        <h3 class="my-5">
            Example Pinia
            <v-chip color="blue">useCounter</v-chip>
        </h3>
        <v-card class="mx-auto my-12" max-width="374">
            <v-card-title class="text-blue">Pinia useCounter()</v-card-title>
            <v-card-item>
                <v-card-text>count: {{ store.count }}</v-card-text>
                <v-card-text>doubleCount: {{ store.doubleCount }}</v-card-text>
            </v-card-item>

            <v-card-actions><v-btn color="blue" @click="store.increment()">Increment</v-btn></v-card-actions>
        </v-card>

        <h3 class="my-5">
            Example Vuetify
            <v-chip color="blue">Card</v-chip>
        </h3>
        <v-card class="mx-auto my-12" max-width="374">
            <template #progress>
                <v-progress-linear color="deep-purple" height="10" indeterminate></v-progress-linear>
            </template>

            <v-img height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>

            <v-card-title>Cafe Badilico</v-card-title>

            <v-card-text>
                <v-row align="center" class="mx-0">
                    <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>

                    <div class="grey--text ms-4">4.5 (413)</div>
                </v-row>

                <div class="my-4 text-subtitle-1">$ • Italian, Cafe</div>

                <div>
                    Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio
                    seating.
                </div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

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
        </h3>
        <client-only>
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Calories</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in desserts" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>
                            <v-chip :color="getColor(item.calories)">{{ item.calories }}</v-chip>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </client-only>
    </v-container>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            store: useCounter(),
            selection: 0,
            itemsPerPage: 5,
            headers: [
                {
                    text: 'Dessert (100g serving)',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                { text: 'Calories', value: 'calories' },
                { text: 'Fat (g)', value: 'fat' },
                { text: 'Carbs (g)', value: 'carbs' },
                { text: 'Protein (g)', value: 'protein' },
                { text: 'Iron (%)', value: 'iron' },
            ],
            desserts: [
                {
                    name: 'Frozen Yogurt',
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                    iron: 1,
                },
                {
                    name: 'Ice cream sandwich',
                    calories: 237,
                    fat: 9.0,
                    carbs: 37,
                    protein: 4.3,
                    iron: 1,
                },
                {
                    name: 'Eclair',
                    calories: 262,
                    fat: 16.0,
                    carbs: 23,
                    protein: 6.0,
                    iron: 7,
                },
                {
                    name: 'Cupcake',
                    calories: 305,
                    fat: 3.7,
                    carbs: 67,
                    protein: 4.3,
                    iron: 8,
                },
                {
                    name: 'Gingerbread',
                    calories: 356,
                    fat: 16.0,
                    carbs: 49,
                    protein: 3.9,
                    iron: 16,
                },
                {
                    name: 'Jelly bean',
                    calories: 375,
                    fat: 0.0,
                    carbs: 94,
                    protein: 0.0,
                    iron: 0,
                },
                {
                    name: 'Lollipop',
                    calories: 392,
                    fat: 0.2,
                    carbs: 98,
                    protein: 0,
                    iron: 2,
                },
                {
                    name: 'Honeycomb',
                    calories: 408,
                    fat: 3.2,
                    carbs: 87,
                    protein: 6.5,
                    iron: 45,
                },
                {
                    name: 'Donut',
                    calories: 452,
                    fat: 25.0,
                    carbs: 51,
                    protein: 4.9,
                    iron: 22,
                },
                {
                    name: 'KitKat',
                    calories: 518,
                    fat: 26.0,
                    carbs: 65,
                    protein: 7,
                    iron: 6,
                },
            ],
        }
    },
    methods: {
        getColor(calories) {
            if (calories > 400) return 'red'
            else if (calories > 200) return 'orange'
            else return 'green'
        },
    },
}
</script>
