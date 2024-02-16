<template>
<div>
  <div class="">
    <div class="upload-list" :key="i" v-for="(item, i) in uploadList">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="upload-list-cover">
          <Icon type="ios-eye" @click.native="handleView(item)"></Icon>
          <Icon type="ios-trash" @click.native="handleRemove(item)" v-if="enabledDelete(item)"></Icon>
          <a :href="handleDownload(item.imgCode)">
            <Icon type="md-download"></Icon>
          </a>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
  </div>
  <div v-show="!disabled">
    <Upload
      multiple
      ref="upload"
      v-if="isSuccessShow"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="this.$config.imgFormat"
      :max-size="this.$config.fileMaxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :headers="headers"
      :action="action"
      style="display: inline-block;width:80px;">
      <div class="upload-list add-icon hover-icon-upload" v-show="uploadList.length<4">
        <Icon type="md-add"/>
      </div>
    </Upload>
  </div>
  <Modal :title="imgInfo.name" v-model="visibleImgDialog">
    <img :src="imgInfo.url" v-if="visibleImgDialog" style="width: 100%">
    <div slot="footer">
      <div style="margin-top: 20px; text-align: right">
        <span style="margin-right: 20px">{{imgInfo.createUserName}}</span>
        <span>{{imgInfo.createTime}}</span>
      </div>
    </div>
  </Modal>
</div>
</template>

<script>

import { getProUri } from '@/libs/assist'
import { getToken } from '@/libs/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'itemUpload',
  props: {
    isSuccess: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      type: false,
      default: true
    }
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
  mounted () {
    this.list.map((item) => {
      item.url = getProUri(this, `images/img/org/${item.imgCode}`)
      return item
    })
    this.defaultList = this.list
    this.$nextTick(() => {
      this.$refs.upload && (this.uploadList = this.$refs.upload.fileList)
    })
  },
  watch: {
    list (val) {},
    isSuccess (val) {
      if (val) {
        this.list.map((item) => {
          item.url = getProUri(this, `images/img/org/${item.imgCode}`)
          return item
        })
        this.defaultList = this.list
        this.$nextTick(() => {
          this.$refs.upload && (this.uploadList = this.$refs.upload.fileList)
        })
      }
    }
  },
  data () {
    return {
      uploadSuccessPage: 0,
      firstWarn: true,
      defaultList: [],
      headers: {
        'Authorization': getToken()
      },
      action: getProUri(this, 'images/upload/2'),
      imgInfo: {
        name: '',
        imgName: '',
        imgCode: '',
        createUserId: '',
        createUserName: '',
        createTime: '',
        fileExt: '',
        url: ''
      },
      uploadList: [],
      visibleImgDialog: false
    }
  },
  methods: {
    // 是否可以删除
    enabledDelete (item) {
      // 当前上传人可以删除 （创建和草稿状态）
      return !this.disabled && (item.createUserId === this.loginUserId)
    },
    // 点击 弹出 文件附件（图片弹出）
    handleView (imgInfo) {
      this.imgInfo = imgInfo
      this.visibleImgDialog = true
    },
    // 上传附件删除
    handleRemove (file) {
      var fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.$emit('changeFile', this.$refs.upload.fileList)
      this.firstWarn = true
      this.uploadSuccessPage--
    },
    // 附件上传成功回调
    handleSuccess (res, file) {
      if (res.returnCode === 1) {
        file.name = res.data.imgName
        file.imgName = res.data.imgName
        file.imgCode = res.data.imgCode
        file.createUserId = res.data.createUserId
        file.createUserName = res.data.userName
        file.createTime = res.data.createTime
        file.fileExt = res.data.imgExt
        file.url = getProUri(this, `images/img/org/${res.data.imgCode}`)
        this.$emit('changeFile', this.$refs.upload.fileList)
        // web org(原图) pad(缩略)
        this.uploadSuccessPage++
        if (this.uploadSuccessPage === this.uploadList.length) {
          this.$emit('uploadFinished')
        }
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
      if (!check && this.firstWarn) {
        this.firstWarn = false
        this.$Notice.warning({
          title: '最多可上传四张图片'
        })
      }
      this.$emit('uploadStart')
      return check
    },
    // 图片下载
    handleDownload (fileCode) {
      return getProUri(this, `images/download/${fileCode}`)
    }
  }
}
</script>
<style>
  .hover-icon-upload {
    cursor: pointer;
    border: 1px dashed #dedede;
  }
  .hover-icon-upload:hover {
    border: 1px dashed #2d8cf0;
  }
  .hover-icon-upload:hover i{
    color: #2d8cf0;
  }
</style>
