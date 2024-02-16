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
          <!-- <search-in flex :title="$t('DNumber')"> -->
          <search-in flex title="ASN#">
            <!-- <Input type="text" v-model="formData.receiptCode" :maxlength="20" /> -->
            <Input type="text" v-model="formData.shippingRef" :maxlength="20" />
          </search-in>
          <!-- <search-in flex :title="$t('ShippingRef')">
            <Input type="text" v-model="formData.shippingRef" :maxlength="20" />
          </search-in> -->
          <!-- <search-in flex :title="$t('col_date')">
            <DatePicker type="daterange" split-panels @on-change="dateChangeHandle"></DatePicker>
          </search-in> -->
          <ButtonGroup>
            <Button icon="ios-search" @click="search"> {{ $t("btn_find") }} </Button>
            <!-- <Button icon="ios-print-outline" type="primary" class="ivu-btn-button-create-ghost buttonPrint" @click="printBarCode">{{ $t("btn_print") }}</Button> -->
            <!-- <Button type="primary" @click="exportMatLabel" icon="ios-print-outline">{{ $t('btn_label_print') }}</Button> -->
          </ButtonGroup>
        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16">
      <vxe-table ref="sTable" max-height="600" :sync-resize="tabVisible" :data="completeList" stripe show-overflow resizable :checkbox-config="{ reserve: true, highlight: true }" :tree-config="{ children: 'children' }" @checkbox-change="selectionChange" @checkbox-all="selectionChange">
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column min-width="250" field="id" title="ASN#" tree-node>
          <template v-slot="{ row }">
            <span v-if="row.parent">
              <span class="margin-r-10">{{row.id}}</span>
              <Button v-if="row.receiptStatus == 90" @click="cancelOrderHandle(row)" size="small">{{ $t('btn_reverse') }}</Button>
            </span>
          </template>
        </vxe-table-column>
        <!-- <vxe-table-column min-width="250" field="id" :title="$t('DNumber')" tree-node> -->
        <vxe-table-column min-width="250" field="receiptCode" :title="$t('DNumber')" tree-node>
<!--          <template v-slot="{ row }">-->
<!--            <span v-if="row.parent">-->
<!--              <span class="margin-r-10">{{row.id}}</span>-->
<!--              <Button v-if="row.receiptStatus == 90" @click="cancelOrderHandle(row)" size="small">{{ $t('btn_reverse') }}</Button>-->
<!--            </span>-->
<!--          </template>-->

          <template v-slot="{ row }">
            <div v-if="!row.parent">
              <a href="#" class="margin-r-10" @click="showModal(row.receiptCode)">{{row.receiptCode}}</a>
            </div>
          </template>

        </vxe-table-column>
        <vxe-table-column min-width="60" field="shippingRef" :title="$t('PO')" ></vxe-table-column>
        <vxe-table-column min-width="60" field="matCode" title="Item"></vxe-table-column>
        <vxe-table-column min-width="60" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="200" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="60" field="vendorCode" title="MfgID"></vxe-table-column> -->
        <vxe-table-column min-width="60" field="ext3" title="MfgID"></vxe-table-column>
        <vxe-table-column min-width="60" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
        <vxe-table-column min-width="60" field="ext7" :title="$t('prddate')"></vxe-table-column>
        <vxe-table-column min-width="60" field="ext8" :title="$t('expdate')"></vxe-table-column>
        <vxe-table-column min-width="60" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
        <vxe-table-column min-width="60" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
        <vxe-table-column min-width="80" field="receiptQty" :title="$t('ReceiptQty')"></vxe-table-column>
        <vxe-table-column min-width="80" field="actualWeightQty" :title="$t('ActQty')"></vxe-table-column>
        <!-- <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="200" field="receiptCode" :title="$t('DNumber')"></vxe-table-column> -->
        <vxe-table-column min-width="180" field="remark" title="Remark"></vxe-table-column>
        <!-- <vxe-table-column min-width="180" field="createTime" :title="$t('Time')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
        <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
      </vxe-table>

      <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange">
      </x-vxe-pager>
      </Col>

      <div class="fixed-bottom">
        <Button icon="ios-print-outline" type="primary" class="ivu-btn-button-create-ghost buttonPrint" @click="printBarCode">{{ $t("btn_print") }}</Button>
        <!-- <Button  type="primary" @click="exportMatLabel" icon="ios-print-outline">{{ $t('btn_label_export') }}</Button> -->
      </div>
    </div>

    <Modal v-model="modalSignatureImg">
        <h3 slot="header" style="color:#f60;text-align:center">
          Upload image--<span style="padding-left:5px; color:orange;">Document Number : {{documentNo}}</span>
        </h3>
        <div style="text-align:center">
          <img :src="imgPath" width="400" height="300">
        </div>

        <div slot="footer">
          <Upload
              :action="action"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              accept="image/png, image/jpeg, image/jpg"
              :headers="headers"
          >
              <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </div>
    </Modal>


  </div>
</template>

<script>
import { API } from "@A/warehouse/GoodReceive";
import { CAPI } from "@A/common";
import request from "@/api/api.request.download";
import { downloadFile, getProUri } from "@/libs/assist";
import { getToken } from '@/libs/utils';

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
        shippingRef: "",
        whCode: this.$store.getters.UserCropCode,     //2021-10-07 仓库代码   新加赋值语句
      },
      // 分页\排序
      head: {
        paging: true,
        totalCount: -1,
        pageIndex: 1,
        pageSize: 100,
        sortColumn: "",
        sortAscend: true
      },
      modalSignatureImg: false,
      documentNo: '',
      action: '',
      headers: {
        'Authorization': getToken()
      },
      imgPath: 'static/logo.png',
    };
  },

  created () {
    // this.getCropList()
  },
  methods: {
    // 获取列表
    async getData () {
      var sendData = Object.assign(this.head, this.formData, {
        totalCount: -1
      });
      var [err, res] = await this.$to(API.AGetListPage(sendData));
      if (err) {
        return false;
      }
      this.head.totalCount = res.data.totalCount;
      //console.log(res.data.list)
      this.completeList = this.dataSort(res.data.list) || [];
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
        // ai.id = ai.receiptCode
        ai.id = ai.ext0
        if (!data1[ai.id]) {
          value1.push({
            id: ai.id,
            receiptStatus: ai.receiptStatus,
            //receiptCode: ai.receiptCode,
            //shippingRef: ai.shippingRef,
            ext0: ai.ext0,
            receiptType: ai.receiptType,
            poCode: ai.receiptCode,
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
      this.getData();
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
      this.getData();
    },
    printBarCode () {
      var eCommand = () => {

        var sendDataList = this.selection.filter((item) => {
          return !item.children
        })

        sendDataList = sendDataList.map(item => {
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
    // 取消回调
    cancelOrderHandle (row) {
      this.$confirm({
        content: this.$t("msg_notice_558"),
        onOk: () => {
          this.cancelOrder(row.poCode);
        }
      });
    },
    async cancelOrder (receiptCode) {
      var [err, res] = await this.$to(API.AReverse(receiptCode));
      if (err) {
        return false;
      }
      this.successHandle(res);
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
    exportMatLabel() {
      var eCommand =async () => {

        var sendDataList = this.selection.filter((item) => {
          return !item.children
        })
        sendDataList = sendDataList.map(item => {
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

    showModal(docNo) {
      this.modalSignatureImg = true
      this.documentNo = docNo
      this.action = getProUri(this, 'images/upload/' + docNo)
      this.imgPath = '';
      this.getImageCode('org', docNo)
    },
    handleSuccess (res, file, fileList) {
      // console.log("handleSuccess-res : ", res)
      // console.log("handleSuccess-file : ", file)
      // console.log("handleSuccess-fileList : ", fileList)
      if (res.returnCode === 1) {
          // file.name = res.data.imgName
          // file.imgName = res.data.imgName
          // file.imgCode = res.data.imgCode
          // file.createUserId = res.data.createUserId
          // file.createUserName = res.data.userName
          // file.createTime = res.data.createTime
          // file.fileExt = res.data.imgExt
          this.imgPath = getProUri(this, `images/img/org/${res.data.imgCode}`)
          // 上传成功添加一条
          // this.defaultList.push(file)
          // this.$emit('uploadFinished')
          // this.$emit('changeFile', this.defaultList)
      }
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: 'The file format is incorrect',
            desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
    },
    handleMaxSize (file) {
        this.$Notice.warning({
            title: 'Exceeding file size limit',
            desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
    },
    async getImageCode(type, docNo){
      var [err, res] = await this.$to(API.AGetImgCode(type, docNo));
      if (err) {
        this.imgPath = 'https://inossem.ca/img/logo.png'
      }
      this.imgPath = getProUri(this, `images/img/org/${res.data}`)
    }

  }
};
</script>
