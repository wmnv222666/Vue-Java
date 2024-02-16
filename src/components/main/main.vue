<template>
  <div style="height: 100%;">

    <nav-bar @is-display="isShowMenuMin"></nav-bar><!-- /.navBar-->

    <div class="main-container ace-save-state main" id="main-container">
      <!--左侧SideBar-->

      <Sider id="sidebar" class="sidebar responsive ace-save-state left-sider" hide-trigger collapsible :width="220"
             :collapsed-width="43" v-model="collapsed" :class="{'menu-min':collapsed,display:isDisplay}" style="overflow: hidden;height:100%">

        <!--菜单折叠控制-->
        <slide-collapsed :collapsed="collapsed" @on-coll-change="handleCollapsedChange"></slide-collapsed>

        <!--菜单-->
        <i-menu accordion ref="sideMenu" :active-name="getActiveName()" :collapsed="collapsed" @on-select="turnToPage"
                :menu-list="menuList"></i-menu>

      </Sider>
      <!--右侧Content-->
      <Layout class="main-content main-layout-con">
        <div class="main-content-inner">
          <!--面包屑-->
          <custom-bread-crumb :list="breadCrumbList"></custom-bread-crumb>
          <!--<div class="tag-nav-wrapper">-->
            <!--<tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>-->
          <!--</div>-->
          <!--内容显示区域-->
          <div class="page-content">
            <transition name="fade" mode="out-in" >
              <!-- 缓存所有的页面 -->
              <keep-alive>
                  <router-view v-if="$route.meta.keepAlive"></router-view>
              </keep-alive>
            </transition>
            <transition name="fade" mode="out-in" >
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </transition>

            <ABackTop :height="100" :bottom="80" :right="50" container=".page-content"></ABackTop>
          </div>
        </div>
      </Layout>
    </div>
  </div>
</template>

<script>
import customBreadCrumb from '../common/breadcrumbs'
import TagsNav from '../common/tags-nav'
import navBar from '../common/navbar'
import iMenu from '../common/imenu'
import slideCollapsed from '../common/slidecollapsed'
import ABackTop from '../common/a-back-top'
import { mapMutations, mapActions } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/utils'
import routers from '@/router/routers'
export default {
  data () {
    return {
      isDisplay: false
    }
  },
  components: {
    navBar,
    iMenu,
    slideCollapsed,
    customBreadCrumb,
    ABackTop,
    TagsNav
  },
  computed: {
    key () {
      return this.$route.fullPath
    },
    // 面包屑数据
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    },
    // 菜单数据
    menuList () {
      return this.$store.getters.menuList
    },
    // 菜单折叠
    collapsed: {
      get () {
        return this.$store.getters.isCollapse
      },
      set (val) {
        this.$store.commit('setMenuCollapsed', val)
      }
    },
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setLocal',
      'setMenuCollapsed',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    getActiveName () {
      if ('in' in this.$route.query) {
        var _in = this.$route.query.in
        switch (_in + '') {
          case '0':
          case '1':
            // 主详情页名命规则
            // 列表页名称 + _ + detail (1-3)
            // 二级或多级详情页名命规则
            // 列表页名称 + _ + detail  + 其他具体英文单词
            if (/_detail/.test(this.$route.name)) {
              return this.$route.name.match(/(\S*)_detail/)[1]
            } else {
              return this.$route.name
            }
          default:
            return this.$route.name
        }
      } else {
        return this.$route.name
      }
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    getPlaceholderCount (strSource) {
      // 统计字符串中包含_的个数
      var thisCount = 0
      strSource.replace(/_/g, function (m, i) {
        // m为找到的_元素、i为索引
        thisCount++
      })
      return thisCount
    },
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    isShowMenuMin () {
      this.isDisplay = !this.isDisplay
    }
  },
  watch: {
    '$route' (newRoute) {
      // const { name, query, params, meta } = newRoute
      // this.addTag({
      //   route: { name, query, params, meta },
      //   type: 'push'
      // })
      this.setBreadCrumb(newRoute)
      // this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    // this.setTagNavList()
    this.setHomeRoute(routers)
    // const { name, params, query, meta } = this.$route
    // this.addTag({
    //   route: { name, params, query, meta }
    // })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)

    // 如果当前打开页面不在标签栏中，跳到homeName页
    // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
    //   this.$router.push({
    //     name: this.$config.homeName
    //   })
    // }
  }
}
</script>
