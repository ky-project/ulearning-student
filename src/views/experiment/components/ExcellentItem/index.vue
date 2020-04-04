<template>
  <div class="excellent-item" @click="$emit('click')">
    <span class="excellent-item__name">{{ name }}</span>
    <span class="excellent-item__greade">{{ grade }} 分</span>
  </div>
</template>

<script>

export default {
  name: '',

  components: {},
  props: {
    name: {
      type: String,
      required: true
    },
    grade: {
      type: Number,
      required: true
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
.excellent-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 40px;
  line-height: 40px;
  padding: 0 10px 0 20px;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
  &__name {
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 5px;
      transform: translateY(-50%);
      display: block;
      width: 10px;
      height: 10px;
      border: 1px solid #409EFF;
      border-radius: 50%;
    }
    &::after {
      content: '';
      z-index: 999;
      position: absolute;
      top: 25px;
      left: 10px;
      width: 1px;
      height: 30px;
      background-color: #409EFF;
    }
  }
}
</style>
