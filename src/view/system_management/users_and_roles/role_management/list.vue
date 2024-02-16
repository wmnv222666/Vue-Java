<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24">
            <ButtonGroup>
              <!-- 新增 -->
              <Button @click="show({}, '')" icon="md-add">{{ $t('btn_new') }}</Button>
              <!-- 删除 -->
              <Button @click="del" icon="ios-trash">{{ $t('btn_delete') }}</Button>
            </ButtonGroup>

            <div class="search-box">
              <Input :placeholder="$t('ph_placeholder_0')" search @on-search="search" />
            </div>
          </Col>

          <Col span="24">
            <vxe-table :data="list" stripe show-overflow resizable @sort-change="sortChange" @checkbox-change="selectionChange" @checkbox-all="selectionChange">
              <vxe-table-column :key="1" type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column :key="3" sortable field="roleCode" :title="$t('col_role_code')">
                <template v-slot="{ row }">
                  <span class="pointer" @click="show(row, 'E')">{{ row.roleCode }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column :key="4" sortable field="roleName" :title="$t('col_role_name')"></vxe-table-column>
              <vxe-table-column :key="6" sortable field="createUserName" :title="$t('col_creator_name')"></vxe-table-column>
              <vxe-table-column :key="5" sortable field="createTime" :title="$t('col_create_time')"></vxe-table-column>
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
import { API } from '@A/system/Role'
import { look } from './modal/list'
export default {
  components: { look },
  data () {
    return {
      list: [],
      totalCount: '',
      head: {
        totalCount: -1,
        pageIndex: 1, // 当前页码
        pageSize: 100, // 每页显示的数量
        condition: '', // 搜索条件
        sortColumn: '', // 排序列名称
        sortAscend: ''// 排序升降序
      },
      row: {},
      flag: '',
      selectedData: [],
      loading: true,
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
      this.list = data.headList

    },
    // 批量角色删除
    del () {
      var _this = this

      if (_this.selectedData.length === 0) {
        _this.$Notice.warning({ desc: _this.$t('msg_notice_145') })
        return false
      }

      var sysRoleDeletesCos = _this.selectedData.map(function (item, i) {
        return {
          'roleCode': item.roleCode
        }
      })

      var eCommand = () => {

        API.ABatchDelRole({ sysRoleDeletesCos: sysRoleDeletesCos })
          .then(function (res) {
            _this.loading = false
            _this.$Notice.success({
              desc: res.returnMsg,
              duration: 2.5,
              onClose: function () {
                _this.getData()
              }
            })
          })
      }
      _this.$confirm({
        content: _this.$t('msg_notice_74'),
        onOk: eCommand
      })
    },
    // 表格选中改变
    selectionChange ({ selection }) {
      this.selectedData = selection
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
    // 搜索条件
    search (condition) {
      this.$set(this.head, 'pageIndex', 1)
      this.$set(this.head, 'condition', condition)
      this.getData()
    },
    //flag看lookDraw中的
    show (row, flag) {
      this.flag = flag
      this.row = this.$c(row)
      this.isLook = true
    },
    okDrawer () {
      this.getData()
    }
  }
}

</script>
