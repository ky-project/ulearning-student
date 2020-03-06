<template>
  <div class="file-nav">
    <el-breadcrumb v-desktop separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item,index) in data"
        :key="item.fileId"
      >
        <a href="#" @click="clickHandler(index)">{{ item.fileName }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div v-mobile class="fl back" @click="$emit('back')">
      <div v-if="!isRoot">
        <svg-icon icon-class="shangyiji" />
        <span>上一级</span>
      </div>
      <span v-else>根目录</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FileNav',
  components: {},
  props: {
    data: {
      type: Array, // [{fileId: 1, fileName: '新建文件夹'}]
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    clickHandler(index) {
      const newData = this.data.slice(0, index + 1)
      this.$emit('update', newData)
    }
  }

}

</script>
<style lang='scss' scoped>
.file-nav {
  .back {
    line-height: 40px;
  }
}
</style>
