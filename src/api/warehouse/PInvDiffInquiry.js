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
      url: 'stock_take/diff/get_stock_take_list',
      method: 'post',
      data: data
    })
  },
  // 查询获取盘点明细
  AGetDetailByCode (code) {
    return request({
      url: `stock_take/diff/get_stock_take_mat_info/${code},`,
      method: 'get',
      data: {}
    })
  },
  // 全部重盘
  AReInventory (code) {
    return request({
      url: 'stock_take/diff/re_inventory/' + code,
      method: 'get',
      data: {}
    })
  },
  // 查看差异
  AGetDifferenceList (data) {
    return request({
      url: 'stock_take/diff/get_difference_list',
      method: 'post',
      data: data
    })
  },
  // 完成
  ACompleteDifferenceList (code) {
    return request({
      url: `stock_take/diff/update_status/${code}`,
      method: 'get',
      data: {}
    })
  },
  // 仓位差异处理
  ABinDifferenceHandle (data) {
    return request({
      url: 'stock_take/diff/bin_difference_handle',
      data: data,
      method: 'post'
    })
  },
  // 批次差异处理
  ABatchDifferenceHandle (data) {
    return request({
      url: 'stock_take/diff/batch_difference_handle',
      data: data,
      method: 'post'
    })
  },
  // 重新盘点
  ADiffReInventory (data) {
    return request({
      url: 'stock_take/diff/difference_re_inventory',
      data: data,
      method: 'post'
    })
  }
}
