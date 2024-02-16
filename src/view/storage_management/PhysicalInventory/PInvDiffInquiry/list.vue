<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-14 18:32:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-05-31 22:56:37
 * @Description: PInv Diff Inquiry
 -->
<template>
  <div class="modal-body no-padding">
    <div class="i-box clearfix">
      <Row>
        <!--查询条件-->
        <Col span="24" class="margin-b-16">
        <orderSearch mode="checkbox" :selected.sync="selectedData" :data="checkDatasAll" @on-enter="searchHandle" @on-search="advancedHandle" @on-change="changeHandle">
        </orderSearch>
        </Col>
        <Col span="24">
        <vxe-table :data="list" max-height="600" stripe show-overflow resizable @sort-change="sortChange">
          <vxe-table-column min-width="160" sortable field="stockTakeCode" :title="$t('col_stock_take_code')">
            <template v-slot="{ row }">
              <router-link :to="`inv_diff_inquiry_detail/${row.stockTakeCode}?in=0&receiptStatus=${row.receiptStatus}`">{{ row.stockTakeCode }}</router-link>
            </template>
          </vxe-table-column>
          <vxe-table-column min-width="200" sortable field="stockTakeTypeName" :title="$t('lbl_stock_take_type_name')"></vxe-table-column>
          <vxe-table-column min-width="180" sortable field="whCode" :title="$t('lbl_wh_code')">
            <template v-slot="{ row }">
              <span>{{ row.whCode }} - {{ row.whName }}</span>
            </template>
          </vxe-table-column>
          <!-- <vxe-table-column min-width="160" sortable field="stockTakeDate" :title="$t('col_stock_take_time')"></vxe-table-column> -->
          <vxe-table-column min-width="180" sortable field="createTime" :title="$t('col_create_time')"></vxe-table-column>
          <vxe-table-column min-width="180" sortable field="createUserName" :title="$t('col_creator_name')"></vxe-table-column>
          <!-- <vxe-table-column min-width="160" sortable field="receiptStatus" :title="$t('col_receipt_status')">
            <template v-slot="{ row }">
              <span :class="`font-weight status-${row.receiptStatus}`">{{ row.receiptStatusName }}</span>
            </template>
          </vxe-table-column> -->
        </vxe-table>

        <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { API } from '@A/warehouse/PInvDiffInquiry'
// 订单查询
import orderSearch from "_c/orderSearch";

export default {
  name: "list",
  components: {
    orderSearch
  },
  data () {
    return {
      // 分页\排序
      head: {
        paging: true,
        totalCount: -1,
        pageIndex: 1,
        pageSize: 100,
        sortColumn: '',
        sortAscend: true
      },
      // 高级搜索
      formData: {
        stockTakeCode: ''
      },
      checkDatasAll: [
        { value: 50, label: this.$t('sta_50') },
        { value: 90, label: this.$t('sta_90') }
      ], // 备选项
      selectedData: [50, 90], // 默认选中
      list: [], // 表格数据
      isAdvancedSearch: false, // 高级搜索
      isCreate: false, // 创建
    };
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1, statusList: this.selectedData })
      var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
      var data = res.data
      this.head.totalCount = data.totalCount
      this.list = data.list
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
    // 输入框查询回调
    searchHandle (condition) {
      this.formData.stockTakeCode = condition
      this.head.pageIndex = 1
      this.getData()
    },
    // 单选、复选改变回调
    changeHandle (selection) {
      this.head.pageIndex = 1
      this.getData()
    },
    // 高级搜索点击触发
    advancedHandle () {
      this.isAdvancedSearch = true
    },
    // 高级搜索确认触发
    handleSearch (formData) {
      //
    }
  }
};
</script>
