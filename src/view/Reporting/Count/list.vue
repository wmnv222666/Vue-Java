<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-19 10:40:01
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-19 14:16:14
 * @Description: description
 -->
<template>
  <div class="modal-body no-padding h100">
    <div class="i-box clearfix h100 x-height-table">
      <x-search-header @on-search="search">
        <template slot="head">
          <ButtonGroup>
            <Button icon="ios-search" @click="search"> {{ $t('btn_find') }} </Button>
            <Button icon="ios-cloud-upload-outline" @click="exportExcel"> {{ $t('export_to_excel') }} </Button>
          </ButtonGroup>
        </template>
        <template slot="body">
          <search-in flex :title="$t('col_stock_take_code')">
            <Input type="text" v-model="formData.takeCode" />
          </search-in>
          <search-in flex :title="$t('col_sap_doc_code')">
            <Input type="text" v-model="formData.sapCode" />
          </search-in>
          <search-in flex title="Zone">
            <Input type="text" v-model="formData.typeCode" />
          </search-in>
          <search-in flex :title="$t('LocationCode')">
            <Input type="text" v-model="formData.binCode" />
          </search-in>
          <search-in flex :title="$t('SKU')">
            <Input type="text" v-model="formData.matCode" />
          </search-in>
          <search-in flex :title="$t('col_date')">
            <DatePicker type="daterange" split-panels @on-change="dateChangeHandle"></DatePicker>
          </search-in>
          <!-- <search-in flex :title="$t('Bin Type')">
            <Select v-model="formData.isEmpty" >
              <Option :value="1" :label="$t('Empty')"></Option>
              <Option :value="2" :label="$t('Multi')"></Option>
              <Option :value="3" :label="$t('All')"></Option>
            </Select>
          </search-in> -->
        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16" style="height:calc(100% - 250px);">
      <vxe-table :data="list" height="auto" stripe show-overflow resizable ref="sTable">
        <vxe-table-column min-width="160" field="stockTakeCode" :title="$t('col_stock_take_code')"></vxe-table-column>
        <vxe-table-column min-width="160" field="docNum" :title="$t('col_sap_doc_code')"></vxe-table-column>
        <vxe-table-column min-width="160" field="typeCode" :title="$t('Zone')">
          <!-- <template v-slot="{ row }">
            <span>{{ row.typeCode }} - {{ row.typeName }}</span>
          </template> -->
        </vxe-table-column>
        <vxe-table-column min-width="160" field="binCode" :title="$t('LocationCode')"></vxe-table-column>
        <vxe-table-column min-width="160" field="matCode" :title="$t('Item')"></vxe-table-column>
        <vxe-table-column min-width="160" field="ext0" :title="$t(' VIN # or S/N ')"></vxe-table-column>
        <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="lotNumb" :title="$t('lotNumb')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
        <vxe-table-column min-width="160" field="weightQty" :title="$t('weight_qty')"></vxe-table-column>
        <vxe-table-column min-width="160" field="stockTakeQty" :title="$t('ActQty')">
          <!-- <template v-slot="{ row, rowIndex }">
            <span v-if="disableEdit">{{ row.stockTakeQty }}</span>
            <el-input-number v-else v-model="row.stockTakeQty" :min="0" @change="stockTakeQtyChange(row, rowIndex)" :max="999999999" :precision="row.weightDecimalPlace"></el-input-number>
          </template> -->
        </vxe-table-column>
        <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="qty" :title="$t('QtyInPCS')"> </vxe-table-column> -->
        <vxe-table-column min-width="160" field="stockTakeUser" :title="$t('col_stock_take_user')">
        </vxe-table-column>
        <vxe-table-column min-width="160" field="moveDate" :title="$t('Date')">
        </vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="moveDate" :title="$t('col_move_data')"> </vxe-table-column> -->
        <!-- <vxe-table-column sortable min-width="180" field="typeCode" :title="$t('ZoneCode')"></vxe-table-column>
        <vxe-table-column sortable min-width="180" field="binCode" :title="$t('LocationCode')"></vxe-table-column>
        <vxe-table-column sortable min-width="180" field="matCode" :title="$t('Item')"></vxe-table-column>
        <vxe-table-column sortable min-width="180" field="weightQty" :title="$t('Qty')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="receiptCode" :title="$t('DNumber')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="receiptType" title="PO Type"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="matName" :title="$t('ItemDesc')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="ext0" :title="$t(' VIN # or S/N ')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="matGroupName" :title="$t('CGR')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="receiptQty" title="Qty In PCS"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="whCode" :title="$t('WarehouseCode')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="currentWeight" :title="$t('CurrentWeight')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="weightMax" :title="$t('MaxWeight')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="corpCode" :title="$t('CompName')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="inputDate" title="Inbound Date"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="stockStatus" :title="$t('Bin')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="heatCode" :title="$t('Heat')"></vxe-table-column>
        <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
      </vxe-table>
      <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
      </Col>
    </div>
  </div>
</template>

<script>
//import { API } from "@A/system/Reporting";
import { API } from "@A/warehouse/PInvCount";
import { CAPI } from "@A/common";

export default {
  data () {
    return {
      list: [],
      cropList: [],
      formData: {
        takeCode:"",
        sapCode:"",
        typeCode:"",
        binCode: "",
        matCode:"",
        condition: '',
        corpCode: "",
        bundleCode: "",
        poCode: "",
        sDate: "",
        eDate: "",
        shippingRef: "",
        isEmpty: 3
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
    };
  },
  created () {
    // this.getCropList()
  },
  methods: {
    myIsNaN(value) {    
      //console.log("val=",value)
      return typeof value === 'number' && !isNaN(value);
    },
    dateChangeHandle (date) {
      this.formData.sDate = date[0]
      this.formData.eDate = date[1]
    },
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
      //console.log("arr========",arr)
      for (var i = 0, l = arr.length; i < l; ++i) {
        arr[i] = arr[i].trim()
        //console.log("arr[%d]",i,arr[i])
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
          //console.log("tmparr[0]=",tmparr[0])
          //console.log("tmparr[1]=",tmparr[1])
          var tmpRange = []
          tmpRange = this.range(tmparr[0], tmparr[1])
          //console.log("tmpRange========",tmpRange)
          tmpRange = tmpRange.map(String)
          tmpRange = tmpRange.map(x=>x.padStart(4, '0'))
          //console.log("tmpRange========",tmpRange)
          output = output.concat(tmpRange)
          //console.log("output========",output)
        }else{
          //console.log("typeofoutput=",typeof(arr[i]))
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
      //console.log("output========",output)
      return output
    },
    async getData () {
      var reg = /[^\w ,]/g;
      var regbin = /[^\w ,-]/g;
      if(typeof(this.formData.takeCode) != "undefined"){this.formData.takeCode = this.formatSearch(this.formData.takeCode)}
      if(typeof(this.formData.sapCode) != "undefined"){this.formData.sapCode = this.formatSearch(this.formData.sapCode)}
      if(typeof(this.formData.typeCode) != "undefined"){this.formData.typeCode = this.formatSearch(this.formData.typeCode)}
      if(typeof(this.formData.binCode) != "undefined"){this.formData.binCode = this.formatSearch(this.formData.binCode)}
      if(typeof(this.formData.matCode) != "undefined"){this.formData.matCode = this.formatSearch(this.formData.matCode)}
      if(reg.test(this.formData.typeCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(reg.test(this.formData.matCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(regbin.test(this.formData.binCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_155') })
          return
      }else if(reg.test(this.formData.typeCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(reg.test(this.formData.sapCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(reg.test(this.formData.takeCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 });
      sendData.binCode = this.formatMinus(this.formData.binCode)
      if(!sendData.binCode){
        return
      }
      if(sendData.binCode=='0000'){
        sendData.binCode=''
      }
      //console.log("senddata=",sendData)
      var [err, res] = await this.$to(
        //API.AGetDetailByCodeReport("PD00000028", "","","","")
        API.AGetDetailByCodeReport(sendData.takeCode,sendData.sapCode,sendData.typeCode,sendData.binCode,sendData.matCode,sendData.sDate,sendData.eDate,1)
        //API.AGetDetailByCodeReport("PD00000028",sendData.sapCode,sendData.typeCode,sendData.binCode,sendData.matCode,1)
      );
      if (err) {
        return false;
      }
      this.list = res.data.itemList
      //console.log("this.list",this.list)
      //console.log("res=",res)
      //console.log("this.list=",this.list)
      //this.initData(res.data, false);
    },
    // 获取列表
    async getDataOld() {
      var reg = /[^\w,]/g;
      var regbin = /[^\w,-]/g;
      if(typeof(this.formData.typeCode) != "undefined"){this.formData.typeCode = this.formatSearch(this.formData.typeCode)}
      if(typeof(this.formData.condition) != "undefined"){this.formData.condition = this.formatSearch(this.formData.condition)}
      //if(typeof(this.formData.binCode) != "undefined"){this.formData.binCode = this.formatSearch(this.formData.binCode)}
      //if(typeof(this.formData.binCode) != "undefined"){this.formData.binCode = this.formatMinus(this.formData.binCode)}
      //console.log("this.formData.typeCode",this.formData.typeCode)
      if(reg.test(this.formData.typeCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(reg.test(this.formData.condition)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
          return
      }else if(regbin.test(this.formData.binCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_155') })
          return
      }
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 });
      //console.log("sendData=", sendData)
      sendData.binCode = this.formatMinus(this.formData.binCode)
      if(!sendData.binCode){
        return
      }
      if(sendData.binCode=='0000'){
        sendData.binCode=''
      }
      //console.log("sendData=", sendData)
      var [err, res] = await this.$to(API.AGetListPI1(sendData)); if (err) { return false; }
      var data = res.data;
      this.head.totalCount = res.data.totalCount;
      this.list = this.tree2List(data.binList || []);
      var newJson = []; //盛放去重后数据的新数组
      
      for( var item1 of this.list){  //循环json数组对象的内容
      
        var flag = true;  //建立标记，判断数据是否重复，true为不重复
      
        for( var item2 of newJson){  //循环新数组的内容
      
          if(item1.typeCode.trim()==item2.typeCode.trim() 
          && item1.binCode.trim()==item2.binCode.trim()  
          && item1.matCode.trim()==item2.matCode.trim()
          && item1.ext0.trim()==item2.ext0.trim()
          && item1.ext1.trim()==item2.ext1.trim()){ //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
            flag = false;
            item2.weightQty = parseInt(item2.weightQty) + parseInt(item1.weightQty)
            item2.stockTakeQty = parseInt(item2.stockTakeQty) + parseInt(item1.stockTakeQty)
          }
      
        }
      
        if(flag){ //判断是否重复
          newJson.push(item1); //不重复的放入新数组。  新数组的内容会继续进行上边的循环。
        }
      }
      for(var i  = 0; i<newJson.length;i++){
        newJson[i].matCount = 0;
        //console.log(newJson[i].typeCode,newJson[i].binCode,newJson[i].matCode)
      }
      if(this.formData.isEmpty==2){
        var outputList = []
        for (var tmp1 of newJson){
           //console.log("tmp1loop",tmp1.typeCode,tmp1.binCode,tmp1.matCode,tmp1.matCount)
          for(var tmp2 of newJson){
           
            //console.log("tmp2loop",tmp2.typeCode,tmp2.binCode,tmp2.matCode,tmp2.matCount)
            if(tmp2.binCode.trim() == tmp1.binCode.trim() && tmp2.typeCode.trim() == tmp1.typeCode.trim() && tmp2.matCode.trim() != tmp1.matCode.trim()){
              //console.log("tmp1.matCount++")
              tmp1.matCount = tmp1.matCount + 1
            }
          }
          if(tmp1.matCount>0){
            outputList.push(tmp1)
          }
        }
        this.list = outputList
      } else {
        this.list = newJson
      }

      for(var tmpitem of this.list){
        if(tmpitem.matCode.length == 0){
          tmpitem.matCode = "N/A"
        }
      }

    },
    tree2List (treeList) {
      var list = []
      for (let index = 0; index < treeList.length; index++) {
        const bundleList = treeList[index].bundleList || [];
        for (let indexChild = 0; indexChild < bundleList.length; indexChild++) {
          const element = bundleList[indexChild];
          list.push(element)
        }
      }
      return list
    },
    // 获取公司列表
    async getCropList () {
      var [err, res] = await this.$to(CAPI.AGetCropList());
      if (err) {
        return false;
      }
      this.cropList = this.$kv(res.data, "corpCode", "corpName", true);
    },
    dateChangeHandle (date) {
      this.formData.sDate = date[0];
      this.formData.eDate = date[1];
    },
    search () {
      this.head.pageIndex = 1;
      this.getData();
    },
    // 分页回调
    handlePageChange ({ currentPage, pageSize }) {
      this.head.pageIndex = currentPage;
      this.head.pageSize = pageSize;
      this.getData();
    },
    // 排序回调
    sortChange ({ column, property, order }) {
      // 用 DESC 表示按倒序排序(即：从大到小排序)
      // 用 ASC 表示按正序排序(即：从小到大排序)
      this.head.sortColumn = property;
      this.head.sortAscend = order === "asc";
      this.getData();
    },
    async exportExcel () {
      // var sendData = Object.assign(this.head, this.formData, { totalCount: -1, paging: false });
      // var [err, res] = await this.$to(API.AGetListPI(sendData)); if (err) { return false; }
      // var data = res.data
      // var excelList = this.tree2List(data.binList || [])
      this.$refs.sTable.exportData({
        filename: 'Count Results',
        type: 'csv',
        isHeader: true,
        isFooter: true,
        data: this.list
      })
    }
  }
};
</script>
