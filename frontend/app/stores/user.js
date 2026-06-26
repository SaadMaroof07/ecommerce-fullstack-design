import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.is_staff === true,
    currentUser: (state) => state.user,
  },

  actions: {
    setAuth(userData, tokens) {
      this.user = userData
      this.accessToken = tokens.access
      this.refreshToken = tokens.refresh

      if (process.client) {
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)
        localStorage.setItem('user', JSON.stringify(userData))
      }
    },

    restoreAuth() {
      if (process.client) {
        const access = localStorage.getItem('access_token')
        const refresh = localStorage.getItem('refresh_token')
        const user = localStorage.getItem('user')

        if (access && refresh && user) {
          this.accessToken = access
          this.refreshToken = refresh
          this.user = JSON.parse(user)
        }
      }
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null

      if (process.client) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }

      navigateTo('/login')
    }
  }
})