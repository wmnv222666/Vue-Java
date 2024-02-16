<template>
<div>
  <el-upload
    drag
    class="x-upload-el"
    ref="xxupload"
    v-if="isSuccess"
    :action="action"
    list-type="picture"
    :limit="4"
    :disabled='isEdit'
    :headers="headers"
    :file-list="defaultList"
    :on-remove="handleRemove"
    :on-exceed="handleBeforeUpload"
    :on-preview="handleDownload"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :auto-upload="true">
      <div style="padding: 20px 0;background-color: #faf9f9" v-if="!isEdit">
        <Icon type="md-cloud-upload" size="100" style="color: #dedeed"></Icon>
        <p style="font-size: 18px">{{$t('link_click_upload')}}</p>
        <p style="color: #c4c4c3">{{$t('tab_drag')}}</p>
        <p style="color: #d3d3d3">{{$t('tab_sizeInfo')}}</p>
      </div>
  </el-upload>
</div>
</template>

<script>

import { getProUri } from '@/libs/assist'
import { getToken } from '@/libs/utils'
import { fileIcon } from './fileIcon'
import { mapGetters } from 'vuex'
import ElUpload from './upload'

export default {
  name: 'orderUpload',
  props: {
    isSuccess: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ElUpload
  },
  computed: {
    ...mapGetters({
      loginUserId: 'UserId'
    }),
    isSuccessShow: {
      get: function () {
        return this.isSuccess
      },
      set: function (val) {
        this.$emit('update:isSuccess', val)
      }
    }
  },
  data () {
    return {
      defaultList: [],
      headers: {
        'Authorization': getToken()
      },
      action: getProUri(this, 'file/upload'),
      uploadList: []
    }
  },
  watch: {
    '$store.getters.GET_FILE_LIST_DEFAULT' (val, oldVal){
      val.forEach((file) => {
        if (this.$config.imgFormat.indexOf(file.fileExt) > -1) {
          file.url = getProUri(this, `file/download/${file.fileCode}`) || ''
        } else {
          file.url = ''
        }
      })
      this.defaultList = val
    }
  },
  methods: {
    getFileIcon (ext) {
      return fileIcon(ext)
    },
    // 是否可以删除
    enabledDelete (item) {
      // 当前上传人可以删除 （创建和草稿状态）
      return !this.isEdit && (item.createUserId === this.loginUserId)
    },
    // 上传附件删除
    handleRemove (file, fileList) {
      this.defaultList = fileList
      this.$emit('changeFile', this.defaultList)
    },
    // 附件上传成功回调
    handleSuccess (res, file, fileList) {
      if (res.returnCode === 1) {
        file.name = res.data.fileCode
        file.fileName = res.data.fileName
        file.fileCode = res.data.fileCode
        file.createUserId = res.data.createUserId
        file.createUserName = res.data.userName
        file.createTime = res.data.createTime
        file.fileExt = res.data.fileExt
        // 上传成功添加一条
        this.defaultList.push(file)

        this.$emit('changeFile', this.defaultList)
      }
    },
    // 附件上传前判断
    handleBeforeUpload () {
      this.$Notice.warning({ desc: '附件最多可上传四个' })
    },
    // 文件下载
    handleDownload (file) {
      window.open(getProUri(this, `file/download/${file.fileCode}`))
    },
    // 附件上传文件格式判断
    // 附件上传文件尺寸判断
    // 上传前校验
    beforeUpload (file) {

    }
  }
}
</script>

<style>
  .x-upload-el .el-upload.el-upload--picture{
    display: block;
  }
</style>
