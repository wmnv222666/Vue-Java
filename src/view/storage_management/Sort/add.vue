<template>
  <div>
    <Drawer :title="$t('sta_1')" v-model="modalVal" :closable="true" :mask-closable="true" :before-close="handleBeforeClose" @on-visible-change="handleVisibleChange" width="1200">
      <Row class="h100">
        <Col span="24">
        <x-search-header className="x-three">
          <template slot="head">
            <ButtonGroup>
              <!-- <Button icon="ios-search" @click="search" :disabled="formData.bundleCode === '' && formData.binCode === ''">{{ $t('btn_find') }}</Button> -->
              <Button icon="ios-search" @click="search" >{{ $t('btn_find') }}</Button>
            </ButtonGroup>
          </template>
          <template slot="body">
            <!-- <search-in flex :title="$t('Lotnumb')">
              <Input type="text" v-model="formData.bundleCode" :maxlength="60" />
            </search-in> -->
            <!-- <search-in flex :title="$t('LocationCode')"> -->
              <!-- <AutoComplete transfer v-model="formData.binCode" :data="data3" :filter-method="filterMethod" @on-change="binCodeChangeHandle"> -->
              <!-- <AutoComplete clearable v-model="formData.binCode" :data="data3" :filter-method="filterMethod"> -->
                <!-- <Option v-for="(item, i) in binCodeList" :value="item.binCode" :key="i" :label="item.label"></Option> -->
              <!-- </AutoComplete> -->
            <!-- </search-in> -->

            <!-- <search-in flex title="Zone">
              <Input type="text" v-model="formData.typeCode" />
            </search-in> -->
            <search-in flex :title="$t('LocationCode')">
              <Input type="text" v-model="formData.binCode" />
            </search-in>
            <search-in flex :title="$t('condition')">
              <Input type="text" v-model="formData.condition" />
            </search-in>
          </template>
        </x-search-header>
        </Col>
        <Col span="24" class="margin-t-16" style="height: calc(100% - 180px);">
        <!--主体-->
        <vxe-table ref="createTable" v-if="modalVal" :data="list" height="auto" stripe show-overflow="title" resizable @checkbox-change="selectionChange" @checkbox-all="selectionChange" :checkbox-config="{ highlight: true }">
          <vxe-table-column :key="1" type="checkbox" width="60"></vxe-table-column>
          <!-- <vxe-table-column sortable min-width="160" field="sourceTypeCode" :title="$t('Zone')"> -->
            <!-- <template v-slot="{ row }">
              <span>{{ row.sourceTypeCode }} - {{ row.sourceTypeName }}</span>
            </template> -->
          <!-- </vxe-table-column> -->
          <vxe-table-column sortable min-width="80" field="sourceBinCode" :title="$t('LocationCode')"></vxe-table-column>
          <!-- <vxe-table-column min-width="160" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
          <vxe-table-column min-width="100" field="weightQty" :title="$t('weight_qty')"></vxe-table-column>
          <vxe-table-column min-width="80" field="matCode" :title="$t('col_mat_code')"></vxe-table-column>
          <vxe-table-column min-width="80" field="matName" :title="$t('col_mat_name')"></vxe-table-column>
          <vxe-table-column min-width="80" field="ext3" title="MfgID"></vxe-table-column>
          <vxe-table-column min-width="80" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
          <vxe-table-column min-width="80" field="ext7" :title="$t('prddate')"></vxe-table-column>
          <vxe-table-column min-width="80" field="ext8" :title="$t('expdate')"></vxe-table-column>
          <vxe-table-column min-width="80" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
          <!-- <vxe-table-column min-width="160" field="heatCode" :title="$t('Heat')"></vxe-table-column>
          <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
        </vxe-table>
        </Col>
      </Row>

      <div class="demo-drawer-footer">
        <Button type="primary" class="ivu-btn-button-create margin-right-24" @click="okHandle">{{ $t('btn_confirm') }}</Button>
        <Button type="primary" class="ivu-btn-button-create-ghost" @click="returnHandle">{{ $t('btn_return') }}</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { API } from '@A/warehouse/Sort'
export default {
  name: 'create',
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    binCodeListReturn: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      data3: [],
      binCodeList: [],
      formData: {
        bundleCode: "",
        typeCode: "",
        binCode: ""
      },
      list: [],
      selection: [] // 选中数据
    }
  },
  computed: {
    modalVal: {
      get: function () {
        return this.drawer
      },
      set: function (val) {
        this.$emit('update:drawer', val)
      }
    }
  },
  watch: {
    binCodeListReturn: function (newList) {
      //console.log('newList=', newList)
      this.binCodeList = newList
      newList.map(item=>this.data3.push(item.label))
      //console.log('this.binCodeList',this.binCodeList)
      //console.log('this.data3',this.data3)
    }
  },
  methods: {
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
    async getData () {
      this.list =[]
      var reg = /[^\w ,]/g;
      var regbin = /[^\w ,-]/g;
      if(typeof(this.formData.typeCode) != "undefined"){this.formData.typeCode = this.formatSearch(this.formData.typeCode)}
      if(typeof(this.formData.condition) != "undefined"){this.formData.condition = this.formatSearch(this.formData.condition)}
      //if(typeof(this.formData.binCode) != "undefined"){this.formData.binCode = this.formatSearch(this.formData.binCode)}
      if(reg.test(this.formData.typeCode)){
        this.$Notice.warning({ desc: this.$t('msg_notice_146') })
      }else if(reg.test(this.formData.condition)){
        this.$Notice.warning({ desc: this.$t('msg_notice_146') })
      }else if(regbin.test(this.formData.binCode)){
        this.$Notice.warning({ desc: this.$t('msg_notice_155') })
      }
      // //  预留单列表
      // //console.log('this.formData.binCode',this.formData.binCode)
      // var label = this.formData.binCode
      // var binInfo = this.binCodeList.find(function (item) {
        //   //return item.binCode === binCode
      //   //return item.label === this.formData.binCode
      //   return item.label === label
      // })
      // if(binInfo != null){
        //   //console.log('binInfo=',binInfo)
      //   this.formData.binCode = binInfo.binCode
      //   this.formData.typeCode = binInfo ? binInfo.typeCode : ''
      //   //console.log('binInfo.binCode=',binInfo.binCode)
      // }
      //console.log('this.formData=',this.formData)
      var sendData = Object.assign({}, this.formData, { totalCount: -1 });
      //console.log("fasdfa")
      // sendData.binCode = this.formatMinus(this.formData.binCode)  //2021-11-01 注释
      sendData.binCode = this.formData.binCode ? this.formData.binCode : '0000'  //2021-11-01 新加
      if(!sendData.binCode){
        return
      }
      if(sendData.binCode=='0000'){
        sendData.binCode=''
      }
      //console.log("fasdfa")
      //var [err, res] = await this.$to(API.AGetItem(this.formData)); if (err) { return false }
      var [err, res] = await this.$to(API.AGetItem(sendData)); if (err) { return false }
      //this.formData.bundleCode=''
      //this.formData.typeCode=''
      //this.formData.binCode=''
      this.list = res.data.taskList
      //console.log(this.list)
    },
    // 查询条件校验
    preSearchValidation () {
      return true
    },
    search () {
      if (!this.preSearchValidation()) {
        return false
      }
      this.getData()
    },
    filterMethod (label, option) {
      //console.log('label=',label)
      //console.log('option', option)
      //return option.indexOf(value) !== -1;
      return option.toUpperCase().indexOf(label.toUpperCase()) !== -1;
    },
    // binCode切换
    binCodeChangeHandle (binCode) {
      if(typeof(binCode) != "undefined"){
        //console.log('binCode=',binCode)
        var binInfo = this.binCodeList.find(function (item) {
          //return item.binCode === binCode
          return item.label === binCode
        })
        //console.log('binInfo=',binInfo)
        this.formData.binCode = binInfo.binCode
        this.formData.typeCode = binInfo ? binInfo.typeCode : ''
        //console.log('binInfo.binCode=',binInfo.binCode)
      }
    },
    // 批量选中改变
    selectionChange ({ selection }) {
      this.selection = selection
    },
    // 显示状态发生变化时触发
    handleVisibleChange (visible) {
      if (visible) {
        //  show Handler
      } else {
        //  hide Handler
        this.returnHandle()
      }
    },
    // 返回 Promise 可以阻止关闭
    handleBeforeClose () {
      return new Promise((resolve) => {
        this.$confirm({
          content: this.$t('msg_notice_888'),
          onOk: () => { resolve(); }
        });
      });
    },
    // 返回回调
    returnHandle () {
      this.modalVal = false
      this.list = []
      this.selection = []
    },
    // 确定回调
    okHandle () {
      const ob = this.list[0];
      if (!this.selection.length) {
        this.$Notice.warning({ desc: this.$t('msg_notice_145') })
        return false
      }
       ob.uuid = this.setUuid();
      this.$emit('on-ok', this.selection)
      //console.log("this.selection",this.selection)

      this.modalVal = false
    }
  }
}
</script>
