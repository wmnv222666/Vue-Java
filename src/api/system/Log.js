/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-11 09:23:43
 * @Description: 日志查询
 */
import request from "../api.request";

export var API = {
    // 登录日志查询
    AGetLoginList(data) {
        return request({
          url: 'aop_syslog/login_log/get_login_log',
          method: 'post',
          data: data
        });
    },
  // 接口日志查询
  AGetInterfaceList(data) {
    return request({
      url: 'aop_syslog/interface_log/get_interface_call_log',
      method: 'post',
      data: data
    });
  },
  // 操作日志查询
  AGetOperationList(data) {
    return request({
      url: 'aop_syslog/operation_log/get_receipt_operation_log',
      method: 'post',
      data: data
    });
  },
  // 异常日志查询
  AGetExceptionList(data) {
    return request({
      url: 'aop_syslog/exception_log/get_exception_log',
      method: 'post',
      data: data
    });
  },
  // SAP日志查询
  AGetSAPList(data) {
    return request({
      url: 'aop_syslog/sap_log/get_sap_log',
      method: 'post',
      data: data
    });
  },
};
