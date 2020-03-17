<template>
  <div class="time-meter">
    <svg-icon icon-class="shijian" class="icon--time" />
    {{ `${hour}:${minute}:${second}` }}
  </div>
</template>

<script>

export default {
  name: 'TimeMeter',

  components: {},
  props: {
    // 单位: 秒
    time: {
      type: Number,
      default: 0
    },
    on: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      hour: 0,
      minute: 0,
      second: 0,
      timerId: ''
    }
  },

  computed: {

  },

  watch: {
    on: {
      handler(value, oldValue) {
        if (oldValue && !value) {
          this.close()
        }
        if (!oldValue && value) {
          this.start()
        }
      },
      immediate: true
    },
    time: {
      handler() {
        this.initialTime()
      },
      immediate: true
    }
  },

  created() {
  },

  beforeMount() {},

  mounted() {},

  beforeDestroy() {
    this.close()
  },

  methods: {
    // 初始化时间
    initialTime() {
      let count = 0
      let m = this.time
      const arr = [0, 0, 0]
      while (m !== 0 && count <= 2) {
        arr[count] = m % 60
        m = parseInt(m / 60)
        count++
      }
      this.second = this.formatTime(arr[0])
      this.minute = this.formatTime(arr[1])
      this.hour = this.formatTime(arr[2])
    },
    // 格式化时间
    formatTime(time) {
      return String(time).length < 2 ? '0' + time : time
    },
    // 开启定时器
    start() {
      this.timerId = setInterval(() => {
        if (Number(this.second)) {
          this.second = this.formatTime(--this.second)
          this.$emit('now', this.getRestTime())
        } else if (Number(this.minute)) {
          this.minute = this.formatTime(--this.minute)
          this.second = 59
          this.$emit('now', this.getRestTime())
        } else if (Number(this.hour)) {
          this.hour = this.formatTime(--this.hour)
          this.minute = 59
          this.second = 59
          this.$emit('now', this.getRestTime())
        } else {
          this.close()
          this.$emit('end')
          // this.$emit('updata:on', false)
        }
      }, 1000)
    },
    // 关闭定时器
    close() {
      clearInterval(this.timerId)
    },
    // 计算剩余时间
    getRestTime() {
      return Number(this.hour) * 3600 + Number(this.minute) * 60 + Number(this.second)
    }
  }

}

</script>
<style lang='scss' scoped>
.time-meter {
  line-height: 100px;
  font-size: 40px;
  color: #409EFF;
  font-weight: bold;
  .icon--time {
    font-size: 40px;
    color: #409EFF;
  }
}
</style>
