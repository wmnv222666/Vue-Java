<template>
  <Drawer width="600" :title="title" :transfer="true" :closable="true" v-model="modalVal" :mask-closable="justLook" @on-close="cancel" @on-visible-change="visibleChange">
    <div>
      <div>
        <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="140">
          <!-- 物料编码 -->
          <FormItem :label="$t('col_mat_code')" prop="matCode">
            <div v-if="justLook">{{ $s(formData.matCode) }}</div>
            <Input v-else v-model="formData.matCode" :disabled="disabled"></Input>
          </FormItem>

          <FormItem :label="$t('col_mat_name')" prop="matName">
            <div v-if="justLook">{{ $s(formData.matName) }}</div>
            <Input v-else v-model="formData.matName" type="textarea"></Input>
          </FormItem>

          <!-- 描述信息 -->
          <!-- <div class="x-draw-title">{{ $t('lbl_descriptive_information') }}</div> -->
          <!-- 多语言 -->

          <!-- <Row v-if="!justLook">
            <FormItem v-for="(item, index) in formData.materialNameList" :key="index" :label="$t('col_mat_name')" :prop="'materialNameList.' + index + '.matName'" :rules="{ required: true, message: $t('col_mat_name') + index + $t('msg_notice_98'), trigger: 'blur' }">
              <Row>
                <Input type="text" v-model="item.matName" maxlength="200"></Input> -->
          <!--                <Col span="7">-->
          <!--                  <Select v-model="item.langCode">-->
          <!--                    <Option v-for="itemLang in langList" :value="itemLang.langCode" :key="itemLang.langCode">-->
          <!--                      {{ itemLang.langCode }} - {{ itemLang.langNameZh }}-->
          <!--                    </Option>-->
          <!--                  </Select>-->
          <!--                </Col>-->
          <!--                <Col span="11" offset="1">-->
          <!--                  <Input type="text" v-model="item.matName" maxlength="200"></Input>-->
          <!--                </Col>-->
          <!--                <Col span="4" offset="1">-->
          <!--                  <Button @click="handleRemove(index)">{{ $t('btn_delete') }}</Button>-->
          <!--                </Col>-->
          <!-- </Row>
            </FormItem> -->
          <!--            <FormItem>-->
          <!--              <Row>-->
          <!--                <Col span="12">-->
          <!--                  <Button type="dashed" long @click="handleAdd" icon="md-add">{{ $t('btn_add') }}</Button>-->
          <!--                </Col>-->
          <!--              </Row>-->
          <!--            </FormItem>-->
          <!-- </Row>
          <Row v-else>
            <FormItem :label="$t('col_mat_name')">
              {{formData.matName}} -->
          <!-- <Row v-for="(item, indexItem) in formData.materialNameList" :key="indexItem">
                <Col span="7"><Input :value="item.langCode" disabled /></Col>
                <Col span="11" offset="1"><Input :value="item.text" disabled></Input></Col>
              </Row> -->
          <!-- </FormItem>
          </Row> -->

          <!-- 属性信息 -->
          <!-- <div class="x-draw-title">{{ $t('lbl_attr_msg') }}</div> -->

          <!-- 物料类型 -->
          <FormItem :label="$t('col_matType_name')" prop="matTypeCode">
            <div v-if="justLook">{{ $s(formData.matTypeCode) }}</div>
            <Select v-else v-model="formData.matTypeCode" :disabled="disabled">
              <Option v-for="(item, i) in matTypeList" :value="item.value" :key="i" :label="item.value"></Option>
            </Select>
          </FormItem> 

          <!-- 单位 -->
          <FormItem label="UoM" prop="unitWeight">
            <div v-if="justLook">{{ $s(formData.unitWeight) }}</div>
            <Select v-else v-model="formData.unitWeight" :disabled="disabled" @on-change="weiChange">
              <Option v-for="(item, i) in unitList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select>
          </FormItem>

          <FormItem label="Ex item 1" prop="mat_ext0">
            <div v-if="justLook">{{ $s(formData.matExt0) }}</div>
            <Input v-else v-model="formData.matExt0"></Input>
          </FormItem>

          <FormItem label="Ex item 2" prop="mat_ext1">
            <div v-if="justLook">{{ $s(formData.matExt1) }}</div>
            <Input v-else v-model="formData.matExt1" ></Input>
          </FormItem>

          <FormItem label="Ex item 3" prop="mat_ext2">
            <div v-if="justLook">{{ $s(formData.matExt2) }}</div>
            <Input v-else v-model="formData.matExt2"></Input>
          </FormItem>

          <FormItem label="Ex item 4" prop="mat_ext3">
            <div v-if="justLook">{{ $s(formData.matExt3) }}</div>
            <Input v-else v-model="formData.matExt3"></Input>
          </FormItem>

          <!-- <FormItem label="UoM In PCS" prop="unitCode">
            <div v-if="justLook">{{ $s(formData.unitCode) }}</div>
            <Select v-else v-model="formData.unitCode" :disabled="disabled">
              <Option v-for="(item, i) in unitList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select>
          </FormItem> -->

          <!-- 毛重.净重 -->
          <!-- <FormItem :label="$t('col_net_weight')">
            <el-input-number :disabled="justLook" :step="1.0" v-model="formData.netWeight" :precision="formData.decimalPlaceWeight" :min="0" controls-position="right"></el-input-number>
          </FormItem> -->
          <!-- <div class="x-draw-title">{{$t('lbl_picture_information')}}</div> -->

          <Row>
            <Col span="23">
              <itemUpload :key="$gid()" :list="formData.imgList" @changeFile="changeFile"
                          :isSuccess.sync="isSuccess" :disabled="justLook" @uploadStart="uploadStart"
                          @uploadFinished="uploadFinished"/>
            </Col>
          </Row>

        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button v-if="sureStatus" type="primary" class="ivu-btn-button-create margin-right-24" @click="ok">
          {{ $t('btn_confirm') }}
        </Button>
        <Button v-if="deleteStatus" type="primary" class="ivu-btn-button-create-ghost margin-right-24" @click="del">
          {{ $t('btn_delete') }}
        </Button>
        <Button type="primary" class="ivu-btn-button-create-ghost" @click="cancel">{{ $t('btn_return') }}</Button>
      </div>
    </div>
  </Drawer>
</template>

<script>
import { API } from '@A/system/SKUMasterData'
import { getProUri } from '@/libs/assist'
import { imgUpload } from '_c/uploadFile'
 // 行项目图片上传
import itemUpload from '_c/orderUpload/itemUpload.vue'

export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    flag: {
      type: String,
      default: ''
    },
    matCode: [String]
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
  components: {
     imgUpload,
     itemUpload
  },
  data () {
    return {
      isUploadSuccess: true,
      isSuccess: false,
      index: 1,
      itemIndex: 1,
      disabled: false, // 编辑时禁用输入框
      fileList: [],
      // 上传图片部分
      defaultList: [], // 默认已上传的图片
      imgInfo: {
        name: '',
        imgName: '',
        imgCode: '',
        createUserId: '',
        createUserName: '',
        createTime: '',
        fileExt: '',
        url: ''
      },
      formData: {
        matCode: '',
        materialNameList: [ // 描述
          {
            langCode: 'en-US',
            matName: '',
            status: 1,
            value: ''
          }
        ],
        indexDesc: 0, // 语言描述下标
        matTypeCode: '',
        unitCode: '',
        matGroupCode: '',
        length: null,
        width: null,
        height: null,
        grossWeight: null,
        netWeight: 0,
        volume: null,
        shelfLife: null,
        unitLength: 'M',
        unitWeight: '',
        unitVolume: 'M3',
        decimalPlaceLength: 0, // 长宽高单位精度
        decimalPlaceWeight: 0, // 体重单位精度
        decimalPlaceVolume: 0, // 体积单位精度
        freeze: 0,
        dangerous: 0,
        batchErpEnabled: 0,
        batchProductEnabled: 0,
        packageEnabled: 0,
        imgList: []
      },
      ruleValidate: {// 表单验证
        matCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' },
          { trigger: 'blur', pattern: /^[a-zA-Z0-9\-]{0,20}$/, message: this.$t('msg_notice_106') }
        ],
        matName: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' },
          //{ trigger: 'blur', pattern: /^[a-zA-Z0-9\-]{0,20}$/, message: this.$t('msg_notice_106') }
        ],
        // langCode: [
        //   { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        // ],
        matTypeCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        ],
        unitWeight: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        ],
        mat_ext0: [
          { trigger: 'blur', pattern: /^\w{0,10}$/, message: "Max length is 10" }
        ],
         mat_ext1: [
          { trigger: 'blur', pattern: /^\w{0,10}$/, message: "Max length is 10" }
        ],
         mat_ext2: [
          { trigger: 'blur', pattern: /^\w{0,10}$/, message: "Max length is 10" }
        ],
         mat_ext3: [
          { trigger: 'blur', pattern: /^\w{0,10}$/, message: "Max length is 10" }
        ],
        // matGroupCode: [
        //   { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        // ]
      },
      langList: [], // 语言列表
      matGroupList: [], // 物料组
      unitList: [], // 计量单位
      matTypeList: [] // 物料类型
    }
  },
  mounted () {
    this.formDataDefault = this.$c(this.formData)
  },
  methods: {
    // 抽屉显示隐藏改变调用
    visibleChange (isShow) {
      if (isShow) {
        // 创建
        if (this.flag === '') {
          this.getBaseInfo() // 获取备选数据
          this.isSuccess = true
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
      var [err, res] = await this.$to(API.AGetDetail(this.matCode)); if (err) { return false }
      var data = res.data
      if (!data.manageVo) {
        return false
      }

      data.manageVo.materialNameList = data.materialNameList.length ? data.materialNameList : [{ langCode: 'en-US', matName: '' }] // 语言列表
      data.manageVo.indexDesc = data.materialNameList.length - 1
      this.formData = data.manageVo
      this.formData.imgList = data.imgList // 图片列表赋值
      //console.log("!!!!")
      this.formData.imgList = this.formData.imgList.map((item) => {
        item.url = getProUri(this, `images/img/org/${item.fileCode}`)
        //console.log("item.url",item.url)
        return item
      })
      //console.log("this.formData.imgList",this.formData.imgList)
      this.isSuccess = true
      this.defaultList = this.formData.imgList // 默认已上传列表赋值
      //console.log("this.defaultList",this.defaultList)
    },
    getBaseInfo () {
      this.getLangList()
      this.getSKUTypeGroupUnit()
    },
    // 语言查询
    async getLangList () {
      var [err, res] = await this.$to(API.ALanguageList()); if (err) { return false }
      this.langList = res.data
    },
    // 物料类型、物料组、计量单位下拉查询
    async getSKUTypeGroupUnit () {
      var [err, res] = await this.$to(API.AGetSKUTypeGroupUnit()); if (err) { return false }
      var data = res.data
      // this.matGroupList = this.$kv(data.matGroupList, 'matGroupCode', 'matGroupName', true)  // 物料组
      this.unitList = this.$kv(data.unitList, 'unitCode', 'unitName', true) // 计量单位
      this.matTypeList = this.$kv(data.matTypeList, 'matTypeCode', 'matTypeName', true) // 物料类型
    },
    // 添加描述输入框
    handleAdd () {
      // 添加描述的条数不能大于语言下拉的条数
      var lang = this.langList.length
      var add = this.formData.indexDesc + 1

      if (lang > add) {
        // 先自加再执行语句操作
        this.formData.materialNameList.push({ langCode: '', matName: '' })
        this.formData.indexDesc++
      } else {
        // 添加数量不能大于语言种类
        this.$Notice.warning({ desc: this.$t('msg_notice_339') })
        return false
      }
    },
    // 删除描述输入框
    handleRemove (index) {
      if (this.formData.indexDesc === 0) {
        return false
      }
      this.formData.materialNameList.splice(index, 1)
      this.formData.indexDesc--
    },
    //附件回调
    imgListCallBack (data) {
      var _this = this
      data.imgList.map(function (item) {
        item.url = getProUri(_this, `images/img/org/${item.imgCode}`)
        return item
      })
      this.fileList = data.imgList // 图片列表赋值
    },
    // 处理语言列表
    langCallBack (data) {

    },
    // 语言重复验证
    repetCheck (arr, key) {
      let obj = {}, len = arr.length
      while (len) {
        len--
        if (obj[arr[len][key]]) {
          return true
        } else {
          obj[arr[len][key]] = arr[len][key]
        }
      }
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
    // 重量下拉改变
    weiChange (value) {
      var filterData = this.unitList.find(function (item) {
        return item.value == value
      })
      this.formData.decimalPlaceWeight = filterData ? filterData.decimalPlace : 0
    },
    // 删除
    del () {
      var _this = this,
        eCommand = () => {

          API.ADelete(this.matCode)
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
      this.fileList = []
    },
    cancel () {
      this.$refs['formValidate'].resetFields()// 表单重置
      this.modalVal = false
    },
    // 提交前校验
    preCommitValidation () {
      // 验证语言描述是否重复
      var isCheck = this.repetCheck(this.formData.materialNameList, 'langCode')
      if (isCheck) {
        this.$Notice.warning({ desc: this.$t('msg_notice_107') })
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

          _this.formData.isAdd = _this.flag === ''

          _this.formData.unitCode = _this.formData.unitWeight
        
          var eCommand = () => {
            API.ASave(_this.formData).then(function (res) {
              _this.successHandle(res)
            })
          }

          _this.$confirm({
            content: _this.flag === 'E' ? _this.$t('msg_notice_108') : _this.$t('msg_notice_223'),
            onOk: eCommand
          })
        }
      })
    },
    // 文件上传
    changeFile(fileList) {
      this.$set(this.formData, 'imgList', fileList)
    },
    uploadStart() {
      this.isUploadSuccess = false
    },
    uploadFinished() {
      this.isUploadSuccess = true
    },
    // 上传成功
    changeHandle (fileList) {
      this.formData.imgList = fileList
    }
  }
}
</script>
