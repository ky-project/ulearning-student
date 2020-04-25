<template>
  <div class="app-container select-course">
    <!-- 查询 -->
    <div class="filter-container">
      <div v-desktop>
        <el-select
          v-model="listQuery.teachingTaskId"
          placeholder="教学任务"
          style="width: 200px;"
          size="small"
          class="filter-item"
          @change="handleFilter"
        >
          <el-option
            v-for="item in teachingTask"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-date-picker
          v-model="listQuery.submitTime"
          type="date"
          placeholder="提交时间"
          format="yyyy-MM-dd"
          size="small"
          value-format="yyyy-MM-dd"
          class="filter-item"
          @change="handleFilter"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          size="small"
          round
          icon="el-icon-search"
          @click="handleFilter"
        >
          查询
        </el-button>
      </div>
      <div v-mobile class="mobile-top flex">
        <el-select
          v-model="listQuery.teachingTaskId"
          placeholder="教学任务"
          style="width: 120px;"
          class="filter-item grow"
          size="mini"
          @change="handleFilter"
        >
          <el-option
            v-for="item in teachingTask"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-date-picker
          v-model="listQuery.submitTime"
          type="date"
          placeholder="提交时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          class="filter-item"
          style="width: 140px;"
          size="mini"
          @change="handleFilter"
        />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          round
          @click="handleFilter"
        >
          查询
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      size="small"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="50"
        :index="indexMethod"
      />
      <el-table-column label="测试任务名称" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.examinationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成绩" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.stuTotalScore }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总分" align="center" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.totalScore }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排名" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.ranking + '/' + row.submitNumber }}</span>
        </template>
      </el-table-column>
      <!-- examiningStateSwitchTime -->
      <el-table-column label="提交时间" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.examiningStateSwitchTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="80"
        class-name="small-padding fixed-width"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="primary"
            round
            :class="[{disabled: !row.examinationShowResult}]"
            @click="examDetail(row)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div v-desktop>
      <pagination
        v-show="total>0"
        :total="total"
        :page-sizes="[8, 16, 32, 64]"
        :page.sync="listQuery.currentPage"
        :limit.sync="listQuery.pageSize"
        class="fr"
        @pagination="setPagination"
      />
    </div>

  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import MobileTop from '@/components/MobileTop'
import { GET_SELECTED_COURSE_ARRAY_URL } from '@/api/url'
import { axiosGet, axiosPost } from '@/utils/axios'
import { getViewportOffset } from '@/utils/index'
import {
  GET_EXAM_PAGE_URL
} from '@/api/url'

export default {
  name: 'SelectCourse',
  components: { Pagination, MobileTop },
  directives: { waves },
  data() {
    return {
      total: 0,
      listLoading: false,
      tableKey: 0,
      list: null, // 表格数据
      state: 0, // 0-未选, 1-已选
      teachingTask: '',
      listQuery: {
        currentPage: 1,
        pageSize: this.$store.getters.device === 'mobile' ? 1000 : 8,
        submitTime: '',
        teachingTaskId: ''
      }
    }
  },
  computed: {

    /* isMobile() {
      return this.$store.getters.device === 'mobile'
    },
    tableHeight() {
      const height = getViewportOffset().h
      if (this.isMobile) {
        return height - 182
      } else {
        return ''
      }
    } */
  },
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
  methods: {
    ...mapMutations({
      'resetExamDetail': 'examDetail/RESET_EXAM_DETAIL',
      'setExamDetail': 'examDetail/SET_EXAM_DETAIL'
    }),
    initial() {
      // 4. 设置答案
      this.setQuestionAnswerDtoList(this.examDetail.courseQuestion)
      // 7. 初始化题卡
      if (this.cardData.length) {
        this.activeName = this.cardData[0].name
        this.questionId = this.cardData[0].items[0].id
        this.questionType = this.activeName
      }
    },
    // 获取教学任务数组
    getTaskArray() {
      return new Promise((resolve, reject) => {
        axiosGet(GET_SELECTED_COURSE_ARRAY_URL)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            // this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    examDetail(row) {
      if (row.examinationShowResult) {
        // 1. 清空
        this.resetExamDetail()
        // 2. 设置
        this.setExamDetail(row)
        // 3. 跳转
        this.$router.push('/exam/exam-detail')
      }
    },
    /* selectCourse(id) {
      axiosPost(SELECT_COURSE, { teachingTaskId: id })
        .then(response => {
          this.$message.success('选课成功')
          this.getList()
        })
        .catch(error => {
          // this.$message.error(error.message || '出错')
        })
    },
    unselectCourse(id) {
      axiosPost(UNSELECT_COURSE, { teachingTaskId: id })
        .then(response => {
          this.$message.success('退选成功')
          this.getList()
        })
        .catch(error => {
          // this.$message.error(error.message || '出错')
        })
    }, */
    handleChange() {
      this.state = this.state === 0 ? 1 : 0
      this.resetListQuery()
      this.getList()
    },
    resetListQuery() {
      this.listQuery.teachingTaskAlias = ''
    },
    getList() {
      this.listLoading = true
      axiosGet(GET_EXAM_PAGE_URL, { params: this.listQuery })
        .then(response => {
          const { content, total } = response.data
          this.list = content
          this.total = total
          this.listLoading = false
        })
    },
    setPagination(currentPage, pageSize) {
      this.getList()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    indexMethod(index) {
      return (index + 1) + (this.listQuery.currentPage - 1) * this.listQuery.pageSize
    }
  }
}
</script>
<style lang="scss" scoped>
  .filter-container {
    padding-bottom: 10px;

    .filter-item {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 10px;
    }

    .btn {
      padding: 0 5px;
      margin-left: 5px;
      line-height: 30px;
    }
  }

  .el-table {
    .icon--detail {
      color: #67C23A;
      font-size: 20px;
      cursor: pointer;

      &.disabled {
        color: #ccc;
      }
    }
  }
</style>
<style lang="scss">
  .app-container {
    .el-dialog__body {
      padding-bottom: 0;
    }

    .el-select {
      width: 100%;
    }
  }
</style>
<style lang="scss" scoped>
  @media screen and (max-width: '992px') {
    .filter-container {
      .filter-item {
        margin-bottom: 0;
        margin-right: 5px;
      }

      .mobile-top {
        padding: 10px;
        background-color: #eee;
      }
    }
  }
</style>
