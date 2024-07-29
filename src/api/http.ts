import axios, { type AxiosInstance } from 'axios'
import { API_URL } from '@/constants/envConstants'
import { showMessage } from '@/helpers/element'

const baseURL: string = API_URL
const headerStrings = {
  'Accept-Language': 'ru',
  'cross-origin-resource-policy': 'cross-origin',
}

const Http: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: headerStrings,
})

Http.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
  },
  (error) => {
    const message = error?.response?.data?.error?.error_message || 'Ошибка запроса'
    showMessage(message, 'error')
    return Promise.reject(error)
  },
)

export default Http
