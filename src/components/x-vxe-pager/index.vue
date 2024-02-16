<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-08 14:20:02
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-08 14:30:42
 * @Description: VXE 分页 - 和 VXE Table 共同使用
 -->
<template>
  <div>
    <vxe-pager
      v-if="total>0"
      :current-page="currentPage"
      :page-size="pageSize"
      :pageSizes="[10,15,20,50,100]"
      :total="total"
      :perfect="perfect"
      background
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    >
    </vxe-pager>
  </div>
</template>
<script>
export default {
  name: 'XVXEPager',
  props: {
    perfect: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  methods: {
    handlePageChange ({ currentPage, pageSize }) {
      this.$emit('page-change', { currentPage, pageSize })
    }
  }
}
</script>
