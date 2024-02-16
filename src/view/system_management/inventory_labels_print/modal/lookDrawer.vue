<template>
  <Drawer width="600" :title="title" :transfer="true" :closable="true" v-model="modalVal" :mask-closable="justLook" @on-close="cancel" @on-visible-change="visibleChange">
    <div>
      <div>
        <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="140">

          <FormItem :label="$t('col_ascription_ware_code')" prop="whCode">
            <Select v-model="formData.whCode">
              <Option v-for="corp in cropList" :value="corp.value" :key="corp.value">
                {{ corp.value }}
              </Option>
            </Select>
          </FormItem>

          <!-- 物料号 -->
          <FormItem :label="$t('condition')" prop="sku" style="width: 100%">
            <div v-if="justLook">{{ $s(formData.sku) }}</div>
            <search-in v-else v-model="formData.sku" type="text" style="width: 100%">
              <AutoComplete clearable v-model="formData.sku" :data="skuList" :filter-method="filterMethod" ></AutoComplete>
            </search-in>
          </FormItem>

          <!-- 制造商 -->
          <FormItem :label="$t('mfgid')" prop="mfgid">
            <div v-if="justLook">{{ $s(formData.mfgid) }}</div>
            <search-in v-else v-model="formData.mfgid" type="text" style="width: 100%">
              <AutoComplete clearable v-model="formData.mfgid" :data="mfgidList" :filter-method="filterMethod" ></AutoComplete>
            </search-in>
          </FormItem>

          <!-- 批次 -->
          <FormItem :label="$t('Batch')" prop="batch">
            <div v-if="justLook">{{ $s(formData.batch) }}</div>
            <Input v-else v-model="formData.batch" type="text"></Input>
          </FormItem>

          <!-- 生产日期 -->
          <FormItem :label="$t('prddate')" prop="prdDate">
            <div v-if="justLook">{{ $s(formData.prdDate) }}</div>
            <Input placeholder="date format is YYYY-MM-DD" v-else v-model="formData.prdDate" type="text"></Input>
          </FormItem>

          <!-- 过期日期 -->
          <FormItem :label="$t('expdate')" prop="expDate">
            <div v-if="justLook">{{ $s(formData.expDate) }}</div>
            <Input placeholder="date format is YYYY-MM-DD" v-else v-model="formData.expDate" type="text"></Input>
          </FormItem>

          <FormItem :label="$t('GRDate_lot')" prop="grDateLot">
            <div v-if="justLook">{{ $s(formData.grDateLot) }}</div>
            <Input placeholder="date format is YYYY-MM-DD" v-else v-model="formData.grDateLot" type="text"></Input>
          </FormItem>

          <FormItem :label="$t('copy')" prop="copy">
            <div v-if="justLook">{{ $s(formData.copy) }}</div>
            <el-input v-else v-model="formData.copy" oninput="value=value.replace(/[^\d]/g,'')" type="text"></el-input>
          </FormItem>

        </Form>
      </div>

      <div class="demo-drawer-footer">
        <Button v-if="true" type="primary" class="ivu-btn-button-create margin-right-24" @click="printData">{{ $t('btn_print') }}</Button>
        <Button type="primary" class="ivu-btn-button-create-ghost" @click="cancel">{{ $t('btn_return') }}</Button>
      </div>
    </div>
  </Drawer>
</template>

<script>
import { API } from '@A/system/Bin'
import {CAPI} from "@A/common";
import ElInput from "_c/input-number/input/src/input";
export default {
  components: {ElInput},
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    flag: { type: String, default: '' },
    whCode:[String, Number],
    sku:[String, Number],
    mfgid:[String, Number],
    batch:[String, Number],
    prdDate:[Date],
    expDate:[Date],
    grDateLot:[Date]
  },
  name: 'searchin',
  data () {
    return {
      ruleValidate: {// 表单验证
        whCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        ]
      },
      disabled: false, // 编辑时禁用输入框
      cropList: [],
      skuList:[],
      mfgidList:[],
      formData: {
        whCode:"",
        sku:"",
        mfgid:"",
        prdDate:"",
        batch:"",
        expDate:"",
        grDateLot:"",
        copy:1
      }
    }
  },
  created () {
    this.getCropList(),
    this.getSkuList(),
    this.getMfgidList()
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
    sureStatus () {
      return this.flag !== 'L' // 非查看状态显示确定按钮
    },
    deleteStatus () {
      return this.flag === 'E' // 编辑状态显示删除按钮
    },
    justLook () {
      return this.flag === 'L' // 查看状态不可编辑
    },
    title () {
      return this.flag === 'L' ? this.$t('lnk_check') : this.flag === 'E' ? this.$t('btn_edit') : this.$t('sta_1')
    }
  },
  mounted () {
    this.formDataDefault = this.$c(this.formData)
  },
  methods: {
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    async getCropList () {
      var [err, res] = await this.$to(CAPI.AGetCropListAll());
      if (err) {
        return false;
      }
      let data;
      if (this.$store.getters.UserCropCode){
        data = res.data.filter((item) => {
          return item.corpCode === this.$store.getters.UserCropCode ;
        });
        this.formData.whCode = this.$store.getters.UserCropCode ;
      } else {
        data = res.data ;
        data.push({"corpCode": "", "corpName": ""});
      }

      this.cropList = this.$kv(data, "corpCode", "corpName", true);
    },
    async getSkuList(){
      var [err, res] = await this.$to(CAPI.AGetSkuListAll());
      if (err) {
        return false;
      }
      this.skuList = res.data;
    },
    async getMfgidList(){
      var [err, res] = await this.$to(CAPI.AGetMfgidListAll());
      if (err) {
        return false;
      }
      this.mfgidList = res.data;
    },
    // 抽屉显示隐藏改变调用
    visibleChange (isShow) {
      if (isShow) {
        // 创建
        if (this.flag === '') {
          this.getBaseInfo() // 获取备选数据
          return false
        }
        // 编辑
        if (this.flag === 'E') {
          this.disabled = true
          this.getBaseInfo() // 获取备选数据
          this.show() // 获取详情数据
          return false
        }
        // 查看
        if (this.flag === 'L') {
          this.show() // 获取详情数据
          return false
        }
      } else {
        this.clearData()
      }
    },
    // 查询反显数据
    async show () {
      var sendData = { whCode: this.whCode, typeCode: this.typeCode, binCode: this.binCode }
      var [err, res] = await this.$to(API.AGetDetail(sendData)); if (err) { return false }
      var data = res.data
      data.dicWhStorageBinTypeCode = data.dicWhStorageBinTypeCode ? data.dicWhStorageBinTypeCode : ''
      data.dicWhStorageBinTypeName = data.dicWhStorageBinTypeName ? data.dicWhStorageBinTypeName : ''

      this.formData = data

      // console.log("show :", "查询反显数据")
      this.queryStoreType()
      // this.queryStoreArea()
    },
    getBaseInfo () {
      this.queryWh()
      // this.getBinTypeAndPickArea()
      this.queryStoreType()
      this.getItemType()
      this.whChange()
    },
    // 仓库号查询
    async queryWh () {
      var [err, res] = await this.$to(API.AGetWhlistInDetail()); if (err) { return false }
      this.whList = this.$kv(res.data.whList, 'whCode', 'whName', true)
    },
    // 查询类型
    async getItemType () {
      var [err, res] = await this.$to(API.AGetItemType()); if (err) { return false }
      this.matTypeList = this.$kv(res.data.matTypeList, 'matTypeCode', 'matTypeName', true) // 物料类型
    },
    // 仓位类型和拣货区查询
    // async getBinTypeAndPickArea () {
    //   var [err, res] = await this.$to(API.AGetBinTypeAndPickArea()); if (err) { return false }
    //   var data = res.data
    //   this.whBinList = this.$kv(res.data.typeList, 'dicWhStorageBinTypeCode', 'dicWhStorageBinTypeName', true)
    //   this.pickList = this.$kv(res.data.pickingAreaList, 'pickingAreaCode', 'pickingAreaName', true)
    // },
    // 存储类型查询
    async queryStoreType () {
      var [err, res] = await this.$to(API.AGetAllStorageTypeList(this.formData.whCode)); if (err) { return false }
      this.storeTypeList = this.$kv(res.data.headList, 'typeCode', 'typeName', true)
    },
    // 存储区查询
    // async queryStoreArea () {
    //   var [err, res] = await this.$to(API.AGetWhStorageSectionList(this.formData.whCode, this.formData.typeCode)); if (err) { return false }
    //   this.storeAreaList = this.$kv(res.data.list, 'sectionCode', 'sectionName', true)
    // },
    // 仓库号下拉改变方法
    whChange (whCode) {
      // console.log("whChange :", "仓库号下拉改变方法")
      this.formData.whCode = whCode || ''
      this.formData.typeCode = ''
      this.formData.sectionCode = ''
      whCode && this.queryStoreType()
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
    // 清数据
    clearData () {
      this.disabled = false // 编辑时禁用输入框
      this.formData = Object.assign({}, this.formData, this.formDataDefault)
    },
    cancel () {
      this.$refs['formValidate'].resetFields()// 表单重置
      this.modalVal = false
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
    printData(){
      var _this = this
      this.$refs['formValidate'].validate((valid) => { // 表单验证
        if (valid) {
          var qrCode ={
            SKU:this.formData.sku || "",
            'SkU Desc':"",
            MfgID:this.formData.mfgid || "",
            Batch:this.formData.batch || "",
            'Production Date': this.formData.prdDate || "",
            'Expiration Date': this.formData.expDate || "",
            GRDATE_LOT: this.formData.grDateLot || "",
          }

          var sendDataList = [{
            matCode: this.formData.sku || "",
            matName: "",
            lotNumb: this.formData.batch || "",
            ext3: this.formData.mfgid || "",
            ext7: this.formData.prdDate || "",
            ext8: this.formData.expDate || "",
            ext9: this.formData.grDateLot || "",
            qrCodeValue:qrCode,
            whCode: this.formData.whCode || "",
            host: "",
            port: 0,
            zplType: 0
          }]

          for (let i = 0; i < this.formData.copy; i++) {
            CAPI.APrintMat(sendDataList).then(res => {
              this.successHandle(res);
            });
          }

        }
      })
    }
  }
}
</script>
