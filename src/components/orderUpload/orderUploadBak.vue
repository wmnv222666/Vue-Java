<template>
<div>
  <div class="upload-list-c">
    <div class="el-upload-list el-upload-list--picture">
      <div tabindex="0" class="el-upload-list__item is-success" :key="i" v-for="(item, i) in uploadList">
        <template v-if="item.status === 'finished'">
          <img :src="getFileIcon(item.fileExt)" alt="" class="el-upload-list__item-thumbnail">
          <a :href="handleDownload(item.fileCode)" class="el-upload-list__item-name" @click.native="handleDownload(item)"> {{item.fileName}} </a>
          <label class="el-upload-list__item-status-label">
            <Icon type="md-checkmark" class="x-el-icon-check"/>
          </label>
          <Icon type="md-close" class="x-el-icon-close" v-if="enabledDelete(item)" @click.native="handleRemove(item)"></Icon>
          <div class="file-info">
            <span class="create-user">{{item.createUserName}}</span>
            <span>{{item.createTime}}</span>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" :stroke-width="5" class="el-progress"/>
        </template>
      </div>
    </div>
    <div class="add-icon" v-show="!uploadList.length">
      <Icon class="upload-list add-icon" v-if="!isEdit" type="md-add"/>
      <div v-else style="height: 80px; width: 80px"></div>
    </div>
  </div>
  <div v-show="!isEdit">
    <Upload
      ref="upload"
      v-if="isSuccessShow"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :max-size="this.$config.fileMaxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :headers="headers"
      multiple
      type="drag"
      :action="action">

      <div style="padding: 20px 0;background-color: #faf9f9">
        <Icon type="md-cloud-upload" size="100" style="color: #dedeed"></Icon>
        <p style="font-size: 18px">{{$t('link_click_upload')}}</p>
        <p style="color: #c4c4c3">{{$t('tab_drag')}}</p>
        <p style="color: #d3d3d3">{{$t('tab_sizeInfo')}}</p>
      </div>
    </Upload>
  </div>
</div>
</template>

<script>

import { getProUri } from '@/libs/assist'
import { getToken } from '@/libs/utils'
import { fileIcon } from './fileIcon'
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters({
      picDefaultList: 'GET_FILE_LIST_DEFAULT',
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
  // mounted () {
  //   this.defaultList = this.picDefaultList
  //   this.$nextTick(() => {
  //     this.$refs.upload && (this.uploadList = this.$refs.upload.fileList)
  //   })
  // },
  watch: {
    picDefaultList (val) {},
    isSuccess (val) {
      if (val) {
        this.defaultList = this.picDefaultList
        this.$nextTick(() => {
          this.$refs.upload && (this.uploadList = this.$refs.upload.fileList)
        })
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
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)

      this.$emit('changeFile', this.$refs.upload.fileList)
    },
    // 附件上传成功回调
    handleSuccess (res, file) {
      if (res.returnCode === 1) {
        file.name = res.data.fileName
        file.fileName = res.data.fileName
        file.fileCode = res.data.fileCode
        file.createUserId = res.data.createUserId
        file.createUserName = res.data.userName
        file.createTime = res.data.createTime
        file.fileExt = res.data.fileExt

        this.$emit('changeFile', this.$refs.upload.fileList)
      }
    },
    // 附件上传文件格式判断
    handleFormatError (file) {
      this.$Notice.warning({
        title: this.$t('msg_notice_312'),
        desc: '文件格式错误，请选择图片'
      })
    },
    // 附件上传文件尺寸判断
    handleMaxSize (file) {
      this.$Notice.warning({
        title: this.$t('msg_notice_313'),
        desc: '文件' + file.name + ' 过大, 请勿上传超过5M.'
      })
    },
    // 附件上传前判断
    handleBeforeUpload () {
      var check = this.uploadList.length < 4
      if (!check) {
        this.$Notice.warning({
          title: '附件最多可上传四个'
        })
      }
      return check
    },
    // 文件下载
    handleDownload (fileCode) {
      return getProUri(this, `file/download/${fileCode}`)
    }
  }
}
</script>
