<template>
  <div class="test">
    <Feedback :visible.sync="visible" />
    <button @click="clickHandler">开关</button>
  </div>
</template>

<script>
import Feedback from '@/views/exam/components/Feedback'
export default {
  name: 'Test',

  components: { Feedback },
  props: [''],
  data() {
    return {
      visible: false
    }
  },

  computed: {},

  watch: {},

  created() {

  },
  beforeMount() {},

  mounted() {},

  methods: {
    clickHandler() {
      this.visible = !this.visible
    }
  }

}

</script>
<style lang='scss' scoped>
.test {
  width: 400px;
  height: 400px;
  border: 1px solid #000;
}
</style>
