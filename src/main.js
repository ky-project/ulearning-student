import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
// import screenfull from 'screenfull'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

// 禁止页面拖拽
// document.body.addEventListener('touchmove', function(e) { e.preventDefault() })
// 自定义指令开始
Vue.directive('mobile', {
  bind: el => {
    if (store.getters.device === 'desktop') {
      // el.style.display.removeChild(el) // 移除
      el.style.display = 'none'
    }
  }
})
Vue.directive('desktop', {
  bind: el => {
    if (store.getters.device === 'mobile') {
      // el.parentNode.removeChild(el) // 移除
      el.style.display = 'none'
    }
  }
})
Vue.directive('wh', {
  bind: (el, binding) => {
    const { arg, value } = binding
    const wh = arg === 'width' ? 'width' : 'height'
    el.style[wh] = value
  }
})
// 全屏
/* Vue.directive('screenfull', {
  update: (el, binding) => {
    const { value, oldValue } = binding
    if (!oldValue && value) {
      // 全屏
      if (screenfull.isEnabled) {
        screenfull.request(el)
      }
    } else if (oldValue && !value) {
      // 取消全屏
      if (screenfull.isEnabled) {
        screenfull.exit(el)
      }
    }
  }
}) */
// 禁用esc退出全屏
/* Vue.directive('noesc', {
  bind: (el, binding) => {
    el.addEventListener('keydown', function(e) {
      const charCode = e.charCode || e.keyCode || e.which
      if (charCode == 27) {
        console.log('esc')
        this.$message.warning('禁用esc退出全屏')
        return false
      }
    })
  }
}) */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
