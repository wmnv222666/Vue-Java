<!--
 * @Author: your name
 * @Date: 2020-04-07 16:13:05
 * @LastEditTime: 2020-04-26 14:40:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sinobec\src\components\btnGroup\ButtonExpandBus.vue
 -->
<template>
  <div style="float: left">
    <!--    <Button type="primary" class="ivu-btn-button-create-ghost buttonReturn" @click="returnPage">{{$t('btn_return')}}</Button>-->
    <Button type="primary" v-show="btnGroup.buttonPrint" class="ivu-btn-button-create buttonPrint"
      @click="btnHandle('buttonPrint')">{{$t('btn_print')}}</Button>
    <Button type="primary" v-show="btnGroup.buttonCancel" class="ivu-btn-button-create"
      @click="btnHandle('buttonCancel')">Cancel</Button>
    <Button type="primary" v-show="btnGroup.buttonSubmit" class="ivu-btn-button-create"
      @click="btnHandle('buttonSubmit')">{{$t('btn_submit')}}</Button>
    <Button type="primary" v-show="btnGroup.buttonSave" class="ivu-btn-button-create-ghost buttonSave"
      @click="btnHandle('buttonSave')">{{$t('btn_save')}}</Button>
    <Button type="primary" v-show="btnGroup.buttonDelete" class="ivu-btn-button-create-ghost buttonDelete"
      @click="btnHandle('buttonDelete')">{{$t('btn_delete')}}</Button>
  </div>
</template>

<script>
export default {
  name: "ButtonExpand",
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    btnGroup: {
      buttonCancel: false,
      buttonPrint: false,
      buttonSubmit: false,
      buttonSave: false,
      buttonDelete: false
    }
  },
  methods: {
    btnHandle (type) {
      this.$emit("on-ok", type);
    },
    returnPage () {
      this.$router.go(-1);
    }
  }
};
</script>
