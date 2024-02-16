<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-19 10:40:01
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-11 13:02:38
 * @Description: description
 -->
<template>
  <div class="modal-body padding-bottom-fixed">
    <div class="i-box clearfix">
      <x-search-header @on-search="search">
        <!-- <template slot="head">
          <ButtonGroup>
            <Button icon="ios-search" @click="search">{{ $t('btn_find') }}</Button>
          </ButtonGroup>
        </template> -->
        <template slot="body">
          <!-- <search-in flex :title="$t('Lotnumb')">
            <Input type="text" v-model="formData.bundleCode" :maxlength="60" />
          </search-in> -->
          <search-in flex :title="$t('DNumber')">
            <Input type="text" v-model="formData.receiptCode" :maxlength="20" />
          </search-in>
          <!-- <search-in flex :title="$t('ShippingRef')">
            <Input type="text" v-model="formData.shippingRef" :maxlength="20" />
          </search-in> -->
          <ButtonGroup>
            <Button icon="ios-search" @click="search">{{ $t('btn_find') }}</Button>
          </ButtonGroup>
        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16">
      <vxe-table ref="sTable" :sync-resize="tabVisible" :data="completeList" max-height="600" stripe show-overflow resizable row-id="xid" highlight-cell :checkbox-config="{ reserve: true, highlight: true }" :tree-config="{ children: 'children' }" >
        <!-- <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
        <vxe-table-column min-width="250" field="id" :title="$t('DNumber')" tree-node>
          <template v-slot="{ row }">
            <span v-if="row.parent">
<!--               <span class="margin-r-10">{{row.id}}</span> -->
              <!-- <Button @click="sendEmail(row)" size="small">{{ $t('btn_export') }}</Button> -->
              <span class="margin-r-10">{{row.id}}</span>
              <Button v-if="row.receiptStatus == 90" @click="cancelOrderHandle(row)" size="small">{{ $t('btn_reverse') }}</Button>
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column min-width="160" field="matCode" title="Item"></vxe-table-column>
        <vxe-table-column min-width="100" field="matExt1" title="UPC"></vxe-table-column>
        <vxe-table-column min-width="200" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
        <vxe-table-column min-width="160" field="ext0" :title="$t('Shipping Ref#')"></vxe-table-column>

        <vxe-table-column min-width="60" field="ext3" title="MfgID"></vxe-table-column>
        <vxe-table-column min-width="60" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
        <vxe-table-column min-width="80" field="ext7" :title="$t('prddate')"></vxe-table-column>
        <vxe-table-column min-width="80" field="ext8" :title="$t('expdate')"></vxe-table-column>
        <vxe-table-column min-width="100" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
        <vxe-table-column min-width="60" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
        <vxe-table-column min-width="110" field="receiptQty" :title="$t('ReceiptQty')"></vxe-table-column>
        <!-- <vxe-table-column min-width="80" field="actualWeightQty" :title="$t('ActQty')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="200" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->
        <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
        <vxe-table-column min-width="180" field="weightQty" :title="$t('Qty')"></vxe-table-column>
        <vxe-table-column min-width="200" field="receiptCode" :title="$t('DNumber')"></vxe-table-column>

        <!-- <vxe-table-column min-width="160" field="ext1" :title="$t('ENG#')"></vxe-table-column>
        <vxe-table-column min-width="200" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column>
        <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
        <vxe-table-column min-width="180" field="weightQty" :title="$t('Qty')"></vxe-table-column>-->
        <vxe-table-column min-width="180" field="targetBinCode" :title="$t('SugLoc')">
          <template v-slot="{ row }">
            <span>{{ row.targetTypeCode }} / {{ row.targetBinCode }}</span>
          </template>
        </vxe-table-column>
        <!-- <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
        <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
      </vxe-table>

      <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
      </Col>
    </div>
  </div>
</template>

<script>
import { API } from '@A/warehouse/PutAway'

export default {
  data () {
    return {
      tabVisible: 'p3',
      cropList: [], // 公司下拉
      todoList: [],
      savedList: [],
      completeList: [],
      formData: {
        whCode: this.$store.getters.UserCropCode,  //2021-10-07 新加
        corpCode: '',
        bundleCode: '',
        shippingRef: '',
        receiptCode: ''
      },
      // 分页\排序
      head: {
        paging: false,
        totalCount: -1,
        pageIndex: 1,
        pageSize: 100,
        sortColumn: '',
        sortAscend: true
      }
    }
  },
  created () {

  },
  methods: {
    // 获取列表
    async getData () {
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 })
      var [err, res] = await this.$to(API.ACompleteTaskList(sendData)); if (err) { return false }
      this.head.totalCount = res.data.totalCount
      this.completeList = this.dataSort(res.data.taskList) || [];
    },
    dataSort (data) {
      let data1 = {}
      let value1 = []
      for (let i = 0; i < data.length; i++) {
        let ai = data[i]
        ai.id = ai.receiptCode
        if (!data1[ai.id]) {
          value1.push({
            id: ai.id,
            receiptStatus: ai.receiptStatus,
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
    search () {
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
    successHandle (res) {
      this.$Notice.success({ desc: res.returnMsg });
      this.getData();
    }
  }
}

</script>
