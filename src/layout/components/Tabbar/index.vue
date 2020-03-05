<template>
  <div class="tabbar flex">
    <router-link
      v-for="(item,index) in data"
      :key="item.title"
      :to="item.path"
      class="tabbar-item grow"
      @click="() => { selectNum = index }"
    >
      <svg-icon
        :icon-class="item.icon"
        class="tabbar-item-icon"
      />
      <div class="tabbar-item-label">{{ item.label }}</div>
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'Tabbar',

  components: {},
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectNum: ''
    }
  }
}

</script>
<style lang='scss' scoped>
.tabbar {
  right: 0;
  bottom: 0px;
  left: 0;
  position: fixed;
  z-index: 1;
  border-top: 1px solid #eee;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  // margin-bottom: 50px;
  .router-link-active {
    background-color: #eaeaea;
    color: #26a2ff;
  }
  &-item {
    display: block;
    padding: 7px 0;
    background-color: #fff;
    color: #666;
    text-align: center;
    &-icon {
      font-size: 24px;
      margin: 0 auto 5px;
    }
    &-label {
      color: inherit;
      font-size: 12px;
      line-height: 1;
    }
  }
}
</style>
