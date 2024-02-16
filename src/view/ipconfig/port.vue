<template>
  <div style="height: 100%" class="x dv-full-screen-container">
    <div id="top-header">
      <div class="center-title">智能仓储管理系统</div>
    </div>

    <div class="is-transformed border-box-container">
      <div class="dv-border-box-8">
        <div class="border-box-content">
          <Card>
            <div class="port-input">
              <h3 style="text-align:center;margin-bottom: 16px;">可修改公共请求uri地址</h3>
              <Alert show-icon type="warning" style="margin-bottom: 40px">本页面仅限Instock内部使用（登录之前进行此操作）， 外人未经允许不得使用！ </Alert>
              <Input v-model="value" style="margin-bottom: 40px">
                <Select v-model="select" slot="prepend" style="width: 80px">
                  <Option value="http">http://</Option>
                  <Option value="https">https://</Option>
                </Select>
                <span slot="append">/wms/web/</span>
              </Input>
            </div>
            <div class="x-port_button-group">
              <Button type="success" style="margin-right: 30px;" @click="configBtn">确定配置</Button>
              <Button type="info" style="margin-right: 30px;" @click="configBtnDefault">默认配置</Button>
              <Button type="warning" style="margin-right: 30px;" @click="configBtn127">本机配置（127.0.0.1:8080）</Button>
              <Button type="error" @click="messageBtn">关闭消息</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie, setToken, setCookie, removeCookie } from '@/libs/utils'

var getCookies = getCookie('xip') || ''
let getUrl = getCookies ? getCookies.replace(/(http|ftp|https):\/\//, '').replace(/\/wms\/web\//, '') : ''
let select = getCookies.match(/https/) ? 'https' : 'http'

export default {
  name: 'port',
  data () {
    return {
      compress: getCookie('compress'),
      select,
      value: getUrl,
      msgFlag: true,
      version: '',
      starListBySort: [],
      ink: 0,
    }
  },
  mounted () {
    localStorage.setItem('messageFlag', 'true');
  },
  methods: {
    changeCompress (event) {
      setCookie('compress', event, { expires: 1, path: '/' })
      var title = ''
      event == '1' ? title = "数据传输压缩开启" : title = "数据传输压缩关闭";
      this.$Notice.success({ title, duration: 1 })
    },
    configBtn () {
      var _this = this
      _this.$Modal.confirm({
        title: '配置',
        content: '您确定要配置新IP及端口吗？',
        onOk: () => {
          if (!this.value) {
            _this.$Notice.warning({
              title: 'IP及端口不能为空',
              duration: 1
            })
            return false
          }
          setCookie('xip', `${this.select}://${this.value}`, { expires: 1, path: '/' })
          _this.$Notice.success({
            title: '配置成功',
            duration: 1,
            onClose: function () {
              _this.$router.replace({
                name: 'login'
              })
            }
          })
        }
      })
    },
    messageBtn () {
      var _this = this
      _this.$Modal.confirm({
        title: '配置',
        content: '您确定要关闭消息吗？',
        onOk: () => {
          _this.msgFlag = false
          // setCookie('messageFlag', _this.msgFlag, { expires: 1, path: '/' })
          localStorage.setItem('messageFlag', _this.msgFlag);
        }
      })
    },
    configBtnDefault () {
      var _this = this
      _this.$Modal.confirm({
        title: '配置',
        content: '您确定要恢复默认配置吗？',
        onOk: () => {
          removeCookie('xip')
          setToken('')
          _this.$Notice.success({
            title: '配置成功',
            duration: 1,
            onClose: function () {
              _this.$router.replace({
                name: 'login'
              })
            }
          })
        }
      })
    },
    configBtn127 () {
      var _this = this
      _this.$Modal.confirm({
        title: '配置',
        content: '您确定要配置http://127.0.0.1:8080',
        onOk: () => {
          setCookie('xip', 'http://127.0.0.1:8080', { expires: 1, path: '/' })
          _this.$Notice.success({
            title: '配置成功',
            duration: 1,
            onClose: function () {
              _this.$router.replace({
                name: 'login'
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style>
@import './port.css';
</style>
