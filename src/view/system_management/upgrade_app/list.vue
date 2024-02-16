<template>
  <div>
    <div class="modal-body no-padding">
      <Row>
        <div class="i-box clearfix">
          <Col span="24" class="margin-b-16">
            <ButtonGroup>
              <!-- 上传 -->
              <Button @click="upload" icon="md-cloud-upload">{{ $t('btn_upload_c') }}</Button>
            </ButtonGroup>
          </Col>

          <Col span="24">
            <vxe-table :data="list" stripe show-overflow resizable>
              <vxe-table-column min-width="145" sortable field="versionName" :title="$t('col_version')">
                <template v-slot="{ row }">
                  <a :href="downloadFile(row)" class="pointer" @click="downloadFile(row)">{{ row.versionName }}</a>
                </template>
              </vxe-table-column>
              <vxe-table-column min-width="145" sortable field="publicDate" :title="$t('col_public_date')"></vxe-table-column>
<!--              <vxe-table-column min-width="145" field="id" :title="$t('col_opt')">-->
<!--                <template v-slot="{ row }">-->
<!--                  <Button type="text" @click="deleteFile(row)">{{ $t('btn_delete') }}</Button>-->
<!--                </template>-->
<!--              </vxe-table-column>-->
            </vxe-table>

            <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange"> </x-vxe-pager>
          </Col>
        </div>
      </Row>
    </div>
    <!--  -->
    <upload-file :drawer.sync="editForm" @on-ok="uploadHandle" />
  </div>
</template>

<script>
import { API } from '@A/system/Terminal'
import uploadFile from './modal/upLoad.vue'
import { getProUri } from '@/libs/assist'

export default {
  components: { uploadFile },
  data () {
    return {
      list: [],
      head: {
        condition: '',
        paging: true, // 是否分页
        totalCount: -1, // 总页数
        pageIndex: 1, // 当前页数
        pageSize: 100, // 每页显示行数
        sortColumn: '', // 排序字段
        sortAscend: true // 升序true，降序false
      },
      editForm: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取数据
    async getData () {
      var sendData = {
        pageIndex: this.head.pageIndex,
        pageSize: this.head.pageSize,
        paging: this.head.paging,
        totalCount: this.head.totalCount,
        sortColumn: this.head.sortColumn,
        sortAscend: this.head.sortAscend,
        condition: this.head.condition
      }

      var [err, res] = await this.$to(API.AGetList(sendData)); if (err) { return false }
      var data = res.data
      this.$set(this.head, 'totalCount', data.totalCount)
      this.list = data.upgradeFileList
    },
    // 分页回调
    handlePageChange ({ currentPage, pageSize }) {
      this.head.pageIndex = currentPage
      this.head.pageSize = pageSize
      this.getData()
    },
    // 排序回调
    sortChange ({ column, property, order }) {
      // 用 DESC 表示按倒序排序(即：从大到小排序)
      // 用 ASC 表示按正序排序(即：从小到大排序)
      this.head.sortColumn = property
      this.head.sortAscend = order === 'asc'
      this.getData()
    },
    upload () {
      this.editForm = true
    },
    // 附件下载
    downloadFile (row) {
      return getProUri(this, `app_upgrade/download/${row.id}`)
    },
    // 附件删除
    deleteFile (row) {
      var _this = this,
        eCommand = () => {

          API.ADel(row.id)
            .then((res) => {
              _this.getData()
            })
        }
      // 弹窗
      _this.$confirm({
        content: _this.$t('msg_notice_74'),
        onOk: eCommand
      })
    },
    // 上传成功回调
    uploadHandle () {
      this.getData()
    },
    clearData () {
      this.head.condition = ''
      this.head.sortColumn = ''
      this.head.sortAscend = true
    }
  }
}
</script>
