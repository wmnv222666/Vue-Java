<template>
  <div style="display:inline-block">
    <!-- <Button :loading="exportLoading" style="margin-left:16px;" type="primary" @click="exportExcel" icon="md-trending-up">
      export Template
    </Button> -->

    <Upload action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx" style="display:inline-block;margin-left:16px;">
      <Button icon="md-trending-down" @click="handleUploadFile">Import</Button>
    </Upload>

    <!-- <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <Button :loading="loading" style="margin-left:16px;" type="primary" @click="handleUpload" icon="md-trending-down">
        import
      </Button>
    </div> -->
  </div>
</template>

<script>
import XLSX from "xlsx";
import excel from "./excel";
var timerImport = null

// var valueKey = {
//   "SO Code": "soCode",
//   "SO Rid": "soRid",
//   "PO Type": "receiptType",
//   "PO Code": "poCode",
//   "Item Code": "matCode",
//   "Qty": "weightQty",
//   "Vendor Code": "vendorCode",
//   "Vendor Name": "vendorName",
//   "Warehouse Code": "whCode",
//   "Company Code": "corpCode",
//   "PO Code": "poCode",
//   "PO Rid": "poRid",
//   "ShippingRef": "shippingRef",
//   "Batch": "bundleCode",
//   "UoM": "weightUnitCode",
//   "Stock Status": "stockStatus",
//   "Level 1": "heatCode",
//   "Level 2": "skidCode"
// };

export default {
  props: {
    typeIO: {
      type: Number,
      default: 1
    },
    onSuccess: Function // eslint-disable-line
  },
  data () {
    return {
      loading: false,
      exportLoading: false,
      excelData: {
        header: null,
        results: null
      },
      exportLoading: false,
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      loading: true,
      tableColumn: [],
      tableData: [],
      GRMap: {
        poCode: "Document Number",//ok
        receiptType: "PO Type",//ok
        shippingRef: "ShippingRef#",//ok
        matCode: "Item",//ok
        weightUnitCode: "UofM",//ok
        bundleCode: "Batch#",//ok
        weightQty: "Qty",//OK
        poRid:"po rid",
        // vendorCode: "Vendor Code",
        // vendorName: "Vendor Name",
        whCode: "Warehouse Code",
        corpCode: "Company Name",//OK
        stockStatus: "Quality status",//OK
        // heatCode: "Level 1",
        // skidCode: "Level 2"
        ext0: "vin",
        ext1: "eng",
        ext2: "mtype"
      },
      DeliveryMap: {
        soCode: "SO Code",
        soRid: "so rid",
        receiptType: "SO Type",
        //shippingRef: "ShippingRef",
        matCode: "Item Code",
        weightUnitCode: "UoM",
        bundleCode: "Batch#",
        weightQty: "Qty",
        whCode: "Warehouse Code",
        corpCode: "Company Name",//OK
        //heatCode: "Level 1",
        //skidCode: "Level 2"
        ext0: "vin",
        ext1: "eng",
        ext2: "mtype"
      }
    };
  },
  methods: {
    findKey (value) {
      var compare = (a, b) => a === b
      var dataMap = this.getDataMapByModelName()
      return Object.keys(dataMap).find(k => compare(dataMap[k], value))
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
    getDataMapByModelName () {
      var mapLabel = {
        1: this.GRMap,
        2: this.DeliveryMap,
      }
      return mapLabel[this.typeIO]
    },
    getFileNameByModelName () {
      var mapLabel = {
        1: "Template In",
        2: "Template Out",
      }
      return mapLabel[this.typeIO]
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
    handleUploadFile () {
      this.initUpload()
    },
    initUpload () {
      this.file = null
      this.showProgress = false
      this.loadingProgress = 0
      this.tableData = []
      this.tableTitle = []
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
        results = this.formatDataList(results)
        this.generateData({ header, results });
      }
    },
    generateData (data) {
      this.onSuccess && this.onSuccess(data);
    }
  }
};
</script>
