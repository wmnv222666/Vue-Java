<template>
  <div>
    <div  style="width: 100%;height:40px;position: relative">
      <div class="sider-trigger-b" @click="handleChange">
        <span>{{base_up()}}</span>
        <!--<Icon type="ios-arrow-dropleft-circle" color="#ffffff" size=20 :class="[collapsed ? 'collapsed' : '']"></Icon>-->
        <div class="icon-circle">
          <xIcon type="iconfirst" color="#0288d1" size='14' :class="[collapsed ? 'collapsed' : '']"></xIcon>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'siderTrigger',
  props: {
    collapsed: Boolean,
    icon: {
      type: String,
      default: 'ios-arrow-dropleft'
    },
    size: {
      type: Number,
      default: 14
    }
  },
  methods: {
    handleChange () {
      this.$emit('on-change', !this.collapsed)
    },
    base_up () {
      return this.$t('base_up')
    }
  }
}
</script>
