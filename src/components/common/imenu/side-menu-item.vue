<template>
  <Submenu :name="`${parentName}`">
    <template slot="title">
      <xIcon :type="parentItem.icon || ''"/>
      <span class="x-x-title">{{ showTitle(parentItem) }}</span>
    </template>
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`"><xIcon :type="item.children[0].icon || ''"/><span class="x-x-1">{{ showTitle(item.children[0]) }}</span></menu-item>
      </template>
      <template v-else>
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`" class="x-x-2" :link="item.name" :pname="showTitle(item)"><Icon :type="item.icon || ''"/>
          <router-link :to="{name: item.name}" class="x-router-link">{{ showTitle(item) }}</router-link>
        </menu-item>
      </template>
    </template>
<!--    <v-contextmenu ref="contextmenu" @contextmenu="menuRightChange">-->
<!--      <div class="page-title">{{pageTitle}}</div>-->
<!--      <v-contextmenu-item @click="openInBlank">Open Link in new tab</v-contextmenu-item>-->
<!--      <v-contextmenu-item @click="openInWindow">Open Link in window</v-contextmenu-item>-->
<!--    </v-contextmenu>-->
  </Submenu>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
  name: 'SideMenuItem',
  mixins: [ mixin, itemMixin ],
  inject: ['reload'],
  data () {
    return {
      currentLink: '',
      pageTitle: ''
    }
  },
  methods: {
    // openWindow (url, title, w, h) {
    //   // Fixes dual-screen position                            Most browsers       Firefox
    //   const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
    //   const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
    //
    //   const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    //   const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    //
    //   const left = ((width / 2) - (w / 2)) + dualScreenLeft
    //   const top = ((height / 2) - (h / 2)) + dualScreenTop
    //   const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)
    //
    //   // Puts focus on the newWindow
    //   if (window.focus) {
    //     newWindow.focus()
    //   }
    // },
    // // 新标签页打开
    // openInBlank (instance, event) {
    //   let routeUrl = this.$router.resolve({
    //     name: this.currentLink
    //   });
    //   window.open(routeUrl.href, '_blank');
    // },
    // // 新窗口打开
    // openInWindow () {
    //   let routeUrl = this.$router.resolve({
    //     name: this.currentLink
    //   });
    //   this.openWindow(routeUrl.href)
    // },
    // // 回到首页
    // toHome () {
    //   this.$router.push({ name: 'home' })
    // },
    // // 获取目标链接
    // menuRightChange (ins) {
    //   if (ins.data.attrs && ins.data.attrs.link) {
    //     this.currentLink = ins.data.attrs.link;
    //     this.pageTitle = ins.data.attrs.pname;
    //   }
    // }
  }
}
</script>
<style>
  .ivu-menu-submenu-title,.ivu-menu-item {
    white-space: nowrap;
  }
  .x-x-2{
    /*padding-left: 60px!important;*/
  }


  .page-title {
    text-align: center;
    padding: 5px 0;
    border-bottom: 1px solid #ddd;
  }

  /*右键菜单样式*/
  .v-contextmenu {
    padding: 5px !important;
    border-radius: 2px !important;
  }
  /*.v-contextmenu .flag{*/
    /*width: 31px;*/
    /*height: 30px;*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*overflow: hidden;*/
  /*}*/
  /*.v-contextmenu .flag span{*/
    /*width: 65px;*/
    /*height: 24px;*/
    /*line-height: 33px;*/
    /*display: inline-block;*/
    /*text-align: center;*/
    /*transform: rotate(-40deg);*/
    /*background: #3a4266;*/
    /*color: #fff;*/
    /*padding-right: 17px;*/
    /*position: relative;*/
    /*left: -20px;*/
    /*top: -14px;*/
  /*}*/
  /*.v-contextmenu .flag span i{*/
    /*color: #fff;*/
  /*}*/
  .v-contextmenu .v-contextmenu-item{
    width: 165px;
    padding: 7px 16px !important;
    line-height: normal !important;
    color: #666 !important;
  }
  .v-contextmenu .v-contextmenu-item:hover{
    background-color: rgba(232, 238, 248, 1);
    color: #00A0F0 !important;
  }

</style>
