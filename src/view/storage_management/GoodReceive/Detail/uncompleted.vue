<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-19 10:40:01
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-18 11:53:23
 * @Description: description
 -->
<template>
  <div class="modal-body padding-bottom-fixed">
    <div class="i-box clearfix">
      <x-search-header @on-search="search">
        <!-- <template slot="head">
          <ButtonGroup>
            <Button icon="ios-search" @click="search"> {{ $t("btn_find") }} </Button>
          </ButtonGroup>
        </template> -->
        <template slot="body">
          <!-- <search-in flex :title="$t('receipt_type_desc_x')"> -->
            <!-- <Select v-model="formData.receiptType"> -->
              <!-- <Option :value="101" :label="$t('mu_purchase_order')"></Option> -->
              <!-- <Option :value="102" :label="$t('mu_customer_return')"></Option> -->
              <!-- <Option :value="103" :label="$t('mu_transfer_in')"></Option> -->
              <!-- <Option :value="104" :label="$t('mu_adjustment_in')"></Option> -->
            <!-- </Select> -->
          <!-- </search-in> -->
          <search-in flex :title="$t('DNumber')">
            <Input type="text" v-model="formData.receiptCode" :maxlength="20" />
          </search-in>
          <!-- <search-in flex :title="$t('ShippingRef')">
            <Input type="text" v-model="formData.shippingRef" :maxlength="20" />
          </search-in> -->
          <!-- <search-in flex :title="$t('col_date')">
            <DatePicker type="daterange" split-panels @on-change="dateChangeHandle"></DatePicker>
          </search-in> -->
          <ButtonGroup>
            <Button icon="ios-search" @click="search"> {{ $t("btn_find") }} </Button>
          </ButtonGroup>
        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16">
      <vxe-table ref="sTable" max-height="507" :sync-resize="tabVisible" :data="completeList" stripe show-overflow resizable :checkbox-config="{ reserve: true, highlight: true }" :tree-config="{ children: 'children' }" @checkbox-change="selectionChange" @checkbox-all="selectionChange">
        <!-- <vxe-table-column type="checkbox" width="60"></vxe-table-column> -->
        <vxe-table-column min-width="250" field="id" :title="$t('DNumber')" tree-node>
          <template slot-scope="scope">
            <a :href="'good_receive_create/'+scope.row.id+'/'+scope.row.receiptType" target="_Parent" class="buttonText">{{scope.row.id}}</a>
            <!-- <a :href="'http://www.baidu.com'" target="_blank" class="buttonText">{{scope.row.id}}</a> -->
          </template>
        <!-- <vxe-table-column min-width="250" field="poCode" :title="$t('DNumber') "> -->
          <!-- <template v-slot="{ row }">
            <span v-if="row.parent">
              <span class="margin-r-10">{{row.id}}</span>
              <Button @click="sendEmail(row)" size="small">{{ $t('btn_export') }}</Button>
            </span>
          </template> -->
        </vxe-table-column>
        <vxe-table-column min-width="100" field="status" :title="$t('Status')">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">Not Started</span>
            <span v-if="scope.row.status==20">Partial Saved</span>
          </template>
        </vxe-table-column>
        <vxe-table-column min-width="250" field="receiptType" :title="$t('DocumentType')">
          <template slot-scope="scope">
            <span v-if="scope.row.receiptType==101">Inbound deliver note</span>
            <span v-if="scope.row.receiptType==102">Customer Return</span>
            <span v-if="scope.row.receiptType==103">Transfer In</span>
            <span v-if="scope.row.receiptType==104">Adjustment In</span>
          </template>
        </vxe-table-column>
        <vxe-table-column min-width="160" field="matCode" title="Item"></vxe-table-column>
        <vxe-table-column min-width="200" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
        <vxe-table-column min-width="160" field="ext0" :title="$t(' VIN # or S/N ')"></vxe-table-column>
        <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column>
        <!-- <vxe-table-column min-width="200" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->
        <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
        <vxe-table-column min-width="180" field="receiptQty" :title="$t('ReceiptQty')"></vxe-table-column>
        <!-- <vxe-table-column min-width="180" field="actualWeightQty" :title="$t('ActQty')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="200" field="receiptCode" :title="$t('DNumber')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="remark" title="Remark"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="createTime" :title="$t('Time')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
        <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
      </vxe-table>

      <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange">
      </x-vxe-pager>
      </Col>

      <div class="fixed-bottom">
        <!-- <Button icon="ios-print-outline" type="primary" class="ivu-btn-button-create-ghost buttonPrint" @click="printBarCode">{{ $t("btn_print") }}</Button> -->
        <!-- <Button  type="primary" @click="exportMatLabel" icon="ios-print-outline">{{ $t('btn_label_print') }}</Button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { API } from "@A/warehouse/GoodReceive";
import { CAPI } from "@A/common";
import request from "@/api/api.request.download";
import { downloadFile } from "@/libs/assist";

export default {
  data () {
    return {
      tabVisible: "p3",
      cropList: [], // 公司下拉
      completeList: [],
      selection: [],
      formData: {
        receiptCode: "",
        createStartTime: "",
        createEndTime: "",
        //receiptType: 101,
        corpCode: "",
        poCode: "",
        shippingRef: ""
      },
      // 分页\排序
      head: {
        paging: true,
        totalCount: -1,
        pageIndex: 1,
        pageSize: 100,
        sortColumn: "",
        sortAscend: true
      }
    };
  },
  created () {
    // this.getCropList()
  },
  methods: {
    // 获取列表
    async getDCList (receiptType) {
      // var _ = require('lodash');
      //console.log('call getDClist')
      //console.log('receiptType=',receiptType)
      //var [err, res] = await this.$to(API.AGetAllList({"receiptType":receiptType})); if (err) { return false }
      var sendData = Object.assign(this.head, this.formData, {
        totalCount: -1
      });
      //var [err, res] = await this.$to(API.AGetUncompleteList({"receiptCode":this.formData.receiptCode})); if (err) { return false }
      var [err, res] = await this.$to(API.AGetUncompleteList(sendData)); if (err) { return false }
      this.dcList = this.$kv(res.data.list, 'poCode', 'poCode', false)
      //console.log('this.dcList=',this.dcList)
      //console.log("res=",res)
      this.head.totalCount = res.data.totalCount;
      //console.log(res.data.list)
      //this.completeList = this.dataSort(res.data.resultMap.todoList) || [];
      //this.completeList = res.data.list
      //console.log(res.data.list)
      for (let i = 0; i < res.data.list.length; i++) {
        res.data.list[i].status = res.data.list[i].receiptStatus + res.data.list[i].iReceiptStatus
      }
      this.completeList = this.dataSort(res.data.list)||[]
      //this.completeList = this.dataSort(res.data.list) || [];
      //console.log('end call getDClist')
      // if (receiptType === 102 || receiptType === 103 || receiptType === 104) {
      //   this.dcList = this.$kv(res.data.list, 'poCode', 'poCode', false)
      // } else {
      //   this.dcList = this.$kv(res.data.list, 'shippingRef', 'shippingRef', false)
      // }
      //this.data3 = []
      //this.dcList.map(item=>this.data3.push(item.value))
      this.head.totalCount = res.data.totalCount;
    },
    async getData () {
      // var sendData = Object.assign(this.head, this.formData, {
      //   totalCount: -1
      // });
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 })
      var [err, res] = await this.$to(API.AGetAllTodoList(sendData)); if (err) { return false }
      //var data = res.data
      // var [err, res] = await this.$to(API.AGetListPage(sendData));
      // if (err) {
      //   return false;
      // }
      //console.log(res)
      //console.log("res=",res)
      this.head.totalCount = res.data.totalCount;
      //console.log(res.data.list)
      this.completeList = this.dataSort(res.data.resultMap.todoList) || [];
    },
    dateChangeHandle (date) {
      this.formData.createStartTime = date[0];
      this.formData.createEndTime = date[1];
    },
    dataSort (data) {
      let data1 = {}
      let value1 = []
      for (let i = 0; i < data.length; i++) {
        let ai = data[i]
        // if (this.formData.receiptType === 101) {
        //   //ai.id = ai.shippingRef
        //   ai.id = ai.receiptCode
        // } else if (this.formData.receiptType === 102 || this.formData.receiptType === 103 || this.formData.receiptType === 104) {
        //   ai.id = ai.receiptCode
        // }
        //ai.id = ai.receiptCode
        ai.id = ai.poCode
        if (!data1[ai.id]) {
          value1.push({
            id: ai.id,
            receiptType: ai.receiptType,
            status: ai.status,
            receiptStatus: ai.receiptStatus,
            //receiptCode: ai.receiptCode,
            receiptCode: ai.poCode,
            shippingRef: ai.shippingRef,
            //receiptType: ai.receiptType,
            //poCode: ai.receiptCode,
            poCode: ai.poCode,
            parent: true,
            children: [ai]
          })
          data1[ai.id] = ai
        } else {
          for (let j = 0; j < value1.length; j++) {
            let dj = value1[j]
            if (dj.id === ai.id) {
              dj.children.push(ai)
              break
            }
          }
        }
      }
      return value1
    },
    // 获取公司列表
    // async getCropList () {
    //   var [err, res] = await this.$to(CAPI.AGetCropList()); if (err) { return false }
    //   this.cropList = this.$kv(res.data, 'corpCode', 'corpName', true)
    // },
    search () {
      //this.getData();
      this.getDCList();
    },
    prePrintValidation () {
      if (!this.selection.length) {
        this.$Notice.warning({ desc: this.$t("msg_notice_145") });
        return false;
      }
      return true;
    },
    // 成功回调
    successHandle (res) {
      this.$Notice.success({ desc: res.returnMsg });
    },
    printBarCode () {
      var eCommand = () => {

        var sendDataList = this.selection.filter((item) => {
          return !item.children
        })

        sendDataList = sendDataList.map(item => {
          var qrCode ={
            DN:item.receiptCode || "",
            PO:item.shippingRef || "",
            SKU:item.matCode || "",
            Batch:item.lotNumb || ""
          } 
          return {
            dn:item.receiptCode,
            po:item.shippingRef,
            batch:item.lotNumb,
            vendorCode: item.vendorCode,
            matCode: item.matCode,
            matName: item.matName,
            weightQty: item.weightQty || 0,
            whCode: item.whCode || "CB01",
            binCode: item.binCode || "",
            heatNumber: item.heatCode || "",
            qrCodeValue: qrCode,
            shippingRef: item.shippingRef || "",
            skidNumber: item.skidCode || "",
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
    sendEmail (row) {
      // var sendData = {
      //   receiptCode: row.receiptCode,
      //   shippingRef: row.shippingRef,
      //   receiptType: row.receiptType,
      // }
      var excelList = row.children || []
        this.$refs.sTable.exportData({
          filename: 'Received',
          type: 'csv',
          isHeader: true,
          isFooter: true,
          data: excelList
        })
      // var eCommand = () => {
      //   // CAPI.ASendEmail(sendData).then(res => {
      //   //   this.successHandle(res);
      //   // });
      // };
      // this.$confirm({
      //   content: this.$t("msg_notice_552"),
      //   onOk: eCommand
      // });
    },
    // 表格选中改变
    selectionChange ({ selection }) {
      this.selection = selection;
    },
    // 分页回调
    handlePageChange ({ currentPage, pageSize }) {
      this.head.pageIndex = currentPage;
      this.head.pageSize = pageSize;
      //this.getData();
      this.getDCList()
    },
    // 排序回调
    sortChange ({ column, property, order }) {
      // 用 DESC 表示按倒序排序(即：从大到小排序)
      // 用 ASC 表示按正序排序(即：从小到大排序)
      this.head.sortColumn = property;
      this.head.sortAscend = order === "asc";
      //this.getData();
      this.getDCList();

    },
    exportMatLabel() {
      var eCommand =async () => {

        var sendDataList = this.selection.filter((item) => {
          return !item.children
        })
        sendDataList = sendDataList.map(item => {
          return {
            vendorCode: item.vendorCode,
            matCode: item.matCode,
            matName: item.matName,
            weightQty: item.weightQty || 0,
            whCode: item.whCode || "S01",
            binCode: item.binCode || "",
            heatNumber: item.heatCode || "",
            qrCodeValue: item.bundleCode,
            shippingRef: item.shippingRef || "",
            skidNumber: item.skidCode || "",
            host: "",
            port: 0,
            zplType: 0
          };
        });

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
  }
};
</script>
