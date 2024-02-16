<!--
 * @Company: Inossem
 * @Author: zhanyu
 * @Email: zhanyu.xu@inossem.com
 * @Date: 2019-11-04 16:26:38
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-14 11:07:35
 * @Description: description
 -->
 <template>
  <Drawer
    :title="$t('lnk_check')"
    :closable="false"
    v-model="modalVal"
    :mask-closable="true"
    @on-close="canDrawer"
    @on-visible-change="changeVisible"
    width="800px"
  >
    <div>
      <json-viewer :value="paramString" :expand-depth="5" copyable sort></json-viewer>
    </div>
  </Drawer>
</template>

<script>
export default {
  name: 'parameter',
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    paramData: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      paramString: {}
    }
  },
  computed: {
    modalVal: {
      get: function () {
        return this.drawer
      },
      set: function (val) {
        this.$emit('update:drawer', val)
      }
    }
  },
  methods: {
    canDrawer () {
      this.modalVal = false
      this.paramString = {}
    },
    changeVisible (isShow) {
      if (isShow) {
        this.paramString = this.paramData == '' ? {} : JSON.parse(this.paramData)
      }
    }
  }
}
</script>

