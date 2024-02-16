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
                  format="yyyy-MM-dd"
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
              <vxe-table-column min-width="160" sortable field="requestSource" :title="$t('col_journal_source')"></vxe-table-column>
              <vxe-table-column min-width="180" sortable field="userName" :title="$t('col_operation_user')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="equipmentNumber" :title="$t('col_equipment_number')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="execStatus" :title="$t('col_exec_status')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="execDescription" :title="$t('col_exec_desc')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="createDate" :title="$t('col_login_date')"></vxe-table-column>
              <vxe-table-column min-width="180" sortable field="createTime" :title="$t('col_login_time')"></vxe-table-column>
            </vxe-table>

            <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
          </Col>
        </div>
      </Row>
    </div>
  </div>
</template>

<script>
import { API } from '@A/system/Log'
import { dateFt } from '@/libs/assist'
export default {
  data () {
    return {
      date: { // 选择日期
        startTime: dateFt('yyyy-MM-dd', new Date()),
        endTime: dateFt('yyyy-MM-dd', new Date()),
        startTimeOption: {},
        endTimeOption: {},
        option: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now();
          }
        }
      },
      formData: {},
      list: [],
      head: {
        paging: true, // 是否分页
        totalCount: -1, // 总页数
        pageIndex: 1, // 当前页数
        pageSize: 100, // 每页显示行数
        sortColumn: '', // 排序字段
        sortAscend: true // 升序true，降序false
      },
      loading: true // 添加弹出loading
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取数据
    async getData () {
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

      var [err, res] = await this.$to(API.AGetLoginList(sendData)); if (err) { return false }
      var data = res.data
      this.$set(this.head, 'totalCount', data.totalCount)

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
    show (data, check) { // 查看、维护
      this.isLook = true
    },
    okDrawer () { // 子组件新增/删除成功后，刷新列表
      this.getData()
    },
    /**
     * 开始时间发生变化时触发,设置结束时间不可选择的日期
     * 结束时间应大于等于开始时间,且小于等于当前时间
     * @param {string} startTime 格式化后的日期
     */
    onStartTimeChange (startTime) {
      this.date.startTime = startTime
      this.date.endTimeOption = {
        disabledDate (endTime) { // 设置不可选择的结束日期
          // 返回不可选择日期：结束日期<开始日期-86400000（86400000即一天的毫秒数时间戳）||并且结束日期大于当前日期（Date.now()即当前日期）的时间为不可选择日期
          return endTime.valueOf() < new Date(startTime).valueOf() - 86400000 || endTime > Date.now()
        }
      }
    },
    /**
     * 结束时间发生变化时触发,设置开始时间不可选择的日期
     * 开始时间小于等于结束时间,且小于等于当前时间
     * @param {string} date 格式化后的日期
     */
    onEndTimeChange (endTime) {
      this.date.endTime = endTime
      this.date.startTimeOption = {
        disabledDate (startTime) { // 设置不可选择的开始日期
          return startTime.valueOf() > new Date(endTime).valueOf() || startTime > Date.now()
        }
      }
    },
    timeChange (time) {
      this.date.startTime = time[0];
      this.date.endTime = time[1];
    }
  }
}
</script>
