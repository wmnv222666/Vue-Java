<template>
  <Drawer
    width="800"
    :title="$t('btn_new')"
    :transfer="true"
    :closable="true"
    v-model="modalVal"
    :mask-closable="false"
    @on-close="cancel"
    @on-visible-change="visibleChange"
  >
    <div style="height:100%">
      <vxe-table
        :data="list"
        height="auto"
        stripe
        show-overflow="title"
        resizable
        row-id="whCode"
        @checkbox-change="selectionChange"
        :checkbox-config="{ checkRowKeys: checkRowKeys, highlight: true, checkMethod }"
        v-if="modalVal"
      >
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column type="seq" :title="$t('col_number')" width="150"></vxe-table-column>
        <vxe-table-column sortable field="whCode" :title="$t('lbl_wh_code')"></vxe-table-column>
        <vxe-table-column sortable field="whName" :title="$t('col_wh_describe')"></vxe-table-column>
        <vxe-table-column sortable field="isSelectName" :title="$t('lbl_is_configured')"></vxe-table-column>
      </vxe-table>
    </div>

    <div class="demo-drawer-footer">
      <Button type="primary" class="ivu-btn-button-create margin-right-24" @click="ok">{{ $t('btn_confirm') }}</Button>
      <Button type="primary" class="ivu-btn-button-create-ghost" @click="cancel">{{ $t('btn_return') }}</Button>
    </div>
  </Drawer>
</template>

<script>
import { API } from '@A/system/SKUMasterData'
export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    matCode: { // 父组件传过来的物料编码
      type: String,
      default: ''
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
      checkRowKeys: [], // 默认选中表格数据
      selection: [], // 选中数据
      list: []
    }
  },
  mounted () {
    this.formDataDefault = this.$c(this.formData)
  },
  methods: {
    // 抽屉显示隐藏改变调用
    visibleChange (isShow) {
      if (isShow) {
        this.getData()
      } else {
        this.clearData()
      }
    },
    // 获取数据
    async getData () {
      var _this = this
      var [err, res] = await this.$to(API.AGetMaterialWhList(this.matCode)); if (err) { return false }
      var data = res.data

      data.matWhVoList.forEach(function (item) {
        if (item.isSelect === 'true') {
          item.isSelectName = _this.$t('sel_yes')
          item._disabled = true // 并禁止取消选项
          _this.checkRowKeys.push(item.whCode) // 默认选中
        } else if (item.isSelect === 'false') {
          item._disabled = false
          item.isSelectName = _this.$t('sel_no')
        }
      })

      _this.list = data.matWhVoList
    },
    selectionChange ({ selection }) {
      this.selection = selection
    },
    clearData () {
      this.checkRowKeys = []
      this.list = []
    },
    // 用户可选择范围
    checkMethod ({ row }) {
      return row._disabled === false
    },
    cancel () {
      this.modalVal = false
    },
    ok () {

      var _this = this,

        eCommand = () => {

          API.ASaveMaterialWhList({
            matCode: _this.matCode,
            matWhCoList: _this.selection
          }).then(function (res) {
            _this.$Notice.success({
              desc: res.data.returnMsg,
              duration: 2,
              onClose: function () {
                _this.$emit('ok-drawer') // 刷新列表页
                _this.cancel()
              }
            })
          })
        }
      // 确认弹窗
      _this.$confirm({
        content: _this.$t('msg_notice_95'),
        onOk: eCommand
      })
    }
  }

}
</script>
