<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-19 10:40:01
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-11 12:58:01
 * @Description: description
 -->
<template>
  <div class="modal-body no-padding h100">
    <div class="i-box clearfix h100 x-height-table">
      <x-search-header @on-search="search">
        <template slot="head">
          <ButtonGroup>
            <Button icon="ios-search" @click="search">{{ $t('btn_find') }}</Button>
            <Button icon="ios-cloud-upload-outline" @click="exportExcel"> {{ $t('export_to_excel') }} </Button>
          </ButtonGroup>
        </template>
        <template slot="body">
          <!-- <search-in flex :title="$t('Lotnumb')">
            <Input type="text" v-model="formData.bundleCode" />
          </search-in> -->
          <search-in flex :title="$t('Transaction Type')">
            <!-- <Input type="text" v-model="formData.soCode" /> -->
            <Select v-model="formData.tranType" multiple >
              <Option :value="101" :label="$t('Purchase Order')"></Option>
              <!-- <Option :value="102" :label="$t('Customer Return')"></Option> -->
              <Option :value="103" :label="$t('Transfer In')"></Option>
              <Option :value="104" :label="$t('Adjustment In')"></Option>
              <Option :value="201" :label="$t('Sales Docment')"></Option>
              <Option :value="202" :label="$t('Transfer Out')"></Option>
              <Option :value="203" :label="$t('Adjustment Out')"></Option>
              <Option :value="301" :label="$t('PutAway')"></Option>
              <Option :value="302" :label="$t('Pick')"></Option>
              <Option :value="303" :label="$t('Bin Move')"></Option>
              <Option :value="400" :label="$t('Count')"></Option>
            </Select>
          </search-in>
          <search-in flex :title="$t('DNumber')">
            <Input type="text" v-model="formData.soCode" />
          </search-in>
          <!-- <search-in flex :title="$t('Zone')">
            <Input type="text" v-model="formData.typeCode" />
          </search-in> -->
          <search-in flex :title="$t('LocationCode')">
            <Input type="text" v-model="formData.binCode" />
          </search-in>
          <search-in flex :title="$t('col_date')">
            <DatePicker type="daterange" split-panels @on-change="dateChangeHandle"></DatePicker>
          </search-in>
          <search-in flex :title="$t('Item')">
            <Input type="text" v-model="formData.matCode" />
          </search-in>
          <search-in flex title="Batch">
            <Input type="text" v-model="formData.lotNumb" />
          </search-in>
          <!-- <search-in flex :title="$t('Item')">
            <Input type="text" v-model="formData.condition" />
          </search-in> -->
          <!-- <search-in flex :title="$t('VIN')">
            <Input type="text" v-model="formData.ext0" />
          </search-in> -->
          <!-- <search-in flex :title="$t('Engine Number')">
            <Input type="text" v-model="formData.ext1" />
          </search-in> -->
          <!-- <search-in flex :title="$t('ShippingRef')">
            <Input type="text" v-model="formData.shippingRef" />
          </search-in> -->

          <!-- <search-in flex :title="$t('condition')"> -->


        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16" style="height:calc(100% - 250px);">
      <vxe-table ref="sTable" :data="list" height="auto" stripe show-overflow resizable>
        <!-- <vxe-table-column min-width="160" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
        <vxe-table-column sortable min-width="160" field="whCode" :title="$t('WarehouseCode')"></vxe-table-column>
        <vxe-table-column sortable sortable min-width="160" field="referReceiptTypeName" title="Transaction Type"></vxe-table-column>
        <vxe-table-column sortable min-width="160" field="referReceiptCode" :title="$t('DNumber')"></vxe-table-column>
        <vxe-table-column sortable min-width="180" field="matCode" :title="$t('Item')"></vxe-table-column>
        <vxe-table-column sortable min-width="180" field="corpCode" :title="$t('CompanyCode')"></vxe-table-column>
        <vxe-table-column sortable min-width="180" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
        <vxe-table-column sortable min-width="180" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->
        <vxe-table-column sortable min-width="60" field="weightQty" :title="$t('Qty')"></vxe-table-column>
        <vxe-table-column sortable min-width="80" field="debitCreditName" :title="$t('Status')"></vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="receiptQty" title="Qty In PCS"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="corpCode" :title="$t('CompName')"></vxe-table-column> -->
        <vxe-table-column sortable min-width="180" field="typeCode" :title="$t('ZoneCode')"></vxe-table-column>
        <vxe-table-column sortable min-width="180" field="binCode" :title="$t('LocationCode')"></vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="stockStatus" :title="$t('Bin')"></vxe-table-column> -->
        <vxe-table-column sortable min-width="180" field="userName" title="User Name"></vxe-table-column>
        <vxe-table-column sortable min-width="180" field="createTime" :title="$t('Time')"></vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="heatCode" :title="$t('Heat')"></vxe-table-column>
        <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->

        <vxe-table-column sortable min-width="180" field="ext9" title="GRDate_lot"></vxe-table-column>
      </vxe-table>

      <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
      </Col>
    </div>
  </div>
</template>

<script>
import { API } from '@A/system/Reporting'
import { CAPI } from '@A/common'

export default {
  data () {
    return {
      list: [],
      cropList: [],
      formData: {
        typeCode: '',
        tranType:'',
        binCode: '',
        matCode:'',
        condition: '',
        corpCode: '',
        bundleCode: '',
        soCode: '',
        sDate: '',
        eDate: '',
        shippingRef: '',
        ext0:'',
        ext1:'',
        lotNumb:'',
      },
      // 分页\排序
      head: {
        paging: true,
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
  },
  methods: {
    formatSearch(input){
      var arr = input.split( /[, ]/ )
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
    // 获取列表
    async getData () {
      var reg = /[^\w ,]/g;
      var regbin = /[^\w ,-]/g;
      if(typeof(this.formData.soCode) != "undefined"){this.formData.soCode = this.formatSearch(this.formData.soCode)}
      //if(typeof(this.formData.condition) != "undefined"){this.formData.condition = this.formatSearch(this.formData.condition)}
      if(typeof(this.formData.matCode) != "undefined"){this.formData.matCode = this.formatSearch(this.formData.matCode)}
      if(typeof(this.formData.ext0) != "undefined"){this.formData.ext0 = this.formatSearch(this.formData.ext0)}
      if(typeof(this.formData.ext1) != "undefined"){this.formData.ext1 = this.formatSearch(this.formData.ext1)}
      if(typeof(this.formData.typeCode) != "undefined"){this.formData.typeCode = this.formatSearch(this.formData.typeCode)}
      if(typeof(this.formData.binCode) != "undefined"){this.formData.binCode = this.formatSearch(this.formData.binCode)}
      //if(typeof(this.formData.lotNumb) != "undefined"){this.formData.batch = this.formatSearch(this.formData.lotNumb)}
      //console.log("this.formData.typeCode",this.formData.typeCode)
      if(reg.test(this.formData.soCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(reg.test(this.formData.matCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(reg.test(this.formData.ext0)){
          //console.log("ext0",this.formData.ext0)
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(reg.test(this.formData.ext1)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(regbin.test(this.formData.binCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_155') })
          return
      }else if(reg.test(this.formData.typeCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }
      // }else if(reg.test(this.formData.lotNumb)){
      //     this.$Notice.warning({ desc: this.$t('msg_notice_146') })
      //     return
      // }
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 })
      // sendData.binCode = this.formatMinus(this.formData.binCode)

      sendData.binCode = this.formData.binCode ? this.formData.binCode : '0000'

      if(!sendData.binCode){
        return
      }
      if(sendData.binCode=='0000'){
        sendData.binCode=''
      }
      //console.log("sendData.tranType=",sendData.tranType)
      //console.log(typeof(sendData.tranType))
      if(sendData.tranType.length>0){
        sendData.tranType=sendData.tranType.join(",")
      }
      if(sendData.tranType.length==0){
        sendData.tranType=''
      }
      //console.log("sendData=",sendData)
      var [err, res] = await this.$to(API.AGetListPM(sendData)); if (err) { return false }
      var data = res.data
      this.head.totalCount = res.data.totalCount
      this.list = data.insDocInfoDaoVoList || []
    },
    // 获取公司列表
    async getCropList () {
      var [err, res] = await this.$to(CAPI.AGetCropList()); if (err) { return false }
      this.cropList = this.$kv(res.data, 'corpCode', 'corpName', true)
    },
    dateChangeHandle (date) {
      //console.log("date",date)
      this.formData.sDate = date[0]+" 00:00:00"
      this.formData.eDate = date[1]+" 23:59:59"
    },
    search () {
      this.head.pageIndex = 1
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
    async exportExcel () {
      var reg = /[^\w ,]/g;
      var regbin = /[^\w ,-]/g;
      if(typeof(this.formData.soCode) != "undefined"){this.formData.soCode = this.formatSearch(this.formData.soCode)}
      //if(typeof(this.formData.condition) != "undefined"){this.formData.condition = this.formatSearch(this.formData.condition)}
      if(typeof(this.formData.matCode) != "undefined"){this.formData.matCode = this.formatSearch(this.formData.matCode)}
      if(typeof(this.formData.ext0) != "undefined"){this.formData.ext0 = this.formatSearch(this.formData.ext0)}
      if(typeof(this.formData.ext1) != "undefined"){this.formData.ext1 = this.formatSearch(this.formData.ext1)}
      if(typeof(this.formData.typeCode) != "undefined"){this.formData.typeCode = this.formatSearch(this.formData.typeCode)}
      if(typeof(this.formData.binCode) != "undefined"){this.formData.binCode = this.formatSearch(this.formData.binCode)}
      //if(typeof(this.formData.lotNumb) != "undefined"){this.formData.batch = this.formatSearch(this.formData.lotNumb)}
      //console.log("this.formData.typeCode",this.formData.typeCode)
      if(reg.test(this.formData.soCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(reg.test(this.formData.matCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(reg.test(this.formData.ext0)){
          //console.log("ext0",this.formData.ext0)
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(reg.test(this.formData.ext1)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(regbin.test(this.formData.binCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_155') })
          return
      }else if(reg.test(this.formData.typeCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }
      // }else if(reg.test(this.formData.lotNumb)){
      //     this.$Notice.warning({ desc: this.$t('msg_notice_146') })
      //     return
      // }
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 })
      // sendData.binCode = this.formatMinus(this.formData.binCode)

      sendData.binCode = this.formData.binCode ? this.formData.binCode : '0000'

      if(!sendData.binCode){
        return
      }
      if(sendData.binCode=='0000'){
        sendData.binCode=''
      }
      //console.log("sendData.tranType=",sendData.tranType)
      //console.log(typeof(sendData.tranType))
      if(sendData.tranType.length>0){
        sendData.tranType=sendData.tranType.join(",")
      }
      if(sendData.tranType.length==0){
        sendData.tranType=''
      }
      //var sendData = Object.assign(this.head, this.formData, { totalCount: -1, paging: false })
      //console.log("sendData=",sendData)
      sendData.paging = false;
      var [err, res] = await this.$to(API.AGetListPM(sendData)); if (err) { return false }
      var data = res.data
      var excelList = data.insDocInfoDaoVoList || []
      this.$refs.sTable.exportData({
        filename: 'Transaction Log',
        type: 'csv',
        isHeader: true,
        isFooter: true,
        data: excelList
      })
    }
  }
}

</script>
