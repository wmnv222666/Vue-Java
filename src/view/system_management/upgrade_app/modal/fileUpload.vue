<template>
  <div class="x-file-upload">
    <el-upload
      ref="uploadFile"
      drag
      :headers="headers"
      :action="action"
      :multiple="multiple"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :disabled="disabled"
      :limit="limit"
      list-type="picture"
      :file-list.sync="fileList"
      :before-upload="beforeUploadHandle"
    >
      <div style="padding: 20px 0;background-color: #faf9f9">
        <Icon type="md-cloud-upload" size="100" style="color: #dedeed"></Icon>
        <p style="font-size: 18px">{{ $t('link_click_upload') }}</p>
      </div>
    </el-upload>
  </div>
</template>

<script>

import { getProUri } from '@/libs/assist'
import { getToken, localRead } from '@/libs/utils'
import ElUpload from '_c/uploadFile/upload'
import { Notice } from 'view-design'

export default {
  name: 'fileUpload',
  components: {
    ElUpload
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default: []
    },
    accept: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 0
    },
    onBeforeUpload: { type: Function, default: function () { return true; } },
    onBeforeRemove: { type: Function, default: function () { return true; } },
    onSuccess: { type: Function, default: function () { } },
    onError: { type: Function, default: function () { } }
  },
  data () {
    return {
      headers: {
        'filename': 'utf-8',
        'rs': 0,
        'requestType': 'web',
        'Authorization': getToken(),
        'lang_code': localRead('xlocal') || 'en-US'
      },
      action: getProUri(this, 'app_upgrade/upload'),
    }
  },
  methods: {
    beforeUploadHandle (file) {
      return this.onBeforeUpload(file);
    },
    handleSuccess (response, file, fileList) {
      if (response.returnCode != 1) {
        this.$refs.uploadFile.clearFiles()
        this.$Notice.error({ desc: response.returnMsg })
        return false;
      }
      this.$emit('update:fileList', fileList)
      var uploadList = this.uploadListFormat(fileList)
      this.onSuccess(uploadList, file);
      this.$emit('on-change', uploadList)
    },
    handleError (err, file, fileList) {
      this.onError(err, file, fileList)
    },
    handleRemove (file, fileList) {
      this.$emit('update:fileList', fileList)
      var uploadList = this.uploadListFormat(fileList)
      this.onBeforeRemove(uploadList, file);
      this.$emit('on-change', uploadList)
    },
    uploadListFormat (fileList) {
      var uploadListTemp = []

      fileList.forEach(function (item) {
        var fileItem = { fileCode: '', fileExt: '', createUserId: '', userName: '' }
        if (item.response) {
          fileItem = {
            fileCode: item.response.data.fileCode || '',
            fileName: item.response.data.fileName || '',
            fileSize: item.response.data.fileSize || 0,
            fileExt: item.response.data.fileExt || '',
            createUserId: item.response.data.createUserId || '',
            userName: item.response.data.userName || '',
            id: item.response.data.id || 0
          }
        } else {
          fileItem = {
            fileCode: item.fileCode || '',
            fileName: item.fileName || '',
            fileSize: item.fileSize || 0,
            fileExt: item.fileExt || '',
            createUserId: item.createUserId || '',
            userName: item.userName || '',
            id: item.id || 0
          }
        }
        uploadListTemp.push(fileItem)
      })

      return uploadListTemp
    }
  }
}
</script>
