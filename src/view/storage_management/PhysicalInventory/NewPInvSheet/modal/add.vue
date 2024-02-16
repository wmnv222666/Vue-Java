<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-24 21:30:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-31 22:55:41
 * @Description: description
 -->
<template>
  <Drawer :title="$t('btn_new')" :closable="true" v-model="modalVal" :mask-closable="true" @on-visible-change="visibleChange" width="800">
    <div style="height:100%">
      <Row style="height:calc(100% - 50px);">
        <vxe-table :data="userList" height="auto" stripe show-overflow resizable @radio-change="radioChangeEvent" v-if="modalVal" :radio-config="{ highlight: true }">
          <vxe-table-column type="radio" width="60"></vxe-table-column>
          <vxe-table-column type="seq" :title="$t('col_number')" width="150"></vxe-table-column>
          <vxe-table-column sortable field="userCode" :title="$t('col_user')"></vxe-table-column>
          <vxe-table-column sortable field="userName" :title="$t('col_user_n')"></vxe-table-column>
        </vxe-table>
      </Row>
    </div>
    <div class="demo-drawer-footer">
      <Button type="primary" class="ivu-btn-button-create margin-right-24" @click="ok">{{ $t('btn_confirm') }}</Button>
      <Button type="primary" class="ivu-btn-button-create-ghost" @click="cancel">{{ $t('btn_return') }}</Button>
    </div>
  </Drawer>
</template>

<script>
import { API } from '@A/warehouse/NewPInvSheet'
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
      userList: [],
      condition: '',
      checkUserData: {}
    }
  },
  methods: {
    visibleChange (isShow) {
      if (isShow) {
        this.getDataList()
      } else {
        this.cancel()
      }
    },
    async getDataList () {
      var [err, res] = await this.$to(API.AGetUserList()); if (err) { return false }
      var data = res.data.headList || []
      this.userList = data
    },
    radioChangeEvent ({ row }) {
      this.checkUserData = row
    },
    // 搜索
    search (condition) {
      this.condition = condition
      this.getDataList()
    },
    cancel () {
      this.modalVal = false
      // 清空脏数据
      this.userList = []
      this.checkUserData = {}
      this.condition = ''
    },
    ok () {
      if (!this.checkUserData.userCode) {
        this.$Notice.warning({ desc: this.$t('msg_notice_145') })
        return false
      }

      this.$emit('on-ok', this.checkUserData)
      this.cancel()
    }
  }

}
</script>
