<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-14 18:33:06
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-30 15:39:09
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
                  <!--classicbrand 新增的 输入sap doc #的文本框-->
                  <!-- <FormItem :label="$t('DNumber')" required>
                    <div v-if="disableEdit">{{ documentNumber }}</div>
                    <div v-else>
                      <Input v-model="documentNumber" :maxlength="20"/>
                    </div>
                  </FormItem> -->
                  <FormItem :label="$t('DNumber')">{{ documentNumber }}</FormItem>
                  <FormItem :label="$t('lbl_stock_take_type_name')" required>{{ $t('msg_notice_260') }}
                    <!-- <div v-if="disableEdit">{{ head.stockTakeTypeName }}</div> -->
                    <!-- <div v-else> -->
                      <!-- <Select v-model="head.stockTakeType" transfer @on-change="stockTakeTypeChangeHandle"> -->
                        <!-- <Option :value="1">{{ $t('msg_notice_259') }}</Option>
                        <Option :value="2">{{ $t('msg_notice_260') }}</Option> -->
                        <!-- <Option :value="2">{{ $t('msg_notice_260') }}</Option> -->
                      <!-- </Select> -->
                    <!-- </div> -->
                  </FormItem>
                  <!-- <FormItem :label="$t('lbl_inventory_data')" required>
                    <span v-if="disableEdit">{{ head.stockTakeDate }}</span>
                    <DatePicker v-else :disabled="disableEdit" :value="head.stockTakeDate" type="date" transfer @on-change="stockTakeDateChangeHandle" :editable="false"></DatePicker>
                  </FormItem> -->
                  <FormItem :label="$t('lbl_stock_take_mode_name')">
                    <RadioGroup v-model="head.stockTakeMode">
                      <Radio :label="1" :disabled="disableEdit">{{ $t('sel_open_plate') }}</Radio>
                      <Radio :label="2" :disabled="disableEdit">{{ $t('sel_blind_plate') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <!-- <FormItem :label="$t('lbl_freeze_stock_take_name')">
                    <i-switch v-model="head.freezeStockTake" :true-value="1" :false-value="0" :disabled="disableEdit" size="small"></i-switch>
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
          <Col span="24" class="margin-t-16" v-if="!disableEdit">
          <Form :model="head" :label-width="140" inline label-colon>
            <FormItem flex :label="$t('Zone')">
              <Input type="text" v-model="formData.typeCode" />
            </FormItem>

            <FormItem flex :label="$t('LocationCode')">
              <Input type="text" v-model="formData.binCode" />
            </FormItem>

            <!-- <FormItem flex :label="$t('Date')">
              <DatePicker type="daterange" split-panels @on-change="dateChangeHandle"></DatePicker>
            </FormItem> -->

            <buttonGroup>
              <!-- <Button v-if="this.documentNumber.length === 0" icon="md-add" @click="getStorageBinList" :disabled="addDisabled">{{ $t('btn_add') }}</Button>? -->
              <Button v-if="this.documentNumber.length === 0" icon="ios-search" @click="getStorageBinList" :disabled="addDisabled">{{ $t('btn_find') }}</Button>
              <Button v-if="this.documentNumber.length === 0" icon="ios-trash" @click="delStorageBinList">{{ $t('btn_delete') }}</Button>
              <Button icon="ios-infinite" @click="changePIvUser">{{ $t('btn_change_person_now') }}</Button>
            </buttonGroup>
            <!-- 周期盘点 -->
            <!-- typeCode - binCode -->
            <!-- <FormItem v-if="this.documentNumber.length === 0" :label="$t('LocationCode')" v-show="head.stockTakeType == 2" class="margin-b-0">
              <!-- <Poptip trigger="focus" content="xx/xx-xx-xx">
                <AutoComplete :data="binCodeList" :filter-method="binFilterMethod" @on-change="binCodeChangeHandle"></AutoComplete>
              </Poptip> -->
              <!-- <AutoComplete clearable :data="binCodeList" :filter-method="binFilterMethod" @on-change="binCodeChangeHandle"></AutoComplete>
            </FormItem> -->


            <!-- 动态盘点 -->
            <FormItem :label="$t('lbl_begin_date')" v-show="head.stockTakeType == 1" class="margin-b-0">
              <DatePicker :disabled="disableEdit" :value="[head.beginDate, head.endDate]" type="daterange" transfer @on-change="moveDateChangeHandle" :editable="false"></DatePicker>
            </FormItem>

            <!-- <FormItem label="Mat Group" v-show="head.stockTakeType == 1" class="margin-b-0">
              <Select v-model="head.matGroupCode" style="width: 150px;" clearable>
                <Option value="EX" label="EX"></Option>
                <Option value="SH" label="SH"></Option>
                <Option value="BI" label="BI"></Option>
                <Option value="CO" label="CO"></Option>
              </Select>
            </FormItem> -->
          </Form>
          </Col>

          <Col span="24" class="margin-t-16">
          <vxe-table ref="detailTable" :data="itemList" row-id="uid" max-height="450" stripe show-overflow="title" resizable highlight-cell @checkbox-change="selectionChange" @checkbox-all="selectionChange" :checkbox-config="{ highlight: true, checkMethod: checkMethod }">
            <vxe-table-column field="checkbox" type="checkbox" width="60"></vxe-table-column>
            <vxe-table-column sortable min-width="160" field="docNum" :title="$t('col_sap_doc_code')"></vxe-table-column>
            <vxe-table-column sortable min-width="160" field="typeCode" :title="$t('Zone')">
              <template v-slot="{ row }">
                <!-- <span>{{ row.typeCode }} - {{ row.typeName }}</span> -->
                <span>{{ row.typeCode }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column sortable min-width="160" field="binCode" :title="$t('LocationCode')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="used" title="Empty">
              <template v-slot="{ row }">
                <span>{{ row.used == 1 ? $t('sel_no') : $t('sel_yes') }}</span>
              </template>
            </vxe-table-column> -->
            <vxe-table-column sortable min-width="160" field="matCode" :title="$t('Item')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="lotNumb" :title="$t('lotNumb')"></vxe-table-column> -->
            <!-- <vxe-table-column sortable min-width="160" field="ext0" :title="$t(' VIN # or S/N ')"></vxe-table-column> -->
            <!-- <vxe-table-column sortable min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->

            <vxe-table-column min-width="80" field="ext3" title="MfgID"></vxe-table-column>
            <vxe-table-column min-width="80" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext7" :title="$t('prddate')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext8" :title="$t('expdate')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
            <vxe-table-column sortable min-width="160" field="weightQty" :title="$t('weight_qty')"></vxe-table-column>
            <!-- <vxe-table-column sortable min-width="160" field="stockTaskQty" :title="$t('ActQty')"></vxe-table-column> -->
            <vxe-table-column sortable min-width="60" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>

            <!-- <vxe-table-column min-width="160" field="qty" :title="$t('QtyInPCS')"></vxe-table-column> -->
            <vxe-table-column sortable min-width="160" field="stockTakeUser" :title="$t('col_stock_take_user')">
              <template v-slot="{ row, rowIndex }">
                <span v-if="disableEdit">{{ row.stockTakeUser }}</span>
                <span class="pointer" v-else @click="chooseStockTakeUser(row,rowIndex)">{{ row.stockTakeUser || $t('cht_placeholder') }}</span>
              </template>
            </vxe-table-column>
            <!-- <vxe-table-column sortable min-width="160" field="moveDate" :title="$t('col_move_data')"> </vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
          </vxe-table>

          <!-- <x-vxe-pager :current-page="page.pageIndex" :page-size="page.pageSize" :total="page.totalCount" @page-change="handlePageChange"> </x-vxe-pager> -->
          </Col>
        </Row>

        <div class="fixed-bottom" v-show="isShowTable">
          <button-expand :btnGroup="groupBtn" @on-ok="btnHandle" />
        </div>
      </div>
    </div>
    <!-- 更多信息 -->
    <!-- <more :drawer.sync="isMaterialShowMore" :row="row" @on-ok="handleMore" /> -->

    <!-- 新增盘点人 -->
    <add :drawer.sync="isInventoryUser" @on-ok="changUserHandle" />
  </div>
</template>

<script>
import { API } from '@A/warehouse/NewPInvSheet'
import { CAPI } from '@A/common'
// 盘点人添加
import add from './modal/add.vue'
// 按钮逻辑
import ButtonExpand from '_c/btnGroup/ButtonExpand.vue'
import { dateFt } from '@/libs/assist'

export default {
  name: 'detail',
  components: {
    add,
    ButtonExpand
  },
  data () {
    return {
      documentNumber:'',
      isInventoryUser: false,
      currIndex: 0, // 选中当前行索引
      isInventoryUserType: 2, // 盘点人添加类型
      head: {}, // 抬头信息
      row: {}, // 选中行数据
      remarkPlaceHolder: '', // 备注输入提示
      tabChangeValue: 'p1', // Tab切换当前选项卡名称
      curr: 0, // 点击获取当前行索引 获取操作抬头信息
      selection: [], // 已选择数据
      itemList: [], // 表格全量数据
      itemTableList: [], // 表格显示数据
      fileList: [], // 附件列表
      binCodeList: [], // 仓位
      binCodeListReturn: [],
      isMaterialShowMore: false,
      groupBtn: {
        buttonStartInventory: false, // 开始盘点
        buttonSave: false, // 保存
        buttonDelete: false // 删除
      }, // 按钮组权限
      formHeadData: {
        fileList: [], // 附件
        logList: [], // 日志
      },
      formData: {
        condition: '',
        binCode: "",
        corpCode: "",
        bundleCode: "",
        poCode: "",
        beginDate: "",
        endDate: "",
        shippingRef: ""
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
    // 订单信息
    orderItem () {
      return this.itemList.length ? this.itemList[this.curr] : {}
    },
    // 单据是否已完成状态（已完成可以冲销）
    isComplete () {
      return this.head.receiptStatus == 90
    },
    // 已提交之后状态不可以修改  // 可编辑使能控制 true 不可编辑 false 可编辑
    disableEdit () {
      return this.head.receiptStatus >= 20
    },
    addDisabled () {
      return this.head.stockTakeType === '' || (this.head.stockTakeType == 1 && this.head.beginDate == '')
    }
  },
  created () {
    this.getBinList()
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
        this.getInfoByCreate() // 创建进入
        return false;
      }

      receiptStatus <= 10 ? this.getBinInfoByCode() : this.getMatInfoByCode()// 详情进入
    },
    /**
     * @Description: Create a warehouse order based on the pre-order document data
     * @Author: Jiang Xiao
     */
    getInfoByCreate () {
      var data = {
        head: {
          matGroupCode: '',
          receiptStatus: 0,
          beginDate: '',
          endDate: '',
          stockStatus: 10, // 库存状态
          stockTakeDate: '', // 盘点日期
          stockTakeCode: '', // 盘点凭证
          createUserName: this.$store.getters.UserName,
          createTime: this.$dateFt('yyyy-MM-dd hh:mm:ss', new Date()),
          receiptRemark: '', // 备注
          stockTakeMode: 1, // 盘点方法：1-明盘，2-盲盘 ,
          stockTakeType: 2, // 盘点类型：1-动态盘点，2-周期性盘点
          freezeStockTake: 1, // 是否冻结0否1是
          specStock: '-1', // 特殊库存
          whCode: '', // 仓库号
          typeCode: '', // 存储类型
          binCode: '' // 仓位
        },
        itemList: [],
        fileList: [],
        logList: []
      }

      this.initData(data, true)
    },
    /**
     * @Description: Query detailed data by document number
     * @Author: Jiang Xiao
     */
    async getMatInfoByCode () {
      var [err, res] = await this.$to(API.AGetDetailByCode(this.baseInfo.id, this.baseInfo.in)); if (err) { return false }
      this.initData(res.data, false)
    },
    // 查询仓位信息
    async getBinInfoByCode () {
      var [err, res] = await this.$to(API.AGetBinInfoByCode(this.baseInfo.id, this.baseInfo.in)); if (err) { return false }
      var data = res.data
      this.initData(data, false)
    },
    // 获取全集仓位
    async getBinList () {
      // var [err, res] = await this.$to(CAPI.AGetBinList('PS')); if (err) { return false } //获取仓位全集
      var [err, res] = await this.$to(CAPI.AGetNotEmptyBinList('PS')); if (err) { return false }  //获取非空仓位全集
      var binList = res.data.binList || []

      this.binCodeList = binList.map(function (item) {
        return `${item.typeCode}-${item.binCode}`
      })
      // this.binCodeList = binList.map(function (item) {
      //   return `${item.binCode}`
      // })
      this.binCodeListReturn = binList
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
      if (data.head.receiptStatus === 0) {
        this.groupBtn = {
          buttonStartInventory: true, // 开始盘点
          buttonSave: true, // 保存
          buttonDelete: false // 删除
        } // 按钮组权限
      } else if (data.head.receiptStatus <= 10) {
        this.groupBtn = {
          buttonStartInventory: true, // 开始盘点
          buttonSave: true, // 保存
          buttonDelete: true // 删除
        } // 按钮组权限
      }

      data.head.typeCode = data.head.typeCode || ''
      data.head.binCode = data.head.binCode || ''
      data.head.beginDate = data.head.beginDate || ''
      data.head.endDate = data.head.endDate || ''
      data.head.matGroupCode = data.head.matGroupCode || ''

      this.head = data.head

      this.documentNumber = data.head.docNum || ''
      this.formHeadData.logList = data.logList

      var itemList = data.itemList
      // var newJson = []; //盛放去重后数据的新数组
      //
      // for( var item1 of itemList){  //循环json数组对象的内容
      //
      //   var flag = true;  //建立标记，判断数据是否重复，true为不重复
      //
      //   for( var item2 of newJson){  //循环新数组的内容
      //
      //     if(item1.typeCode.trim()==item2.typeCode.trim()
      //     && item1.binCode.trim()==item2.binCode.trim()
      //     && item1.matCode.trim()==item2.matCode.trim()
      //     // && item1.ext0.trim()==item2.ext0.trim()
      //     // && item1.ext1.trim()==item2.ext1.trim()
      //     ){ //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
      //       flag = false;
      //       item2.weightQty = parseInt(item2.weightQty) + parseInt(item1.weightQty)
      //       item2.stockTakeQty = parseInt(item2.stockTakeQty) + parseInt(item1.stockTakeQty)
      //     }
      //
      //   }
      //
      //   if(flag){ //判断是否重复
      //     newJson.push(item1); //不重复的放入新数组。  新数组的内容会继续进行上边的循环。
      //   }
      // }
      this.itemList = this.formatItemList(itemList)
      // 获取分页数据
      // this.getFirstPageData()
      // 表格列控制
      //this.columsShowCtrl(data)
    },
    // 格式化行项目数据
    formatItemList (itemList) {
      itemList.forEach(function (item, i) {
        item.uid = `${item.whCode}-${item.typeCode}-${item.binCode}` // 唯一标识
        item.stockTakeUser = item.stockTakeUser || ''
      })
      return itemList
    },
    // 附件列表赋值
    formatImgList (fileList) {
      var _this = this
      return fileList.map(function (item) {
        item.url = getProUri(_this, `file/download/${file.fileCode}`)
        return item
      })
    },
    // 表格列控制
    columsShowCtrl (data) {

      this.$nextTick(() => {
        var columns = this.$refs.detailTable.getColumns()

        if (data.head.receiptStatus <= 10) {
          columns.forEach(column => {
            if (['checkbox', 'typeCode', 'binCode', 'used', 'stockTakeUser', 'moveDate'].includes(column.property)) {
              column.visible = true
            } else {
              column.visible = false
            }
          })
        } else {
          columns.forEach(column => {
            // if (['shippingRef', 'heatCode', 'skidCode', 'typeCode', 'binCode', 'weightQty', 'weightUnitCode', 'stockTakeUser', 'moveDate'].includes(column.property)) {
            // if (['shippingRef', 'typeCode', 'binCode', 'weightQty', 'weightUnitCode', 'stockTakeUser', 'moveDate'].includes(column.property)) {
            //if (['docNum','typeCode', 'binCode', 'matCode','lotNumb','weightQty', 'weightUnitCode', 'stockTakeUser', 'moveDate'].includes(column.property)) {
            if (['docNum','typeCode', 'binCode', 'matCode','ext0', 'ext1', 'weightQty', 'weightUnitCode', 'stockTakeUser', 'moveDate'].includes(column.property)) {
              column.visible = true
            } else {
              column.visible = false
            }
          })
        }

        this.$refs.detailTable.refreshColumn()
      })
    },
    //
    stockTakeDateChangeHandle (date) {
      this.head.stockTakeDate = date
    },
    // 盘点类型下拉
    stockTakeTypeChangeHandle (stockTakeType) {
      this.itemList = []
      this.head.stockTakeType = stockTakeType
      this.head.beginDate = ''
      this.head.endDate = ''
      this.head.binCode = ''
      this.head.typeCode = ''
      // this.getFirstPageData()
    },
    // 仓位过滤方法
    binFilterMethod (value, option) {
      //return (value.indexOf('/') > -1) && (option.indexOf(value) > -1);
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    // typeCode
    binCodeChangeHandle (value) {
      if (value.indexOf('-') > -1) {
        var binInfo = value.split('-')
        this.head.binCode = binInfo[1]
        this.head.typeCode = binInfo[0]
      } else {
        this.head.binCode = value
        this.head.typeCode = ''
      }
    },
    dateChangeHandle (date) {
      this.formData.beginDate = date[0]|| ''
      this.formData.endDate = date[1] || ''
    },
    // 移动日期
    moveDateChangeHandle (date) {
      this.head.beginDate = date[0] || ''
      this.head.endDate = date[1] || ''
    },
        formatSearch(input){
      var arr = input.split(  /[, ]/  )
      for (var i = 0, l = arr.length; i < l; ++i) {
        arr[i] = arr[i].trim()
      }
      input = arr.join(",")
      input = input.trim()
      return input
    },
    range ( start,end ){
      var _self = this;
      var length = end - start +1;
      var step = start - 1;
      return Array.apply(null,{length:length}).map(function (v,i){step++;return step;});
    },
    formatMinus(input){
      var output = new Array()
      var arr = input.split( /[, ]/ )
      for (var i = 0, l = arr.length; i < l; ++i) {
        arr[i] = arr[i].trim()
        if(arr[i].indexOf("-") != -1 ){
          var tmparr = arr[i].split('-')
          if(tmparr[0]>=tmparr[1]){
            this.$Notice.warning({ desc: this.$t('msg_notice_147') })
            return false
          }
          tmparr[0]=parseInt(tmparr[0])
          tmparr[1]=parseInt(tmparr[1])
          if(!Number.isInteger(tmparr[0])){
            this.$Notice.warning({ desc: this.$t('msg_notice_147') })
            return false
          }
          if(!Number.isInteger(tmparr[1])){
            this.$Notice.warning({ desc: this.$t('msg_notice_147') })
            return false
          }
          var tmpRange = []
          tmpRange = this.range(tmparr[0], tmparr[1])
          tmpRange = tmpRange.map(String)
          tmpRange = tmpRange.map(x=>x.padStart(4, '0'))
          output = output.concat(tmpRange)
        }else{
          if(arr[i].toUpperCase() == "IB" || arr[i].toUpperCase()=="OB"){
            output.push(arr[i])
          }else{
            arr[i] = arr[i].padStart(4, '0')
            output.push(arr[i])
          }
        }
      }
      output = output.join(",")
      output = output.trim()
      return output
    },
    // 获取仓位数据
    async getStorageBinList () {
      var reg = /[^\w ,]/g;
      var regbin = /[^\w ,-]/g;
      this.itemList = []
      if(typeof(this.formData.typeCode) != "undefined"){this.formData.typeCode = this.formatSearch(this.formData.typeCode)}
      if(typeof(this.formData.condition) != "undefined"){this.formData.condition = this.formatSearch(this.formData.condition)}
      //if(typeof(this.formData.binCode) != "undefined"){this.formData.binCode = this.formatSearch(this.formData.binCode)}
      if(reg.test(this.formData.typeCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
      }else if(reg.test(this.formData.condition)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
      }else if(regbin.test(this.formData.binCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_155') })
      }


      var sendData = {
        beginDate: this.formData.beginDate,
        endDate: this.formData.endDate,
        //typeCode: this.head.typeCode,
        typeCode: this.formData.typeCode,
        //binCode: this.head.binCode,
        binCode: this.formData.binCode,
        whCode: this.head.whCode,
        matGroupCode: this.head.matGroupCode,
        stockTakeType: this.head.stockTakeType
      }
      //sendData.binCode = this.formatMinus(this.formData.binCode)
      //sendData.binCode = this.formData.binCode
      // if(!sendData.binCode){
      //   console.log("fasdfa")
      //   return
      // }
      if(sendData.binCode=='0000'){
        sendData.binCode=''
      }
      //console.log(sendData)
      var [err, res] = await this.$to(API.AGetBinItemList(sendData)); if (err) { return false }
      var data = res.data
      //console.log("data=",data)
      if(data.itemList.length==0){
        this.$Notice.warning({ desc: this.$t('Bin is empty or frozen.') })
      }
      var itemList = this.formatItemList(data.itemList)
      this.pushBinListToItemList(itemList)
    },
    // 删除选择数据
    delStorageBinList () {
      this.itemList = this.$del(this.itemList, this.selection, 'uid')
      // this.getFirstPageData()  //页面中显示的数据
    },
    // 行项目数据添加 - 合并去重
    pushBinListToItemList (itemList) {
      this.itemList = this.$mergeArray(this.itemList, itemList, 'uid')
      // this.getFirstPageData()  //页面中显示的数据
    },
    // 选择盘点人
    chooseStockTakeUser (row, rowIndex) {
      this.isInventoryUser = true
      this.currIndex = rowIndex
      this.isInventoryUserType = 2
    },
    // 批量添加盘点人
    changePIvUser () {
      if (!this.selection.length) {
        this.$Notice.warning({ desc: this.$t('msg_notice_145') })
        return false
      }

      this.isInventoryUser = true
      this.isInventoryUserType = 1
    },
    // 盘点人确定回调
    changUserHandle (row) {
      if (this.isInventoryUserType === 2) {
        this.itemList[this.currIndex].stockTakeUserName = row.userName
        this.itemList[this.currIndex].stockTakeUser = row.userCode
      } else {
        this.itemList.forEach((item) => {
          this.selection.forEach((itemSelected) => {
            if (itemSelected.uid === item.uid) {
              item.stockTakeUserName = row.userName
              item.stockTakeUser = row.userCode
            }
          })
        })
      }
    },
    // 批量选中改变
    selectionChange ({ selection }) {
      // 所有选择的数据 当前页 + 之前页的
      // var getCheckboxReserveRecords = this.$refs.detailTable.getCheckboxReserveRecords()
      // var getCheckboxRecords = this.$refs.detailTable.getCheckboxRecords()

      // this.selection = getCheckboxReserveRecords.concat(getCheckboxRecords)
      this.selection = selection
    },
    // 附件上传回调
    handleFileChange (fileList) {
      this.formHeadData.imgList = fileList
    },
    // 分页回调
    // handlePageChange ({ currentPage, pageSize }) {
    //   this.page.pageIndex = currentPage
    //   this.page.pageSize = pageSize
    //   this.itemTableList = this.$getPage(this.page.pageIndex, this.page.pageSize, this.itemList)
    // },
    // // 假分页处理
    // getFirstPageData () {
    //   this.page.pageIndex = 1
    //   this.page.totalCount = this.itemList.length
    //   this.itemList.forEach(function (item, i) {
    //     item.xindex = i
    //   })
    //   this.itemTableList = this.$getPage(1, this.page.pageSize, this.itemList)
    // },
    // 是否可选
    checkMethod ({ row }) {
      // 已冲销 已完成 无权限不可以选择
      return !(row.disableEdit || row.disabled)
    },
    // 成功回调
    successHandle (res) {
      this.$router.push({ name: 'new_inv_sheet' })
      this.$Notice.success({ desc: res.returnMsg })
    },
    // 删除
    deleteOrder () {
      var eCommand = () => {
        API.ADelete(this.head.stockTakeCode).then((res) => { this.successHandle(res) })
      }
      this.$confirm({
        content: this.$t('msg_notice_74'),
        onOk: eCommand
      })
    },
    /**
     * @Description: Document pre-save verification function
     * @Author: Jiang Xiao
     */
    preSaveValidation () {
      // if (!this.documentNumber) {
      //   this.$Notice.warning({ desc: this.$t('msg_notice_267') })
      //   return false
      // }
      this.head.stockTakeDate = dateFt('yyyy-MM-dd', new Date())
      if (!this.head.stockTakeDate) {
        this.$Notice.warning({ desc: this.$t('msg_notice_268') })
        return false
      }

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

      if (this.itemList.some(function (item) { return item.stockTakeUser == '' })) {
        this.$Notice.warning({ desc: this.$t('msg_notice_269') })
        return false
      }

      return true
    },
    // 提交保存
    submit (isSubmit) {
      // submit
      if (isSubmit) {
        if (this.preCommitValidation()) {
          this.$confirm({
            content: this.$t('msg_notice_26'),
            onOk: () => {
              this.submitOrder(20)
            }
          })
        }
      } else {
        // save
        if (this.preSaveValidation()) {
          this.$confirm({
            content: this.$t('msg_notice_27'),
            onOk: () => {
              this.submitOrder(10)
            }
          })
        }
      }
    },
    // 单据提交
    async submitOrder (isSubmit) {
      var sendData = {
        documentNumber: this.documentNumber,
        head: Object.assign({}, this.head),
        itemList: this.itemList,
        actorList: [],
        fileList: this.formHeadData.fileList
      }

      sendData.head.saveOrUpdate = sendData.head.stockTakeCode ? 20 : 10
      sendData.head.receiptStatus = isSubmit

      var [err, res] = await this.$to(API.ASaveOrSubmit(sendData)); if (err) { return false }
      this.successHandle(res)
    },
    // 按钮组回调
    btnHandle (type) {
      switch (type) {
        case 'buttonSave':
          this.submit(0)
          break
        case 'buttonStartInventory':
          this.submit(1)
          break
        case 'buttonDelete':
          this.deleteOrder()
          break
        default:
          return false
      }
    },
  },
}
</script>
