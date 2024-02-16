<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-19 10:40:01
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-11 13:02:18
 * @Description: description
 -->
<template>
  <div class="modal-body no-padding h100">
    <div class="i-box clearfix h100 x-height-table">
      <x-search-header @on-search="enterSearch">
        <template slot="head">
          <!-- <ButtonGroup> -->
            <!-- <Button icon="ios-search" @click="search" :disabled="!(formData.bundleCode || formData.receiptCode)">{{ $t('btn_find') }}</Button> -->
            <!-- <Button min-width="160" icon="ios-print-outline"  class="buttonPrint"  @click="printMatLabel">{{ $t("btn_print") }}</Button> -->
          <!-- </ButtonGroup> -->
        </template>
        <template slot="body">
          <!-- <search-in flex :title="$t('lbl_wh_code')" required>
            <Select v-model="formData.whCode" clearable @on-change="whChange">
              <Option v-for="(item, i) in whList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select>
          </search-in> -->
          <!-- <search-in flex :title="$t('Lotnumb')">
            <Input type="text" v-model="formData.bundleCode" :maxlength="60" />
          </search-in> -->
          <search-in flex :title="$t('DNumber')">
            <!-- <Input type="text" v-model="formData.receiptCode" :maxlength="20" /> -->
            <!-- <Select v-model="formData.receiptCode" clearable @on-change="DCChange">
              <Option v-for="(item, i) in dcList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select> -->
            <AutoComplete clearable v-model="formData.receiptCode" :data="data3" :filter-method="filterMethod" style="width:200px"></AutoComplete>
          </search-in>
          <Button icon="ios-search" @click="search">{{ $t('btn_find') }}</Button>
          <!-- <Button icon="ios-cloud-upload-outline" @click="exportExcel"> {{ $t('export_to_excel') }} </Button> -->
        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16" style="height:calc(100% - 220px);">
      <Tabs v-model="tabVisible" class="h100" @on-click="tabClickHandle">
        <TabPane label="TODO LIST" name="p1">
          <vxe-table ref="tTable" :sync-resize="tabVisible" :data="todoList" height="auto" stripe show-overflow resizable row-id="_XID" highlight-cell :edit-config="{ trigger: 'click', mode: 'cell' }" :checkbox-config="{ reserve: true, highlight: true }" @checkbox-change="selectionChangeT" @checkbox-all="selectionChangeT">
            <vxe-table-column type="checkbox" width="30"></vxe-table-column>
            <vxe-table-column width="30">
              <template slot-scope="scope">
                <Icon size="20" type="md-add-circle" v-if="scope.row.flag"  @click="addRow(scope.row,scope)" />
                <Icon size="20" type="md-remove-circle" v-if="!scope.row.flag"  @click="removeRow(scope.row)" />
              </template>
            </vxe-table-column>
            <vxe-table-column min-width="130" field="weightQty" :title="$t('QtyO')">
              <template v-slot="{ row }">
                <el-input-number :disabled="row.flag" v-model="row.weightQty" :min="1" :max="row.xQty" @change="unpackChange(row)"></el-input-number>
              </template>
            </vxe-table-column>
            <vxe-table-column min-width="100" field="targetBinCode" :title="$t('SugLoc')" :edit-render="{ name: 'default' }">
              <template v-slot="{ row }">
                <span :class="row.targetBinCodeClassName">{{ row.targetTypeCode }} / {{ row.targetBinCode }}</span>
              </template>
              <template v-slot:edit="scope">
                <Select v-model="scope.row.targetBinCode" transfer filterable @on-change="function (value) { binCodeChangeHandle(value, scope) }" @change="$refs.detailTable.updateStatus(scope)" label-in-value clearable>
                  <Option v-for="(item, i) in binCodeListReturn" :value="item.binCode" :key="item.label">{{ item.label }}</Option>
                </Select>
              </template>
            </vxe-table-column>
            <!-- <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
            <vxe-table-column min-width="100" field="matCode" title="Item"></vxe-table-column>
            <vxe-table-column min-width="100" field="matExt1" title="UPC"></vxe-table-column>
            <vxe-table-column min-width="100" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
            <vxe-table-column min-width="120" field="ext0" :title="$t(' Shipping Ref#')"></vxe-table-column>
            <!-- <vxe-table-column min-width="60" field="vendorCode" title="MfgID"></vxe-table-column> -->
            <vxe-table-column min-width="60" field="ext3" title="MfgID"></vxe-table-column>
            <vxe-table-column min-width="60" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext7" :title="$t('prddate')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext8" :title="$t('expdate')"></vxe-table-column>
            <vxe-table-column min-width="100" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
            <vxe-table-column min-width="60" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <vxe-table-column min-width="110" field="receiptQty" :title="$t('ReceiptQty')"></vxe-table-column>
            <!-- <vxe-table-column min-width="80" field="actualWeightQty" :title="$t('ActQty')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="200" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->
            <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <vxe-table-column min-width="180" field="weightQty" :title="$t('Qty')"></vxe-table-column>
            <vxe-table-column min-width="200" field="receiptCode" :title="$t('DNumber')"></vxe-table-column>
            <vxe-table-column min-width="70" field="ext14" :title="$t('RF#')"></vxe-table-column>
            <!-- <vxe-table-column min-width="180" field="whCode" :title="$t('lbl_wh_code')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
            <!-- <Button type="primary" class="left ml10" :disabled="auditing" v-if="index==0" @click="addnormal1">+</Button> -->

          </vxe-table>
        </TabPane>
        <vxe-table ref="sTable" v-show=false>
          <vxe-table-column min-width="160" field="weightQty" :title="$t('QtyO')"></vxe-table-column>
          <vxe-table-column min-width="180" field="targetBinCode" :title="$t('SugLoc')" :edit-render="{ name: 'default' }"></vxe-table-column>
          <vxe-table-column min-width="160" field="matCode" title="Item"></vxe-table-column>
          <vxe-table-column min-width="200" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
          <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
          <vxe-table-column min-width="180" field="weightQty" :title="$t('Qty')"></vxe-table-column>
          <vxe-table-column min-width="200" field="receiptCode" :title="$t('DNumber')"></vxe-table-column>
          <vxe-table-column min-width="180" field="whCode" :title="$t('lbl_wh_code')"></vxe-table-column>
        </vxe-table>
        <!-- <TabPane label="SAVED" name="p2">
          <vxe-table ref="sTable" :sync-resize="tabVisible" :data="savedList" height="auto" stripe show-overflow resizable row-id="_XID" highlight-cell :checkbox-config="{ reserve: true, highlight: true }" @checkbox-change="selectionChangeS" @checkbox-all="selectionChangeS">
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
            <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column>
            <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column>
            <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <vxe-table-column min-width="180" field="weightQty" :title="$t('Qty')"></vxe-table-column>
            <vxe-table-column min-width="180" field="targetBinCode" :title="$t('SugLoc')">
              <template v-slot="{ row }">
                <span>{{ row.targetTypeCode }} / {{ row.targetBinCode }}</span>
              </template>
            </vxe-table-column>
          </vxe-table>
        </TabPane> -->
      </Tabs>
      </Col>

      <div class="fixed-bottom">
        <button-expand :btnGroup="groupBtn" @on-ok="btnHandle" />
      </div>
    </div>
  </div>
</template>

<script>
import { API } from '@A/warehouse/PutAway'
import { CAPI } from '@A/common'
// 按钮逻辑
import ButtonExpand from '_c/btnGroup/ButtonExpandBus.vue'

import { batchDelete } from '@/libs/assist'
import calculate from '@/libs/precision'

export default {
  components: { ButtonExpand },
  data () {
    return {
      data3: [],
      tabVisible: 'p1',
      binCodeList: [], // 仓位下拉
      binCodeListReturn: [], // 仓位下拉
      receiptType: [101,102,104],
      todoList: [],
      savedList: [],
      completeList: [],
      selectionTodo: [],
      selectionSaved: [],
      whList: [],
      dcList: [],
      formData: {
        whCode: '',
        corpCode: '',
        receiptCode: '',
        bundleCode: ''
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
    this.getWhList()
    this.getDCList()
    this.getBinList()
    var id = this.$route.query.id
    if(typeof(id) != "undefined"){
      this.formData.receiptCode = id
      this.getData()
    }
    //this.getAllTodoList()
  },
  methods: {
    // getRemainQty(row){
    //   var remainQty = 0
    //   var alreadySepQty = 0
    //   var xQty = 0
    //   this.todoList.forEach(item=>{
    //     if( row.groupID===item.groupID ){//所有子节点
    //       if(row.flag == false){
    //         //console.log('add alreayd sep qty',item.weightQty)
    //         alreadySepQty = alreadySepQty+item.weightQty//遍历列表把所有用户输入的qty加起来 计算出已经分配出的数量
    //       }else{ //父节点的 xQty 应该是总数量
    //         //console.log('item.xQty=\n',item.xQty)
    //         xQty = item.xQty
    //       }
    //     }
    //   })
    //   remainQty = xQty - alreadySepQty
    //   //console.log('remainQty=\n',remainQty)
    //   return remainQty
    // },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    getTotalQty(row){
      //console.log('getTotalQty row=\n',row)
      //console.log('this.todolist=\n',this.todoList)
      var totalQty = 0
      this.todoList.forEach(item=>{
        if( row.groupID===item.groupID ){
          totalQty = totalQty+item.weightQty
        }
      })
      //console.log('totalQty=',totalQty)
      return totalQty
    },
    // getAlreadySepQty(row){// row 是父节点
    //   var alreadySepQty = 0
    //    this.todoList.forEach(item=>{
    //     if(row._XID===item.groupID && row.flag == false){
    //       console.log('add alreayd sep qty',item.weightQty)
    //       alreadySepQty = alreadySepQty+item.weightQty
    //     }
    //   })
    //   console.log('alreadySepQty=\n',alreadySepQty)
    //   return alreadySepQty
    // },
    addRow(row, scope) {
      //console.log('scope.rowIndex=\n',scope.rowIndex)
      if(row.weightQty <= 1){
        return
      }
      var _ = require('lodash');
      var b = _.cloneDeep(row);

      //设置新节点属性
      b.weightQty = 1 //新的子节点默认qty为1
      b._XID = ''     //新节点自动生成ID
      b.groupID = row._XID
      b.parent = row._XID
      b.flag = false //false表示是子节点
      b.disableEdit = false //子节点可以编辑
      b.xQty =  row.xQty-1//设置新行的最大值为 父行最大值减去已经分配出去的值

      //设置父节点属性
      row.weightQty = row.weightQty-1
      //this.todoList.push(b)
      this.todoList.splice(scope.rowIndex+1,0,b)
    },
    removeRow(row){
      var _ = require('lodash');
      _.pull(this.todoList, row);
      var arr = []//新数组
      this.todoList.forEach(item=>{
            if(row.parent === item._XID){
              //item.weightQty = calculate.plus(item.weightQty, weightQty)
              item.weightQty = item.weightQty + row.weightQty
              //item.receiptQty= item.receiptQty+row.receiptQty
            }
          arr.push(item)
      })
      this.todoList = arr //相当于返回一个新数组可以触发渲染
    },
    unpackChange(row){
      var checkQty = 0
      var pWQty = 0
      this.todoList.forEach(item=>{
        if(row.groupID===item._XID){//找到父节点 item 是父节点
          checkQty = item.xQty - this.getTotalQty(row)//计算父节点的wqyt
          if(checkQty>=1){
            item.weightQty = checkQty
            pWQty = item.weightQty
          }
          else{
            return
          }
        }
      })
      //更新所有行的上限
      //console.log('pwqty=',pWQty)
      this.todoList.forEach(item=>{
        if( row.groupID===item.groupID ){
          item.xQty = item.weightQty+pWQty-1
          //console.log('item.xQty=',item.xQty)
        }
      })

      var arr = []//新数组
      this.todoList.forEach(item=>{
          arr.push(item)
      })
      this.todoList = arr //相当于返回一个新数组可以触发渲染
    },
    enterSearch () {
      if (!(formData.bundleCode || formData.receiptCode)) {
        return false
      }
      this.getData()
    },
    setOrgFlag(arry){
      var arryNew = []
      arry.map((item, index) => {
        item.flag=true
        item.disableEdit=false
        item.xQty = item.weightQty
        item.alreadySepQty = 0
        //console.log('item.xQty=\n',item.xQty)
        return item
      })
    },
    // 获取列表
    async getData () {
      this.todoList = []
      // console.log('this.formData=\n',this.formData)
      this.formData.whCode = this.$store.getters.UserCropCode     //2021-10-07  修改赋值, 原值:"PS"
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 })
      var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
      var taskList = res.data.taskList || []

      var listAll = this.todoList.concat(this.savedList) // 所有数据 没有查询累加
      this.setOrgFlag(taskList)
      this.todoList = this.getDifferenceSet(taskList, listAll, 'stockId')
    },

    async getAllTodoList () {
      var _ = require('lodash');
      var tmpData = _.cloneDeep(this.formData)
      var index
      this.dcList.forEach(
        //console.log('this.dcList[index].value=\n',this.dcList[index].value)
        // tmpData.receiptCode = this.dcList[index].value
        // var sendData = Object.assign(this.head, this.formData, { totalCount: -1 })
        // var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
        // var taskList = res.data.taskList || []

        // var listAll = this.todoList.concat(this.savedList) // 所有数据 没有查询累加
        // this.setOrgFlag(taskList)
        // //this.todoList = this.getDifferenceSet(taskList, listAll, 'stockId')
        // var tmp = this.getDifferenceSet(taskList, listAll, 'stockId')
        // if(tmp.length!=0){
        //   this.todoList.concat(tmp)
        // }
      )
    },
    getDifferenceSet (arr2, arr1, _key) {
      var list = this.todoList
      for (var i = 0; i < arr2.length; i++) {
        var flag = true;
        for (var j = 0; j < arr1.length; j++) {
          if (arr2[i][_key] === arr1[j][_key]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          list.unshift(arr2[i]); // 新查出的元素置顶
        }
      }

      return list
    },
    // 获取全集仓位
    async getBinList () {
      var [err, res] = await this.$to(CAPI.AGetBinList(this.formData.whCode)); if (err) { return false }
      var binList = res.data.binList || []
      this.binCodeListReturn = binList.map(function (item) {
        return {
          binCode: item.binCode,
          typeCode: item.typeCode,
          label: `${item.typeCode}/${item.binCode}`
        }
      })
    },
    // 仓库号查询
    async getWhList () {
      var [err, res] = await this.$to(API.AGetWhlist()); if (err) { return false }
      //console.log('whheadlist=\n',res.data)
      this.whList = this.$kv(res.data.headList, 'whCode', 'whName', true)
      //console.log(this.whList)
      this.formData.whCode = this.whList[0].value
    },
    //获取全部订单
    async getDCList () {
      var [err, res] = await this.$to(API.AGetDClist()); if (err) { return false }
      this.dcList = this.$kv(res.data.list, 'receiptCode', 'receiptCode', false)
      this.data3 = []
      this.dcList.map(item=>this.data3.push(item.value))
      // var _ = require('lodash');
      // var tmpData = _.cloneDeep(this.formData)
      // console.log('this.dcList=\n',this.dcList)
      // var index
      // console.log(this.dcList.length)
      // for(index in this.dcList){
      //   console.log('this.dcList[index].value=\n',this.dcList[index].value)
      //   tmpData.receiptCode = this.dcList[index].value
      //   var sendData = Object.assign(this.head, tmpData, { totalCount: -1 })
      //   var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
      //   var taskList = res.data.taskList || []

      //   var listAll = this.todoList.concat(this.savedList) // 所有数据 没有查询累加
      //   this.setOrgFlag(taskList)
      //   //this.todoList = this.getDifferenceSet(taskList, listAll, 'stockId')
      //   var tmp = this.getDifferenceSet(taskList, listAll, 'stockId')
      //   if(tmp.length!=0){
      //     this.todoList.concat(tmp)
      //   }
      // }
    },
    // 成功回调
    successHandle (res) {
      this.$Notice.success({ desc: res.returnMsg })
      this.savedList = batchDelete(this.savedList, this.selectionSaved, 'stockId')
      this.selectionSaved = []
    },
    async submitOrder () {
      var [err, res] = await this.$to(API.ASubmit(this.selectionTodo)); if (err) { return false }
      this.successHandle(res)
      //console.log("this.todoList.length",this.todoList.length)
      //console.log("this.selectionTodo.length",this.selectionTodo.length)
      if(this.todoList.length-this.selectionTodo.length>0){
        this.getData()
      }else{
        this.getDCList()
        this.formData.receiptCode = ""
        this.todoList= []
      }

      //this.todoList= []
    },
    // validation
    async checkBinWeight (scope) {
      var list = this.todoList.concat(this.savedList)
      var [err, res] = await this.$to(API.ACheckBinWeight(list)); if (err) { return false }
      if (res.data) {
        this.$confirm({
          content: 'exceed max weight, continue or not',
          onOk: () => { }
        })
      }
    },
    // to-do LIST 保存
    // saveOrder () {
    //   this.todoList = batchDelete(this.todoList, this.selectionTodo, 'stockId')
    //   for (var i = 0; i < this.selectionTodo.length; i++) {
    //     this.selectionTodo[i]._XID = ''
    //     this.savedList.push(this.selectionTodo[i])
    //   }
    //   this.selectionTodo = []
    // },
    // to-do LIST 删除
    deleteTodoList () {
      this.todoList = batchDelete(this.todoList, this.selectionTodo, 'stockId')
    },
    // SAVED 删除
    deleteSaved () {
      this.savedList = batchDelete(this.savedList, this.selectionSaved, 'stockId')
      for (var i = 0; i < this.selectionSaved.length; i++) {
        this.selectionSaved[i]._XID = ''
        this.todoList.push(this.selectionSaved[i])
      }
      this.selectionSaved = []
    },
    // 仓库号下拉改变方法
    whChange (whCode) {
      this.formData.whCode = whCode || ''
      this.formData.typeCode = ''
      // 根据仓库号查询仓位下拉
      whCode && this.getBinList()
    },
    // 订单号下拉改变方法
    DCChange (receiptCode) {
      this.formData.receiptCode = receiptCode || ''
      this.formData.typeCode = ''
      // 根据仓库号查询仓位下拉
      //whCode && this.getBinList()
    },
    // 保存校验
    preSaveValidation () {
      if (!this.selectionTodo.length) {
        this.$Notice.warning({ desc: this.$t('msg_notice_145') })
        return false
      }
      return true
    },
    // 提交校验
    preCommitValidation () {
      if (!this.selectionSaved.length) {
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
        // case 'buttonSave':
        //   if (this.preSaveValidation()) {
        //     this.$confirm({
        //       content: this.$t('msg_notice_27'),
        //       onOk: () => {
        //         this.saveOrder()
        //       }
        //     })
        //   }
        //   break
        case 'buttonSubmit':
          if (this.preSaveValidation()) {
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
                this.deleteSaved()
              }
            })
          }
          break
        default:
          return false
      }
    },
    search () {
      if(!(this.formData.bundleCode || this.formData.receiptCode)){
        this.groupBtn.buttonSubmit = false;
      }else{
        this.groupBtn.buttonSubmit = true;
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
    // binCode切换
    binCodeChangeHandle (value, scope) {
      if (value) {
        var binInfo = value.label.split('/')
        scope.row.targetTypeCode = binInfo[0]
        // this.checkBinWeight(scope)
      } else {
        scope.row.targetTypeCode = ''
      }
    },
    // Tab切换
    tabClickHandle (name) {
      if (name === 'p1') {
        this.groupBtn.buttonSave = false
        this.groupBtn.buttonSubmit = true
        this.groupBtn.buttonDelete = false
      } else {
        // this.groupBtn.buttonSave = false
        // this.groupBtn.buttonSubmit = true
        // this.groupBtn.buttonDelete = true
      }
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
    exportExcel () {
      var excelList = this.todoList
      //console.log('excelList=',excelList)
      this.$refs.sTable.exportData({
        filename: 'PutAway Task List',
        type: 'csv',
        isHeader: true,
        isFooter: true,
        data: excelList
      })
    }
  }
}

</script>
