error<template>
  <error-content code="401" :desc="$t('msg_notice_151')" :src="src"/>
</template>

<script>
import error401 from '@/assets/images/error-page/401.svg'
import errorContent from './error-content.vue'
export default {
  name: 'error_401',
  components: {
    errorContent
  },
  data () {
    return {
      src: error401
    }
  }
}
</script>
