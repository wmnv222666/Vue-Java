/** Date: 2019/4/17 ; Author: 姜啸 **/
import axios from 'axios'
import { Notice, Spin } from 'iview'
import { getToken, localRead } from '@/libs/utils'
import { getProUriApi } from '@/libs/assist'
import router from '@/router/index'

class HttpRequest {
  constructor() {
    this.baseUrl = getProUriApi()
    this.queue = {}
    this.loading = null
  }
  getInsideConfig () {
    return {
      baseURL: this.baseUrl,
      timeout: 500000, // request timeout
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json;application/octet-stream',
        'filename': 'utf-8',
        'Authorization': getToken(),
        'rs': 0,
        'requestType': 'web',
        'lang_code': localRead('xlocal') || 'en-US'
      },
      notLoading: false
    }
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      Spin.hide()
    }
  }
  interceptors (instance, options) {
    var url = options.url
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          if (!options.notLoading) {
            Spin.show({
              render: (h) => {
                return h('div', {
                  'class': 'in-stock-load'
                })
              }
            })
          }
        }
        this.queue[url] = true

        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      response => {
        this.destroy(url)
        return response.data
      },
      error => {
        this.destroy(url)
        if (error.response) {
          switch (error.response.status) {
            case 302:
              router.replace({
                name: 'login'
              })
              break
            case 401:
              router.replace({
                name: 'error_401'
              })
              break
            case 404:
              router.replace({
                name: 'error_404'
              })
              break
            case 500:
              router.replace({
                name: 'error_500'
              })
              break
          }
        }
        Notice.error({
          desc: error.message
        })
        return Promise.reject(error)
      })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options)
    return instance(options)
  }
}

export default function (options) {
  const xHttpRequest = new HttpRequest()
  return xHttpRequest.request(options)
}
