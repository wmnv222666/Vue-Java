/** Date: 2018/11/6 ; Author: 姜啸 **/
import unZip from 'pako'
import has from 'lodash.has'
import { getCookie } from '@/libs/utils'
import calculate from './precision'
import { Notice } from 'view-design'

export function formatSelectOption(options = [], value, label, isKV = false) {
  return options.map(function(item) {
    return {
      value: item[value] || '',
      label: isKV ? item[value] + ' - ' + item[label] : item[label]
    }
  })
}

export function defaultSymbol(item, defaultSymbol = '--') {
  if (item === 0) {
    return 0
  } else {
    return item || defaultSymbol
  }
}

export function formatLocationSelection (options = []) {
  return options.map(function(item) {
    return {
      locationCode: item.locationCode,
      locationName: item.locationName,
      disabled: !item.whCode,
      whCode: item.whCode,
      whName: item.whName,
      ftyCode: item.ftyCode,
      binEnabled: item.binEnabled,
      freezeInput: item.freezeInput,
      freezeOutput: item.freezeOutput,
      taskInput: item.taskInput,
      taskOutput: item.taskOutput
    }
  })
}
// 后台接口压缩处理函数
export function decodeUTF8(str){
  var rs = ''
  for(var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i)
    if((240 & code) == 240) {
      var code1 = str.charCodeAt(i + 1),
        code2 = str.charCodeAt(i + 2),
        code3 = str.charCodeAt(i + 3)
      rs += String.fromCodePoint(((code & 7) << 18) | ((code1 & 63) << 12) | ((code2 & 63) << 6) | (code3 & 63))
      i += 3;
    } else if((224 & code) == 224) {
      var code1 = str.charCodeAt(i + 1),
        code2 = str.charCodeAt(i + 2)
      rs += String.fromCodePoint(((code & 15) << 12) | ((code1 & 63) << 6) | (code2 & 63))
      i += 2
    } else if((192 & code) == 192) {
      var code1 = str.charCodeAt(i + 1)
      rs += String.fromCodePoint(((code & 31) << 6) | (code1 & 63))
      i++
    } else if((128 & code) == 0) {
      rs += String.fromCharCode(code)
    }
  }
  return rs
}

export function unZipByPako (b64Data) {
  var strData = atob(b64Data)

  var charData = strData.split('').map(function(x){return x.charCodeAt(0);})

  var binData = new Uint8Array(charData)

  var data = unZip.inflate(binData)

  // strData = String.fromCharCode.apply(null, new Uint16Array(data))

  var array = new Uint16Array(data), res = '', chunk = 8 * 1024, i
  for (i = 0; i < array.length / chunk; i++) {
    res += String.fromCharCode.apply(null, array.slice(i * chunk, (i + 1) * chunk));
  }
  res += String.fromCharCode.apply(null, array.slice(i * chunk));

  strData = res

  //  String.fromCharCode.apply 不能接受过长的数组，需要将数组进行拆分->解压->拼接。

  var obj = decodeUTF8(strData)

  return obj
}

// 获取项目请求接口
export function getProUri (vue, url) {
  let baseUrl = process.env.NODE_ENV === 'development' ? GLOBALCONFIG.devRequestPath : GLOBALCONFIG.proRequestPath
  var customConfiguration = getCookie('xip')
  return customConfiguration ? customConfiguration + GLOBALCONFIG.requestPrefixPath + url : baseUrl + url
}
export function getProUriApi() {
  let bUrl = process.env.NODE_ENV === 'development' ? GLOBALCONFIG.devRequestPath : GLOBALCONFIG.proRequestPath
  var customConfiguration = getCookie('xip')
  return customConfiguration ? customConfiguration + GLOBALCONFIG.requestPrefixPath : bUrl
}

/**
 * 将数值四舍五入(保留decimalPlace位小数)后格式化千分位
 *
 * @param num 数值(Number或者String)
 * @param n 保留小数点位数(Number或者String)
 * @param isFormat 是否格式化
 * @return 格式化的字符串,如'1,234,567.4'
 * @type String
 */
export function toFixed (num, n = 2, isFormat = false) {
  var symbol = 1
  if (num < 0) { symbol = -1; num *= -1 }
  var numNew = (Math.round(num * Math.pow(10, n)) / Math.pow(10, n) + Math.pow(10, -(n + 1))).toString().slice(0, -1)
  numNew = parseFloat(numNew * symbol).toFixed(n)
  if (isFormat) {
    return numNew.replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
  } else {
    return numNew
  }
}

export function getCurrentPage (pageNo, pageSize, array) {
  var len = array.length
  var offset = (pageNo - 1) * pageSize;
  var offSize = offset + pageSize;
  return (offSize >= len) ? array.slice(offset, len) : array.slice(offset, offSize);
}

export function genID(length){
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}

// 浮点数加法
export function sumBy (itemList, _key) {
  // 浮点数加法
  var result = 0
  for (let i = 0; i < itemList.length; i++) {
    let _v = has(itemList[i], _key) ? itemList[i][_key] == undefined ? 0 : Number(itemList[i][_key]) : 0
    result = calculate.plus(result, _v)
  }
  return result
}

// 扁平化一维数据分组
export function grouping (data = [], field = 'group') {
  let result = {}
  data.forEach(item => {
    let group = item[field]
    if (group) {
      if (!result[group]) {
        result[group] = []
      }
      result[group].push(item)
    }
  })
  return result
}

/*
* 批量删除
* every方法，只要有一项不满足条件就返回false，也就是说必须每一项都得满足才能返回true。返回的是布尔值。
* filter方法，只要条件满足，我就将此元素返回出去，返回的是元素。
* 在本示例中，只要arr1中存在与arr2中相同的元素，我就返回false。也就是说，我拿着arr2中
* 的第一项去和arr1中的每一项去比较，如果code都不相等，满足所有条件，我就返回true。
* 在filter中，只要条件为true，我就将这一项返回出去，就实现了批量删除的效果。
*/
export function batchDelete (arr, section, key) {
  return arr.filter(item => {
    return section.every(item2 => {
      return item[key] !== item2[key];
    })
  })
}

// 思路：获取没重复的最右一值放入新数组
/*
* 推荐的方法
*
* 方法的实现代码相当酷炫，
* 实现思路：获取没重复的最右一值放入新数组。
* （检测到有重复值时终止当前循环同时进入顶层循环的下一轮判断）*/
export function unique (array) {
  var temp = [];
  var l = array.length;
  for(var i = 0; i < l; i++) {
    for(var j = i + 1; j < l; j++){
      if (array[i] === array[j]){
        i++;
        j = i;
      }
    }
    temp.push(array[i]);
  }
  return temp;
}

// 数组去重
export function uniqueArray (oldArr = [], _key) {
  var allArr = [] // 新数组
  for (var i = 0; i < oldArr.length; i++) {
    var flag = true
    for (var j = 0; j < allArr.length; j++) {
      if (oldArr[i][_key] == allArr[j][_key]) {
        flag = false
      }
    }
    if (flag) { allArr.push(oldArr[i]) }
  }
  return allArr
}

// 去除一个数组中与另一个数组中的值相同的元素
export function array_diff (a, b, _key = '__ids') {
  for (var i = 0; i < b.length; i++) {
    for (var j = 0; j < a.length; j++) {
      if (a[j][_key] === b[i][_key]) {
        a.splice(j, 1)
        j = j - 1
      }
    }
  }
  return a
}

// 数组对象合并去重
export function mergeArray (arr1, arr2, _key = '__ids') {
  var _arr = arr1;
  for(var i = 0;i < arr2.length;i++){
    var flag = true;
    for(var j = 0;j < arr1.length;j++){
      if(arr2[i][_key] === arr1[j][_key]){
        flag = false;
        break;
      }
    }
    if(flag){
      _arr.push(arr2[i]);
    }
  }
  return _arr;
}

export const dateFormat = (value) => {
  let regValue = /\d{4}-\d{1,2}-\d{1,2}/g
  let matchValue = regValue.exec(value)

  if (value && matchValue.length) {
    return matchValue[0]
  } else {
    return '--'
  }
}

export function dateFt (fmt, date) {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}

/* istanbul ignore next */
export function addClass (el, cls) {
  if (!el) return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

function css (e, t, a) {
  if (arguments.length == 2) {
    if (t == 'scale' || t == 'rotate' || t == 'rotateX' || t == 'rotateY' || t == 'rotateZ' || t == 'scaleX' || t == 'scaleY' || t == 'translateY' || t == 'translateX' || t == 'translateZ') {
      switch (e.$Transform || (e.$Transform = {}),
      t) {
        case 'scale':
        case 'scaleX':
        case 'scaleY':
          return typeof e.$Transform[t] == 'number' ? e.$Transform[t] : 100
        case 'translateY':
        case 'translateX':
        case 'translateZ':
          return e.$Transform[t] ? e.$Transform[t] : 0
        default:
          return e.$Transform[t] ? e.$Transform[t] : 0
      }
    }
    var n = e.currentStyle ? e.currentStyle[t] : document.defaultView.getComputedStyle(e, !1)[t]
    return t == 'opacity' ? Math.round(100 * parseFloat(n)) : parseInt(n)
  }
  if (arguments.length == 3) {
    switch (t) {
      case 'scale':
      case 'scaleX':
      case 'scaleY':
      case 'rotate':
      case 'rotateX':
      case 'rotateY':
      case 'rotateZ':
      case 'translateY':
      case 'translateX':
      case 'translateZ':
        setCss3(e, t, a)
        break
      case 'width':
      case 'height':
      case 'paddingLeft':
      case 'paddingTop':
      case 'paddingRight':
      case 'paddingBottom':
        a = Math.max(a, 0)
      case 'left':
      case 'top':
      case 'right':
      case 'bottom':
      case 'marginLeft':
      case 'marginTop':
      case 'marginRight':
      case 'marginBottom':
        e.style[t] = typeof a == 'string' ? a : a + 'px'
        break
      case 'opacity':
        e.style.filter = 'alpha(opacity:' + a + ')',
        e.style.opacity = a / 100
        break
      default:
        e.style[t] = a
    }
  }
  return function (t, a) {
    css(e, t, a)
  }
}
function setCss3 (e, t, a) {
  var n = '',
    r = '',
    s = ['Webkit', 'Moz', 'O', 'ms', '']
  e.$Transform || (e.$Transform = {}),
  e.$Transform[t] = parseInt(a)
  for (n in e.$Transform) {
    switch (n) {
      case 'scale':
      case 'scaleX':
      case 'scaleY':
        r += n + '(' + e.$Transform[n] / 100 + ') '
        break
      case 'rotate':
      case 'rotateX':
      case 'rotateY':
      case 'rotateZ':
        r += n + '(' + e.$Transform[n] + 'deg) '
        break
      case 'translateY':
      case 'translateX':
      case 'translateZ':
        r += n + '(' + e.$Transform[n] + 'px) '
    }
  }
  for (var c = 0; c < s.length; c++) { e.style[s[c] + 'Transform'] = r }
}

export { css }

export function trim (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

export function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/* istanbul ignore next */
export function removeClass (el, cls) {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ')
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

// 判断参数是否是其中之一
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

function camelCase (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter
  }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

// getStyle
export function getStyle (element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const computed = document.defaultView.getComputedStyle(element, '')
    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

// Find components upward
function findComponentUpward (context, componentName, componentNames) {
  if (typeof componentName === 'string') {
    componentNames = [componentName]
  } else {
    componentNames = componentName
  }

  let parent = context.$parent
  let name = parent.$options.name
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent
    if (parent) name = parent.$options.name
  }
  return parent
}

export { findComponentUpward }

// Find components downward
export function findComponentsDownward (context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child)
    const foundChilds = findComponentsDownward(child, componentName)
    return components.concat(foundChilds)
  }, [])
}

// Find components upward
export function findComponentsUpward (context, componentName) {
  let parents = []
  const parent = context.$parent
  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent)
    return parents.concat(findComponentsUpward(parent, componentName))
  } else {
    return []
  }
}

function typeOf (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

// deepCopy
function deepCopy (data) {
  const t = typeOf(data)
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (let i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}

export { deepCopy }

let cached

export function getScrollBarSize (fresh) {
  // if (isServer) return 0;
  if (fresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthScroll
  }
  return cached
}

export function downloadFile (opts, content) {
  const { filename, type, download } = opts
  const name = `${filename}.${type}`
  if (window.Blob) {
    const blob = new Blob([content], { type: `text/${type}` })
    if (!download) {
      return Promise.resolve({ type, content, blob })
    }
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, name)
    } else {
      const linkElem = document.createElement('a')
      linkElem.target = '_blank'
      linkElem.download = name
      linkElem.href = URL.createObjectURL(blob)
      document.body.appendChild(linkElem)
      linkElem.click()
      document.body.removeChild(linkElem)
    }
    if (opts.message !== false) {
      Notice.success({ desc: 'success' })
    }
  } else {
    Notice.error('error')
  }
}