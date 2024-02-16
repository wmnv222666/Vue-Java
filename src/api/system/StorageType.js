/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-11 09:23:43
 * @Description: 存储类型管理
 */
import request from "../api.request";

export var API = {
    AGetList(data) {
        return request({
            url: 'wh_storage_type/get_wh_storage_type_list',
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
     * 入库、出库、能力检查查询
     * @returns {AxiosPromise}
     */
    AGetAllStrategyList() {
        return request({
            url: 'wh_storage_type/get_all_strategy_list',
            data: {},
            method: 'post'
        });
    },
    /**
     * 统计单位查询
     * @returns {AxiosPromise}
     */
    ASelectFixedUnitList() {
        return request({
            url: 'unit/select_fixed_unit_list',
            data: {},
            method: 'post'
        });
    },
    /**
     * 仓库查询
     * @returns {AxiosPromise}
     */
    AGetWhList() {
        return request({
            url: 'wh_storage_type/get_wh_list',
            method: 'post',
            data: {}
        });
    },
    /**
     * 获取详情
     * @param whCode
     * @param typeCode
     * @returns {AxiosPromise}
     * @constructor
     */
    AGetDetail(whCode, typeCode) {
        return request({
            url: 'wh_storage_type/get_wh_storage_type_info',
            method: 'post',
            data: {
                typeCode: typeCode,
                whCode: whCode
            }
        });
    },
    /**
     * 删除
     * @param data
     * @returns {AxiosPromise}
     * @constructor
     */
    ADelete(whCode, typeCode) {
        return request({
            url: 'wh_storage_type/delete',
            method: 'post',
            data: {
                typeCode: typeCode,
                whCode: whCode
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
            url: "wh_storage_type/save",
            method: "post",
            data: data
        });
    }
};
