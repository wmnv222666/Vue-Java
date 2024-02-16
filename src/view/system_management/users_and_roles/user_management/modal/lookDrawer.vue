<template>
  <Drawer :title="title" :transfer="true" :closable="true" v-model="modalVal" :mask-closable="!sureStatus" @on-visible-change="visibleChange" width="1000">
    <Form ref="formValidate" :model="formData" :label-width="130" :rules="ruleValidate">
      <Row>
        <Col span="12">
        <FormItem :label="$t('col_user_code')" prop="userCode">
          <Input v-model="formData.userCode" :disabled="flag !== ''" :maxlength="20"></Input>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="User Name" prop="userName">
          <Input v-model="formData.userName" :disabled="justLook" :maxlength="20"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem :label="$t('lbl_email')" prop="email">
          <Input v-model="formData.email" :disabled="justLook"></Input>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem :label="$t('lbl_phone')" prop="phoneNumber">
          <Input v-model="formData.phoneNumber" :disabled="justLook"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
        <FormItem :label="$t('ph_placeholder_35')" prop="validityBeginDate">
          <date-picker type="datetime" :placeholder="$t('ph_placeholder_35')" @on-change="onStartTimeChange" format="yyyy-MM-dd HH:mm:ss" v-model="formData.validityBeginDate" :options="date.startTimeOption" :disabled="justLook"></date-picker>
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem :label="$t('ph_placeholder_36')" prop="validityEndDate">
          <date-picker type="datetime" :placeholder="$t('ph_placeholder_36')" @on-change="onEndTimeChange" format="yyyy-MM-dd HH:mm:ss" v-model="formData.validityEndDate" :options="date.endTimeOption" :disabled="justLook"></date-picker>
        </FormItem>
        </Col>
      </Row>

      <!-- 分配公司与仓库 -->
      <Row>
        <Col span="12">
          <FormItem :label="$t('col_ascription_ware_code')">
              <Select v-model="formData.corpCode">
                  <Option v-for="company in sourceCompanyList" :value="company.corpCode" :key="company.corpCode">
                    {{ company.corpCode }} - {{ company.corpName }}
                  </Option>
              </Select>
          </FormItem>
        </Col>
      </Row>

      <!-- 用户角色授权 -->
      <div class="x-draw-title">{{ $t('lbl_user_role_authorization') }}</div>

      <Row>
        <Col span="23" class="selfTransfer margin-b-16">
        <Transfer :data="sourceRoleList" :target-keys="targetRoleList" :titles="[$t('hx_un_selete'), $t('lbl_has_select')]" @on-change="handleRoleChange">
        </Transfer>
        </Col>
      </Row>

      <!-- 分配公司 -->
      <!-- <div class="x-draw-title">{{ $t('col_ascription_corp_code') }}</div>
       <Row>
        <Col span="23" class="selfTransfer">
          <Transfer
            :data="sourceCompanyList"
            :target-keys="targetCompanyList"
            :titles="[$t('hx_un_selete'), $t('lbl_has_select')]"
            @on-change="handleCompanyChange"
          >
          </Transfer>
        </Col>
      </Row> -->
    </Form>
    <div class="demo-drawer-footer">
      <Button type="primary" class="ivu-btn-button-create margin-right-24" @click="ok" v-show="sureStatus">{{ $t('btn_confirm') }}</Button>
      <Button type="primary" class="ivu-btn-button-create-ghost" @click="cancel">{{ $t('btn_return') }}</Button>
    </div>
  </Drawer>
</template>

<script>
import { API } from '@A/system/User'
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
    row: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    modalVal: {
      get: function () { // 取数据
        return this.drawer
      },
      set: function (val) { // 存数据
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
      date: {
        endTimeOption: {},
        startTimeOption: {}
      },
      sourceRoleList: [], // 获取所有用户授权数组(源数据)
      targetRoleList: [], // 目标用户授权数据

      sourceCompanyList: [], // 源公司
      targetCompanyList: [], // 目标公司

      formData: {
        userId: 0,
        userCode: '',
        userName: '',
        corpCode: '',
        deptCode: '',
        userType: '',
        userPost: '',
        email: '',
        phoneNumber: '',
        phoneNum: '',
        isSyn: '',
        isSynVal: false,
        ftyCode: '',
        validityBeginDate: '',
        validityEndDate: '',
        sysCorpList: [], // 用户已经分配的库存地点
        sysRelCorpList: [], // 用户还没有配置的库存地点集合
        sysRelUserRoleVoList: [], // 用户已经分配的角色集合
        sysRoleVoList: []//  用户没有分配的角色集合
      },
      ruleValidate: {// 表单验证
        userCode: [
          { required: true, message: this.$t('msg_notice_98') },
          { trigger: 'blur', pattern: /^[0-9a-zA-Z]+$/, message: this.$t('msg_notice_111') }
        ],
        userName: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }
        ],
        corpCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        ],
        validityBeginDate: [
          { required: true, message: this.$t('msg_notice_98') }
        ],
        validityEndDate: [
          { required: true, message: this.$t('msg_notice_98') }
        ],
        email: [
          { type: 'email', message: this.$t('msg_notice_224'), trigger: 'blur' }
        ],
        phoneNumber: [
          { trigger: 'blur', message: this.$t('msg_notice_98') }
        ]
      }
    }
  },
  mounted () {
    this.formDataDefault = this.$c(this.formData)// 深拷贝子组件的数据（空值）
  },
  methods: {
    // 抽屉显示隐藏改变调用
    visibleChange (isShow) {
      if (isShow) {
        if (this.flag === 'L') {
          this.show()// 查询反显数据
        } else if (this.flag === 'E') {
          this.show()
        } else {
          this.getAllSysRoleList() // 获取所有角色授权集合
          this.getCorpDeptFtyLocTree() // 获取所有公司
        }
      } else {
        this.cancel()
      }
    },
    // 查询反显数据
    async show () {
      var [err, res] = await this.$to(API.AGetSysUserInfo(this.row.userId)); if (err) { return false }
      var data = res.data

      this.formData = data

      if (this.flag == 'E') {
        this.onStartTimeChange(data.validityBeginDate)
        this.onEndTimeChange(data.validityEndDate)
      }

      // data.sysRoleVoList 可分配用户角色
      // data.sysRelUserRoleVoList 已分配用户角色
      var sourceRoleList = data.sysRoleVoList.concat(data.sysRelUserRoleVoList)
      this.sourceRoleList = this.formatSourceData(sourceRoleList, 'roleCode', 'roleName') // 源角色（待分配角色）
      this.targetRoleList = this.formatTargetData(data.sysRelUserRoleVoList, 'roleCode') // 目标角色（已分配角色）

      var sourceCompanyList = data.sysCorpList.concat(data.sysRelCorpList)
      this.sourceCompanyList = this.formatSourceData(sourceCompanyList, 'corpCode', 'corpName') // 源角色（待分配角色）
      this.targetCompanyList = this.formatTargetData(data.sysRelCorpList, 'corpCode') // 目标角色（已分配角色）

    },
    // 获取所有功能权限
    async getAllSysRoleList () {
      var [err, res] = await this.$to(API.AGetAllSysRoleList()); if (err) { return false }
      var headList = res.data.headList || []
      this.sourceRoleList = this.formatSourceData(headList, 'roleCode', 'roleName')
    },
    // 获取公司
    async getCorpDeptFtyLocTree () {
      var [err, res] = await this.$to(API.AGetCorpDeptFtyLocTree()); if (err) { return false }
      var corpVoList = res.data.corpVoList || []
      this.sourceCompanyList = this.formatSourceData(corpVoList, 'corpCode', 'corpName')
    },
    // 用户角色穿梭回调
    handleRoleChange (newTargetKeys) {
      this.targetRoleList = newTargetKeys
    },
    // 公司穿梭回调
    handleCompanyChange (newTargetKeys) {
      this.targetCompanyList = newTargetKeys
    },
    // Transfer源数据列表处理
    formatSourceData (list, key, label) {
      return list.map(function (item) {
        item.key = item[key]; item.label = `${item[key]} - ${item[label]}`; return item
      })
    },
    // Transfer目标数据列表处理
    formatTargetData (list, key) {
      return list.map(function (item) { return item[key] })
    },
    // 通过key数组过滤源数据
    getListByArray (sourceArr, keyArr, key) {
      let newArr = [];

      sourceArr.forEach(function (item) {
        if (keyArr.includes(item.key)) {
          newArr.push(item);
        };
      })

      return newArr
    },
    // 提交前校验
    preCommitValidation () {
      this.formData.sysRelUserRoleVoList = this.getListByArray(this.sourceRoleList, this.targetRoleList, 'roleCode')
      this.formData.sysRelCorpList = this.getListByArray(this.sourceCompanyList, this.targetCompanyList, 'corpCode')

      if (this.formData.sysRelUserRoleVoList.length === 0) {
        this.$Notice.warning({ desc: this.$t('msg_notice_148') })
        return false
      }

      // if (this.formData.sysRelCorpList.length === 0) {
      //   this.$Notice.warning({ desc: this.$t('msg_notice_886') })
      //   return false
      // }
      return true
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
    ok () {
      var _this = this
      this.$refs['formValidate'].validate((valid) => { // 表单验证

        if (valid) {

          if (!_this.preCommitValidation()) {
            return false
          }

          var eCommand = () => {
            API.ASaveSysUser(_this.formData)
              .then(function (res) {
                _this.successHandle(res)
              })
          }

          _this.$confirm({
            content: _this.flag == 'E' ? _this.$t('msg_notice_108') : _this.$t('msg_notice_223'),
            onOk: eCommand
          })
        }
      })
    },
    cancel () {
      this.$refs['formValidate'].resetFields()// 表单重置
      this.modalVal = false
      this.formData = Object.assign(this.formData, this.formDataDefault)
      this.sourceRoleList = []
      this.targetRoleList = []
      this.sourceCompanyList = []
      this.targetCompanyList = []
    },
    onStartTimeChange (startTime) {
      this.formData.validityBeginDate = startTime
      this.date.endTimeOption = {
        disabledDate (endTime) {
          return endTime.valueOf() < new Date(startTime).valueOf()
        }
      }
    },
    onEndTimeChange (endTime) {
      this.formData.validityEndDate = endTime
      this.date.startTimeOption = {
        disabledDate (startTime) {
          return startTime.valueOf() > new Date(endTime).valueOf()
        }
      }
    }
  }
}
</script>
<style>
.selfTransfer .ivu-transfer .ivu-transfer-list {
  display: inline-block;
  width: 45%;
  height: 350px;
  position: relative;
}
</style>
