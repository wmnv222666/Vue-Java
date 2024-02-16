<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-15 21:26:10
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-04-13 10:07:27
 * @Description:
 -->
<template>
  <div>
    <Drawer :title="title" v-model="modalVal" :closable="true" :mask-closable="true" @on-visible-change="handleVisibleChange" width="1500">
      <Row class="h100">
        <Col span="24" class="h100">
        <vxe-table ref="allocationTable" :data="formData.sinobecStocks" height="auto" stripe show-overflow="title" :row-class-name="rowClassName" resizable row-id="stockId" v-if="modalVal" :checkbox-config="{ checkRowKeys: checkRowKeys }" @checkbox-change="selectionChange" @checkbox-all="selectionChange">
          
          
          <!-- 2021-10-20 修改 -->
          <!-- <vxe-table-column type="checkbox" width="60" :visible="!disableEdit"></vxe-table-column> -->
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <!-- 2021-10-20 修改 -->


          <!-- <vxe-table-column min-width="160" field="stockId" btitle="stockid"></vxe-table-column> -->
          <!-- <vxe-table-column min-width="160" field="typeCode" :title="$t('Zone')"></vxe-table-column> -->
          <vxe-table-column min-width="160" field="binCode" :title="$t('LocationCode')"></vxe-table-column>
          <vxe-table-column min-width="160" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
          <vxe-table-column min-width="160" field="weightQty" :title="$t('QtyO')"></vxe-table-column>
          <vxe-table-column min-width="100" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
          <vxe-table-column min-width="100" field="ext9" :title="$t('GRDate')"></vxe-table-column>
          <vxe-table-column min-width="100" field="ext8" :title="$t('expdate')"></vxe-table-column>
          <vxe-table-column min-width="100" field="ext7" :title="$t('prddate')"></vxe-table-column>
          <vxe-table-column min-width="100" field="ext3" :title="$t('mfgid')"></vxe-table-column>
          <vxe-table-column min-width="160" field="operation" :title="$t('col_opt')" :visible="!disableEdit">
            <!-- <template v-slot="scope">
              <Button type="text" @click="unPack(scope)" v-show="scope.row.weightQty">{{ $t('btn_unpack') }}</Button>
            </template> -->
          </vxe-table-column>
          
          <vxe-table-column min-width="100" field="ext11" :title="$t('pallet_qty')">
            <template v-slot="{ row }">
              <el-input-number v-model="row.ext11" :min="0"></el-input-number>
            </template>
          </vxe-table-column>

          </vxe-table>
        </Col>
      </Row>

      <div class="demo-drawer-footer">
        

        <!-- 2021-10-20 修改 -->
        <!-- <Button v-if="!formData.disableEdit" type="primary" class="ivu-btn-button-create margin-right-24" @click="okHandle">{{ $t('btn_confirm') }}</Button> -->
        <Button  type="primary" class="ivu-btn-button-create margin-right-24" @click="okHandle">{{ $t('btn_confirm') }}</Button>
        <!-- 2021-10-20 修改 -->


        <Button type="primary" class="ivu-btn-button-create-ghost" @click="returnHandle">{{ $t('btn_return') }}</Button>
      </div>
    </Drawer>
    <!-- 拆包 -->
    <unpack :drawer.sync="isUnpack" :binList="binList" @on-ok="unPackHandle" />
  </div>
</template>

<script>
import { API } from '@A/warehouse/Pick'
// 四则运算
import calculate from '@/libs/precision'
// 拆包
import unpack from './unpack.vue'

import { unique } from '@/libs/assist'
import collapseTransition from '../../../../components/searchReport/collapse-transition'

export default {
  name: 'allocation',
  components: { unpack },
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    row: {
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
    // 禁止编辑
    disableEdit () {
      return this.formData.disableEdit || this.formData.disabled
    }
  },
  data () {
    return {
      curr: 0,
      isUnpack: false,
      checkRowKeys: [], // 默认选中的行
      title: 'T',
      list: [],
      selection: [],
      formData: {},
      binList: [],
      sinobecBizTaskExt11: [],    //2021-10-18 新加
    }
  },
  methods: {
    // 显示状态发生变化时触发
    handleVisibleChange (visible) {
      if (visible) {
        // 抬头数据
        this.formData = this.$c(this.row);
        this.formData.sinobecStocks.map((item) => {
          if(item.ext11 == undefined){
            this.$set(item, 'ext11', 0)
          }
          
        })
        // console.log(this.formData.sinobecStocks)

        // 获取选中行数据
        this.checkRowKeys = this.formData.sinobecStocks.filter((item) => { return item._checked }).map((item) => { return item.stockId })


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
    },
    // 拆包
    unPack (scope) {
      this.binList = [scope.row, scope.row]
      this.curr = scope.rowIndex
      this.isUnpack = true
    },
    // 拆包回调
    unPackHandle (unpackNum) {
      //console.log('拆包回调')
      //console.log('unpackNum=',unpackNum)
      //console.log('this.curr=',this.curr)
      //console.log('this.$refs.allocationTable',this.$refs.allocationTable)
      this.formData.sinobecStocks[this.curr]['unpack'] = true
      this.formData.sinobecStocks[this.curr]['unpackNum'] = unpackNum
      //console.log("this.formData",this.formData)
      this.unpack()
    },
    // 拆包
    async unpack () {
      var [err, res] = await this.$to(API.AUnpack(this.formData)); if (err) { return false }

      var sinobecStocks = res.data.sinobecStocks || []

      sinobecStocks.forEach((item) => {
        item.unpack = false
      }) // 重置拆包数据

      //console.log('this.formData.sinobecStocks',this.formData.sinobecStocks)
      this.formData.sinobecStocks = sinobecStocks
      //console.log('this.formData.sinobecStocks',this.formData.sinobecStocks)
      this.$refs.allocationTable.clearCheckboxRow()

      this.$emit('on-unpack', sinobecStocks) // 拆包更新父页面列表
    },
    selectionChange ({ selection }) {
      //console.log('selection=',selection)
      this.formData.sinobecStocks = this.bright(selection, this.formData.sinobecStocks, 'stockId')
    },
    // checkbox 选择高亮
    bright (selection = [], list = [], _key) {
      var listArr = list
      listArr.forEach(function (v, i) {
        listArr[i]._checked = false
        selection.forEach(function (vv, ii) {
          if (v[_key] == vv[_key]) {
            listArr[i]._checked = true
          }
        })
      })
      return listArr
    },
    rowClassName ({ row }) {
      if (row._checked) {
        return 'row--cheched'
      }
    },
    // 确定回调
    async okHandle () {
      var sumQty = 0 // 已操作数量
      var binCodesList = []; // 选中的仓位集合
      this.formData.sinobecStocks.forEach((binItem) => {
        if (binItem._checked) {
          var loc = binItem.typeCode + '/' + binItem.binCode
          if (binCodesList.indexOf(loc) === -1) {
            binCodesList.push(loc)
          }
          sumQty = calculate.plus(sumQty, binItem.weightQty)

        }
      })

      if (sumQty != this.formData.weightQty) {
        // sumQty 是用户选择的总数量
        //this.formData.weightQty 是需要配货的数量
        if(sumQty > this.formData.weightQty){
          //自动拆包 
          //调用拆包回调
          //先凑上index
          var largePack = 0
          var smallPackQty = 0
          var unpackStockId = ''
          var largePackIndex = 0
          for (var i=0; i<this.$refs.allocationTable.getCheckboxRecords().length; i++){
            if(this.$refs.allocationTable.getCheckboxRecords()[i].weightQty >= this.formData.weightQty){
              largePack ++
              unpackStockId = this.$refs.allocationTable.getCheckboxRecords()[i].stockId;
              largePackIndex = i
            }else{
              smallPackQty = calculate.plus(smallPackQty, this.$refs.allocationTable.getCheckboxRecords()[i].weightQty)
            }
          }
          //console.log('largePack=',largePack)
          //console.log('smallPackQty=',smallPackQty)
          //console.log('unpackStockId=',unpackStockId)
          if(largePack <= 1 && smallPackQty < this.formData.weightQty ){
            //console.log('this.formData.sinobecStocks=',this.formData.sinobecStocks)
            //console.log('this.$refs.getCheckboxRecords()=',this.$refs.allocationTable.getCheckboxRecords())
            for (var i=0; i<this.formData.sinobecStocks.length; i++)
            { 
              //console.log('this.formData.sinobecStocks[i].stockId=',this.formData.sinobecStocks[i].stockId)
              //console.log('this.$refs.getCheckboxRecords()[0].stockId=',this.$refs.allocationTable.getCheckboxRecords()[largePackIndex].stockId)
              if(this.formData.sinobecStocks[i].stockId === this.$refs.allocationTable.getCheckboxRecords()[largePackIndex].stockId){
                this.curr = i;
                //console.log('this.curr=',this.curr)
              }
            }
            this.formData.sinobecStocks[this.curr]['unpack'] = true
            this.formData.sinobecStocks[this.curr]['unpackNum'] = sumQty-this.formData.weightQty

            var [err, res] = await this.$to(API.AUnpack(this.formData)); if (err) { return false }
            var sinobecStocks = res.data.sinobecStocks || []
            sinobecStocks.forEach((item) => {
              item.unpack = false
            }) // 重置拆包数据

            //console.log('this.formData.sinobecStocks',this.formData.sinobecStocks)
            var checkedStockIdList = []
            this.formData.sinobecStocks.forEach((binItem) => {
            if (binItem._checked) {
                checkedStockIdList.push(binItem.stockId)
              }
            })
            //console.log('checkedStockIdList',checkedStockIdList)
            this.formData.sinobecStocks = sinobecStocks
            //用从后台取出来得拆包后得列表更新this.formData.sinobecStocks，但是需要用上一步保留得选中得sotck id 来更新这个新得 this.formData.sinobecStocks。
            //设置选中状态，更新父页面列表是否也应该用 更新选中状态的列表更新呢？
            var backToListSum = 0
            for (var i=0; i<this.formData.sinobecStocks.length; i++)
            { 
              for(var j=0; j<checkedStockIdList.length; j++){
                if(checkedStockIdList[j] === this.formData.sinobecStocks[i].stockId){
                  
                  this.formData.sinobecStocks[i]._checked = true
                  backToListSum = calculate.plus(backToListSum, this.formData.sinobecStocks[i].weightQty)
                  //console.log('this.formData.sinobecStocks[i]._checked',this.formData.sinobecStocks[i]._checked)
                }
              }
            }
            sumQty = backToListSum
            //console.log('this.formData.sinobecStocks',this.formData.sinobecStocks)
            //this.$refs.allocationTable.clearCheckboxRow()

            //this.$emit('on-unpack', sinobecStocks) // 拆包更新父页面列表
            this.$emit('on-unpack', this.formData.sinobecStocks) // 拆包更新父页面列表
          }else{
            this.$Notice.warning({ desc: this.$t('msg_notice_172') })
            return false
          }
        }else{
          /*****2021-10-20 注释掉 -- task 下架任务 不校验配货数量，可以小于要下架的数量下架  */
          // this.$Notice.warning({ desc: this.$t('msg_notice_172') })
          // return false
          /*****2021-10-20 注释掉 -- task 下架任务 不校验配货数量，可以小于要下架的数量下架  */
        }
      }
      // console.log('===============================')
      // console.log('binCodesList=',binCodesList)
      // console.log('sumQty',sumQty)
      // console.log('sinobecStocks', this.formData.sinobecStocks)
      this.$emit('on-ok', sumQty, binCodesList, this.formData.sinobecStocks)
      this.modalVal = false
    }
  }
}
</script>
