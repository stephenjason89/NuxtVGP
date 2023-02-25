export default defineNuxtRouteMiddleware((to) => {
    const currentRoute = to?.name?.toString() ?? ''
    const auth = useAuth()
    const noAuthRoutes = ['login', 'index', 'developerManual']
    if (!auth.userId) {
        if (!noAuthRoutes.includes(currentRoute)) return navigateTo('/login')
    } else if (noAuthRoutes.includes(currentRoute) && currentRoute === 'login')
        return navigateTo('/dashboard')
})
