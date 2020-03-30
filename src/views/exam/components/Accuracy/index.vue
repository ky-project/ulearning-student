<template>
  <div class="accuracy">
    <div v-for="item in data" :key="item.label" class="line flex">
      <label>{{ item.label }}</label>
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="item.percentage"
        :color="customColorMethod"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Accuracy',

  components: {},
  props: {
    data: {
      type: Array,
      required: true // [{label: xxx, percentage: xxx}]
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
    // 获取进度条颜色
    customColorMethod(percentage) {
      if (percentage < 30) {
        return '#909399'
      } else if (percentage < 70) {
        return '#e6a23c'
      } else {
        return '#67c23a'
      }
    }
  }

}

</script>
<style lang='scss' scoped>
.accuracy {
  .line {
    margin-top: 20px;
  }
  label {
    width: 50px;
    font-weight: normal;
    color: #333;
  }
  .el-progress {
    flex: 1;
  }
}
</style>
