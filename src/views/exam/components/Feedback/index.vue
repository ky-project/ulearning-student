<template>
  <div class="feedback">
    <el-dialog
      title="提示"
      :visible="visible"
      :show-close="false"
      :width="$store.getters.device === 'desktop' ? '400px' : '80%'"
      class="feedback-dialog"
    >
      <i class="el-icon-info icon" />
      <span class="feedback-text">测试结果将会在{{ seconds }}s内生成，请耐心等待</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="back">取 消</el-button>
        <el-button type="primary" @click="go">立即查看</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const goUrl = '/exam/exam-result'
const backUrl = '/exam/exam-select'
export default {
  name: 'Feedback',

  components: { },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      seconds: 60,
      timer: ''
    }
  },

  computed: {},

  watch: {
    visible(value, oldValue) {
      // 开启定时器
      if (!oldValue && value) {
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds === 0) {
            this.go()
          }
        }, 1000)
      }
    }
  },

  beforeMount() {},

  mounted() {},

  methods: {
    back() {
      clearInterval(this.timer)
      this.$emit('update:visible', false)
      this.jump(backUrl) // 页面跳转
    },
    go() {
      clearInterval(this.timer)
      this.$emit('update:visible', false)
      this.jump(goUrl) // 页面跳转
    },
    jump(path) {
      this.$router.push(path)
    }
  }

}

</script>
<style lang='scss' scoped>
.feedback {
  .icon {
    color: #409EFF;
    font-size: 20px;
  }
  &-text {
    font-size: 16px;
  }
}
.customWidth {
  width: 80% !important;
}
@media screen and (max-width: 991px) {
  /* .feedback {
    .feedback-dialog {
      display: none;
    }
  } */
}
</style>
