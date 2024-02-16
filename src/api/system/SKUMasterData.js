/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-11 09:23:43
 * @Description: 物料主数据管理
 */
import request from "../api.request";

export var API = {
    AGetList(data) {
        return request({
          url: 'mat/get_material_list',
          method: 'post',
          data: data
        });
    },
    /**
     * 获取语言类别
     * @returns {AxiosPromise}
     */
    ALanguageList() {
        return request({
            url: "dic/language/language_list",
            data: {},
            method: "get"
        });
    },
    /**
     * 物料类型、物料组、计量单位下拉查询
     * @returns {AxiosPromise}
     */
    AGetSKUTypeGroupUnit() {
        return request({
          url: 'mat/get_material_info/null',
          method: 'get',
          data: {}
        });
    },
  /**
   * 获取详情
   * @param matCode
   * @returns {AxiosPromise}
   * @constructor
   */
    AGetDetail(matCode) {
        return request({
          url: 'mat/get_material_info/' + matCode,
          data: {},
          method: 'get'
        });
    },
  /**
   * 删除
   * @param matCode
   * @returns {AxiosPromise}
   * @constructor
   */
    ADelete(matCode) {
        return request({
          url: 'mat/delete_material/' + matCode,
          data: {},
          method: 'get'
        });
    },
    /**
     * 添加, 更新
     * @param data
     * @returns {AxiosPromise}
     */
    ASave(data) {
        return request({
            url: "mat/save_material",
            method: "post",
            data: data
        });
    },
  /**
   * 获取物料仓库
   * @param matCode
   * @returns {AxiosPromise}
   */
  AGetMaterialWhList(matCode) {
    return request({
      url: 'mat/get_material_wh_list/' + matCode,
      data: {},
      method: 'get'
    });
  },
  /**
   * 保存物料仓库
   * @param data
   * @returns {AxiosPromise}
   */
  ASaveMaterialWhList(data) {
    return request({
      url: 'mat/save_material_wh',
      method: 'post',
      data: data
    });
  },
  /**
   * 同步物料
   * @param matCode
   * @returns {AxiosPromise}
   */
  AAsyncMaterial(matCode) {
    return request({
      url: 'mat/dic_material_synchronization/' + matCode,
      method: 'get'
    });
  }
};
