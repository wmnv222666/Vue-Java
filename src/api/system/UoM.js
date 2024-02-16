/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-11 09:23:43
 * @Description: 计量单位管理
 */
import request from "../api.request";

export var API = {
    AGetList(data) {
        return request({
          url: 'unit/get_unit_list',
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
     * 获取详情
     * @param unitCode
     * @returns {AxiosPromise}
     * @constructor
     */
    AGetDetail(unitCode) {
        return request({
          url: 'unit/get_unit_view',
          method: 'post',
          data: {
            unitCode: unitCode
          }
        });
    },
    /**
     * 删除
     * @param unitCode
     * @returns {AxiosPromise}
     * @constructor
     */
    ADelete(unitCode) {
        return request({
          url: 'unit/delete',
          method: 'post',
          data: {
            unitCode: unitCode
          }
        });
    },
    /**
     * 添加, 更新
     * @param data
     * @returns {AxiosPromise}
     */
    ASave(data) {
        return request({
          url: 'unit/save',
          method: 'post',
            data: data
        });
    }
};
