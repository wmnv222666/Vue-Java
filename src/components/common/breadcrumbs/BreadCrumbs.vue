<template>
  <div class="breadcrumbs ace-save-state" style="margin-left: 0px;">
    <ul class="breadcrumb">
      <li v-for="(item,i) in list" :key="`bread-crumb-${item.name}`">
        <Icon type="ios-home" v-if="i===0" size="16" style="margin-top: -4px"/>
        <router-link v-if="item.to" :to="item.to">{{ showTitle(item) }}</router-link>
        <span v-else>{{ showTitle(item) }}</span>
      </li>
      <!-- 参数 -->
      <li v-if="getCurrentRouter()">
        <span style="color:#3a4266;font-weight: bold">{{ isHasId }}</span>
      </li>
    </ul><!-- /.breadcrumb -->

    <Button type="text" icon="md-refresh" size="small" style="float: right;margin-top: 7px;color:#2db7f5" @click="reload">{{$t('lnk_refresh')}}</Button>

  </div>
</template>

<script>

import mixinsLink from '@/libs/link'
import { showTitle } from '@/libs/utils'

export default {
  name: 'customBreadCrumb',
  mixins: [ mixinsLink ],
  inject: ['reload'],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isHasId () {
      if (this.list.length === 1) {
        return ''
      } else {
        return this.list.length && this.list[this.list.length - 1].router.params.id
      }
    }
  },
  methods: {
    getCurrentRouter () {
      return this.isHasId
    },
    showTitle (item) {
      return showTitle(item, this)
    },
    showIconLink (item) {
      return 'bread-i iconfont ' + (item.meta && item.meta.icon)
    },
    href (item) {
      if (item.to === '/home') {
        return this.$router.options.base + 'home'
      } else {
        return item.to
      }
    }

  }
}
</script>
