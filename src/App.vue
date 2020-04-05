<template>
  <div id="app">
    <router-view />
    <!-- <div v-mobile class="main">
      <el-scrollbar :style="{height: '100%'}">
        <router-view />
      </el-scrollbar>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='scss'>
  .el-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-select-dropdown .el-scrollbar {
    padding-bottom: 17px;
  }
</style>
