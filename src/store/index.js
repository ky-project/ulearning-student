import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import experiment from './modules/experiment'
import notice from './modules/notice'
import VuexPersistence from 'vuex-persist' // 持久化存储

Vue.use(Vuex)
const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage,
  modules: ['experiment', 'app', 'notice']
})
const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    experiment,
    notice
  },
  getters,
  plugins: [vuexLocal.plugin]
})

export default store
