<template>
  <Drawer width="600" :title="title" :transfer="true" :closable="true" v-model="modalVal" :mask-closable="justLook" @on-close="cancel" @on-visible-change="visibleChange">
    <div>
      <div>
        <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="140">
          <!-- 仓库号 -->
          <!-- <FormItem :label="$t('lbl_wh_code')" prop="whCode">
            <div v-if="justLook">{{ $s(formData.whCode + ' - ' + formData.whName) }}</div>
            <Select v-else v-model="formData.whCode" @on-change="whChange" :disabled="disabled">
              <Option v-for="(item, i) in whList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select>
          </FormItem> -->

          <!-- 存储类型 -->
          <FormItem :label="$t('Zone')" prop="typeCode">
            <div v-if="justLook">{{ $s(formData.typeCode + ' - ' + formData.typeName) }}</div>
            <Select v-else v-model="formData.typeCode" @on-change="typeChange" :disabled="disabled">
              <Option v-for="(item, i) in storeTypeList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select>
          </FormItem>

          <!-- 仓位 -->
          <FormItem :label="$t('LocationCode')" prop="binCode">
            <div v-if="justLook">{{ $s(formData.binCode) }}</div>
            <Input v-else v-model="formData.binCode" :disabled="disabled"></Input>
          </FormItem>

          <!-- 最大承重 -->
          <!-- <FormItem :label="$t('lbl_max_weight_status')">
            <el-input-number :disabled="justLook" :step="1" v-model="formData.weightMax" :precision="0" :max="999999999"></el-input-number>
            <div class="in-block margin-left-15">
              <div>LBS</div>
            </div>
          </FormItem> -->

          <!-- 描述 -->
          <FormItem :label="$t('col_describe')" prop="whStorageBinExt0">
            <div v-if="justLook">{{ $s(formData.whStorageBinExt0) }}</div>
            <Input v-else v-model="formData.whStorageBinExt0" type="textarea"></Input>
          </FormItem>

          

          <!-- <FormItem :label="$t('col_matType_name')" prop="binTypeCode">
            <div v-if="justLook">{{ $s(formData.binTypeCode) }}</div>
            <Select v-else v-model="formData.binTypeCode" :disabled="disabled">
              <Option v-for="(item, i) in matTypeList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select>
          </FormItem> -->
        </Form>
      </div>

      <div class="demo-drawer-footer">
        <Button v-if="sureStatus" type="primary" class="ivu-btn-button-create margin-right-24" @click="ok">{{ $t('btn_confirm') }}</Button>
        <Button v-if="deleteStatus" type="primary" class="ivu-btn-button-create-ghost margin-right-24" @click="del">{{ $t('btn_delete') }}</Button>
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
    flag: { type: String, default: '' },
    whCode: [String, Number],
    typeCode: [String, Number],
    binCode: [String, Number]
  },
  data () {
    return {
      disabled: false, // 编辑时禁用输入框
      formData: {
        whCode: this.$store.getters.UserCropCode || '',
        typeCode: '',
        binCode: '',
        sectionCode: '',
        pickingAreaCode: '',
        dicWhStorageBinTypeCode: '',
        freezeInput: 0,
        freezeOutput: 0,
        virtualBin: 0,
        reasonName: '',
        storageCellMax: '',
        storageCellType: '',
        binTypeCode: '',
        weightUnitCode: 'LBS',
        weightMax: '',
        volumeMax: '',
        xCoordinate: 0,
        yCoordinate: 0,
        zCoordinate: 0
      },
      ruleValidate: {// 表单验证
        whCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        ],
        typeCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        ],
        binCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }
        ]
      },
      whList: [], // 仓库号
      storeTypeList: [], // 存储类型
      storeAreaList: [], // 存储区
      whBinList: [], // 仓位类型
      matTypeList: [], // 物料类型
      pickList: [] // 拣货区
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
    formatSearch(input){
      var arr = input.split( ',' )
      for (var i = 0, l = arr.length; i < l; ++i) {
        arr[i] = arr[i].trim()
      }
      input = arr.join(",")
      input = input.trim()
      return input
    },
    range ( start,end ){
      var _self = this;
      var length = end - start +1;
      var step = start - 1;
      return Array.apply(null,{length:length}).map(function (v,i){step++;return step;});
    },
    formatMinus(input){
      var output = new Array()
      var arr = input.split( ',' )
      //console.log("arr========",arr)
      for (var i = 0, l = arr.length; i < l; ++i) {
        arr[i] = arr[i].trim()
        //console.log("arr[%d]",i,arr[i])
        if(arr[i].indexOf("-") != -1 ){
          var tmparr = arr[i].split('-')          
          tmparr[0]=parseInt(tmparr[0])
          tmparr[1]=parseInt(tmparr[1])
          if(parseInt(tmparr[1])>9999||parseInt(tmparr[0])>9999){
            this.$Notice.warning({ desc: this.$t('msg_notice_147') })
            return false
          }
          if(!Number.isInteger(tmparr[0])){
            this.$Notice.warning({ desc: this.$t('msg_notice_147') })
            return false
          }
          if(!Number.isInteger(tmparr[1])){
            this.$Notice.warning({ desc: this.$t('msg_notice_147') })
            return false
          }
          if(parseInt(tmparr[0])>=parseInt(tmparr[1])){
            //console.log("tmparr[0]=",tmparr[0])
            //console.log("tmparr[1]=",tmparr[1])
            //console.log("1")
            this.$Notice.warning({ desc: this.$t('msg_notice_147') })
            return false
          }
          //console.log("tmparr[0]=",tmparr[0])
          //console.log("tmparr[1]=",tmparr[1])
          var tmpRange = []
          tmpRange = this.range(tmparr[0], tmparr[1])
          //console.log("tmpRange========",tmpRange)
          tmpRange = tmpRange.map(String)
          tmpRange = tmpRange.map(x=>x.padStart(4, '0'))
          //console.log("tmpRange========",tmpRange)
          output = output.concat(tmpRange)
          //console.log("output========",output)
        }else{
          //console.log("typeofoutput=",typeof(arr[i]))
          if(parseInt(arr[i])>9999){
            this.$Notice.warning({ desc: this.$t('msg_notice_147') })
            return false
          }else{
            arr[i] = arr[i].padStart(4, '0')
            output.push(arr[i])
          }
        }
      }
      output = output.join(",")
      output = output.trim()
      //console.log("output========",output)
      return output
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
    // 存储类型下拉改变方法
    typeChange (typeCode) {
      this.formData.typeCode = typeCode || ''
      this.formData.sectionCode = ''
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
    // 删除
    del () {
      var _this = this,
        eCommand = () => {
          API.ADelete({ whCode: _this.whCode, typeCode: _this.typeCode, binCode: _this.binCode })
            .then((res) => {
              _this.successHandle(res)
            })
        }
      // 弹窗
      _this.$confirm({
        content: _this.$t('msg_notice_74'),
        onOk: eCommand
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
    ok () {
      var regbin = /[^\w,-]/g;
      var _this = this
      this.$refs['formValidate'].validate((valid) => { // 表单验证
        if (valid) {

          if (!_this.preCommitValidation()) {
            return false
          }

          _this.formData.saveOrUpdateFlag = _this.flag === 'E' ? 20 : 10
          var sendData = Object.assign({},this.formData);
          //console.log("sendData=",sendData)
          if(regbin.test(_this.formData.binCode)){
            this.$Notice.warning({ desc: this.$t('msg_notice_155') })
            return
          }
          sendData.binCode = this.formatMinus(sendData.binCode)
          if(sendData.binCode == false){
            return
          }
          var eCommand = () => {
            //API.ASave(_this.formData).then(function (res) {
            API.ASave(sendData).then(function (res) {
              _this.successHandle(res)
            })
          }

          _this.$confirm({
            content: _this.flag === 'E' ? _this.$t('msg_notice_108') : _this.$t('msg_notice_223'),
            onOk: eCommand
          })
        }
      })
    }
  }
}
</script>
