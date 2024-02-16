/*
 * @Author: your name
 * @Date: 2020-05-20 16:47:35
 * @LastEditTime: 2020-05-29 14:47:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SaaS_web\src\comps\index.js
 */
import xIcon from '@/components/icon'
import searchIn from '@/components/xsearchin'
import ElInputNumber from '@/components/input-number'
import XVXEPager from '@/components/x-vxe-pager'
import XVXEPager48 from '@/components/x-vxe-pager-48'
import XSearchHeader from '@/components/x-search-header'
let importComponents = Vue => {
  Vue.component('xIcon', xIcon)
  Vue.component('searchIn', searchIn)
  Vue.component('ElInputNumber', ElInputNumber)
  Vue.component('x-vxe-pager', XVXEPager)
  Vue.component('x-vxe-pager-48', XVXEPager48)
  Vue.component('x-search-header', XSearchHeader)
}
export default importComponents
