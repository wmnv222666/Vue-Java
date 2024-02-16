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
          <!-- <vxe-table-column type="checkbox" width="60" :visible="!disableEdit"></vxe-table-column> -->
          <!-- <vxe-table-column min-width="160" field="typeCode" :title="$t('Zone')"></vxe-table-column> -->
          <!-- <vxe-table-column min-width="160" field="sourceTypeCode" :title="$t('Zone')"></vxe-table-column> -->
          <!-- <vxe-table-column min-width="160" field="binCode" :title="$t('LocationCode')"></vxe-table-column> -->
          <vxe-table-column min-width="80" field="ext3" title="MfgID"></vxe-table-column>
          <vxe-table-column min-width="80" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
          <vxe-table-column min-width="80" field="ext7" :title="$t('prddate')"></vxe-table-column>
          <vxe-table-column min-width="80" field="ext8" :title="$t('expdate')"></vxe-table-column>
          <vxe-table-column min-width="80" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
          <vxe-table-column min-width="80" field="sourceBinCode" :title="$t('LocationCode')"></vxe-table-column>
          <vxe-table-column min-width="80" field="weightQty" :title="$t('QtyO')"></vxe-table-column>
          <vxe-table-column min-width="80" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
          <vxe-table-column min-width="80" field="operation" :title="$t('col_opt')" :visible="!disableEdit">
            <template v-slot="scope">
              <Button type="text" @click="unPack(scope)" v-show="scope.row.weightQty>1">{{ $t('btn_unpack') }}</Button>
            </template>
          </vxe-table-column>
        </vxe-table>
        </Col>
      </Row>

      <div class="demo-drawer-footer">
        <Button v-if="!formData.disableEdit" type="primary" class="ivu-btn-button-create margin-right-24" @click="okHandle">{{ $t('btn_confirm') }}</Button>
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
      title: 'Allocation',
      list: [],
      selection: [],
      formData: {},
      binList: []
    }
  },
  methods: {
    // 显示状态发生变化时触发
    handleVisibleChange (visible) {
      if (visible) {
        // 抬头数据
        this.formData = this.$c(this.row);
        // 获取选中行数据
        //console.log(this.formData.sinobecStocks)
        //this.checkRowKeys = this.formData.sinobecStocks.filter((item) => { return item._checked }).map((item) => { return item.stockId })
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
      this.formData.sinobecStocks[this.curr]['unpack'] = true
      this.formData.sinobecStocks[this.curr]['unpackNum'] = unpackNum
      this.unpack()
    },
    // 拆包
    async unpack () {
      var [err, res] = await this.$to(API.AUnpack(this.formData)); if (err) { return false }

      var sinobecStocks = res.data.sinobecStocks || []
      //console.log('sinobecStocks=',sinobecStocks)
      sinobecStocks.forEach((item) => {
        item.unpack = false
        item.sourceTypeCode = item.sourcetypeCode
      }) // 重置拆包数据

      this.formData.sinobecStocks = sinobecStocks
      this.$refs.allocationTable.clearCheckboxRow()

      this.$emit('on-unpack', sinobecStocks) // 拆包更新父页面列表
    },
    selectionChange ({ selection }) {
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
    okHandle () {
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

      // if (sumQty != this.formData.weightQty) {
      //   this.$Notice.warning({ desc: this.$t('msg_notice_172') })
      //   return false
      // }

      // this.$emit('on-ok', sumQty, binCodesList, this.formData.sinobecStocks)
      this.modalVal = false
    }
  }
}
</script>
