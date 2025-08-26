import axios from 'axios'
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/lib/state/loading/loading'
import { useCookieStore } from '@/stores/cookie'
import { useUserStore } from '@/stores/user'

const BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api/'
const http = axios.create({
  baseURL: BASE_URL,
})

http.interceptors.request.use(config => {
  const { getCookie } = useCookieStore()
  const { isLoading } = storeToRefs(useLoadingStore())
  isLoading.value = true
  const token = getCookie('token')
  if (token) {
    config.headers['x-access-token'] = token
  }
  config.headers['Content-Type'] = 'application/json'
  return config
})

http.interceptors.response.use(
  response => {
    const { isLoading } = storeToRefs(useLoadingStore())
    isLoading.value = false
    return response
  },
  async error => {
    const { removeCookie } = useCookieStore()
    const { disconnect } = useUserStore()
    const { isLoading } = storeToRefs(useLoadingStore())
    isLoading.value = false

    if ([401, 403].includes(error.request.status)) {
      removeCookie('token')
      removeCookie('user')
      removeCookie('permissions')
      removeCookie('role')
      disconnect()

      // DEV: hard reload to redirct to login
      window.location.href = '/login'
    }

    throw error
  },
)

export default http
