/* import {
  SUBMIT_EXAM_RESULT,
  DOWNLOAD_EXAM_ATTACHMENT_URL,
  GET_EXAM_RESULT // 根据id查询实验结果
} from '@/api/url.js'
import { axiosPost, axiosGet, axios2 } from '@/utils/axios'
import { Message } from 'element-ui'
 */
function getDefaultExamDetail() {
  return {
    totalScore: 0,
    stuTotalScore: 0,
    examinationShowResult: false,
    ranking: 0,
    submitNumber: 0,
    examinationName: '',
    examinationTaskId: 0,
    examiningStateSwitchTime: '',
    accuracy: {
      /* '1': {
        questionNumber: 4,
        correctNumber: 0
      } */
    },
    courseQuestion: {
      /* '1': [
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
      ] */
    }
  }
}

const state = {
  examDetail: getDefaultExamDetail()
}

const mutations = {
  RESET_EXAM_DETAIL: state => {
    state.examDetail = getDefaultExamDetail()
  },
  SET_EXAM_DETAIL: (state, data) => {
    state.examDetail = Object.assign({}, state.examDetail, data)
  }
}

const actions = {
  // 提交实验结果
  submitExamResult({ commit, state }) {
    return new Promise((resolve, reject) => {
      /* console.log('提交实验结果')
      const { examResult, examId, file } = state.examResult
      const formData = new FormData()
      formData.append('file', file)
      formData.append('examId', examId)
      formData.append('examResult', examResult)
      axios2({
        method: 'POST',
        data: formData,
        url: SUBMIT_EXAM_RESULT,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          this.$message.success('实验提交成功')
          resolve(response)
        })
        .catch(error => {
          // this.$message.error(error.message || '出错')
          reject(error)
        }) */
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
