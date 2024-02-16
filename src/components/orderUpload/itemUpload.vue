<template>
  <div class="itemUpload-box">
    <span v-if="disabled==false" class="itemUpload-warning">{{$t('msg_upload_img')}}</span>
    <el-upload
      :class="disabledSelfClass"
      :disabled="disabled"
      :action="action"
      list-type="picture-card"
      :limit="4"
      v-if="isSuccess"
      :file-list="defaultList"
      :headers="headers"
      :on-preview="handlePictureCardPreview"
      :on-exceed="handleBeforeUpload"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :auto-upload="true"
      :on-remove="handleRemove">
      <Icon type="md-add"/>
    </el-upload>

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

  import {getProUri} from '@/libs/assist'
  import {getToken} from '@/libs/utils'
  import {mapGetters} from 'vuex'
  import ElUpload from './upload'

  export default {
    name: 'orderUpload',
    props: {
      isSuccess: {
        type: Boolean,
        default: false
      },
      list: {
        type: Array,
        default() {
          return []
        }
      },
      disabled: {
        type: Boolean,
        default: true
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
    data() {
      return {
        disabledSelfClass: '',
        defaultList: [],
        headers: {
          'Authorization': getToken()
        },
        imgInfo: {
          name: '',
          imgName: 'aaa',
          imgCode: '',
          createUserId: '',
          createUserName: '',
          createTime: '',
          fileExt: '',
          url: ''
        },
        visibleImgDialog: false,
        action: getProUri(this, 'images/upload/1'),
        uploadList: []
      }
    },
    mounted () {
      this.list.forEach((file) => {
        if(!file.url){
          file.url = getProUri(this, `images/img/org/${file.imgCode}`) || ''
        }
        
      })
      this.defaultList = this.$c(this.list)
    },
    watch: {
      list (val) {
      },
      defaultList (newVal) {
        if (newVal.length > 3) {
          this.disabledSelfClass = 'self-is-disabled'
        } else {
          this.disabledSelfClass = ''
        }
      }
    },
    methods: {
      // 是否可以删除
      enabledDelete(item) {
        // 当前上传人可以删除 （创建和草稿状态）
        return !this.disabled && (item.createUserId === this.loginUserId)
      },
      // 上传附件删除
      handleRemove(file, fileList) {
        this.defaultList = fileList
        this.$emit('changeFile', this.defaultList)
      },
      // 点击 弹出 文件附件（图片弹出）
      handlePictureCardPreview (imgInfo) {
        console.log("imgInfo", imgInfo)
        this.imgInfo = imgInfo
        this.visibleImgDialog = true
      },
      // 附件上传成功回调
      handleSuccess(res, file, fileList) {
        console.log("res",res)
        console.log("file",file)
        console.log("fileList",fileList)
        if (res.returnCode === 1) {
          file.name = res.data.imgName
          file.imgName = res.data.imgName
          file.imgCode = res.data.imgCode
          file.createUserId = res.data.createUserId
          file.createUserName = res.data.userName
          file.createTime = res.data.createTime
          file.fileExt = res.data.imgExt
          file.url = getProUri(this, `images/img/org/${res.data.imgCode}`)
          // 上传成功添加一条
          this.defaultList.push(file)
          this.$emit('uploadFinished')
          this.$emit('changeFile', this.defaultList)
        }
      },
      // 附件上传前判断
      handleBeforeUpload() {
        this.$Notice.warning({desc: '附件最多可上传四个'})
      },
      // 文件下载
      handleDownload(file) {
        window.open(getProUri(this, `file/download/${file.fileCode}`))
      },
      // 附件上传文件格式判断
      // 附件上传文件尺寸判断
      // 上传前校验
      beforeUpload(file) {
        console.log("?????")
        // 文件扩展名的正则表达式
        var patternFileExtension = /\.([0-9a-z]+)(?:[\?#]|$)/i;
        // 获得文件扩展名
        var fileExtension = (file.name).match(patternFileExtension);

        const isIMG = this.$config.imgFormat.indexOf(fileExtension[1]) > -1
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isIMG) {
          this.$Notice.warning({ desc: '只能上传图片格式，例如jpg,jpeg,png,gif,svg,bmp,webp,ico' });
        }
        if (!isLt5M) {
          this.$Notice.warning({ desc: '上传图片大小不能超过 5MB!' });
        }
        this.$emit('uploadStart')

        return isIMG && isLt5M;
      }
    }
  }
</script>
<style>
  .itemUpload-box .el-upload.is-disabled {
    display: none;
  }
  .self-is-disabled .el-upload {
    display: none;
  }
</style>
