<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-15 21:26:10
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-04-13 10:07:36
 * @Description:
 -->
<template>
  <div>
    <Drawer :title="title" v-model="modalVal" :closable="true" :mask-closable="true" :before-close="handleBeforeClose" @on-visible-change="handleVisibleChange" width="1000">
      <Row class="h100">
        <Col span="24" class="h100">
        <vxe-table ref="allocationTable" :data="list" height="auto" stripe show-overflow="title" resizable v-if="modalVal">
          <vxe-table-column min-width="160" field="sourceTypeCode" :title="$t('Zone')"></vxe-table-column>
          <vxe-table-column min-width="160" field="sourceBinCode" :title="$t('LocationCode')"></vxe-table-column>
          <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
          <vxe-table-column min-width="160" field="weightQty" :title="$t('QtyO')">
            <template v-slot="{ row }">
              <el-input-number :disabled="row.disableEdit" v-model="row.weightQty" :min="0" :max="row.xQty" @change="unpackChange(row.weightQty)"></el-input-number>
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
  </div>
</template>

<script>

// 四则运算
import calculate from '@/libs/precision'
export default {
  name: 'allocation',
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    binList: {
      type: Array,
      default () {
        return []
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
    }
  },
  data () {
    return {
      title: 'Unpack',
      list: [],
      formData: {}
    }
  },
  methods: {
    unpackChange (weightQty = 0) {
      this.list[1].weightQty = calculate.minus(this.list[1].xQty, weightQty)
    },
    // 显示状态发生变化时触发
    handleVisibleChange (visible) {
      if (visible) {
        // 仓位列表
        this.list = this.$c(this.binList)
        this.list[0].disableEdit = false
        this.list[0].xQty = this.list[0].weightQty
        this.list[1].disableEdit = true
        this.list[1].xQty = this.list[0].weightQty
        this.list[1].weightQty = 0

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
    },
    // 确定回调
    okHandle () {
      this.list[0].weightQty = this.list[0].weightQty || 0
      if (this.list[0].weightQty == 0) {
        this.$Notice.warning({ desc: 'The data entered must be numeric and cannot be zero (0).' })
        return false
      }
      this.$emit('on-ok', this.list[0].weightQty)
      this.modalVal = false
    }
  }
}
</script>
