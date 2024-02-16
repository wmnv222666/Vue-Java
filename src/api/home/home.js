/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-07 14:11:49
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-09 10:52:26
 * @Description:
 */
import request from '../api.request'

export var API = {
    AQueryCount() {
        return request({
            url: 'auth/count/0',
            method: 'get',
            data: {},
            notLoading: true
        })
    },
    AGetNewNotice() {
        return request({
            url: 'auth/get_new_notice',
            method: 'post',
            data: {},
            notLoading: true
        })
    },
    AGetNoticeList() {
        return request({
            url: 'auth/get_home_notice_list',
            method: 'post',
            data: {},
            notLoading: true
        })
    },
    AGetToDoList() {
        return request({
            url: 'auth/get_todo_list/0',
            method: 'get',
            data: {},
            notLoading: true
        })
    }
}
