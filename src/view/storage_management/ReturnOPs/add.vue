<!--
 * @Description:添加弹框
-->
<template>
  <div>
    <Drawer
      :title="$t('sta_1')"
      v-model="modalVal"
      :closable="true"
      :mask-closable="!sureStatus"
      :before-close="handleBeforeClose"
      @on-visible-change="handleVisibleChange"
      width="1200"
    >
      <Row style="height: 50%">
        <Col span="24" class="margin-t-16" style="height: calc(100% - 0px);">
          <!--主体-->
          <vxe-table
           :edit-rules="ruleValidate"
            ref="createTable"
            v-if="modalVal"
            :data="list1"
            border="full"
            stripe
            show-overflow="title"
            resizable
            @checkbox-change="selectionChange"
            @checkbox-all="selectionChange"
            :checkbox-config="{ highlight: true }"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
          >
            >
            <vxe-colgroup title="Return In" align="center">
              <vxe-column
                field="In_SKU"
                title="SKU"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.In_SKU" type="text" :disabled="flag !== ''"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="In_UNIT"
                title="UNIT"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.In_UNIT" type="text" :disabled="justLook"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="In_batch"
                title="batch"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.In_batch" type="text" :disabled="justLook"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="In_Prod_date"
                title="Prod date"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <DatePicker
                    type="date"
                    v-model="row.date"
                    format="yyyy-MM-dd"
                    split-panels
                    placeholder="Select date"
                    @on-change="dataChange"
                    :open="true"
                    transfer
                  ></DatePicker>
                </template>
              </vxe-column>
              <vxe-column
                field="In_Exp_date"
                title="Exp date"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <DatePicker
                    type="date"
                    v-model="row.date"
                    format="yyyy-MM-dd"
                    :open="true"
                    split-panels
                    placeholder="Select date"
                    @on-change="dataChange1"
                    transfer
                  ></DatePicker>
                </template>
              </vxe-column>
              <vxe-column
                field="In_MfgID"
                title="MfgID"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.In_MfgID" type="text" :disabled="justLook"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="In_GRDATE_LOT"
                title="GRDATE_LOT"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input
                    v-model="row.In_GRDATE_LOT"
                    type="text" :disabled="justLook"
                  ></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="In_QTY"
                title="QTY"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.In_QTY" type="integer" min="1" :disabled="justLook"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="In_Note"
                title="Note"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.In_Note" type="text" :disabled="justLook"></vxe-input>
                </template>
              </vxe-column>
            </vxe-colgroup>
          </vxe-table>
        </Col>
      </Row>
      <Row style="height: 50%">
        <Col span="24" class="margin-t-16">
          <!--主体-->
          <vxe-table
           :edit-rules="ruleValidate"
            ref="createTable"
            v-if="modalVal"
            :data="list1"
            max-height="300"
            border="full"
            stripe
            show-overflow="title"
            resizable
            @checkbox-change="selectionChange"
            @checkbox-all="selectionChange"
            :checkbox-config="{ highlight: true }"
            :edit-config="{ trigger: 'click', mode: 'cell' }"
          >
            >
            <vxe-colgroup title="Return Out" align="center">
              <vxe-column
                field="Out_SKU"
                title="SKU"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.Out_SKU" type="text" :disabled="flag !== ''"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="Out_UNIT"
                title="UNIT"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.Out_UNIT" type="text" :disabled="justLook"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="Out_batch"
                title="batch"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.Out_batch" type="text" :disabled="justLook"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="Out_Prod_date"
                title="Prod date"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <DatePicker
                    type="date"
                    v-model="row.date"
                    format="yyyy-MM-dd"
                    split-panels
                    placeholder="Select date"
                    :open="true"
                    @on-change="dataChange2"
                    transfer
                  ></DatePicker>
                </template>
              </vxe-column>
              <vxe-column
                field="Out_Exp_date"
                title="Exp date"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <DatePicker
                    type="date"
                    v-model="row.date"
                    format="yyyy-MM-dd"
                    split-panels
                    placeholder="Select date"
                    :open="true"
                    @on-change="dataChange3"
                    transfer
                  ></DatePicker>
                </template>
              </vxe-column>
              <vxe-column
                field="Out_MfgID"
                title="MfgID"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.Out_MfgID" type="text" :disabled="justLook"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="Out_GRDATE_LOT"
                title="GRDATE_LOT"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input
                    v-model="row.Out_GRDATE_LOT"
                    type="text" :disabled="justLook"
                  ></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="Out_QTY"
                title="QTY"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.Out_QTY" type="integer" min="1" :disabled="justLook"></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="Out_Note"
                title="Note"
                :edit-render="{
                  autofocus: '.vxe-input--inner',
                  placeholder: 'Please click enter'
                }"
                min-width="100"
              >
                <template #edit="{ row }">
                  <vxe-input v-model="row.Out_Note" type="text" :disabled="justLook"></vxe-input>
                </template>
              </vxe-column>
            </vxe-colgroup>
          </vxe-table>
        </Col>
      </Row>
      <!--底部-->
      <div class="demo-drawer-footer">
        <Button
          type="primary"
          class="ivu-btn-button-create margin-right-24"
          v-show="sureStatus"
          @click="okHandle"
          >{{ $t("btn_confirm") }}
        </Button>
        <Button
          type="primary"
          class="ivu-btn-button-create-ghost"
          @click="returnHandle"
          >{{ $t("btn_return") }}</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>

export default {
  name: "create",
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
     flag: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default () {
        return {}
      },
    }
  },
    computed: {
    modalVal: {
      get: function() {
        return this.drawer;
      },
      set: function(val) {
        this.$emit("update:drawer", val);
      }
    },
    sureStatus () {
      return this.flag !== 'L' // 非查看状态显示确定按钮
    },
    deleteStatus () {
      return this.flag === 'E' // 编辑状态显示删除按钮
    },
    justLook () {
      return this.flag === 'L' // 查看状态不可编辑
    },
    title () {
      return this.flag === 'L' ? this.$t('lnk_check') : this.flag === 'E' ? this.$t('btn_edit') : this.$t('sta_1')
    }
  },
  data() {
    return {
      list1: [
        {
          In_SKU: "",
          In_UNIT: "",
          In_batch: "",
          In_Prod_date: "",
          In_Exp_date: "",
          In_MfgID: "",
          In_GRDATE_LOT: "",
          In_QTY: "",
          In_Note:"",
          Out_SKU: "",
          Out_UNIT: "",
          Out_batch: "",
          Out_Prod_date: "",
          Out_Exp_date: "",
          Out_MfgID: "",
          Out_GRDATE_LOT: "",
          Out_QTY: "",
          Out_Note:""
        }
      ],
     ruleValidate: {
        // In_SKU: [{ required: true, message: this.$t('msg_notice_98') },{ trigger: 'blur', pattern: /^[0-9a-zA-Z]+$/, message: this.$t('msg_notice_111') }],
        // In_UNIT: [{ required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }],
        // In_batch: [{ required: true, type: 'number', message: this.$t('msg_notice_880'), trigger: 'blur' } ],
        // In_MfgID: [{ required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }],   
        // In_GRDATE_LOT: [{ required: true, type: 'number', message: this.$t('msg_notice_98'), trigger: 'blur' }],   
        In_Exp_date: [{ required: true, message: this.$t('msg_notice_98') }],
        In_Prod_date: [{ required: true, message: this.$t('msg_notice_98') }],
         In_QTY: [{ required: true, message: this.$t('msg_notice_358') }, { trigger: 'blur', pattern: /^[1-9]\d*$/, message: this.$t('msg_notice_136') }],
        // In_Note: [{ required: true, message: this.$t('msg_notice_98') },{ trigger: 'blur', pattern: /^[0-9a-zA-Z]+$/, message: this.$t('msg_notice_111') }],
        // Out_SKU: [{ required: true, message: this.$t('msg_notice_98') },{ trigger: 'blur', pattern: /^[0-9a-zA-Z]+$/, message: this.$t('msg_notice_111') }],
        // Out_UNIT: [{ required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }],
        // Out_batch: [{ required: true, type: 'number', message: this.$t('msg_notice_880'), trigger: 'blur' } ],
        // Out_MfgID: [{ required: true, message: this.$t('msg_notice_98'), trigger: 'blur' }],   
        // Out_GRDATE_LOT: [{ required: true, type: 'number', message: this.$t('msg_notice_98'), trigger: 'blur' }],   
         Out_Exp_date: [{ required: true, message: this.$t('msg_notice_98') }],
         Out_Prod_date: [{ required: true, message: this.$t('msg_notice_98') }],
         Out_QTY: [{ required: true, message: this.$t('msg_notice_358') }, { trigger: 'blur', pattern: /^[1-9]\d*$/, message: this.$t('msg_notice_136') }],
        // Out_Note: [{ required: true, message: this.$t('msg_notice_98') }],
       
      },
      selection :[]
    };
  },
 
  methods: {
    setUuid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
      );
    },
    dataChange(data) {
      this.$nextTick(() => {
        this.list1[0].In_Prod_date = data;
      });
    },
    dataChange1(data) {
      this.$nextTick(() => {
        this.list1[0].In_Exp_date = data;
      });
    },
    dataChange2(data) {
      this.$nextTick(() => {
        this.list1[0].Out_Prod_date = data;
      });
    },
    dataChange3(data) {
      this.$nextTick(() => {
        this.list1[0].Out_Exp_date = data;
      });
    },
    
    // 批量选中改变
    selectionChange({ selection }) {
      this.selection = selection;
    },
    // 显示状态发生变化时触发
    handleVisibleChange(visible) {
      if (visible) {
        //  show Handler
      } else {
        //  hide Handler
        this.returnHandle();
      }
    },
    // 返回 Promise 可以阻止关闭
    handleBeforeClose() {
      return new Promise(resolve => {
        this.$confirm({
          content: this.$t("msg_notice_888"),
          onOk: () => {
            resolve();
          }
        });
      });
    },
    // 返回回调
    returnHandle() {
      this.modalVal = false;
      this.list = [];
      this.selection = [];
    },
    // 确定回调
    okHandle() {
      const ob = this.list1[0];
      let str = "";
      const arr = Object.keys(ob);
      for (const item of arr) {
        if (!ob[item]) {
          str = item;
          break;
        }
      }
      // if (str) {
      //   this.$Notice.warning({ desc: "Please complete it." });
      //   return;
      // }
       ob.uuid = this.setUuid();
      this.$emit("on-ok", ob);
    }
  }
 }
</script>
