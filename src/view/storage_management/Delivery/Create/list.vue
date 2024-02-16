<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-19 10:40:01
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-11 12:58:35
 * @Description: description
 -->
<template>
  <div class="modal-body no-padding h100">
    <div class="i-box clearfix h100 x-height-table">
      <x-search-header @on-search="enterSearch">
        <!-- <template slot="head">
          <ButtonGroup>
            <Button icon="ios-search" @click="search" :disabled="!formData.soCode">{{ $t('btn_find') }}</Button>
          </ButtonGroup>
        </template> -->
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

          <search-in flex v-show="this.groupBtn.buttonSubmit" :title="$t('DeliverDate')" required>
            <DatePicker type="date" format="yyyy-MM-dd HH:mm:ss" placeholder="Receive Date" style="width: 200px" @on-change="receiveDateChange"></DatePicker>
          </search-in>

          <Button icon="ios-search" @click="search">{{ $t('btn_find') }}</Button>
          <!-- <Button icon="ios-cloud-upload-outline" @click="exportExcel"> {{ $t('export_to_excel') }} </Button> -->
          <!-- <Button icon="ios-cloud-upload-outline" @click="printpage"> {{ $t('export_to_excel') }} </Button> -->
        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16" style="height:calc(100% - 220px);">
      <Tabs v-model="tabVisible" class="h100" @on-click="tabClickHandle">
        <TabPane :label="p1Label" name="p1">
          <!-- <div id="printContent" class="h100 x-height-table"> -->
          <!-- <section id="content_wrap" class="h100"> -->
          <vxe-table ref="tTable" :sync-resize="tabVisible" :data="todoList" height="auto" stripe show-overflow resizable row-id="xid" highlight-cell :checkbox-config="{ reserve: true, highlight: true }" @checkbox-change="selectionChangeT" @checkbox-all="selectionChangeT">
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
            <!-- <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
            <vxe-table-column min-width="120" field="receiptCode" :title="$t('DNumber')"></vxe-table-column>
            <vxe-table-column min-width="100" field="matCode" title="Item"></vxe-table-column>
            <vxe-table-column min-width="60" field="matExt1" title="UPC"></vxe-table-column>
            <vxe-table-column min-width="100" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext3" title="MfgID"></vxe-table-column>
            <vxe-table-column min-width="60" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext7" :title="$t('prddate')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext8" :title="$t('expdate')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
            <vxe-table-column min-width="60" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <!-- <vxe-table-column min-width="60" field="receiptQty" :title="$t('Qty')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="200" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="ext0" :title="$t(' VIN # or S/N ')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
            <vxe-table-column min-width="60" field="weightQty" title="NTD Qty"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext12" :title="$t('Shopify#')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext15" :title="$t('carrier')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext16" :title="$t('tracking#')"></vxe-table-column>
            <vxe-table-column min-width="60" field="qty" :title="$t('QtyB')">
              <template v-slot="{ row }">
                <Icon size="24" type="md-apps" class="success" @click="allocationHandle(row)" />
              </template>
            </vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
          </vxe-table>
          <!-- </section> -->
        <!-- </div> -->
        </TabPane>
        <!-- <vxe-table ref="sTable" v-show=false>
            <vxe-table-column min-width="200" field="receiptCode" :title="$t('DNumber')"></vxe-table-column>
            <vxe-table-column min-width="160" field="matCode" title="Item"></vxe-table-column>
            <vxe-table-column min-width="200" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
            <vxe-table-column min-width="180" field="weightQty" title="NTD Qty"></vxe-table-column>
            <vxe-table-column min-width="180" field="weightQty" :title="$t('QtyB')"></vxe-table-column>
            <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
          </vxe-table> -->
        <TabPane :label="p2Label" name="p2">
          <vxe-table ref="sTable" :sync-resize="tabVisible" :data="savedList" height="auto" stripe show-overflow resizable row-id="xid" highlight-cell :checkbox-config="{ reserve: true, highlight: true }" @checkbox-change="selectionChangeS" @checkbox-all="selectionChangeS">
            <vxe-table-column type="checkbox" width="60"></vxe-table-column>
             <!-- <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
            <vxe-table-column min-width="120" field="receiptCode" :title="$t('DNumber')"></vxe-table-column>
            <vxe-table-column min-width="100" field="matCode" title="Item"></vxe-table-column>
            <vxe-table-column min-width="60" field="matExt1" title="UPC"></vxe-table-column>
            <vxe-table-column min-width="100" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext3" title="MfgID"></vxe-table-column>
            <vxe-table-column min-width="60" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext7" :title="$t('prddate')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext8" :title="$t('expdate')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
            <vxe-table-column min-width="60" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <!-- <vxe-table-column min-width="200" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="ext0" :title="$t(' VIN # or S/N ')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
            <vxe-table-column min-width="60" field="weightQty" title="NTD Qty"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext12" :title="$t('Shopify#')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext15" :title="$t('carrier')"></vxe-table-column>
            <vxe-table-column min-width="60" field="ext16" :title="$t('tracking#')"></vxe-table-column>
            <vxe-table-column min-width="60" field="qty" :title="$t('QtyB')">
              <template v-slot="{ row }">
                <Icon size="24" type="md-apps" class="success" @click="allocationHandle(row)" />
              </template>
            </vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
          </vxe-table>
        </TabPane>
      </Tabs>
      </Col>

      <div class="fixed-bottom">
        <button-expand :btnGroup="groupBtn" @on-ok="btnHandle" />
      </div>
    </div>

    <ship :drawer.sync="isShip" @on-ok="shipHandle" />

    <!-- 配货 -->
    <allocation :drawer.sync="isAllocation" :row="row" />
  </div>
</template>

<script>
import { API } from '@A/warehouse/Delivery'
import { CAPI } from '@A/common'
// 按钮逻辑
import ButtonExpand from '_c/btnGroup/ButtonExpandBus.vue'
// 车辆选择
import ship from './ship.vue'
// 配货
import allocation from './allocation.vue'

export default {
  components: { ButtonExpand, ship, allocation },
  data () {
    return {
      data3: [],
      isShip: false,
      row: {}, // 选中行数据
      isAllocation: false, // 配货弹窗
      curr: 0,
      tabVisible: 'p1',
      p1Label: (h) => {
        return h('div', [h('span', 'TODO LIST'), h('Badge', { props: { count: this.todoList.length } })])
      },
      p2Label: (h) => {
        return h('div', [h('span', 'SAVED'), h('Badge', { props: { count: this.savedList.length } })])
      },
      dcList: [], //订单列表
      cropList: [], // 公司下拉
      // receiptType: [201,203,204],
      todoList: [],
      savedList: [],
      completeList: [],
      selectionTodo: [],
      selectionSaved: [],
      queryParameter:
      {
        pageIndex: 1,
        pageSize: 100,
        create: false,
        paging: false ,
        receiptStatusList: [90],
        receiptType: 201
      },
      formData: {
        soType: 201,
        corpCode: '',
        soCode: '',
        create: true,
        whCode: '',      //2021-10-07 新加
        receiveDate: ''
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
    var id = this.$route.params.id
    var type = this.$route.params.type
    //this.getAllTodoList()
    if(typeof(id) != "undefined" && typeof(type) != "undefined"){
      //console.log("id=",id)
      //id=id.replace(new RegExp(/(:)/g),"");
      this.formData.soCode = id
      this.formData.soType = parseInt(type)
      this.getData()
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
    //获取订单列表
    async getDCList (receiptType) {
      this.queryParameter.receiptType = receiptType
      var [err, res] = await this.$to(API.AGetAllList( this.queryParameter )); if (err) { return false }
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
    // 获取列表
    async getData () {
      this.formData.whCode = this.$store.getters.UserCropCode  //2021-10-07 新加
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 })
      var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
      var creteOutputVos = res.data.creteOutputVos || []
      var viewOutputVos = res.data.viewOutputVos || []
      this.todoList = this.formatData(creteOutputVos)
      this.savedList = this.formatData(viewOutputVos)
      this.selectionTodo = []
      this.selectionSaved = []
    },
    async getAllTodoList () {
      var _ = require('lodash');
      var tmp = _.cloneDeep(this.formData)
      var index
      for(index in this.receiptType){
        tmp.receiptType = tmp.soType = this.receiptType[index]
        tmp.create = true
        tmp.soCode = '%'
        //console.log('tmp.receiptType=\n',tmp.receiptType)
        //console.log('tmp=',tmp)

        var sendData = Object.assign(this.head, tmp, { totalCount: -1 })
        //console.log('senddata=\n',sendData)
        var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
        var creteOutputVos = res.data.creteOutputVos || []
        //console.log('data = \n',data)
        if(creteOutputVos.length != 0){
          var tmpList = this.formatData(creteOutputVost)
          for(var i in tmpList){
            this.todoList.push(tmpList[i]);
            //console.log('this.todolist = \n',this.todoList)
          }
        }
      }
      //this.savedList = data.resultMap.savedList || []
      //this.completeList = data.resultMap.completeList || []
      this.selectionTodo = []
      this.selectionSaved = []
    },
    receiveDateChange(date){
      this.formData.receiveDate = date
    },
    // 添加索引
    formatData (list, disabled) {
      return list.map(function (item, i) {
        item.xIndex = i;
        // item.binCodes = item.sinobecStocks.map((binItem) => { return binItem.binCode }).join(';')
        return item
      })
    },
    // 获取公司列表
    // async getCropList () {
    //   var [err, res] = await this.$to(CAPI.AGetCropList()); if (err) { return false }
    //   this.cropList = this.$kv(res.data, 'corpCode', 'corpName', true)
    // },
    async saveOrder (traillerNumber) {
      var selectionTodo = this.selectionTodo.map(function (item) {
        item.traillerNumber = traillerNumber
        return item
      })
      //selectionTodo[0].weightQty=1;
      var [err, res] = await this.$to(API.ASave(selectionTodo)); if (err) { return false }
      this.successHandle(res)
    },
    async submitOrder (traillerNumber) {
      if(traillerNumber!=null && traillerNumber != ''){
        var tmpSaveList = this.savedList.map(function (item) {
          item.traillerNumber = traillerNumber
          return item
        })
      }
      if(typeof(this.formData.receiveDate)!="undefined" && this.formData.receiveDate.length > 0 ){
        for(var i=0; i < this.savedList.length ;i++){
          this.savedList[i].createTime = this.formData.receiveDate
          this.savedList[i].modifyTime = this.formData.receiveDate
        }
      }
      var [err, res] = await this.$to(API.ASubmit(tmpSaveList)); if (err) { return false }
      this.$Notice.success({ desc: res.returnMsg })
      this.todoList = []
      this.savedList = []
      this.selectionTodo = []
      this.selectionSaved = []
    },
    async submitOrde1 (traillerNumber) {
      var selectionTodo = this.selectionTodo.map(function (item) {
        item.traillerNumber = traillerNumber
        return item
      })

      var [err, res] = await this.$to(API.ASubmit(selectionTodo)); if (err) { return false }
      this.$Notice.success({ desc: res.returnMsg })
      this.todoList = []
      this.savedList = []
      this.selectionTodo = []
      this.selectionSaved = []
      this.formData.soType = ''
    },
    async deleteOrder () {
      var [err, res] = await this.$to(API.ADelete(this.selectionSaved)); if (err) { return false }
      this.successHandle(res)
    },
    // 成功回调
    successHandle (res) {
      this.$Notice.success({ desc: res.returnMsg })
      this.getData()
    },
    // 提交保存
    submitSave () {
      // if (!this.preSaveValidation()) {
      //   return false
      // }
      if(this.head.soType!=203){
      this.isShip = true
      }else{
        this.$confirm({
        content: this.$t('msg_notice_26'),
        onOk: () => {
          this.submitOrder("")
        }
        })
      }
    },
    isAllEqual(array) {
      if (array.length > 0) {
        return !array.some(function(value, index) {
            return value.traillerNumber !== array[0].traillerNumber;
        });
      } else {
        return true;
      }
    },
    getTraillerNumber(){
      if(this.isAllEqual(this.savedList)){
        //console.log('all traillerNumber are equal')
        this.traillerNumber = this.savedList[0].traillerNumber
      }else{
        //console.log('not all traillerNumber are equal')
        this.traillerNumber = ''
      }
    },
    // 提交提交
    submitSubmit () {
      if (!this.preCommitValidation()) {
        return false
      }
      this.getTraillerNumber()
      this.isShip = true
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
          //this.submitSave()
          break
        case 'buttonSubmit':
          if(this.selectionTodo.length != this.todoList.length){
            this.$Notice.warning({ desc: this.$t('msg_notice_354') })
            return false
          }
          this.submitSubmit()
          //this.submitSave()
          // if (this.preCommitValidation()) {
          //   this.$confirm({
          //     content: this.$t('msg_notice_26'),
          //     onOk: () => {
          //       this.submitOrder()
          //     }
          //   })
          // }
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
    // 提交之前选择车辆
    shipHandle (traillerNumber) {
      this.$confirm({
        content: this.$t('msg_notice_26'),
        onOk: () => {
          //this.saveOrder(traillerNumber)
          this.submitOrder(traillerNumber)
        }
      })
    },
    // 配货
    allocationHandle (row) {
      this.row = row
      this.curr = row.xIndex
      this.isAllocation = true
    },
    search () {
      if(!this.formData.soCode){
        this.groupBtn.buttonSave = false;
        this.groupBtn.buttonSubmit = false;
        this.groupBtn.buttonDelete = false;
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
        this.groupBtn.buttonSubmit = false;
        this.groupBtn.buttonDelete = false;
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
    printpage() {
      let newstr = document.getElementById("printContent").innerHTML;
      let oldstr = document.body.innerHTML;
      document.body.innerHTML = newstr;
      window.print();
      document.body.innerHTML = oldstr;
      return false;
    },
    exportExcel () {
      var excelList = this.todoList
      //console.log('excelList=',excelList)
      this.$refs.sTable.exportData({
        filename: 'Deliver Task List',
        type: 'csv',
        isHeader: true,
        isFooter: true,
        data: excelList
      })
    }
  }
}

</script>

<!--<style scoped>
@page {
    /* size: landscape; */
     margin: 0;

}
@media print{
  #content_wrap {
        width: 1200px !important;
        /*布局的时候，为了给侧边栏留位置，给主体内容加了margin-left，现在需要去掉。*/
        margin-left: 0 !important;
    }
}
body {
    margin: 1cm;
  }
</style>-->
