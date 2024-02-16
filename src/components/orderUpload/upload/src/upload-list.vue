<template>
  <transition-group
    tag="ul"
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="el-list"
  >
    <li
      v-for="file in files"
      :class="['el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '', { 'is-disabled': disabled }]"
      :key="file.uid"
      tabindex="0"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <img
          class="el-upload-list__item-thumbnail"
          v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
          :src="getFileIcon(file.fileExt, file.url)" alt=""
        >
        <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i class="el-icon-document ivu-icon ivu-icon-ios-browsers-outline"></i>
          {{ file.name || file.fileCode }}
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="ivu-icon" :class="{
            'el-icon-upload-success': true,
            'ivu-icon-md-checkmark-circle': listType === 'text',
            'ivu-icon-md-checkmark': ['picture-card', 'picture'].indexOf(listType) > -1
          }"></i>
        </label>
        <i class="el-icon-close ivu-icon ivu-icon-md-close" v-if="!disabled" @click="$emit('remove', file)"></i>
        <i class="el-icon-close-tip" v-if="!disabled">请按delete删除</i> <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
        <div class="file-info">
          <span class="create-user">{{file.createUserName}}</span> <span>{{file.createTime}}</span>
        </div>
        <Progress
          v-if="file.status === 'uploading'"
          :stroke-width="listType === 'picture-card' ? 6 : 2"
          :percent="parsePercentage(file.percentage)">
        </Progress>
        <span class="el-upload-list__item-actions" v-if="listType === 'picture-card'">
          <span
            class="el-upload-list__item-preview"
            v-if="handlePreview && listType === 'picture-card'"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in ivu-icon ivu-icon-md-locate"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="$emit('remove', file)"
          >
            <i class="el-icon-delete ivu-icon ivu-icon-md-close"></i>
          </span>
        </span>
      </slot>
    </li>
  </transition-group>
</template>
<script>
  import { fileIcon } from '../../fileIcon'
  export default {

    name: 'ElUploadList',

    data() {
      return {
        focusing: false
      };
    },

    props: {
      files: {
        type: Array,
        default() {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      handlePreview: Function,
      listType: String
    },
    methods: {
      getFileIcon (ext, url) {
        if (url) {
          return url
        } else {
          return fileIcon(ext)
        }
      },
      parsePercentage(val) {
        return parseInt(val, 10);
      },
      handleClick(file) {
        this.handlePreview && this.handlePreview(file);
      }
    }
  };
</script>
