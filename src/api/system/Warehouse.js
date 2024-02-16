/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-10 20:49:46
 * @Description: 仓库号管理
 */
import request from '../api.request'

export var API = {
    AGetList(data) {
        return request({
            url: 'wh/select_wh_list',
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
            data: {},
            method: 'get'
        })
    },
    /**
     * 出入库顺序列表
     * @returns {AxiosPromise}
     */
    AGetWaveList() {
        return request({
            url: 'wh/get_all_task_list',
            data: {},
            method: 'post'
        })
    },
    /**
     * 获取详情
     * @param whCode 仓库号
     * @returns {AxiosPromise}
     */
    AGetDetail(whCode) {
        return request({
            url: 'wh/get_wh_info',
            method: 'post',
            data: {
                whCode: whCode
            }
        })
    },
    /**
     * 删除
     * @param whCode
     * @returns {AxiosPromise}
     */
    ADelete(whCode) {
        return request({
            url: 'wh/delete',
            method: 'post',
            data: {
                whCode: whCode
            }
        })
    },
    /**
     * 添加/更新
     * @param data
     * @returns {AxiosPromise}
     */
    AAdd(data) {
        return request({
            url: 'wh/save',
            method: 'post',
            data: data
        })
    },
    /**
     * 获取工厂列表
     * @returns {AxiosPromise}
     */
    AGetFtyList() {
        return request({
            url: 'wh/get_fty_list',
            method: 'post',
            data: {}
        })
    },
    /**
     * 获取库存地点列表
     * @returns {AxiosPromise}
     */
    AGetLocationList(ftyCode) {
        return request({
            url: 'wh/get_location_list',
            method: 'post',
            data: {
                ftyCode: ftyCode
            }
        })
    }
}
