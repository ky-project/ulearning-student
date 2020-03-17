<template>
  <div v-loading="loading" class="experiment-result">
    <div class="experiment-result-header">
      <desktop-header>
        <template v-slot:left>
          <el-button type="text" @click="back">{{ '< 返回' }}</el-button>
        </template>
        <template v-slot:center>
          xxx实验
        </template>
      </desktop-header>
    </div>
    <div class="experiment-result-container">
      <card class="content" width="100%" title="实验内容" :min-body-height="'280px'">
        <template v-slot:body>
          <div v-html="experimentResult.experimentResult" />
        </template>
      </card>
      <card class="evaluation" width="100%" title="教师反馈" :min-body-height="'120px'">
        <template v-slot:body>
          <div v-html="experimentResult.experimentAdvice" />
        </template>
      </card>
      <card class="result" title="综合评价" width="250px" :min-body-height="'280px'">
        <template v-slot:body>
          <div class="grade">
            <GradeProgress :percentage="experimentResult.experimentScore" />
          </div>
          <div class="line">
            <label>成绩排名：</label>
            <span>第 xxx 名</span>
          </div>
          <div class="line">
            <label>提交人数：</label>
            <span>xxx 人</span>
          </div>
          <div class="line">
            <label>满分：</label>
            <span>100 分</span>
          </div>
        </template>
      </card>
    </div>
  </div>
</template>

<script>
import { GET_EXPERIMENT_RESULT } from '@/api/url.js'
import { axiosGet } from '@/utils/axios'
import DesktopHeader from '@/components/DesktopHeader'
import GradeProgress from './../components/GradeProgress'
import Card from '@/components/Card'
export default {
  name: 'ExperimentResult',

  components: { DesktopHeader, Card, GradeProgress },
  props: [''],
  data() {
    return {
      loading: false,
      experimentResult: ''
    }
  },

  computed: {},

  watch: {},

  created() {
    this.getExperimentResult()
  },

  beforeMount() {},

  mounted() {},

  methods: {
    back() {
      this.$router.push('/experiment/experiment-list')
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
  }
}
</style>
