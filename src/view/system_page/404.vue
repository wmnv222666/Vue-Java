<template>
  <error-content code="404" :desc="$t('msg_notice_152')" :src="src"/>
</template>

<script>
import error404 from '@/assets/images/error-page/404.svg'
import errorContent from './error-content.vue'

export default {
  name: 'error_404',
  components: {
    errorContent
  },
  data () {
    return {
      src: error404
    }
  }
}
</script>
