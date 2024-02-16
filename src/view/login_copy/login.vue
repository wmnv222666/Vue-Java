<!--
 * @Author: your name
 * @Date: 2020-03-23 08:54:09
 * @LastEditTime: 2020-05-08 17:04:20
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \sinobec\src\view\login\login.vue
 -->
<template>
  <div class="login">
    <div class="login-bg">
      <div class="login-con">
        <div class="form-con">
          <Row>
            <Col span="16" class="left-c"> <img src="../../assets/images/login-bg-1.jpg"> </Col>
            <Col span="8" class="right-c">
            <Card class="x-form-login">
              <div class="login-title">
                <img src="../../assets/images/logoLogin.png" class="logo-center">
                <div> {{$t('base_title')}} </div>
              </div>
              <login-form @on-success-valid="handleSubmit" :loading="loading"></login-form>
            </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <div class="copyright"> {{$t('base_message')}} </div>
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
@import './login.less';
</style>
