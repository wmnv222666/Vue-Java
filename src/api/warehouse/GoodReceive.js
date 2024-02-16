/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-04 00:23:53
 * @Description: 收货
 */
import request from '../api.request'

export var API = {
  // 获取列表
  AGetList (data) {
    return request({
      url: 'sinobec/input/list',
      method: 'post',
      data: data
    })
  },
  // 获取列表
  AGetAllTodoList (data) {
    return request({
      url: 'sinobec/input/all_to_do_list',
      method: 'post',
      data: data
    })
  },
  //获取全部列表
  AGetAllList (data) {
    return request({
      url: 'query/incoming',
      method: 'post',
      data: data
    })
  },
  AGetUncompleteList (data) {
    return request({
      url: 'query/uncompletedlist',
      method: 'post',
      data: data
    })
  },
  // 口罩上传
  AUploadList (data) {
    return request({
      url: 'sinobec/input/upload_saas',
      method: 'post',
      data: { inputGPList: data }
    })
  },
  AGetListPage (data) {
    return request({
      url: 'sinobec/input/list/paging',
      method: 'post',
      data: data
    })
  },
  // 保存
  ASave (data) {
    return request({
      url: 'sinobec/input/confirm/save',
      method: 'post',
      data: data
    })
  },
  // 提交
  ASubmit (data) {
    return request({
      url: 'sinobec/input/confirm/submit',
      method: 'post',
      data: data
    })
  },
  ADelete (data) {
    return request({
      url: 'sinobec/input/delete/saved',
      method: 'post',
      data: data
    })
  },
  ASynPoreceive (data) {
    return request({
      url: 'schedule/synchronization/synPoreceive',
      method: 'post',
      data: data
    })
  },
  ASynTransferin (data) {
    return request({
      url: 'schedule/synchronization/synTransferin',
      method: 'post',
      data: data
    })
  },
  ASynAdjustmentin (data) {
    return request({
      url: 'schedule/synchronization/synAdjustmentin',
      method: 'post',
      data: data
    })
  },
  AGetImgCode (type, dn) {
    return request({
      url: 'images/path/' + type + '/' + dn,
      method: 'get',
    })
  },
  AReverse (data) {
    return request({
      url: 'sinobec/input/back_to_receive',
      method: 'post',
      data: data
    })
  }
}
