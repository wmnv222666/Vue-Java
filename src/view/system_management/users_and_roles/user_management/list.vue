<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24">
          <ButtonGroup>
            <Button @click="show('', '')" icon="md-add">{{ $t('btn_new') }}</Button>
            <Button @click="del" icon="ios-trash">{{ $t('btn_delete') }}</Button>
            <!-- <Button @click="frozen(1)" icon="md-shuffle">{{ $t('lbl_freeze') }}</Button> -->
            <!-- <Button @click="frozen(0)" icon="md-repeat">{{ $t('btn_thaw') }}</Button> -->
            <Button @click="resetPas" icon="ios-construct">{{ $t('btn_reset_password') }}</Button>
          </ButtonGroup>

          <div class="search-box">
            <Input :placeholder="$t('ph_placeholder_0')" search @on-search="search" />
          </div>
          </Col>
          <Col span="24">
          <vxe-table :data="list" stripe show-overflow resizable @sort-change="sortChange" @checkbox-change="selectionChange" @checkbox-all="selectionChange">
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
            <vxe-table-column min-width="145" sortable field="userCode" :title="$t('col_user_code')">
              <template v-slot="{ row }">
                <span class="pointer" @click="show(row, 'E')">{{ row.userCode }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column min-width="145" sortable field="userName" title="User Name"></vxe-table-column>
            <!-- <vxe-table-column min-width="145" sortable field="freezeName" :title="$t('col_freeze_name')"></vxe-table-column> -->
            <vxe-table-column min-width="145" sortable field="validityBeginDate" :title="$t('ph_placeholder_35')"></vxe-table-column>
            <vxe-table-column min-width="145" sortable field="validityEndDate" :title="$t('ph_placeholder_36')"></vxe-table-column>
            <vxe-table-column min-width="145" sortable field="createTime" :title="$t('col_create_time')"></vxe-table-column>
          </vxe-table>

          <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
          </Col>
        </div>
      </Row>
    </div>

    <!--编辑抽屉-->
    <look :drawer.sync="isLook" :row="row" :flag="flag" @ok-drawer="okDrawer" />
  </div>
</template>
<script>
import { API } from '@A/system/User'
import { look } from './modal/list'
export default {
  components: { look },
  data () {
    return {
      head: {
        paging: true, // 是否分页
        totalCount: -1, // 总页数
        pageIndex: 1, // 当前页数
        pageSize: 100, // 每页显示行数
        sortColumn: '', // 排序字段
        sortAscend: true, // 升序true，降序false
        condition: ''
      },
      row: {},
      flag: '',
      list: [], // 表格数据
      checkDataList: [], // 当前选中的数据
      isLook: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取数据
    async getData () {
      var sendData = {
        condition: this.head.condition,
        pageIndex: this.head.pageIndex,
        pageSize: this.head.pageSize,
        paging: this.head.paging,
        totalCount: -1,
        sortColumn: this.head.sortColumn,
        sortAscend: this.head.sortAscend
      }

      var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
      var data = res.data

      this.$set(this.head, 'totalCount', data.totalCount)

      data.headList.forEach(function (item) {
        item.__corpCode__ = `${item.corpCode} - ${item.corpName}`
        item.__deptCode__ = `${item.deptCode} - ${item.deptName}`
      })

      this.list = data.headList
    },
    // 批量删除用户
    del () {
      var _this = this

      if (_this.checkDataList.length == 0) {
        _this.$Notice.warning({ desc: _this.$t('msg_notice_145') })
        return false
      }

      var updatesCo = _this.checkDataList.map(function (item, i) {
        return { 'userId': item.userId }
      })

      var eCommand = () => {

        API.ABatchDelUser({ updatesCo: updatesCo })
          .then(function (res) {
            _this.getData()
            _this.$Notice.success({ desc: res.returnMsg })
          })
      }
      _this.$confirm({
        content: _this.$t('msg_notice_74'),
        onOk: eCommand
      })
    },
    // 批量冻结解冻用户
    frozen (isFreeze) {
      var _this = this

      if (_this.checkDataList.length === 0) {
        _this.$Notice.warning({ desc: _this.$t('msg_notice_145') })
        return false
      }

      var updatesCo = _this.checkDataList.map(function (item, i) {
        return { 'userId': item.userId, 'freeze': isFreeze }
      })

      var eCommand = () => {

        API.AFrozen({ updatesCo: updatesCo })
          .then(function (res) {
            _this.getData()
            _this.$Notice.success({ desc: res.returnMsg })
          })
      }
      _this.$confirm({
        content: isFreeze ? _this.$t('ph_placeholder_245') : _this.$t('ph_placeholder_251'),
        onOk: eCommand
      })
    },
    // 批量解锁用户
    // unlock () {
    //   var _this = this

    //   if (_this.checkDataList.length == 0) {
    //     _this.$Notice.warning({ desc: _this.$t('msg_notice_145') })
    //     return false
    //   }

    //   var updatesCo = _this.checkDataList.map(function (item, i) {
    //     return { 'userId': item.userId }
    //   })
    //   var eCommand = () => {

    //     API.AUnlock({ updatesCo: updatesCo })
    //       .then(function (res) {
    //         _this.getData()
    //         _this.$Notice.success({ desc: res.returnMsg })
    //       })
    //   }
    //   _this.$confirm({
    //     content: _this.$t('ph_placeholder_243'),
    //     onOk: eCommand
    //   })
    // },
    // 批量重置密码
    resetPas () {
      var _this = this

      if (_this.checkDataList.length === 0) {
        _this.$Notice.warning({ desc: _this.$t('msg_notice_145') })
        return false
      }

      var updatesCo = _this.checkDataList.map(function (item, i) {
        return {
          'userId': item.userId,
          'userCode': item.userCode
        }
      })

      var eCommand = () => {

        API.AResetPassword({ updatesCo: updatesCo })
          .then(function (res) {
            _this.getData()
            _this.$Notice.success({ desc: res.returnMsg })
          })
      }
      _this.$confirm({
        content: _this.$t('ph_placeholder_244'),
        onOk: eCommand
      })
    },

    // 搜索
    search (condition) {
      this.$set(this.head, 'pageIndex', 1)
      this.$set(this.head, 'condition', condition)
      this.getData()
    },
    // 表格选中改变
    selectionChange ({ selection }) {
      this.checkDataList = selection
    },
    // 分页回调
    handlePageChange ({ currentPage, pageSize }) {
      this.head.pageIndex = currentPage
      this.head.pageSize = pageSize
      this.getData()
    },
    // 排序回调
    sortChange ({ column, property, order }) {
      // 用 DESC 表示按倒序排序(即：从大到小排序)
      // 用 ASC 表示按正序排序(即：从小到大排序)
      this.head.sortColumn = property
      this.head.sortAscend = order === 'asc'
      this.getData()
    },
    // 清空数据
    clearData () {
      this.head.sortColumn = ''
      this.head.sortAscend = true
      this.checkDataList = []
    },
    // 修改或只读
    show (row, flag) {
      this.flag = flag
      this.row = row ? this.$c(row) : {}
      this.isLook = true
    },
    okDrawer () {
      this.getData()
    }
  }
}

</script>
