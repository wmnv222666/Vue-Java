<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24">
          <!-- 新增 -->
          <Button class="btn-off" @click="addForm('', {})">
            <Icon type="md-add" color="#0288d1" size="20" /><span>{{ $t('btn_new') }}</span>
          </Button>

          <div class="search-box">
            <Input v-model="head.condition" search :placeholder="$t('col_title')" @on-search="search" />
          </div>
          </Col>

          <Col span="24">
          <vxe-table :data="tableData" stripe show-overflow resizable @sort-change="sortChange">
            <vxe-table-column field="title" :title="$t('col_title')"></vxe-table-column>
            <vxe-table-column field="createUser" :title="$t('col_creator_name')"></vxe-table-column>
            <vxe-table-column sortable field="createTime" :title="$t('col_create_time')"></vxe-table-column>
            <vxe-table-column min-width="190" field="operation" :title="$t('col_opt')">
              <template v-slot="{ row }">
                <Button type="text" @click="addForm('E', row)">{{ $t('col_modify') }}</Button>
                <Button type="text" @click="delItem(row)">{{ $t('btn_delete') }}</Button>
                <Button type="text" @click="publish(row)">{{ row.statusName }}</Button>
              </template>
            </vxe-table-column>
          </vxe-table>

          <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
          </Col>
        </div>
      </Row>
    </div>
    <!-- 编辑修改公告 -->
    <look :modal.sync="lookDrawer" @getData="getData" :messageData="messageData" :flag="flag" />
  </div>
</template>

<script>
import { API } from '@A/message_center/SystemPosts'
import look from './modal/lookDrawer'
export default {
  components: { look },
  data () {
    return {
      tableData: [],
      head: {
        condition: '',
        paging: true, // 是否分页
        totalCount: -1, // 总页数
        pageIndex: 1, // 当前页数
        pageSize: 100, // 每页显示行数
        sortColumn: '', // 排序字段
        sortAscend: true // 升序true，降序false
      },
      lookDrawer: false,
      selectData: [], // 表格多选选中数据
      messageData: {
        title: '',
        content: '',
        noticeId: ''
      },
      flag: ''
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取数据
    getData () {
      var _this = this

      API.AGetList({
        pageIndex: _this.head.pageIndex,
        pageSize: _this.head.pageSize,
        paging: _this.head.paging,
        sortColumn: _this.head.sortColumn,
        sortAscend: _this.head.sortAscend,
        condition: _this.head.condition
      }).then(function (res) {
        var data = res.data
        _this.$set(_this.head, 'totalCount', data.totalCount)

        var statusMap = { 0: _this.$t('col_release'), 1: _this.$t('col_cancel_release') }

        data.dicNoticeList.forEach(function (item) {
          item.statusName = statusMap[item.status]
        })

        _this.tableData = data.dicNoticeList
      })
    },
    // 新增修改只读
    addForm (flag, messageData) {
      this.flag = flag
      this.messageData = this.$c(messageData)
      this.lookDrawer = true
    },
    // 发布-取消发布
    publish (params) {
      let status = params.status === 0 ? this.$t('col_release') : this.$t('col_cancel_release')
      this.$confirm({
        content: this.$t('msg_notice_300').replace("{{0}}", status),
        onOk: () => {

          API.APublish({
            status: params.status === 0 ? 1 : 0,
            noticeId: params.noticeId
          }).then(() => {
            this.getData()
          })

        }
      })
    },
    // 删除消息
    delItem (row) {
      var _this = this;
      var eCommand = () => {

        API.ADelItem(row.noticeId).then(function (res) {
          _this.$Notice.success({ desc: res.returnMsg, duration: 0 })
          _this.getData()
        })

      }
      _this.$confirm({
        content: _this.$t('msg_notice_74'),
        onOk: eCommand
      })
    },
    clearData () {
      this.head.condition = ''
      this.head.sortColumn = ''
      this.head.sortAscend = true
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
    // 搜索
    search (condition) {
      this.$set(this.head, 'condition', condition)
      this.$set(this.head, 'pageIndex', 1)
      this.getData()
    },
  }
}
</script>
