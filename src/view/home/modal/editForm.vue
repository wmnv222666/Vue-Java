<template>
  <Drawer :title="$t('lbl_todo_list_msg')" :closable="true" v-model="modalVal" @on-close="cancel" :mask-closable="false" width="600px">
    <div class="x-search">
      <Row v-for="(item, index) in dataList" :key="index">
        <Col span="24" class="info-container">
          <div class="content">
            <div class="up">
              <div class="up-info">
                <div>
                  <p class="up-text-1" style="font-size: 15px;padding: 6px 0;">{{ item.pName }}</p>
                  <CheckboxGroup v-model="checkedData" @on-change="groupChange">
                    <Checkbox v-for="(mess, i) in item.childrens" :label="mess.resourcesCode" :key="i">{{ mess.resourcesName }}</Checkbox>
                  </CheckboxGroup>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div class="demo-drawer-footer">
        <Button type="default" style="margin-right: 8px" @click="cancel">{{ $t('btn_return') }}</Button>
        <Button type="primary" @click="ok">{{ $t('btn_confirm') }}</Button>
      </div>
    </div>
  </Drawer>
</template>

<script>
import { API } from '@A/home/home'

export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '800px'
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
      dataList: [],
      checkedData: []
    }
  },
  mounted () {
    this.getToDoList()
  },
  methods: {
    groupChange (data) {
      if (data.length > 8) {
        this.$Notice.warning({ desc: this.$t('msg_notice_3') })
        this.checkedData.pop()
      } else {
        this.checkedData = data
      }
    },
    ok () {
      if (this.checkedData.length > 8) {
        this.$Notice.warning({ desc: this.$t('msg_notice_3') })
        return false
      }
      if (this.checkedData.length === 0) {
        this.$Notice.warning({ desc: this.$t('msg_notice_357') })
        return false
      }
      this.$ajax(this, {
        url: 'auth/edit_todo_check',
        method: 'post',
        data: {
          'resourceCodes': this.checkedData,
          'resourcesType': 0
        }
      }).then(() => {
        this.cancel()
        this.$emit('queryCount')
      })
    },
    cancel () {
      this.modalVal = false
      this.checkedData = []
    },
    getToDoList () {
      this.checkedData = []
      var _this = this
      _this.loading = true

      API.AGetToDoList().then(function (res) {
        _this.loading = false
        _this.dataList = res.data.list
        _this.dataList.forEach((item) => {
          item.childrens.forEach((mess) => {
            if (mess.isChecked === '1') {
              _this.checkedData.push(mess.resourcesCode)
            }
          })
        })
      })
    }

  }
}
</script>
<style>
.x-search .ivu-checkbox-wrapper {
  min-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
