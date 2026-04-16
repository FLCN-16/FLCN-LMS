import axios from "axios"
import Cookies from "js-cookie"

import { AUTH_COOKIE_NAME, AUTH_DISABLED } from "@/constants/auth"
import { getInstituteSlug } from "./institute"

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
    const instituteSlug = getInstituteSlug()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Prepend institute slug to URL if it doesn't already have it
    // and it's a relative path (starting with /)
    if (config.url?.startsWith("/") && !config.url.includes(`/${instituteSlug}/`)) {
      config.url = `/institutes/${instituteSlug}${config.url}`
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
      window.location.href = "/auth/login"
    }

    return Promise.reject(error)
  }
)

export default fetch
