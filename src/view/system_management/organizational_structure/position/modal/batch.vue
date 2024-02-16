<template>
  <Drawer
    width="600"
    :title="$t('hx_batch_maintenance')"
    :transfer="true"
    :closable="true"
    v-model="modalVal"
    :mask-closable="false"
    @on-close="cancel"
    @on-visible-change="visibleChange"
  >
    <div>
      <div>
        <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="120">
          <FormItem :label="$t('col_section_code')" prop="sectionCode">
            <Select v-model="formData.sectionCode">
              <Option v-for="(item, i) in storeAreaList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('col_dic_wh_storage_bin_picking_area_name')">
            <Select v-model="formData.dicWhStorageBinPickingAreaCode">
              <Option v-for="(item, i) in pickList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('col_freeze_input')">
            <i-switch size="small" v-model="formData.freezeInput" :true-value="1" :false-value="0" />
          </FormItem>
          <FormItem :label="$t('lbl_outgoing_freeze')">
            <i-switch size="small" v-model="formData.freezeOutput" :true-value="1" :false-value="0" />
          </FormItem>
          <Row>
            <Col span="12"> </Col>
            <Col span="12"> </Col>
          </Row>
          <FormItem :label="$t('col_reason_desc')">
            <Input v-model="formData.reasonName"></Input>
          </FormItem>
          <Divider></Divider>
          <FormItem :label="$t('lbl_max_memory_cell')">
            <Input v-model="formData.storageCellMax"></Input>
          </FormItem>
          <FormItem :label="$t('col_cell_type_code')">
            <Input v-model="formData.storageCellType"></Input>
          </FormItem>
          <!-- <FormItem :label="$t('lbl_max_weight_status')">
            <el-input-number :step="1" v-model="formData.weightMax" controls-position="right" :max="999999999"></el-input-number>
            <div class="in-block margin-left-15">
              <div>KG</div>
            </div>
          </FormItem> -->
          <FormItem :label="$t('lbl_volume_max')">
            <el-input-number :step="1" v-model="formData.volumeMax" controls-position="right" :max="999999999"></el-input-number>
            <div class="in-block margin-left-15">
              <div>M3</div>
            </div>
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button type="primary" class="ivu-btn-button-create margin-right-24" @click="ok">{{ $t('btn_confirm') }}</Button>
        <Button type="primary" class="ivu-btn-button-create-ghost" @click="cancel">{{ $t('btn_return') }}</Button>
      </div>
    </div>
  </Drawer>
</template>

<script>
import { API } from '@A/system/Bin'
export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    selectList: {
      type: Array,
      default () {
        return []
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
    }
  },
  data () {
    return {
      formData: {
        sectionCode: '',
        pickingArea: '',
        freezeInput: 0,
        freezeOutput: 0,
        reasonName: '',
        storageCellMax: '',
        storageCellType: '',
        weightMax: '',
        volumeMax: ''
      },
      ruleValidate: {// 表单验证
        sectionCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        ]
      },
      storeAreaList: [],
      pickList: []
    }
  },
  mounted () {
    this.formDataDefault = this.$c(this.formData)
  },
  methods: {
    // 抽屉显示隐藏改变调用
    visibleChange (isShow) {
      if (isShow) {
        this.queryStoreArea(this.selectList[0]['whCode'], this.selectList[0]['typeCode'])
        this.queryBinAndPick()
      } else {
        this.clearData()
      }
    },
    // 存储区查询
    async queryStoreArea (whCode, typeCode) {
      var [err, res] = await this.$to(API.AGetWhStorageSectionList(whCode, typeCode)); if (err) { return false }
      this.storeAreaList = this.$kv(res.data.list, 'sectionCode', 'sectionName', true)
    },
    // 仓位类型和拣货区查询
    async queryBinAndPick () {
      var [err, res] = await this.$to(API.AGetBinTypeAndPickArea()); if (err) { return false }
      this.pickList = this.$kv(res.data.pickingAreaList, 'pickingAreaCode', 'pickingAreaName', true)
    },
    // 清数据
    clearData () {
      this.formData = Object.assign({}, this.formData, this.formDataDefault)
    },
    cancel () {
      this.$refs['formValidate'].resetFields()// 表单重置
      this.modalVal = false
    },
    // 成功回调
    successHandle (res) {
      var _this = this
      _this.$Notice.success({
        desc: res.returnMsg,
        duration: 2,
        onClose: function () {
          _this.$emit('ok-drawer') // 刷新列表页
          _this.cancel()
        }
      })
    },
    // 提交前校验
    preCommitValidation () {
      if ((this.formData.freezeInput === 1 || this.formData.freezeOutput === 1) && this.formData.reasonName == '') {
        this.$Notice.warning({ desc: this.$t('msg_notice_113') })
        return false
      }
      if ((this.formData.freezeInput === 0 && this.formData.freezeOutput === 0) && this.formData.reasonName !== '') {
        this.$Notice.warning({ desc: this.$t('ph_placeholder_240') })
        return false
      }
      return true
    },
    ok () {
      var _this = this
      _this.$refs['formValidate'].validate((valid) => { // 表单验证
        if (valid) {

          if (!_this.preCommitValidation()) {
            return false
          }

          var keyList = _this.selectList.map(function (item) {
            return {
              whCode: item.whCode,
              typeCode: item.typeCode,
              binCode: item.binCode
            }
          })

          _this.formData.keyList = keyList

          var eCommand = () => {
            API.ABatchUpdate(_this.formData).then(function (res) {
              _this.successHandle(res)
            })
          }

          _this.$confirm({
            content: _this.$t('msg_notice_108'),
            onOk: eCommand
          })
        }
      })
    }
  }
}
</script>
