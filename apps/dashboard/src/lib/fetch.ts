import axios from 'axios'
import Cookies from 'js-cookie'

const fetch = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token from cookies
fetch.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor — handle auth errors globally
fetch.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      // redirect to login if needed
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default fetch
