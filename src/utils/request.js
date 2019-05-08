import axios from 'axios'
import axiosRetry from 'axios-retry'

class Axios {
  constructor (baseUrl) {
    // this.baseUrl = baseUrl
  }

  interceptors (service) {
    // request 拦截器
    service.interceptors.request.use(
      config => {
        // 这里可以自定义一些config 配置

        return config
      },
      error => {
        //  这里处理一些请求出错的情况

        console.log(error)
        return Promise.reject(error)
      }
    )

    // response 拦截器
    service.interceptors.response.use(
      response => {
        const res = response.data
        // 这里处理一些response 正常放回时的逻辑

        return res
      },
      error => {
        // 这里处理一些response 出错时的逻辑

        return Promise.reject(error)
      }
    )
  }

  request (options) {
    // 创建axios 实例
    const service = axios.create({
      baseURL: process.env.BASE_URL, // api 的 baseUrl
      responseType: "json",
      withCredentials: true, // 允许携带 cookie
      timeout: 1000 * 10, // 请求超时时间
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      }
    })
    axiosRetry(axios, {
      retries: 5,
      retryDelay: (retryCount) => {
        return retryCount * 2000
      }
    })
    this.interceptors(service, options.url)
    return service()
  }
}

export default new Axios()
