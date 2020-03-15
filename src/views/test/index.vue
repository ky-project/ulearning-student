<template>
  <div>
    <GradeProgress
      :percentage="percentage"
    />
  </div>
</template>

<script>
import GradeProgress from '@/views/experiment/components/GradeProgress'
export default {
  name: 'Test',

  components: { GradeProgress },
  props: [''],
  data() {
    return {
      percentage: 0
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
