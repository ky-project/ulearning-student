<template>
  <div class="exam-detail">
    <div v-if="$store.getters.device === 'desktop'" class="flex">
      <div class="exam-detail-sidebar">
        <header-tag text="题卡" />
        <QuestionCard
          class="card"
          :data="cardData"
          :active-name.sync="activeName"
          :question-id="questionId"
          @update="selectQuestion"
        />
      </div>
      <div class="top exam-detail-main">
        <el-scrollbar :style="{height: '100%'}">
          <div class="exam-detail-main-inner">
            <h3 class="header">{{ examDetail.examinationName }}</h3>
            <h4 class="title">{{ questionSort + '、' + typeMap[questionType] }}</h4>
            <p class="question-title">
              {{ `${orderNumber}. ${currentQuestion.questionText}` }}
            </p>
            <div class="question-img">
              <img :src="currentQuestion.questionUrl" alt="">
            </div>
            <!-- 非填空题 -->
            <choice-question
              v-if="questionType !== '4'"
              :disabled="true"
              :question-option="questionOption"
              :value="result"
              :multiple="questionType === '3'"
              :show-value="questionType !== '2'"
            />
            <!-- 填空题 -->
            <completion-question v-else :disabled="true" :answer-list="result" />
            <div class="question-message flex">
              <div class="question-message-item">
                <label>【知识点】</label>
                <span>{{ currentQuestion.questionKnowledge.split('|#|').join(',') }}</span>
              </div>
              <div class="question-message-item">
                <label>【难度】</label>
                <span>{{ difficultyMap[currentQuestion.questionDifficulty] }}</span>
              </div>
              <div class="question-message-item">
                <label>【答案】</label>
                <span>{{ currentQuestion.questionKey.split('|#|').join(',') }}</span>
              </div>
              <div class="question-message-item">
                <label>【得分】</label>
                <span>{{ currentQuestion.studentScore }} 分</span>
              </div>
            </div>
            <div class="btns flex justify-end">
              <el-button @click="prev">上一题</el-button>
              <el-button type="primary" @click="next">下一题</el-button>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="exam-detail-sidebar">
        <div class="side-top performance">
          <header-tag text="成绩" />
          <grade-progress :score="examDetail.stuTotalScore" :percentage="scorePercentage" />
          <div class="line">
            <label>排名：</label>
            <span>第 {{ examDetail.ranking }} 名</span>
          </div>
          <div class="line">
            <label>提交：</label>
            <span>{{ examDetail.submitNumber }} 人</span>
          </div>
          <div class="line">
            <label>总分：</label>
            <span>{{ examDetail.totalScore }} 分</span>
          </div>
        </div>
        <div class="side-bottom">
          <header-tag text="正确率" />
          <accuracy :data="accuracyData" />
        </div>
      </div>
    </div>
    <!-- 手机端 -->
    <div v-else>
      <div class="exam-detail-container">
        <div class="exam-detail-container__header">
          <div class="header-tabs">
            <span
              :class="['btn-detail',{active: mobileActive === 'detail'}]"
              @click="() => {mobileActive = 'detail'}"
            >详情</span>
            <span
              :class="['btn-comment',{active: mobileActive === 'comment'}]"
              @click="() => {mobileActive = 'comment'}"
            >总评</span>
          </div>
        </div>
        <div v-if="mobileActive === 'detail'">
          <div class="exam-detail-container__question">
            <el-scrollbar :style="{height: '100%'}">
              <h3 class="exam-title">{{ examDetail.examinationName }}</h3>
              <h4 class="question-type">{{ questionSort + '、' + typeMap[questionType] }}</h4>
              <p class="question-title">
                {{ `${orderNumber}. ${currentQuestion.questionText}` }}
              </p>
              <div class="question-img">
                <img :src="currentQuestion.questionUrl" alt="">
              </div>
              <choice-question
                v-if="questionType !== '4'"
                :disabled="true"
                :question-option="questionOption"
                :value="result"
                :multiple="questionType === '3'"
                :show-value="questionType !== '2'"
              />
              <completion-question v-else :disabled="true" :answer-list="result" />
              <div v-desktop class="btns flex justify-end">
                <el-button @click="prev">上一题</el-button>
                <el-button type="primary" @click="next">下一题</el-button>
              </div>
            </el-scrollbar>
          </div>
          <div class="exam-detail-bottom">
            <div class="btn prev" @click="prev">上一题</div>
            <div class="btn next" @click="next">下一题</div>
          </div>
        </div>
        <div v-else>
          <div class="exam-detail-container__comment">
            <el-scrollbar :style="{height: '100%'}">
              <el-card>
                <div slot="header" class="clearfix">
                  <span>成绩</span>
                </div>
                <div class="comment-grade">
                  <grade-progress :score="examDetail.stuTotalScore" :percentage="scorePercentage" />
                  <div class="line">
                    <label>排名：</label>
                    <span>第 {{ examDetail.ranking }} 名</span>
                  </div>
                  <div class="line">
                    <label>提交：</label>
                    <span>{{ examDetail.submitNumber }} 人</span>
                  </div>
                  <div class="line">
                    <label>总分：</label>
                    <span>{{ examDetail.totalScore }} 分</span>
                  </div>
                </div>
              </el-card>
              <el-card>
                <div slot="header" class="clearfix">
                  <span>正确率</span>
                </div>
                <accuracy :data="accuracyData" />
              </el-card>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChoiceQuestion from './../components/ChoiceQuestion'
import Accuracy from './../components/Accuracy'
import HeaderTag from '@/components/HeaderTag'
import QuestionCard from './../components/QuestionCard'
import CompletionQuestion from './../components/CompletionQuestion'
import GradeProgress from '@/views/experiment/components/GradeProgress'
import { mapGetters } from 'vuex'
import { GET_EXAM_URL } from '@/api/url'
import { axiosGet } from '@/utils/axios'
import { typeMap, difficultyMap } from './../config.js'
export default {
  name: 'Examdetail',

  components: {
    HeaderTag,
    QuestionCard,
    ChoiceQuestion,
    CompletionQuestion,
    GradeProgress,
    Accuracy
  },
  props: [''],
  data() {
    return {
      tempData: [
        { label: '选择题', percentage: 20 },
        { label: '填空题', percentage: 40 },
        { label: '多选题', percentage: 60 },
        { label: '判断题', percentage: 80 }
      ],
      typeMap: typeMap,
      difficultyMap: difficultyMap,
      activeName: '0',
      questionId: 1,
      orderNumber: 1,
      questionType: 2,
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
      // 进度条相关
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      questionSort: '一', // 大题序列
      mobileActive: 'detail' // 'detail' or 'comment'
    }
  },

  computed: {
    ...mapGetters([
      'userInfo',
      'examDetail'
    ]),

    cardData() {
      /* courseQuestion格式
       {
        '1': [
          {
            id: 0,
            questionText: '',
            questionUrl: '',
            questionType: 0,
            questionOption: '',
            questionDifficulty: 0,
            grade: 0,
            questionKnowledge: '',
            studentAnswer: '',
            questionKey: '',
            studentScore: 0
          }
        ]
      }
       */
      const data = []
      if (this.examDetail && this.examDetail.courseQuestion) {
        const courseQuestion = this.examDetail.courseQuestion
        Object.keys(courseQuestion).forEach(key => {
          if (courseQuestion[key].length) {
            const obj = { label: '', name: '', items: [] }
            obj.label = this.typeMap[key]
            obj.name = key
            courseQuestion[key].forEach(item => {
              let bgc = ''
              if (item.studentScore < item.grade) {
                bgc = '#F56C6C'
              }
              obj.items.push({ id: item.id, bgc })
            })
            data.push(obj)
          }
        })
      }
      return data
    },
    scorePercentage() {
      return this.examDetail.stuTotalScore / this.examDetail.totalScore * 100
    },
    accuracyData() {
      const data = []
      if (this.examDetail && this.examDetail.accuracy) {
        /* accuracy格式
       accuracy: {
          '1': {
            questionNumber: 4,
            correctNumber: 0
          }
        }, */
        const accuracy = this.examDetail.accuracy
        Object.keys(accuracy).forEach(key => {
          const item = accuracy[key]
          const dataItem = {}
          if (item.questionNumber) {
            dataItem.label = this.typeMap[key]
            dataItem.percentage = parseInt(Number(item.correctNumber) / Number(item.questionNumber) * 100)
            data.push(dataItem)
          }
        })
      }
      return data
    },
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
      if (this.examDetail.courseQuestion && this.questionType && this.orderNumber > 0) {
        return this.examDetail.courseQuestion[this.questionType][this.orderNumber - 1]
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
    this.initial()
  },

  mounted() {},

  methods: {
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
    /* async initial() {
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
      this.examiningRemainTime = response.data.examiningRemainTime * 60
      // 6. 设置题卡
      this.setDataCard(this.exam)
      // 7. 初始化题卡
      if (this.cardData.length) {
        this.activeName = this.cardData[0].name
        this.questionId = this.cardData[0].ids[0]
        this.questionType = this.activeName
      }
      // 8. 开始测试
      this.on = true
    }, */
    // 获取大题序列
    getQuestionSort() {
      const courseQuestion = this.examDetail.courseQuestion
      const typeOrders = Object.keys(courseQuestion).filter(key => courseQuestion[key].length !== 0)
      const index = typeOrders.findIndex(item => item === this.activeName)
      const orderMap = ['一', '二', '三', '四']
      this.questionSort = orderMap[index]
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
      // 设置题目id和序列
      const courseQuestion = this.examDetail.courseQuestion
      if (this.orderNumber !== 1) {
        this.questionId = courseQuestion[this.questionType][this.orderNumber - 1 - 1].id
        this.orderNumber--
      } else {
        const types = this.cardData.map(item => item.name)
        const index = types.findIndex(item => item === this.questionType)
        if (index !== -1 && index !== 0) {
          // 设置题型
          this.activeName = types[index - 1]
          this.questionType = types[index - 1]
          // 设置题目id和序列
          const length = courseQuestion[this.questionType].length
          this.questionId = courseQuestion[this.questionType][length - 1].id
          this.orderNumber = length
        }
      }
    },
    // 下一题
    next() {
      // 设置题目id和序列
      const courseQuestion = this.examDetail.courseQuestion
      const length = courseQuestion[this.questionType].length
      if (this.orderNumber !== length) {
        this.questionId = courseQuestion[this.questionType][this.orderNumber - 1 + 1].id
        this.orderNumber++
      } else {
        const types = this.cardData.map(item => item.name)
        const index = types.findIndex(item => item === this.questionType)
        if (index !== -1 && index !== types.length - 1) {
          // 设置题型
          this.activeName = types[index + 1]
          this.questionType = types[index + 1]
          // 设置题目id和序列
          this.questionId = courseQuestion[this.questionType][0].id
          this.orderNumber = 1
        }
      }
    },
    // 题卡切换试题
    selectQuestion({ questionId, orderNumber }) {
      if (this.questionId !== questionId) {
        // 设置题目id和序列
        this.questionId = questionId
        this.orderNumber = orderNumber
        // 设置题型
        this.questionType = this.activeName
      }
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
    /* setDataCard(exam) {

      Object.keys(exam).forEach(key => {
        if (this.exam[key].length) {
          const obj = { label: '', name: '', ids: [] }
          obj.label = this.typeMap[key]
          obj.name = key
          this.exam[key].forEach(item => obj.ids.push(item.id))
          this.cardData.push(obj)
        }
      })
    }, */
    // 根据id查询测试任务
    getExam(data) {
      return new Promise((resolve, reject) => {
        axiosGet(GET_EXAM_URL, { params: data })
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
.exam-detail {
  height: 100%;
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
    .question-message {
      padding: 20px 0;
      border-top: 1px dashed #ccc;
      flex-wrap: wrap;
      &-item {
        margin-bottom: 10px;
        flex-grow: 1;
        label {
          color: #409EFF;
          margin-right: 5px;
          white-space: nowrap;
        }
        span {
          color: #666
        }
      }
    }

    .btns {
      margin-top: 20px;
    }
  }
  &-sidebar {
    padding: 10px;
    width: 280px;
    height: 100%;
    border-right: 1px solid #eee;
    border-left: 1px solid #eee;
    flex-shrink: 0;
    .side-top {
      width: 100%;
      border-bottom: 1px dashed #ccc;
      text-align: center;
      .grade-progress {
        margin: 10px 0
      }
    }
    .side-bottom {
      padding-top: 10px;
      .header-tag {
        margin-bottom: 10px;
      }
    }
    .side-middle {
      padding-top: 10px;
      height: 200px;
      border-bottom: 1px dashed #ccc;
    }
    .performance {
      .line {
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        background-color: #eee;
        padding-left: 70px;
        text-align: left;
        color: #666;
        margin-bottom: 10px;
        label {
          font-weight: normal;
          // margin-right: 10px;
        }
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
      .card {
        margin-top: 10px;
      }
    }
    .student-message {
      text-align: center;
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
</style>
<style lang='scss' scoped>
@media screen and (max-width: 991px) {
  .exam-detail {
    padding-bottom: 55px;
    &-container {
      &__header {
        margin: 10px 0;
        .header-tabs {
          margin: 0 auto;
          display: flex;
          width: 160px;
          line-height: 30px;
          height: 30px;
          border: 1px solid #ccc;
          border-radius: 15px;
          overflow: hidden;
          span {
            display: block;
            flex: 1;
            text-align: center;
            font-size: 16px;
            color: #666;
            &.active {
              background-color: #409EFF;
              color: #fff;
            }
          }
          .btn-detail {
            border-right: 1px solid #ccc;
          }
        }
      }
      &__question {
        height: calc(100vh - 40px - 55px);
        padding: 10px 10px 0 10px;
        color: #666;
        .exam-title {
          font-size: 20px;
          text-align: center;
          font-weight: bold;
        }
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
      &__comment {
        height: calc(100vh - 40px - 55px);
        .comment-grade {
          text-align: center;
        }
        .line {
          height: 40px;
          line-height: 40px;
          border-radius: 5px;
          background-color: #eee;
          text-align: center;
          color: #666;
          margin-bottom: 10px;
          label {
            font-weight: normal;
            // margin-right: 10px;
          }
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
