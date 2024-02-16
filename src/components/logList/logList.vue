<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-07 10:37:57
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-25 08:51:00
 * @Description: 
 -->
<template>
  <vxe-table :data="list" max-height="600" stripe show-overflow :sync-resize="syncResize">
    <vxe-table-column min-width="200" field="receiptOperationTypeName" :title="$t('col_opt')"></vxe-table-column>
    <vxe-table-column min-width="200" field="createUserName" :title="$t('lbl_personnel')">
      <template v-slot="{ row }">
        <span>{{ row.createUserCode }} - {{ row.createUserName }} - {{ row.deptName }}</span>
      </template>
    </vxe-table-column>
    <vxe-table-column min-width="160" field="modifyTime" :title="$t('col_time')"></vxe-table-column>
    <vxe-table-column min-width="200" field="logRemark" :title="$t('col_change_content')"></vxe-table-column>
  </vxe-table>
</template>

<script>
export default {
  name: 'logList',
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    syncResize: [String]
  },
  data () {
    return {

    }
  }
}
</script>
