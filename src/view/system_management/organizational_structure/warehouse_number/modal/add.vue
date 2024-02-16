<template>
  <Drawer
    :width="400"
    :title="$t('btn_new')"
    :transfer="false"
    :closable="true"
    v-model="modalVal"
    :mask-closable="true"
    @on-close="cancel"
    @on-visible-change="visibleChange"
  >
    <div>
      <div>
        <Row :gutter="12">
          <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="120">
            <FormItem :label="$t('col_factory')" prop="ftyCode">
              <Select v-model="formData.ftyCode" @on-change="ftyChange" label-in-value>
                <Option v-for="(item, i) in facList" :value="item.value" :key="i" :label="item.label"></Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('sel_location_name')" prop="locationCode">
              <Select v-model="formData.locationCode" @on-change="locChange">
                <Option v-for="item in stockList" :value="item.locationCode" :key="item.locationCode">
                  {{ item.locationCode }} - {{ item.locationName }}
                </Option>
              </Select>
            </FormItem>
          </Form>
        </Row>
      </div>
      <div class="demo-drawer-footer">
        <Button type="primary" class="ivu-btn-button-create margin-right-24" @click="ok">{{ $t('btn_confirm') }}</Button>
        <Button type="primary" class="ivu-btn-button-create-ghost" @click="cancel">{{ $t('btn_return') }}</Button>
      </div>
    </div>
  </Drawer>
</template>

<script>
import { API } from '@A/system/Warehouse'
export default {
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
      timer: null,
      formData: {
        ftyCode: '',
        ftyName: '',
        locationCode: '',
        address: ''
      },
      facList: [],
      stockList: [],
      ruleValidate: {// 表单验证
        ftyCode: [
          { required: true, message: this.$t('msg_notice_98') }
        ],
        locationCode: [
          { required: true, message: this.$t('msg_notice_98') }
        ]
      },
      loading: false
    }
  },
  mounted () {
    this.formDataDefault = this.$c(this.formData)// 深拷贝子组件的数据（空值）
  },
  methods: {
    // 抽屉显示隐藏改变调用
    visibleChange (isShow) {
      if (isShow) {
        this.queryFac()
      } else {
        this.clearData()
      }
    },
    // 工厂查询
    async queryFac () {
      var [err, res] = await this.$to(API.AGetFtyList()); if (err) { return false }
      this.facList = this.$kv(res.data.dicFactoryList, 'ftyCode', 'ftyName', true)
    },
    // 库存地点查询
    async querystock (ftyCode) {
      var [err, res] = await this.$to(API.AGetLocationList(ftyCode)); if (err) { return false }
      this.stockList = res.data.dicStockLocationList
    },
    // 工厂下拉改变
    ftyChange (labelInValue) {
      if (!labelInValue) {
        this.formData.ftyName = ''
        this.formData.ftyCode = ''
      } else {
        this.formData.ftyCode = labelInValue['value']
        this.formData.ftyName = labelInValue['label']
        this.querystock(this.formData.ftyCode)
      }
      this.formData.locationCode = ''
      this.formData.address = ''
    },
    // 库存地点下拉改变
    locChange (locationCode) {
      this.formData.locationCode = locationCode || ''
      var stockList = this.stockList.filter(function (item) {
        return item.locationCode == locationCode
      })

      if (stockList.length) {
        this.formData.address = stockList[0].address
      }
    },
    // 清数据
    clearData () {
      this.modalVal = false
      this.formData = Object.assign({}, this.formData, this.formDataDefault)
    },
    cancel () {
      this.clearData()
      // 延时函数，向父组件发送值以后再执行表单重置
      this.timer = setTimeout(() => {
        this.$refs['formValidate'].resetFields()// 表单重置
      }, 500)
    },
    ok () {
      var _this = this
      _this.$refs['formValidate'].validate((valid) => { // 表单验证
        if (valid) {
          _this.$emit('list-data', _this.formData)
          _this.cancel()
        }
      })
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>
