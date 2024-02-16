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
      url: 'stock_take/counting/get_stock_take_list',
      method: 'post',
      data: data
    })
  },
  // 查询获取盘点明细
  AGetDetailByCode (code) {
    return request({
      url: `stock_take/counting/get_stock_take_mat_info/${code},1`,
      method: 'get',
      data: {}
    })
  },
  // 查询获取盘点明细
  AGetDetailByCodeReport (takeCode,sapDocCode,typeCode,binCode,matCode,sDate,eDate) {
    return request({
      url: `stock_take/counting/get_stock_take_mat_info_from_wms_count_for_report/${takeCode}~${sapDocCode}~${typeCode}~${binCode}~${matCode}~${sDate}~${eDate}~1`,
      method: 'get',
      data: {},
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
      url: 'stock_take/counting/save_or_update_by_mat',
      data: data,
      method: 'post',
    })
  },
  /**
   * 添加盘盈
   * @param data
   * @returns {AxiosPromise}
   * @constructor
   */
  AInvSurplus (data) {
    return request({
      url: 'stock_take/counting/save_add_inventory_surplus',
      method: 'post',
      data: data
    })
  }
}
