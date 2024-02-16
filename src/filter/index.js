import { dateFormat } from '@/libs/assist'
let importFilter = Vue => {
  Vue.filter('date', dateFormat)
}
export default importFilter
