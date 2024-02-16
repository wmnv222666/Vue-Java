<template>
  <div class="modal-body no-padding">
    <div class="detail-box-inner">
      <div class="i-box clearfix">
        <Row class="border-top" v-show="isShowTable">
          <!-- 按钮区 -->
           <Col span="24" class="margin-t-16" v-if="!disableEdit && btnShow">  
            <Form :model="head" :label-width="140" inline label-colon>
              <buttonGroup>
                <!-- 添加 -->
                <Button icon="md-add" @click="isAdd = true"
                  >{{ $t("btn_add") }}
                </Button>
                <!-- 删除 -->
                <Button icon="ios-trash" @click="delSelectList"
                  >{{ $t("btn_delete") }}
                </Button>
                <Button icon="ios-refresh" @click="editSelectList">
                  {{ $t("btn_edit") }}
                  </Button>
                <!-- 导出 -->
                
                <!-- <Button icon="ios-cloud-upload-outline" @click="exportExcel">
                  {{ $t("export_to_excel") }}
                </Button> -->
              </buttonGroup>
            </Form>
          </Col>
          <!-- 表格 -->
          <div>
            <Col span="24" class="margin-t-16">
              <vxe-table
                ref="detailTable"
                :data="showTableList.slice((page.pageIndex - 1) * page.pageSize, page.pageIndex * page.pageSize)"
                highlight-cell
                stripe
                resizable
                row-id="xid"
                show-overflow
                border="full"
                max-height="450"
                @checkbox-change="selectionChange"
                @checkbox-all="selectionChange"
                :tooltip-config="{ showAll: true, enterable: true }"
                :checkbox-config="{
                  reserve: true,
                  highlight: true,
                  checkMethod: checkMethod
                }"
              >
                <!--0-->
                <vxe-colgroup type="checkbox"></vxe-colgroup>
                <!--1-->
                <vxe-colgroup title="Return In">
                  <vxe-column
                    field="In_SKU"
                    min-width="80"
                    title="SKU"
                  ></vxe-column>
                  <vxe-column
                    field="In_UNIT"
                    min-width="100"
                    title="UNIT"
                  ></vxe-column>
                  <vxe-column
                    field="In_batch"
                    min-width="100"
                    title="batch"
                  ></vxe-column>
                  <vxe-column
                    field="In_Prod_date"
                    min-width="120"
                    title="Prod date"
                  ></vxe-column>
                  <vxe-column
                    field="In_Exp_date"
                    min-width="120"
                    title="Exp date"
                  ></vxe-column>
                  <vxe-column
                    field="In_MfgID"
                    min-width="100"
                    title="MfgID"
                  ></vxe-column>
                  <vxe-column
                    field="In_GRDATE_LOT"
                    min-width="160"
                    title="GRDATE_LOT"
                  ></vxe-column>
                  <vxe-column
                    field="In_QTY"
                    min-width="100"
                    title="QTY"
                  ></vxe-column>
                  <vxe-column
                    field="In_Note"
                    min-width="100"
                    title="Note"
                  ></vxe-column>
                </vxe-colgroup>
                <!--2-->
                <vxe-colgroup title="Repack Out">
                  <vxe-column
                    field="Out_SKU"
                    min-width="80"
                    title="SKU"
                  ></vxe-column>
                  <vxe-column
                    field="Out_UNIT"
                    min-width="100"
                    title="UNIT"
                  ></vxe-column>
                  <vxe-column
                    field="Out_batch"
                    min-width="100"
                    title="batch"
                  ></vxe-column>
                  <vxe-column
                    field="Out_Prod_date"
                    min-width="120"
                    title="Prod date"
                  ></vxe-column>
                  <vxe-column
                    field="Out_Exp_date"
                    min-width="120"
                    title="Exp date"
                  ></vxe-column>
                  <vxe-column
                    field="Out_MfgID"
                    min-width="100"
                    title="MfgID"
                  ></vxe-column>
                  <vxe-column
                    field="Out_GRDATE_LOT"
                    min-width="160"
                    title="GRDATE_LOT"
                  ></vxe-column>
                  <vxe-column
                    field="Out_QTY"
                    min-width="100"
                    title="QTY"
                  ></vxe-column>
                   <vxe-column
                    field="Out_Note"
                    min-width="100"
                    title="Note"
                  ></vxe-column>
                </vxe-colgroup>
              </vxe-table>
              <!-- 分页 -->
              <x-vxe-pager
                perfect
                :current-page="page.pageIndex"
                :page-size="page.pageSize"
                :total="page.totalCount"
                @page-change="handlePageChange"
              >
              </x-vxe-pager>
            </Col>
          </div>
          <!-- 下载表格使用 -->
         <div style="display:none">
            <Col span="24" class="margin-t-16">
              <!-- <vxe-table
                ref="downDetailTable"
                :data="showTableList"
                border="full"
                show-footer
                height="500"
                :align="align"
                :loading="loading"
                :import-config="tableImport"
                :export-config="tableExport"
                :merge-cells="mergeCells"
                :merge-footer-items="mergeFooterItems"
              >
                <vxe-column
                  min-width="100"
                  title="Return In:"
                  field="key"
                ></vxe-column>
                <vxe-colgroup title="Return In">
                  <vxe-column
                    field="In_SKU"
                    min-width="80"
                    title="SKU"
                  ></vxe-column>
                  <vxe-column
                    field="In_UNIT"
                    min-width="100"
                    title="UNIT"
                  ></vxe-column>
                  <vxe-column
                    field="In_batch"
                    min-width="100"
                    title="batch"
                  ></vxe-column>
                  <vxe-column
                    field="In_Prod_date"
                    min-width="120"
                    title="Prod date"
                  ></vxe-column>
                  <vxe-column
                    field="In_Exp_date"
                    min-width="120"
                    title="Exp date"
                  ></vxe-column>
                  <vxe-column
                    field="In_MfgID"
                    min-width="100"
                    title="MfgID"
                  ></vxe-column>
                  <vxe-column
                    field="In_GRDATE_LOT"
                    min-width="160"
                    title="GRDATE_LOT"
                  ></vxe-column>
                  <vxe-column
                    field="In_QTY"
                    min-width="100"
                    title="QTY"
                  ></vxe-column>
                </vxe-colgroup>
                <vxe-column
                  min-width="100"
                  title="Repack Out:"
                  field="key"
                ></vxe-column>
                <vxe-colgroup title="Repack Out">
                  <vxe-column
                    field="Out_SKU"
                    min-width="80"
                    title="SKU"
                  ></vxe-column>
                  <vxe-column
                    field="Out_UNIT"
                    min-width="100"
                    title="UNIT"
                  ></vxe-column>
                  <vxe-column
                    field="Out_batch"
                    min-width="100"
                    title="batch"
                  ></vxe-column>
                  <vxe-column
                    field="Out_Prod_date"
                    min-width="120"
                    title="Prod date"
                  ></vxe-column>
                  <vxe-column
                    field="Out_Exp_date"
                    min-width="120"
                    title="Exp date"
                  ></vxe-column>
                  <vxe-column
                    field="Out_MfgID"
                    min-width="100"
                    title="MfgID"
                  ></vxe-column>
                  <vxe-column
                    field="Out_GRDATE_LOT"
                    min-width="160"
                    title="GRDATE_LOT"
                  ></vxe-column>
                  <vxe-column
                    field="Out_QTY"
                    min-width="100"
                    title="QTY"
                  ></vxe-column>
                </vxe-colgroup>
              </vxe-table> -->
              <!-- 分页 -->
              <!-- <x-vxe-pager
                perfect
                :current-page="page.pageIndex"
                :page-size="page.pageSize"
                :total="page.totalCount"
                @page-change="handlePageChange"
              >
              </x-vxe-pager> -->
            </Col>
          </div>
        </Row>
        <!-- 脚步 -->
        <div class="fixed-bottom" v-show="isShowTable">
          <button-expand :btnGroup="groupBtn" @on-ok="btnHandle" />
        </div>
      </div>
    </div>

    <add
      :drawer.sync="isAdd"
      v-if="isAdd"
      :binCodeListReturn="binCodeListReturn"
      @on-ok="addHandle"
    />
   
  </div>
</template>

<script>
import { API } from "@A/warehouse/Return";
// 按钮逻辑
import ButtonExpand from "_c/btnGroup/ButtonExpand.vue";

import add from "./add.vue";


export default {
  name: "detail",
  components: {
    add,
    ButtonExpand
  },
  data() {
    return {
      submitList:[],//选中要提交的数据
      btnShow: true,
      loading: false,
      align: null,
      tableData: [],
      tableImport: {
        // 自定义类型
        types: ["xlsx"]
      },
      tableExport: {
        // 默认选中类型
        type: "xlsx",
        // 自定义类型
        types: ["xlsx", "csv", "html", "xml", "txt"]
      },
      mergeCells: [],
      mergeFooterItems: [
        { row: 0, col: 1, rowspan: 2, colspan: 2 },
        { row: 1, col: 5, rowspan: 1, colspan: 3 }
      ],
      isAdd: false,
      selectedMatName: "",
      head: {}, // 抬头信息
      tabChangeValue: "p1", // Tab切换当前选项卡名称
      curr: 0, // 点击获取当前行索引 获取操作抬头信息
      selection: [], // 已选择数据
      itemList: [], // 表格全量数据
      //itemTableList1: [],
      selecUuidArr: [], //选中的uuid集合
      binCodeListReturn:[],
      showTableList: [
        
      ], // 表格显示数据
      row: {}, // 选中行数据
      whList: [],
      groupBtn: {
        buttonSave: true, // 保存
        buttonSubmit: true, // 保存
        buttonDelete: false // 删除
      }, // 按钮组权限
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
    isShowTable() {
      //console.log('this.head.receiptStatusName=',this.head.receiptStatusName)
      return this.tabChangeValue === "p1" || this.tabChangeValue === "p2";
    },
    // 已提交之后状态不可以修改  // 可编辑使能控制 true 不可编辑 false 可编辑
    disableEdit() {
      return this.head.receiptStatus > 20;
    }
  },
async mounted() {
   //console.log(this.$router)//
  //console.log(this.showTableList)
    const _in = this.$route.query.in;
    const stutus = this.$route.query.stu;
    const code = this.$route.query.code;
    // 按钮-创建
    if (_in == "1") {
      this.groupBtn = {
        buttonSave: true, // 保存
        buttonDelete: false // 删除
      };
      let arr = JSON.parse(sessionStorage.getItem("add-list")) || [];
      if (arr.length) {
        this.showTableList = arr;
      }
      return;
    }
    // 列表-跳转
    if (_in == "0") {
      const dataDelay_ = sessionStorage.getItem("dataDelay_kk")||"1";
      let arr1 = JSON.parse(sessionStorage.getItem("add-list")) || [];
      if (arr1.length || dataDelay_ =="2") {
        this.showTableList = arr1;
      }else{
        const [err, res] = await this.$to(API.AGetDetailByCode(code));
        this.initSetData(res);
      }
      if (stutus == "90") {
        //单独显示列表
        this.groupBtn = {}; //按钮清空
        this.btnShow = false; //按钮隐藏
      }
      sessionStorage.setItem("dataDelay_kk","2")
    }

  },
  methods: {
    // 初始化
    initSetData(ob) {
      //console.log(ob)
      const arr = (ob.data && ob.data.returnList) || [];
      ob.data.totalCount && (this.page.totalCount = ob.data.totalCount);
      this.showTableList = arr.map(item => {
        return {
          In_SKU: item.riMatCode,
          In_UNIT: item.riUom,
          In_batch: item.riLotNumb,
          In_Prod_date: item.riProdDate,
          In_Exp_date: item.riExpDate,
          In_MfgID: item.riMfgid,
          In_GRDATE_LOT: item.riGrdateLot,
          In_QTY: item.riQty,
          In_Note: item.riNote,

          Out_SKU: item.roMatCode,
          Out_UNIT: item.roUom,
          Out_batch: item.roLotNumb,
          Out_Prod_date: item.roProdDate,
          Out_Exp_date: item.roExpDate,
          Out_MfgID: item.roMfgid,
          Out_GRDATE_LOT: item.roGrdateLot,
          Out_QTY: item.roQty,
          Out_Note: item.roNote,
          uuid:this.setUuid()
        };
      });
    },
    changeBtnShow() {
      if (!this.itemTableList.length) {
        this.groupBtn = {
          buttonSave: true,
          buttonSubmit: false,
          buttonDelete: false
        };
      } else if (this.head.receiptStatus === 90) {
        this.groupBtn = {
          buttonSave: false,
          buttonSubmit: false,
          buttonDelete: false
        }; // 按钮组权限
      } else {
        this.groupBtn = {
          buttonSave: true,
          buttonSubmit: true,
          buttonDelete: false
        };
      }
    },
   //设置id
    setUuid() {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (
          S4() +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          "-" +
          S4() +
          S4() +
          S4()
        );
    },
    
    addHandle(itemList) {
      this.isAdd = !this.isAdd;
      this.showTableList.push(itemList);
    },
    // 删除选择数据
    delSelectList() {
      if (!this.selecUuidArr.length) {
        this.$Notice.warning({
          desc: "There is no deletable data"
        });
        return;
      }
      this.showTableList = this.showTableList.filter(
        v => !this.selecUuidArr.includes(v.uuid)
      );
      this.selecUuidArr = []//清除id集合
      this.selecUuidArr = []//恢复初始状态
      // this.$refs.detailTable.clearCheckboxRow()
      // this.$refs.detailTable.clearCheckboxReserve()
    },

    //编辑选中的订单 父组件给子组件传值
     editSelectList(submitList){
     if (!this.submitList.length) {
        this.$Notice.warning({
          desc: "There is no edit data"
        });
        return;
      }
       console.log(this.submitList)
        this.isAdd=true
        //this.submitList.length=this.selection
        //receiptCode= this.$route.query.code
        // this.$route.query.stu===20
        // this.$route.query.in===0
        // this.submitList=submitList收到数据 并存到了自身


    
     

     
      
    
    //  this.showTableList = Object.assign({},v.uuid);
    },
    // 批量选中改变
    selectionChange({ selection }) {
      this.submitList = selection;
      this.selecUuidArr = selection.map(v => v.uuid);
    var getCheckboxReserveRecords = this.$refs.detailTable.getCheckboxReserveRecords()
      var getCheckboxRecords = this.$refs.detailTable.getCheckboxRecords()

      this.selection = getCheckboxReserveRecords.concat(getCheckboxRecords)
    },
    // 分页回调
    handlePageChange({ currentPage, pageSize }) {
      this.page.pageIndex = currentPage;
      this.page.pageSize = pageSize;
      this.$to(API.AGetDetailByCode(this.$route.query.code)) 
     },
  

    exportExcel() {
      if (!this.showTableList.length) {
        this.$Notice.warning({
          desc: "No Data "
        });
        return;
      }
      this.$refs.downDetailTable.exportData({
       
        filename: "Sort Task List",
        sheetName: "Sheet1",
        type: "xlsx"
      });
    },
    // 是否可选
    checkMethod({ row }) {
      // 已冲销 已完成 无权限不可以选择
      return !(row.disableEdit || row.disabled);
    },
    // 成功回调
    successHandle(res) {
      this.$router.push({ name: 'return' });
      this.$Notice.success({ desc: res.returnMsg });
    },
   
    preSaveValidation() {
      if (!this.itemList.length) {
        this.$Notice.warning({ desc: this.$t("msg_notice_145") });
        return false;
      }
      return true;
    },
   
    preCommitValidation() {
      if (!this.preSaveValidation()) {
        return false;
      }

      if (
        this.itemTableList.some(item => {
          return item.targetBinCode == "";
        })
      ) {
        this.$Notice.warning({ desc: this.$t("msg_notice_280") });
        return false;
      }

      return true;
    },
    
    // 按钮组回调
    btnHandle(type) {
      switch (type) {
        case "buttonSave":
          this.submit(0);
          break;
        case "buttonSubmit":
          this.submit(1);
          break;
        case "buttonDelete":
          this.deleteOrder();
          break;
        default:
          return false;
      }
  },
    // 保存和提交
    async submit(isSubmit) {
      //console.log(isSubmit)
      
      const ob = {
        isSubmit, //(0是save，1是submit)
        receiptCode: this.$route.query.code,
        returnList: this.handerData()
      };
      if (this.submitList.length) {
        const [err, res] = await this.$to(API.ASavaOrSubmit(ob));if (err) { return false }
        this.successHandle(res)
      }
    },
    handerData() {
      return this.showTableList.map(item => {
        return {
          riMatCode: item.In_SKU,
          riUom: item.In_UNIT,
          riLotNumb: item.In_batch,
          riProdDate: item.In_Prod_date,
          riExpDate: item.In_Exp_date,
          riMfgid: item.In_MfgID,
          riGrdateLot: item.In_GRDATE_LOT,
          riQty: item.In_QTY,
          riNote: item.In_Note,

          roMatCode: item.Out_SKU,
          roUom: item.Out_UNIT,
          roLotNumb: item.Out_batch,
          roProdDate: item.Out_Prod_date,
          roExpDate: item.Out_Exp_date,
          roMfgid: item.Out_MfgID,
          roGrdateLot: item.Out_GRDATE_LOT,
          roQty: item.Out_QTY,
          roNote: item.Out_Note
        };
      });
    }
  },
  watch: {
    showTableList: {
      deep: true,
      handler(newValue, oldValue) {
        //console.log(newValue, "newValue");
        sessionStorage.setItem("add-list", JSON.stringify(newValue));
      }
    }
 },
  beforeDestroy() {
    sessionStorage.removeItem("dataDelay_kk");
    sessionStorage.removeItem("add-list");
  }
};
</script>
