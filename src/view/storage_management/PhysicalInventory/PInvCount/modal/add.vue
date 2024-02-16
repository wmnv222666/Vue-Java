<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-15 11:32:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-01 12:23:45
 * @Description:
 -->
<template>
  <div>
    <Drawer :title="$t('btn_addinvsurplus')" v-model="modalVal" :closable="true" :mask-closable="true" :before-close="handleBeforeClose" @on-visible-change="handleVisibleChange" width="400">
      <Form :model="formData" :label-width="140" ref="formValidate" :rules="ruleValidate">
        <FormItem :label="$t('ZoneCode')" prop="typeCode">
          <Select :value="formData.typeCode" :label-in-value="true" @on-change="typeCodeChangeHandle">
            <Option v-for="(item, i) in typeCodeList" :label="item.label" :value="item.value" :key="i"></Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('LocationCode')" prop="binCode">
          <Poptip trigger="focus" content="xx-xx-xx-xx">
            <AutoComplete :disabled="!formData.typeCode" v-model="formData.binCode" :data="binCodeList" :filter-method="binFilterMethod"> </AutoComplete>
          </Poptip>
        </FormItem>
        <FormItem :label="$t('Lotnumb')" prop="bundleCode">
          <Input v-model="formData.bundleCode"></Input>
        </FormItem>
        <!-- <FormItem :label="$t('ShippingRef')" prop="shippingRef">
          <Input v-model="formData.shippingRef"></Input>
        </FormItem> -->
        <!-- <FormItem :label="$t('Heat')" prop="heat">
          <Input v-model="formData.heatCode"></Input>
        </FormItem>
        <FormItem :label="$t('Skid')" prop="skid">
          <Input v-model="formData.skidCode"></Input>
        </FormItem> -->
        <FormItem :label="$t('sel_number')" prop="stockTakeQty">
          <el-input-number v-model="formData.stockTakeQty" :min="0"></el-input-number>
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
import { API } from '@A/warehouse/PInvCount'
export default {
  name: 'advancedSearch',
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      typeCodeList: [],
      binCodeList: [],
      formData: {
        typeCode: '',
        binCode: '',
        bundleCode: '',
        shippingRef: '',
        heatCode: '',
        skidCode: '',
        stockTakeQty: 0
      },
      ruleValidate: {
        typeCode: [{ required: true, message: this.$t('msg_notice_250') }],
        binCode: [{ required: true, message: this.$t('msg_notice_250') }],
      }
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
    },
  },
  mounted () {
    this.formDataDefault = this.$c(this.formData)
  },
  methods: {
    typeCodeChangeHandle (typeCode) {

    },
    // 仓位过滤方法
    binFilterMethod (value, option) {
      return (value.indexOf('-') > -1) && (option.indexOf(value) > -1);
    },
    // 添加盘盈
    async saveAddInventorySurplus () {
      var [err, res] = await this.$to(API.AInvSurplus(this.formData)); if (err) { return false }
      this.$emit('on-ok', res.data)
      this.modalVal = false
    },
    // 显示状态发生变化时触发
    handleVisibleChange (visible) {
      if (visible) {
        //  show Handler
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
      this.$refs['formValidate'].resetFields()// 表单重置
      this.formData = Object.assign({}, this.formData, this.formDataDefault)
      this.modalVal = false
    },
    // 确定回调
    okHandle () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.saveAddInventorySurplus()
        }
      })
    }
  }
}
</script>
