<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-25 13:14:24
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-11 13:01:21
 * @Description: description
 -->
<template>
  <Drawer :title="$t('btn_checkthedifference')" :closable="true" v-model="modalVal" :mask-closable="true" @on-visible-change="visibleChange" width="1700">
    <div style="height:100%">
      <Row style="height:calc(100% - 50px);">
        <vxe-table :cell-class-name="cellClassName" :row-class-name="rowClassName" :data="list" height="auto" stripe show-overflow resizable v-if="modalVal" @checkbox-change="selectionChange" @checkbox-all="selectionChange" :checkbox-config="{ reserve: true, highlight: true, checkMethod: checkMethod }">
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column min-width="160" field="stockTakeResultName" :title="$t('col_receipt_status')"></vxe-table-column>
          <vxe-table-column min-width="160" field="typeCode" :title="$t('Zone')">
            <template v-slot="{ row }">
              <!-- <span>{{ row.typeCode }} - {{ row.typeName }}</span> -->
              <span>{{ row.typeCode }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column min-width="160" field="binCode" :title="$t('LocationCode')"></vxe-table-column>
          <vxe-table-column min-width="160" field="matCode" :title="$t('Item')"></vxe-table-column>
          <!-- <vxe-table-column min-width="160" field="lotNumb" :title="$t('lotNumb')"></vxe-table-column> -->
          <vxe-table-column min-width="80" field="ext3" title="MfgID"></vxe-table-column>
          <vxe-table-column min-width="80" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
          <vxe-table-column min-width="80" field="ext7" :title="$t('prddate')"></vxe-table-column>
          <vxe-table-column min-width="80" field="ext8" :title="$t('expdate')"></vxe-table-column>
          <vxe-table-column min-width="80" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
          <vxe-table-column min-width="160" field="weightQty" :title="$t('weight_qty')"></vxe-table-column>
          <vxe-table-column min-width="160" field="stockTakeQty" :title="$t('ActQty')"></vxe-table-column>
          <vxe-table-column min-width="160" field="diffCount" :title="$t('Diff')"></vxe-table-column>
          <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
          <!-- <vxe-table-column min-width="160" field="qty" :title="$t('QtyInPCS')"></vxe-table-column> -->
          <vxe-table-column min-width="160" field="stockTakeUserName" :title="$t('col_stock_take_user')"></vxe-table-column>
          <!-- <vxe-table-column min-width="160" field="moveDate" :title="$t('col_move_data')"> </vxe-table-column> -->
          <!-- <vxe-table-column min-width="160" field="heatCode" :title="$t('Heat')"></vxe-table-column>
          <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
        </vxe-table>
      </Row>
    </div>
    <div class="demo-drawer-footer">
      <Button type="primary" class="ivu-btn-button-create-ghost  margin-right-24" @click="cancel">{{ $t('btn_return') }}</Button>
      <!-- <Button v-if="enabledOperation" type="primary" class="ivu-btn-button-create-large margin-right-24" @click="reInventory">
        {{ $t('btn_recount') }}
      </Button> -->
      <!-- <Button v-if="enabledOperation && this.list.length" type="primary" class="ivu-btn-button-create-large margin-right-24" @click="differenceHandle"> -->
      <Button v-if="enabledOperation && this.unDoList.length && this.head.docNum.length > 0" type="primary" class="ivu-btn-button-create-large margin-right-24" @click="differenceHandle">
        {{ $t('btn_diffprocessing') }}
      </Button>
      <!-- <Button v-if="enabledOperation && this.list.length === 0" type="primary" class="ivu-btn-button-create-large" @click="completeHandle"> -->
      <Button v-if="(enabledOperation && this.unDoList.length === 0) || (enabledOperation && this.head.docNum.length === 0) " type="primary" class="ivu-btn-button-create-large" @click="completeHandle">
        {{ $t('btn_finish') }}
      </Button>
    </div>
  </Drawer>
</template>

<script>
import { API } from '@A/warehouse/PInvDiffInquiry'
export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    head: {
      type: Object,
      default () {
        return {}
      }
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
    },
    enabledOperation () {
      //console.log("this.list",this.list)
      //console.log("this.head.receiptStatus:",this.head.receiptStatus)
      // //this.getItemList()
      // for (var i in this.list) {
      //   if (this.list[i].status != 52) {
      //     this.unDoList.push(this.list[i])
      //   }
      // }
      return this.head.receiptStatus != 90
    }
  },
  data () {
    return {
      list: [],
      unDoList:[],
      selection: []
    }
  },
  methods: {
    visibleChange (isShow) {
      if (isShow) {
        this.getItemList()
      } else {
        this.cancel()
      }
    },
    async getItemList () {
      this.unDoList=[]
      //console.log("call getItemList")
      var [err, res] = await this.$to(API.AGetDifferenceList({ head: this.head })); if (err) { return false }
      this.list = res.data.itemList

      
      var newJson = []; //盛放去重后数据的新数组
      
      for( var item1 of this.list){  //循环json数组对象的内容
        if(item1.ext9 == undefined){
          item1.ext9=""
        }
        var flag = true;  //建立标记，判断数据是否重复，true为不重复
      
        for( var item2 of newJson){  //循环新数组的内容
      
          if(item1.typeCode.trim()==item2.typeCode.trim() 
          && item1.binCode.trim()==item2.binCode.trim()  
          && item1.matCode.trim()==item2.matCode.trim()
          && item1.lotNumb.trim()==item2.lotNumb.trim()
          && item1.ext9.trim()==item2.ext9.trim()
          ){ //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
            flag = false;
            item2.weightQty = parseInt(item2.weightQty) + parseInt(item1.weightQty)
            item2.stockTakeQty = parseInt(item2.stockTakeQty) + parseInt(item1.stockTakeQty)
            //console.log("item2.weightQty",item2.weightQty)
            //console.log("item2.stockTakeQty",item2.stockTakeQty)

          }
      
        }
      
        if(flag){ //判断是否重复
          newJson.push(item1); //不重复的放入新数组。  新数组的内容会继续进行上边的循环。
        }
      }
      this.list = newJson
      //console.log("this.list",this.list)
      for (var i in this.list) {
        //console.log("this.list[i].status=",this.list[i].status)
        if (this.list[i].status != 52 && this.list[i].weightQty != this.list[i].stockTakeQty) {
          this.unDoList.push(this.list[i])
        }
      }
      var tmplist = []
      for(var i in this.list){
        if(this.list[i].weightQty != this.list[i].stockTakeQty) {
          //console.log("delete")
          tmplist.push(this.list[i])
        }
      }
      this.list = tmplist

      for(var i in this.list){
        this.list[i].diffCount = this.list[i].stockTakeQty - this.list[i].weightQty 
      }
      //console.log("undolist=",this.unDoList)
      //console.log("this.list=",this.list)
    },
    cellClassName ({ row, rowIndex, column, columnIndex }) {
      if (column.property === 'stockTakeResultName') {
        //if (row.stockTakeResult == 2) {
        if (row.stockTakeQty < row.weightQty) {
          return 'table-warn-row'
        //} else if (row.stockTakeResult == 1) {
        } else  {
          return 'table-success-row'
        }
      }
    },
    rowClassName ({ row }) {
      if (row.status == 52) {
        return 'table-freeze-row'
      }
    },
    cancel () {
      this.modalVal = false
      // 清空脏数据
      this.list = []
    },
    selectionChange ({ selection }) {
      this.selection = selection
    },
    // 是否可选
    checkMethod ({ row }) {
      return row.status != 52
    },
    // 成功回调
    successHandle (res) {
      this.$router.push({ name: 'inv_diff_inquiry' })
      this.$Notice.success({ desc: res.returnMsg })
      this.modalVal = false
    },
    // 完成盘点
    async completeHandle () {
      var [err, res] = await this.$to(API.ACompleteDifferenceList(this.head.stockTakeCode)); if (err) { return false }
      this.successHandle(res)
    },
    // 重新盘点
    // reInventory () {
    //   var _this = this

    //   if (!this.selection.length) {
    //     this.$Notice.warning({ desc: this.$t('msg_notice_145') })
    //     return false
    //   }

    //   var eCommand = () => {
    //     API.ADiffReInventory({ head: _this.head, itemList: this.selection }).then((res) => { _this.successHandle(res) })
    //   }

    //   this.$confirm({
    //     content: this.$t('msg_notice_6'),
    //     onOk: eCommand
    //   })
    // },
    // 差异处理
    differenceHandle () {
      var _this = this

      if (!this.selection.length) {
        this.$Notice.warning({ desc: this.$t('msg_notice_145') })
        return false
      }

      var eCommand = () => {
        API.ABinDifferenceHandle({ head: _this.head, itemList: this.selection }).then((res) => {
          _this.$Notice.success({ desc: res.returnMsg })
          _this.modalVal = false
          _this.$emit('on-ok')
        })
      }

      this.$confirm({
        content: this.$t('msg_notice_01'),
        onOk: eCommand
      })
    },
  }

}
</script>
