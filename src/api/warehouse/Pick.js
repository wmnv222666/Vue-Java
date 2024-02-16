/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-04 00:24:07
 * @Description: 拣货管理
 */
import request from '../api.request'

export var API = {
  // 获取列表
  AGetList (data) {
    return request({
      url: 'task/un_load_shelf/get_info',
      method: 'post',
      data: data
    })
  },
  // 获取全部列表
  AGetAllList (data) {
    return request({
      url: 'query/invoiced',
      method: 'post',
      data: data
    })
  },
  AGetUncompleteList (data) {
    return request({
      url: 'query/invoiced/uncompleted',
      method: 'post',
      data: data
    })
  },
  AGetListKZCreate (data) {
    return request({
      url: 'task/un_load_shelf/mask/get_info',
      method: 'post',
      data: data
    })
  },
  AGetListKZ (data) {
    return request({
      url: 'task/un_load_shelf/get_task_list',
      method: 'post',
      data: data
    })
  },
  // 口罩上传
  AUploadList (data) {
    return request({
      url: 'task/un_load_shelf/upload_saas',
      method: 'post',
      data: { outputGPList: data }
    })
  },
  // 提交
  ASubmit (data) {
    return request({
      url: 'task/un_load_shelf/submit',
      method: 'post',
      data: {
        creteShelfLoadDaoVos: data
      }
    })
  },
  // 保存
  ASave (data) {
    return request({
      url: 'task/un_load_shelf/save',
      method: 'post',
      data: {
        creteShelfLoadDaoVos: data
      }
    })
  },
  // 删除
  ADelete (data) {
    return request({
      url: 'task/un_load_shelf/delete',
      method: 'post',
      data: {
        creteShelfLoadDaoVos: [],
        viewShelfLoadDaoVos: data
      }
    })
  },
  // 冲销
  ACancel (data) {
    return request({
      url: 'task/un_load_shelf/cancel',
      method: 'post',
      data: {
        creteShelfLoadDaoVos: data
      }
    })
  },
  // 口罩 - 行取消
  ACancelKZ (data) {
    return request({
      url: 'task/un_load_shelf/cancel_mask',
      method: 'get',
      data: {},
      params: {
        receiptCode: data
      }
    })
  },
  AReverseKZ (data) {
    console.log(data)
    return request({
      url: 'task/un_load_shelf/back_to_pick',
      method: 'post',
      data: data
    })
  },
  ADeleteKZ (data) {
    return request({
      url: 'task/un_load_shelf/delete_cancel',
      method: 'get',
      data: {},
      params: {
        receiptCode: data
      }
    })
  },
  AUnpack (data) {
    return request({
      url: 'task/un_load_shelf/unpacking',
      method: 'post',
      data: data
    })
  },
  ASynTransferout (data) {
    return request({
      url: 'schedule/synchronization/synTransferout',
      method: 'post',
      data: data
    })
  },
  ASynAdjustmentout (data) {
    return request({
      url: 'schedule/synchronization/synAdjustmentout',
      method: 'post',
      data: data
    })
  },
  ASynSodelivery (data) {
    return request({
      url: 'schedule/synchronization/synSodelivery',
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
}
