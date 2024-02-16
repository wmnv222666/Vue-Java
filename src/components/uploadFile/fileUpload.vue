<template>
<div class="x-file-upload">
  <el-upload
    drag
    :headers="headers"
    :action="action"
    :multiple="multiple"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :disabled="disabled"
    :limit="limit"
    list-type="picture"
    :file-list.sync="fileList"
    :before-upload="beforeUploadHandle"
  >
    <div style="padding: 20px 0;background-color: #faf9f9">
      <Icon type="md-cloud-upload" size="100" style="color: #dedeed"></Icon>
      <p style="font-size: 18px">{{$t('link_click_upload')}}</p>
    </div>
  </el-upload>
</div>
</template>

<script>

  import {getProUri} from '@/libs/assist'
  import {getToken} from '@/libs/utils'
  import ElUpload from './upload'


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
      onSuccess: { type: Function, default: function () { } },
      onError: { type: Function, default: function () { } },
    },
    data() {
      return {
        headers: {
          'Authorization': getToken()
        },
        action: getProUri(this, 'file/upload'),
      }
    },
    methods: {
      beforeUploadHandle (file) {
        return true;
      },
      handleSuccess(response, file, fileList) {
        this.$emit('update:fileList', fileList)
        var uploadList = this.uploadListFormat(fileList)
        this.onSuccess(uploadList, file);
      },
      handleRemove(file, fileList) {
        this.$emit('update:fileList', fileList)
        var uploadList = this.uploadListFormat(fileList)
        this.onError(uploadList, file)
      },
      uploadListFormat(fileList) {
        var uploadListTemp = []

        fileList.forEach(function (item) {
          var fileItem = { fileCode: '', fileExt: '', createUserId: '', userName: '' }
          if (item.response) {
            fileItem = {
              fileCode: item.response.data.fileCode || '',
              fileExt: item.response.data.fileExt || '',
              createUserId: item.response.data.createUserId || '',
              userName: item.response.data.userName || '',
            }
          } else {
            fileItem = {
              fileCode: item.fileCode || '',
              fileExt: item.fileExt || '',
              createUserId: item.createUserId || '',
              userName: item.userName || '',
            }
          }
          uploadListTemp.push(fileItem)
        })

        return uploadListTemp
      }
    }
  }
</script>
