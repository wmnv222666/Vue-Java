<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-15 21:26:10
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-04-02 14:59:55
 * @Description:
 -->
<template>
  <div>
    <Drawer
      :title="title"
      v-model="modalVal"
      :closable="true"
      :mask-closable="true"
      :before-close="handleBeforeClose"
      @on-visible-change="handleVisibleChange"
      width="600"
    >
      <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="140">
        <FormItem :label="$t('Trailler')" prop="traillerNumber">
          <Input type="textarea" v-model="formData.traillerNumber" :maxlength="200" show-word-limit></Input>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button type="primary" class="ivu-btn-button-create margin-right-24" @click="okHandle">{{ $t('btn_confirm') }}</Button>
        <Button type="primary" class="ivu-btn-button-create-ghost" @click="returnHandle">{{ $t('btn_return') }}</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>

export default {
  name: 'allocation',
  props: {
    drawer: {
      type: Boolean,
      default: false
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
  data () {
    return {
      title: 'T',
      formData: {
        traillerNumber: ''
      },
      ruleValidate: {
        traillerNumber: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 显示状态发生变化时触发
    handleVisibleChange (visible) {
      if (visible) {
        // 
      } else {
        //  hide Handler
        this.returnHandle()
      }
    },
    // 返回 Promise 可以阻止关闭
    handleBeforeClose () {
      return new Promise((resolve) => {
        this.$confirm({
          content: this.$t('msg_notice_888'),
          onOk: () => { resolve(); }
        });
      });
    },
    // 返回回调
    returnHandle () {
      this.modalVal = false
      this.$refs['formValidate'].resetFields()// 表单重置
    },
    // 确定回调
    okHandle () {
      var _this = this
      _this.$refs['formValidate'].validate((valid) => { // 表单验证
        if (valid) {
          _this.$emit('on-ok', this.formData.traillerNumber)
          _this.modalVal = false
        }
      })
    }
  }
}
</script>
