<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2019-09-12 15:46:09
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-11 12:33:38
 * @Description: 存储类型管理
 -->
<template>
  <Drawer :width="600" :title="title" :transfer="true" :closable="true" v-model="modalVal" :mask-closable="true" @on-close="cancel" @on-visible-change="visibleChange">
    <div>
      <div>
        <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="150">
          <FormItem :label="$t('ZoneCode')" prop="typeCode">
            <div v-if="justLook">{{ $s(formData.typeCode) }}</div>
            <Input v-else v-model="formData.typeCode" :disabled="typeDisabled"></Input>
          </FormItem>
          <Row v-if="!justLook">
            <FormItem v-for="(item, index) in formData.dicTextList" :key="index" :label="$t('ZoneName')" :prop="'dicTextList.' + index + '.text'" :rules="{ required: true, message: $t('ZoneName') + index + $t('msg_notice_98'), trigger: 'blur' }">
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
            <FormItem :label="$t('ZoneName')">
              <Row v-for="(item, indexItem) in formData.dicTextList" :key="indexItem">
                <Col span="7"><Input :value="item.langCode" disabled /></Col>
                <Col span="11" offset="1"><Input :value="item.text" disabled></Input></Col>
              </Row>
            </FormItem>
          </Row>

          <FormItem :label="$t('col_ascription_wh_code')" prop="whCode">
            <div v-if="justLook">{{ $s(formData.whCode) }}-{{ $s(formData.whName) }}</div>
            <Select v-else v-model="formData.whCode" :disabled="whDisabled">
              <Option v-for="(item, i) in whList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div class="demo-drawer-footer">
        <Button v-if="sureStatus" type="primary" class="ivu-btn-button-create margin-right-24" @click="ok">{{ $t('btn_confirm') }} </Button>
        <Button v-if="deleteStatus" type="primary" class="ivu-btn-button-create-ghost margin-right-24" @click="del">{{ $t('btn_delete') }} </Button>
        <Button type="primary" class="ivu-btn-button-create-ghost" @click="cancel">{{ $t('btn_return') }}</Button>
      </div>
    </div>
  </Drawer>
</template>

<script>
import { API } from '@A/system/StorageType'

export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    flag: { type: String, default: '' },
    row: {
      type: Object,
      default () {
        return {}
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
      index: 0,
      typeDisabled: false, // 编辑时禁用输入框
      whDisabled: false, // 编辑时禁用输入框
      formData: {
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
        typeCode: '', // 存储类型（必填）
        typeMarkCode: '', // 特殊存储类型标识
        typeMarkName: '', // 特殊存储类型标识描述
        stockMax: 0, // 最高库存
        stockMin: 0, // 最低库存
        stockFit: 0, // 合理库存
        stockMaxWarning: 0, // 预警库存高
        stockMinWarning: 0, // 预警库存低
        stockUnitCode: 'KG', // 统计单位
        abilityInputEnabled: 0, // 存储能力激活
        cellEnabled: 0, // 存储单元激活
        storageMixEnabled: 0, // 允许混储标识
        strategyInput: '', // 入库策略（必填）
        strategyOutput: '', // 出库策略（必填）
        abilityInputType: '', // 能力检查（必填）
        whCode: ''// 归属仓库号（必填）
      },
      langList: [], // 语言列表
      whList: [], // 仓库列表
      ruleValidate: {// 表单验证
        typeCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' },
          { trigger: 'blur', pattern: this.$config.PATTERN.LETTER_NUMBER_04, message: this.$t('msg_notice_132') }
        ],
        langCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        ],
        text: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }
        ],
        whCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        ]
      }
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
          return false
        }
        // 编辑
        if (this.flag === 'E') {
          this.typeDisabled = true
          this.whDisabled = true
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
      var [err, res] = await this.$to(API.AGetDetail(this.row.whCode, this.row.typeCode)); if (err) { return false }
      var data = res.data
      data.dicTextList = data.dicTextList.length ? data.dicTextList : [{ langCode: 'en-US', text: '' }] // 语言列表
      data.indexDesc = data.dicTextList.length - 1
      this.formData = data
    },
    getBaseInfo () {
      this.getLangList()
      this.getWhList()
    },
    // 语言查询
    async getLangList () {
      var [err, res] = await this.$to(API.ALanguageList()); if (err) { return false }
      this.langList = res.data
    },
    // 仓库查询
    async getWhList () {
      var [err, res] = await this.$to(API.AGetWhList()); if (err) { return false }
      this.whList = this.$kv(res.data.headList, 'whCode', 'whName', true)
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

    del () {
      var _this = this,
        eCommand = () => {

          API.ADelete(_this.formData.whCode, _this.formData.typeCode)
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
      this.typeDisabled = false // 编辑时禁用输入框
      this.whDisabled = false // 编辑时禁用输入框
      this.formData = Object.assign({}, this.formData, this.formDataDefault) // 再将抽屉打开时，子组件深拷贝的formdata（空值）传回来，实现清数据
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
      this.$refs['formValidate'].validate((valid) => { // 表单验证
        if (valid) {

          if (!_this.preCommitValidation()) {
            return false
          }

          _this.formData.saveOrUpdateFlag = _this.flag == 'E' ? 20 : 10

          var eCommand = () => {
            API.ASave(_this.formData).then(function (res) {
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
