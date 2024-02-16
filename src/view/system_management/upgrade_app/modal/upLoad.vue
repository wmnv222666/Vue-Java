<template>
  <div>
    <Drawer
      :title="$t('btn_upload_c')"
      v-model="modalVal"
      :closable="false"
      :mask-closable="false"
      :before-close="handleBeforeClose"
      @on-visible-change="handleVisibleChange"
      width="600"
    >
      <file-upload :limit="1" :multiple="false" :fileList.sync="fileList" @on-change="handleFileChange" :onBeforeUpload="brforeUpload"></file-upload>

      <div class="demo-drawer-footer">
        <Button v-show="fileList.length" type="primary" class="ivu-btn-button-create margin-right-24" @click="okHandle">{{ $t('btn_confirm') }}</Button>
        <Button type="primary" class="ivu-btn-button-create-ghost" @click="returnHandle">{{ $t('btn_return') }}</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
import { API } from '@A/system/Terminal'
import fileUpload from './fileUpload.vue'

export default {
  name: "uploadFile",
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  components: {
    fileUpload
  },
  data () {
    return {
      fileList: [], // 文件上传列表
      formData: {
        id: '',
        fileExt: '',
        fileName: '',
        fileSize: ''
      },
      loading: false
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
  methods: {
    // 显示状态发生变化时触发
    handleVisibleChange (visible) {
      if (visible) {
        //  show Handler
      } else {
        //  hide Handler
      }
    },
    // 上传前回调
    brforeUpload (file) {
      // 文件扩展名的正则表达式
      var patternFileExtension = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      // 获得文件扩展名
      var fileExtension = (file.name).match(patternFileExtension);
      var isAPK = ['apk', 'APK'].indexOf(fileExtension[1]) > -1

      var fileName = file.name.slice(0, -4)
      // var name = "SmartStoragePad_1.0.0.80_80_20190605_jenkins_release"
      var isLegalName = fileName.slice(0, 15) == 'SmartStoragePDA' && fileName.slice(-15) == 'jenkins_release' && (fileName.split('_')).length - 1 == 5
      if (!isLegalName) {
        this.$Notice.warning({
          desc: this.$t('msg_notice_312')
        })
        return false
      }

      return isLegalName && isAPK
    },
    // 文件上传回调
    handleFileChange (fileList) {
      fileList && (this.formData = fileList[0])
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
    },
    // 确定回调
    okHandle () {
      if (!this.fileList.length) {
        return false
      }
      this.saveUploadFile()
    },
    async saveUploadFile () {
      var [err, res] = await this.$to(API.ASave(this.formData)); if (err) { return false }
      var data = res.data
      this.$emit('on-ok')
      this.modalVal = false
      this.fileList = []
    }
  }
}
</script>
