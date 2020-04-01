<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar v-desktop class="sidebar-container" />
    <div class="main-container">
      <div class="fixed-header">
        <navbar />
      </div>
      <app-main :height="mainHeight" />
      <div v-show="!hiddenTabbar" v-mobile class="fixed-bottom">
        <tabbar :data="data" />
      </div>
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
        { icon: 'kaoshi', label: '测试', children: [
          { label: '选择测试', path: '/exam/exam-select' },
          { label: '测试结果', path: '/exam/exam-result' }
        ] },
        { icon: 'shiyan', label: '实验', path: '/experiment/experiment-list' },
        { icon: 'ziliao', label: '资源', path: '/select-course/index4', children: [
          { label: '教学资源', path: '/file-manage/resource-manage' },
          { label: '文件资料', path: '/file-manage/document-manage' }
        ] }
      ],
      hiddenTabbar: false
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    mainHeight() {
      if (this.device === 'desktop') {
        return 'calc(100vh - 50px)'
      } else {
        if (this.hiddenTabbar) {
          return 'calc(100vh - 50px)'
        } else {
          return 'calc(100vh - 105px)'
        }
      }
    },
    /* fixedHeader() {
      return this.$store.state.settings.fixedHeader
    }, */
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
    '$route.meta': {
      handler(newVal, oldVal) {
      // 前提：手机端
        if (newVal.mobile && newVal.mobile.hiddenTabbar) {
        // console.log('meta', newVal.mobile.hiddenTabbar)
          this.hiddenTabbar = true
        } else {
          this.hiddenTabbar = false
        }
      },
      immediate: true
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

  .main-container {
    padding-top: 50px;
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

  .fixed-bottom {
    right: 0;
    bottom: 0px;
    left: 0;
    position: fixed;
    z-index: 9;
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

