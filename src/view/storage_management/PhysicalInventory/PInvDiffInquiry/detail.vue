<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-14 18:33:06
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-11 13:01:03
 * @Description:
 -->
<template>
  <div class="modal-body no-padding">
    <div class="detail-box-inner">
      <div class="i-box clearfix">
        <Row>
          <div class="order-status">{{ head.receiptStatusName }}</div>
          <!-- Tab切换 -->
          <Col span="24" class="x-tabs">
          <Tabs type="line" :animated="false" v-model="tabChangeValue" animate>
            <TabPane :index="1" name="p1" :label="$t('tab_header_information')">
              <div class="order-form-head order-form-head-1">
                <Form :model="head" :label-width="220" inline label-colon>
                  <FormItem :label="$t('lbl_stock_take_type_name')">{{ head.stockTakeTypeName }}</FormItem>
                  <!-- <FormItem :label="$t('lbl_inventory_data')">{{ head.stockTakeDate }}</FormItem> -->
                  <FormItem :label="$t('lbl_stock_take_mode_name')">
                    <RadioGroup v-model="head.stockTakeMode">
                      <Radio :label="1" disabled>{{ $t('sel_open_plate') }}</Radio>
                      <Radio :label="2" disabled>{{ $t('sel_blind_plate') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <!-- <FormItem :label="$t('lbl_freeze_stock_take_name')">
                    <i-switch v-model="head.freezeStockTake" :true-value="1" :false-value="0" disabled size="small"></i-switch>
                  </FormItem> -->
                  <FormItem :label="$t('col_creator_name')">{{ head.createUserName }}</FormItem>
                  <FormItem :label="$t('col_create_time')">{{ head.createTime }}</FormItem>
                </Form>
              </div>
            </TabPane>
          </Tabs>
          </Col>
        </Row>
        <Row class="border-top" v-show="isShowTable">
          <Col span="24" class="margin-t-16">
          <vxe-table ref="detailTable" :data="itemTableList" row-id="xid" max-height="450" stripe show-overflow="title" resizable highlight-cell @checkbox-change="selectionChange" @checkbox-all="selectionChange" :checkbox-config="{ reserve: true, highlight: true, checkMethod: checkMethod }">
            <vxe-table-column min-width="160" field="typeCode" :title="$t('Zone')">
              <template v-slot="{ row }">
                <!-- <span>{{ row.typeCode }} - {{ row.typeName }}</span> -->
                <span>{{ row.typeCode }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column min-width="160" field="binCode" :title="$t('LocationCode')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
            <vxe-table-column min-width="160" field="matCode" :title="$t('Item')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="lotNumb" :title="$t('lotNumb')"></vxe-table-column> -->
            <vxe-table-column min-width="80" field="ext3" title="MfgID"></vxe-table-column>
            <vxe-table-column min-width="80" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext7" :title="$t('prddate')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext8" :title="$t('expdate')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
            <vxe-table-column min-width="160" field="weightQty" :title="$t('weight_qty')"></vxe-table-column>
            <vxe-table-column min-width="160" field="stockTakeQty" :title="$t('ActQty')"></vxe-table-column>
            <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="qty" :title="$t('QtyInPCS')"></vxe-table-column> -->
            <vxe-table-column min-width="160" field="stockTakeUserName" :title="$t('col_stock_take_user')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="moveDate" :title="$t('col_move_data')"> </vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="stockTakeVoucher" :title="$t('col_inventory_certificate_number')"> </vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="matVoucher" :title="$t('col_inventory_mat_number')"> </vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
          </vxe-table>

          <x-vxe-pager :current-page="page.pageIndex" :page-size="page.pageSize" :total="page.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
          </Col>
        </Row>

        <div class="fixed-bottom" v-show="isShowTable">
          <button-expand :btnGroup="groupBtn" @on-ok="btnHandle" />
        </div>
      </div>
    </div>
    <!-- 差异查看 -->
    <difference-table :drawer.sync="isDifferenceTable" :head="head" @on-ok="diffreenceHandle" />
  </div>
</template>

<script>
import { API } from '@A/warehouse/PInvDiffInquiry'
import { CAPI } from '@A/common'
// 按钮逻辑
import ButtonExpand from '_c/btnGroup/ButtonExpand.vue'
// 差异查看
import differenceTable from './modal/differenceTable.vue'

export default {
  name: 'detail',
  components: {
    differenceTable,
    ButtonExpand
  },
  data () {
    return {
      diffType: 1,
      isDifferenceTable: false,
      // isDifference: false,
      head: {}, // 抬头信息
      row: {}, // 选中行数据
      remarkPlaceHolder: '', // 备注输入提示
      tabChangeValue: 'p1', // Tab切换当前选项卡名称
      curr: 0, // 点击获取当前行索引 获取操作抬头信息
      selection: [], // 已选择数据
      itemList: [], // 表格全量数据
      itemTableList: [], // 表格显示数据
      fileList: [], // 附件列表
      isMaterialShowMore: false,
      groupBtn: {
        buttonReInventory: false,
        buttonDifferenceTable: true
      }, // 按钮组权限
      formHeadData: {
        fileList: [], // 附件
        logList: [], // 日志
      },
      page: {
        paging: true,
        totalCount: -1,
        pageIndex: 1,
        pageSize: 100,
        sortColumn: '',
        sortAscend: true
      },
      baseInfo: {
        receiptType: 670,
        isCreate: true,
        in: null,
        id: null
      }
    }
  },
  computed: {
    // 抬头信息-订单信息
    isShowTable () {
      return this.tabChangeValue === 'p1' || this.tabChangeValue === 'p2'
    },
    // 已提交之后状态不可以修改  // 可编辑使能控制 true 不可编辑 false 可编辑
    disableEdit () {
      return this.head.receiptStatus >= 20
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * @Description: Initialize
     * @Author: Jiang Xiao
     */
    init () {
      let _in = this.$route.query.in, _id = this.$route.params.id, receiptStatus = this.$route.query.receiptStatus

      this.baseInfo.in = _in // The default is to create a status document
      this.baseInfo.id = _id
      this.baseInfo.isCreate = _in === '1'

      if (this.baseInfo.isCreate || !_id) { // Create state in = 1 || Order id is empty
        return false;
      }

      this.getInfoByCode()// 详情进入
    },
    /**
     * @Description: Query detailed data by document number
     * @Author: Jiang Xiao
     */
    async getInfoByCode () {
      var [err, res] = await this.$to(API.AGetDetailByCode(this.baseInfo.id, this.baseInfo.in)); if (err) { return false }
      this.initData(res.data, false)
    },
    /**
     * @Description: Format data of Return
     * @Author: Jiang Xiao
     * @param data
     * @param isCreate
     * @returns {boolean}
     */
    initData (data, isCreate) {
      // 按钮组权限控制
      if (data.head.receiptStatus < 90) {
        this.groupBtn.buttonReInventory = true
      }

      this.head = data.head

      this.formHeadData.logList = data.logList

      var itemList = data.itemList

      var newJson = []; //盛放去重后数据的新数组
      
      for( var item1 of itemList){  //循环json数组对象的内容
        if(item1.ext9 == undefined){
          item1.ext9=""
        }
        var flag = true;  //建立标记，判断数据是否重复，true为不重复
      
        for( var item2 of newJson){  //循环新数组的内容
          console.log(item1)
          console.log(item2)
          if(item1.typeCode.trim()==item2.typeCode.trim() 
          && item1.binCode.trim()==item2.binCode.trim()  
          && item1.matCode.trim()==item2.matCode.trim()
          && item1.lotNumb.trim()==item2.lotNumb.trim()
          && item1.ext9.trim()==item2.ext9.trim()
         ){ //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false 不同项目判断条件不同
            flag = false;
            item2.weightQty = parseInt(item2.weightQty) + parseInt(item1.weightQty)
            item2.stockTakeQty = parseInt(item2.stockTakeQty) + parseInt(item1.stockTakeQty)
          }
      
        }
      
        if(flag){ //判断是否重复
          newJson.push(item1); //不重复的放入新数组。  新数组的内容会继续进行上边的循环。
        }
      }
      this.itemList = this.formatItemList(newJson)
      //this.itemList = this.formatItemList(itemList)
      // 获取分页数据
      this.getFirstPageData()
      // 表格列控制
      this.columsShowCtrl(data)
    },
    // 格式化行项目数据
    formatItemList (itemList) {
      itemList.forEach(function (item, i) {
        item.uid = `${item.whCode}-${item.typeCode}-${item.binCode}-${item.matCode}-${item.batch}` // 唯一标识
      })
      return itemList
    },
    // 表格列控制
    columsShowCtrl (data) {
      this.$nextTick(() => {
        var columns = this.$refs.detailTable.getColumns()

        if (data.head.receiptStatus == 90) {
          columns.forEach(column => {
            if (['stockTakeVoucher', 'matVoucher'].includes(column.property)) {
              column.visible = true
            }
          })
        } else {
          columns.forEach(column => {
            if (['stockTakeVoucher', 'matVoucher'].includes(column.property)) {
              column.visible = false
            }
          })
        }

        this.$refs.detailTable.refreshColumn()
      })
    },
    // 批量选中改变
    selectionChange ({ selection }) {
      // 所有选择的数据 当前页 + 之前页的
      var getCheckboxReserveRecords = this.$refs.detailTable.getCheckboxReserveRecords()
      var getCheckboxRecords = this.$refs.detailTable.getCheckboxRecords()

      this.selection = getCheckboxReserveRecords.concat(getCheckboxRecords)
    },
    // 附件上传回调
    handleFileChange (fileList) {
      this.formHeadData.imgList = fileList
    },
    // 分页回调
    handlePageChange ({ currentPage, pageSize }) {
      this.page.pageIndex = currentPage
      this.page.pageSize = pageSize
      this.itemTableList = this.$getPage(this.page.pageIndex, this.page.pageSize, this.itemList)
    },
    // 假分页处理
    getFirstPageData () {
      this.page.pageIndex = 1
      this.page.totalCount = this.itemList.length
      this.itemList.forEach(function (item, i) {
        item.xindex = i
      })
      this.itemTableList = this.$getPage(1, this.page.pageSize, this.itemList)
    },
    // 是否可选
    checkMethod ({ row }) {
      // 已冲销 已完成 无权限不可以选择
      return !(row.disableEdit || row.disabled)
    },
    // 成功回调
    successHandle (res) {
      this.$router.push({ name: 'inv_diff_inquiry' })
      this.$Notice.success({ desc: res.returnMsg })
    },
    // 全部重盘
    reInventory () {
      var eCommand = () => {
        API.AReInventory(this.head.stockTakeCode).then((res) => { this.successHandle(res) })
      }

      this.$confirm({
        content: this.$t('msg_notice_258'),
        onOk: eCommand
      })
    },
    // 查看差异
    differenceTable () {
      this.isDifferenceTable = true
    },
    diffreenceHandle () {
      this.getInfoByCode()
    },
    // // 仓位差异处理
    // binDifference () {
    //   this.diffType = 1
    //   this.isDifference = true
    // },
    // // 批次差异处理
    // batchDifference () {
    //   this.diffType = 2
    //   this.isDifference = true
    // },
    // 按钮组回调
    btnHandle (type) {
      switch (type) {
        case 'buttonReInventory':
          this.reInventory()
          break
        case 'buttonDifferenceTable':
          this.differenceTable()
          break
        default:
          return false
      }
    }
  },
}
</script>
