<template>
  <div class="app-container select-course">
    <!-- 查询 -->
    <div class="filter-container">
      <div v-desktop>
        <el-select
          v-model="listQuery.teachingTaskId"
          placeholder="教学任务"
          style="width: 200px;"
          class="filter-item"
        >
          <el-option
            v-for="item in teachingTask"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-select
          v-model="listQuery.experimentState"
          placeholder="状态"
          style="width: 200px;"
          class="filter-item"
        >
          <el-option
            v-for="item in stateMap"
            :key="item.key"
            :label="item.label"
            :value="item.key"
            style="width: 200px;"
          />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
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
          style="width: 180px;"
          class="filter-item grow"
          size="mini"
        >
          <el-option
            v-for="item in teachingTask"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <el-select
          v-model="listQuery.experimentState"
          placeholder="状态"
          style="width: 80px;"
          class="filter-item"
          size="mini"
        >
          <el-option
            v-for="item in stateMap"
            :key="item.key"
            :label="item.label"
            :value="item.key"
            style="width: 200px;"
          />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleFilter"
        >
          查询
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
    <!-- <div class="select-course-table-wrapper" /> -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      :height="tableHeight"
      style="width: 100%;"
    >
      <el-table-column label="序号" align="center" width="80" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ '实验' + row.experimentOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="100" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.experimentTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="教学任务别称" min-width="120" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.teachingTaskAlias }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ getState(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="80"
        class-name="small-padding fixed-width"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <svg-icon
            v-if="row.experimentStatus === 0"
            icon-class="zuoti"
            class="icon-zuoti"
            @click="doExperiment(row)"
          />
          <svg-icon
            v-if="row.experimentStatus >= 1"
            icon-class="chakan"
            class="icon-chakan"
            @click="checkExperiment(row)"
          />
          <svg-icon
            v-if="row.experimentStatus === 2"
            icon-class="fankui"
            class="icon-fankui"
            @click="experimentResult(row)"
          />
        </template>
      </el-table-column>
    </el-table>
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

  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { axiosGet } from '@/utils/axios'
import { getViewportOffset } from '@/utils/index'
import {
  GET_SELECTED_COURSE_ARRAY_URL,
  GET_EXPERIMENT_PAGE_URL
} from '@/api/url'

export default {
  name: 'ExperimentList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      total: 0,
      listLoading: false,
      tableKey: 0,
      list: null, // 表格数据
      stateMap: [
        { key: '', label: '全部' },
        { key: 0, label: '未做' },
        { key: 1, label: '已提交' },
        { key: 2, label: '已批改' }
      ],
      device: this.$store.getters.device,
      queryValue: '', // 手机端查找关键词
      teachingTask: [],
      listQuery: {
        currentPage: 1,
        pageSize: this.$store.getters.device === 'mobile' ? 1000 : 5,
        teachingTaskId: '',
        experimentStatus: '' // 0-未做, 1-已提交, 2-已批改
      }
    }
  },
  computed: {
    ...mapGetters(['experiment']),
    isMobile() {
      return this.$store.getters.device === 'mobile'
    },
    tableHeight() {
      const height = getViewportOffset().h
      if (this.isMobile) {
        return height - 182
      } else {
        return ''
      }
    }
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
      'setExperiment': 'experiment/SET_EXPERIMENT',
      'resetExperiment': 'experiment/RESET_EXPERIMENT',
      'resetExperimentResult': 'experiment/RESET_EXPERIMENT_RESULT',
      'setExperimentResult': 'experiment/SET_EXPERIEMNT_RESULT',
      'setMode': 'experiment/SET_MODE'
    }),
    ...mapActions({
      'getExperimentResult': 'experiment/getExperimentResult'
    }),
    // 反馈
    experimentResult(row) {
      // 获取实验id
      console.log(row.id)
      this.$router.push('/experiment/experiment-result?experimentId=' + row.id)
    },
    // 手机端查找事件
    searchHandler() {
      // 1. 清空条件
      this.listQuery.teachingTaskId = ''
      this.listQuery.experimentStatus = ''
      // 2. 判断是否是状态
      const result = this.stateMap.filter(item => item.label === this.queryValue)
      if (result !== -1) {
        this.listQuery.experimentStatus = result[0].key
      } else {
        this.listQuery.teachingTaskId
      }
    },
    // 获取状态
    getState(row) {
      return this.stateMap.filter(item => item.key === row.experimentStatus)[0].label
    },
    // 查看实验
    checkExperiment(row) {
      console.log('实验id', row.id)
      // 1. 清空
      this.resetExperiment()
      this.resetExperimentResult()
      // 2. 设置
      this.setExperiment(row)
      this.setMode('check')
      this.getExperimentResult(row.id)
      // 3. 跳转
      this.$router.push('/experiment/experiment-content')
    },
    // 做实验
    doExperiment(row) {
      // 1. 清空
      this.resetExperiment()
      this.resetExperimentResult()
      // 2. 设置
      this.setExperiment(row)
      this.setExperimentResult({ experimentId: row.id })
      this.setMode('do')
      // 3. 跳转
      this.$router.push('/experiment/experiment-content')
    },
    // 分页查询实验
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        axiosGet(GET_EXPERIMENT_PAGE_URL, { params: this.listQuery })
          .then(response => {
            this.listLoading = false
            const { content, total } = response.data
            this.list = content
            this.total = total
            resolve(response)
          })
          .catch(error => {
            this.$message.error(error.message || '出错')
            this.listLoading = false
            reject(error)
          })
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
    },
    setPagination(currentPage, pageSize) {
      this.getList()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
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
  .icon-zuoti {
    color: #67C23A;
    font-size: 20px;
    cursor: pointer;
  }
  .icon-chakan {
    color: #409EFF;
    font-size: 20px;
    cursor: pointer;
  }
  .icon-fankui {
    color: #E6A23C;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: '992px'){
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
