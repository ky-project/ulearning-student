<template>
  <div>
    <DownloadBox :file="file" />
  </div>
</template>

<script>
import DownloadBox from '@/views/notice/components/DownloadBox'
export default {
  name: 'Test',

  components: { DownloadBox },
  props: [''],
  data() {
    return {
      file: {
        name: 'h2llo.txt',
        size: 1000000,
        id: ''
      }
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
