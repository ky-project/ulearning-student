<template>
  <div class="navbar">
    <hamburger
      v-desktop
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb v-desktop class="breadcrumb-container" />
    <!-- 手机端适配开始 -->
    <div v-if="$route.path === '/home'" v-mobile class="logo">
      <img src="@/assets/images/logo.png" alt="">
      <!-- <span>范在学习</span> -->
    </div>
    <div v-else v-mobile class="back" @click="() => {$router.back(-1)}">
      <i class="el-icon-back" />
      <span>返回</span>
    </div>
    <div v-mobile class="page-title">
      {{ $route.meta ? $route.meta.title : '页面' }}
    </div>
    <!-- 手机端适配结束 -->
    <div class="right-menu">
      <div class="gonggao">
        <svg-icon icon-class="tongzhi" class="icon" @click="$router.push('/notice/notice-list')" />
      </div>
      <div class="avatar" @click.stop="uploadHeadImg">
        <img :src="userInfo.stuPhoto ? userInfo.stuPhoto : stuPhoto" alt="">
      </div>
      <input type="file" accept="image/*" class="hiddenInput" @change="handleFile">
      <el-dropdown trigger="click" class="dropdown">
        <span class="el-dropdown-link">
          <i class="el-icon-caret-bottom" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/personal">
            <el-dropdown-item>
              个人信息
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">
              <svg-icon icon-class="tuichu" />
              退出
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- <span>{{ userInfo }}</span> -->
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import SvgIcon from '@/components/SvgIcon'
import defaultAvatar from '@/assets/images/user.gif'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    SvgIcon
  },
  data() {
    return {
      stuPhoto: defaultAvatar
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo',
      'device'
    ])
  },
  watch: {
    '$route'() {
      // console.log(this.$route)
      return this.$route
    }
  },
  methods: {
    ...mapActions({
      'uploadAvatar': 'user/uploadAvatar'
    }),
    // 打开图片上传
    uploadHeadImg: function() {
      this.$el.querySelector('.hiddenInput').click()
    },
    // 将头像显示
    handleFile: function(e) {
      const $target = e.target || e.srcElement
      const file = $target.files[0]
      // 上传头像
      const params = new FormData()
      params.append('photo', file, file.name)
      this.uploadAvatar(params)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    &:focus {
      outline: none;
    }
    .gonggao {
      margin-right: 20px;
      margin-top: 3px;
      .icon {
        font-size: 24px;
        cursor: pointer;
        &:hover {
          color: #409EFF
        }
      }
    }
    .hiddenInput {
      display: none;
    }
    .avatar {
      margin-top: 5px;
      margin-right: 5px;
      cursor: pointer;
      img {
        width: 40px;
        height: 40px;
        border-radius: 5px;
      }
    }
    .dropdown {
      margin-right: 20px;
      .el-dropdown-link {
        cursor: pointer
      }
    }
  }

}
</style>
<style lang="scss" scoped>
// 响应式布局开始
@media screen and(max-width: 992px){
  .navbar {
    position: relative;
    .logo {
      float: left;
      line-height: 50px;
      margin-left: 20px;
      img {
        width: 30px;
        height: 30px;
        color: #ccc;
        vertical-align: middle;
      }
      span {
        font-size: 14px;
      }
    }
    .back {
      float: left;
      line-height: 50px;
      margin-left: 20px;
      color: #666;
      i {
        font-size: 20px;
      }
    }
    .page-title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
    }
    .right-menu {
      .avatar {
        margin-top: 10px;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
