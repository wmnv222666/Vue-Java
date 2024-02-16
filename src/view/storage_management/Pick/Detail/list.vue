<!--
 * @Company: Inossem
 * @Author: Jiang Xiao
 * @Email: xiao.jiang@inossem.com
 * @Date: 2020-03-19 10:40:01
 * @LastEditors: JiangXiao
 * @LastEditTime: 2020-06-11 13:02:01
 * @Description: description
 -->
<template>
  <div class="modal-body no-padding">
    <div class="i-box clearfix">
      <x-search-header @on-search="search">
        <!-- <template slot="head">
          <ButtonGroup>

          </ButtonGroup>
        </template> -->
        <template slot="body">
          <search-in flex :title="$t('DNumber')">
            <Input type="text" v-model="formData.receiptCode" :maxlength="20" />
          </search-in>
          <!-- <search-in flex :title="$t('col_date')">
            <DatePicker type="daterange" split-panels @on-change="dateChangeHandle"></DatePicker>
          </search-in> -->
          <!-- <search-in flex title="Receipt Status">
            <Select v-model="formData.receiptStatusList" multiple>
              <Option :value="90">Completed</Option>
              <Option :value="110">Canceled</Option> -->
<!--            </Select>-->
<!--          </search-in>-->
          <Button icon="ios-search" @click="search">{{ $t('btn_find') }}</Button>
        </template>
      </x-search-header>
      <Col span="24" class="margin-t-16">
      <vxe-table ref="sTable" :sync-resize="tabVisible" :data="completeList" max-height="600" stripe show-overflow resizable row-id="xid" highlight-cell :checkbox-config="{ reserve: true, highlight: true }" :tree-config="{ children: 'children' }" @checkbox-change="selectionChangeS" @checkbox-all="selectionChangeS">
        <vxe-table-column min-width="250" field="id" :title="$t('DNumber')" tree-node>
          <template v-slot="{ row }">
            <span v-if="row.parent">
              <span class="margin-r-10">{{row.id}}</span>
<!--               <a href="#" class="margin-r-10" @click="showModal(row.id)">{{row.id}}</a>-->
              <Button v-if="row.receiptStatus == 110" @click="deleteOrderHandle(row)" size="small">{{ $t('btn_delete') }}</Button>
               <Button v-if="row.receiptStatus == 90" @click="cancelOrderHandle(row)" size="small">{{ $t('btn_reverse') }}</Button>
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column min-width="80" field="receiptType" title="Document Type"></vxe-table-column>
        <!-- <vxe-table-column min-width="200" field="receiptCode" :title="$t('DNumber')"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="200" field="shippingRef" :title="$t('ShippingRef')"></vxe-table-column> -->
        <vxe-table-column min-width="80" field="matCode" title="Item"></vxe-table-column>
        <vxe-table-column min-width="80" field="matName" :title="$t('ItemDesc')"></vxe-table-column>
        <!-- <vxe-table-column min-width="200" field="lotNumb" :title="$t('Lotnumb')"></vxe-table-column> -->
        <vxe-table-column min-width="60" field="ext3" title="MfgID"></vxe-table-column>
        <vxe-table-column min-width="60" field="lotNumb" :title="$t('Batch')"></vxe-table-column>
        <vxe-table-column min-width="60" field="ext7" :title="$t('prddate')"></vxe-table-column>
        <vxe-table-column min-width="60" field="ext8" :title="$t('expdate')"></vxe-table-column>
        <vxe-table-column min-width="60" field="ext9" :title="$t('GRDate_lot')"></vxe-table-column>
        <vxe-table-column min-width="60" field="loc" :title="$t('Loc')">
          <template v-slot="{ row }">
            <span>{{row.sourceTypeCode}} / {{row.sourceBinCode}}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column min-width="60" field="weightQty" :title="$t('QtyO')"></vxe-table-column>
        <vxe-table-column min-width="60" field="weightQty" title="Picked Qty"></vxe-table-column>
        <vxe-table-column min-width="60" field="weightUnitCode" :title="$t('UofM')"></vxe-table-column>
        <vxe-table-column min-width="60" field="ext11" :title="$t('pallet_qty')"></vxe-table-column>
        <!-- <vxe-table-column min-width="160" field="receiptStatusName" title="Receipt Status"></vxe-table-column> -->
        <!-- <vxe-table-column min-width="180" field="heatCode" :title="$t('Heat')"></vxe-table-column>
        <vxe-table-column min-width="160" field="skidCode" :title="$t('Skid')"></vxe-table-column> -->
      </vxe-table>

      <x-vxe-pager :current-page="head.pageIndex" :page-size="head.pageSize" :total="head.totalCount" @page-change="handlePageChange">
      </x-vxe-pager>

      </Col>
    </div>

    <Modal v-model="modalSignatureImg">
        <h3 slot="header" style="color:#f60;text-align:center">
          Upload image--<span style="padding-left:5px; color:orange;">Document Number : {{documentNo}}</span>
        </h3>
        <div style="text-align:center">
          <img :src="imgPath" width="400" height="300">
        </div>

        <div slot="footer">
          <Upload
              :action="action"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              accept="image/png, image/jpeg, image/jpg"
              :headers="headers"
          >
              <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </div>
    </Modal>

  </div>
</template>

<script>
import { API } from '@A/warehouse/Pick'
import { CAPI } from '@A/common'
import { getProUri } from "@/libs/assist"
import { getToken } from '@/libs/utils'

export default {
  data () {
    return {
      tabVisible: 'p3',
      cropList: [], // 公司下拉
      todoList: [],
      savedList: [],
      completeList: [],
      selectionTodo: [],
      selectionSaved: [],
      row: {}, // 选中行数据
      isAllocation: false, // 配货弹窗
      curr: 0,
      formData: {
        receiptType: '',
        corpCode: "",
        soCode: "",
        receiptCode: "",
        startTime: "",
        endTime: "",
        receiptStatusList: [90, 110],
        create: false,
        paging: true
      },
      groupBtn: {
        buttonSave: false,
        buttonSubmit: false,
        buttonDelete: true
      },
      // 分页\排序
      head: {
        paging: false,
        totalCount: -1,
        pageIndex: 1,
        pageSize: 100,
        sortColumn: '',
        sortAscend: true
      },
      modalSignatureImg: false,
      documentNo: '',
      action: '',
      headers: {
        'Authorization': getToken()
      },
      imgPath: 'static/logo.png',
    }
  },
  created () {
    // this.getCropList()
  },
  methods: {
    // 获取列表
    async getData () {
      var sendData = Object.assign(this.head, this.formData, { totalCount: -1 })
      var [err, res] = await this.$to(API.AGetListKZ(sendData)); if (err) { return false }
      var taskList = res.data.taskList || [];
      this.head.totalCount = res.data.totalCount
      this.completeList = this.dataSort(taskList);
      console.log(this.completeList);
      this.completeList.map(function (val) {
        val.children.map(function(val){
          if(val.receiptType === 201){
            val.receiptType = 'Sales Order'
          }else if(val.receiptType === 203){
            val.receiptType = 'Adjustment Out'
          }else if(val.receiptType === 204){
            val.receiptType = 'Vendor Return'
          }else{
            return
          }
          })
      })

      console.log(res)
    },
    dataSort (data) {
      let data1 = {}
      let value1 = []
      for (let i = 0; i < data.length; i++) {
        let ai = data[i]
        ai.id = ai.receiptCode
        if (!data1[ai.id]) {
          value1.push({
            id: ai.id,
            receiptStatus: ai.receiptStatus,
            poCode: ai.receiptCode,
            parent: true,
            children: [ai]
          })
          data1[ai.id] = ai
        } else {
          for (let j = 0; j < value1.length; j++) {
            let dj = value1[j]
            if (dj.id === ai.id) {
              dj.children.push(ai)
              break
            }
          }
        }
      }
      return value1
    },
    async cancelOrder (receiptCode) {
      var [err, res] = await this.$to(API.AReverseKZ(receiptCode));
      if (err) {
        return false;
      }
      this.successHandle(res);
    },
    async deleteOrder (receiptCode) {
      var [err, res] = await this.$to(API.ADeleteKZ(receiptCode));
      if (err) {
        return false;
      }
      this.successHandle(res);
    },
    // 成功回调
    successHandle (res) {
      this.$Notice.success({ desc: res.returnMsg })
      this.getData()
    },
    // 取消回调
    cancelOrderHandle (row) {
      this.$confirm({
        content: this.$t("msg_notice_558"),
        onOk: () => {
          this.cancelOrder(row.poCode);
        }
      });
    },
    // 删除回调
    deleteOrderHandle (row) {
      this.$confirm({
        content: this.$t("msg_notice_74"),
        onOk: () => {
          this.deleteOrder(row.poCode);
        }
      });
    },
    search () {
      this.getData()
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
    // 表格选中改变
    selectionChangeT ({ selection }) {
      this.selectionTodo = selection
    },
    selectionChangeS ({ selection }) {
      this.selectionSaved = selection
    },
    dateChangeHandle (date) {
      this.formData.startTime = date[0];
      this.formData.endTime = date[1];
    },

    showModal(docNo) {
      this.modalSignatureImg = true
      this.documentNo = docNo
      this.action = getProUri(this, 'images/upload/' + docNo)
      this.imgPath = '';
      this.getImageCode('org', docNo)
    },
    handleSuccess (res, file, fileList) {
      // console.log("handleSuccess-res : ", res)
      // console.log("handleSuccess-file : ", file)
      // console.log("handleSuccess-fileList : ", fileList)
      if (res.returnCode === 1) {
          // file.name = res.data.imgName
          // file.imgName = res.data.imgName
          // file.imgCode = res.data.imgCode
          // file.createUserId = res.data.createUserId
          // file.createUserName = res.data.userName
          // file.createTime = res.data.createTime
          // file.fileExt = res.data.imgExt
          this.imgPath = getProUri(this, `images/img/org/${res.data.imgCode}`)
          // 上传成功添加一条
          // this.defaultList.push(file)
          // this.$emit('uploadFinished')
          // this.$emit('changeFile', this.defaultList)
      }
    },

    handleFormatError (file) {
        this.$Notice.warning({
            title: 'The file format is incorrect',
            desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
    },
    handleMaxSize (file) {
        this.$Notice.warning({
            title: 'Exceeding file size limit',
            desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
    },
    async getImageCode(type, docNo){
      type='org'
      var [err, res] = await this.$to(API.AGetImgCode(type, docNo));

      if (err) {
        return false;
      }

      if (!res.data){
        this.imgPath = 'static/logo.png'
      }else{
        this.imgPath = getProUri(this, `images/img/org/${res.data}`)

      }

    }
  }
}

</script>
