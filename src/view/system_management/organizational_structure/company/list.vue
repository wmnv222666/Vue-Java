<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24">
          <!-- <Button @click="show('', '')" icon="md-add">{{ $t('btn_new') }}</Button> -->

          <!-- <div class="search-box">
            <Input :placeholder="$t('ph_placeholder_0')" search @on-search="search" />
          </div> -->
          </Col>
          <Col span="24">
          <vxe-table v-show:false :data="list" stripe show-overflow resizable @sort-change="sortChange">
            <vxe-table-column sortable field="corpCode" :title="$t('col_corp')" min-width="160">
              <template v-slot="{ row }">
                <span class="pointer" @click="show(row, 'E')">{{ row.corpCode }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column sortable field="corpName" :title="$t('col_corp_name')" min-width="200"></vxe-table-column>
            <!-- <vxe-table-column sortable field="createTime" :title="$t('col_create_time')" min-width="160"></vxe-table-column> -->
          </vxe-table>

          <vxe-table :data="list" stripe show-overflow resizable @sort-change="sortChange">
            <vxe-table-column  field="corpCode" :title="$t('col_corp')" min-width="160">
              <!-- <template v-slot="{ row }">
                <span class="pointer" @click="show(row, 'E')">{{ row.corpCode }}</span>
              </template> -->
            </vxe-table-column>
            <vxe-table-column  field="corpName" :title="$t('col_corp_name')" min-width="200"></vxe-table-column>
            <!-- <vxe-table-column sortable field="createTime" :title="$t('col_create_time')" min-width="160"></vxe-table-column> -->
          </vxe-table>

          <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
          </Col>
        </div>
      </Row>
    </div>

    <!--编辑抽屉-->
    <look :drawer.sync="isLook" :flag="flag" :corpCode="corpCode" @ok-drawer="okDrawer" />
  </div>
</template>

<script>
import { API } from '@A/system/Company'
import { look } from './modal/list'

export default {
  components: { look },
  data () {
    return {
      flag: '', // 创建/编辑/查看标志位
      corpCode: '', // 获取行详情数据所需参数
      list: [],
      head: {
        paging: true, // 是否分页
        totalCount: -1, // 总页数
        pageIndex: 1, // 当前页数
        pageSize: 100, // 每页显示行数
        sortColumn: '', // 排序字段
        sortAscend: true, // 升序true，降序false
        condition: ''
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
        corpCode: this.head.condition,
        pageIndex: this.head.pageIndex, // 以下为必传参数（分页与排序）
        pageSize: this.head.pageSize,
        paging: this.head.paging,
        totalCount: -1,
        sortColumn: this.head.sortColumn,
        sortAscend: this.head.sortAscend
      }

      var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }

      var data = res.data
      this.$set(this.head, 'totalCount', data.totalCount)

      this.list = data.itemList
      this.list = []
      this.list.push({corpCode:'DM01',corpName:'Distribution Medsup Canada'})
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
    clearData () {
      this.head.sortColumn = ''
      this.head.sortAscend = true
    },
    show (row, flag) {
      // 赋值子组件所需数据
      this.flag = flag
      this.corpCode = row ? row.corpCode : ''
      // 控制弹窗开关
      this.isLook = true
    },
    okDrawer () { // 子组件新增/删除成功后，刷新列表
      this.getData()
    }
  }
}

</script>
