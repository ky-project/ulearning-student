<template>
  <div>
    <Tabbar :data="data" />
  </div>
</template>

<script>
import Tabbar from '@/layout/components/Tabbar'
export default {
  name: 'Test',

  components: { Tabbar },
  props: [''],
  data() {
    return {
      data: [
        { icon: 'xuanke', label: '选课' },
        { icon: 'kaoshi', label: '测试' },
        { icon: 'shiyan', label: '实验' },
        { icon: 'ziliao', label: '资源' }
      ]
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {}

}

</script>
<style lang='' scoped>

</style>
