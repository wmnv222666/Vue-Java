import defaultLang from './lang/zh-CN'
import Vue from 'vue'
import deepmerge from 'deepmerge'
import Format from './format'

var format = Format(Vue)
var lang = defaultLang
var merged = false
var i18nHandler = function () {
  var vuei18n = Object.getPrototypeOf(this || Vue).$t
  if (typeof vuei18n === 'function' && !!Vue.locale) {
    if (!merged) {
      merged = true
      Vue.locale(
        Vue.config.lang,
        deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true })
      )
    }
    return vuei18n.apply(this, arguments)
  }
}

export var t = function (path, options) {
  var value = i18nHandler.apply(this, arguments)
  if (value !== null && value !== undefined) return value

  var array = path.split('.')
  var current = lang

  for (var i = 0, j = array.length; i < j; i++) {
    var property = array[i]
    value = current[property]
    if (i === j - 1) return format(value, options)
    if (!value) return ''
    current = value
  }
  return ''
}

export var use = function (l) {
  lang = l || lang
}

export var i18n = function (fn) {
  i18nHandler = fn || i18nHandler
}

export default { use, t, i18n }
