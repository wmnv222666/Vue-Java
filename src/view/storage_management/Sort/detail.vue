<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-14 18:33:06
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-11 13:03:09
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
                  <FormItem :label="$t('lbl_task_code')">{{ head.receiptCode }}</FormItem>
                  <FormItem :label="$t('col_creator_name')">{{ head.createUserName }}</FormItem>
                  <FormItem :label="$t('col_create_time')">{{ head.createTime }}</FormItem>
                  <FormItem :label="$t('lbl_wh_code')" required>
                    <span v-if="disableEdit">{{ head.whCode }}</span>
                    <Select v-else v-model="head.whCode" clearable @on-change="whChange" transfer>
                      <Option v-for="(item, i) in whList" :value="item.value" :key="i" :label="item.label"></Option>
                    </Select>
                  </FormItem>
                </Form>
              </div>
            </TabPane>
          </Tabs>
          </Col>
        </Row>
        <Row class="border-top" v-show="isShowTable">
          <Col span="24" class="margin-t-16" v-if="!disableEdit">
          <Form :model="head" :label-width="140" inline label-colon>
            <buttonGroup>
              <Button icon="md-add" @click="isAdd = true">{{ $t('btn_add') }}</Button>
              <Button icon="ios-trash" @click="delSelectList">{{ $t('btn_delete') }}</Button>
              <Button icon="ios-cloud-upload-outline" @click="exportExcel"> {{ $t('export_to_excel') }} </Button>
            </buttonGroup>
          </Form>
          </Col>
          <div v-show="!disableEdit">
          <Col span="24" class="margin-t-16">
          <vxe-table ref="detailTable" :data="itemTableList" row-id="xid" max-height="450" stripe show-overflow resizable highlight-cell @checkbox-change="selectionChange" @checkbox-all="selectionChange" :checkbox-config="{ reserve: true, highlight: true, checkMethod: checkMethod }">
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
            <!-- <vxe-table-column min-width="80" field="sourceTypeCode" :title="$t('Warehouse')"> -->
              <!-- <template v-slot="{ row }"> -->
                <!-- <span>{{ row.sourceTypeCode }} - {{ row.sourceTypeName }}</span> -->
                <!-- <span>{{ row.sourceTypeCode }}</span> -->
              <!-- </template> -->
            <!-- </vxe-table-column> -->
            <vxe-table-column min-width="80" field="sourceBinCode" :title="$t('LocationCode')"></vxe-table-column>
            <!-- <vxe-table-column min-width="180" field="qty" :title="$t('QtyB')"> -->
            <vxe-table-column min-width="80" title="Picked Qty">
              <template v-slot="{ row }">
                <Icon size="24" type="md-apps" :class="row.weightQty == row.qty ? 'success' : 'pointer'" @click="allocationHandle(row)" />
              </template>
            </vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
            <vxe-table-column min-width="80" field="matCode" title="Item"></vxe-table-column>
            <vxe-table-column min-width="80" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
            <vxe-table-column min-width="80" field="lotNumb" :title="$t('Batch ')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext3" title="MfgID"></vxe-table-column>
            <vxe-table-column min-width="80" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext7" :title="$t('prddate')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext8" :title="$t('expdate')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
            <vxe-table-column min-width="80" field="weightQty" :title="$t('col_qty')"></vxe-table-column>
            <vxe-table-column min-width="80" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="targetTypeCode" :title="$t('col_target_type_code')"></vxe-table-column> -->
            <vxe-table-column min-width="80" field="targetLocalCode" :title="$t('col_target_bin_code')">
              <template v-slot="{ row }">
                <span v-if="disableEdit">{{ row.targetLocalCode }}</span>
                <Select v-else transfer v-model="row.targetLocalCode" @on-change="binCodeChangeHandle(row)" filterable>
                  <Option v-for="(item, i) in binCodeListReturn" :key="i" :value="item.label">{{ item.label }}</Option>
                </Select>
              </template>
            </vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
          </vxe-table>
          <vxe-table ref="sdetailTable" v-show=false>
            <vxe-table-column min-width="160" field="sourceTypeCode" :title="$t('Zone')">
            </vxe-table-column>
            <vxe-table-column min-width="160" field="sourceBinCode" :title="$t('LocationCode')"></vxe-table-column>
            <vxe-table-column min-width="160" field="matCode" title="Item"></vxe-table-column>
            <vxe-table-column min-width="200" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
            <vxe-table-column min-width="160" field="weightQty" :title="$t('col_qty')"></vxe-table-column>
            <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <vxe-table-column min-width="160" field="targetTypeCode" :title="$t('col_target_type_code')"></vxe-table-column>
            <vxe-table-column min-width="160" field="targetBinCode" :title="$t('col_target_bin_code')"></vxe-table-column>
          </vxe-table>
          <x-vxe-pager perfect :current-page="page.pageIndex" :page-size="page.pageSize" :total="page.totalCount" @page-change="handlePageChange">
          </x-vxe-pager>
          </Col>
          </div>
          <div v-show="disableEdit">
          <Col span="24" class="margin-t-16">
          <vxe-table  ref="detailTable" :data="itemTableList" row-id="xid" max-height="450" stripe show-overflow resizable highlight-cell @checkbox-change="selectionChange" @checkbox-all="selectionChange" :checkbox-config="{ reserve: true, highlight: true, checkMethod: checkMethod }">
            <!-- <vxe-table-column  type="checkbox" width="60"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="sourceTypeCode" :title="$t('Zone')"> -->
              <!-- <template v-slot="{ row }"> -->
                <!-- <span>{{ row.sourceTypeCode }} - {{ row.sourceTypeName }}</span> -->
                <!-- <span>{{ row.sourceTypeCode }}</span> -->
              <!-- </template> -->
            <!-- </vxe-table-column> -->
            <vxe-table-column min-width="160" field="sourceBinCode" :title="$t('LocationCode')"></vxe-table-column>
            <!-- <vxe-table-column min-width="180" field="qty" :title="$t('QtyB')"> -->
            <!-- <vxe-table-column  min-width="180" title="Picked Qty">
              <template v-slot="{ row }">
                <Icon size="24" type="md-apps" :class="row.weightQty == row.qty ? 'success' : 'pointer'" @click="allocationHandle(row)" />
              </template>
            </vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
            <vxe-table-column min-width="100" field="matCode" title="Item"></vxe-table-column>
            <vxe-table-column min-width="100" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext3" title="MfgID"></vxe-table-column>
            <vxe-table-column min-width="80" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext7" :title="$t('prddate')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext8" :title="$t('expdate')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
            <vxe-table-column min-width="80" field="weightQty" :title="$t('col_qty')"></vxe-table-column>
            <vxe-table-column min-width="80" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="targetTypeCode" :title="$t('col_target_type_code')"></vxe-table-column> -->
            <vxe-table-column min-width="80" field="targetLocalCode" :title="$t('col_target_bin_code')">
              <template v-slot="{ row }">
                <span v-if="disableEdit">{{ row.targetLocalCode }}</span>
                <Select v-else transfer v-model="row.targetLocalCode" @on-change="binCodeChangeHandle(row)" filterable>
                  <Option v-for="(item, i) in binCodeListReturn" :key="i" :value="item.label">{{ item.label }}</Option>
                </Select>
              </template>
            </vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
          </vxe-table>
          <vxe-table ref="sdetailTable" v-show=false>
            <vxe-table-column min-width="160" field="sourceTypeCode" :title="$t('Zone')">
            </vxe-table-column>
            <vxe-table-column min-width="160" field="sourceBinCode" :title="$t('LocationCode')"></vxe-table-column>
            <vxe-table-column min-width="160" field="matCode" title="Item"></vxe-table-column>
            <vxe-table-column min-width="200" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
            <vxe-table-column min-width="160" field="weightQty" :title="$t('col_qty')"></vxe-table-column>
            <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <vxe-table-column min-width="160" field="targetTypeCode" :title="$t('col_target_type_code')"></vxe-table-column>
            <vxe-table-column min-width="160" field="targetBinCode" :title="$t('col_target_bin_code')"></vxe-table-column>
          </vxe-table>
          <x-vxe-pager perfect :current-page="page.pageIndex" :page-size="page.pageSize" :total="page.totalCount" @page-change="handlePageChange">
          </x-vxe-pager>
          </Col>
          </div>
        </Row>

        <div class="fixed-bottom" v-show="isShowTable">
          <button-expand :btnGroup="groupBtn" @on-ok="btnHandle" />
        </div>
      </div>
    </div>

    <add :drawer.sync="isAdd" :binCodeListReturn="binCodeListReturn" @on-ok="addHandle" />

    <!-- 配货 -->
    <allocation :drawer.sync="isAllocation" :row="row" @on-ok="handleAllocation" @on-unpack="handleUnpack" />
  </div>
</template>

<script>
import { API } from '@A/warehouse/Sort'
import { CAPI } from '@A/common'
// 按钮逻辑
import ButtonExpand from '_c/btnGroup/ButtonExpand.vue'
import allocation from './allocation.vue'

import add from './add.vue'
import unpack from "./unpack.vue";

export default {
  name: 'detail',
  components: {
    add,
    allocation,
    ButtonExpand
  },
  data () {
    return {
      submitList:[],
      isAdd: false,
      selectedMatName: '',
      head: {}, // 抬头信息
      tabChangeValue: 'p1', // Tab切换当前选项卡名称
      curr: 0, // 点击获取当前行索引 获取操作抬头信息
      selection: [], // 已选择数据
      itemList: [], // 表格全量数据
      itemTableList: [], // 表格显示数据
      isAllocation: false, // 配货弹窗
      row: {}, // 选中行数据
      binCodeListReturn: [],
      whList: [],
      selecUuidArr: [],
      groupBtn: {
        buttonSave: true, // 保存
        buttonSubmit: true, // 保存
        buttonDelete: false // 删除
      }, // 按钮组权限
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
      //console.log('this.head.receiptStatusName=',this.head.receiptStatusName)
      return this.tabChangeValue === 'p1' || this.tabChangeValue === 'p2'
    },
    // 已提交之后状态不可以修改  // 可编辑使能控制 true 不可编辑 false 可编辑
    disableEdit () {
      return this.head.receiptStatus > 20
    }
  },
  created () {
    this.getWhList()
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
        this.getInfoByCreate()
        return false;
      }

      this.getInfoByCode()// 详情进入
    },
    // 配货
    allocationHandle (row) {
      var tmp = []
      this.$set(row, 'unpack',false)
      this.$set(row, 'unpackNum',0)
      tmp[0]=row
      this.$set(this.row, 'sinobecStocks',tmp)
      //this.row = row
      this.curr = row.xIndex
      this.isAllocation = true
    },
    // 配货回调
    handleAllocation (qty, binCodesList, binList) {
      this.todoList[this.curr]['sinobecStocks'] = binList
      this.todoList[this.curr]['loc'] = binCodesList
      this.todoList[this.curr]['qty'] = qty
    },
    handleUnpack (binList) {
      //this.todoList[this.curr]['sinobecStocks'] = binList
      //this.itemTableList.splice(this.curr,1)
      //console.log("this.itemTableList",this.itemTableList)
      //console.log("binList",binList)
      for(var i = this.itemTableList.length -1; i >= 0 ; i--){
        if(this.itemTableList[i].bundleCode == binList[0].bundleCode){
          this.selectedMatName=this.itemTableList[i].matName
          this.itemTableList.splice(i, 1);
        }
      }
      //console.log("this.itemTableList",this.itemTableList)
      //this.itemTableList=[]
      for(var i=0; i<binList.length; i++){
        //binList[i].sourceTypeCode = binList[i].sourcetypeCode
        binList[i].matName = this.selectedMatName
        this.itemTableList.push(binList[i])
        //console.log('test 1=\n',i)
      }
      this.itemTableList.map((item,i)=>{item.xIndex=i})
    },
    /**
     * @Description: Query detailed data by document number
     * @Author: Jiang Xiao
     */
    async getInfoByCode () {
      var [err, res] = await this.$to(API.AGetDetailByCode(this.baseInfo.id, this.baseInfo.in)); if (err) { return false }
      this.initData(res.data, false)
    },
    getInfoByCreate () {
      var data = {
        taskList: []
      }
      this.initData(data, true)
    },
    // 仓库号查询
    async getWhList () {
      var [err, res] = await this.$to(API.AGetWhlist()); if (err) { return false }
      this.whList = this.$kv(res.data.headList, 'whCode', 'whName', true)
      if (this.$store.getters.UserCropCode != '') {
        this.whList = this.whList.filter( x => { return x.value == this.$store.getters.UserCropCode });  //2021-10-07 新加
      }
      
      this.whChange(this.whList[0].value)
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

      var itemList = data.taskList

      if (!itemList.length) {
        data.head = {
          receiptCode: '',
          receiptStatus: 0,
          stockTaskCode: '',
          receiptStatusName: '',
          createUserName: this.$store.getters.UserName,
          createTime: '',
          whCode:''
        }
      } else {
        data.head = {
          receiptCode: itemList[0]['receiptCode'],
          stockTaskCode: itemList[0]['stockTaskCode'],
          createUserName: itemList[0]['createUserName'],
          createTime: itemList[0]['createTime'],
          receiptStatus: itemList[0]['receiptStatus'],
          receiptStatusName: itemList[0]['receiptStatusName'],
          whCode:itemList[0]['whCode']
        }
      }

      if (data.head.receiptStatus < 20) {
        this.groupBtn = {
          buttonSave: true,
          buttonSubmit: false,
          buttonDelete: false
        } // 按钮组权限
      } else if (data.head.receiptStatus === 20) {
        this.groupBtn = {
          buttonSave: true,
          buttonSubmit: true,
          buttonDelete: true
        } // 按钮组权限
      } else {
        this.groupBtn = {
          buttonSave: false,
          buttonSubmit: false,
          buttonDelete: false
        } // 按钮组权限
      }

      this.head = data.head

      this.itemList = this.formatItemList(itemList)
      // 获取分页数据
      this.getFirstPageData()
    },
    changeBtnShow(){
      if(!this.itemTableList.length){
        this.groupBtn = {
          buttonSave: true,
          buttonSubmit: false,
          buttonDelete: false
        }
      }else if(this.head.receiptStatus === 90){

        this.groupBtn = {
          buttonSave: false,
          buttonSubmit: false,
          buttonDelete: false
        } // 按钮组权限
      } 
      else{
        this.groupBtn = {
          buttonSave: true,
          buttonSubmit: true,
          buttonDelete: false
        }
      }
    },
    // 格式化行项目数据
    formatItemList (itemList) {
      itemList.forEach(function (item, i) {
        item.xIndex = i // 唯一标识
        item.targetLocalCode=item.targetTypeCode+"/"+item.targetBinCode
      })
      return itemList
    },
    async checkBinWeight () {
      var [err, res] = await this.$to(API.ACheckBinWeight(this.itemList)); if (err) { return false }
      if (res.data) {
        this.$confirm({
          content: 'exceed max weight, continue or not',
          onOk: () => { }
        })
      }
    },
    // 获取全集仓位
    async getBinList () {
      var [err, res] = await this.$to(CAPI.AGetBinList(this.head.whCode)); if (err) { return false }
      var binList = res.data.binList || []
      this.binCodeListReturn = binList.map(function (item) {
        return {
          binCode: item.binCode,
          typeCode: item.typeCode,
          label: `${item.typeCode}/${item.binCode}`
        }
      })
    },
    whChange (whCode) {
      this.head.whCode = whCode || ''
      this.head.typeCode = ''
      // 根据仓库号查询仓位下拉
      whCode && this.getBinList()
    },
    // binCode切换
    binCodeChangeHandle (row) {
      var binInfo = this.binCodeListReturn.find(function (item) {
        //把row.targetBinCode"bp01/0101"拆开 
        var tmp = []
        if (typeof row.targetLocalCode != "undefined"){

          tmp = row.targetLocalCode.split("/")
        }
        var typeCode = tmp[0]
        var binCode = tmp[1]
        if(item.binCode === binCode  && item.typeCode === typeCode){
          //console.log('adfasdfasdfasdfafsd====')
          return 1
        }
        return 0
        //return item.binCode === row.targetBinCode
      })
      // console.log("binInfo",binInfo)
      // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      // console.log("tmp",tmp)
      // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      // if (binInfo) {
      //   // this.itemList[row.xIndex]['targetTypeCode'] = binInfo.typeCode
      //   // this.itemTableList[row.xIndex]['targetTypeCode'] = binInfo.typeCode;
      //   //this.itemList[row.xIndex].targetTypeCode = binInfo.typeCode
      //   //console.log(this.itemTableList[row.xIndex])
      //   this.itemTableList[row.xIndex].targetTypeCode = binInfo.tmp[0]
      //   this.itemTableList[row.xIndex].targetBinCode = binInfo.tmp[1]
      //   // this.checkBinWeight(row)
      // }
    },
    // 行项目数据添加 - 合并去重
    addHandle (itemList) {
      this.itemList = this.$mergeArray(this.itemList, itemList, 'stockId')
      this.getFirstPageData()  //页面中显示的数据
    },
    // 删除选择数据
     delSelectList () { 
     if (!this.selecUuidArr.length) {
        this.$Notice.warning({
          desc: "There is no deletable data"
        });
        return;
      }
      this.itemTableList = this.itemTableList.filter(
        v => !this.selecUuidArr.includes(v.uuid)
      );
      this.selecUuidArr = []
      this.itemList = this.$del(this.itemList, this.submitList, 'stockId')
       
       this.getFirstPageData()  //页面中显示的数据
      
      
    },
    // 批量选中改变
    selectionChange ({ selection }) {
      // 所有选择的数据 当前页 + 之前页的
      this.submitList = selection;
      this.selecUuidArr = selection.map(v => v.uuid);
      var getCheckboxReserveRecords = this.$refs.detailTable.getCheckboxReserveRecords()
      var getCheckboxRecords = this.$refs.detailTable.getCheckboxRecords()

      this.selection = getCheckboxReserveRecords.concat(getCheckboxRecords)
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
        item.xIndex = i
      })
      this.itemTableList = this.$getPage(1, this.page.pageSize, this.itemList)
      this.changeBtnShow()
    },
    exportExcel () {
      var excelList = this.itemTableList
      //console.log('excelList=',excelList)
      this.$refs.sdetailTable.exportData({
        filename: 'Sort Task List',
        type: 'csv',
        isHeader: true,
        isFooter: true,
        data: excelList
      })
    },
    // 是否可选
    checkMethod ({ row }) {
      // 已冲销 已完成 无权限不可以选择
      return !(row.disableEdit || row.disabled)
    },
    // 成功回调
    successHandle (res) {
      this.$router.push({ name: 'sort' })
      this.$Notice.success({ desc: res.returnMsg })
    },
    //删除
    // deleteOrder (senData) {
    //   var eCommand = () => {
    //     API.ADelete(this.head.receiptCode).then((res) => { this.successHandle(res) })
    //   }
      
    //   this.$confirm({
    //     content: this.$t('msg_notice_74'),
    //     onOk: eCommand
    //   })

    // },
    /**
     * @Description: Document pre-save verification function
     * @Author: Jiang Xiao
     */
    preSaveValidation () {
      if (!this.itemList.length) {
        this.$Notice.warning({ desc: this.$t('msg_notice_145') })
        return false
      }
      return true
    },
    /**
     * @Description: Document pre-submission verification function
     * @Author: Jiang Xiao
     */
    preCommitValidation () {
      if (!this.preSaveValidation()) {
        return false
      }

      //if (this.itemList.some((item) => { return item.targetBinCode == '' })) {
      if (this.itemTableList.some((item) => { return item.targetBinCode == '' })) {
        this.$Notice.warning({ desc: this.$t('msg_notice_280') })
        return false
      }

      return true
    },
    // 提交保存
    submit (isSubmit) {
      var senData = this.formatSendData(isSubmit)
      // submit
      if (isSubmit) {
        if (this.preCommitValidation()) {
          this.$confirm({
            content: this.$t('msg_notice_26'),
            onOk: () => {
              this.submitOrder(senData)
              this.deleteOrder(senData)
            }
          })
        }
      } else {
        // save
        if (this.preSaveValidation()) {
          this.$confirm({
            content: this.$t('msg_notice_27'),
            onOk: () => {
              this.submitOrder(senData)
            }
          })
        }
      }
    }, 
    // 格式化提交入参
    formatSendData (isSubmit) {

      // this.itemList.forEach((item) => {
      //   item.whCode = item.whCode || this.head.whCode
      // })
      //console.log("this.itemTableList",this.itemTableList)
       var sendData = Object.assign(this.head, this.formData, { totalCount: -1 })
      //this.itemList=this.itemTableList
      var sendList = this.itemTableList
      //this.itemList = Object.assign({},this.itemTableList)
      //console.log("sendList",sendList)
      sendList.forEach((item)=>{
        if (typeof item.targetLocalCode != "undefined"){
          var tmp = item.targetLocalCode.split("/")
          item.targetBinCode = tmp[1]
          item.targetTypeCode = tmp[0]
        }
      })
      var sendData = {
        isSubmit: isSubmit,
        receiptCode: this.head.receiptCode,
        taskList: sendList
      }
      return sendData
    },
    // 单据提交
    async submitOrder (sendData) {
      var [err, res] = await this.$to(API.ASaveOrSubmit(sendData)); if (err) { return false }
      this.successHandle(res)
    },
    // 按钮组回调
    btnHandle (type) {

      switch (type) {
        case 'buttonSave':
          this.submit(0)
          break
        case 'buttonSubmit':
          this.submit(1)
          break
        case 'buttonDelete':
          this.deleteOrder()
          break
        default:
          return false
      }

    }
  },
}
</script>
