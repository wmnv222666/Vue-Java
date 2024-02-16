<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-14 18:33:06
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-11 13:00:38
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
                  <FormItem :label="$t('lbl_stock_take_type_name')">{{ head.stockTakeTypeName }}</FormItem>
                  <!-- <FormItem :label="$t('lbl_inventory_data')">{{ head.stockTakeDate }}</FormItem> -->
                  <FormItem :label="$t('lbl_stock_take_mode_name')">
                    <RadioGroup v-model="head.stockTakeMode">
                      <Radio :label="1" disabled>{{ $t('sel_open_plate') }}</Radio>
                      <Radio :label="2" disabled>{{ $t('sel_blind_plate') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem :label="$t('col_creator_name')">{{ head.createUserName }}</FormItem>
                  <FormItem :label="$t('col_create_time')">{{ head.createTime }}</FormItem>
                </Form>
              </div>
            </TabPane>
          </Tabs>
          </Col>
        </Row>
        <Row class="border-top" v-show="isShowTable">
          <Col span="24" class="margin-t-16">
          <vxe-table v-show="false" ref="detailTableExport" :data="exportList" row-id="xid" max-height="450" stripe show-overflow="title" resizable>
            <vxe-table-column min-width="160" field="docNum" :title="$t('col_sap_doc_code')"></vxe-table-column>
            <vxe-table-column min-width="160" field="matCode" :title="$t('Item')"></vxe-table-column>
            <vxe-table-column min-width="160" field="lotNumb" :title="$t('batch')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="ext0" :title="$t(' VIN # or S/N ')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
            <vxe-table-column min-width="160" field="stockTakeQty" :title="$t('ActQty')"></vxe-table-column>
          </vxe-table>

          <vxe-table ref="detailTable" :data="itemTableList" row-id="xid" max-height="450" stripe show-overflow="title" resizable>
            <vxe-table-column min-width="160" field="docNum" :title="$t('col_sap_doc_code')"></vxe-table-column>
            <vxe-table-column min-width="160" field="typeCode" :title="$t('Zone')">
              <template v-slot="{ row }">
                <!-- <span>{{ row.typeCode }} - {{ row.typeName }}</span> -->
                <span>{{ row.typeCode }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column min-width="100" field="binCode" :title="$t('LocationCode')"></vxe-table-column>
            <vxe-table-column min-width="100" field="matCode" :title="$t('Item')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext3" title="MfgID"></vxe-table-column>
            <vxe-table-column min-width="80" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext7" :title="$t('prddate')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext8" :title="$t('expdate')"></vxe-table-column>
            <vxe-table-column min-width="80" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="ext0" :title="$t(' VIN # or S/N ')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="lotNumb" :title="$t('lotNumb')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
            <vxe-table-column min-width="160" field="weightQty" :title="$t('weight_qty')"></vxe-table-column>
            <vxe-table-column min-width="160" field="stockTakeQty" :title="$t('ActQty')">
              <template v-slot="{ row, rowIndex }">
                <span v-if="disableEdit">{{ row.stockTakeQty }}</span>
                <el-input-number v-else v-model="row.stockTakeQty" :min="0" @change="stockTakeQtyChange(row, rowIndex)" :max="999999999" :precision="row.weightDecimalPlace"></el-input-number>
              </template>
            </vxe-table-column>
            <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="qty" :title="$t('QtyInPCS')"> </vxe-table-column> -->
            <vxe-table-column min-width="160" field="stockTakeUser" :title="$t('col_stock_take_user')">
            </vxe-table-column>
            <!-- <vxe-table-column min-width="160" field="moveDate" :title="$t('col_move_data')"> </vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" field="heatCode" :title="$t('Heat')"></vxe-table-column>
            <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
          </vxe-table>

          <x-vxe-pager perfect :current-page="page.pageIndex" :page-size="page.pageSize" :total="page.totalCount" @page-change="handlePageChange">
          </x-vxe-pager>
          </Col>
        </Row>
        <div class="fixed-bottom" v-show="isShowTable">
          <button-expand :btnGroup="groupBtn" @on-ok="btnHandle" />
          <button-expand :btnGroup="groupBtn1" @on-ok="btnHandle" />
        </div>
      </div>
    </div>

    <!-- 添加盘盈 -->
    <!-- <add :drawer.sync="isAdd" @on-ok="addHandle" /> -->
  </div>
</template>

<script>
import { API } from "@A/warehouse/PInvCount";
import { CAPI } from "@A/common";
// 按钮逻辑
import ButtonExpand from "_c/btnGroup/ButtonExpand.vue";
// 四则运算
import calculate from "@/libs/precision";

export default {
  name: "detail",
  components: {
    // add,
    ButtonExpand
  },
  data () {
    return {
      isAdd: false,
      head: {}, // 抬头信息
      row: {}, // 选中行数据
      remarkPlaceHolder: "", // 备注输入提示
      tabChangeValue: "p1", // Tab切换当前选项卡名称
      curr: 0, // 点击获取当前行索引 获取操作抬头信息
      selection: [], // 已选择数据
      itemList: [], // 表格全量数据
      hideItemList: [], // 隐藏数据
      showItemList: [], // 隐藏数据
      itemTableList: [], // 表格显示数据
      exportList:[],//表格导出数据
      fileList: [], // 附件列表
      whCodeList: [], // 仓库号下拉
      typeCodeList: [], // 存储类型下拉
      binCodeList: [], // 仓位
      stockStatusList: [], // 库存状态下拉
      isMaterialShowMore: false,
      groupBtn: {
        buttonInventory: false, // 开始盘点
        buttonSave: false, // 保存
        buttonDelete: false // 删除
      }, // 按钮组权限
      groupBtn1: {
        buttonExport: false //导出excel
      },
      formHeadData: {
        fileList: [], // 附件
        logList: [] // 日志
      },
      page: {
        paging: true,
        totalCount: -1,
        pageIndex: 1,
        pageSize: 100,
        sortColumn: "",
        sortAscend: true
      },
      baseInfo: {
        receiptType: 670,
        isCreate: true,
        in: null,
        id: null
      }
    };
  },
  computed: {
    // 抬头信息-订单信息
    isShowTable () {
      return this.tabChangeValue === "p1" || this.tabChangeValue === "p2";
    },
    // 已提交之后状态不可以修改  // 可编辑使能控制 true 不可编辑 false 可编辑
    disableEdit () {
      return this.head.receiptStatus > 45;
    }
  },
  created () {
    this.init();
  },
  methods: {
    /**
     * @Description: Initialize
     * @Author: Jiang Xiao
     */
    init () {
      let _in = this.$route.query.in,
        _id = this.$route.params.id,
        receiptStatus = this.$route.query.receiptStatus;

      this.baseInfo.in = _in; // The default is to create a status document
      this.baseInfo.id = _id;
      this.baseInfo.isCreate = _in === "1";

      if (this.baseInfo.isCreate || !_id) {
        // Create state in = 1 || Order id is empty
        return false;
      }

      this.getInfoByCode(); // 详情进入
    },
    /**
     * @Description: Query detailed data by document number
     * @Author: Jiang Xiao
     */
    async getInfoByCode () {
      var [err, res] = await this.$to(
        API.AGetDetailByCode(this.baseInfo.id, this.baseInfo.in)
      );
      if (err) {
        return false;
      }
      this.initData(res.data, false);
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
      if (
        data.head.receiptStatus == 45 ||
        data.itemList.some(function (item) {
          return item.status == 10;
        })
      ) {
        this.groupBtn = {
          buttonInventory: true, // 盘点计数
          buttonSave: true // 保存
        }; // 按钮组权限
      }else{
        this.groupBtn1 = {
          buttonExport: true, //导出excel
        }; // 按钮组权限
      }

      this.head = data.head;

      this.formHeadData.logList = data.logList;

      var itemList = data.itemList;
      this.itemList = this.formatItemList(itemList);
      

      
      // var newJson = []; //盛放去重后数据的新数组
      
      // for( var item1 of itemList){  //循环json数组对象的内容
      
      //   var flag = true;  //建立标记，判断数据是否重复，true为不重复
      
      //   for( var item2 of newJson){  //循环新数组的内容
      
      //     if(item1.typeCode.trim()==item2.typeCode.trim() 
      //     && item1.binCode.trim()==item2.binCode.trim()  
      //     && item1.matCode.trim()==item2.matCode.trim()
      //     && item1.ext0.trim()==item2.ext0.trim()
      //     && item1.ext1.trim()==item2.ext1.trim()){ //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
      //       flag = false;
      //       item2.weightQty = parseInt(item2.weightQty) + parseInt(item1.weightQty)
      //       item2.stockTakeQty = parseInt(item2.stockTakeQty) + parseInt(item1.stockTakeQty)
      //     }
      
      //   }
      
      //   if(flag){ //判断是否重复
      //     newJson.push(item1); //不重复的放入新数组。  新数组的内容会继续进行上边的循环。
      //   }
      // }
      //this.itemList = this.formatItemList(newJson);
      //console.log("this.itemList",this.itemList)
      //如果是重盘 isRecount=1 把 itemList里的 weightqty 和 stocktakeqty 不等的 挑出来，其他的放到 hideItemlist里

      // if(data.head.isRecount === 1){
      //   for (var item of this.itemList){
      //     if(item.weightQty===item.stockTakeQty){
      //       this.hideItemList.push(item)
      //     }else{
      //       item.stockTakeQty = 0
      //       this.showItemList.push(item)
      //     }
      //   }
      //   this.itemList = this.showItemList
      // }

      // 获取分页数据
      this.getFirstPageData();
      // 表格列控制
      this.columsShowCtrl(data);
    },
    // 格式化行项目数据
    formatItemList (itemList) {
      itemList.forEach(function (item, i) {
        item.qty = item.stockTakeQty === 0 ? 0 : item.qty ? item.qty : item.receiptQty;
        item.xIndex = i;
      });
      return itemList;
    },
    // 附件列表赋值
    formatImgList (fileList) {
      var _this = this;
      return fileList.map(function (item) {
        item.url = getProUri(_this, `file/download/${file.fileCode}`);
        return item;
      });
    },
    // 表格列控制
    columsShowCtrl (data) {
      this.$nextTick(() => {
        var columns = this.$refs.detailTable.getColumns();

        if (data.head.stockTakeMode === 2) {
          // 盲盘的时候隐藏库存
          columns.forEach(column => {
            if (["weightQty"].includes(column.property)) {
              column.visible = false;
            }
          });
        } else {
          columns.forEach(column => {
            if (["weightQty"].includes(column.property)) {
              column.visible = true;
            }
          });
        }

        this.$refs.detailTable.refreshColumn();
      });
    },
    // 实际数量
    stockTakeQtyChange (row) {
      this.itemList[row.xIndex]["stockTakeQty"] = row.stockTakeQty;
      if (row.receiptQty === 0 || row.weightQty === 0) {
        return false;
      }
      var aQty = calculate.times(row.receiptQty, row.stockTakeQty);
      var bQty = calculate.divide(aQty, row.weightQty);
      var qty = calculate.round(bQty, row.decimalPlace || 0);
      this.itemList[row.xIndex]["qty"] = qty;
    },
    // 添加盘盈回调
    // addHandle (itemList) {
    //   var itemList = this.formatItemList(itemList)
    //   this.pushBinListToItemList(itemList)
    // },
    // // 删除选择数据
    // delStorageBinListdelStorageBinList () {
    //   this.itemList = this.$del(this.itemList, this.selection, 'uid')
    //   this.getFirstPageData()  //页面中显示的数据
    // },
    // // 行项目数据添加 - 合并去重
    // pushBinListToItemList (itemList) {
    //   this.itemList = this.$mergeArray(this.itemList, itemList, 'uid')
    //   this.getFirstPageData()  //页面中显示的数据
    // },
    // 批量选中改变
    // selectionChange ({ selection }) {
    //   // 所有选择的数据 当前页 + 之前页的
    //   var getCheckboxReserveRecords = this.$refs.detailTable.getCheckboxReserveRecords()
    //   var getCheckboxRecords = this.$refs.detailTable.getCheckboxRecords()

    //   this.selection = getCheckboxReserveRecords.concat(getCheckboxRecords)
    // },
    // 附件上传回调
    handleFileChange (fileList) {
      this.formHeadData.imgList = fileList;
    },
    // 分页回调
    handlePageChange ({ currentPage, pageSize }) {
      this.page.pageIndex = currentPage;
      this.page.pageSize = pageSize;
      this.itemTableList = this.$getPage(
        this.page.pageIndex,
        this.page.pageSize,
        this.itemList
      );
    },
    // 假分页处理
    getFirstPageData () {
      this.page.pageIndex = 1;
      this.page.totalCount = this.itemList.length;
      this.itemList.forEach(function (item, i) {
        item.xindex = i;
      });
      this.itemTableList = this.$getPage(1, this.page.pageSize, this.itemList);
    },
    // 是否可选
    checkMethod ({ row }) {
      // 已冲销 已完成 无权限不可以选择
      return !(row.disableEdit || row.disabled);
    },
    // 成功回调
    successHandle (res) {
      this.$router.push({ name: "inv_count" });
      this.$Notice.success({ desc: res.returnMsg });
    },
    // 删除
    deleteOrder () {
      var eCommand = () => {
        API.ADelete(this.head.stockTakeCode).then(res => {
          this.successHandle(res);
        });
      };
      this.$confirm({
        content: _this.$t("msg_notice_74"),
        onOk: eCommand
      });
    },
    /**
     * @Description: Document pre-save verification function
     * @Author: Jiang Xiao
     */
    preSaveValidation () {
      if (!this.itemList.length) {
        this.$Notice.warning({ desc: this.$t("msg_notice_145") });
        return false;
      }
      return true;
    },
    /**
     * @Description: Document pre-submission verification function
     * @Author: Jiang Xiao
     */
    preCommitValidation () {
      if (!this.preSaveValidation()) {
        return false;
      }

      return true;
    },
    // 提交保存
    submit (isSubmit) {
      var senData = this.formatSendData(isSubmit);
      // submit
      if (isSubmit) {
        if (this.preCommitValidation()) {
          this.$confirm({
            content: this.$t("msg_notice_26"),
            onOk: () => {
              this.submitOrder(senData);
            }
          });
        }
      } else {
        // save
        if (this.preSaveValidation()) {
          this.$confirm({
            content: this.$t("msg_notice_27"),
            onOk: () => {
              this.submitOrder(senData);
            }
          });
        }
      }
    },
    // 格式化提交入参
    formatSendData (isSubmit) {
      var sendData = {
        head: Object.assign({}, this.head),
        itemList: this.itemList,
        actorList: [],
        fileList: this.formHeadData.fileList
      };

      sendData.head.receiptStatus = isSubmit;
      sendData.head.saveOrUpdate = 20;

      return sendData;
    },
    //导出csv
    exportExcel () {
      var excelList = this.itemList
      var exportList = this.exportList
      var find = new Boolean()

      find = false
      exportList.push(excelList[0])

      for(var i = 1; i < excelList.length; i++){
        for(var j = 0; j< exportList.length; j++){
          if(exportList[j].lotNumb == excelList[i].lotNumb && exportList[j].matCode == excelList[i].matCode ){
            find = true
            exportList[j].stockTakeQty = exportList[j].stockTakeQty+excelList[i].stockTakeQty
            continue
          }
        }
        if(!find){
          exportList.push(excelList[i])
          find = false
          continue
        }
      }

      this.$refs.detailTableExport.exportData({
        filename: 'SAP Task List',
        type: 'csv',
        isHeader: true,
        isFooter: true,
        data: exportList
      })
      this.init()
    },
    // 单据提交
    async submitOrder (sendData) {
      var [err, res] = await this.$to(API.ASaveOrSubmit(sendData));
      if (err) {
        return false;
      }
      this.successHandle(res);
    },
    // 按钮组回调
    btnHandle (type) {
      switch (type) {
        case "buttonSave":
          this.submit(10);
          break;
        case "buttonInventory":
          this.submit(20);
          break;
        case "buttonExport":
          this.exportExcel();
          break;
        default:
          return false;
      }
    },
    // 提交保存
    submit (isSubmit) {
      var senData = this.formatSendData(isSubmit);
      // submit
      if (isSubmit) {
        if (this.preCommitValidation()) {
          this.$confirm({
            content: this.$t("msg_notice_26"),
            onOk: () => {
              this.submitOrder(senData);
            }
          });
        }
      } else {
        // save
        if (this.preSaveValidation()) {
          this.$confirm({
            content: this.$t("msg_notice_27"),
            onOk: () => {
              this.saveOrder(senData);
            }
          });
        }
      }
    }
  }
};
</script>
