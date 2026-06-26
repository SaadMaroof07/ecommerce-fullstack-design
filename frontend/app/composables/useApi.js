export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const getHeaders = () => {
    if (!process.client) return { 'Content-Type': 'application/json' }

    const token = localStorage.getItem('access_token')
    const headers = { 'Content-Type': 'application/json' }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  const userStore = useUserStore()

  // Try refresh access token using refresh token
  const refreshAccess = async () => {
    const refresh = process.client ? localStorage.getItem('refresh_token') : userStore.refreshToken
    if (!refresh) return false
    try {
      const res = await $fetch(`${baseURL}/auth/refresh/`, {
        method: 'POST',
        body: JSON.stringify({ refresh }),
        headers: { 'Content-Type': 'application/json' }
      })

      // Support different response shapes
      const newAccess = res?.access || res?.tokens?.access || (res?.data && res.data.access)
      const newRefresh = res?.refresh || res?.tokens?.refresh

      if (newAccess) {
        if (process.client) localStorage.setItem('access_token', newAccess)
        userStore.accessToken = newAccess
      }
      if (newRefresh) {
        if (process.client) localStorage.setItem('refresh_token', newRefresh)
        userStore.refreshToken = newRefresh
      }

      return !!newAccess
    } catch (err) {
      // Refresh failed — force logout
      userStore.logout()
      return false
    }
  }

  // Centralized request with retry on expired token
  const request = async (method, endpoint, body) => {
    const makeOptions = () => {
      const opts = { method, headers: getHeaders() }
      if (body) opts.body = JSON.stringify(body)
      return opts
    }

    try {
      const data = await $fetch(`${baseURL}${endpoint}`, makeOptions())
      return { data, error: null }
    } catch (error) {
      const errData = error?.data || error?.message || error
      const isAuthError = (error?.data && (error.data.code === 'token_not_valid' || (error.data.detail && String(error.data.detail).toLowerCase().includes('token')))) || error?.status === 401

      if (isAuthError) {
        const refreshed = await refreshAccess()
        if (refreshed) {
          try {
            const data = await $fetch(`${baseURL}${endpoint}`, makeOptions())
            return { data, error: null }
          } catch (err2) {
            return { data: null, error: err2?.data || err2?.message || err2 }
          }
        }
      }

      return { data: null, error: errData }
    }
  }

  // GET request
  const get = async (endpoint) => request('GET', endpoint)

  // POST request
  const post = async (endpoint, body) => request('POST', endpoint, body)

  // PUT request
  const put = async (endpoint, body) => request('PUT', endpoint, body)

  // DELETE request
  const remove = async (endpoint) => request('DELETE', endpoint)

  return { get, post, put, remove }
}