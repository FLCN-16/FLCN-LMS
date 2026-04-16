import axios from "axios"
import Cookies from "js-cookie"

import { AUTH_COOKIE_NAME, AUTH_DISABLED } from "@/constants/auth"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api"

const fetch = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

fetch.interceptors.request.use(
  (config) => {
    const token = Cookies.get(AUTH_COOKIE_NAME)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

fetch.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!AUTH_DISABLED && error.response?.status === 401) {
      Cookies.remove(AUTH_COOKIE_NAME)
      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/auth/login")) {
        window.location.href = "/auth/login"
      }
    }

    return Promise.reject(error)
  }
)

export default fetch
