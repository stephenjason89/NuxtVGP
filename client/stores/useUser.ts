export const useUser = defineStore('user', {
    state: () => ({
        id: '',
        email: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        username: '',
        nickname: '',
        age: '',
        gender: '',
        birthday: '',
        is_customer: null,
        is_seller: null,
        is_courier: null,
        points: 0,
        branches: [],
        roles: [],
        permissions: [],
        avatar: null,
        price_group_id: null,
        email_verified_at: null,
        companyInfo: {
            id: 1,
            name: 'Apollo',
            theme: {
                color: '#00c853',
            },
        },
        created_at: null,
        deleted_at: null,
        __typename: 'User',
    }),
    getters: { name: (state) => `${state.first_name} ${state.middle_name} ${state.last_name}` },
    actions: {
        setUser(user: any) {
            Object.assign(this, user)
        },
    },
    ...(process.client
        ? {
              persist: {
                  key: 'user',
                  storage: localStorage,
              },
          }
        : {}),
})
