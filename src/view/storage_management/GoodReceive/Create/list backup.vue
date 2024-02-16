<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-19 10:40:01
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-30 15:12:50
 * @Description: description
 -->
<template>
  <div class="modal-body no-padding h100">
    <div class="i-box clearfix h100 x-height-table">
      <x-search-header @on-search="enterSearch">
        <template slot="head">
          <ButtonGroup>
            <!-- <Button icon="md-ionic" @click="synchronization"> {{ $t("btn_synchronization") }} </Button> -->
            <upload-excel-component :on-success="handleSuccess" :typeIO="1" />
          </ButtonGroup>
        </template>
        <template slot="body">
          <search-in flex :title="$t('receipt_type_desc_x')" required>
            <Select
              v-model="formData.receiptType"
              @on-change="receiptTypeChange"
            >
              <Option :value="101" :label="$t('mu_purchase_order')"></Option>
              <!-- <Option :value="102" :label="$t('mu_customer_return')"></Option> -->
              <Option :value="103" :label="$t('mu_transfer_in')"></Option>
              <Option :value="104" :label="$t('mu_adjustment_in')"></Option>
            </Select>
          </search-in>
          <!-- <search-in flex v-show="formData.receiptType === 102 || formData.receiptType === 103 || formData.receiptType === 104" :title="$t('DNumber')" required>
            <!-- <Input type="text" v-model="formData.poCode" :maxlength="20" /> -->
          <!-- <Select v-model="formData.poCode" clearable @on-change="DCChange" >
              <Option v-for="(item, i) in dcList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select>
          </search-in> -->
          <!-- <search-in flex :title="$t('DNumber')" required> -->
          <search-in flex v-show="formData.receiptType === 101" title="ASN#" required>
            <!-- <Input type="text" v-model="formData.poCode" :maxlength="20" /> -->
            <!-- <Select v-model="formData.poCode" clearable @on-change="DCChange" >
              <Option v-for="(item, i) in dcList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select> -->
            <!-- <AutoComplete clearable v-model="formData.poCode" :data="data3" :filter-method="filterMethod" style="width:200px"></AutoComplete> -->
            <AutoComplete clearable v-model="formData.shippingRef" :data="data3" :filter-method="filterMethod" style="width: 200px" ></AutoComplete>
          </search-in>
          <search-in flex v-show="formData.receiptType === 102 || formData.receiptType === 103 || formData.receiptType === 104" :title="$t('DNumber')" required>
            <AutoComplete clearable v-model="formData.shippingRef" :data="data3" :filter-method="filterMethod" style="width: 200px" ></AutoComplete>
          </search-in>
          <!-- <search-in flex v-show="formData.receiptType === 101" :title="$t('ShippingRef')" required>
            <!-- <Input type="text" v-model="formData.shippingRef" :maxlength="20" /> -->
          <!-- <Select v-model="formData.shippingRef" clearable @on-change="DCChange" @click.native="getDCList"> -->
          <!-- <Select v-model="formData.shippingRef" clearable @on-change="DCChange">
              <Option v-for="(item, i) in dcList" :value="item.value" :key="i" :label="item.label"></Option>
            </Select>
          </search-in> -->
          <Button icon="ios-search" @click="search" :disabled="findDisabled">{{
            $t("btn_find")
          }}</Button>
          <!-- <Button min-width="160" icon="ios-print-outline"  class="buttonPrint"  @click="exportMatLabel" :disabled="findDisabled">{{ $t("btn_label_export") }}</Button> -->
          <!-- <Button icon="ios-cloud-upload-outline" @click="exportExcel"> {{ $t('export_to_excel') }} </Button> -->
        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16" style="height: calc(100% - 220px)">
        <Tabs v-model="tabVisible" class="h100" @on-click="tabClickHandle">
          <TabPane :label="p1Label" name="p1">
            <vxe-table
              ref="tTable"
              :sync-resize="tabVisible"
              :data="todoList"
              height="auto"
              stripe
              show-overflow
              resizable
              row-id="_XID"
              highlight-cell
              :checkbox-config="{ reserve: true, highlight: true }"
              @checkbox-change="selectionChangeT"
              @checkbox-all="selectionChangeT"
            >
              <!-- <vxe-table-column field="cb" type="checkbox" width="60"></vxe-table-column> -->
              <vxe-table-column type="checkbox" width="30"></vxe-table-column>
              <vxe-table-column width="30">
                <template slot-scope="scope"   }>
                  <Icon
                    size="20"
                    type="md-add-circle"
                    v-if="scope.row.flag"
                    @click="addRow(scope.row, scope)"
                    v-show="scope.row.lotNumb.length === 0"
                  />
                  <Icon
                    size="20"
                    type="md-remove-circle"
                    v-if="!scope.row.flag"
                    @click="removeRow(scope.row)"
                  />
                </template>
              </vxe-table-column>
              <!-- <vxe-table-column min-width="20" field="receiptStatus" :title="$t('Status')">
              <template v-slot="{ row }">
                <span v-if="row.receiptStatus==20">Saved</span>
                <span v-if="row.receiptStatus!=20">Unsaved</span>
              </template>
            </vxe-table-column> -->
              <vxe-table-column min-width="10" field="ext0" title="ASN#"></vxe-table-column>
              <vxe-table-column min-width="40" field="receiptCode" :title="$t('DNumber')"></vxe-table-column>
              <!-- <vxe-table-column min-width="200" field="receiptType" :title="$t('receipt_type_desc_x')" :filters="filter" :filterMethod="filterMethod1" ></vxe-table-column> -->
              <vxe-table-column min-width="10" field="matCode" title="Item"></vxe-table-column>
              <vxe-table-column min-width="10" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
              <!-- <vxe-table-column min-width="10" field="vendorCode" title="MfgID"></vxe-table-column> -->
              <vxe-table-column min-width="10" field="ext3" title="MfgID">
                <template v-slot="{ row }">
                  <Input v-model="row.ext3" :maxlength="100" />
                </template>
              </vxe-table-column>
              <vxe-table-column min-width="10" field="lotNumb" :title="$t('Batch')">
                <template v-slot="{ row }">
                  <Input v-model="row.lotNumb" :maxlength="100" />
                </template>
              </vxe-table-column>
              <vxe-table-column min-width="10" field="ext7" :title="$t('prddate')">
                <template v-slot="{ row }">
                  <Input v-model="row.ext7" :maxlength="100" />
                </template>
              </vxe-table-column>
              <vxe-table-column min-width="10" field="ext8" :title="$t('expdate')">
                <template v-slot="{ row }">
                  <Input v-model="row.ext8" :maxlength="100" />
                </template>
              </vxe-table-column>
              <!-- <vxe-table-column min-width="10" field="ext9" title="GRDate_lot"> -->
                <!-- <template v-slot="{ row }"> -->
                  <!-- <Input v-model="row.ext9" :maxlength="100" /> -->
                  <!-- <DatePicker format="yyyy-MM-dd" type='date' v-model="row.ext9"  ></DatePicker> -->
                <!-- </template> -->
                <!-- <template v-slot="{ row }">
                  <Input v-model="row.ext9" :maxlength="100" />
                </template> -->
              <!-- </vxe-table-column> -->
              <vxe-table-column min-width="10" field="matExt1" title="UPC"></vxe-table-column>
              <!-- <vxe-table-column min-width="10" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
              <!-- <vxe-table-column min-width="200" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->  
              <vxe-table-column min-width="10" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
              <vxe-table-column min-width="10" field="ext4" :title="$t('Packing unit')"></vxe-table-column>
              <vxe-table-column min-width="10" field="receiptQty" :title="$t('Qty')"></vxe-table-column>
              <vxe-table-column min-width="70" field="actualWeightQty" :title="$t('ActQty')">
                <!-- <vxe-table-column min-width="200" field="bundleCode" :title="$t('Lotnumb')"></vxe-table-column>
            <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
                <!-- <template v-slot="{ row }">
                <el-input-number v-model="row.actualWeightQty" :min="0" :max="999999999" :precision="row.weightDecimalPlace"></el-input-number>
              </template> -->
                <!-- <template v-slot="{ row }">
                  <el-input-number :disabled="row.flag" v-model="row.actualWeightQty" :min="1" :max="row.xQty" @change="unpackChange(row)"></el-input-number>
                </template> -->
                <template v-slot="{ row }">
                  <el-input-number  v-model="row.actualWeightQty" :min="1" :max="row.xQty" @change="unpackChange(row)"></el-input-number>
                </template>
              </vxe-table-column>
              <vxe-table-column min-width="10" field="remark" title="Remark">
                <template v-slot="{ row }">
                  <Input v-model="row.remark" :maxlength="100" />
                </template>
              </vxe-table-column>
              <!-- <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
            </vxe-table>
          </TabPane>
          <!-- <vxe-table ref="sTable" >
            <vxe-table-column min-width="200" field="receiptCode" :title="$t('DNumber')"></vxe-table-column>
            <vxe-table-column min-width="160" field="matCode" title="Item"></vxe-table-column>
            <vxe-table-column min-width="200" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
            <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <vxe-table-column min-width="180" field="receiptQty" :title="$t('Qty')"></vxe-table-column>
            <vxe-table-column min-width="180" field="actualWeightQty" :title="$t('ActQty')"></vxe-table-column>
            <vxe-table-column min-width="180" field="remark" title="Remark"></vxe-table-column>
          </vxe-table> -->
          <TabPane :label="p2Label" name="p2">
            <vxe-table ref="sTable" :sync-resize="tabVisible" :data="savedList" height="auto" stripe show-overflow resizable row-id="xid" highlight-cell :checkbox-config="{ reserve: true, highlight: true }" @checkbox-change="selectionChangeS" @checkbox-all="selectionChangeS">
              <vxe-table-column type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column min-width="10" field="ext0" title="ASN#"></vxe-table-column>
              <vxe-table-column min-width="20" field="receiptCode" :title="$t('DNumber')"
              ></vxe-table-column>
              <!-- <vxe-table-column min-width="200" field="receiptType" :title="$t('receipt_type_desc_x')" :filters="filter" :filterMethod="filterMethod1" ></vxe-table-column> -->
              <vxe-table-column min-width="10" field="matCode" title="Item"></vxe-table-column>
              <vxe-table-column min-width="10" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
              <!-- <vxe-table-column min-width="10" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
              <!-- <vxe-table-column min-width="200" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->
              <vxe-table-column min-width="10" field="ext3" title="MfgID"></vxe-table-column>
              <vxe-table-column min-width="10" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
              <vxe-table-column min-width="10" field="ext7" :title="$t('prddate')"></vxe-table-column>
              <vxe-table-column min-width="10" field="ext8" :title="$t('expdate')"></vxe-table-column>
              <vxe-table-column min-width="10" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
              <vxe-table-column min-width="10" field="matExt1" title="UPC"></vxe-table-column>
              <vxe-table-column min-width="10" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
              <vxe-table-column min-width="10" field="ext4" :title="$t('Packing unit')"></vxe-table-column>
              <vxe-table-column min-width="10" field="receiptQty" :title="$t('Qty')"></vxe-table-column>
              <vxe-table-column min-width="10" field="actualWeightQty" :title="$t('ActQty')">
                <!-- <vxe-table-column min-width="200" field="bundleCode" :title="$t('Lotnumb')"></vxe-table-column>
            <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
                <!-- <template v-slot="{ row }">
                <el-input-number v-model="row.actualWeightQty" :min="0" :max="999999999" :precision="row.weightDecimalPlace"></el-input-number>
              </template> -->
              </vxe-table-column>
              <vxe-table-column min-width="10" field="remark" title="Remark">
                <!-- <template v-slot="{ row }">
                <Input v-model="row.remark" :maxlength="100" />
              </template> -->
              </vxe-table-column>
            </vxe-table>
          </TabPane>
        </Tabs>
      </Col>

      <div class="fixed-bottom">
        <button-expand :btnGroup="groupBtn" @on-ok="btnHandle" />
        <!-- <Button icon="ios-print-outline" type="primary" class="ivu-btn-button-create-ghost buttonPrint" @click="printBarCode">{{ $t("btn_print") }}</Button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { API } from "@A/warehouse/GoodReceive";
import { CAPI } from "@A/common";
// 按钮逻辑
import ButtonExpand from "_c/btnGroup/ButtonExpandBus.vue";
import UploadExcelComponent from "_c/UploadExcel/index.vue";
import request from "@/api/api.request.download";
import { downloadFile } from "@/libs/assist";

export default {
  components: { ButtonExpand, UploadExcelComponent },
  data() {
    return {
      tabVisible: "p1",
      p1Label: (h) => {
        return h("div", [
          h("span", "TODO LIST"),
          h("Badge", { props: { count: this.todoList.length } }),
        ]);
      },
      p2Label: (h) => {
        return h("div", [
          h("span", "SAVED"),
          h("Badge", { props: { count: this.savedList.length } }),
        ]);
      },
      filter: [
        {
          label: "Purchase Order",
          value: "101",
        },
        {
          label: "Customer Return",
          value: "102",
        },
        {
          label: "Adjustment IN",
          value: "103",
        },
      ],
      data3: [],
      dcList: [], //订单列表
      cropList: [], // 公司下拉
      todoList: [],
      savedList: [],
      completeList: [],
      selectionTodo: [],
      selectionSaved: [],
      receiptType: [101, 102, 104],
      formData: {
        receiptType: 101,
        corpCode: "",
        poCode: "",
        shippingRef: "",
        whCode: this.$store.getters.UserCropCode,   //2021-10-07 新加
      },
      groupBtn: {
        buttonSave: true,
        buttonSubmit: false,
        buttonDelete: false,
        buttonPrint: false,
      },
      // 分页\排序
      head: {
        paging: false,
        totalCount: -1,
        pageIndex: 1,
        pageSize: 100,
        sortColumn: "",
        sortAscend: true,
      },
    };
  },
  computed: {
    // findDisabled () {
    //   return ((this.formData.receiptType === 102 || this.formData.receiptType === 103 || this.formData.receiptType === 104 ) && this.formData.poCode == '') ||
    //     ((this.formData.receiptType === 101) && this.formData.shippingRef == '')
    // }
    findDisabled() {
      return (
        (this.formData.receiptType === 102 ||
          this.formData.receiptType === 103 ||
          this.formData.receiptType === 104 ||
          this.formData.receiptType === 101) &&
        this.formData.shippingRef == ""
      );
    },
    submitDisabled() {
      //console.log("this.$refs.tTable",this.$refs.tTable)
      if (typeof this.$refs.tTable != "undefined") {
        var column = this.$refs.tTable.getColumnByField("cb");
      }
      for (var i in this.todoList) {
        if (this.todoList[i].receiptStatus != 20) {
          //console.log("==================1")
          this.groupBtn.buttonSubmit = false;
          this.groupBtn.buttonSave = true;
          if (column) {
            column.visible = true;
            this.$refs.tTable.refreshColumn();
          }
          //this.cbvisibleEvent(false)
          return;
        }
      }
      if (this.todoList.length == 0) {
        //console.log("==================2")
        this.groupBtn.buttonSubmit = false;
        this.groupBtn.buttonSave = false;
        if (column) {
          column.visible = true;
          this.$refs.tTable.refreshColumn();
        }
      } else {
        //console.log("==================3")
        this.groupBtn.buttonSubmit = true;
        this.groupBtn.buttonSave = false;
        if (column) {
          column.visible = false;
          this.$refs.tTable.refreshColumn();
        }
      }
      //column.visible = false
      //this.$refs.tTable.refreshColumn()
      //this.cbvisibleEvent(true)
    },
  },
  created() {
    //var id = this.$route.params.id
    //var id = this.$route.query.id
    var id = this.$route.params.id;
    var type = this.$route.params.type;

    // this.getCropList()

    //this.getAllTodoList()
    //this.getAllTodoList_1() //继续调初始化列出所有任务列表用这个
    //if(typeof(id) != "undefined"){
    if (typeof id != "undefined" && typeof type != "undefined") {
      //console.log("id=",id)
      //id=id.replace(new RegExp(/(:)/g),"");
      this.formData.poCode = id;
      this.formData.receiptType = parseInt(type);
      this.getData();
    } else {
      this.getDCList(101);
    }
  },
  watch: {
    // submitDisabled(){}
  },
  methods: {
    exportMatLabel() {
      var eCommand = async () => {
        var sendDataList = this.selectionTodo.filter((item) => {
          return !item.children;
        });

        sendDataList = sendDataList.map((item) => {
          var qrCode = {
            DN: item.receiptCode || "",
            PO: item.shippingRef || "",
            SKU: item.matCode || "",
            Batch: item.lotNumb || "",
          };
          return {
            dn: item.receiptCode,
            po: item.shippingRef,
            batch: item.lotNumb,
            vendorCode: item.vendorCode,
            matCode: item.matCode,
            matName: item.matName,
            weightQty: item.weightQty || 0,
            whCode: item.whCode || "PS",
            binCode: item.binCode || "",
            heatNumber: item.heatCode || "",
            qrCodeValue: qrCode,
            shippingRef: item.shippingRef || "",
            skidNumber: item.skidCode || "",
            host: "",
            port: 0,
            zplType: 0,
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
          onOk: eCommand,
        });
      }
    },
    prePrintValidation() {
      if (!this.selectionTodo.length) {
        this.$Notice.warning({ desc: this.$t("msg_notice_145") });
        return false;
      }
      return true;
    },
    dateChangeHandle (date) {
      //console.log("date",date)
      //this.formData.sDate = date[0]
      //this.formData.eDate = date[1]
    },
    printBarCode() {
      var eCommand = () => {
        var sendDataList = this.selectionTodo.filter((item) => {
          return !item.children;
        });

        sendDataList = sendDataList.map((item) => {
          var qrCode = {
            DN: item.receiptCode || "",
            PO: item.shippingRef || "",
            SKU: item.matCode || "",
            Batch: item.lotNumb || "",
          };
          return {
            dn: item.receiptCode,
            po: item.shippingRef,
            batch: item.lotNumb,
            vendorCode: item.vendorCode,
            matCode: item.matCode,
            matName: item.matName,
            weightQty: item.weightQty || 0,
            whCode: item.whCode || "PS",
            binCode: item.binCode || "",
            heatNumber: item.heatCode || "",
            qrCodeValue: qrCode,
            shippingRef: item.shippingRef || "",
            skidNumber: item.skidCode || "",
            host: "",
            port: 0,
            zplType: 0,
          };
        });

        CAPI.APrintMat(sendDataList).then((res) => {
          this.successHandle(res);
        });
      };

      if (this.prePrintValidation()) {
        this.$confirm({
          content: this.$t("msg_notice_551"),
          onOk: eCommand,
        });
      }
    },
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    filterMethod1(value) {
      // console.log('value=',value)
      // console.log('value.row=',value.row)
      // console.log('value.row.receiptType',value.row.receiptType )
      return value.row.receiptType.toString() === value.value;
    },
    enterSearch() {
      if (this.findDisabled) {
        return false;
      }
      this.getData();
    },
    async getDCList(receiptType) {
      // var _ = require('lodash');
      //console.log('call getDClist')
      //console.log('receiptType=',receiptType)
      var [err, res] = await this.$to(
        API.AGetAllList({ receiptType: receiptType })
      );
      if (err) {
        return false;
      }
      //this.dcList = this.$kv(res.data.list, 'poCode', 'poCode', false)
      this.dcList = this.$kv(res.data.list, "ext0", "ext0", false);
      //console.log('this.dcList=',this.dcList)
      //console.log('end call getDClist')
      // if (receiptType === 102 || receiptType === 103 || receiptType === 104) {
      //   this.dcList = this.$kv(res.data.list, 'poCode', 'poCode', false)
      // } else {
      //   this.dcList = this.$kv(res.data.list, 'shippingRef', 'shippingRef', false)
      // }
      this.data3 = [];
      this.dcList.map((item) => this.data3.push(item.value));
    },
    // 订单号下拉改变方法
    DCChange(receiptCode) {
      //this.formData.poCode = ''
      //this.formData.poCode = receiptCode || ''
      this.formData.ext0 = receiptCode || "";
      //this.formData.typeCode = ''
      // 根据仓库号查询仓位下拉
      //whCode && this.getBinList()
    },
    // 获取列表
    async getData() {
      var sendData = Object.assign(this.head, this.formData, {
        totalCount: -1,
      });
      var [err, res] = await this.$to(API.AGetList(sendData));
      if (err) {
        return false;
      }
      var data = res.data;
      
      this.todoList = this.formatTodoList(data.resultMap.todoList);
      //console.log("this.todoList=",this.todoList)
      this.savedList = data.resultMap.savedList || [];
      this.completeList = data.resultMap.completeList || [];
      for(var i = 0; i < this.savedList.length; ++i) {
        //console.log("this.selectionTodo[i].ext9",this.savedList[i].ext9)
        this.savedList[i].ext9 = this.savedList[i].ext9.split("T")[0]
      
        // var stamp =Date.parse(this.savedList[i].ext9)/1000
        // var time = new Date(stamp)
        // console.log("time",time)
        // var year = time.getfullYear()
        // var month = time.getMonth()+1
        // var date = time.getDate()
        // var ret = year+"-"+month+"-"+date
        // console.log("ret",ret)
        //return year+"-"+month+"-"+date  
      }
      //this.todoList.push.apply(this.todoList,this.savedList)
      //console.log("this.todoList=",this.todoList)
      //console.log("this.savedList=",this.savedList)
      this.selectionTodo = [];
      this.selectionSaved = [];
      this.setOrgFlag(this.todoList);
    },
    async getAllTodoList_1() {
      this.formData.receiptType = "";
      var sendData = Object.assign(this.head, this.formData, {
        totalCount: -1,
      });
      var [err, res] = await this.$to(API.AGetAllTodoList(sendData));
      if (err) {
        return false;
      }
      var data = res.data;
      this.todoList = this.formatTodoList(data.resultMap.todoList);
      this.savedList = data.resultMap.savedList || [];
      this.completeList = data.resultMap.completeList || [];
      this.selectionTodo = [];
      this.selectionSaved = [];
    },
    async getAllTodoList() {
      var _ = require("lodash");
      //console.log('this.head=\n',this.head)
      //console.log('this.formData=\n',this.formData)
      var tmp = _.cloneDeep(this.formData);
      //console.log('tmp=\n', tmp)
      var index;
      for (index in this.receiptType) {
        tmp.receiptType = this.receiptType[index];
        //console.log('tmp.receiptType=\n',tmp.receiptType)
        //console.log('index=',index)
        await this.getDCList(tmp.receiptType).then(async () => {
          //console.log('this.dcList=',this.dcList)
          var dc;
          for (dc in this.dcList) {
            //console.log('dc=',dc)
            tmp.poCode = this.dcList[dc];
            //console.log("tmp.poCode=",tmp.poCode)
            var sendData = Object.assign(this.head, tmp, { totalCount: -1 });
            //console.log('senddata=\n',sendData)
            var [err, res] = await this.$to(API.AGetList(sendData));
            if (err) {
              return false;
            }
            var data = res.data;
            //console.log('data = \n',data)
            if (data.resultMap.todoList.length != 0) {
              var tmpList = this.formatTodoList(data.resultMap.todoList);
              for (var i in tmpList) {
                this.todoList.push(tmpList[i]);
                //console.log('this.todolist = \n',this.todoList)
              }
            }
          }
        });
      }

      //this.savedList = data.resultMap.savedList || []
      //this.completeList = data.resultMap.completeList || []
      this.selectionTodo = [];
      this.selectionSaved = [];
    },
    formatTodoList(list) {
      return list.map((item, i) => {
        item.xIndex = i;
        item.actualWeightQty = item.weightQty;
        return item;
      });
    },
    formatSaveList(list) {
      return list.map((item, i) => {
        item.xIndex = i;
        item.weightQty = item.actualWeightQty;
        return item;
      });
    },
    receiptTypeChange(receiptType) {
      this.dcList = [];
      this.getDCList(receiptType);
      // if (receiptType === 102 || receiptType === 103 || receiptType === 104) {
      //   this.formData.shippingRef = ''
      // } else {
      //   this.formData.poCode = ''
      // }
    },
    // 成功回调
    successHandle(res) {
      this.$Notice.success({ desc: res.returnMsg });
      this.getData();
      this.getDCList(101);
    },
    // 获取公司列表
    // async getCropList () {
    //   var [err, res] = await this.$to(CAPI.AGetCropList()); if (err) { return false }
    //   this.cropList = this.$kv(res.data, 'corpCode', 'corpName', true)
    // },
    formateDate(now){
        //console.log(now);
        var year = now.getfullYear()
        var month = now.getMonth()+1
        var date = now.getDate()
        var ret = year+"-"+month+"-"+date
        console.log(ret);
        return ret
    },

    async saveOrder() {
      //console.log("this.selectionTodo", this.selectionTodo);
      for (var i = 0; i < this.selectionTodo.length; ++i) {
        this.selectionTodo[i].lotNumb = this.selectionTodo[i].lotNumb.trim()
        // this.selectionTodo[i].ext9 = this.selectionTodo[i].ext9.trim()
        this.selectionTodo[i].ext7 = this.selectionTodo[i].ext7.trim()
        this.selectionTodo[i].ext3 = this.selectionTodo[i].ext3.trim()
        this.selectionTodo[i].ext8 = this.selectionTodo[i].ext8.trim()
        if (
          this.selectionTodo[i].lotNumb === "" ||
          typeof this.selectionTodo[i].lotNumb === "undefine" ||
          this.selectionTodo[i].lotNumb === null
        ) {
          this.$Notice.warning({ desc: this.$t("msg_notice_156") });
          return false;
        }

        if (
          this.selectionTodo[i].ext9 === "" ||
          typeof this.selectionTodo[i].ext9 === "undefine" ||
          this.selectionTodo[i].ext9 === null
        ) {
          this.$Notice.warning({ desc: this.$t("msg_notice_158") });
          return false;
        }

        if (
          this.selectionTodo[i].ext7 === "" ||
          typeof this.selectionTodo[i].ext7 === "undefine" ||
          this.selectionTodo[i].ext7 === null
        ) {
          this.$Notice.warning({ desc: this.$t("msg_notice_159") });
          return false;
        }
        if (
          this.selectionTodo[i].ext8 === "" ||
          typeof this.selectionTodo[i].ext8 === "undefine" ||
          this.selectionTodo[i].ext8 === null
        ) {
          this.$Notice.warning({ desc: this.$t("msg_notice_160") });
          return false;
        }
        if (
          this.selectionTodo[i].ext3 === "" ||
          typeof this.selectionTodo[i].ext3 === "undefine" ||
          this.selectionTodo[i].ext3 === null
        ) {
          console.log("here")
          this.$Notice.warning({ desc: this.$t("msg_notice_161") });
          return false;
        }
      }

      //------------------
      //将选中的要save的list 复制到临时数组中按照Batch去重，如果去重后的数组长度小于原数组长度，说明有重复batch
      var tmplist = Object.assign(this.selectionTodo);

      var obj = {};
      tmplist = tmplist.reduce(function (item, next) {
        obj[next.lotNumb] ? "" : (obj[next.lotNumb] = true && item.push(next));
        return item;
      }, []);


      if (tmplist.length != this.selectionTodo.length) {
        this.$Notice.warning({ desc: this.$t("msg_notice_157") });
        return false;
      }
      //-------------------
      var [err, res] = await this.$to(API.ASave(this.selectionTodo));
      if (err) {
        return false;
      }
      this.successHandle(res);
    },
    async submitOrder() {
      //var [err, res] = await this.$to(API.ASubmit(this.selectionTodo)); if (err) { return false }
      // var [err, res] = await this.$to(API.ASubmit(this.selectionSaved)); if (err) { return false }
      // this.successHandle(res)
      // this.selectionTodo = []
      // this.todoList = []
      // this.formData.shippingRef = ''
      // this.formData.poCode = ''
      // this.groupBtn.buttonSubmit = false
      this.formatSaveList(this.savedList);
      //console.log("this.savedList", this.savedList);
      var [err, res] = await this.$to(API.ASubmit(this.savedList));
      if (err) {
        return false;
      }
      //console.log("res", res);
      this.$Notice.success({ desc: res.returnMsg });
      this.todoList = [];
      this.savedList = [];
      this.selectionTodo = [];
      this.selectionSaved = [];
      this.formData.poCode = "";
      this.getDCList(101);
    },
    async deleteOrder() {
      var [err, res] = await this.$to(API.ADelete(this.selectionSaved));
      if (err) {
        return false;
      }
      this.successHandle(res);
    },
    // 保存校验
    preSaveValidation() {
      if (!this.selectionTodo.length) {
        this.$Notice.warning({ desc: this.$t("msg_notice_145") });
        return false;
      }
      // if (this.selectionTodo.some((item) => { return !item.actualWeightQty })) {
      //   this.$Notice.warning({ desc: 'The data entered must be numeric and cannot be zero (0).' })
      //   return false
      // }
      return true;
    },
    // 提交校验
    preCommitValidation() {
      // if (this.todoList.length) {
      //   this.$Notice.warning({ desc: this.$t('msg_notice_900') })
      //   return false
      // }

      // if (!this.savedList.length) {
      //   this.$Notice.warning({ desc: this.$t('msg_notice_145') })
      //   return false
      // }

      return true;
    },
    // 删除校验
    preDeleteValidation() {
      if (!this.selectionSaved.length) {
        this.$Notice.warning({ desc: this.$t("msg_notice_145") });
        return false;
      }
      return true;
    },
    btnHandle(type) {
      switch (type) {
        case "buttonSave":
          if (this.preSaveValidation()) {
            this.$confirm({
              content: this.$t("msg_notice_27"),
              onOk: () => {
                this.saveOrder();
              },
            });
          }
          break;
        case "buttonSubmit":
          if (this.preCommitValidation()) {
            //if (this.preSaveValidation()) {
            this.$confirm({
              content: this.$t("msg_notice_26"),
              onOk: () => {
                this.submitOrder();
              },
            });
          }
          break;
        case "buttonDelete":
          if (this.preDeleteValidation()) {
            this.$confirm({
              content: this.$t("msg_notice_74"),
              onOk: () => {
                this.deleteOrder();
              },
            });
          }
          break;
        default:
          return false;
      }
    },
    search() {
      this.getData();
      //this.cbvisibleEvent(this.groupBtn.buttonSubmit)
    },
    // 表格选中改变
    selectionChangeT({ selection }) {
      this.selectionTodo = selection;
    },
    selectionChangeS({ selection }) {
      this.selectionSaved = selection;
    },
    // Tab切换
    tabClickHandle(name) {
      //console.log("name",name)
      if (name === "p1") {
        this.groupBtn.buttonSave = true;
        this.groupBtn.buttonSubmit = false;
        this.groupBtn.buttonDelete = false;
      } else {
        this.groupBtn.buttonSave = false;
        this.groupBtn.buttonSubmit = true;
        this.groupBtn.buttonDelete = true;
      }
    },
    async synchronization() {
      switch (this.formData.receiptType) {
        case 101: // purchase_order
          if (!this.preCommitValidationShippingRef()) {
            return false;
          }
          this.synPoreceive({ ShippingRef: this.formData.shippingRef });
          break;
        case 102: // customer_return
          if (!this.preCommitValidationReceiptCode()) {
            return false;
          }
          this.synPoreceive({
            ShippingRef: this.formData.shippingRef,
            DocumentCode: this.formData.poCode,
          });
          break;
        case 103: // transfer_in
          if (!this.preCommitValidationReceiptCode()) {
            return false;
          }
          this.synTransferin({ DocumentCode: this.formData.poCode });
          break;
        case 104: // adjustment_in
          if (!this.preCommitValidationReceiptCode()) {
            return false;
          }
          this.synAdjustmentin({ DocumentCode: this.formData.poCode });
          break;
      }
    },
    preCommitValidationReceiptCode() {
      if (!this.formData.poCode) {
        this.$Notice.warning({ desc: this.$t("msg_notice_878") });
        return false;
      }
      return true;
    },
    preCommitValidationShippingRef() {
      if (!this.formData.shippingRef) {
        this.$Notice.warning({ desc: this.$t("msg_notice_877") });
        return false;
      }
      return true;
    },
    async synPoreceive(sendData) {
      var [err, res] = await this.$to(API.ASynPoreceive(sendData));
      if (err) {
        return false;
      }
      this.$Notice.success({
        desc: res.returnMsg + res.data[0].result + " Item.",
      });
    },
    async synTransferin(sendData) {
      var [err, res] = await this.$to(API.ASynTransferin(sendData));
      if (err) {
        return false;
      }
      this.$Notice.success({
        desc: res.returnMsg + res.data[0].result + " Item.",
      });
    },
    async synAdjustmentin(sendData) {
      var [err, res] = await this.$to(API.ASynAdjustmentin(sendData));
      if (err) {
        return false;
      }
      this.$Notice.success({
        desc: res.returnMsg + res.data[0].result + " Item.",
      });
    },
    async handleSuccess(results) {
      var sendData = results.results;
      //console.log('sendData=',sendData)
      var [err, res] = await this.$to(API.AUploadList(sendData));
      if (err) {
        return false;
      }
      this.$Notice.success({ desc: res.returnMsg });
      this.getDCList(this.formData.receiptType);
    },
    cbvisibleEvent(visible1) {
      //console.log("visible1",visible1)
      var column = this.$refs.tTable.getColumnByField("cb");
      if (column) {
        column.visible = !visible1;
        //console.log("column.visible",column.visible)
        this.$refs.tTable.refreshColumn();
      }
    },
    setOrgFlag(arry) {
      var arryNew = [];
      arry.map((item, index) => {
        item.flag = true;
        item.disableEdit = false;
        item.xQty = item.actualWeightQty;
        item.alreadySepQty = 0;
        //console.log('item.xQty=\n',item.xQty)
        return item;
      });
    },
    getTotalQty(row) {
      //console.log('getTotalQty row=\n',row)
      //console.log('this.todolist=\n',this.todoList)
      var totalQty = 0;
      this.todoList.forEach((item) => {
        if (row.groupID === item.groupID) {
          totalQty = totalQty + item.actualWeightQty;
        }
      });
      //console.log('totalQty=',totalQty)
      return totalQty;
    },
    addRow(row, scope) {
      //console.log('scope.rowIndex=\n',scope.rowIndex)
      if (row.actualWeightQty <= 1) {
        return;
      }
      var _ = require("lodash");
      var b = _.cloneDeep(row);

      //设置新节点属性
      b.actualWeightQty = 1; //新的子节点默认qty为1
      b.ext5='Y'
      b._XID = ""; //新节点自动生成ID
      b.groupID = row._XID;
      b.parent = row._XID;
      b.flag = false; //false表示是子节点
      b.disableEdit = false; //子节点可以编辑
      b.xQty = row.xQty - 1; //设置新行的最大值为 父行最大值减去已经分配出去的值

      //设置父节点属性
      row.actualWeightQty = row.actualWeightQty - 1;
      row.ext5='Y'
      //this.todoList.push(b)
      this.todoList.splice(scope.rowIndex + 1, 0, b);
    },
    removeRow(row) {
      //console.log('removeRow')
      var _ = require("lodash");
      _.pull(this.todoList, row);
      var arr = []; //新数组
      this.todoList.forEach((item) => {
        if (row.parent === item._XID) {
          //item.weightQty = calculate.plus(item.weightQty, weightQty)
          item.actualWeightQty = item.actualWeightQty + row.actualWeightQty;
          //console.log('item',item)
          //console.log('row.actualWeightQty',row.actualWeightQty)
          if(item.actualWeightQty == item.weightQty){
            item.ext5 = 'N'
          }
          //item.receiptQty= item.receiptQty+row.receiptQty
        }
        arr.push(item);
      });
      this.todoList = arr; //相当于返回一个新数组可以触发渲染
    },
    unpackChange(row) {
      var checkQty = 0;
      var pWQty = 0;
      this.todoList.forEach((item) => {
        if (row.groupID === item._XID) {
          //找到父节点 item 是父节点
          checkQty = item.xQty - this.getTotalQty(row); //计算父节点的wqyt
          if (checkQty >= 1) {
            item.actualWeightQty = checkQty;
            pWQty = item.actualWeightQty;
          } else {
            return;
          }
        }
      });
      //更新所有行的上限
      //console.log('pwqty=',pWQty)
      this.todoList.forEach((item) => {
        if (row.groupID === item.groupID) {
          item.xQty = item.actualWeightQty + pWQty - 1;
          //console.log('item.xQty=',item.xQty)
        }
      });

      var arr = []; //新数组
      this.todoList.forEach((item) => {
        arr.push(item);
      });
      this.todoList = arr; //相当于返回一个新数组可以触发渲染
    },
    exportExcel() {
      var excelList = this.todoList;
      //console.log('excelList=',excelList)
      this.$refs.sTable.exportData({
        filename: "Receiving Task List",
        type: "csv",
        isHeader: true,
        isFooter: true,
        data: excelList,
      });
    },
  },
};
</script>
