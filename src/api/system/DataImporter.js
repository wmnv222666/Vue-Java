/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-16 10:44:27
 * @Description: 数据导入
 */
import request from "../api.request";

export var API = {
  importDataListUser (data) {
    return request({
      url: 'sys_user/save_sys_users',
      method: 'post',
      data: data
    });
  },
  importDataListCompany (data) {
    return request({
      url: 'dic/corp/adds',
      method: 'post',
      data: data
    });
  },
  importDataListWarehouse (data) {
    return request({
      url: 'wh/saves',
      method: 'post',
      data: data
    });
  },
  importDataListZone (data) {
    return request({
      url: 'wh_storage_type/saves',
      method: 'post',
      data: data
    });
  },
  importDataListLocation (data) {
    return request({
      url: 'wh_storage_bin/saves',
      method: 'post',
      data: data
    });
  },
  importDataListItem (data) {
    return request({
      url: 'mat/save_materials',
      method: 'post',
      data: data
    });
  },
  importDataListUoM (data) {
    return request({
      url: 'unit/saves',
      method: 'post',
      data: data
    });
  },
  importDataListPhysical (data) {
    return request({
      url: 'save/pda_stock',
      method: 'post',
      data: data
    });
  },
  importDataListGR (data) {
    return request({
      url: 'sinobec/input/upload_saas',
      method: 'post',
      data: { inputGPList: data }
    })
  },
  importDataListPick (data) {
    return request({
      url: 'task/un_load_shelf/upload_saas',
      method: 'post',
      data: { outputGPList: data }
    })
  },
};
