<template>
  <div v-loading="loading" class="exam-mission">
    <div v-if="$store.getters.device === 'desktop'" class="flex">
      <div class="exam-mission-sidebar">
        <div class="question-card side-bottom">
          <header-tag text="题卡" />
          <question-card
            class="card"
            :data="cardData"
            :active-name.sync="activeName"
            :question-id="questionId"
            @update="selectQuestion"
          />
        </div>
      </div>
      <div class="top exam-mission-main">
        <el-scrollbar :style="{height: '100%'}">
          <div class="exam-mission-main-inner">
            <h3 class="header">{{ examinationTask.examinationName }}</h3>
            <h4 class="title">{{ questionSort + '、' + typeMap[questionType] }}</h4>
            <p class="question-title">
              {{ `${orderNumber}. ${currentQuestion.questionText}` }}
            </p>
            <div class="question-img">
              <img :src="currentQuestion.questionUrl" alt="">
            </div>
            <choice-question
              v-if="questionType !== '4'"
              :question-option="questionOption"
              :value="result"
              :multiple="questionType === '3'"
              :show-value="questionType !== '2'"
              @change="updateAnswer"
            />
            <completion-question v-else :answer-list="result" @change="updateAnswer" />
            <div v-desktop class="btns flex justify-end">
              <el-button @click="prev">上一题</el-button>
              <el-button type="primary" @click="next">下一题</el-button>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="exam-mission-sidebar">
        <div class="exam-message side-top">
          <div class="timer side-top">
            <header-tag text="剩余时间" />
            <time-meter :time="examiningRemainTime" :on="on" @end="submit" @now="restTime" />
          </div>
        </div>
        <div class="base-message side-middle">
          <header-tag text="基本信息" />
          <div class="line">
            <label>姓名：</label>
            <span>张三</span>
          </div>
          <div class="line">
            <label>性别：</label>
            <span>男</span>
          </div>
          <div class="line">
            <label>系别：</label>
            <span>机电系</span>
          </div>
        </div>
        <div class="operator side-bottom">
          <header-tag text="操作" />
          <el-button @click="save">保存</el-button><el-button type="primary" @click="submit">交卷</el-button>
        </div>
      </div>
    </div>
    <!-- 手机端 -->
    <div v-else>
      <div class="exam-mission-container">
        <div class="exam-mission-container__header">
          <h1>{{ examinationTask.examinationName }}</h1>
          <time-meter :time="examiningRemainTime" :on="on" @end="submit" @now="restTime" />
          <el-button type="text" size="mini" @click="submit">提交</el-button>
        </div>
        <div class="exam-mission-container__question">
          <el-scrollbar :style="{height: '100%'}">
            <h4 class="question-type">{{ questionSort + '、' + typeMap[questionType] }}</h4>
            <p class="question-title">
              {{ `${orderNumber}. ${currentQuestion.questionText}` }}
            </p>
            <div class="question-img">
              <img :src="currentQuestion.questionUrl" alt="">
            </div>
            <choice-question
              v-if="questionType !== '4'"
              :question-option="questionOption"
              :value="result"
              :multiple="questionType === '3'"
              :show-value="questionType !== '2'"
              @change="updateAnswer"
            />
            <completion-question v-else :answer-list="result" @change="updateAnswer" />
            <div v-desktop class="btns flex justify-end">
              <el-button @click="prev">上一题</el-button>
              <el-button type="primary" @click="next">下一题</el-button>
            </div>
          </el-scrollbar>
        </div>
        <div class="exam-mission-bottom">
          <div class="btn prev" @click="prev">上一题</div>
          <div class="btn next" @click="next">下一题</div>
        </div>
      </div>
    </div>
    <!-- 提示弹窗 -->
    <feedback :visible="visible" />
  </div>
</template>

<script>
import ChoiceQuestion from './../components/ChoiceQuestion'
import HeaderTag from '@/components/HeaderTag'
import QuestionCard from './../components/QuestionCard'
import TimeMeter from './../components/TimeMeter'
import CompletionQuestion from './../components/CompletionQuestion'
import Feedback from './../components/Feedback'
import { mapGetters } from 'vuex'
import { START_EXAM_URL, GET_EXAM_URL, SAVE_EXAM_URL } from '@/api/url'
import { axiosGet, axios2 } from '@/utils/axios'
import { typeMap } from './../config.js'
export default {
  name: 'ExamMission',
  components: { HeaderTag, QuestionCard, TimeMeter, ChoiceQuestion, CompletionQuestion, Feedback },
  props: [''],
  data() {
    return {
      typeMap: typeMap,
      cardData: [],
      activeName: '',
      questionId: 0,
      orderNumber: 1,
      questionType: '',
      exam: '',
      examinationTask: '',
      on: false,
      examiningRemainTime: 0, // 剩余时间
      // 测试结果相关
      examinationTaskId: '',
      isSubmit: false,
      questionAnswerDtoList: [
        /* {
          questionId: 0,
          studentAnswer: ''
        } */
      ],
      result: '', // 临时存储单选，多选，判断结果
      autoSaveTrigger: 0,
      visible: false, // 弹窗相关
      loading: false, // 加载
      cheatCount: 0, // 作弊次数
      isScreenfull: false, // 是否全屏
      questionSort: '一'
    }
  },

  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    // 获取学生选项
    answer() {
      const index = this.questionAnswerDtoList.findIndex(item => item.questionId === this.questionId)
      if (index === -1) {
        return ''
      }
      return this.questionAnswerDtoList[index].studentAnswer
    },
    // 当前题目
    currentQuestion() {
      if (this.exam && this.questionType && this.orderNumber > 0) {
        return this.exam[this.questionType][this.orderNumber - 1]
      }
      return {}
    },
    // 题目头
    /* questionText() {
      if (this.exam && this.questionType) {
        // console.log(this.exam[this.questionType])
        return this.currentQuestion.questionText
      }
      return ''
    }, */
    // 题目选项
    questionOption() {
      let arr = []
      const type = this.questionType
      if (this.currentQuestion.questionOption) {
        const tempArr = this.currentQuestion.questionOption.split('|#|')
        tempArr.forEach(item => {
          const tempArr2 = item.split('=')
          arr.push({
            value: tempArr2[0],
            content: tempArr2[1]
          })
        })
      } else if (type === '2') {
        arr = [
          { value: '正确', content: '正确' },
          { value: '错误', content: '错误' }
        ]
      }
      console.log(arr)
      return arr
    }
  },

  watch: {
    questionId: {
      handler(value) {
        // 更新result
        const index = this.getAnswerById(value)
        if (index !== -1) {
          // console.log('questionType', this.questionType)
          if (this.questionType === '4') {
            this.result = this.questionAnswerDtoList[index].studentAnswer || ['']
          } else {
            this.result = this.questionAnswerDtoList[index].studentAnswer || ''
          }
        }
        // 更新大题序号
        this.getQuestionSort()
      },
      immediate: true
    }
  },

  beforeMount() {},

  created() {
    // console.log('created')
    this.initial()
  },

  beforeRouteLeave(to, from, next) {
    // 离开弹窗
    if (this.isSubmit === false) {
      this.leave()
      return
    }
    next()
  },

  mounted() {
    document.addEventListener('visibilitychange', this.cheatHandler)
    // window.addEventListener('blur', this.cutScreenHandler)
    // document.addEventListener('keydown', this.cutScreenHandler)
  },

  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.cheatHandler)
    // window.removeEventListener('blur', this.cutScreenHandler)
    // document.addEventListener('keydown', this.cutScreenHandler)
  },

  methods: {
    /* // 打开
    open() {
      let seconds = 60
      const timer = setInterval(() => {
        seconds--
        if (seconds === 0) {
          clearInterval(timer)
        }
      }, 1000)
      this.$confirm(`测试结果将会在${seconds}s内生成，请耐心等待...`, '提示', {
        confirmButtonText: '立即查看',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.clearInterval(timer)
        this.$router.push('/exam/exam-result')
      }).catch(() => {
        this.clearInterval(timer)
        this.$router.push('/exam/exam-select')
      })
    }, */
    // 获取大题序列
    getQuestionSort() {
      const courseQuestion = this.exam
      const typeOrders = Object.keys(courseQuestion).filter(key => courseQuestion[key].length !== 0)
      const index = typeOrders.findIndex(item => item === this.activeName)
      const orderMap = ['一', '二', '三', '四']
      this.questionSort = orderMap[index]
    },
    // 作弊处理
    cheatHandler() {
      const state = document.visibilityState
      if (state === 'hidden') {
        this.cheatCount++
        if (this.cheatCount <= 3) {
          this.$message.warning(`检测到你第${this.cheatCount}次切换页面，超过3次将影响你的成绩`)
        } else {
          this.submit()
        }
      }
    },
    // 切屏处理
    cutScreenHandler(e) {
      /* console.log(e.keyCode)
      if (e.altKey && e.keyCode === 9) {
        console.log('你按下了alt + tab')
        this.cheatCount++
        if (this.cheatCount <= 3) {
          this.$message.warning(`检测到你第${this.cheatCount}次切换页面，超过3次将影响你的成绩`)
        } else {
          console.log('试卷提交中')
        }
      } */
    },
    // 提示弹窗
    leave() {
      this.$confirm('确定离开本场考试，离开后将自动提交，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submit()
      }).catch(() => {
        console.log('取消')
      })
    },
    // 保存
    save() {
      return new Promise(resolve => {
        // 格式化
        if (this.isSubmit === false) {
          const tempAnswerList = []
          this.questionAnswerDtoList.forEach(question => {
            const item = JSON.parse(JSON.stringify(question))
            if (question.studentAnswer instanceof Array) {
              item.studentAnswer = question.studentAnswer.join('|#|')
            }
            tempAnswerList.push(item)
          })
          const data = {
            examinationTaskId: this.examinationTaskId,
            isSubmit: false,
            questionAnswerDtoList: tempAnswerList
          }
          this.saveExam(data)
            .then(response => {
              this.$message.success('保存成功')
              resolve()
            })
        }
      })
    },
    // 交卷
    submit() {
      // 判空
      /* const index = this.questionAnswerDtoList.findIndex(question => !question.studentAnswer)
        if (index !== -1) {
          this.$message.warning('请确保已经做完全部题目再提交')
          return false
        } */
      // 格式化
      if (this.isSubmit === false) {
        const tempAnswerList = []
        this.questionAnswerDtoList.forEach(question => {
          const item = JSON.parse(JSON.stringify(question))
          if (question.studentAnswer instanceof Array) {
            item.studentAnswer = question.studentAnswer.join('|#|')
          }
          tempAnswerList.push(item)
        })
        const data = {
          examinationTaskId: this.examinationTaskId,
          isSubmit: true,
          questionAnswerDtoList: tempAnswerList
        }

        this.saveExam(data)
          .then(response => {
            this.$message.success('提交成功')
            this.isSubmit = true
            this.on = false

            this.visible = true
          })
      }
    },
    // 更新题目答案
    updateAnswer(value) {
      const index = this.getAnswerById(this.questionId)
      // 更新
      if (index !== -1) {
        this.questionAnswerDtoList[index].studentAnswer = value
      }
      // 设置result
      this.result = value
    },
    // 保存测试结果
    saveExam(data) {
      // console.log('data', data)
      return new Promise((resolve, reject) => {
        axios2({
          method: 'POST',
          url: SAVE_EXAM_URL,
          data,
          headers: { 'Content-Type': 'application/json' }
        }).then(response => {
          resolve(response)
        }).catch(error => {
          // this.$message.error(error.message || '出错')
          reject(error)
        })
      })
    },
    // 根据questionId获取索引
    getAnswerById(questionId) {
      return this.questionAnswerDtoList.findIndex(item => item.questionId === questionId)
    },
    // 获取结果
    getOneAnswer(questionId, questionType) {
      const index = this.getAnswerById(questionId)
      if (index !== -1) {
        const tempResult = this.questionAnswerDtoList[index].studentAnswer
        if (questionType === 3) { // 多选题
          return tempResult.split('|#|')
        } else { // 单选题
          return tempResult
        }
      }
      return ''
    },
    // 上一题
    prev() {
      // 保存结果(有，重置；没有，添加)
      // this.saveOneAnswer(this.questionId)
      // 设置题目id和序列
      if (this.orderNumber !== 1) {
        this.questionId = this.exam[this.questionType][this.orderNumber - 1 - 1].id
        this.orderNumber--
        // 设置题目结果
        // this.result = this.getOneAnswer(this.questionId)
      } else {
        const types = this.cardData.map(item => item.name)
        const index = types.findIndex(item => item === this.questionType)
        if (index !== -1 && index !== 0) {
          // 设置题型
          this.activeName = types[index - 1]
          this.questionType = types[index - 1]
          // 设置题目id和序列
          const length = this.exam[this.questionType].length
          this.questionId = this.exam[this.questionType][length - 1].id
          this.orderNumber = length
          // 设置题目结果
          // this.result = this.getOneAnswer(this.questionId)
        }
      }
    },
    // 下一题
    next() {
      // 保存结果(有，重置；没有，添加)
      // this.saveOneAnswer(this.questionId)
      // 设置题目id和序列
      const length = this.exam[this.questionType].length
      if (this.orderNumber !== length) {
        this.questionId = this.exam[this.questionType][this.orderNumber - 1 + 1].id
        this.orderNumber++
        // 设置题目结果
        // this.result = this.getOneAnswer(this.questionId)
      } else {
        const types = this.cardData.map(item => item.name)
        const index = types.findIndex(item => item === this.questionType)
        if (index !== -1 && index !== types.length - 1) {
          // 设置题型
          this.activeName = types[index + 1]
          this.questionType = types[index + 1]
          // 设置题目id和序列
          this.questionId = this.exam[this.questionType][0].id
          this.orderNumber = 1
          // 设置题目结果
          // this.result = this.getOneAnswer(this.questionId)
        }
      }
    },
    // 题卡切换试题
    selectQuestion({ questionId, orderNumber }) {
      if (this.questionId !== questionId) {
        // 保存结果
        // this.saveOneAnswer(this.questionId)
        // 设置题目id和序列
        this.questionId = questionId
        this.orderNumber = orderNumber
        // 设置题型
        this.questionType = this.activeName
        // 设置题目结果
        // this.result = this.getOneAnswer(this.questionId)
      }
    },
    // 初始化试卷
    async initial() {
      // console.log('初始化')
      this.loading = true
      // 1. 获取examinationTaskId
      this.examinationTaskId = this.$route.query.id
      // 2. 获取测试任务基本信息
      const resp = await this.getExam({ id: this.examinationTaskId })
      this.examinationTask = resp.data
      // 3. 获取试题
      const response = await this.startExam({ examinationTaskId: this.examinationTaskId })
      this.exam = response.data.courseQuestion
      // 4. 设置答案
      this.setQuestionAnswerDtoList(this.exam)
      // 5. 设置时间
      this.examiningRemainTime = response.data.examiningRemainTime
      // 6. 设置题卡
      this.setDataCard(this.exam)
      // 7. 初始化题卡
      if (this.cardData.length) {
        this.activeName = this.cardData[0].name
        this.questionId = this.cardData[0].items[0].id
        this.questionType = this.activeName
      }
      // 8. 全屏
      this.isScreenfull = true
      // 9. 禁用esc
      /* this.$refs.examMission.addEventListener('keydown', function(e) {
        const charCode = e.charCode || e.keyCode || e.which
        if (charCode == 27) {
          console.log('esc')
          this.$message.warning('禁用esc退出全屏')
          return false
        }
      }) */
      // 9. 开始测试
      this.on = true
      this.loading = false
    },
    // 设置答案
    setQuestionAnswerDtoList(exam) {
      /* 试卷格式
        "1": [
            {
              "id": 13,
              "questionText": "下列单位均为导出单位的是",
              "questionUrl": "",
              "questionType": 1,
              "questionOption": "A=牛顿安培 |#|B=千克 焦耳|#|C=欧姆 伏特|#|D=特斯拉 秒",
              "questionDifficulty": 1,
              "grade": 2,
              "questionKnowledge": "物理",
              "studentAnswer": null
            },
          ]
      */
      /* 答案格式
        {
          "questionId": 0,
          "studentAnswer": ""
        }
      */
      this.questionAnswerDtoList = []
      Object.keys(exam).forEach(key => {
        const questionList = exam[key]
        questionList.forEach(question => {
          let studentAnswer = question.studentAnswer
          if ((question.questionType === 3 || question.questionType === 4) && question.studentAnswer) {
            // 多选题和填空题答案拆分为数组
            studentAnswer = question.studentAnswer.split('|#|')
            // console.log('studentAnswer', studentAnswer)
          }
          const answer = {
            questionId: question.id,
            studentAnswer
          }
          this.questionAnswerDtoList.push(answer)
        })
      })
    },
    // 设置题卡
    setDataCard(exam) {
      Object.keys(exam).forEach(key => {
        if (this.exam[key].length) {
          const obj = { label: '', name: '', items: [] }
          obj.label = this.typeMap[key]
          obj.name = key
          this.exam[key].forEach(item => obj.items.push({ id: item.id }))
          this.cardData.push(obj)
        }
      })
    },
    // 根据id查询测试任务
    getExam(data) {
      return new Promise((resolve, reject) => {
        axiosGet(GET_EXAM_URL, { params: data })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            // this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 组卷
    startExam(data) {
      return new Promise((resolve, reject) => {
        axiosGet(START_EXAM_URL, { params: data })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            // this.$message.error(error.message || '出错')
            reject(error)
          })
      })
    },
    // 剩余时间
    restTime(now) {
      this.autoSaveTrigger++
      // 每5分钟自动保存
      if (this.autoSaveTrigger === 300) {
        this.autoSaveTrigger = 0
        this.save()
      }
    }
  }
}

</script>
<style lang='scss' scoped>
.exam-mission {
  height: 100%;
  background-color: #fff;
  &-main {
    &-inner {
      padding: 20px;
    }
    flex-grow: 1;
    height: 100%;
    ::v-deep .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .header {
      text-align: center;
      font-size: 25px;
    }
    .title {
      color: #333;
      font-size: 20px;
      line-height: 40px;
      font-weight: bold;
    }
    .question-title {
      color: #666;
      font-size: 16px;
      line-height: 32px;
    }

    .btns {
      margin-top: 20px;
    }
  }
  &-sidebar {
    position: relative;
    padding: 10px;
    width: 280px;
    height: 100%;
    border-right: 1px solid #eee;
    border-left: 1px solid #eee;
    flex-shrink: 0;
    // background-color: #eee;
    .side-top {
      width: 100%;
      height: 150px;
      border-bottom: 1px dashed #ccc;
    }
    .side-middle {
      padding-top: 10px;
      height: 230px;
      border-bottom: 1px dashed #ccc;
    }
    .side-bottom {
      padding-top: 10px;
    }
    .operator {
      .el-button {
        width: 100%;
        margin-top: 20px;
        margin-left: 0;
      }
    }
    .base-message {
      .header-tag {
        margin-bottom: 20px;
      }
      .line {
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        background-color: #eee;
        padding-left: 70px;
        color: #666;
        margin-bottom: 10px;
        label {
          font-weight: normal;
          // margin-right: 10px;
        }
      }
    }
    .timer {
      /* display: flex;
      align-items: center;
      justify-content: center; */
      text-align: center;
      .time-meter {
        margin-top: 25px;
      }
    }
    .exam-message {
      .task {
        text-align: center;
        line-height: 100px;
        font-size: 30px;
        color: #409EFF;
        font-weight: bold;
        .icon--task {
          font-size: 30px;
          color: #409EFF;
          margin-right: 10px;
        }
      }
    }
    .question-card {
      min-height: 200px;
      .header-tag {
        margin-bottom: 20px;
      }
    }
    .student-message {
      text-align: center;
      .avatar {
        width: 120px;
        height: 120px;
        margin: 20px auto;
        border-radius: 5px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .line {
        line-height: 32px;
        font-size: 16px;
        label {
          font-weight: normal;
        }
      }
    }
  }
}

@media screen and (max-width: 991px) {
  .exam-mission {
    padding-bottom: 55px;
    &-container {
      &__header {
        position: relative;
        line-height: 40px;
        padding: 0 10px;
        overflow: hidden;
        background-color: #eee;
        h1 {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          display: inline-block;
          color: #666;
          font-size: 16px;
        }
        .time-meter {
          float: left;
        }
        .el-button {
          float: right;
          margin-top: 4px;
          font-size: 16px;
        }
      }
      &__question {
        height: calc(100vh - 40px - 55px);
        padding: 10px 10px 0 10px;
        color: #666;
        .question-type {
          font-size: 16px;
          font-weight: bold;
        }
        .question-title {
          margin-top: 20px;
          text-indent: 1em;
          line-height: 28px;
        }
      }
    }
    &-bottom {
      height: 55px;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 999;
      background-color: #fff;
      border-top: 1px solid #ccc;
      padding: 5px;
      display: flex;
      .btn {
        flex-grow: 1;
        font-size: 16px;
        text-align: center;
        line-height: 45px;
        color: #666;
        &:active {
          background-color: #eee;
        }
      }
      .prev {
        position: relative;
        &::after {
          content: '';
          display: inline-block;
          width: 1px;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          background: #eee;
        }
      }
    }
  }
}
</style>
