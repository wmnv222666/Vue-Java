/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-31 19:26:20
 * @Description: 送货管理
 */
import request from '../api.request'

export var API = {
  // 获取列表
  AGetListLC (data) {
    return request({
      url: 'output/get_list',
      method: 'post',
      data: data
    })
  },
  // 获取列表
  AGetAllList (data) {
    return request({
      // url: 'task/un_load_shelf/get_delivery_list',
      url: 'query/deliver/uncompleted',
      method: 'post',
      data: data
    })
  },
  AGetUncompleteList (data) {
    return request({
      //url: 'task/un_load_shelf/get_delivery_list_uncompleted',
      url: 'query/deliver/uncompletednotunique',
      method: 'post',
      data: data
    })
  },
  AGetList (data) {
    return request({
      url: 'output/get_info',
      method: 'post',
      data: data
    })
  },
  // 提交
  ASubmit (data) {
    return request({
      url: 'output/submit',
      method: 'post',
      data: {
        creteOutputVos: data
      }
    })
  },
  // 保存
  ASave (data) {
    return request({
      url: 'output/save',
      method: 'post',
      data: {
        creteOutputVos: data
      }
    })
  },
  // 删除
  ADelete (data) {
    return request({
      url: 'output/delete',
      method: 'post',
      data: {
        creteOutputVos: data
      }
    })
  },

  AGetImgCode (type, dn) {
    return request({
      url: 'images/path/' + type + '/' + dn,
      method: 'get',
    })
  },

  AReverse(data) {
    return request({
      url: 'output/back_to_pick',
      method: 'post',
      data: data
    })
  }
}
