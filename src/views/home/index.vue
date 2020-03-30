<template>
  <div class="home">
    <img :src="bgImg" alt="" class="bg" @click.stop="()=>{return false}">
    <div class="welcome">
      <p>欢迎登录</p>
      <p v-desktop>基于泛在学习的学生管理系统</p>
    </div>
  </div>
</template>

<script>
import bgImg from '@/assets/images/showcase.png'
export default {
  name: 'Home',

  components: {},
  props: [''],
  data() {
    return {

    }
  },

  computed: {
    bgImg() {
      return bgImg
    }
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {}

}

</script>
<style lang='scss' scoped>
.home {
  height: 100%;
  .bg {
    vertical-align: bottom;
    object-fit: cover;
    width: 100%;
    height: 100%;
    filter: blur(5px);
  }
  .welcome {
    text-align: center;
    position: absolute;
    transform: translateX(-50%);
    top: 200px;
    left: 50%;
    p {
      font-size: 40px;
      color: #fff;
      margin-bottom: 20px;
    }
  }
}

</style>
