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

<style lang="scss">
/* .main {
  height: calc(100vh - 105px);
  margin-top: 50px;
} */
</style>
