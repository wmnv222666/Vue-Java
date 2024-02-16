/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-09 17:11:37
 * @Description: 用户管理
 */
import request from '../api.request'

export var API = {
    AGetList(data) {
        return request({
            url: 'sys_role/get_sys_role_list',
            method: 'post',
            data: data
        })
    },
    /**
     * 批量删除角色
     * @param data
     * @returns {AxiosPromise}
     */
    ABatchDelRole(data) {
        return request({
            url: 'sys_role/save_sys_roles_delete',
            method: 'post',
            data: data
        })
    },
    /**
     * 获取资源权限列表
     * @returns {AxiosPromise}
     */
    AGetAllResourcesList() {
        return request({
            url: 'sys_role/get_all_resources_list',
            data: {},
            method: 'get'
        })
    },
    /**
     * 角色详情
     * @param roleCode 角色编码
     * @returns {AxiosPromise}
     */
    AGetSysRoleInfo(roleCode) {
        return request({
            url: 'sys_role/get_sys_role_info/' + roleCode,
            data: {},
            method: 'get'
        })
    },
    /**
     * 角色修改保存
     * @param data
     * @returns {AxiosPromise}
     */
    ASaveSysRole(data) {
        return request({
            url: 'sys_role/save_sys_role',
            method: 'post',
            data: data
        })
    },
    /**
     * 获取所有角色
     * @param data
     * @returns {AxiosPromise}
     */
    AGetSysRoleUsersList(data) {
        return request({
            url: 'sys_role/get_sys_role_users_list',
            method: 'post',
            data: data
        })
    }
}
