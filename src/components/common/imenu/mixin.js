import { showTitle } from '@/libs/utils'
export default {
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    },
    // showTitle (item) {
    //   return this.$config.useI18n ? this.$t(item.name) : ((item.meta && item.meta.title) || item.name)
    // },
    showChildren (item) {
      return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
    },
    getNameOrHref (item, children0) {
      return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
    }
  }
}
