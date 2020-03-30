<template>
  <div class="tabbar flex">
    <template v-for="(item,index) in data">
      <router-link
        v-if="!item.children"
        :key="item.label"
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
      <el-dropdown v-else :key="item.label" class="tabbar-item grow">
        <span class="el-dropdown-link">
          <svg-icon
            :icon-class="item.icon"
            class="tabbar-item-icon"
          />
          <div class="tabbar-item-label">{{ item.label }}</div>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="option in item.children" :key="option.label">
            <router-link :to="option.path">{{ option.label }}</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </div>
</template>

<script>

export default {
  name: 'Tabbar',

  components: {},
  props: {
    data: {
      type: Array, // [{ path: xxx, label: xxx, icon: xxx, children: [icon: xxx, label: xxx, path: xxx]}]
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
