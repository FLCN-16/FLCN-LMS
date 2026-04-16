import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken")
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  },
)
