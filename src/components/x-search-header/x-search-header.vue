<!--
 * @Author: your name
 * @Date: 2020-05-29 14:40:32
 * @LastEditTime: 2020-06-05 17:56:13
 * @LastEditors: JiangXiao
 * @Description: In User Settings Edit
 * @FilePath: \SaaS_web\src\components\x-search-header\x-search-header.vue
--> 
<template>
  <Row class="x-search-box-c">
    <Col span="24" class="x-search-box-header">
    <slot name="head"></slot>
    </Col>
    <Col span="24" class="x-search-container" :class="className">
    <form @keyup.enter="enterSearch" @submit.prevent="()=>false">
      <slot name="body"></slot>
    </form>
    </Col>
    <Col span="24" class="x-search-box-footer">
    </Col>
  </Row>
</template>

<script>

export default {
  props: ['className'],
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    enterSearch () {
      this.$emit('on-search')
    }
  }
}

</script>
<style>
.x-search-box-c {
  border: 1px solid #dcdee2;
  position: relative;
  padding-top: 16px;
}

.x-search-box-header,
.x-search-container {
  padding: 0 16px 16px 16px;
}

.x-search-box-footer {
  content: '';
  display: block;
  height: 38px;
  line-height: 38px;
  padding-left: 16px;
  color: #999;
  position: relative;
  border-bottom: 1px solid transparent;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  text-align: center;
  background-color: #f7f7f7;
}
</style>