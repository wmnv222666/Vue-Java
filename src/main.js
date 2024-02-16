/*
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-07 10:37:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-12 17:38:21
 * @Description:
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@babel/polyfill'
import 'core-js/modules/es6.array.for-each'
import 'core-js/modules/es6.array.map'
import 'core-js/modules/es6.array.filter'
import 'core-js/modules/es6.array.find'
import 'core-js/modules/es6.array.find-index'
import 'core-js/modules/es6.array.reduce-right'
import 'core-js/modules/es6.array.some'
import 'core-js/modules/es6.array.every'
import 'core-js/modules/es6.string.includes'
import 'core-js/modules/es6.object.assign'
import 'core-js/modules/es7.array.includes'

import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store'
import i18n from '@/locale'
import iView from 'view-design'

import importFilter from '@/filter'
import importComponents from '@/comps'
import vueProtoType from '@/vueProtoType'

// [ 基础组件 ] 大数据表格
import 'xe-utils'
import VXETable from 'vxe-table'
import VXETablePluginIView from './assets/js/vxe-table-plugin-iview'
import 'vxe-table/lib/index.css'

import './assets/css/bootastrap-instock.css' // 管理后台框架基础样式
import './assets/css/view-design.css' // view-design 组件基础样式
import './assets/infonts/iconfont.css' // INS 字体
import './assets/css/instock-x-skin.css' // INS 皮肤

// [ 可扩展插件 ]
// 右键菜单
// import contentmenu from 'v-contextmenu'
// import 'v-contextmenu/dist/index.css'
// 剪切板
// import VueClipboard from 'vue-clipboard2'
// JSON格式化显示
import JsonViewer from 'vue-json-viewer'
// 树状表格
// import TreeTable from './assets/js/tree-table-vue'

// 数据表格装载
Vue.use(VXETable, {
    // i18n: key => i18n.t(key)
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
})

// viewUI装载
VXETable.use(VXETablePluginIView)

// 可扩展全局插件
// Vue.use(TreeTable)
// Vue.use(VueClipboard)
// Vue.use(contentmenu)
Vue.use(JsonViewer)

/**
 * @description 注册全局组件
 */
importComponents(Vue)
    /**
     * @description 注册过滤器
     */
importFilter(Vue)
    /**
     * @description 添加原型方法
     */
vueProtoType(Vue)
    /**
     * @description 生产环境关掉提示
     */
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
})
