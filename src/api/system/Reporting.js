/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-09 15:40:37
 * @Description: 报表查询
 */
import request from "../api.request";

export var API = {
  // Physical Inventory
  AGetListPI (data) {
    return request({
      url: 'query/query_stock_on_paging',
      method: 'post',
      data: data
    });
  },
  // bin Inventory
  AGetListPI1 (data) {
    return request({
      url: 'query/query_stock_on_paging1',
      method: 'post',
      data: data
    });
  },
  // User physical Moving Report
  AGetListPM (data) {
    return request({
      url: 'query/ins_doc_bin',
      method: 'post',
      data: data
    });
  },
  // Aging Report
  AGetListAG (data) {
    return request({
      url: 'query/sinobec_stock_info',
      method: 'post',
      data: data
    });
  },
  AGetListInComing (data) {
    return request({
      url: 'query/incoming',
      method: 'post',
      data: data
    });
  },
  AGetListInVoiced (data) {
    return request({
      url: 'query/invoiced',
      method: 'post',
      data: data
    });
  },
  AGetListTransferCrop (data) {
    return request({
      url: 'query/transfer_corp',
      method: 'post',
      data: data
    });
  }
};
