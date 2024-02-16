/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-11 09:23:43
 * @Description: 任务管理
 */
import request from "../api.request";

export var API = {
    // MQ消息重发 - 获取列表
    AGetMQList(data) {
        return request({
          url: 'mq_retry/get_retry_list',
          method: 'post',
          data: data
        });
    },
  /**
   * MQ消息重发 - 重新发送
   * @param retryCode
   * @returns {AxiosPromise}
   * @constructor
   */
  AReSend(retryCode) {
    return request({
      url: 'mq_retry/retry',
      method: 'post',
      data: {
        retryCode: retryCode
      }
    });
  },
  // 定时任务管理 - 获取列表
  AGetScheduleList(data) {
    return request({
      url: 'cron/get_job_list',
      method: 'post',
      data: {}
    });
  },
  // 定时任务管理 - 定时任务开启
  AScheduleStart(jobName) {
    return request({
      url: 'cron/start',
      method: 'post',
      data: {
        jobName: jobName
      }
    });
  },
  // 定时任务管理 - 定时任务关闭
  AScheduleStop(jobName) {
    return request({
      url: 'cron/stop',
      method: 'post',
      data: {
        jobName: jobName
      }
    });
  },
};
