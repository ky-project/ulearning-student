<template>
  <div class="desktop-header flex justify-between">
    <div>
      <slot name="left" />
    </div>
    <div class="desktop-header-center">
      <slot name="center" />
    </div>
    <div>
      <slot name="right" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'DesktopHeader',

  components: {},
  props: [''],
  data() {
    return {

    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {}

}

</script>
<style lang='scss' scoped>
.desktop-header {
  padding: 5px 20px;
  background: #F5F7FA;
  &-center {
    line-height: 40px;
  }
}
</style>
