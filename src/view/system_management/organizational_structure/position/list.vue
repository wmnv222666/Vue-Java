<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24" class="margin-b-16">
            <!-- 新增 -->
            <ButtonGroup>
              <Button @click="search" icon="ios-search">{{ $t('btn_find') }}</Button>
              <Button @click="printLocation" icon="ios-print-outline">{{ $t('btn_print') }}</Button>
              <!-- <Button @click="exportBinLabel" icon="ios-print-outline">{{ $t('btn_label_export') }}</Button> -->
<!--              <Button @click="show('', '')" icon="md-add">{{ $t('btn_new') }}</Button>-->
              <!-- <upload-excel-component :on-success="handleSuccess" :typeIO="3" /> -->
            </ButtonGroup>

            <!-- <div class="pull-right"> -->
            <div class="pull-right">
              <!-- 仓库号 -->
              <!-- <search-in :title="$t('lbl_wh_code')" class="margin-right-15">
                <Select
                  class="search-group-input"
                  v-model="formData.whCode"
                  clearable
                  @on-change="whChange"
                >
                  <Option
                    v-for="(item, i) in whList"
                    :value="item.value"
                    :key="i"
                    :label="item.label"
                  ></Option>
                </Select>
              </search-in> -->
              <!-- 存储类型 -->
              <search-in  title="Zone" class="margin-right-15">
                <Input type="text" v-model="formData.typeCode" />
              </search-in>
              <search-in  :title="$t('LocationCode')" class="margin-right-15">
                <Input type="text" v-model="formData.binCode" />
              </search-in>
              <!-- <search-in :title="$t('ZoneCode')" class="margin-right-15">
                <Select
                  class="search-group-input"
                  v-model="formData.typeCode"
                  clearable
                  @on-change="typeChange"
                >
                  <Option
                    v-for="(item, i) in storeTypeList"
                    :value="item.value"
                    :key="i"
                    :label="item.label"
                  ></Option>
                </Select>
              </search-in> -->
              <!-- 仓位 -->
              <!-- <search-in :title="$t('LocationCode')" class="margin-right-15">
                <Input class="search-group-input" v-model="formData.binCode"></Input>
              </search-in> -->

              <!-- 搜索 -->
            </div>
          </Col>

          <Col span="24">
            <vxe-table
              :data="list"
              stripe
              show-overflow
              resizable
              @sort-change="sortChange"
              @checkbox-change="selectionChange"
              @checkbox-all="selectionChange"
              :checkbox-config="{ highlight: true }"
            >
              <vxe-table-column :key="1" type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column min-width="60" sortable field="typeCode" :title="$t('ZoneCode')"></vxe-table-column>
              <vxe-table-column min-width="60" sortable field="binCode" :title="$t('LocationCode')">
                <!-- <template v-slot="{ row }">
                  <span class="pointer" @click="show(row, 'E')">{{ row.binCode }}</span>
                </template> -->
              </vxe-table-column>


              <!-- <vxe-table-column
                min-width="60"
                sortable
                field="weightMax"
                :title="$t('lbl_max_weight_status')"
              ></vxe-table-column> -->
              <vxe-table-column min-width="60" sortable field="whCode" :title="$t('lbl_wh_code')"></vxe-table-column>
              <vxe-table-column min-width="200" sortable field="whStorageBinExt0" :title="$t('col_describe')"></vxe-table-column>
            </vxe-table>
            <x-vxe-pager-48
              :current-page="head.pageIndex"
              :page-size="head.pageSize"
              :total="head.totalCount"
              @page-change="handlePageChange"
            ></x-vxe-pager-48>
          </Col>
        </div>
      </Row>
    </div>
    <!--编辑抽屉-->
    <look
      :drawer.sync="isLook"
      :flag="flag"
      :whCode="whCode"
      :typeCode="typeCode"
      :binCode="binCode"
      @ok-drawer="okDrawer"
    />
    <!--批量维护-->
    <batch :drawer.sync="isBatch" :selectList="selectList" @ok-drawer="okDrawer" />
  </div>
</template>

<script>
import { API } from "@A/system/Bin";
import { CAPI } from "@A/common";
import { look, batch } from "./modal/list";
import request from "@/api/api.request.download";
import { downloadFile } from "@/libs/assist";
import UploadExcelComponent from "_c/UploadExcel/index.vue"

export default {
  components: { look, batch, UploadExcelComponent },
  data() {
    return {
      flag: "",
      whCode: "",
      typeCode: "",
      binCode: "",
      formData: {
        whCode: "",
        typeCode: "",
        binCode: "",
      },
      list: [],
      selectList: [], // 选中列表
      whList: [], // 仓库号
      storeTypeList: [], // 存储类型
      storeAreaList: [], // 存储区
      head: {
        paging: false, // 是否分页
        totalCount: -1, // 总页数
        pageIndex: 1, // 当前页数
        pageSize: 48, // 每页显示行数
        sortColumn: "", // 排序字段
        sortAscend: true, // 升序true，降序false
      },
      isLook: false,
      isBatch: false, // 批量维护抽屉
    };
  },
  created() {
    this.getData();
    this.queryWh();
    this.whChange("PS")
  },
  methods: {
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
    search() {
      this.$set(this.head, "pageIndex", 1);
      this.getData();
    },
    // 获取数据
    async getData() {
      var sendData = {
        whCode: this.formData.whCode,
        typeCode: this.formData.typeCode,
        sectionCode: "",
        binCode: this.formData.binCode,
        // 必传参数（分页与排序）
        pageIndex: this.head.pageIndex,
        pageSize: this.head.pageSize,
        paging: this.head.paging,
        totalCount: -1,
        sortColumn: this.head.sortColumn,
        sortAscend: this.head.sortAscend,
      };
      var reg = /[^\w ,]/g;
      var regbin = /[^\w ,-]/g;
      if(typeof(this.formData.typeCode) != "undefined"){this.formData.typeCode = this.formatSearch(this.formData.typeCode)}
      //if(typeof(this.formData.binCode) != "undefined"){this.formData.binCode = this.formatSearch(this.formData.binCode)}
      if(reg.test(this.formData.typeCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_146') })
      }else if(regbin.test(this.formData.binCode)){
          this.$Notice.warning({ desc: this.$t('msg_notice_155') })
      }
      //var sendData = Object.assign(this.head, this.formData, { totalCount: -1 });
      // sendData.binCode = this.formatMinus(this.formData.binCode)   //2021-11-01  注销
      sendData.binCode = this.formData.binCode ? this.formData.binCode : '0000'   //2021-11-01  新加
      if(!sendData.binCode){
        return
      }
      if(sendData.binCode=='0000'){
        sendData.binCode=''
      }

      var [err, res] = await this.$to(API.AGetList(sendData));
      if (err) {
        return false;
      }
      var data = res.data;

      this.$set(this.head, "totalCount", data.totalCount);

      this.list = data.headList;

      // console.log("list: ", this.list)


    },
    // 分页回调
    handlePageChange({ currentPage, pageSize }) {
      this.head.pageIndex = currentPage;
      this.head.pageSize = pageSize;
      this.getData();
    },
    // 排序回调
    sortChange({ column, property, order }) {
      // 用 DESC 表示按倒序排序(即：从大到小排序)
      // 用 ASC 表示按正序排序(即：从小到大排序)
      this.head.sortColumn = property;
      this.head.sortAscend = order === "asc";
      this.getData();
    },
    // 仓库号下拉改变方法
    whChange(whCode) {
      this.formData.whCode = whCode || "";
      this.formData.typeCode = "";
      // 根据仓库号查询存储类型下拉
      whCode && this.queryStoreType();
    },
    // 存储类型下拉改变方法
    typeChange(typeCode) {
      this.formData.typeCode = typeCode || "";
    },
    // 仓库号查询
    async queryWh() {
      var [err, res] = await this.$to(API.AGetWhlist());
      if (err) {
        return false;
      }
      this.whList = this.$kv(res.data.whList, "whCode", "whName", true);
    },
    // 存储类型查询
    async queryStoreType() {
      var [err, res] = await this.$to(
        API.AGetAllStorageTypeList(this.formData.whCode)
      );
      if (err) {
        return false;
      }
      this.storeTypeList = this.$kv(
        res.data.headList,
        "typeCode",
        "typeName",
        true
      );
    },
    // 批量维护
    batch() {
      if (this.selectList.length === 0) {
        this.$Notice.warning({
          desc: this.$t("msg_notice_145"),
        });
        return false;
      }

      var firstItem = this.selectList[0];

      if (
        this.selectList.some(function (item) {
          return item.whCode != firstItem.whCode;
        })
      ) {
        this.$Notice.warning({ desc: this.$t("msg_notice_116") });
        return false;
      }

      if (
        this.selectList.some(function (item) {
          return item.typeCode != firstItem.typeCode;
        })
      ) {
        this.$Notice.warning({ desc: this.$t("msg_notice_117") });
        return false;
      }

      this.isBatch = true;
    },
    // 批量选中改变
    selectionChange({ selection }) {
      this.selectList = selection;
    },
    show(row, flag) {
      if (row === "") {
        this.whCode = "";
        this.typeCode = "";
        this.binCode = "";
      } else {
        this.whCode = row.whCode;
        this.typeCode = row.typeCode;
        this.binCode = row.binCode;
      }
      this.flag = flag;
      this.isLook = true;
    },
    okDrawer() {
      // 子组件新增/删除成功后，刷新列表
      this.getData();
    },
    // 成功回调
    successHandle(res) {
      this.$Notice.success({ desc: res.returnMsg });
    },
    prePrintValidation() {
      if (!this.selectList.length) {
        this.$Notice.warning({ desc: this.$t("msg_notice_145") });
        return false;
      }
      return true;
    },
    //导出仓位标签
    exportBinLabel() {
        var eCommand =async () => {

        var sendDataList = this.selectList.filter((item) => {
          return !item.children
        })

        sendDataList = sendDataList.map(item => {
          var qrCodeValue = item.typeCode + "/" + item.binCode;
          return {
            dn:item.receiptCode,
            po:item.shippingRef,
            batch:item.lotNumb,
            vendorCode: item.vendorCode,
            matCode: item.matCode,
            matName: item.matName,
            weightQty: item.weightQty || 0,
            whCode: item.whCode || "PS",
            binCode: item.binCode || "",
            typeCode: item.typeCode || "",
            heatNumber: item.heatCode || "",
            qrCodeValue: qrCodeValue,
            shippingRef: item.shippingRef || "",
            skidNumber: item.skidCode || "",
            whStorageBinExt0 : item.whStorageBinExt0 || "",
            weightMax : item.weightMax,
            volumeUnitCode : item.volumeUnitCode || "",
            host: "",
            port: 0,
            zplType: 0
          };
        });

        //console.log(sendDataList)
        var [err, res] = await this.$to(
        request({
          url: "sinobec/print/exportLablePdf",
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
    async exportLocation() {
      this.selectList.forEach((item) => {

        item.whCode = item.whCode || "PS";
        item.heatNumber = item.heatCode || "";
        item.qrCodeValue = item.typeCode + "/" + item.binCode;
        item.shippingRef = item.shippingRef || "";
        item.skidNumber = item.skidCode || "";
        item.whStorageBinExt0 = item.whStorageBinExt0 || "";
        item.weightMax = item.weightMax;
        item.volumeUnitCode = item.volumeUnitCode || "";
        item.host = "";
        item.port = 0;
        item.zplType = 0;
      });
      var [err, res] = await this.$to(
        request({
          url: "sinobec/print/exportLablePdf",
          data: this.selectList,
          method: "post",
        })
      );
      if (err) {
        return false;
      }
      downloadFile({ filename: "label", type: "pdf", download: true }, res);
    },
    async handleSuccess (results) {
      var sendData = results.results;
      //console.log('sendData=',sendData)
      //var [err, res] = await this.$to(API.AUploadList(sendData));
      if (err) {
        return false;
      }
      this.$Notice.success({ desc: res.returnMsg });
      //this.getDCList(this.formData.receiptType)
    },
    //打印仓位标签
    printLocation() {
      var eCommand = () => {
        // this.selectList.forEach((item) => {
        //   item.whCode = item.whCode || "PS";
        //   item.heatNumber = item.heatCode || "";
        //   item.qrCodeValue = item.typeCode + "/" + item.binCode;
        //   item.shippingRef = item.shippingRef || "";
        //   item.skidNumber = item.skidCode || "";
        //   item.host = "";
        //   item.port = 0;
        //   item.zplType = 0;
        // });
        this.selectList.forEach((item) => {
          item.whCode = item.whCode || "PS";
          item.heatNumber = item.heatCode || "";
          item.qrCodeValue = item.typeCode + "/" + item.binCode;
          item.shippingRef = item.shippingRef || "";
          item.skidNumber = item.skidCode || "";
          item.whStorageBinExt0 = item.whStorageBinExt0 || "";
          item.weightMax = item.weightMax;
          item.volumeUnitCode = item.volumeUnitCode || "";
          item.host = "";
          item.port = 0;
          item.zplType = 0;
        });

        CAPI.APrintBin(this.selectList).then((res) => {
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
  },
};
</script>
