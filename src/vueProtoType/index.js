/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-07 10:38:00
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-10 10:08:34
 * @Description: 原型方法
 */
import config from '@/config'
import xHttpRequest from '@/api/api.request'
import {
    deepCopy,
    mergeArray,
    array_diff,
    formatSelectOption,
    defaultSymbol,
    getCurrentPage,
    genID,
    dateFt
} from '@/libs/assist'

import { setCookie,removeCookie,getCookie } from '@/libs/utils'

import to from '@/api/to'

var importProtoType = Vue => {
    /**
     * @description 全局注册应用配置
     */
    Vue.prototype.$config = config;
    /**
     * @description 全局请求方法
     */
    Vue.prototype.$request = xHttpRequest;
    Vue.prototype.$to = to
    Vue.prototype.$c = deepCopy;
    Vue.prototype.$mergeArray = mergeArray;
    Vue.prototype.$del = array_diff;
    Vue.prototype.$s = defaultSymbol;
    Vue.prototype.$kv = formatSelectOption
    Vue.prototype.$getPage = getCurrentPage
    Vue.prototype.$dateFt = dateFt
    Vue.prototype.$setCookie = setCookie
    Vue.prototype.$removeCookie = removeCookie
    Vue.prototype.$getCookie = getCookie
    Vue.prototype.$gid = genID
    /**
     * 是否确认弹窗
     * @param t
     */
    Vue.prototype.$confirm = function(t) {
        Vue.prototype.$Modal.confirm({
            title: '&nbsp;',
            content: t.content,
            onOk: () => {
                t.onOk && t.onOk()
            },
            onCancel: function() {
                t.onCancel && t.onCancel()
            }
        })
    }
}
export default importProtoType
