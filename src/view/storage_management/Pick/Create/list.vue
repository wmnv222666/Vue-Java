<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-19 10:40:01
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-11 13:05:38
 * @Description: description
 -->
<template>
  <div class="modal-body no-padding h100">
    <div class="i-box clearfix h100 x-height-table">
      <x-search-header @on-search="enterSearch">
        <template slot="head">
          <!-- <ButtonGroup> -->
            <!-- <Button icon="ios-search" @click="search" :disabled="!formData.soCode"> {{ $t('btn_find') }} </Button> -->
            <!-- <Button icon="md-ionic" @click="synchronization"> {{ $t("btn_synchronization") }} </Button> -->
            <!-- <Button min-width="160" icon="ios-print-outline"  class="buttonPrint"  @click="exportMatLabel">{{ $t("btn_label_export") }}</Button> -->
            <!-- <Button min-width="160" icon="ios-print-outline"  class="buttonPrint"  @click="printMatLabel">{{ $t("btn_print") }}</Button> -->
            <!-- <upload-excel-component :on-success="handleSuccess" :typeIO="2" /> -->
          <!-- </ButtonGroup> -->
        </template>
        <template slot="body">
          <search-in flex :title="$t('receipt_type_desc_x')" required>
            <Select v-model="formData.soType" @on-change="receiptTypeChange">
              <Option :value="201" :label="$t('mu_sales_document')"></Option>
              <Option :value="202" :label="$t('mu_transfer_out')"></Option>
              <Option :value="203" :label="$t('mu_adjustment_out')"></Option>
              <!-- <Option :value="204" :label="$t('mu_vendor_return')"></Option> -->
            </Select>
          </search-in>
          <search-in flex :title="$t('DNumber')" required>
            <!-- <Input type="text" v-model="formData.soCode" :maxlength="20" /> -->
            <!-- <Select v-model="formData.soCode" clearable>
              <Option v-for="(item, i) in dcList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select> -->
            <AutoComplete clearable v-model="formData.soCode" :data="data3" :filter-method="filterMethod" style="width:200px"></AutoComplete>
          </search-in>
          <Button icon="ios-search" @click="search"> {{ $t('btn_find') }} </Button>
          <!-- <Button icon="ios-cloud-upload-outline" @click="exportExcel"> {{ $t('export_to_excel') }} </Button> -->
        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16" style="height:calc(100% - 220px);">
      <Tabs v-model="tabVisible" class="h100" @on-click="tabClickHandle">
        <TabPane :label="p1Label" name="p1">
          <vxe-table ref="tTable" :sync-resize="tabVisible" :data="todoList" height="auto" stripe show-overflow="title" resizable row-id="xid" highlight-cell :checkbox-config="{ reserve: true, highlight: true, checkMethod: checkMethod }" @checkbox-change="selectionChangeT" @checkbox-all="selectionChangeT">
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
            <vxe-table-column min-width="40" field="receiptCode" :title="$t('DNumber')"></vxe-table-column>
            <!-- <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
            <vxe-table-column min-width="100" field="weightQty" :title="$t('QtyO')"></vxe-table-column>
            <vxe-table-column min-width="60" field="qty" :title="$t('QtyB')">
              <template v-slot="{ row }">
                <Icon size="24" type="md-apps" :class="row.weightQty == row.qty ? 'success' : 'pointer'" @click="allocationHandle(row)" />
              </template>
            </vxe-table-column>
            <vxe-table-column min-width="60" field="matCode" title="Item"></vxe-table-column>
            <vxe-table-column min-width="60" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
            <vxe-table-column min-width="60" field="matExt1" :title="$t('UPC')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="ext0" :title="$t('Shipping Ref# ')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
            <vxe-table-column min-width="60" field="ext3" title="MfgID"></vxe-table-column>
            <vxe-table-column min-width="60" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext7" :title="$t('prddate')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext8" :title="$t('expdate')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
            <vxe-table-column min-width="60" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <vxe-table-column min-width="60" field="receiptQty" :title="$t('Qty')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext12" :title="$t('Shopify#')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext15" :title="$t('carrier')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext16" :title="$t('tracking#')"></vxe-table-column>
            <!-- <vxe-table-column min-width="60" field="actualWeightQty" :title="$t('ActQty')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="200" field="lotNumb" :title="$t('Batch')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="loc" :title="$t('Loc')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
          </vxe-table>
        </TabPane>
        <!-- <vxe-table ref="sTable" v-show=false>
          <vxe-table-column min-width="160" field="weightQty" :title="$t('QtyO')"></vxe-table-column>
          <vxe-table-column min-width="180" field="qty" :title="$t('QtyB')"></vxe-table-column>
          <vxe-table-column min-width="160" field="matCode" title="Item"></vxe-table-column>
          <vxe-table-column min-width="200" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
          <vxe-table-column min-width="160" field="loc" :title="$t('Loc')"></vxe-table-column>
          <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
        </vxe-table> -->
            <!-- <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
          <!-- </vxe-table>-->
        <TabPane :label="p2Label" name="p2">
          <vxe-table ref="sTable" :sync-resize="tabVisible" :data="savedList" height="auto" stripe show-overflow="title" resizable row-id="xid" @checkbox-change="selectionChangeS" @checkbox-all="selectionChangeS">
           <vxe-table-column type="checkbox" width="60"></vxe-table-column>
            <!-- <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
            <vxe-table-column min-width="40" field="receiptCode" :title="$t('DNumber')"></vxe-table-column>
            <vxe-table-column min-width="160" field="weightQty" :title="$t('QtyO')"></vxe-table-column>
            <vxe-table-column min-width="180" field="qty" :title="$t('QtyB')"></vxe-table-column>
            <!-- <vxe-table-column min-width="180" field="qty" :title="$t('QtyB')">
              <template v-slot="{ row }">
                <Icon size="24" type="md-apps" :class="row.weightQty == row.qty ? 'success' : 'pointer'" @click="allocationHandle(row)" />
              </template>
            </vxe-table-column> -->
            <vxe-table-column min-width="160" field="matCode" title="Item"></vxe-table-column>
            <vxe-table-column min-width="200" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
            <vxe-table-column min-width="60" field="matExt1" :title="$t('UPC')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext3" title="MfgID"></vxe-table-column>
            <vxe-table-column min-width="60" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext7" :title="$t('prddate')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext8" :title="$t('expdate')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
            <vxe-table-column min-width="60" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="loc" :title="$t('Loc')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
            <vxe-table-column min-width="60" field="ext11" :title="$t('pallet_qty')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext12" :title="$t('Shopify#')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext15" :title="$t('carrier')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext16" :title="$t('tracking#')"></vxe-table-column>
          </vxe-table>
        </TabPane>
      </Tabs>
      </Col>

      <div class="fixed-bottom">
        <button-expand :btnGroup="groupBtn" @on-ok="btnHandle" />
      </div>
    </div>

    <!-- 配货 -->
    <allocation :drawer.sync="isAllocation" :row="row" @on-ok="handleAllocation" @on-unpack="handleUnpack" />
  </div>
</template>

<script>
import { API } from '@A/warehouse/Pick'
import { CAPI } from '@A/common'
// 按钮逻辑
import ButtonExpand from '_c/btnGroup/ButtonExpandBus.vue'
import UploadExcelComponent from "_c/UploadExcel/index.vue"

import allocation from './allocation.vue'
import { unique } from '@/libs/assist'
import request from "@/api/api.request.download";
import { downloadFile } from "@/libs/assist";

export default {
  components: { ButtonExpand, allocation, UploadExcelComponent },
  data () {
    return {
      tabVisible: 'p1',
      p1Label: (h) => {
        return h('div', [h('span', 'TODO LIST'), h('Badge', { props: { count: this.todoList.length } })])
      },
      p2Label: (h) => {
        return h('div', [h('span', 'SAVED'), h('Badge', { props: { count: this.savedList.length } })])
      },
      data3: [],
      dcList: [], //订单列表
      cropList: [], // 公司下拉
      // receiptType: [201,203,204],
      todoList: [],
      savedList: [],
      completeList: [],
      selectionTodo: [],
      selectionSaved: [],
      row: {}, // 选中行数据
      isAllocation: false, // 配货弹窗
      curr: 0,
      formData: {
        soType: 201,
        corpCode: '',
        soCode: '',
        create: true
      },
      groupBtn: {
        buttonSave: false,
        buttonSubmit: false,
        buttonDelete: false
      },
      // 分页\排序
      head: {
        paging: false,
        totalCount: -1,
        pageIndex: 1,
        pageSize: 100,
        sortColumn: '',
        sortAscend: true
      }
    }
  },
  created () {
    // this.getCropList()
    //this.getAllTodoList()
    var id = this.$route.params.id
    var type = this.$route.params.type
    //console.log("id=",id)
    //console.log("type=",type)
    if(typeof(id) != "undefined" && typeof(type) != "undefined"){
      this.formData.soCode = id
      this.formData.soType = parseInt(type)
      //console.log(typeof(type))
      //this.selectedOption = this.options[0];
      this.getData()
      //console.log("this.formData.soType",this.formData.soType)
    }else{
      this.getDCList(201)
    }

  },
  methods: {
    enterSearch () {
      if (!this.formData.soCode) {
        return false
      }
      this.getData()
    },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    // 获取列表
    async getData () {
      // console.log('this.formData=\n',this.formData)
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 })
      var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
      // console.log("res",res)
      var creteShelfLoadDaoVos = res.data.creteShelfLoadDaoVos || []
      var viewShelfLoadDaoVos = res.data.viewShelfLoadDaoVos || []
      this.todoList = this.formatDataTodo(creteShelfLoadDaoVos)
      //this.savedList = this.formatDataSaved(viewShelfLoadDaoVos)
      this.savedList = viewShelfLoadDaoVos

      // console.log('viewShelfLoadDaoVos : ', viewShelfLoadDaoVos)
      // console.log('creteShelfLoadDaoVos : ', creteShelfLoadDaoVos)

      this.savedList.map((x)=>x.qty=x.weightQty)
      this.selectionTodo = []
      this.selectionSaved = []
    },
    async getAllTodoList () {
      var _ = require('lodash');
      var tmp = _.cloneDeep(this.formData)
      var index
      for(index in this.receiptType){
        //console.log(index)
        tmp.receiptType = tmp.soType = this.receiptType[index]
        tmp.create = true
        //console.log('tmp=\n',tmp)
        var sendData = Object.assign(this.head, tmp, { totalCount: -1 })
        //console.log('senddata=\n',sendData)
        var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
        var creteShelfLoadDaoVos = res.data.creteShelfLoadDaoVos || []
        var viewShelfLoadDaoVos = res.data.viewShelfLoadDaoVos || []
        //this.todoList = this.formatDataTodo(creteShelfLoadDaoVos)
        //this.savedList = this.formatDataSaved(viewShelfLoadDaoVos)
        //var data = res.data
        //console.log('data = \n',data)
        //console.log(creteShelfLoadDaoVos)
        if(creteShelfLoadDaoVos.length != 0){
          //var tmpList = this.formatTodoList(data.resultMap.todoList)
          var tmpList = this.formatDataTodo(creteShelfLoadDaoVos)
          var tmpList1 = this.formatDataSaved(viewShelfLoadDaoVos)
          for(var i in tmpList){
            this.todoList.push(tmpList[i])
            this.savedList.push(tmpList1[i])
            //console.log('this.todolist = \n',this.todoList)
          }
        }
      }


      //this.savedList = data.resultMap.savedList || []
      //this.completeList = data.resultMap.completeList || []
      this.selectionTodo = []
      this.selectionSaved = []
    },
    //获取订单列表
    async getDCList (receiptType) {
      var [err, res] = await this.$to(API.AGetAllList({"receiptType":receiptType})); if (err) { return false }
      this.dcList = this.$kv(res.data.list, 'soCode', 'soCode', false)
      this.data3 = []
      this.dcList.map(item=>this.data3.push(item.value))
    },
    receiptTypeChange (receiptType) {
      this.data3 = []
      this.dcList = []
      this.getDCList(receiptType)
      this.formData.soCode = ''
    },
    // 添加索引
    formatDataTodo (list) {
      // matchCase	匹配结果 》》》》
      // 正常匹配 value=10
      // 库存数量大于订单数量 value=20
      // 库存数量小于订单数量 value=30
      // 无法匹配 value=40
      return list.map(function (item, i) {
        item.xIndex = i;
        item.qty = 0
        item.disableEdit = (item.matchCase === 30 || item.matchCase === 40)
        if (item.matchCase === 10) {
          if(item.sinobecStocks.length > 0){
            item.loc = item.sinobecStocks[0]['typeCode'] + '/' + item.sinobecStocks[0]['binCode']
            item.qty = item.sinobecStocks[0]['weightQty']
            item.sinobecStocks.forEach((itemBin) => {
              itemBin._checked = true
            })
          }
        }
        return item
      })
    },
    // 添加索引
    formatDataSaved (list) {
      return list.map(function (item, i) {
        item.xIndex = i;
        item.qty = 0
        item.disableEdit = true
        item.loc = unique(item.sinobecStocks.map((itemBin) => {
          return itemBin.typeCode + '/' + itemBin.binCode
        }))
        return item
      })
    },
    // 成功回调
    successHandle (res) {
      this.$Notice.success({ desc: res.returnMsg })
      this.getData()
      this.getDCList(201)
    },
    // 获取公司列表
    // async getCropList () {
    //   var [err, res] = await this.$to(CAPI.AGetCropList()); if (err) { return false }
    //   this.cropList = this.$kv(res.data, 'corpCode', 'corpName', true)
    // },
    async deleteOrder () {
      var [err, res] = await this.$to(API.ADelete(this.selectionSaved)); if (err) { return false }
      this.successHandle(res)
    },
    async saveOrder () {
      // console.log("call saveOrder")
      var selectionTodo = this.$c(this.selectionTodo)
      var sendData = selectionTodo.map(function (item) {
        item.sinobecStocks = item.sinobecStocks.filter((itemBin) => { return itemBin._checked })
        return item
      })
      var tmpSendData = []
      // console.log("sendData=",sendData)
      for(var i = 0; i<sendData.length;i++){
        for(var j = 0; j<sendData[i].sinobecStocks.length; j++){
          //console.log(sendData[i].sinobecStocks[j])
          var item = this.$c(sendData[i])
          item.sinobecStocks = [];
          item.sinobecStocks = sendData[i].sinobecStocks[j]
          // console.log("item",item)
          item.ext11 = item.sinobecStocks.ext11
          item.ext7 = item.sinobecStocks.ext7
          item.ext8 = item.sinobecStocks.ext8
          item.ext9 = item.sinobecStocks.ext9
          item.ext3 = item.sinobecStocks.ext3
          if(sendData[i].sinobecStocks.length > 1){
            item.ext5 = "Y"
          }
          tmpSendData.push(item)
          //tmpSendData.sinobecStocks = []
          //tmpSendData.sinobecStocks = this.$c(sendData[i].sinobecStocks[j])
        }
      }
      // console.log("tmpSendData",tmpSendData)
      //var [err, res] = await this.$to(API.ASave(sendData)); if (err) { return false }

      // console.log(tmpSendData)
      var [err, res] = await this.$to(API.ASave(tmpSendData)); if (err) { return false }
      this.successHandle(res)
    },
    async submitOrder () {
      //var selectionTodo = this.$c(this.selectionTodo)
      var selectionTodo = this.$c(this.selectionSaved)
      //console.log("this.selectionSaved",this.selectionSaved)
      // var sendData = selectionTodo.map(function (item) {
      //   item.sinobecStocks = item.sinobecStocks.filter((itemBin) => { return itemBin._checked })
      //   return item
      // })
      //var sendData = this.$c(this.selectionSaved)
      var sendData = this.$c(this.savedList)
      // console.log("call submitOrder")
      // console.log("sendData",sendData)

      //var sendData = this.$c(this.savedList)
      var [err, res] = await this.$to(API.ASubmit(sendData)); if (err) { return false }
      this.$Notice.success({ desc: res.returnMsg })
      this.todoList = []
      this.savedList = []
      this.selectionTodo = []
      this.selectionSaved = []
      this.formData.soType = ''
    },
    // 是否可选
    checkMethod ({ row }) {
      return !row.disableEdit
    },
    // 保存校验
    preSaveValidation () {
      if (!this.selectionTodo.length) {
        this.$Notice.warning({ desc: this.$t('msg_notice_145') })
        return false
      }

      /*****2021-10-20 注释掉 -- task 下架任务 不校验配货数量，可以小于要下架的数量下架  */
      // if (this.selectionTodo.some((item) => { return item.qty !== item.weightQty })) {
      //   this.$Notice.warning({ desc: this.$t('msg_notice_172') })
      //   return false
      // }
      /*****2021-10-20 注释掉 -- task 下架任务 不校验配货数量，可以小于要下架的数量下架  */

      // if(this.selectionTodo.length != this.todoList.length){
      //   this.$Notice.warning({ desc: this.$t('msg_notice_354') })
      //   return false
      // }
      return true
    },
    // 提交校验
    preCommitValidation () {
      if (this.todoList.length) {
        this.$Notice.warning({ desc: this.$t('msg_notice_900') })
        return false
      }

      if (!this.savedList.length) {
        this.$Notice.warning({ desc: this.$t('msg_notice_145') })
        return false
      }

      return true
    },
    // 删除校验
    preDeleteValidation () {
      if (!this.selectionSaved.length) {
        this.$Notice.warning({ desc: this.$t('msg_notice_145') })
        return false
      }
      return true
    },
    btnHandle (type) {
      switch (type) {
        case 'buttonSave':
          if (this.preSaveValidation()) {
            this.$confirm({
              content: this.$t('msg_notice_27'),
              onOk: () => {
                this.saveOrder()
              }
            })
          }
          break
        case 'buttonSubmit':
          if (this.preCommitValidation()) {
          //if (this.preSaveValidation()) {
            this.$confirm({
              content: this.$t('msg_notice_26'),
              onOk: () => {
                this.submitOrder()
              }
            })
          }
          break
        case 'buttonDelete':
          if (this.preDeleteValidation()) {
            this.$confirm({
              content: this.$t('msg_notice_74'),
              onOk: () => {
                this.deleteOrder()
              }
            })
          }
          break
        default:
          return false
      }
    },
    // 配货
    allocationHandle (row) {
      this.row = row
      this.curr = row.xIndex
      this.isAllocation = true
    },
    // 配货回调
    handleAllocation (qty, binCodesList, binList) {
      this.todoList[this.curr]['sinobecStocks'] = binList
      this.todoList[this.curr]['loc'] = binCodesList
      this.todoList[this.curr]['qty'] = qty
      //console.log('this.todoList=',this.todoList)
    },
    handleUnpack (binList) {
      this.todoList[this.curr]['sinobecStocks'] = binList
    },
    search () {
      if(!this.formData.soCode){
        this.groupBtn.buttonSave = false;
        this.groupBtn.buttonDelete = false;
        this.groupBtn.buttonSubmit = false;
      }
      this.getData()
    },
    // 表格选中改变
    selectionChangeT ({ selection }) {
      this.selectionTodo = selection
    },
    selectionChangeS ({ selection }) {
      this.selectionSaved = selection
    },
    // Tab切换
    tabClickHandle (name) {
      if(!this.formData.soCode){
        this.groupBtn.buttonSave = false;
        this.groupBtn.buttonDelete = false;
        this.groupBtn.buttonSubmit = false;
      }else if (name === 'p1') {
        this.groupBtn.buttonSave = true
        this.groupBtn.buttonSubmit = false
        this.groupBtn.buttonDelete = false
      } else {
        this.groupBtn.buttonSave = false
        this.groupBtn.buttonSubmit = true
        this.groupBtn.buttonDelete = true
      }
    },
    // 同步
    async synchronization () {
      if (!this.preCommitValidationReceiptCode()) {
        return false
      }
      switch (this.formData.soType) {
        case 201: // sale order
          this.synSodelivery({ SOPNumber: this.formData.soCode })
          break
        case 202: // transfer_out
          this.synTransferout({ DocumentCode: this.formData.soCode })
          break
        case 203: // adjustment_out
          this.synAdjustmentout({ DocumentCode: this.formData.soCode })
          break
      }
    },
    preCommitValidationReceiptCode () {
      if (!this.formData.soCode) {
        this.$Notice.warning({ desc: this.$t('msg_notice_879') })
        return false
      }
      return true
    },
    async synTransferout (sendData) {
      var [err, res] = await this.$to(API.ASynTransferout(sendData)); if (err) { return false; }
      this.$Notice.success({ desc: res.returnMsg + res.data[0].result + ' Item.' })
    },
    async synAdjustmentout (sendData) {
      var [err, res] = await this.$to(API.ASynAdjustmentout(sendData)); if (err) { return false; }
      this.$Notice.success({ desc: res.returnMsg + res.data[0].result + ' Item.' })
    },
    async synSodelivery (sendData) {
      var [err, res] = await this.$to(API.ASynSodelivery(sendData)); if (err) { return false; }
      this.$Notice.success({ desc: res.returnMsg + res.data[0].result + ' Item.' })
    },
    async handleSuccess (results) {
      var sendData = results.results;
      var [err, res] = await this.$to(API.AUploadList(sendData));
      if (err) {
        return false;
      }
      this.$Notice.success({ desc: res.returnMsg });
      this.getDCList(this.formData.soType)
    },
    prePrintValidation () {
      //if (!this.itemTableList.length) {
      //console.log("this.select=",this.selectionTodo)
      //if (!this.list.length) {
      if (!this.selectionTodo.length) {
        this.$Notice.warning({ desc: this.$t("msg_notice_145") });
        return false;
      }
      for(var i in this.selectionTodo) {
        //console.log("i.qty",this.selectionTodo[i])
        if ( 0 == this.selectionTodo[i].qty ) {
          this.$Notice.warning({ desc: this.$t("Some Items need to distribute.") });
          return false;
        }
        if( this.selectionTodo[i].ext2 != "M") {
          this.$Notice.warning({ desc: this.$t("Can not print VIN or ENG label") });
          return false;
        }
      }
      return true;
    },
    exportMatLabel() {
      //console.log("this.selectionTodo",this.selectionTodo)
        var eCommand =async () => {

        //var sendDataList = this.itemTableList.map(item => {
        var sendDataList = this.selectionTodo.map(item => {
            var qrCode = item.matCode || ""
          return {
            dn:item.receiptCode,
            po:item.shippingRef,
            batch:item.lotNumb,
            vendorCode: item.vendorCode,
            matCode: item.matCode,
            matName: item.matName,
            weightQty: item.weightQty || 0,
            weightUnitCode: item.weightUnitCode || "",
            receiptQty: item.receiptQty || 0,
            whCode: item.whCode || "PS",
            binCode: item.binCode || "",
            heatNumber: item.heatCode || "",
            qrCodeValue: qrCode || "",
            shippingRef: item.shippingRef || "",
            skidNumber: item.skidCode || "",
            ext0: item.ext0,
            ext1: item.ext1,
            ext2: item.ext2,
            unit: item.receiptUnitCode,
            host: "",
            port: 0,
            zplType: 0
          };
        });

        //console.log(sendDataList)
        var [err, res] = await this.$to(
        request({
          url: "sinobec/print/exportMatLablePdf",
          data: sendDataList,
          method: "post",
        })
      );
      if (err) {
        return false;
      }
      downloadFile({ filename: "label", type: "pdf", download: true }, res);
      };

      if (this.prePrintValidation()) {
        this.$confirm({
          content: this.$t("msg_notice_553"),
          onOk: eCommand
        });
      }
    },

    printMatLabel() {
      //console.log("this.selectionTodo",this.selectionTodo)
        var eCommand =async () => {

        //var sendDataList = this.itemTableList.map(item => {
        var sendDataList = this.selectionTodo.map(item => {
            var qrCode = item.matCode || ""
          return {
            dn:item.receiptCode,
            po:item.shippingRef,
            batch:item.lotNumb,
            vendorCode: item.vendorCode,
            matCode: item.matCode,
            matName: item.matName,
            weightQty: item.weightQty || 0,
            weightUnitCode: item.weightUnitCode || "",
            receiptQty: item.receiptQty || 0,
            whCode: item.whCode || "PS",
            binCode: item.binCode || "",
            heatNumber: item.heatCode || "",
            qrCodeValue: qrCode || "",
            shippingRef: item.shippingRef || "",
            skidNumber: item.skidCode || "",
            ext0: item.ext0,
            ext1: item.ext1,
            ext2: item.ext2,
            unit: item.receiptUnitCode,
            host: "",
            port: 0,
            zplType: 0
          };
        });
        //console.log("sendDataList",sendDataList)
        CAPI.APrintMat(sendDataList).then((res) => {
          this.successHandle(res);
        });
      }
      if (this.prePrintValidation()) {
        this.$confirm({
          content: this.$t("msg_notice_551"),
          onOk: eCommand
        });
      }
    },
    async exportExcel () {
      //var sendData = Object.assign(this.head, this.formData, { totalCount: -1, paging: false });
      //var [err, res] = await this.$to(API.AGetListPI(sendData)); if (err) { return false; }
      //var data = res.data
      //var excelList = this.tree2List(data.binList || [])
      var excelList = this.todoList
      //console.log('this.todoList',this.todoList)
      this.$refs.sTable.exportData({
        filename: 'Pick Task List',
        type: 'csv',
        isHeader: true,
        isFooter: true,
        data: excelList
      })
    }
  }
}

</script>
