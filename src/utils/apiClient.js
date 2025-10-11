import axios from 'axios'

const API_BASE_URL = 'https://localhost:5001'

// axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send/receive HttpOnly cookies
  headers: { 'Content-Type': 'application/json' },
})

// read CSRF token from cookie
function getCsrfToken() {
  const match = document.cookie.split('; ').find(c => c.startsWith('tb2_csrf='))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

// add CSRF header for all requests
api.interceptors.request.use(
  (config) => {
    const csrf = getCsrfToken()
    if (csrf) config.headers['X-CSRF-TOKEN'] = csrf
    return config
  },
  (error) => Promise.reject(error)
)

// normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const msg = error.response.data?.message || 'خطا در پاسخ سرور'
      return Promise.reject(new Error(msg))
    } else if (error.request) {
      return Promise.reject(new Error('پاسخی از سرور دریافت نشد'))
    } else {
      return Promise.reject(new Error('خطا در ارسال درخواست'))
    }
  }
)

export default api
