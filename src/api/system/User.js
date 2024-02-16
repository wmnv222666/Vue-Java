/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-09 10:43:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-09 15:16:52
 * @Description: 用户管理
 */
import request from '../api.request'

export var API = {
    AGetList(data) {
        return request({
            url: 'sys_user/get_sys_user_list',
            method: 'post',
            data: data
        })
    },
    /**
     * 批量删除用户
     * @param data
     * @returns {AxiosPromise}
     */
    ABatchDelUser(data) {
        return request({
            url: 'sys_user/save_sys_users_delete',
            method: 'post',
            data: data
        })
    },
    /**
     * 批量冻结用户
     * @param data
     * @returns {AxiosPromise}
     */
    AFrozen(data) {
        return request({
            url: 'sys_user/save_sys_use_frozen_or_thaw',
            method: 'post',
            data: data
        })
    },
    /**
     * 批量解锁用户
     * @param data
     * @returns {AxiosPromise}
     */
    AUnlock(data) {
        return request({
            url: 'sys_user/save_sys_users_unlock',
            method: 'post',
            data: data
        })
    },
    /**
     * 批量重置密码
     * @param data
     * @returns {AxiosPromise}
     */
    AResetPassword(data) {
        return request({
            url: 'sys_user/update_sys_users_password_reset',
            method: 'post',
            data: data
        })
    },
    /**
     * 获取所有功能权限
     * @returns {AxiosPromise}
     */
    AGetAllSysRoleList() {
        return request({
            url: 'sys_user/get_all_sys_role_list',
            data: {},
            method: 'get'
        })
    },
    /**
     * 批量重置密码
     * @param userId
     * @returns {AxiosPromise}
     */
    AGetSysUserInfo(userId) {
        return request({
            url: 'sys_user/get_sys_user_info/' + userId,
            data: {},
            method: 'get',
        })
    },
    /**
     * 获取公司-（部门、工厂）-库存地点树
     * @returns {AxiosPromise}
     */
    AGetCorpDeptFtyLocTree() {
        return request({
            url: 'sys_user/get_corp_dept_fty_loc_tree',
            data: {},
            method: 'get',
        })
    },
    /**
     * 更新保存用户信息
     * @param userId
     * @returns {AxiosPromise}
     */
    ASaveSysUser(data) {
        return request({
            url: 'sys_user/save_sys_user',
            method: 'post',
            data: data
        })
    },
    /**
     * 更新用户密码
     * @param data
     * @returns {AxiosPromise}
     */
    AUpdatePassWord(data) {
      return request({
        url: 'sys_user/update_sys_users_password',
        method: 'post',
        data: data
      })
    }
}
