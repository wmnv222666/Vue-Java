/** Date: 2019/2/26 ; Author: 姜啸 **/

import { addClass, removeClass, trim, css } from '@/libs/assist'
import { on, off } from '@/libs/dom'

var Tween = {
  Linear: function (t, b, c, d) { return c * t / d + b }
}

var color = {
  sub: function (str, start, len) {
    if (len) return str.substring(start, start + len)
    else return str.substring(start)
  },
  hex: function (i) { // 返回16进制颜色表示
    if (i < 0) return '00'
    else if (i > 255) return 'ff'
    else { var str = '0' + i.toString(16); return str.substring(str.length - 2) }
  },
  // 获取颜色数据
  GetColors: function (sColor) {
    sColor = sColor.replace('#', '')
    var r, g, b
    if (sColor.length > 3) {
      r = color.sub(sColor, 0, 2)
      g = color.sub(sColor, 2, 2)
      b = color.sub(sColor, 4, 2)
    } else {
      r = color.sub(sColor, 0, 1)
      g = color.sub(sColor, 1, 1)
      b = color.sub(sColor, 2, 1)
      r += r
      g += g
      b += b
    }
    return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
  }
}

var fn = {
  getElement: function (id) {
    return typeof id == 'string' ? document.getElementById(id) : id
  },
  objType: function (obj) {
    switch (Object.prototype.toString.call(obj)) {
      case '[object Object]':
        return 'Object'
      case '[object Number]':
        return 'Number'
      case '[object Array]':
        return 'Array'
    }
  },
  getStyle: function (elem, name) { //
    var w3style
    if (document.defaultView) {
      var style = document.defaultView.getComputedStyle(elem, null)
      name == 'borderWidth' ? name = 'borderLeftWidth' : name // 解决标准浏览器解析问题
      w3style = name in style ? style[name] : style.getPropertyValue(name)
      w3style == 'auto' ? w3style = '0px' : w3style
    }
    return elem.style[name] ||
      (elem.currentStyle && (elem.currentStyle[name] == 'auto' ? '0px' : elem.currentStyle[name])) || w3style
  },
  getOriCss: function (elem, cssObj) { // 此处只能获取属性值为数值类型的style属性
    var cssOri = []
    for (var prop in cssObj) {
      if (!cssObj.hasOwnProperty(prop)) continue
      // if (prop != "opacity") cssOri.push(parseInt(fn.getStyle(elem, prop)));
      // else cssOri.push(100 * fn.getStyle(elem, prop));
      if (fn.getStyle(elem, prop) == 'transparent' || /^#|rgb\(/.test(fn.getStyle(elem, prop))) {
        if (fn.getStyle(elem, prop) == 'transparent') {
          cssOri.push([255, 255, 255])
        }
        if (/^#/.test(fn.getStyle(elem, prop))) {
          cssOri.push(color.GetColors(fn.getStyle(elem, prop)))
        }
        if (/^rgb\(/.test(fn.getStyle(elem, prop))) {
          // cssOri.push([fn.getStyle(elem, prop).replace(/^rgb\(\)/g, "")]);
          var regexp = /^rgb\(([0-9]{0,3}),\s([0-9]{0,3}),\s([0-9]{0,3})\)/g
          var re = fn.getStyle(elem, prop).replace(regexp, '$1 $2 $3').split(' ')
          // cssOri.push(re); // re为字符串数组
          cssOri.push([parseInt(re[0]), parseInt(re[1]), parseInt(re[2])])
        }
      } else if (prop == 'opacity') {
        cssOri.push(100 * fn.getStyle(elem, prop))
      } else {
        cssOri.push(parseInt(fn.getStyle(elem, prop)))
      }
    }
    return cssOri
  },
  getEndCss: function (cssobj) {
    var cssEnd = []
    for (var prop in cssobj) {
      if (!cssobj.hasOwnProperty(prop)) continue
      if (prop == 'opacity') {
        cssEnd.push(100 * cssobj[prop])
      } else if (/^#/.test(cssobj[prop])) {
        cssEnd.push(color.GetColors(cssobj[prop]))
      } else {
        cssEnd.push(parseInt(cssobj[prop]))
      }
    }
    return cssEnd
  }
}

function _anim () {
  this.init.apply(this, arguments[0])
}
_anim.prototype = {
  init: function () {
    this.elem = fn.getElement(arguments[0])
    this.cssObj = arguments[1]
    this.cssOri = fn.getOriCss(this.elem, arguments[1])
    this.cssEnd = fn.getEndCss(arguments[1])
    this.durtime = arguments[2]
    this.animType = 'Tween.Linear'
    this.funObj = null
    this.start = false
    this.complete = false
    this.onPause = false
    this.onRestart = false

    if (arguments.length < 3) {
      throw new Error('至少要传入3个参数')
    } else if (arguments.length == 4) {
      if (fn.objType(arguments[3]) == 'Object') {
        this.funObj = arguments[3]
        for (var p in this.funObj) {
          if (p.toString() == 'start') this.start = true
          if (p.toString() == 'complete') this.complete = true
        }
      }
      if (typeof (arguments[3]) == 'string') {
        this.animType = arguments[3]
      }
    } else if (arguments.length == 5) {
      this.animType = arguments[3]
      if (fn.objType(arguments[4]) == 'Object') {
        this.funObj = arguments[4]
        for (var p in this.funObj) {
          if (p.toString() == 'start') this.start = true
          if (p.toString() == 'complete') this.complete = true
        }
      }
    }
    this.startAnim()
  },
  startAnim: function () {
    if (this.start) this.funObj['start'].call(this, this.elem)
    var that = this
    var t = 0
    var props = []
    for (var pro in this.cssObj) {
      if (!this.cssObj.hasOwnProperty(pro)) continue
      props.push(pro)
    }
    var tt = new Date().getTime()
    clearInterval(this.timer)
    this.timer = setInterval(function () {
      if (that.onPause) {
        clearInterval(that.timer)
        return
      }
      if (t < that.durtime / 10) {
        t++
        for (var i = 0; i < props.length; i++) {
          var b, c
          fn.objType(that.cssOri[i]) != 'Array' && (b = that.cssOri[i]) // 开始值
          fn.objType(that.cssEnd[i]) != 'Array' && (c = that.cssEnd[i] - that.cssOri[i]) // 变化量
          var d = that.durtime / 10 // 持续时间
          if (fn.objType(that.cssOri[i]) == 'Array' && fn.objType(that.cssEnd[i]) == 'Array') {
            var b1 = that.cssOri[i][0],
              b2 = that.cssOri[i][1],
              b3 = that.cssOri[i][2]
            var c1 = that.cssEnd[i][0] - that.cssOri[i][0],
              c2 = that.cssEnd[i][1] - that.cssOri[i][1],
              c3 = that.cssEnd[i][2] - that.cssOri[i][2]
            var r = color.hex(Math.ceil((eval(that.animType))(t, b1, c1, d))),
              g = color.hex(Math.ceil((eval(that.animType))(t, b2, c2, d))),
              b = color.hex(Math.ceil((eval(that.animType))(t, b3, c3, d)))
            that.elem.style[props[i]] = '#' + r + g + b
          } else if (props[i].toString() == 'opacity') {
            that.elem.style[props[i]] = Math.ceil((eval(that.animType))(t, b, c, d)) / 100
          } else {
            that.elem.style[props[i]] = Math.ceil((eval(that.animType))(t, b, c, d)) + 'px'
          }
        }
      } else {
        for (var i = 0; i < props.length; i++) {
          if (fn.objType(that.cssOri[i]) == 'Array' && fn.objType(that.cssEnd[i]) == 'Array') {
            var c1 = that.cssEnd[i][0],
              c2 = that.cssEnd[i][1],
              c3 = that.cssEnd[i][2]
            var r = color.hex(Math.ceil((eval(that.animType))(t, b1, c1, d))),
              g = color.hex(Math.ceil((eval(that.animType))(t, b2, c2, d))),
              b = color.hex(Math.ceil((eval(that.animType))(t, b3, c3, d)))
            that.elem.style[props[i]] = '#' + r + g + b
          } else if (props[i].toString() == 'opacity') {
            that.elem.style[props[i]] = that.cssEnd[i] / 100
          } else {
            that.elem.style[props[i]] = that.cssEnd[i] + 'px'
          }
        }
        clearInterval(that.timer)
        if (that.complete) that.funObj['complete'].call(that, that.elem)
      }
    }, 10) // 一般要给10毫秒异步调用时间，不能是1
  },
  pause: function () {
    this.onPause = true
  }
}
// elemId （必选）需要施加动画效果的元素id
// cssObj （必选）动画结束时的样式，对象类型，键值对形式， 其中键是能直接用在JS中的“驼峰”形式的css属性，而不是原来的css属性。
// 			例如：{ marginLeft: '200px', top: '200px', borderWidth: '8px'}
// time （必选）动画持续时间（单位ms） animType （可选）默认为线性变化，代码里的Tween类型包含可选的其他参数
// funObj （可选）如果要此选项，需要加入开始和结束时候执行的函数。 形如：{ el为elemId所指向的元素
// start: function (el) { el.innerHTML = 'start!'; },
// complete: function (el) { el.innerHTML = 'Completed!'; }
var anim = function () {
  return new _anim(arguments)
}

var methods = {
  init: function (options) {
    var p = {
      id: null,
      direction: 'up',
      loop: -1,
      scrolldelay: 0,
      scrollamount: 50,
      circular: true,
      drag: false,
      runshort: false,
      hoverstop: true,
      inverthover: false,
      xml: false
    }
    if (options) {
      Object.assign(p, options)
    }

    Element.prototype.data = function (key, value) {
      var _this = this,
        _dataName = 'testData', // 存储至DOM上的对象标记, 这里只是测试用名
        _data = {}
      // 未指定参数,返回全部
      if (typeof key === 'undefined' && typeof value === 'undefined') {
        return _this[_dataName]
      }
      // setter
      if (typeof (value) !== 'undefined') {
        // 存储值类型为字符或数字时, 使用attr执行
        var _type = typeof (value)
        if (_type === 'string' || _type === 'number') {
          _this.setAttribute(key, value)
        }
        _data = _this[_dataName] || {}
        _data[key] = value
        _this[_dataName] = _data
        return this
      }
      // getter
      else {
        _data = _this[_dataName] || {}
        return _data[key] || _this.getAttribute(key)
      }
    }

    var enterEvent = 'mouseenter'
    var leaveEvent = 'mouseleave'
    if (p.inverthover) {
      enterEvent = 'mouseleave'
      leaveEvent = 'mouseenter'
    }
    var
      loop = p.loop,
      strWrap = document.getElementById(p.id),
      fMove = false

    addClass(strWrap, 'str_wrap')
    strWrap.data('scrollamount', p.scrollamount)

    var strWrapStyle = strWrap.getAttribute('style')

    if (strWrapStyle) {
      var wrapStyleArr = strWrapStyle.split(';')
      var startHeight = false
      for (var i = 0; i < wrapStyleArr.length; i++) {
        var str = trim(wrapStyleArr[i])
        var tested = str.search(/^height/g)
        if (tested != -1) {
          startHeight = parseFloat(css(strWrap, 'height'))
        }
      }
    }

    var code = function () {
      off(strWrap, 'mouseleave')
      off(strWrap, 'mouseenter')
      off(strWrap, 'mousemove')
      off(strWrap, 'mousedown')
      off(strWrap, 'mouseup')

      var strMove = document.querySelector('.str_move')
      var strMoveClone = strMove.cloneNode(true)
      var time = 0

      removeClass(strMoveClone, 'str_origin')
      addClass(strMoveClone, 'str_move_clone')

      if (!p.hoverstop) {
        addClass(strWrap, 'noStop')
      }

      var circCloneVert = function () {
        var strMoveCloneVert = strMoveClone.cloneNode(true)

        css(strMoveCloneVert, 'top', '100%')
        css(strMoveCloneVert, 'bottom', 'auto')
        css(strMoveCloneVert, 'height', strMove.getBoundingClientRect().height)

        strMove.appendChild(strMoveCloneVert)

        css(strMoveCloneVert, 'bottom', '100%')
        css(strMoveCloneVert, 'top', 'auto')
        css(strMoveCloneVert, 'height', strMove.getBoundingClientRect().height)

        strMove.appendChild(strMoveClone)
      }

      if (p.direction == 'up') {
        addClass(strWrap, 'str_vertical')

        if (strMove.getBoundingClientRect().height > strWrap.getBoundingClientRect().height) {
          var topPos = -strMove.getBoundingClientRect().height

          if (p.circular) {
            if (!p.xml) {
              circCloneVert()
              topPos = -(strMove.getBoundingClientRect().height + (strMove.getBoundingClientRect().height - strWrap.getBoundingClientRect().height))
            }
          }

          var
            aTimer = null,
            k2 = 0,
            timeFunc = function () {
              var
                fullS = Math.abs(topPos),
                time = (fullS / strWrap.data('scrollamount')) * 1000
              if (parseFloat(css(strMove, 'top')) != 0) {
                fullS = (fullS + strWrap.getBoundingClientRect().height)
                time = (fullS - (strWrap.getBoundingClientRect().height - parseFloat(css(strMove, 'top')))) / strWrap.data('scrollamount') * 1000
              }

              return time
            }

          var moveFunc = function () {
            if (loop != 0) {
              aTimer = anim(strMove, {
                top: topPos
              }, timeFunc(), 'Tween.Linear', {
                complete: function (el) {
                  css(strMove, 'top', strWrap.getBoundingClientRect().height)
                  if (loop == -1) {
                    setTimeout(moveFunc, p.scrolldelay)
                  } else {
                    loop--
                    setTimeout(moveFunc, p.scrolldelay)
                  }
                }
              })
            }
          }

          strWrap.data({
            moveF: moveFunc
          })
          if (!p.inverthover) {
            moveFunc()
          }

          if (p.hoverstop) {
            on(strWrap, enterEvent, function () {
              addClass(strWrap, 'str_active')
              aTimer.pause()
            })

            on(strWrap, leaveEvent, function () {
              removeClass(strWrap, 'str_active')
              off(strWrap, 'mousemove')
              moveFunc()
            })

            addClass(strWrap, 'no_drag')
          }
        } else {
          addClass(strWrap, 'str_static')
        }
      }
    }

    code()

    strWrap.data({
      ini: code,
      startheight: startHeight
    })
  }
}

export var liMarquee = function (method) {
  if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
  } else if (typeof method === 'object' || !method) {
    return methods.init.apply(this, arguments)
  } else {
    console.error(method)
  }
}
