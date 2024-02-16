<!--
 * @Author: your name
 * @Date: 2020-03-23 08:54:08
 * @LastEditTime: 2020-06-11 12:37:38
 * @LastEditors: JiangXiao
 * @Description: In User Settings Edit
 * @FilePath: \sinobec\src\components\common\navbar\NavBar.vue
--> 
<template>
  <div id="navbar" class="navbar navbar-default ace-save-state">
    <div class="navbar-container ace-save-state" id="navbar-container">
      <button type="button" class="navbar-toggle menu-toggler pull-left" id="menu-toggler" data-target="#sidebar" @click="isShowmenuMin">
        <span class="sr-only">Toggle sidebar</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>

      <div class="navbar-header pull-left">
        <router-link to="/home" class="navbar-brand">
          <small>
            <img :src="logo" alt="logo" style="height:29px" />
            <span class="logo-title">{{ $t('base_title') }}</span>
          </small>
        </router-link>
      </div>

      <div class="navbar-buttons navbar-header pull-right" role="navigation">
        <ul class="nav ace-nav">
          <li class="bg-li">
            <fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
          </li>

          <!--多语言切换-->
          <li class="bg-li" style="margin-right:10px;">
            <language v-if="$config.useI18n" @on-lang-change="setLang" :lang="local" />
          </li>

          <!--消息-->

          <!--用户信息-->
          <li class="user-dropdown">
            <user />
          </li>
        </ul>
      </div>
    </div>
    <!-- /.navbar-container -->
  </div>
</template>

<script>
import Language from '../language'
import User from '../user'
import Message from '../message'
import Fullscreen from '../fullscreen'
import { mapMutations } from 'vuex'

import logo from '@/assets/images/logoHome.png'
export default {
  props: {
    appInfo: {
      type: Object,
      default: () => { }
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  inject: ['reload'],
  components: {
    Language, User, Message, Fullscreen
  },
  computed: {
    local () {
      return this.$store.state.app.local
    }
  },
  data () {
    return {
      logo,
      isFullscreen: false,
      version: ''
    }
  },
  mounted () {
    this.version = window.VERSION || ''
  },
  methods: {
    ...mapMutations([
      'setLocal'
    ]),
    setLang (name) {
      this.$store.dispatch('SET_LOCAL_LANG', name).then(() => {
        this.$nextTick(() => {
          this.reload()
        })
      })
    },
    isShowmenuMin () {
      this.$emit('is-display')
    }
  }
}
</script>
