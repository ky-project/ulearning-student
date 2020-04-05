import {
  SUBMIT_EXPERIMENT_RESULT,
  GET_EXPERIMENT_RESULT // 根据id查询实验结果
} from '@/api/url.js'
import { axiosGet, axios2 } from '@/utils/axios'
import { Message } from 'element-ui'

function getDefaultExperiment() {
  return {
    id: 0,
    createBy: '',
    updateTime: '',
    updateBy: '',
    teachingTaskId: 0,
    experimentOrder: 0,
    experimentTitle: '',
    experimentContent: '',
    experimentAttachmentName: '',
    teachingTaskAlias: '',
    term: '',
    experimentStatus: false,
    file: ''
  }
}

function getDefaultExperimentResult() {
  return {
    createBy: '',
    createTime: '',
    experimentAdvice: '',
    experimentAttachmentName: '', // 附件名
    experimentCommitState: true,
    experimentCommitTime: '',
    experimentId: 0,
    experimentResult: '', // 实验结果
    experimentScore: 0,
    experimentShared: true,
    id: 0,
    memo: '',
    stuId: 0,
    updateBy: '',
    updateTime: '',
    valid: true,
    file: '' // 附件(自己添加)
  }
}

const state = {
  experiment: getDefaultExperiment(),
  experimentResult: getDefaultExperimentResult(),
  mode: ''
}

const mutations = {
  RESET_EXPERIMENT: state => {
    state.experiment = getDefaultExperiment()
  },
  SET_EXPERIMENT: (state, data) => {
    state.experiment = Object.assign({}, state.experiment, data)
  },
  SET_MODE: (state, mode) => {
    state.mode = mode
  },
  RESET_EXPERIMENT_RESULT: state => {
    state.experimentResult = getDefaultExperimentResult()
  },
  SET_EXPERIEMNT_RESULT: (state, data) => {
    state.experimentResult = Object.assign({}, state.experimentResult, data)
  }
}

const actions = {
  // 查询试验结果
  getExperimentResult({ commit, state }, experimentId) {
    return new Promise((resolve, reject) => {
      axiosGet(GET_EXPERIMENT_RESULT, { params: { experimentId }})
        .then(response => {
          commit('SET_EXPERIEMNT_RESULT', response.data)
          const { experimentAttachmentName, experimentAttachmentSize } = response.data
          if (response.data.experimentAttachmentName) {
            commit('SET_EXPERIEMNT_RESULT', {
              file: {
                name: experimentAttachmentName,
                size: experimentAttachmentSize
              }
            })
          }
          resolve()
        })
        .catch(error => {
          Message.error(error.message || '出错')
          reject(error)
        })
    })
  },
  // 提交实验结果
  submitExperimentResult({ commit, state }) {
    return new Promise((resolve, reject) => {
      const { experimentResult, experimentId, file } = state.experimentResult
      const formData = new FormData()
      formData.append('file', file)
      formData.append('experimentId', experimentId)
      formData.append('experimentResult', experimentResult)
      axios2({
        method: 'POST',
        data: formData,
        url: SUBMIT_EXPERIMENT_RESULT,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          Message.success('实验提交成功')
          resolve(response)
        })
        .catch(error => {
          Message.error(error.message || '出错')
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
