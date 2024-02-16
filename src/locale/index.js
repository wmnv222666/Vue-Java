/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-07 10:37:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-08 15:06:05
 * @Description: 国际化
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {
    localRead
} from '@/libs/utils'
import zhCnLocale from './locale/lang/zh-CN'
import enUsLocale from './locale/lang/en-US'

import zhCnLocaleVXE from './locale/vxe/zh-CN'
import enUsLocaleVXE from './locale/vxe/en-US'

import customZhCnJSON from './zh.json'
import customEnUsJSON from './en.json'
Vue.use(VueI18n)

// 自动根据浏览器系统语言设置语言
var navLang = navigator.language
var localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
// var lang = localLang || localRead('local') || 'en-US'
var lang = localRead('xlocal') || 'en-US'

Vue.config.lang = lang

// vue-i18n 6.x+写法
Vue.locale = () => {}
var messages = {
    'zh-CN': Object.assign(zhCnLocale, zhCnLocaleVXE, customZhCnJSON),
    'en-US': Object.assign(enUsLocale, enUsLocaleVXE, customEnUsJSON)
}

var i18n = new VueI18n({
    locale: lang,
    messages,
    silentTranslationWarn: true
})

export default i18n
