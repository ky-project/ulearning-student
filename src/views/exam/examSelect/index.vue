<template>
  <div class="exam-select">
    <div class="exam-select-bg">
      <img src="@/assets/images/showcase.png" alt="">
    </div>
    <el-form ref="form" class="exam-select-form" :rules="rules" :model="ruleForm" hide-required-asterisk>
      <el-form-item prop="teachingTaskId">
        <el-select
          v-model="ruleForm.teachingTaskId"
          placeholder="教学任务"
          style="width: 300px;"
          class="filter-item"
          @change="changeHandler"
        >
          <el-option
            v-for="item in teachingTask"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="id">
        <el-select
          v-model="ruleForm.id"
          placeholder="测试任务"
          style="width: 300px;"
          class="filter-item"
        >
          <el-option
            v-for="item in examList"
            :key="item.key"
            :label="item.label"
            :value="item.key"
            :disabled="item.condition === 2"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :style="{width: '100%'}" @click="clickHandler('form')">开始测试</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { axiosGet } from '@/utils/axios'
// import { stateMap } from './../config.js'
import {
  GET_SELECTED_COURSE_ARRAY_URL,
  GET_EXAMLIST_URL
} from '@/api/url'
export default {
  name: 'ExamSelect',

  components: {},
  props: [''],
  data() {
    return {
      ruleForm: {
        id: '',
        teachingTaskId: ''
      },
      examList: [],
      teachingTask: [],
      examListMap: {},
      rules: {
        teachingTaskId: [
          { required: true, message: '请选择教学任务', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请选择测试任务', trigger: 'change' }
        ]
      }
      // stateMap: stateMap
    }
  },

  computed: {},

  watch: {},

  created() {
    this.getTaskArray()
      .then(response => {
        this.teachingTask = response.data
      })
  },

  beforeMount() {},

  mounted() {},

  methods: {
    clickHandler(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$router.push('/exam/exam-mission?id=' + this.ruleForm.id)
        }
      })
    },
    changeHandler(teachingTaskId) {
      // 0. 清空
      this.examList = []
      this.ruleForm.id = ''
      // 1. 尝试根据id直接获取
      if (this.examListMap[teachingTaskId]) {
        // 2. 成功，替换
        this.examList = [...this.examListMap[teachingTaskId]]
        if (this.examList.length) {
          this.ruleForm.id = this.examList[0].key
        }
      } else {
        // 3. 失败，请求
        this.getExamList({ teachingTaskId })
          .then(response => {
            this.examList = response.data.filter(item => {
              if (item.condition === 2 || item.condition === 3) {
                if (item.condition === 2) {
                  item.label += '[未开始]'
                }
                return true
              }
              return false
            })

            if (this.examList.length) {
              this.ruleForm.id = this.examList[0].key
            }
            this.examListMap[teachingTaskId] = this.examList
          })
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
            this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 根据教学任务id查询测试任务数组
    getExamList(data) {
      return new Promise((resolve, reject) => {
        axiosGet(GET_EXAMLIST_URL, { params: data })
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
.exam-select {
  height: 100%;
  position: relative;
  &-bg {
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: bottom;
    }
    /* position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: calc(100vh - 50px);
    filter: blur(5px);
    z-index: -1;
    img {
      height: 100%;
    } */
  }
  &-form {
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
