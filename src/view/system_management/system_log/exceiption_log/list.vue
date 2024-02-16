<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24" class="margin-b-16">
            <div class="pull-right">
              <search-in :title="$t('lbl_operation_date')" class="margin-right-15">
                <DatePicker
                  style="width:220px"
                  :editable="false"
                  type="daterange"
                  :placeholder="$t('ph_placeholder_4')"
                  :value="[date.startTime, date.endTime]"
                  @on-change="timeChange"
                ></DatePicker>
              </search-in>

              <Button @click="getData">{{ $t('btn_find') }}</Button>
            </div>
          </Col>
          <Col span="24">
            <vxe-table stripe show-overflow resizable @sort-change="sortChange" ref="xTable">
              <vxe-table-column min-width="160" sortable field="userName" :title="$t('col_user_n')"></vxe-table-column>
              <vxe-table-column min-width="200" sortable field="requestUrl" :title="$t('col_request_url')"></vxe-table-column>
              <vxe-table-column min-width="180" sortable field="exceptionMessage" :title="$t('col_exception_message')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="stackTrace" :title="$t('col_stack_trace')">
                <template v-slot="{ row }">
                  <Button type="text" @click="showParameter(row.stackTrace)">{{ $t('lnk_check') }}</Button>
                </template>
              </vxe-table-column>
              <vxe-table-column min-width="180" sortable field="createDate" :title="$t('col_create_time')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="createTime" :title="$t('col_create_data')"></vxe-table-column>
            </vxe-table>

            <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
          </Col>
        </div>
      </Row>
      <!-- 出入参查看 -->
      <parameter :drawer.sync="isShow" :paramData="paramData" />
    </div>
  </div>
</template>

<script>
import { API } from '@A/system/Log'
import { dateFt } from '@/libs/assist'
import { parameter } from './modal/list'
export default {
  components: {
    parameter
  },
  data () {
    return {
      isShow: false, // 异常堆栈信息弹窗控制
      paramData: '', // 	异常堆栈信息编码
      date: { // 选择日期
        startTime: dateFt('yyyy-MM-dd', new Date()),
        endTime: dateFt('yyyy-MM-dd', new Date()), // 默认为今天的时间
      },
      list: [],
      head: {
        paging: true, // 是否分页
        totalCount: -1, // 总页数
        pageIndex: 1, // 当前页数
        pageSize: 100, // 每页显示行数
        sortColumn: '', // 排序字段
        sortAscend: true // 升序true，降序false
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取数据
    async getData () {
      var _this = this
      var sendData = {
        createDate: this.date.startTime,
        endDate: this.date.endTime,
        // 必传参数（分页与排序）
        pageIndex: this.head.pageIndex,
        pageSize: this.head.pageSize,
        paging: this.head.paging,
        totalCount: -1,
        sortColumn: this.head.sortColumn,
        sortAscend: this.head.sortAscend
      }

      var [err, res] = await this.$to(API.AGetExceptionList(sendData)); if (err) { return false }
      var data = res.data
      this.$set(this.head, 'totalCount', data.totalCount)

      data.list.forEach(function (item, i) {
        if (item.isDelete == 0) {
          item.isDelete = _this.$t('sel_undelete')
        } else if (item.isDelete == 1) {
          item.isDelete = _this.$t('sel_delete')
        }
      })

      this.$refs.xTable.loadData(data.list)
      // this.list = data.list
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
    clearData () {
      this.head.sortColumn = ''
      this.head.sortAscend = true
    },
    // 	异常堆栈信息
    showParameter (data) {
      this.paramData = data
      this.isShow = true
    },
    okDrawer () { // 子组件新增/删除成功后，刷新列表
      this.getData()
    },
    timeChange (time) {
      this.date.startTime = time[0];
      this.date.endTime = time[1];
    }
  }
}
</script>
