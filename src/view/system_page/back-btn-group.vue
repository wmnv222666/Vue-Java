<template>
  <div>
    <Button type="primary" size="large" @click="backHome">{{$t('btn_return_home')}}</Button>
    <Button size="large" >{{$t('btn_return_previous')}}({{ second }}s)</Button>
  </div>
</template>

<script>
import './error.less'

export default {
  name: 'backBtnGroup',
  data () {
    return {
      second: 5,
      timer: null
    }
  },
  methods: {
    backHome () {
      this.$router.replace({
        name: this.$config.homeName
      })
    },
    backPrev () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      if (this.second === 0) this.backPrev()
      else this.second--
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
