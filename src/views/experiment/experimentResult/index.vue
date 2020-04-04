<template>
  <div v-loading="loading" class="experiment-result">
    <div v-desktop class="experiment-result-header">
      <desktop-header>
        <template v-slot:left>
          <el-button type="text" @click="back">{{ '< 返回' }}</el-button>
        </template>
        <template v-slot:center>
          {{ experimentResult.experimentTitle }}
        </template>
      </desktop-header>
    </div>
    <div v-desktop class="experiment-result-container">
      <card class="content" width="100%" title="实验内容" :min-body-height="'280px'">
        <template v-slot:btn>
          <span>姓名：{{ experimentResult.stuName }}</span>
        </template>
        <template v-slot:body>
          <div v-html="experimentResult.experimentResult" />
        </template>
      </card>
      <card class="evaluation" width="100%" title="教师反馈" :min-body-height="'200px'">
        <template v-slot:body>
          <div v-html="experimentResult.experimentAdvice" />
        </template>
      </card>
      <card class="result" title="综合评价" width="250px" :min-body-height="'280px'">
        <template v-slot:body>
          <div class="grade">
            <GradeProgress
              :percentage="experimentResult.experimentScore ? experimentResult.experimentScore : 0"
              :score="experimentResult.experimentScore ? experimentResult.experimentScore : 0"
            />
          </div>
          <div class="line">
            <label>成绩排名：</label>
            <span>第 {{ experimentResult.ranking }} 名</span>
          </div>
          <div class="line">
            <label>提交人数：</label>
            <span>{{ experimentResult.submitNumber }} 人</span>
          </div>
          <div class="line">
            <label>满分：</label>
            <span>100 分</span>
          </div>
        </template>
      </card>
      <card class="excellent" title="优秀作品" width="250px" :min-body-height="'200px'">
        <template v-slot:btn>
          <el-switch
            :value="seeSelf"
            active-text="只看自己"
            @change="changeSeeSelf"
          />
        </template>
        <template v-slot:body>
          <div class="excellent-title">
            <span class="excellent-title__name">姓名</span>
            <span class="excellent-title__grade">成绩</span>
          </div>
          <div class="excellent-list">
            <el-scrollbar :style="{height:'100%'}">
              <!-- { stuName: '张三', experimentScore: '93', stuId: '1' }, -->
              <excellent-item
                v-for="item in excellentList"
                :key="item.stuId"
                :name="item.stuName"
                :grade="item.experimentScore"
                @click="() => loadExcellentExperiment(item.id)"
              />
            </el-scrollbar>
          </div>
        </template>
      </card>
    </div>
    <div v-mobile class="experiment-result-container mobile">
      <card class="result" title="综合评价" :min-body-height="'280px'">
        <template v-slot:btn>
          <span>姓名：{{ experimentResult.stuName }}</span>
        </template>
        <template v-slot:body>
          <div class="grade">
            <GradeProgress
              :percentage="experimentResult.experimentScore ? experimentResult.experimentScore : 0"
              :score="experimentResult.experimentScore ? experimentResult.experimentScore : 0"
            />
          </div>
          <div class="line">
            <label>成绩排名：</label>
            <span>第 {{ experimentResult.ranking }} 名</span>
          </div>
          <div class="line">
            <label>提交人数：</label>
            <span>{{ experimentResult.submitNumber }} 人</span>
          </div>
          <div class="line">
            <label>满分：</label>
            <span>100 分</span>
          </div>
        </template>
      </card>
      <card class="content" width="100%" title="实验内容" :min-body-height="'280px'">
        <template v-slot:body>
          <div v-html="experimentResult.experimentResult" />
        </template>
      </card>
      <card class="evaluation" width="100%" title="教师反馈" :min-body-height="'200px'">
        <template v-slot:body>
          <div v-html="experimentResult.experimentAdvice" />
        </template>
      </card>
      <card class="excellent" title="优秀作品" width="100%" :min-body-height="'200px'">
        <template v-slot:btn>
          <el-switch
            :value="seeSelf"
            active-text="只看自己"
            @change="changeSeeSelf"
          />
        </template>
        <template v-slot:body>
          <div class="excellent-title">
            <span class="excellent-title__name">姓名</span>
            <span class="excellent-title__grade">成绩</span>
          </div>
          <div class="excellent-list">
            <el-scrollbar :style="{height:'100%'}">
              <!-- { stuName: '张三', experimentScore: '93', stuId: '1' }, -->
              <excellent-item
                v-for="item in excellentList"
                :key="item.stuId"
                :name="item.stuName"
                :grade="item.experimentScore"
                @click="() => loadExcellentExperiment(item.id)"
              />
            </el-scrollbar>
          </div>
        </template>
      </card>
    </div>
  </div>
</template>

<script>
import ExcellentItem from '@/views/experiment/components/ExcellentItem'
import {
  GET_EXPERIMENT_RESULT,
  GET_EXCELLENT_EXPERIMENT_RESULT_LIST,
  GET_EXCELLENT_EXPERIMENT_RESULT
} from '@/api/url.js'
import { axiosGet } from '@/utils/axios'
import DesktopHeader from '@/components/DesktopHeader'
import GradeProgress from './../components/GradeProgress'
import Card from '@/components/Card'
export default {
  name: 'ExperimentResult',

  components: { DesktopHeader, Card, GradeProgress, ExcellentItem },
  props: [''],
  data() {
    return {
      loading: false,
      experimentResult: '',
      excellentList: [],
      seeSelf: true
    }
  },

  computed: {},

  watch: {},

  created() {
    this.getExcellentList()
    this.getExperimentResult()
  },

  beforeMount() {},

  mounted() {},

  methods: {
    back() {
      this.$router.push('/experiment/experiment-list')
    },
    changeSeeSelf(newValue) {
      if (!this.seeSelf && newValue) {
        this.getExperimentResult()
          .then(() => {
            this.seeSelf = true
          })
      }
    },
    loadExcellentExperiment(id) {
      console.log('hello')
      this.getExcellentById(id)
        .then(() => {
          if (this.seeSelf) {
            this.seeSelf = false
          }
        })
    },
    getExcellentById(id) {
      // GET_EXCELLENT_EXPERIMENT_RESULT
      console.log('id', id)
      return new Promise((resolve, reject) => {
        this.loading = true
        axiosGet(GET_EXCELLENT_EXPERIMENT_RESULT, { params: { id }})
          .then(response => {
            this.loading = false
            this.experimentResult = response.data
            resolve(response)
          })
          .catch(error => {
            this.loading = false
            this.$message.error(error.message || '出错')
          })
      })
    },
    getExcellentList() {
      // GET_EXCELLENT_EXPERIMENT_RESULT_LIST
      const experimentId = this.$route.query.experimentId
      return new Promise((resolve, reject) => {
        this.loading = true
        axiosGet(GET_EXCELLENT_EXPERIMENT_RESULT_LIST, { params: { experimentId }})
          .then(response => {
            this.loading = false
            this.excellentList = response.data
            resolve(response)
          })
          .catch(error => {
            this.loading = false
            this.$message.error(error.message || '出错')
          })
      })
      /* this.excellentList = [
        { stuName: '张三', experimentScore: 93, stuId: '1' },
        { stuName: '张三', experimentScore: 93, stuId: '2' },
        { stuName: '张三', experimentScore: 93, stuId: '3' },
        { stuName: '张三', experimentScore: 93, stuId: '4' },
        { stuName: '张三', experimentScore: 93, stuId: '5' },
        { stuName: '张三', experimentScore: 93, stuId: '6' },
        { stuName: '张三', experimentScore: 93, stuId: '7' },
        { stuName: '张三', experimentScore: 93, stuId: '8' }
      ] */
    },
    getExperimentResult() {
      const experimentId = this.$route.query.experimentId
      return new Promise((resolve, reject) => {
        this.loading = true
        axiosGet(GET_EXPERIMENT_RESULT, { params: { experimentId }})
          .then(response => {
            this.loading = false
            this.experimentResult = response.data
            resolve(response)
          })
          .catch(error => {
            this.loading = false
            this.$message.error(error.message || '出错')
          })
      })
    }
  }
}

</script>
<style lang='scss' scoped>
.experiment-result {
  background-color: #eee;
  height: calc(100vh - 50px);
  &-header {
    background-color: #fff;
    padding-bottom: 20px;
  }
  &-container {
    padding: 20px 290px 0 20px;
    position: relative;
    background-color: #eee;
    .result {
      position: absolute;
      right: 20px;
      top: 20px;
      .grade {
        width: 100%;
        text-align: center;
      }
      .line {
        line-height: 32px;
        label {
          font-weight: normal;
        }
      }
    }
    .excellent {
      position: absolute;
      right: 20px;
      top: 370px;
      &-title {
        position: absolute;
        top: -10px;
        left: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding: 0 30px 0 40px;
        color: #666;
      }
      &-list {
        height: 160px;
        .excellent-item {
          &:last-child {
            &::v-deep .excellent-item__name {
              &::after {
                height: 0;
              }
            }
          }
        }
        .el-scrollbar {
          &::v-deep .el-scrollbar__wrap {
            overflow-x: hidden;
            overflow-y: scroll;
          }
        }
      }
    }
    &.mobile {
      padding: 20px 0;
      .result, .excellent {
        width: 100% !important;
        position: static;
        right: 0;
        top: 0;
        text-align: center;
      }
    }
  }
}
</style>
