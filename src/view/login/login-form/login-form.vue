<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <input type="hidden" name="password">
    <FormItem prop="userName">
      <Input v-model="form.userName" :placeholder="$t('ph_userName')">
      <span slot="prefix">
        <xIcon :size="16" type="iconuser"></xIcon>
      </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" :placeholder="$t('ph_password')">
      <span slot="prefix">
        <xIcon :size="16" type="iconpassword"></xIcon>
      </span>
      </Input>
    </FormItem>

    <FormItem>
      <a @click="handleSubmit" class="btn-fill-horz-o">
        <span v-if="!loadingBtn">{{$t('btn_loginbtn')}}</span>
        <span v-else>Loading...</span>
      </a>
    </FormItem>

    <!-- <FormItem>
      <language v-if="$config.useI18n" @on-lang-change="setLang" :lang="local" class="x-login-lang" />
    </FormItem> -->
  </Form>
</template>
<script>
import Language from '_c/common/language'
import { mapMutations } from 'vuex'
import { CAPI } from '@A/common'
export default {
  name: 'LoginForm',
  components: {
    Language
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      cropList: [],
      form: {
        userName: '',
        password: '',
        corpCode: ''
      }
    }
  },
  computed: {
    local () {
      return this.$store.state.app.local
    },
    rules () {
      return {
        userName: [
          { required: true, message: this.$t('msg_notice_198'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('msg_notice_199'), trigger: 'blur' }
        ]
      }
    },
    loadingBtn: {
      get () {
        return this.loading
      },
      set (value) {
        this.loading = value
      }
    }
  },
  mounted () {
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    this.$removeCookie('cropCode')
  },
  methods: {
    companyChangeHandle (corp) {
      this.$setCookie('cropCode', corp)
    },
    // 获取公司列表
    // async getCropList () {
    //   var [err, res] = await this.$to(CAPI.AGetCropListAll()); if (err) { return false }
    //   this.cropList = this.$kv(res.data, 'corpCode', 'corpName', true)
    // },
    ...mapMutations([
      'setLocal'
    ]),
    setLang (name) {
      this.$store.dispatch('SET_LOCAL_LANG', name)
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            corpCode: this.form.corpCode
          })
        }
      })
    }
  },
  watch: {
    loading (value) {
      this.loadingBtn = value
    }
  }
}
</script>
