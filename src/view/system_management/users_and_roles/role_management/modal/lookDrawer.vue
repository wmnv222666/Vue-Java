<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2019-09-12 15:46:09
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-15 11:01:38
 * @Description: 
 -->
<template>
  <div>
    <Drawer :title="title" :closable="true" v-model="modalVal" :mask-closable="true" @on-close="cancel" @on-visible-change="visibleChange" width="800">
      <div>
        <Row>
          <Form ref="formValidate" :model="formData" :label-width="140" :rules="ruleValidate">
            <!-- 角色代码 -->
            <FormItem :label="$t('col_role_code')" prop="roleCode">
              <Input v-model="formData.roleCode" :disabled="flag !== ''" :maxlength="10"></Input>
            </FormItem>
            <!-- 角色描述 -->
            <FormItem :label="$t('col_role_name')" prop="roleName">
              <Input type="textarea" v-model="formData.roleName" :maxlength="100" :disabled="flag === 'L'"></Input>
            </FormItem>
          </Form>
          <!-- 功能分配 -->
          <div class="x-draw-title">{{ $t('lbl_function_allocation') }}</div>

          <Col span="23" class="selfTransfer margin-b-16">
          <Transfer :data="sourceResourcesList" :target-keys="targetResourcesList" :titles="[$t('hx_un_selete'), $t('lbl_has_select')]" @on-change="handleResChange">
          </Transfer>
          </Col>

          <Divider></Divider>

          <Row v-show="sureStatus">
            <ButtonGroup>
              <!-- 新增 -->
              <Button icon="md-add" @click="isAdd = true">{{ $t('btn_new') }}</Button>
              <!-- 删除 -->
              <Button icon="ios-trash" @click="del">{{ $t('btn_delete') }}</Button>
            </ButtonGroup>
          </Row>
          <div style="margin-top: 16px;">
            <vxe-table :data="formData.roleHaveUsers" max-height="400" stripe show-overflow resizable @checkbox-change="selectionChange" v-if="modalVal">
              <vxe-table-column v-if="flag !== 'L'" type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column type="seq" :title="$t('col_number')" width="150"></vxe-table-column>
              <vxe-table-column sortable field="userCode" :title="$t('col_user_code')"></vxe-table-column>
              <vxe-table-column sortable field="userName" :title="$t('col_user_name')"></vxe-table-column>
            </vxe-table>
          </div>
        </Row>
        <div class="demo-drawer-footer">
          <Button type="primary" class="ivu-btn-button-create margin-right-24" v-show="sureStatus" @click="ok">{{ $t('btn_confirm') }}</Button>
          <Button type="primary" class="ivu-btn-button-create-ghost" @click="cancel">{{ $t('btn_return') }}</Button>
        </div>
      </div>
    </Drawer>
    <!--新增抽屉-->
    <add :drawer.sync="isAdd" :roleCode="roleCode" @on-ok="changUserData" />
  </div>
</template>

<script>
import { API } from '@A/system/Role'
import add from './add.vue'
export default {
  components: { add },
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default () {
        return {}
      }
    },
    flag: {
      type: String,
      default: ''
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
      sourceResourcesList: [], // 获取所有用户权限数组(源数据)
      targetResourcesList: [], // 目标数据
      roleCode: '',
      isAdd: false, // 新增中的表格新增
      formData: {
        createTime: '',
        roleCode: '',
        roleName: '',
        createUserCode: '',
        createUserId: '',
        createUserName: '',
        roleHaveResources: [], // 角色已经配置的功能集合
        roleNotHaveResources: [], // 角色还没有配置的功能集合
        roleHaveUsers: [], // 角色已经配置的用户集合
        roleNotHaveUsers: []// 角色还没有配置的用户集合
      },
      ruleValidate: {// 表单验证
        roleCode: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'blur' },
          { trigger: 'blur', pattern: /^[0-9a-zA-Z]+$/, message: this.$t('msg_notice_111') }
        ],
        roleName: [
          { required: true, message: this.$t('msg_notice_98'), trigger: 'change' }
        ]
      },
      list: [],
      selectionList: []
    }
  },
  mounted () {
    this.formDataDefault = this.$c(this.formData)// 深拷贝子组件的数据（空值）
  },
  methods: {
    // 抽屉显示隐藏改变调用
    visibleChange (isShow) {
      if (isShow) {
        // 判断标题
        if (this.flag == 'L') {
          this.show()// 查询反显数据
        } else if (this.flag == 'E') {
          this.roleCode = this.row.roleCode
          this.show()
        } else {
          this.roleCode = ''
          this.getResourcesList()
        }
      } else {
        this.clearData()
      }
    },
    // 查询反显数据 看上面的show判断
    async show () {
      var [err, res] = await this.$to(API.AGetSysRoleInfo(this.row.roleCode)); if (err) { return false }
      var data = res.data
      this.formData = data

      var sourceResources = data.roleHaveResources.concat(data.roleNotHaveResources)
      this.sourceResourcesList = this.formatSourceData(sourceResources)
      this.targetResourcesList = this.formatTargetData(data.roleHaveResources)

    },
    // 获取所有功能权限
    async getResourcesList () {
      var [err, res] = await this.$to(API.AGetAllResourcesList()); if (err) { return false }
      var headList = res.data.headList || []
      this.sourceResourcesList = this.formatSourceData(headList)
    },
    // 资源穿梭回调
    handleResChange (newTargetKeys) {
      this.targetResourcesList = newTargetKeys
    },
    // Transfer源数据列表处理
    formatSourceData (list) {
      return list.map(function (item) {
        var sourceType = item.resourcesType == 1 ? 'pad' : 'web'
        if (item.resourcesName == 'Zoon') { item.resourcesName = 'Zone' }
        item.key = item.resourcesCode; item.label = `${item.resourcesName} - ${sourceType}`; return item
      })
    },
    // Transfer目标数据列表处理
    formatTargetData (list) {
      return list.map(function (item) { return item.resourcesCode })
    },
    // 通过key数组过滤源数据
    getListByArray (sourceArr, keyArr) {
      let newArr = [];

      sourceArr.forEach(function (item) {
        if (keyArr.includes(item.key)) {
          newArr.push(item);
        };
      })

      return newArr
    },
    selectionChange ({ selection }) {
      this.selectionList = selection
    },
    clearData () {
      this.formData = Object.assign(this.formData, this.formDataDefault)
      this.sourceResourcesList = []
      this.targetResourcesList = []
    },
    /**
     * @Description: 添加用户回调
     * @Author: Jiang Xiao
     * @Param: userList 已选择的用户
     */
    changUserData (userList) {
      this.formData.roleHaveUsers = this.$mergeArray(this.formData.roleHaveUsers, userList, 'userCode')
    },
    // 删除用户
    del () {
      this.formData.roleHaveUsers = this.$del(this.formData.roleHaveUsers, this.selectionList, 'userCode')
    },
    cancel () {
      this.$refs['formValidate'].resetFields()// 表单重置
      this.modalVal = false
      this.clearData()
    },
    // 提交前校验
    preCommitValidation () {
      this.formData.roleHaveResources = this.getListByArray(this.sourceResourcesList, this.targetResourcesList)

      if (this.formData.roleHaveResources.length == 0) {
        this.$Notice.warning({ desc: this.$t('msg_notice_144') })
        return false
      }
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
      _this.$refs['formValidate'].validate((valid) => { // 表单验证

        if (valid) {

          if (!_this.preCommitValidation()) {
            return false
          }

          _this.formData.isAdd = _this.flag !== 'E'

          var eCommand = () => {
            API.ASaveSysRole(_this.formData)
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
