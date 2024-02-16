/** Date: 2020/3/19 ; Author: 姜啸 **/
/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-25 17:36:37
 * @Description: 仓库整理
 */
import request from '../api.request'

export var API = {
  // 获取列表
  AGetList (data) {
    return request({
      url: 'task/arrange/get_task_list',
      method: 'post',
      data: data
    })
  },
  // 获取单据详情
  AGetDetailByCode (receiptCode) {
    return request({
      url: 'task/arrange/get_arrange_info/' + receiptCode,
      method: 'get',
      data: {}
    })
  },
  // 获取物料行项目
  AGetItem (data) {
    return request({
      url: 'task/arrange/get_bundle_info',
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
  ADelete (receiptCode) {
    return request({
      url: 'task/arrange/delete/' + receiptCode,
      data: {},
      method: 'get'
    })
  },
  // 整理单提交
  ASaveOrSubmit (data) {
    return request({
      url: 'task/arrange/submit',
      data: data,
      method: 'post'
    })
  },
  /**
   * 获取仓库
   * @returns {AxiosPromise}
   * @constructor
   */
  AGetWhlist () {
    return request({
      url: 'task/arrange/get_wh_list',
      method: 'post',
      data: {}
    })
  }
}
