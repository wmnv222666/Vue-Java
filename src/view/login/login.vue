<!--
 * @Author: your name
 * @Date: 2019-05-24 19:36:29
 * @LastEditTime: 2020-06-03 16:02:24
 * @LastEditors: JiangXiao
 * @Description: In User Settings Edit
 * @FilePath: \origin\src\view\login\login.vue
--> 
<template>
  <div class="login-container">
    <div class="login-background">
      <div class="x-form-login-container">
        <div class="x-form-login">
          <svg xmlns="http://www.w3.org/2000/svg" width="742" height="742" viewBox="0 0 742 742" style="position: absolute;left: -384px;top:359px;" class="svg">
            <circle id="椭圆_2_拷贝" data-name="椭圆 2 拷贝" class="cls-1" cx="371" cy="371" r="311" />
          </svg>
          <div class="x-login-left-body">
            <img class="x-logo-login" src="./assest/logo.svg" alt="">
            <div class="x-zh-login">
              <img src="./assest/zh-app-title.svg" alt="">
            </div>
            <div class="x-en-login">
              <img src="./assest/en-app-title.svg" alt="">
            </div>
          </div>
          <div class="x-login-right-body">
            <div class="x-login-hello">Hello</div>
            <div class="x-login-app-title">{{$t('base_title')}}</div>
            <login-form @on-success-valid="handleSubmit" :loading="loading"></login-form>
          </div>

        </div>
        <div class="copyright"> Copyright © 2020 Inossem. All rights reserved. </div>
      </div>
      <div class="left-bg">
        <img src="./assest/left-bg.png" alt="" style="height:100%">
      </div>
      <div class="right-bg">
        <svg id="图层_1" data-name="图层 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 733 897" style="height:100%">
          <path class="cls-2 p1" d="M734,1,1,898" />
          <path class="cls-3 p2" d="M733,353,449,700H731" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from './login-form'
import { mapActions } from 'vuex'

export default {
  name: 'login',
  components: {
    LoginForm
  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
  },
  methods: {
    // 国际化
    ...mapActions([
      'handleLogin',
      'getMenuInfo'
    ]),
    handleSubmit (data) {
      if (this.loading) { return false }
      var _this = this
      _this.loading = true
      this.handleLogin(data).then(res => {
        _this.loading = false

        if (res.data.code === '0') {
          _this.getMenuInfo().then(res => {
            _this.$router.push({
              name: _this.$config.homeName
            })
          })
        } else {
          _this.$Message.error({
            title: _this.$t('msg_notice_2'),
            content: res.data.msg
          })
        }
      }).catch((err) => {
        console.log(err)

        _this.loading = false
      })
    }
  }
}
</script>

<style lang="less">
@import './assest/login.css';
</style>
