<!--
 * @Author: your name
 * @Date: 2020-05-22 14:32:04
 * @LastEditTime: 2020-06-15 11:58:35
 * @LastEditors: JiangXiao
 * @Description: In User Settings Edit
 * @FilePath: \SaaS_web\src\view\system_management\data_importer\list.vue
--> 
<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24" class="margin-b-16">

          <RadioGroup v-model="modelName" @on-change="modelChangeHandle">
            <Radio label="0" border>User</Radio>
            <Radio label="1" border>Company</Radio>
            <Radio label="2" border>Warehouse</Radio>
            <Radio label="3" border>Zone</Radio>
            <Radio label="4" border>Location</Radio>
            <Radio label="5" border>Item Master</Radio>
            <Radio label="6" border>UoM</Radio>
            <Radio label="7" border>Physical Inventory</Radio>
            <Radio label="8" border>Good Receive</Radio>
            <Radio label="9" border>Pick</Radio>
          </RadioGroup>
          </Col>
          <Divider />

          <Col class="margin-b-16">
          <Button icon="md-trending-up" @click="exportExcel">Export Template</Button>
          <Upload action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx" style="display:inline-block;margin-left:16px;">
            <Button icon="md-trending-down" @click="handleUploadFile">Import</Button>
          </Upload>
          </Col>

          <vxe-grid ref="xTable" border resizable height="300" :loading="false" :columns="tableColumn" :data="tableData"></vxe-grid>
        </div>
      </Row>
    </div>
  </div>
</template>

<script>
import { API } from '@A/system/DataImporter'
import excel from '_c/UploadExcel/excel'
var timerImport = null

export default {
  components: {},
  data () {
    return {
      UserMap: {
        userCode: this.$t('col_user_code'),
        userName: 'User Name',
        email: this.$t('lbl_email'),
        phoneNumber: this.$t('lbl_phone'),
        validityBeginDate: this.$t('ph_placeholder_35'),
        validityEndDate: this.$t('ph_placeholder_36')
      },
      CompanyMap: {
        corpCode: this.$t('sel_company_code'),
        corpName: this.$t('col_corp_name')
      },
      WarehouseMap: {
        whCode: this.$t('lbl_wh_code'),
        whName: this.$t('WarehouseName'),
        country: 'Postal Code',
        city: this.$t('lbl_city'),
        whAddress: this.$t('col_address'),
      },
      ZoneMap: {
        typeCode: 'Zone Code',
        typeName: 'Zone Name',
        whCode: this.$t('col_ascription_wh_code'),
      },
      LocationMap: {
        whCode: this.$t('lbl_wh_code'),
        typeCode: 'Zone Code',
        binCode: 'Location',
        weightMax: this.$t('lbl_max_weight_status')
      },
      ItemMasterMap: {
        matCode: this.$t('col_mat_code'),
        matName: this.$t('col_mat_name'),
        unitWeight: 'UoM',
        netWeight: this.$t('col_net_weight'),
      },
      UoMMap: {
        unitCode: this.$t('lbl_unit_code'),
        unitName: this.$t('lbl_unit_name'),
        decimalPlace: this.$t('lbl_decimal_digit')
      },
      PhysicalInventoryMap: {
        binCode: 'Location',
        whCode: this.$t('lbl_wh_code'),
        typeCode: 'Zone Code',
        shippingRef: this.$t('ShippingRef'),
        bundleCode: this.$t('Batch'),
        receiptType: 'PO Type',
        receiptCode: 'PO Code',
        receiptRid: 'PO Rid',
        inputDate: 'Input Date',
        vendorCode: 'Vendor Code',
        vendorName: 'Vendor Name',
        matCode: this.$t('Item'),
        weightQty: this.$t('Qty'),
        weightUnitCode: this.$t('UofM'),
        corpCode: this.$t('CompCode'),
        stockStatus: this.$t('Status')
      },
      GRMap: {
        poCode: "PO Code",
        receiptType: "PO Type",
        shippingRef: "ShippingRef",
        matCode: "Item Code",
        weightUnitCode: "UoM",
        bundleCode: "Lot Number",
        weightQty: "Qty",
        vendorCode: "Vendor Code",
        vendorName: "Vendor Name",
        whCode: "Warehouse Code",
        corpCode: "Company Code",
        stockStatus: "Stock Status",
        heatCode: "Level 1",
        skidCode: "Level 2"
      },
      DeliveryMap: {
        soCode: "SO Code",
        receiptType: "SO Type",
        shippingRef: "ShippingRef",
        matCode: "Item Code",
        weightUnitCode: "UoM",
        bundleCode: "Lot Number",
        weightQty: "Qty",
        heatCode: "Level 1",
        skidCode: "Level 2"
      },
      modelName: '0',
      exportLoading: false,
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      loading: true,
      tableColumn: [],
      tableData: []
    }
  },
  mounted () {
    this.formatDataTableColums()
  },
  methods: {
    modelChangeHandle (value) {
      this.tableData = []
      this.formatDataTableColums()
    },
    formatDataTableColums () {
      var tableColumn = [{ type: 'seq', width: 50 }]

      var dataMap = this.getDataMapByModelName()

      for (let key in dataMap) {
        tableColumn.push({
          field: key,
          title: dataMap[key],
          minWidth: 130
        })
      }
      this.tableColumn = tableColumn
    },
    getDataMapByModelName () {
      var mapLabel = {
        0: this.UserMap,
        1: this.CompanyMap,
        2: this.WarehouseMap,
        3: this.ZoneMap,
        4: this.LocationMap,
        5: this.ItemMasterMap,
        6: this.UoMMap,
        7: this.PhysicalInventoryMap,
        8: this.GRMap,
        9: this.DeliveryMap,
      }
      return mapLabel[this.modelName]
    },
    getFileNameByModelName () {
      var mapLabel = {
        0: "User Template",
        1: "Company Template",
        2: "Warehouse Template",
        3: "Zone Template",
        4: "Location Template",
        5: "Item Master Template",
        6: "UoM Template",
        7: "Physical Inventory Template",
        8: "Template In",
        9: "Template Out",
      }
      return mapLabel[this.modelName]
    },
    formatDataBeforeExport () {
      var exportTitle = [], exportKey = []
      var dataMap = this.getDataMapByModelName()
      var filename = this.getFileNameByModelName()

      for (let key in dataMap) {
        exportTitle.push(dataMap[key])
        exportKey.push(key)
      }

      return {
        title: exportTitle,
        key: exportKey,
        data: [],
        autoWidth: true,
        filename: filename
      }
    },
    exportExcel () {
      const exportData = this.formatDataBeforeExport()
      this.exportLoading = true
      excel.export_array_to_excel(exportData)
      timerImport = setTimeout(() => {
        this.exportLoading = false
      }, 1500)
    },
    handleBeforeUpload (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        this.readFile(file)
        this.file = file
      } else {
        this.$Notice.warning({ title: 'File type error' })
      }
      return false
    },
    initUpload () {
      this.file = null
      this.showProgress = false
      this.loadingProgress = 0
      this.tableData = []
      this.tableTitle = []
    },
    handleUploadFile () {
      this.initUpload()
    },
    exportData () {
      this.$refs.xTable.exportData({ type: 'csv' })
    },
    importData () {
      this.$refs.xTable.importData()
    },
    handleRemove () {
      this.initUpload()
      this.$Message.info('上传的文件已删除！')
    },
    handleBeforeUpload (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        this.readFile(file)
        this.file = file
      } else {
        this.$Notice.warning({ title: 'File type error' })
      }
      return false
    },
    // 读取文件
    readFile (file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadstart = e => {
        this.uploadLoading = true
        this.tableLoading = true
        this.showProgress = true
      }
      reader.onprogress = e => {
        this.progressPercent = Math.round(e.loaded / e.total * 100)
      }
      reader.onerror = e => {
        this.$Message.error('error reading file possibly corrupted')
      }
      reader.onload = e => {
        const data = e.target.result
        let { header, results } = excel.read(data, 'array')
        // header = this.formatHeaderList(header)
        results = this.formatDataList(results)
        // this.tableColumn = header
        results = this.dataImportBrforeCom(results)
        this.importData(results)
      }
    },
    dataImportBrforeCom (results) {
      if (this.modelName === '0') {
        results.forEach((item) => {
          item.userId = 0
        })
      }
      if (this.modelName === '1') {
        results.forEach((item) => {
          item.bankAccount = ""
          item.bankOfDeposit = ""
          item.boardCode = 1
          item.corpAddress = ""
          item.corpTaxNo = ""
          item.corpTel = ""
          item.indexDesc = 0
          item.isAccountPeriod = 0
          item.isDateEdit = 0
          item.isDateRemind = 0
          item.dicTextList = [{
            langCode: "en-US",
            text: item.corpName
          }]
        })
      }
      if (this.modelName === '2') {
        results.forEach((item) => {
          item.dicTextList = [{
            langCode: "en-US",
            text: item.whName
          }]
        })
      }
      if (this.modelName === '3') {
        results.forEach((item) => {
          item.dicTextList = [{
            langCode: "en-US",
            text: item.typeName
          }]
        })
      }
      if (this.modelName === '4') {
        results.forEach((item) => {
          item.binTypeCode = ""
          item.dicWhStorageBinTypeCode = ""
          item.freezeInput = 0
          item.freezeOutput = 0
          item.pickingAreaCode = ""
          item.reasonName = ""
          item.saveOrUpdateFlag = 10
          item.sectionCode = ""
          item.storageCellMax = ""
          item.storageCellType = ""
          item.virtualBin = 0
          item.volumeMax = ""
          item.weightMax = 1
          item.weightUnitCode = "LBS"
          item.xCoordinate = 0
          item.yCoordinate = 0
          item.zCoordinate = 0
        })
      }
      if (this.modelName === '5') {
        results.forEach((item) => {
          item.matTypeCode = 'saas'
          item.batchErpEnabled = 0
          item.batchProductEnabled = 0
          item.dangerous = 0
          item.decimalPlaceLength = 0
          item.decimalPlaceVolume = 0
          item.freeze = 0
          item.grossWeight = null
          item.height = null
          item.imgList = []
          item.indexDesc = 0
          item.isAdd = true
          item.length = null
          item.matGroupCode = ""
          item.materialNameList = [{
            langCode: "en-US",
            matName: item.matName
          }]
          item.packageEnabled = 0
          item.shelfLife = null
          item.unitLength = ""
          item.unitVolume = ""
          item.volume = null
          item.width = null
          item.unitCode = item.unitWeight
        })
      }
      if (this.modelName === '6') {
        results.forEach((item) => {
          item.dicTextList = [{
            langCode: "en-US",
            text: item.unitName
          }]
          item.externalUnitCode = ""
          item.externalUnitName = ""
        })
      }
      return results
    },
    findKey (value) {
      var compare = (a, b) => a === b
      var dataMap = this.getDataMapByModelName()
      return Object.keys(dataMap).find(k => compare(dataMap[k], value))
    },
    formatHeaderList (results) {
      return results.map(item => { return { title: item, field: this.findKey(item), 'minWidth': '120' } });
    },
    formatDataList (results) {
      var tableResult = [];
      for (var i = 0; i < results.length; i++) {
        var _item = results[i],
          item = {};
        for (var k in _item) {
          item[this.findKey(k)] = _item[k];
        }
        tableResult.push(item);
      }

      return tableResult;
    },
    successHandle (res, results) {
      this.$Notice.success({ desc: res.returnMsg });
      this.tableData = results
      this.uploadLoading = false
      this.tableLoading = false
      this.showRemoveFile = true
    },
    importData (sendData) {
      switch (this.modelName) {
        case '0': // User
          this.importDataListUser(sendData)
          break
        case '1': // Company
          this.importDataListCompany(sendData)
          break
        case '2': // Warehouse
          this.importDataListWarehouse(sendData)
          break
        case '3': // Zone
          this.importDataListZone(sendData)
          break
        case '4': // Location
          this.importDataListLocation(sendData)
          break
        case '5': // Item
          this.importDataListItem(sendData)
          break
        case '6': // UoM
          this.importDataListUoM(sendData)
          break
        case '7': // Physical
          this.importDataListPhysical(sendData)
          break
        case '8': // GR
          this.importDataListGR(sendData)
          break
        case '9': // Pick
          this.importDataListPick(sendData)
          break
      }
    },
    async importDataListUser (sendData) {
      var [err, res] = await this.$to(API.importDataListUser(sendData)); if (err) { return false }
      this.successHandle(res, sendData)
    },
    async importDataListCompany (sendData) {
      var [err, res] = await this.$to(API.importDataListCompany(sendData)); if (err) { return false }
      this.successHandle(res, sendData)
    },
    async importDataListWarehouse (sendData) {
      var [err, res] = await this.$to(API.importDataListWarehouse(sendData)); if (err) { return false }
      this.successHandle(res, sendData)
    },
    async importDataListZone (sendData) {
      var [err, res] = await this.$to(API.importDataListZone(sendData)); if (err) { return false }
      this.successHandle(res, sendData)
    },
    async importDataListLocation (sendData) {
      var [err, res] = await this.$to(API.importDataListLocation(sendData)); if (err) { return false }
      this.successHandle(res, sendData)
    },
    async importDataListItem (sendData) {
      var [err, res] = await this.$to(API.importDataListItem(sendData)); if (err) { return false }
      this.successHandle(res, sendData)
    },
    async importDataListUoM (sendData) {
      var [err, res] = await this.$to(API.importDataListUoM(sendData)); if (err) { return false }
      this.successHandle(res, sendData)
    },
    async importDataListPhysical (sendData) {
      var [err, res] = await this.$to(API.importDataListPhysical(sendData)); if (err) { return false }
      this.successHandle(res, sendData)
    },
    async importDataListGR (sendData) {
      var [err, res] = await this.$to(API.importDataListGR(sendData)); if (err) { return false }
      this.successHandle(res, sendData)
    },
    async importDataListPick (sendData) {
      console.log(sendData)
      var [err, res] = await this.$to(API.importDataListPick(sendData)); if (err) { return false }
      this.successHandle(res, sendData)
    },
    clearData () {
      this.head.condition = ''
      this.head.sortColumn = ''
      this.head.sortAscend = true
    }
  }
}
</script>
<style>
.vxe-grid.is--loading:before {
  background-color: transparent !important;
}
</style>