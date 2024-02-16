<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-15 21:26:10
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-04-13 10:08:46
 * @Description:
 -->
<template>
  <div>
    <Drawer :title="title" v-model="modalVal" :closable="true" :mask-closable="true" @on-visible-change="handleVisibleChange" width="1000">
      <Row class="h100">
        <Col span="24" class="h100">
        <vxe-table ref="allocationTable" :data="list" height="auto" stripe show-overflow="title" resizable v-if="modalVal">
          <vxe-table-column min-width="160" field="typeCode" :title="$t('ZoneCode')"></vxe-table-column>
          <vxe-table-column min-width="160" field="binCode" :title="$t('LocationCode')"></vxe-table-column>
          <vxe-table-column min-width="160" field="weightQty" :title="$t('QtyO')"></vxe-table-column>
          <vxe-table-column min-width="160" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
        </vxe-table>
        </Col>
      </Row>

      <div class="demo-drawer-footer">
        <Button type="primary" class="ivu-btn-button-create-ghost" @click="returnHandle">{{ $t('btn_return') }}</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>

export default {
  name: 'allocation',
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
    }
  },
  data () {
    return {
      title: 'T',
      list: [],
      formData: {}
    }
  },
  methods: {
    // 显示状态发生变化时触发
    handleVisibleChange (visible) {
      if (visible) {
        // 抬头数据
        this.formData = this.row;
        // 批次列表
        this.list = this.$c(this.row.sinobecStocks || []);
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
      this.modalVal = false
      this.list = []
    }
  }
}
</script>
