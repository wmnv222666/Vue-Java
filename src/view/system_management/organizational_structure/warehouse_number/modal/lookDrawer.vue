<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2019-09-12 15:46:09
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-17 11:32:26
 * @Description: 仓库号管理
 -->
<template>
  <Drawer :width="600" :title="title" :transfer="true" :closable="true" v-model="modalVal" :mask-closable="true" @on-close="cancel" @on-visible-change="visibleChange">
    <div>
      <div>
        <Row :gutter="12">
          <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="140">
            <FormItem :label="$t('lbl_wh_code')" prop="whCode">
              <div v-if="justLook">{{ formData.whCode }} - {{ formData.whName }}</div>
              <Input v-else v-model="formData.whCode" :disabled="disabled" :maxlength="10" show-word-limit></Input>
            </FormItem>
            <FormItem label="Postal Code" prop="country">
              <div v-if="justLook">{{ $s(formData.country) }}</div>
              <Input v-else v-model="formData.country" />
            </FormItem>
            <FormItem :label="$t('lbl_city')" prop="city">
              <div v-if="justLook">{{ $s(formData.city) }}</div>
              <Input v-else v-model="formData.city" />
            </FormItem>

            <Row v-if="!justLook">
              <FormItem v-for="(item, index) in formData.dicTextList" :key="index" :label="$t('col_wh_name')" :prop="'dicTextList.' + index + '.text'" :rules="{ required: true, message: $t('col_wh_name') + index + $t('msg_notice_98'), trigger: 'blur' }">
                <Row>
                  <!-- <Col span="7">
                  <Select v-model="item.langCode">
                    <Option v-for="itemLang in langList" :value="itemLang.langCode" :key="itemLang.langCode">
                      {{ itemLang.langCode }} - {{ itemLang.langName }}
                    </Option>
                  </Select>
                  </Col> -->
                  <Col span="11" offset="1">
                  <Input type="text" v-model="item.text" maxlength="200"></Input>
                  </Col>
                  <!-- <Col span="4" offset="1">
                  <Button @click="handleRemove(index)">{{ $t('btn_delete') }}</Button>
                  </Col> -->
                </Row>
              </FormItem>
              <!-- <FormItem>
                <Row>
                  <Col span="12">
                  <Button type="dashed" long @click="handleAdd" icon="md-add">{{ $t('btn_add') }}</Button>
                  </Col>
                </Row>
              </FormItem> -->
            </Row>
            <Row v-else>
              <FormItem :label="$t('col_wh_name')">
                <Row v-for="(item, indexItem) in formData.dicTextList" :key="indexItem">
                  <Col span="7"><Input :value="item.langCode" disabled /></Col>
                  <Col span="11" offset="1"><Input :value="item.text" disabled></Input></Col>
                </Row>
              </FormItem>
            </Row>

            <FormItem :label="$t('col_address')" prop="whAddress">
              <div v-if="justLook">{{ $s(formData.whAddress) }}</div>
              <Input v-else v-model="formData.whAddress" :maxlength="100" show-word-limit></Input>
            </FormItem>

          </Form>
        </Row>
      </div>
      <div class="demo-drawer-footer">
        <Button v-if="sureStatus" type="primary" class="ivu-btn-button-create margin-right-24" @click="ok">{{ $t('btn_confirm') }}</Button>
        <!-- <Button v-if="deleteStatus" type="primary" class="ivu-btn-button-create-ghost margin-right-24" @click="del">{{ $t('btn_delete') }}</Button> -->
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
    },
    flag: { type: String, default: '' },
    whCode: [Number, String]
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
  data () {
    return {
      index: 1,
      disabled: false, // 编辑时禁用输入框
      formData: {
        whCode: '',
        country: '',
        city: '',
        dicTextList: [
          {
            langCode: 'en-US',
            text: '',
            status: 1,
            value: '',
            index: 1
          }
        ],
        indexDesc: 0, // 语言描述下标
        whAddress: '',
        dicStockLocationList: [],
        binEnabled: 1, // 启用仓位内容隐藏显示
      },
      langList: [], // 语言列表
      inputList: [], // 入库顺序列表
      outList: [], // 出库顺序列表
      selectedData: [],
      ruleValidate: {// 表单验证
        whCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' },
          { trigger: 'blur', pattern: /^[a-zA-Z0-9]{0,10}$/, message: this.$t('msg_notice_202') }
        ],
        langCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        ],
        text: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }
        ],
        country: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }
        ],
        city: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }
        ],
        whAddress: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }
        ]
      },
      isAdd: false // 新增中的表格新增
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
          this.getLangAndWaveForAE() // 获取备选数据
          return false
        }
        // 编辑
        if (this.flag === 'E') {
          this.disabled = true
          this.getLangAndWaveForAE() // 获取备选数据
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
      var [err, res] = await this.$to(API.AGetDetail(this.whCode)); if (err) { return false }
      var data = res.data
      data.dicTextList = data.dicTextList.length ? data.dicTextList : [{ langCode: 'en-US', text: '' }] // 语言列表
      data.indexDesc = data.dicTextList.length - 1
      this.formData = data
    },
    getLangAndWaveForAE () {
      this.getLangList()
    },
    // 语言查询
    async getLangList () {
      var [err, res] = await this.$to(API.ALanguageList()); if (err) { return false }
      this.langList = res.data
    },
    // 添加描述输入框
    handleAdd () {
      // 添加描述的条数不能大于语言下拉的条数
      var lang = this.langList.length
      var add = this.formData.indexDesc + 1

      if (lang > add) {
        // 先自加再执行语句操作
        this.index++
        this.formData.dicTextList.push({ langCode: '', text: '' })
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
      this.formData.dicTextList.splice(index, 1)
      this.formData.indexDesc--
    },
    // 处理语言列表
    langCallBack (data) {
      var _this = this
      _this.formData.dicTextList = data.dicTextList // 语言列表
      if (!_this.formData.dicTextList.length) {
        _this.formData.indexDesc = 0
        var obj = [{
          langCode: 'en-US',
          text: '',
          status: 1,
          index: 1
        }]
        _this.formData.dicTextList = Object.assign(_this.formData.dicTextList, obj)
      } else {
        _this.formData.indexDesc = _this.formData.dicTextList.length - 1
        _this.formData.dicTextList.map((item, i) => { // 显示语言描述
          item.status = 1
          item.index = i + 1
        })
      }
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
    // 选中行改变触发
    selectionChange ({ selection }) {
      this.selectedData = selection
    },
    del () {
      var _this = this,
        eCommand = () => {

          API.ADelete(_this.formData.whCode)
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
      this.disabled = false
      this.formData = Object.assign({}, this.formDataDefault)
    },
    cancel () {
      this.$refs['formValidate'].resetFields()// 表单重置
      this.modalVal = false
    },
    // 提交前校验
    preCommitValidation () {
      // 验证语言描述是否重复
      var isCheck = this.repetCheck(this.formData.dicTextList, 'langCode')
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

          _this.formData.saveOrUpdateFlag = _this.flag == 'E' ? 20 : 10

          var eCommand = () => {
            API.AAdd(_this.formData).then(function (res) {
              _this.successHandle(res)
            })
          }

          _this.$confirm({
            content: _this.flag == 'E' ? _this.$t('msg_notice_108') : _this.$t('msg_notice_223'),
            onOk: eCommand
          })
        }
      })
    }
  }
}
</script>
