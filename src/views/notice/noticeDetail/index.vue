<template>
  <div class="notice-detail">
    <el-scrollbar :style="{height: '100%'}">
      <div class="notice-detail-header">
        <el-button v-desktop type="text" class="back" @click="() => {$router.push('/notice/notice-list')}">{{ '< 返回' }}</el-button>
        <h1 class="title">{{ notice.noticeTitle }}</h1>
        <div class="message flex justify-center">
          <div class="key">
            <label>关键字：</label>
            <el-tag v-for="key in keyList" :key="key" size="mini">{{ key }}</el-tag>
          </div>
          <div class="date">
            <!-- <label>日期：</label> -->
            <span>{{ getDate() }}</span>
          </div>
        </div>
      </div>
      <div class="notice-detail-main">
        <div v-html="notice.noticeContent" />
      </div>
      <div class="notice-detail-footer flex">
        <download-box v-for="file in fileList" :key="file.name + file.size + new Date().getTime()" :file="file" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import DownloadBox from './../components/DownloadBox'
import { mapGetters } from 'vuex'
export default {
  name: 'NoticeDetail',

  components: { DownloadBox },

  props: [''],

  data() {
    return {
      keyList: []
    }
  },

  computed: {
    ...mapGetters(['notice']),
    fileList() {
      // eslint-disable-next-line
      let list = []
      const names = this.notice.noticeAttachmentName.split(',')
      const sizes = this.notice.noticeAttachmentSize.split(',')
      names.forEach((name, index) => {
        const obj = {
          name,
          size: sizes[index],
          id: this.notice.id
        }
        list.push(obj)
      })
      return list
    }
  },

  watch: {},

  created() {
    // console.log(this.fileList)
    this.keyList = this.getKeyList()
  },

  beforeMount() {},

  mounted() {},

  methods: {
    getKeyList() {
      return this.notice.noticeKeywords.split(',')
    },
    getDate() {
      return this.notice.noticePostTime.split(' ')[0]
    }
  }
}

</script>
<style lang='scss' scoped>
.notice-detail {
  padding: 20px 10% 0;
  &-header {
    position: relative;
    .back {
      position: absolute;
      left: 0;
      top: 0;
    }
    padding-bottom: 30px;
    border-bottom: 1px solid #ccc;
    .title {
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      color: #333;
    }
    .message {
      color: #666;
      font-size: 16px;
      label {
        font-weight: normal;
      }
      .key {
        margin-right: 20px;
        .el-tag {
          margin-right: 3px;
        }
      }
    }
  }
  &-main {
    margin-top: 20px;
  }
  &-footer {
    margin-top: 20px;
    .download-box {
      flex-grow: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
@media screen and(max-width: 991px){
  .notice-detail {
    padding: 20px 10px 0 10px;
  }
}
</style>
