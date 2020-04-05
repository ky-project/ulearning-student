import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getRefreshToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken() && getRefreshToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      console.log('去往登录页')
      next({ path: '/' })
      NProgress.done()
    } else {
      console.log('去往非登录页')
      // const hasGetUserInfo = store.getters.userInfo
      const { userInfo, teachingTask } = store.getters
      const hasInfo = userInfo && teachingTask
      if (hasInfo) {
        console.log('含有用户信息')
        next()
      } else {
        console.log('不含用户信息')
        try {
          // get user info
          console.log('尝试重新获取用户信息')
          const promiseArr = [
            store.dispatch('user/getInfo'),
            store.dispatch('user/getTeachingTask')
          ]
          await Promise.all(promiseArr)
          console.log('用户信息获取成功')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          console.log('用户信息获取失败')
          await store.dispatch('user/resetToken')
          Message.error(error.message || '出错')
          next('/login')
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
