<template>
  <section class="app-main">
    <!-- <transition v-desktop name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition> -->
    <!-- 电脑端 -->
    <div v-if="$store.getters.device === 'desktop'" :style="{height: height}">
      <transition v-desktop name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </div>
    <!-- 手机端，带滚动条 -->
    <div v-else :style="{height: height}">
      <transition name="fade-transform" mode="out-in">
        <el-scrollbar :style="{height: '100%'}">
          <router-view :key="key" />
        </el-scrollbar>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  props: {
    height: {
      type: String,
      required: true
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  width: 100%;
  position: relative;
  /* overflow: hidden; */
}

/* .fixed-header+.app-main {
  padding-top: 50px;
} */

/* @media screen and (max-width: 991px) {
  .app-main {
    padding-bottom: 55px;
  }
} */

</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
