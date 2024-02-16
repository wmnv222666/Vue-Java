/** Date: 2020/3/19 ; Author: 姜啸 **/
/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-11 09:23:43
 * @Description: 盘点管理
 */
import request from '../api.request'

export var API = {
  // 获取列表
  AGetList (data) {
    return request({
      url: 'stock_take/create/get_stock_take_list',
      method: 'post',
      data: data
    })
  },
  // 查询仓位列表
  AGetBinItemList (data) {
    return request({
      url: 'stock_take/create/get_storag_bin_list',
      method: 'post',
      data: data
    })
  },
  // 查询获取盘点明细 - 非草稿
  AGetDetailByCode (code) {
    return request({
      url: `stock_take/create/get_stock_take_mat_info/${code},0`,
      method: 'get',
      data: {}
    })
  },
  // 查询获取盘点明细 - 草稿\创建
  AGetBinInfoByCode (code) {
    return request({
      url: `stock_take/create/get_stock_take_info/${code}`,
      method: 'get',
      data: {}
    })
  },
  /**
   * 获取盘点人列表
   * @returns {AxiosPromise}
   * @constructor
   */
  AGetUserList () {
    return request({
      url: 'stock_take/create/get_user_list',
      method: 'post',
      data: {}
    })
  },
  /**
   * 删除
   * @param stockTakeCode
   * @returns {AxiosPromise}
   * @constructor
   */
  ADelete (stockTakeCode) {
    return request({
      url: `stock_take/create/delete/${stockTakeCode}`,
      method: 'get',
      data: {}
    })
  },
  /**
   * 盘点计数
   * @param data
   * @returns {AxiosPromise}
   * @constructor
   */
  ASaveOrSubmit (data) {
    return request({
      url: 'stock_take/create/save_or_update_by_bin',
      data: data,
      method: 'post',
    })
  }
}
