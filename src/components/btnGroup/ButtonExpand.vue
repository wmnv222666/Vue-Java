<template>
  <div style="float: left">
    <!-- 返回，一直显示 -->
<!--    <Button type="primary" class="ivu-btn-button-create-ghost buttonReturn" @click="returnPage">{{$t('btn_return')}}</Button>-->

    <span>
      <Button type="primary" v-if="btnGroup.buttonSubmit" class="ivu-btn-button-create" @click="btnHandle('buttonSubmit')">{{$t('btn_submit')}}</Button>
      <Button type="primary" v-if="btnGroup.buttonSave" class="ivu-btn-button-create-ghost buttonSave" @click="btnHandle('buttonSave')">{{$t('btn_save')}}</Button>
      <Button type="primary" v-if="btnGroup.buttonDebtOffset" class="ivu-btn-button-create" @click="btnHandle('buttonDebtOffset')">{{$t('btn_debtoffset')}}</Button>
      <Button type="primary" v-if="btnGroup.buttonPost" class="ivu-btn-button-create buttonPost" @click="btnHandle('buttonPost')">{{$t('btn_post')}}</Button>
      <Button type="primary" v-if="btnGroup.buttonDelete" class="ivu-btn-button-create-ghost buttonDelete" @click="btnHandle('buttonDelete')">{{$t('btn_delete')}}</Button>
      <Button type="primary" v-if="btnGroup.buttonWriteOff" class="btn-order buttonWriteOff" @click="btnHandle('buttonWriteOff')"><xIcon type="iconwrite_off"></xIcon>{{$t('btn_writeoff')}}</Button>
      <Button type="primary" v-if="btnGroup.buttonPrint" class="btn-order buttonPrint" @click="btnHandle('buttonPrint')"><xIcon type="iconprint"></xIcon>{{$t('btn_print')}}</Button>
      <Button type="primary" v-if="btnGroup.buttonPrintOrder" class="btn-order buttonPrintOrder" @click="btnHandle('buttonPrintOrder')"><xIcon type="iconprint"></xIcon>{{$t('btn_printorder')}}</Button>
      <Button type="primary" v-if="btnGroup.buttonTaskComplete" class="ivu-btn-button-create buttonTaskComplete" @click="btnHandle('buttonTaskComplete')">{{$t('btn_task_complete')}}</Button>

      <Button type="primary" v-if="btnGroup.buttonExport" class="ivu-btn-button-create-ghost buttonExport" @click="btnHandle('buttonExport')">{{$t('btn_export')}}</Button>
      <!-- 全部重盘 -->
      <Button type="primary" v-if="btnGroup.buttonReInventory" class="ivu-btn-button-create-large" @click="btnHandle('buttonReInventory')">{{$t('btn_allHeavyplates')}}</Button>
      <!-- 开始盘点 -->
      <Button type="primary" v-if="btnGroup.buttonStartInventory" class="ivu-btn-button-create-large" @click="btnHandle('buttonStartInventory')">{{$t('btn_startcounting')}}</Button>
      <!-- 查看差异 -->
      <Button type="primary" v-if="btnGroup.buttonDifferenceTable" class="ivu-btn-button-create-ghost-large" @click="btnHandle('buttonDifferenceTable')">{{$t('btn_checkthedifference')}}</Button>
      <!-- 仓位差异处理 -->
      <Button type="primary" v-if="btnGroup.buttonBinDifference" class="ivu-btn-button-create-ghost-large" @click="btnHandle('buttonBinDifference')">{{$t('btn_bindiffprocessing')}}</Button>
      <!-- 批次差异处理 -->
      <Button type="primary" v-if="btnGroup.buttonBatchDifference" class="ivu-btn-button-create-ghost-large" @click="btnHandle('buttonBatchDifference')">{{$t('btn_batchdiffprocessing')}}</Button>
      <!-- 选择仓位 -->
      <Button type="primary" v-if="btnGroup.buttonSelectBin" class="ivu-btn-button-create-large" @click="btnHandle('buttonSelectBin')">{{$t('btn_selectbin')}}</Button>
      <!-- 关闭 -->
      <Button type="primary" v-if="btnGroup.buttonClose" class="ivu-btn-button-create buttonClose" @click="btnHandle('buttonClose')">关闭</Button>

      <Button type="primary" v-if="btnGroup.buttonInventory" class="ivu-btn-button-create-large buttonInventory" @click="btnHandle('buttonInventory')">{{$t('btn_inviscompleted')}}</Button>
    </span>

    <span>
      <!-- 经办-确定 -->
      <Button type="primary" v-if="btnGroup.buttonReceipt" class="ivu-btn-button-create" @click="btnHandle('buttonReceipt')">{{$t('btn_confirm')}}</Button>
      <!-- 审批-通过 -->
      <Button type="primary" v-if="btnGroup.buttonApprove" class="ivu-btn-button-create" @click="btnHandle('buttonPass')">{{$t('btn_pass')}}</Button>
      <!-- 审批-驳回 -->
      <Button type="primary" v-if="btnGroup.buttonApprove" class="ivu-btn-button-create-ghost" @click="btnHandle('buttonUnPass')">{{$t('btn_unpass')}}</Button>
    </span>

  </div>
</template>

<script>
  export default {
    name: 'ButtonExpand',
    props: {
      isShow: {
        type: Boolean,
        default: true
      },
      btnGroup: {
        buttonSave: false,
        buttonSubmit: false,
        buttonPost: false,
        buttonDelete: false,
        buttonWriteOff: false,
        buttonPrint: false,
        buttonDebtOffset: false,
        buttonPrintOrder: false,
        buttonReInventory: false,
        buttonDifferenceTable: false,
        buttonBinDifference: false,
        buttonBatchDifference: false,
        buttonSelectBin: false,
        buttonClose: false,
        buttonInventory: false, // 盘点完毕
        buttonTaskComplete: false, // 作业完成
        buttonStartInventory: false, // 开始盘点
        buttonExport: false // 导出excel
      }
    },
    methods: {
      btnHandle (type) {
        this.$emit('on-ok', type)
      },
      returnPage () {
        this.$router.go(-1)
      }
    }
  }
</script>
