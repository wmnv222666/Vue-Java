<template>
<div class="x-img-upload">
  <el-upload
    :headers="headers"
    :action="action"
    :multiple="multiple"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-preview="handlePictureCardPreview"
    :on-exceed="handleBeforeUpload"
    :disabled="disabled"
    :limit="limit"
    list-type="picture-card"
    :file-list.sync="fileList"
    :before-upload="beforeUploadHandle"
  >
    <i class="el-icon-plus">+</i>
  </el-upload>

  <Modal v-model="visibleImgDialog">
    <img :src="dialogImageUrl" v-if="visibleImgDialog" style="width: 100%">
  </Modal>

</div>
</template>

<script>

  import {getProUri} from '@/libs/assist'
  import {getToken} from '@/libs/utils'
  import ElUpload from './upload'


  export default {
    name: 'imgUpload',
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
        default: 4
      },
      onSuccess: { type: Function, default: function () { } },
      onError: { type: Function, default: function () { } },
    },
    data() {
      return {
        headers: {
          'Authorization': getToken()
        },
        dialogImageUrl: '',
        visibleImgDialog: false,
        action: getProUri(this, 'images/upload/3')
      }
    },
    methods: {
      // 附件上传前判断
      handleBeforeUpload() {
        this.$Notice.warning({ desc: this.$t('msg_upload_img') });
        return false
      },
      beforeUploadHandle (file) {
        // 文件扩展名的正则表达式
        var patternFileExtension = /\.([0-9a-z]+)(?:[\?#]|$)/i;
        // 获得文件扩展名
        var fileExtension = (file.name).match(patternFileExtension);

        var isIMG = this.$config.imgFormat.indexOf(fileExtension[1]) > -1
        var isLt5M = file.size / 1024 / 1024 < 5;

        if (!isIMG || !isLt5M) {
          this.$Notice.warning({ desc: this.$t('msg_upload_img') });
        }
        return isIMG && isLt5M;
      },
      handleSuccess(response, file, fileList) {
        this.$emit('update:fileList', fileList)
        var uploadList = this.uploadListFormat(fileList)
        this.onSuccess(uploadList, file);
        this.$emit('on-change', uploadList)
      },
      handleRemove(file, fileList) {
        this.$emit('update:fileList', fileList)
        var uploadList = this.uploadListFormat(fileList)
        this.onError(uploadList, file)
        this.$emit('on-change', uploadList)
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.visibleImgDialog = true
      },
      uploadListFormat(fileList) {
        // 成功返回数据信息
        // createTime: "2020-03-11 16:49:32"
        // createUserId: 1
        // imgCode: "02fecf10700e45f38cb8b90f2d47646e.jpg"
        // imgExt: "jpg"
        // imgMd5: "99a3867acb48375e7517695b51489498"
        // imgName: "1709935e61f3872e.jpg"
        // imgPadCode: "02fecf10700e45f38cb8b90f2d47646e_200X133.jpg"
        // imgSize: 51057
        // imgWebCode: "02fecf10700e45f38cb8b90f2d47646e_cut_200X200.jpg"
        // isDelete: 0
        // modifyTime: "2020-03-11 16:49:32"
        // modifyUserId: 1
        // path: "2020/202003/20200311/"
        // userName: "管理员"

        var uploadListTemp = []

        fileList.forEach(function (item) {
          var imgItem = { imgCode: '', imgExt: '', createUserId: '', userName: '' }
          if (item.response) {
            imgItem = {
              imgCode: item.response.data.imgCode || '',
              imgExt: item.response.data.imgExt || '',
              createUserId: item.response.data.createUserId || '',
              userName: item.response.data.userName || '',
            }
          } else {
            imgItem = {
              imgCode: item.imgCode || '',
              imgExt: item.imgExt || '',
              createUserId: item.createUserId || '',
              userName: item.userName || '',
            }
          }
          uploadListTemp.push(imgItem)
        })

        return uploadListTemp
      }
    },
  }
</script>

<style scoped>

</style>
