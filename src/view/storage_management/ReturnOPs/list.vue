 <template>
  <div class="modal-body no-padding">
    <div class="i-box clearfix">
      <Row>
        <!--查询条件-->
        <Col span="24" class="margin-b-16">
          <orderSearch mode="checkbox" :selected.sync="selectedData" :data="checkDatasAll" @on-enter="searchHandle" @on-search="advancedHandle" @on-change="changeHandle">
            <Button class="ivu-btn-button-create" to="return_detail?in=1">{{ $t('sta_1') }}</Button>
            <Button class="ivu-btn-button-delete" icon="ios-trash" @click="delSelectOrder">{{ $t("btn_delete") }}</Button>
          </orderSearch>
        </Col>
        <Col span="24">
          <vxe-table :data="list" max-height="600" stripe show-overflow resizable @sort-change="sortChange" @checkbox-change="selectionChange" @checkbox-all="selectionChange" 
          :checkbox-config="{ reserve: true, highlight: true }">
            <vxe-table-column type="checkbox" width="30"></vxe-table-column>
            <vxe-table-column min-width="160" sortable field="receiptCode" :title="$t('ReturnOrderNumber')">
              <template v-slot="{ row }">
                <!-- <router-link :to="`return_detail/${row.receiptCode}?in=0`">{{ row.receiptCode }}</router-link> -->
              <span style="color: rgb(56, 135, 203)" @click="goDetail(row)">{{
                  row.receiptCode
                }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column min-width="160" sortable field="createUserName" :title="$t('col_creator_name')"></vxe-table-column>
            <vxe-table-column min-width="180" sortable field="createOn" :title="$t('col_create_time')"></vxe-table-column>
            <vxe-table-column min-width="160" sortable field="receiptStatus" :title="$t('col_receipt_status')">
              <template v-slot="{ row }">
                <span v-if="row.receiptStatus === 20">draft</span>
                <span v-if="row.receiptStatus === 90">completed</span>
              </template>

            </vxe-table-column>
            <vxe-table-column min-width="180" sortable field="adjustmentInNumb" :title="$t('AdjustmentInNumb')"></vxe-table-column>
          </vxe-table>

          <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { API } from "@A/warehouse/Return"
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
        sortColumn: "",
        sortAscend: true
      },
      // 高级搜索
      formData: {
        receiptCode: ""
      },
      checkDatasAll: [
        { value: 20, label: this.$t("sta_21") },
        { value: 90, label: "completed" }
      ], // 备选项
      selectedData: [20, 90], // 默认选中
      list: [], // 表格数据
      isAdvancedSearch: false, // 高级搜索
      isCreate: false, // 创建
      selectionSave: []
    };
  },
  created () {
    this.getData()
  },
  methods: {
    
     // 表格选中改变
    selectionChange ({ selection }) {
      this.selectionSave = selection
    },
    // 删除table 订单  
    delSelectOrder(){
      var _this = this
      if (_this.selectionSave.length === 0) {
        _this.$Notice.warning({ desc: _this.$t('msg_notice_145') })
        return false 
      }
        console.log(_this.selectionSave)
      var retrunNumOrderdelete = _this.selectionSave.map(function (item, i) {
        //console.log(item)
        return  item.receiptCode  
      })  
    // console.log(retrunNumOrderdelete)
      var eCommand = () => {
        API.ADelete( retrunNumOrderdelete )
          .then(function (res) {
           // _this.getData()
            _this.$Notice.success({ desc: res.returnMsg,
             //duration: 4,
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
 
    async goDetail(row) {
      //debugger;
      //console.log(row, "row");
       var [err, res] = await this.$to(API.AGetDetailByCode(row.receiptCode,));
       if (err) { return false }
   
      this.$router.push(
       // `return_detail/${row.receiptCode}?in=0&stu=${row.receiptStatus}`
        `return_detail/${row.receiptCode}?in=0&stu=${row.receiptStatus}&code=${row.receiptCode}`
      );
    },
    async getData () {
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1, receiptStatusList: this.selectedData })
      var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
      //console.log("res:"+ res)
      var data = res.data
     this.head.totalCount = data.totalCount
      this.list = data.returnList
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
      this.head.sortAscend = order === "asc"
      this.getData()
    },
    // 输入框查询回调
    searchHandle (condition) {
      //console.log(condition)
      this.formData.receiptCode = condition
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
      this.head.pageIndex = 1
      this.getData()
    }
  }
};
</script>
<style lang="less">
span{
  cursor:pointer
}
</style>
