<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2019-09-12 15:46:09
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-14 11:08:17
 * @Description: 
 -->
<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24">
            <div class="pull-right">
              <!-- 开始日期 -->

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

              <!-- <span style="vertical-align:top">
                <Button type="primary" class="ivu-btn-button-create-large" @click="getData">{{ $t('btn_search') }}</Button>
              </span> -->

              <Input style="width:220px;vertical-align: top;" v-model="keyWord" search @on-search="search" />
            </div>

            <div class="condition-box">
              <RadioGroup v-model="checkedData" @on-change="radioChange">
                <Radio :value="0" :label="$t('lbl_undeal')"></Radio>
                <Radio :value="1" :label="$t('lbl_deal')"></Radio>
              </RadioGroup>
            </div>
          </Col>
        </div>
      </Row>
      <Row>
        <div class="i-box clearfix">
          <Col span="24">
            <vxe-table stripe show-overflow resizable @sort-change="sortChange" ref="xTable">
              <vxe-table-column type="seq" :title="$t('col_number')" width="150"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="createTime" :title="$t('col_create_data')"></vxe-table-column>
              <vxe-table-column min-width="200" sortable field="destination" :title="$t('col_di_zhi')"></vxe-table-column>
              <vxe-table-column min-width="180" sortable field="msgClassFullName" :title="$t('col_xxldxqc')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="msgType" :title="$t('col_xxlx')"></vxe-table-column>
              <vxe-table-column min-width="180" sortable field="reason" :title="$t('col_sbyy')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="retryTimes" :title="$t('col_cscs')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="msg" :title="$t('col_xxnr')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="opreation" :title="$t('col_opt')">
                <template v-slot="{ row }">
                  <Button type="text" @click="resend(row.id)">{{ $t('btn_resend') }}</Button>
                  <Button type="text" @click="show(row.msg)">{{ $t('lnk_check') }}</Button>
                </template>
              </vxe-table-column>
            </vxe-table>

            <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
          </Col>
        </div>
      </Row>
    </div>
    <!--查看抽屉-->
    <look :drawer.sync="isLook" :paramData="message"></look>
  </div>
</template>

<script>
import { API } from '@A/system/Task'
import { dateFt } from '@/libs/assist'
import look from './modal/lookDrawer'

export default {
  components: { look },
  data () {
    return {
      date: {
        startTime: '', // 59天
        endTime: ''
      },
      keyWord: '',
      message: '',
      isLook: false,
      list: [],
      head: {
        paging: true, // 是否分页
        totalCount: -1, // 总页数
        pageIndex: 1, // 当前页数
        pageSize: 100, // 每页显示行数
        sortColumn: '', // 排序字段
        sortAscend: true // 升序true，降序false
      },
      isAdvancedSearch: false, // 高级搜索
      isModalCreate: false,
      checkedData: 0 // 默认选中
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取数据
    async getData () {
      var sendData = {
        pageIndex: this.head.pageIndex,
        pageSize: this.head.pageSize,
        paging: this.head.paging,
        sortColumn: this.head.sortColumn,
        sortAscend: this.head.sortAscend,
        isProcessed: this.checkedData,
        createTimeStart: this.date.startTime,
        createTimeEnd: this.date.endTime,
        searchKeywords: this.keyWord
      }

      var [err, res] = await this.$to(API.AGetMQList(sendData)); if (err) { return false }
      var data = res.data
      this.$set(this.head, 'totalCount', data.totalCount)

      this.$refs.xTable.loadData(data.retryList)

      // this.list = data.retryList
    },
    // 搜索
    search () {
      this.$set(this.head, 'pageIndex', 1)
      this.getData()
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
    // 状态切换（选择）
    radioChange () {
      this.$set(this.head, 'pageIndex', 1)
      this.getData()
    },
    // 状态切换（选择）
    resend (retryCode) {
      var _this = this,
        eCommand = () => {
          API.AReSend(retryCode)
            .then((res) => {
              _this.getData()
            })
        }

      // 确认弹窗
      _this.$confirm({
        content: _this.$t('msg_notice_388'),
        onOk: eCommand
      })
    },
    show (message) {
      this.message = message
      this.isLook = true
    },

    clearData () {
      this.head.sortColumn = ''
      this.head.sortAscend = true
    },
    timeChange (time) {
      this.date.startTime = time[0];
      this.date.endTime = time[1];
    }
  }
}
</script>
