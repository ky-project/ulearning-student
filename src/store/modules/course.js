/* import {
  GET_SELECTED_COURSE_ARRAY_URL // 查询所有已选教学任务数组
} from '@/api/url'
import { axiosGet } from '@/utils/axios'
const state = {
  teachingTask: []
}

const mutations = {
  SET_TEACHINGTASK: (state, data) => {
    state.teachingTask = data
  }
}

const actions = {
  // 获取教学任务数组
  getTaskArray({ commit }) {
    return new Promise((resolve, reject) => {
      axiosGet(GET_SELECTED_COURSE_ARRAY_URL)
        .then(response => {
          commit('SET_TEACHINGTASK', response.data)
          resolve(response)
        })
        .catch(error => {
          // this.$message.error(error.message || '出错')
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
 */
