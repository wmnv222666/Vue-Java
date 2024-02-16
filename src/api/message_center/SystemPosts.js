/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:47:21
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-09 11:07:04
 * @Description: 系统公告消息
 */
import request from '../api.request'

export var API = {
    AGetList(data) {
        return request({
            url: 'dic/notice/get_all_notice_list',
            method: 'post',
            data: data
        })
    },
    /**
     *
     * @param data {status, noticeId}
     * @returns {AxiosPromise}
     * @constructor
     */
    APublish(data) {
        return request({
            url: 'dic/notice/update_notice',
            method: 'post',
            data: data
        })
    },
    /**
     * 消息删除按行
     * @param noticeId
     * @returns {AxiosPromise}
     */
    ADelItem(noticeId) {
        return request({
            url: 'dic/notice/delete_notice',
            method: 'get',
            data: {},
            params: {
                noticeId: noticeId
            }
        })
    },
    /**
     * 消息保存
     * @Param data
     */
    ASubmitNotice(data) {
        return request({
            url: 'dic/notice/save_notice',
            method: 'post',
            data: data
        })
    },
    /**
     * 消息更新
     * @Param data
     */
    AUpdateNotice(data) {
        return request({
            url: 'dic/notice/update_notice',
            method: 'post',
            data: data
        })
    }

}
