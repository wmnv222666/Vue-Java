<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-19 10:40:01
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-30 15:14:03
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
          <search-in flex :title="$t('ShippingRef')">
            <Input type="text" v-model="formData.shippingRef" :maxlength="20" />
          </search-in>
          <search-in flex :title="$t('Lotnumb')">
            <Input type="text" v-model="formData.bundleCode" />
          </search-in>
          <search-in flex :title="$t('condition')">
            <Input type="text" v-model="formData.condition" />
          </search-in>
        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16" style="height:calc(100% - 250px);">
      <vxe-table ref="sTable" :data="list" height="auto" stripe show-overflow resizable>
        <!-- <vxe-table-column min-width="160" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
        <vxe-table-column min-width="180" field="matCode" :title="$t('Item')"></vxe-table-column>
        <vxe-table-column min-width="180" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->
        <vxe-table-column min-width="180" field="weightQtyIns" title="Qty In INS"></vxe-table-column>
        <vxe-table-column min-width="180" field="weightQtyGp" title="Qty IN GP"></vxe-table-column>
        <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
        <vxe-table-column min-width="180" field="corpCodeIns" title="Crop In INS"></vxe-table-column>
        <vxe-table-column min-width="180" field="corpCodeGp" title="Crop In GP"></vxe-table-column>
        <vxe-table-column min-width="160" field="whCode" :title="$t('WarehouseCode')"></vxe-table-column>
        <vxe-table-column min-width="180" field="typeCode" :title="$t('ZoneCode')"></vxe-table-column>
        <vxe-table-column min-width="180" field="binCode" :title="$t('LocationCode')"></vxe-table-column>
        <vxe-table-column min-width="160" field="stockStatus" :title="$t('Bin')"></vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="heatCode" :title="$t('Heat')"></vxe-table-column>
        <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
      </vxe-table>

      <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
      </Col>
    </div>
  </div>
</template>

<script>
import { API } from '@A/system/Reporting'
import { CAPI } from '@A/common'

export default {
  data () {
    return {
      list: [],
      cropList: [],
      formData: {
        condition: '',
        binCode: '',
        receiptType: '',
        receiptCode: '',
        corpCode: '',
        bundleCode: '',
        soCode: '',
        sDate: '',
        eDate: '',
        shippingRef: ''
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
    }
  },
  created () {
    // this.getCropList()
  },
  methods: {
    // 获取列表
    async getData () {
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 })
      var [err, res] = await this.$to(API.AGetListTransferCrop(sendData)); if (err) { return false }
      var data = res.data
      this.head.totalCount = res.data.totalCount
      this.list = data.binList || []
    },
    // 获取公司列表
    async getCropList () {
      var [err, res] = await this.$to(CAPI.AGetCropList()); if (err) { return false }
      this.cropList = this.$kv(res.data, 'corpCode', 'corpName', true)
    },
    dateChangeHandle (date) {
      this.formData.sDate = date[0]
      this.formData.eDate = date[1]
    },
    search () {
      this.head.pageIndex = 1
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
    async exportExcel () {
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1, paging: false })
      var [err, res] = await this.$to(API.AGetListTransferCrop(sendData)); if (err) { return false }
      var data = res.data
      var excelList = data.binList || []
      this.$refs.sTable.exportData({
        filename: 'Discrepancy Report',
        type: 'csv',
        isHeader: true,
        isFooter: true,
        data: excelList
      })
    }
  }
}

</script>
