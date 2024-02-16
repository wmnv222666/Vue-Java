/*
 * @Author: your name
 * @Date: 2020-03-23 08:54:09
 * @LastEditTime: 2020-06-19 12:17:45
 * @LastEditors: JiangXiao
 * @Description: In User Settings Edit
 * @FilePath: \sinobec\src\api\common\index.js
 */
import request from '../api.request'

export var CAPI = {
  /**
   * 获取仓位下拉
   * @param whCodeList
   * @returns {AxiosPromise}
   * @constructor
   */
  AGetBinList (whCode) {
    var sendData = whCode ? [whCode] : []
    return request({
      url: 'auth/get_bin_list',
      method: 'post',
      data: sendData
    })
  },
  /**
   * 获取非空仓位下拉
   * @param whCodeList
   * @returns {AxiosPromise}
   * @constructor
   */
   AGetNotEmptyBinList (whCode) {
    var sendData = whCode ? [whCode] : []
    return request({
      url: 'auth/get_bin_list_no_empty',
      method: 'post',
      data: sendData
    })
  },
  /**
   * 获取公司下拉
   * @constructor
   */
  AGetCropList () {
    return request({
      url: 'dic/corp/data_list',
      method: 'get',
      data: {}
    })
  },
  /**
   * 获取所有公司下拉
   * @constructor
   */
  AGetCropListAll () {
    return request({
      url: 'pre/get_all_corp',
      method: 'get',
      data: {}
    })
  },

  AGetSkuListAll () {
    return request({
      url: 'pre/get_all_sku',
      method: 'get',
      data: {}
    })
  },
  AGetMfgidListAll(){
    return request({
      url: '/output/get_all_mfgid',
      method: 'get',
      data: {}
    })
  },
  /**
   * 邮件发送
   * @constructor
   */
  ASendEmail (data) {
    return request({
      url: 'send/single_email',
      method: 'post',
      data: data
    })
  },
  /**
   * 物料打印
   * @param data
   * @returns {AxiosPromise}
   * @constructor
   */
  APrintMat (data) {
    return request({
      url: 'sinobec/print/mat',
      method: 'post',
      data: data
    })
  },
  /**
   * 仓位打印
   * @param data
   * @returns {AxiosPromise}
   * @constructor
   */
  APrintBin (data) {
    return request({
      url: 'sinobec/print/bin',
      method: 'post',
      data: data
    })
  },
  APrintMatKZ (data) {
    return request({
      url: 'sinobec/print/carton',
      method: 'post',
      data: data
    })
  }
}
