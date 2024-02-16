<template>
  <div class="i-box password-update">
    <Form ref="passwordForm" :model="form" @keydown.enter.native="handleSubmit" :rules="ruleValidate" :label-width="140">
      <FormItem prop="password" :label="$t('lbl_ori_password')">
        <Input type="password" v-model="form.password" :placeholder="$t('ph_ori_pass')">
          <span slot="prefix"> <xIcon :size="16" type="iconpassword"></xIcon> </span>
        </Input>
      </FormItem>
      <FormItem prop="newPassWord" :label="$t('lbl_new_password')">
        <Input type="password" v-model="form.newPassWord" @on-change="strengthChange" clearable :placeholder="$t('ph_password')">
          <span slot="prefix"> <xIcon :size="16" type="iconpassword"></xIcon> </span>
        </Input>
      </FormItem>
      <FormItem prop="newPassWordConfirm" :label="$t('lbl_confirm_password')">
        <Input type="password" v-model="form.newPassWordConfirm" :placeholder="$t('ph_confirm_new_password')">
          <span slot="prefix"> <xIcon :size="16" type="iconpassword"></xIcon> </span>
        </Input>
      </FormItem>
      <FormItem>
        <Button @click="handleSubmit" class="ivu-btn-button-create">
          <span v-if="!loadingBtn">{{ $t('col_modify') }}</span>
          <span v-else>Loading...</span>
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { API } from '@A/system/User'
export default {
  name: 'passwordUpdate',
  data () {
    var validatePassCheck = (rule, value, callback) => {
      if (value !== this.form.newPassWord) {
        callback(new Error(this.$t('msg_notice_226')))
      } else {
        callback()
      }
    }
    return {
      tipStyle: 'password-tip-error',
      strength: this.$t('msg_notice_227'),
      loadingBtn: false,
      strengthValue: 33,
      form: {
        userCode: this.$store.getters.UserCode,
        userId: this.$store.getters.UserId,
        password: '',
        newPassWord: '',
        newPassWordConfirm: ''
      },
      ruleValidate: {
        password: [{ required: true, trigger: 'blur', message: this.$t('msg_notice_228') }],
        newPassWord: [{ required: true, trigger: 'blur', message: this.$t('msg_notice_229') }],
        newPassWordConfirm: [{ validator: validatePassCheck, trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut(this).then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    strengthChange () {
      var txt = this.form.newPassWord
      var len = txt.length
      var num = /\d/.test(txt) // 匹配数字
      var small = /[a-z]/.test(txt) // 匹配小写字母
      var big = /[A-Z]/.test(txt) // 匹配大写字母
      var corps = /\W/.test(txt) // 特殊符号
      var val = num + small + big + corps // 四个组合
      if (len < 1) {
        this.tipStyle = 'password-tip-error'
        this.strength = this.$t('msg_notice_227')
        this.strengthValue = 0
      } else if (len <= 6) {
        this.tipStyle = 'password-tip-weak'
        this.strength = this.$t('msg_notice_230')
        this.strengthValue = 33
      } else if (len > 6 && len <= 8) {
        if (val == 1) {
          this.tipStyle = 'password-tip-weak'
          this.strength = this.$t('msg_notice_230')
          this.strengthValue = 33
        } else if (val == 2) {
          this.tipStyle = 'password-tip-middle'
          this.strength = this.$t('msg_notice_231')
          this.strengthValue = 66
        }
      } else if (len > 8) {
        if (val == 1) {
          this.tipStyle = 'password-tip-weak'
          this.strength = this.$t('msg_notice_230')
          this.strengthValue = 33
        } else if (val == 2) {
          this.tipStyle = 'password-tip-middle'
          this.strength = this.$t('msg_notice_231')
          this.strengthValue = 66
        } else if (val == 3) {
          this.tipStyle = 'password-tip-strong'
          this.strength = this.$t('msg_notice_232')
          this.strengthValue = 100
        }
      }
    },
    handleSubmit () {
      var _this = this
      _this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          _this.$confirm({
            content: _this.$t('msg_notice_233'),
            onOk: () => {
              _this.updatePassword()
            }
          })
        }
      })
    },
    updatePassword () {
      API.AUpdatePassWord(this.form).then((res)=>{this.logout()})
    }
  }
}
</script>
<style lang='less'>
.password-update {
  .ivu-poptip {
    display: inline-block;
  }
  .ivu-poptip-rel {
    display: inline-block;
    position: relative;
  }
  .ivu-slider-button {
    display: none;
  }
  .ivu-slider-button-wrap .ivu-tooltip {
    display: none;
  }
  .password-str {
    padding: 1vh 0;
    font-size: 14px;
    .ivu-slider-bar {
      height: 4px;
      border-radius: 3px;
      position: absolute;
    }
  }
  .password-tip-error {
    .words {
      color: #f9a825;
    }
    .ivu-slider-bar {
      background: #f9a825;
    }
  }
  .password-tip-weak {
    .words {
      color: #ff9800;
    }
    .ivu-slider-bar {
      background: #ff9800;
    }
  }
  .password-tip-middle {
    .words {
      color: #2196f3;
    }
    .ivu-slider-bar {
      background: #2196f3;
    }
  }
  .password-tip-strong {
    .words {
      color: #6fcf97;
    }
    .ivu-slider-bar {
      background: #6fcf97;
    }
  }
}
.password-update .ivu-input-wrapper {
  width: 300px;
}
</style>
