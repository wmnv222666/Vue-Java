<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24">
          <!-- 新增 -->
          <ButtonGroup>
            <!-- <Button @click="show('', '')" icon="md-add">{{ $t('btn_new') }}</Button> -->
            <!-- <Button @click="exportMatLabel" min-width="160" icon="ios-print-outline">{{ $t('btn_label_export') }}</Button> -->
            <!-- <Button min-width="160" icon="ios-print-outline"  class="buttonPrint"  @click="printBarCode">{{ $t("btn_label_print") }}</Button> -->
          </ButtonGroup>
          <div class="search-box">
            <Input :placeholder="$t('ph_placeholder_0')" search @on-search="search" />
          </div>
          </Col>
          <Col span="24">
          <vxe-table :data="list" stripe show-overflow resizable @sort-change="sortChange" @checkbox-change="selectionChange" @checkbox-all="selectionChange">
            <!-- <vxe-table-column :key="1" type="checkbox" width="60"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" sortable field="matCode" :title="$t('col_mat_code')">
              <template v-slot="{ row }">
                <span class="pointer" @click="show(row.matCode, 'E')">{{ row.matCode }}</span>
              </template>
            </vxe-table-column> -->
            <vxe-table-column min-width="160" sortable field="matCode" :title="$t('col_mat_code')"></vxe-table-column>
            <vxe-table-column min-width="200" sortable field="matName" :title="$t('col_mat_name')"></vxe-table-column>
            <!-- <vxe-table-column min-width="180" sortable field="matTypeCode" :title="$t('col_matType_name')"></vxe-table-column> -->
            <!-- <vxe-table-column min-width="160" sortable field="netWeight" :title="$t('col_net_weight')"></vxe-table-column> -->
            <vxe-table-column min-width="160" sortable field="__unitWeight__" title="UoM"></vxe-table-column>
            <!-- <vxe-table-column min-width="160" sortable field="createTime" :title="$t('col_create_time')"></vxe-table-column> -->
          </vxe-table>

          <x-vxe-pager-48 :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager-48>
          </Col>
        </div>
      </Row>
    </div>

    <!--编辑抽屉-->
    <look :drawer.sync="isLook" :flag="flag" :matCode="matCode" @ok-drawer="okDrawer" />
    <!--新增仓库-->
    <!-- <addStore :drawer.sync="isAddStore" :matCode="matCode" @ok-drawer="okDrawer" /> -->
  </div>
</template>

<script>
import { API } from '@A/system/SKUMasterData'
import { look, addStore } from './modal/list'
import request from "@/api/api.request.download";
import { downloadFile } from "@/libs/assist";
import { CAPI } from "@A/common";

export default {
  components: { look, addStore },
  data () {
    return {
      flag: '',
      matCode: '',
      paramMat: '', // 传给子组件matCode参数初始化
      formData: {
        matSync: '' // 物料同步
      },
      list: [],
      selectList: [], // 选中列表
      isLook: false,
      head: {
        paging: true, // 是否分页
        totalCount: -1, // 总页数
        pageIndex: 1, // 当前页数
        pageSize: 48, // 每页显示行数
        sortColumn: '', // 排序字段
        sortAscend: true, // 升序true，降序false
        condition: ''
      },
      isAddStore: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    selectionChange ({ selection }) {
      this.selectList = selection
    },
    prePrintValidation () {
      if (!this.selectList.length) {
        this.$Notice.warning({ desc: this.$t("msg_notice_145") });
        return false;
      }
      return true;
    },
    printBarCode () {
      var eCommand = () => {
          //var sendDataList = this.itemTableList.map(item => {
          //console.log('this.list',this.list)
          var sendDataList = this.list.map(item => {
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
            weightUnitCode: item.weightUnitCode || "",
            receiptQty: item.receiptQty || 0,
            whCode: item.whCode || "CB01",
            binCode: item.binCode || "",
            heatNumber: item.heatCode || "",
            qrCodeValue: qrCode || "",
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
    exportMatLabel() {
        var eCommand =async () => {
        var sendDataList = this.selectList.map(item => {
          var qrCode ={
            DN:item.receiptCode || "",
            PO:item.shippingRef || "",
            SKU:item.matCode || "",
            Batch:item.lotNumb || ""
          } 
          console.log('item=',item)
          return {
            dn:item.receiptCode,
            po:item.shippingRef,
            batch:item.lotNumb,
            vendorCode: item.vendorCode,
            matCode: item.matCode,
            matName: item.matName,
            weightQty: item.weightQty || 0,
            weightUnitCode: item.weightUnitCode || "",
            receiptQty: item.receiptQty || 0,
            whCode: item.whCode || "CB01",
            binCode: item.binCode || "",
            heatNumber: item.heatCode || "",
            qrCodeValue: qrCode || "",
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
    // 获取数据
    async getData () {
      var sendData = {
        condition: this.head.condition,
        matCode: this.head.condition,
        // 必传参数（分页与排序）
        pageIndex: this.head.pageIndex,
        pageSize: this.head.pageSize,
        paging: this.head.paging,
        totalCount: -1,
        sortColumn: this.head.sortColumn,
        sortAscend: this.head.sortAscend
      }

      var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
      var data = res.data
      this.$set(this.head, 'totalCount', data.totalCount)

      var dangerousMap = { 0: this.$t('base_close'), 1: this.$t('base_open') },
        freezeMap = { 0: this.$t('base_close'), 1: this.$t('base_open') }

      data.headList.forEach(function (item) {
        item.__unitWeight__ = `${item.unitWeight} - ${item.unitWeightName}`
        item.__unitCode__ = `${item.unitCode} - ${item.unitName}`
        item.__matGroupCode__ = `${item.matGroupCode} - ${item.matGroupName}`
        item.dangerous = dangerousMap[item.dangerous]
        item.freeze = freezeMap[item.freeze]
      })
      this.list = data.headList

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
    // 搜索
    search (condition) {
      this.$set(this.head, 'condition', condition)
      this.$set(this.head, 'pageIndex', 1)
      this.getData()
    },
    // 同步
    sync () {
      var _this = this


      if (!_this.formData.matSync) {
        this.$Notice.warning({ desc: _this.$t('ph_placeholder_10') })

        return false
      }

      var eCommand = () => {

        API.AAsyncMaterial(_this.formData.matSync)
          .then((res) => {
            _this.$Notice.success({
              desc: res.returnMsg,
              duration: 2,
              onClose: function () {
                _this.$emit('ok-drawer') // 刷新列表页
                _this.modalVal = false
                _this.formData.matSync = '' // 物料同步
              }
            })
          })
      }

      // 确认弹窗
      _this.$confirm({
        content: _this.$t('msg_notice_97'),
        onOk: eCommand
      })
    },
    clearData () {
      this.head.condition = ''
      this.formData.matSync = '' // 物料同步
      this.head.sortColumn = ''
      this.head.sortAscend = true
    },
    show (matCode, flag) {
      this.matCode = matCode
      this.flag = flag
      this.isLook = true
    },
    add (matCode) { // 新增
      this.matCode = matCode
      this.isAddStore = true
    },
    okDrawer () {
      this.getData()
    }
  }
}

</script>
