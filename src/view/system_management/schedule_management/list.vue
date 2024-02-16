<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-07 10:38:00
 * @LastEditors: xiao.jiang
 * @LastEditTime: 2020-03-14 11:44:53
 * @Description: 
 -->
<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24">
            <vxe-table stripe show-overflow resizable ref="xTable">
              <vxe-table-column type="seq" :title="$t('col_number')" width="150"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="jobId" :title="$t('col_schedule_jobId')"></vxe-table-column>
              <vxe-table-column min-width="200" sortable field="jobName" :title="$t('col_schedule_jobName')"></vxe-table-column>
              <vxe-table-column min-width="180" sortable field="jobStatus" :title="$t('col_schedule_jobStatus')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="method" :title="$t('col_schedule_method')"></vxe-table-column>
              <vxe-table-column min-width="180" sortable field="cron" :title="$t('col_schedule_cron')"></vxe-table-column>
              <vxe-table-column min-width="160" sortable field="opreation" :title="$t('col_opt')">
                <template v-slot="{ row }">
                  <i-switch size="small" :value="row.jobStatus" :true-value="1" :false-value="0" @on-change="value => switchHandle(value, row)" />
                </template>
              </vxe-table-column>
            </vxe-table>
          </Col>
        </div>
      </Row>
    </div>
  </div>
</template>

<script>
import { API } from '@A/system/Task'
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      var [err, res] = await this.$to(API.AGetScheduleList()); if (err) { return false }
      var data = res.data
      this.$refs.xTable.loadData(data.confCronsList)
      // this.list = data.confCronsList;
    },
    async switchHandle (value, row) {
      var err = null, res = null;
      if (row.jobStatus == 1) {
        [err, res] = await this.$to(API.AScheduleStop(row.jobName)); if (err) { return false }
      } else {
        [err, res] = await this.$to(API.AScheduleStart(row.jobName)); if (err) { return false }
      }
      this.getData()
    }
  }
}
</script>
