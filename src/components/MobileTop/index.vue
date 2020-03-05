<template>
  <div class="mobile-top flex">
    <div class="mobile-top-search grow">
      <i class="el-icon-search mobile-top-search-icon" />

      <input
        type="text"
        class="mobile-top-search-input"
        :value="value"
        :placeholder="placeholder"
        @input="(e) => $emit('input', e.target.value)"
        @keyup.enter="() => {$emit('search')}"
      >
    </div>
    <div class="mobile-top-more">
      <slot />
    </div>
  </div>
</template>

<script>

export default {
  name: 'MobileTop',

  components: {},
  props: {
    value: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: '搜索'
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

  methods: {}

}

</script>
<style lang='scss' scoped>
.mobile-top{
  padding: 10px;
  background-color: #eee;
  &-search {
    background-color: #fff;
    color: #ccc;
    padding: 5px;
    &-input {
      border: none;
      &:focus {
        outline: none;
      }
    }
  }
  /* &-more {

  } */
}
</style>
