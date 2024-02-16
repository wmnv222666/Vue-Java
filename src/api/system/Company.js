/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-10 11:05:58
 * @Description: 公司管理
 */
import request from '../api.request'

export var API = {
    AGetList(data) {
        return request({
            url: 'dic/corp/query_list',
            method: 'post',
            data: data
        })
    },
    /**
     * 获取语言类别
     * @returns {AxiosPromise}
     */
    ALanguageList() {
        return request({
            url: 'dic/language/language_list',
            method: 'get',
            data: {}
        })
    },
    /**
     * 获取板块列表
     * @returns {AxiosPromise}
     */
    AGetBoardList() {
        return request({
            url: 'dic/board/list',
            data: {},
            method: 'get'
        })
    },
    /**
     * 获取详情
     * @param corpCode 公司编码
     * @returns {AxiosPromise}
     */
    AGetDetailByCorpCode(corpCode) {
        return request({
            url: 'dic/corp/query/' + corpCode,
            data: {},
            method: 'get'
        })
    },
    /**
     * 删除公司
     * @param corpCode 公司编码
     * @returns {AxiosPromise}
     */
    ADeleteCrop(corpCode) {
        return request({
            url: 'dic/corp/remove/' + corpCode,
            data: {},
            method: 'get'
        })
    },
    /**
     * 添加公司
     * @param data
     * @returns {AxiosPromise}
     */
    AAddCrop(data) {
        return request({
            url: 'dic/corp/add',
            method: 'post',
            data: data
        })
    },
    /**
     * 更新公司
     * @param data
     * @returns {AxiosPromise}
     */
    AUpdateCrop(data) {
        return request({
            url: 'dic/corp/update',
            method: 'post',
            data: data
        })
    }
}
