<template>
	<div class="sc-collapsed">
		<sider-trigger :collapsed="collapsed" icon="angle-double-left" @on-change="handleCollpasedChange"></sider-trigger>
	</div>
</template>

<script>
import siderTrigger from '../sider-trigger'

export default {
  name: 'slideCollapsed',
  components: {
    siderTrigger
  },
  props: {
    collapsed: Boolean
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>
