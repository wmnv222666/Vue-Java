/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-07 11:40:07
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-30 09:09:21
 * @Description: 异步请求封装
 */
import axios from 'axios'
import { Notice, Spin } from 'view-design'
import { getToken, localRead } from '@/libs/utils'
import { getProUriApi } from '@/libs/assist'
import router from '@/router/index'
import Vue from 'vue'

class HttpRequest {
  constructor() {
    this.baseUrl = getProUriApi()
    this.queue = {}
    this.loading = null
  }
  getInsideConfig () {
    return {
      baseURL: this.baseUrl,
      timeout: 120000, // request timeout
      headers: {
        'filename': 'utf-8',
        'Authorization': getToken(),
        'rs': 0,
        'requestType': 'web',
        'Content-Type': 'application/json;charset=utf-8',
        'lang_code': localRead('xlocal') || 'en-US'
      }
    }
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      Spin.hide()
    }
  }
  interceptors (instance, options) {
    // 请求拦截
    var url = options.url
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          Spin.show({ render: (h) => { return h('div', { 'class': 'in-stock-load' }) } })
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
        var res = response.data
        if (res.returnCode !== 1) {
          if (res.returnCode === 1003) {
            router.replace({ name: 'login' })
          }
          Notice.error({ desc: res.returnMsg, duration: 4 })

          return Promise.reject(new Error('error'))
        } else {
          return response.data
        }
      },
      error => {
        this.destroy(url)
        if (error.response) {
          switch (error.response.status) {
            case 302:
              router.replace({ name: 'login' })
              break
            case 401:
              router.replace({ name: 'error_401' })
              break
            case 404:
              router.replace({ name: 'error_404' })
              break
            case 500:
              router.replace({ name: 'error_500' })
              break
          }
        }
        Notice.error({ desc: error.message, duration: 4 })
        return Promise.reject(error)
      })
  }
  request (options) {
    var instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    if (options.params) {
      options.params.timestamp = (new Date()).getTime()
    } else {
      options.params = { timestamp: (new Date()).getTime() }
    }
    this.interceptors(instance, options)
    return instance(options)
  }
}

export default function (options) {
  var xHttpRequest = new HttpRequest()
  return xHttpRequest.request(options)
}
