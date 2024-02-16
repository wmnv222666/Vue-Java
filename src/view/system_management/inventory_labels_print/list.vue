<!--
 * @Company: Inossem
 * @Author: hongbo zhu
 * @Email: Hongbo.zhu@inossem.com
 * @Date: 2020-07-22
 * @LastEditors: hongbo zhu
 * @LastEditTime:
 * @Description: description
 -->
<template>
  <div class="modal-body no-padding h100">
    <div class="i-box clearfix h100 x-height-table">
      <x-search-header @on-search="search">
        <template slot="head">
          <ButtonGroup>
            <Button icon="ios-search" @click="search"> {{ $t('btn_find') }} </Button>
            <!-- <Button min-width="160" icon="ios-print-outline"  class="buttonPrint"  @click="exportMatLabel">{{ $t("btn_label_export") }}</Button> -->
            <Button min-width="160" icon="ios-print-outline"  class="buttonPrint"  @click="printBarCode">{{ $t("btn_label_print") }}</Button>
            <!-- <Button icon="ios-cloud-upload-outline" @click="exportExcel"> {{ $t('export_to_excel') }} </Button> -->
            <Button @click="show({}, '')">{{ $t('btn_generate_qr_code') }}</Button>
          </ButtonGroup>
        </template>
        <template slot="body">
          <search-in flex title="Zone">
            <Input type="text" v-model="formData.typeCode" />
          </search-in>
          <search-in flex :title="$t('LocationCode')">
            <Input type="text" v-model="formData.binCode" />
          </search-in>
          <search-in flex :title="$t('condition')">
            <Input type="text" v-model="formData.condition" />
          </search-in>
          <search-in flex :title="$t('Lotnumb')">
            <Input type="text" v-model="formData.lotNumb" />
          </search-in>

        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16" style="height:calc(100% - 250px);">
      <!-- <vxe-table :default-sort ="{prop:'lc',order:'descending'}" :data="list" height="auto" stripe show-overflow resizable ref="sTable"  > -->
      <!-- <vxe-table :data="list" stripe show-overflow resizable @sort-change="sortChange" @checkbox-change="selectionChange" @checkbox-all="selectionChange"> -->
      <vxe-table :data="list" stripe show-overflow resizable @checkbox-change="selectionChange" @checkbox-all="selectionChange">
      <!-- <vxe-table ref="sTable" :sync-resize="tabVisible" :data="savedList" height="auto" stripe show-overflow resizable row-id="xid" highlight-cell :checkbox-config="{ reserve: true, highlight: true }" @checkbox-change="selectionChangeS" @checkbox-all="selectionChangeS"> -->
      <!-- <vxe-table :data="itemTableList" height="auto" stripe show-overflow resizable ref="sTable" :edit-config="{trigger: 'click', mode: 'cell'}" @edit-actived="editActivedEvent" @edit-closed="editClosedEvent"> -->
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <!-- <vxe-table-column min-width="140" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="140" field="receiptCode" :title="$t('DNumber')"></vxe-table-column> -->
        <vxe-table-column min-width="80" field="whCode" :title="$t('whCode')" sortable></vxe-table-column>
        <vxe-table-column min-width="80" field="typeCode" :title="$t('ZoneCode')" sortable></vxe-table-column>
        <!-- <vxe-table-column min-width="130" field="binCode" :title="$t('LocationCode')" prop="lc" sortable></vxe-table-column> -->
        <vxe-table-column min-width="30" field="binCode" :title="$t('LocationCode')" sortable></vxe-table-column>
        <!--<vxe-table-column min-width="130" field="binCode" :title="$t('LocationCode')"></vxe-table-column>-->
        <!-- <vxe-table-column min-width="160" field="heatCode" :title="$t('Heat')"></vxe-table-column>
        <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
        <vxe-table-column min-width="80" field="matCode" :title="$t('Item')" sortable></vxe-table-column>
        <vxe-table-column min-width="180" field="matName" :title="$t('ItemDesc')" sortable></vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="ext0" :title="$t(' VIN # or S/N ')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="receiptType" title="PO Type"></vxe-table-column> -->
        <vxe-table-column min-width="160" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column>
        <vxe-table-column min-width="160" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
        <!-- <vxe-table-column min-width="180" field="weightQty" :title="$t('Qty')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="10" field="weightQty" :title="$t('Qty')">
          <template v-slot="{ row }">
            <Input v-model="row.weightQty" :maxlength="10" />
          </template>
        </vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="receiptQty" title="Qty In PCS"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="whCode" :title="$t('WarehouseCode')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="currentWeight" :title="$t('CurrentWeight')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="weightMax" :title="$t('MaxWeight')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="corpCode" :title="$t('CompName')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="inputDate" title="Inbound Date"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="stockStatus" :title="$t('Bin')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="200" field="remark" title="Remark" :edit-render="{name: 'input', immediate: true, attrs: {type: 'text'}}"></vxe-table-column> -->
      </vxe-table>
      <!-- <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager> -->
      <x-vxe-pager-48 :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager-48>
      </Col>

      <!-- <div class="fixed-bottom">
        <Button min-width="160" icon="ios-print-outline" type="primary" class="ivu-btn-button-create-ghost buttonPrint" @click="exportMatLabel">{{ $t("btn_label_print") }}</Button>

      </div> -->
    </div>
    <look :drawer.sync="isLook" :row="row" :flag="flag" @ok-drawer="okDrawer" />
  </div>
</template>

<script>
import { API } from "@A/system/Reporting";
import { CAPI } from "@A/common";
import request from "@/api/api.request.download";
import { downloadFile } from "@/libs/assist";
import { look } from "./modal/list";

export default {
  components: { look },
  data () {
    return {
      list: [],
      itemTableList: [], // 表格展示数据
      cropList: [],
      formData: {
        condition: '',
        binCode: "",
        corpCode: "",
        bundleCode: "",
        poCode: "",
        sDate: "",
        eDate: "",
        shippingRef: ""
      },
      row: {},
      flag: '',
      selectAll: false,
      // 分页\排序
      head: {
        paging: true,
        totalCount: -1,
        pageIndex: 1,
        pageSize: 48,
        sortColumn: "",
        sortAscend: true
      },
      isLook: false
    };
  },
  created () {
    // this.getCropList()
  },
  methods: {

    show (row, flag) {
      this.row = row
      this.flag = flag
      this.isLook = true
    },
    okDrawer () {

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
    selectionChange ({ selection }) {
      this.selectList = selection
    },
    async getData () {
      var reg = /[^\w ,]/g;
      var regbin = /[^\w ,-]/g;
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

      this.formData.corpCode = this.$store.getters.UserCropCode;
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 });
      sendData.binCode = this.formatMinus(this.formData.binCode)
      if(!sendData.binCode){
        return
      }
      if(sendData.binCode=='0000'){
        sendData.binCode=''
      }
      var [err, res] = await this.$to(API.AGetListPI(sendData)); if (err) { return false; }
      var data = res.data;
      this.head.totalCount = res.data.totalCount;
      this.list = this.tree2List(data.binList || []);
      //var tmpList = []
      //console.log("this.list=",this.list)
      // for( var i in this.list){
      //   //console.log("this.list[i].ext2=",this.list[i].ext2)
      //   if (this.list[i].ext2 === "M") {
      //     const element = this.list[i];
      //     tmpList.push(element)
      //   }
      // }
      //this.list = tmpList
      //console.log("this.list=",this.list)
      // 假分页初始化
      //this.getFirstPageData()
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
    // handlePageChange ({ currentPage, pageSize }) {
    //   this.head.pageIndex = currentPage
    //   this.head.pageSize = pageSize
    //   this.itemTableList = this.$getPage(this.head.pageIndex, this.head.pageSize, this.list)
    // },
    // 假分页处理
    getFirstPageData () {
      this.head.pageIndex = 1
      this.head.totalCount = this.list.length
      this.itemTableList = this.$getPage(1, this.head.pageSize, this.list)
    },
    async updateRemark (row) {
      var sendData = {
        remark: row.remark,
        receiptCode: row.receiptCode,
        bundleCode: row.bundleCode,
      }
      var [err, res] = await this.$to(API.AUpdateRemark(sendData)); if (err) { return false; }
      this.$Notice.success({ desc: res.returnMsg })
    },
    editActivedEvent ({ row, column }) {

    },
    editClosedEvent ({ row, column }) {
      this.updateRemark(row)
    },

    prePrintValidation () {
      //if (!this.itemTableList.length) {
      if (!this.list.length) {
        this.$Notice.warning({ desc: this.$t("msg_notice_145") });
        return false;
      }
      return true;
    },
    successHandle (res) {
      this.$Notice.success({ desc: res.returnMsg });
    },
    // 获取列表
    exportMatLabel() {
        //console.log("this.selectList",this.selectList)
        var eCommand =async () => {

        //var sendDataList = this.itemTableList.map(item => {
        //var sendDataList = this.list.map(item => {
        var sendDataList = this.selectList.map(item => {
            var qrCode ={
            SKU:item.matCode || "",
            'SkU Desc':item.matName || "",
            MfgID:item.ext3 || "",
            Batch:item.lotNumb || "",
            'Production Date': item.ext7 || "",
            'Expiration Date': item.ext8 || "",
            GRDATE_LOT: item.ext9 || "",
          }
          return {
            matCode: item.matCode || "",
            matName: item.matName || "",
            lotNumb: item.lotNumb || "",
            ext3: item.ext3 || "",
            ext7: item.ext7 || "",
            ext8: item.ext8 || "",
            ext9: item.ext9 || "",
            qrCodeValue:qrCode,
            whCode: item.whCode || "",
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
    printBarCode () {
      var eCommand = () => {

        //var sendDataList = this.selection.filter((item) => {
        //  return !item.children
        //})

          var sendDataList = this.selectList.map(item => {
            var qrCode ={
            SKU:item.matCode || "",
            'SkU Desc':item.matName || "",
            MfgID:item.ext3 || "",
            Batch:item.lotNumb || "",
            'Production Date': item.ext7 || "",
            'Expiration Date': item.ext8 || "",
            GRDATE_LOT: item.ext9 || "",
          }
          return {
            matCode: item.matCode || "",
            matName: item.matName || "",

            lotNumb: item.lotNumb || "",
            ext3: item.ext3 || "",
            ext7: item.ext7 || "",
            ext8: item.ext8 || "",
            ext9: item.ext9 || "",
            qrCodeValue:qrCode,
            whCode: item.whCode || "",
            host: "",
            port: 0,
            zplType: 0
          };
        });

        CAPI.APrintMat(sendDataList).then(res => {
          this.successHandle(res);
        });
      };

      if (this.prePrintValidation()) {
        this.$confirm({
          content: this.$t("msg_notice_551"),
          onOk: eCommand
        });
      }
    },

    //分页回调
    handlePageChange ({ currentPage, pageSize }) {
      this.head.pageIndex = currentPage;
      this.head.pageSize = pageSize;
      this.getData();
    },
    // // 排序回调
    // sortChange ({ column, property, order }) {
    //   // 用 DESC 表示按倒序排序(即：从大到小排序)
    //   // 用 ASC 表示按正序排序(即：从小到大排序)
    //   this.head.sortColumn = property;
    //   this.head.sortAscend = order === "asc";
    //   this.getData();
    // },
    // async exportExcel () {
    //   var sendData = Object.assign(this.head, this.formData, { totalCount: -1, paging: false });
    //   var [err, res] = await this.$to(API.AGetListPI(sendData)); if (err) { return false; }
    //   var data = res.data
    //   var excelList = this.tree2List(data.binList || [])
    //   this.$refs.sTable.exportData({
    //     filename: 'Physical Inventory',
    //     type: 'csv',
    //     isHeader: true,
    //     isFooter: true,
    //     data: excelList
    //   })
    // }
  }
};
</script>
