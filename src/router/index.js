import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '主页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Personal',
        component: () => import('@/views/personal/index'),
        meta: { title: '个人信息' }
      }
    ]
  },
  {
    path: '/select-course',
    component: Layout,
    redirect: '/select-course/index',
    children: [
      {
        path: 'index',
        name: 'select-course',
        component: () => import('@/views/selectCourse/index'),
        meta: { title: '学生选课', icon: 'yonghu' }
      }
    ]
  },
  {
    path: '/file-manage',
    component: Layout,
    meta: { title: '文件管理', icon: 'wenjian' },
    children: [
      {
        path: 'document-manage',
        name: 'DocumentManage',
        component: () => import('@/views/fileManage/documentManage'),
        meta: { title: '文件资料管理', icon: 'ziliao' }
      },
      {
        path: 'resource-manage',
        name: 'ResourceManage',
        component: () => import('@/views/fileManage/resourceManage'),
        meta: { title: '教学资源管理', icon: 'ziyuan' }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/notice-list',
    children: [
      {
        path: 'notice-list',
        name: 'NoticeList',
        hidden: true,
        component: () => import('@/views/notice/noticeList/index.vue'),
        meta: { title: '通告管理' }
      },
      {
        path: 'notice-detail',
        name: 'NoticeDetail',
        hidden: true,
        component: () => import('@/views/notice/noticeDetail'),
        meta: { title: '通告详情' }
      }
    ]
  },
  {
    path: '/experiment',
    component: Layout,
    redirect: '/experiment/experiment-list',
    meta: { title: '实验管理', icon: 'shiyan' },
    children: [
      {
        path: 'experiment-list',
        name: 'ExperimentList',
        hidden: true,
        component: () => import('@/views/experiment/experimentList'),
        meta: { title: '实验管理列表' }
      },
      {
        path: 'experiment-content',
        name: 'ExperimentContent',
        hidden: true,
        component: () => import('@/views/experiment/experimentContent'),
        meta: { title: '实验内容' }
      },
      {
        path: 'experiment-result',
        name: 'ExperimentResult',
        hidden: true,
        component: () => import('@/views/experiment/experimentResult'),
        meta: { title: '实验结果' }
      }
    ]
  },
  {
    path: '/exam',
    component: Layout,
    redirect: '/exam/exam-select',
    meta: { title: '学生测试', icon: 'kaoshi' },
    children: [
      {
        path: 'exam-select',
        name: 'ExamSelect',
        hidden: true,
        component: () => import('@/views/exam/examSelect'),
        meta: { title: '选择测试' }
      },
      {
        path: 'exam-mission',
        name: 'ExamMission',
        hidden: true,
        component: () => import('@/views/exam/examMission'),
        meta: { title: '测试任务' }
      }
      /* {
        path: 'experiment-content',
        name: 'ExperimentContent',
        hidden: true,
        component: () => import('@/views/experiment/experimentContent'),
        meta: { title: '实验内容' }
      },
      {
        path: 'experiment-result',
        name: 'ExperimentResult',
        hidden: true,
        component: () => import('@/views/experiment/experimentResult'),
        meta: { title: '实验结果' }
      } */
    ]
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/index'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
