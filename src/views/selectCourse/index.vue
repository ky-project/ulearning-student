<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.teachingTaskAlias"
        placeholder="教学任务别称"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item fr"
        type="primary"
        @click="handleChange"
      >
        {{ !state ? '已选' : '选课' }}
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="教学任务别称" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.teachingTaskAlias }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开课学期" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.term }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任课老师" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher.teaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学分" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.course.courseCredit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="70" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            :style="{color: '#409EFF'}"
            size="mini"
            type="text"
          >
            <span
              v-if="!state"
              :style="{color:'#409EFF'}"
              @click="selectCourse(row.id)"
            >选课</span>
            <span
              v-else
              :style="{color:'#F56C6C'}"
              @click="unselectCourse(row.id)"
            >退选</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      class="fr"
      @pagination="setPagination"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { axiosGet, axiosPost } from '@/utils/axios'
import {
  GET_SELECTED_COURSE_LIST,
  GET_UNSELECTED_COURSE_LIST,
  SELECT_COURSE,
  UNSELECT_COURSE
} from '@/api/url'

export default {
  name: 'SelectCourse',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      /* total: 0,
      listLoading: true,*/
      tableKey: 0,
      list: null, // 表格数据
      state: 0, // 0-未选, 1-已选
      listQuery: {
        currentPage: 1,
        pageSize: 5,
        teachingTaskAlias: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /* updatePage(val) {
      this.listQuery.currentPage = val
    },
    updateLimit(val) {
      this.listQuery.pageSize = val
    },*/
    selectCourse(id) {
      axiosPost(SELECT_COURSE, { teachingTaskId: id })
        .then(response => {
          this.$message.success('选课成功')
          this.getList()
        })
        .catch(error => {
          this.$message.error(error.message || '出错')
        })
    },
    unselectCourse(id) {
      axiosPost(UNSELECT_COURSE, { teachingTaskId: id })
        .then(response => {
          this.$message.success('退选成功')
          this.getList()
        })
        .catch(error => {
          this.$message.error(error.message || '出错')
        })
    },
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
      const url = !this.state ? GET_UNSELECTED_COURSE_LIST : GET_SELECTED_COURSE_LIST
      axiosGet(url, { params: this.listQuery })
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
    }
    /* resetTemp() {
      this.temp = {
        'id': '',
        'stuDept': '', // 系部
        'stuEmail': '', // 邮箱
        'stuGender': '', // 性别
        'stuName': '', // 姓名
        'stuNumber': '', // 学号
        'stuPhone': '' // 电话
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log('添加数据')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 1. 添加学生
          addStudent(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '学生添加成功'
              })
              this.getList()
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('校验成功')
          // 1. 发送请求
          updateStudent(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '学生信息更新成功'
              })
              this.getList()
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定永久删除该学生, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        deleteStudent({ id: row.id })
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      })
    } */
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
