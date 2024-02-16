<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24">
          <!-- 新增 -->
          <!-- <Button @click="show('', '')" icon="md-add">{{$t('btn_new')}}</Button> -->

          <div class="search-box">
            <Input v-model="formData.unitCode" :placeholder="$t('ph_placeholder_0')" search @on-search="search" />
          </div>
          </Col>
          <Col span="24">
          <vxe-table stripe show-overflow resizable @sort-change="sortChange" ref="xTable">
            <vxe-table-column min-width="160" sortable field="unitCode" :title="$t('lbl_unit_code')">
              <template v-slot="{ row }">
                <span class="pointer" @click="show(row, 'E')">{{ row.unitCode }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column min-width="200" sortable field="unitName" :title="$t('lbl_unit_name')"></vxe-table-column>
            <vxe-table-column min-width="180" sortable field="decimalPlace" :title="$t('col_decimal_place')"></vxe-table-column>
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
import { API } from '@A/system/UoM'
import { look } from './modal/list'

export default {
  components: { look },
  data () {
    return {
      flag: '',
      row: {},
      formData: {
        unitCode: '',
        unitName: ''
      },
      list: [],
      head: {
        paging: true, // 是否分页
        totalCount: -1, // 总页数
        pageIndex: 1, // 当前页数
        pageSize: 100, // 每页显示行数
        sortColumn: '', // 排序字段
        sortAscend: true // 升序true，降序false
      },
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
        unitCode: this.formData.unitCode,
        unitName: this.formData.unitName,
        // 必传参数（分页与排序）
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

      this.$refs.xTable.loadData(data.headList)
      // this.list = data.headList
    },
    // 查询
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
    clearData () {
      this.head.sortColumn = ''
      this.head.sortAscend = true
    },
    // 点击物料编码打开弹窗
    show (row, flag) {
      if (row) {
        this.row = row
      }
      this.flag = flag
      this.isLook = true
    },
    okDrawer () { // 子组件新增/删除成功后，刷新列表
      this.getData()
    }
  }
}
</script>
