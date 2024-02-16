/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-11 09:23:43
 * @Description: 仓位主数据管理
 */
import request from '../api.request'

export var API = {
  AGetList (data) {
    return request({
      url: 'wh_storage_bin/get_wh_storage_bin_list_page',
      method: 'post',
      data: data
    })
  },
  /**
   * 获取物料类型
   * @returns {AxiosPromise}
   * @constructor
   */
  AGetItemType () {
    return request({
      url: 'wh_storage_bin/get_item_type',
      method: 'get',
      data: {}
    })
  },
  /**
   * 获取仓库
   * @returns {AxiosPromise}
   * @constructor
   */
  AGetWhlist () {
    return request({
      url: 'wh_storage_bin/whlist',
      method: 'post',
      data: {}
    })
  },
  /**
   * 根据仓库获取存储类型
   * @param whCode
   * @returns {AxiosPromise}
   * @constructor
   */
  AGetAllStorageTypeList (whCode) {
    return request({
      url: 'wh_storage_bin/get_all_storage_type_list',
      method: 'post',
      data: {
        whCode: whCode
      }
    })
  },
  /**
   * 根据仓库存储类型获取存储区
   * @param whCode
   * @param typeCode
   * @returns {AxiosPromise}
   * @constructor
   */
  AGetWhStorageSectionList (whCode, typeCode) {
    return request({
      url: 'wh_storage_bin/wh_storage_section_list',
      method: 'post',
      data: {
        whCode: whCode,
        typeCode: typeCode
      }
    })
  },
  /**
   * 获取仓库数据
   * @returns {AxiosPromise}
   */
  AGetWhlistInDetail () {
    return request({
      url: 'wh_storage_bin/whlist',
      method: 'post',
      data: {}
    })
  },
  /**
   * 仓位类型和拣货区查询
   * @returns {AxiosPromise}
   * @constructor
   */
  AGetBinTypeAndPickArea () {
    return request({
      url: 'wh_storage_bin/get_all_drop_down_list',
      method: 'post',
      data: {}
    })
  },
  /**
   * 获取详情
   * @param data { whCode, typeCode, binCode }
   * @returns {AxiosPromise}
   * @constructor
   */
  AGetDetail (data) {
    return request({
      url: 'wh_storage_bin/get_wh_storage_bin_info',
      method: 'post',
      data: data
    })
  },
  /**
   * 删除
   * @param data
   * @returns {AxiosPromise}
   * @constructor
   */
  ADelete (data) {
    return request({
      url: 'wh_storage_bin/delete',
      method: 'post',
      data: data
    })
  },
  /**
   * 添加, 更新
   * @param data
   * @returns {AxiosPromise}
   */
  ASave (data) {
    return request({
      url: 'wh_storage_bin/save',
      method: 'post',
      data: data
    })
  },
  /**
   * 批量修改
   * @param data
   * @returns {AxiosPromise}
   * @constructor
   */
  ABatchUpdate (data) {
    return request({
      url: 'wh_storage_bin/batch_maintenance',
      method: 'post',
      data: data
    })
  }
}
