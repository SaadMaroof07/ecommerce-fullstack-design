export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore()
  userStore.restoreAuth()

  if (!userStore.isLoggedIn) {
    return navigateTo('/login')
  }

  if (!userStore.isAdmin) {
    return navigateTo('/')
  }
})
