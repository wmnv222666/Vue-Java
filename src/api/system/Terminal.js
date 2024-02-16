/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-11 09:23:43
 * @Description: 终端升级管理
 */
import request from "../api.request";

export var API = {
  // 获取列表
  AGetList(data) {
    return request({
      url: 'app_upgrade/get_list',
      method: 'post',
      data: data
    });
  },
  ADel(id) {
    return request({
      url: `app_upgrade/remove/${id}`,
      data: {},
      method: 'post'
    });
  },
  ASave(data) {
    return request({
      url: 'app_upgrade/submit',
      method: 'post',
      data: data
    });
  }
};
