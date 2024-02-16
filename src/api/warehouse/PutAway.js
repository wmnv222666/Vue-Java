/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-25 17:36:48
 * @Description: 上架
 */
import request from '../api.request'

export var API = {
  // 获取列表
  AGetList (data) {
    return request({
      url: 'task/load/get_bundle_info',
      method: 'post',
      data: data
    })
  },
  ACheckBinWeight (data) {
    return request({
      url: 'task/load/check_bin_weight',
      method: 'post',
      data: {
        taskList: data
      }
    })
  },
  // 提交
  ASubmit (data) {
    return request({
      url: 'task/load/submit',
      method: 'post',
      data: {
        taskList: data
      }
    })
  },
  // 获取已完成上架列表
  ACompleteTaskList (data) {
    return request({
      url: 'task/load/get_task_list',
      method: 'post',
      data: data
    })
  },
  /**
   * 获取仓库
   * @returns {AxiosPromise}
   * @constructor
   */
  AGetWhlist () {
    return request({
      url: 'task/load/get_wh_list',
      method: 'post',
      data: {}
    })
  },
  /**
   * 获取待上架订单
   * @returns {AxiosPromise}
   * @constructor
   */
  AGetDClist () {
    return request({
      url: 'sinobec/input/list/get_upload_list',
      method: 'post',
      data: {
        "create": false
      }
    })
  },
  AGetUncompleteList (data) {
    return request({
      url: 'sinobec/input/list/uncompletedlist',
      method: 'post',
      data: data
    })
  },
  AReverse(data) {
    console.log(data)
    return request({
      url: 'task/load/back_to_receive',
      method: 'post',
      data: data
    })
  }
}
