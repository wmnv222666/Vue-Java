<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-23 08:54:09
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-30 20:21:53
 * @Description: description
 -->
<template>
  <div :class="['in-block', flex ? 'x-flex' : '']">
    <div class="x-search-in">
      <div class="btn-group">
        <span class="btn-select-muted" :class="{ 'ivu-form-item-required': required }">
          <span class="selected-content" :class="{ 'ivu-form-item-label': required }">
            <slot name="title">{{ title }}</slot>
          </span>
        </span>
      </div>
      <div class="pull-left search-right">
        <div :class="['search-group-input-wrapper', suffix ? 'search-suffix' : '']">
          <div :class="['search-group-input', suffix ? 'x-input-search' : '']"><slot></slot></div>
          <span v-if="suffix" class="input-clear-icon" @click="clickHandle"> <slot name="suffix"></slot> </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: [String, Number],
    suffix: {
      type: Boolean,
      default: false
    },
    flex: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  name: 'searchin',
  methods: {
    clickHandle () {
      this.$emit('search')
    }
  }
}
</script>
