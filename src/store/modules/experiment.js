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
    isCommitResult: false
  }
}
const state = {
  experiment: getDefaultExperiment()
}

const mutations = {
  RESET_EXPERIMENT: state => {
    state.experiment = getDefaultExperiment()
  },
  SET_EXPERIMENT: (state, data) => {
    state.experiment = Object.assign({}, state.experiment, data)
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
