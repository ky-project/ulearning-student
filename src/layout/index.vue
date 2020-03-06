<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar v-desktop class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
      <tabbar v-mobile :data="data" />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, Tabbar } from './components'
import ResizeMixin from './mixin/ResizeHandler' // 监听页面视口变化，设置layout显示模式

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Tabbar
  },
  mixins: [ResizeMixin],
  data: function() {
    return {
      data: [
        { icon: 'xuanke', label: '选课', path: '/select-course/index' },
        { icon: 'kaoshi', label: '测试', path: '/select-course/index2' },
        { icon: 'shiyan', label: '实验', path: '/select-course/index3' },
        { icon: 'ziliao', label: '资源', path: '/select-course/index4', children: [
          { label: '教学资源', path: '/file-manage/resource-manage' },
          { label: '文件资料', path: '/file-manage/document-manage' }
        ] }
      ]
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  /* .tabbar {
    padding-bottom: 50px;
  } */
</style>

