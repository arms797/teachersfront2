import axios from 'axios'

// آدرس API از فایل محیطی خوانده می‌شود
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ارسال/دریافت کوکی‌های HttpOnly
  headers: { 'Content-Type': 'application/json' },
})

// خواندن CSRF token از کوکی
function getCsrfToken() {
  const match = document.cookie.split('; ').find(c => c.startsWith('tb2_csrf='))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

// اضافه کردن CSRF header برای همه درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const csrf = getCsrfToken()
    if (csrf) config.headers['X-CSRF-TOKEN'] = csrf
    return config
  },
  (error) => Promise.reject(error)
)

// نرمال‌سازی پاسخ‌ها و خطاها
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const msg = error.response.data || 'خطا در پاسخ سرور'
      return Promise.reject(new Error(msg))
    } else if (error.request) {
      return Promise.reject(new Error('پاسخی از سرور دریافت نشد'))
    } else {
      return Promise.reject(new Error('خطا در ارسال درخواست'))
    }
  }
)

export default api
