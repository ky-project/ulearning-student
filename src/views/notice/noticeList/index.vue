<template>
  <div class="app-container notice-list">
    <!-- 查询 -->
    <div class="filter-container">
      <div v-desktop>
        <el-select
          v-model="listQuery.teachingTaskId"
          placeholder="教学任务"
          style="width: 200px;"
          class="filter-item"
          :style="{marginTop: '5px'}"
        >
          <el-option
            v-for="item in teachingTask"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-date-picker
          v-model="listQuery.noticePostTime"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        />
        <el-button
          v-waves
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          查询
        </el-button>
      </div>
      <!-- <MobileTop v-model="listQuery.teachingTaskAlias" v-mobile placeholder="请输入教学别称" @search="getList">
        <el-button class="btn" type="primary" @click="handleChange">
          <svg-icon icon-class="qiehuan" />
          {{ !state ? '已选' : '选课' }}
        </el-button>
      </MobileTop> -->
    </div>
    <!-- 列表 -->
    <div class="notice-list-main">
      <el-scrollbar :style="{height: '100%'}">
        <ul v-if="list.length" class="notice-list-main-list">
          <li
            v-for="item in list"
            :key="item.id"
            class="notice-list-main-item flex justify-between"
            @click="itemClick(item)"
          >
            <h4>{{ item.noticeTitle }}</h4>
            <span>{{ item.noticePostTime }}</span>
          </li>
        </ul>
        <div v-else class="notice-list-main-empty">暂无通告</div>
        <!-- 分页器 -->
        <div v-desktop>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.currentPage"
            :limit.sync="listQuery.pageSize"
            class="fr"
            @pagination="setPagination"
          />
        </div>
      </el-scrollbar>
    </div>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import {
  GET_SELECTED_COURSE_ARRAY_URL, // 查询所有已选教学任务数组
  GET_NOTICE_PAGE_URL
} from '@/api/url'
import { axiosGet } from '@/utils/axios'
export default {
  name: 'NoticeList',

  components: { Pagination },
  directives: { waves },
  props: [''],
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      tableKey: 0,
      teachingTask: [],
      listQuery: {
        currentPage: 1,
        pageSize: this.$store.getters.device === 'mobile' ? 1000 : 5,
        teachingTaskId: '',
        noticePostTime: ''
      }
    }
  },
  computed: {},

  watch: {},
  created() {
    this.getTaskArray()
      .then(response => {
        this.teachingTask = response.data
        if (this.teachingTask.length) {
          this.listQuery.teachingTaskId = this.teachingTask[0].key
          this.getList()
        }
      })
  },
  beforeMount() {},

  mounted() {},

  methods: {
    ...mapMutations({
      'resetNotice': 'notice/RESET_NOTICE',
      'setNotice': 'notice/SET_NOTICE'
    }),
    itemClick(item) {
      // 1. 清空
      this.resetNotice()
      // 2. 设置
      this.setNotice(item)
      // 3. 跳转
      this.$router.push('/notice/notice-detail')
    },
    setPagination(currentPage, pageSize) {
      this.getList()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      axiosGet(GET_NOTICE_PAGE_URL, { params: this.listQuery })
        .then(response => {
          console.log(response.data)
          const { content, total } = response.data
          this.list = content
          this.total = total
          this.listLoading = false
        })
        .catch(error => {
          this.$message.error(error.message || '出错')
        })
    },
    // 获取教学任务数组
    getTaskArray() {
      return new Promise((resolve, reject) => {
        axiosGet(GET_SELECTED_COURSE_ARRAY_URL)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    }
  }

}

</script>
<style lang='scss' scoped>
.notice-list {
  padding: 20px 10% 0;
  .filter-container {
    padding-bottom: 10px;
    .filter-item {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 10px;
    }
  }
  &-main {
    height: calc(100vh - 110px);
    &-empty {
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #666;
      font-size: 16px;
    }
    /* &-list {
      border: 1px solid #eee;
      border-radius: 5px;
    } */
    &-item {
      line-height: 40px;
      border-bottom: 1px solid #ccc;
      /* &:last-child {
        border-bottom: none;
      } */
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      h4 {
        position: relative;
        color: #666;
        padding-left: 20px;
        font-size: 16px;
        &::before {
          content: '';
          display: block;
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: red;
        }
      }
      span {
        font-size: 14px;
        margin-right: 20px;
        color: #666;
      }
    }
  }
}
</style>
