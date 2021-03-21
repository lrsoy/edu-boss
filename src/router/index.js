import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入vuex
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunKName: 'login' */'@/views/login/index')
  },
  {
    path: '/',
    component: () => import(/* webpackChunKName: 'layout' */'@/views/layout/index'),
    // 路由元信息，代表当前这个路由需要认证
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunKName: 'home' */'@/views/home/index'),
        redirect: '/course'
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunKName: 'role' */'@/views/role/index')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunKName: 'menu' */'@/views/menu/index')
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunKName: 'resource' */'@/views/resource/index')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunKName: 'course' */'@/views/course/index')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunKName: 'user' */'@/views/user/index')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunKName: 'advert' */'@/views/advert/index')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunKName: 'advert-space' */'@/views/advert-space/index')
      },
      // 权限管理 > 资源管理 添加菜单组件
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunKName: 'menu-create' */'@/views/menu/create')
      },
      // 权限管理 > 资源管理 编辑菜单组件 设置动态路由
      {
        path: '/menu/:id/edit',
        name: 'edit',
        component: () => import(/* webpackChunKName: 'menu-edit' */'@/views/menu/edit')
      },
      // 分配菜单
      {
        path: '/role/:roleId/alockmenu',
        name: 'alockmenu',
        component: () => import(/* webpackChunKName: 'alockmenu' */'@/views/role/alockmenu'),
        props: true
      },
      {
        path: '/role/:roleId/allocResource',
        name: 'allocResource',
        component: () => import(/* webpackChunKName: 'allocResource' */'@/views/role/allocResource'),
        props: true
      },
      {
        path: '/course/create',
        name: 'create',
        component: () => import(/* webpackChunKName: 'create' */'@/views/course/create')
      },
      // 编辑课程组件
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunKName: 'edit' */'@/views/course/edit'),
        // 解耦操作
        props: true
      },
      // 资源分类
      {
        path: '/resource/Category',
        name: 'Category',
        component: () => import(/* webpackChunKName: 'Category' */'@/views/resource/Category')
      },
      {
        path: '/course/:courseId/management',
        name: 'management',
        component: () => import(/* webpackChunKName: 'management' */'@/views/course/management'),
        // 动态路由传递参数解耦处理
        props: true
      },
      {
        path: '/advert/addAdvertise',
        name: 'addAdvertise',
        component: () => import(/* webpackChunKName: 'addAdvertise' */'@/views/advert/addAdvertise')
      },
      {
        path: '/advert/:id/redactAdvertise',
        name: 'redactAdvertise',
        component: () => import(/* webpackChunKName: 'redactAdvertise' */'@/views/advert/redactAdvertise'),
        // 解耦操作
        props: true
      },
      {
        path: '/course/:courseId/videosDp',
        name: 'course-video',
        component: () => import(/* webpackChunKName: 'video' */'@/views/course/videosDp'),
        // 解耦操作
        props: true
      }
      // ,
      // // 编辑章节 / 添加章节组组件
      // {
      //   path: '/course/:sectionId/course',
      //   name: 'Coursedialog',
      //   component: () => import(/* webpackChunKName: 'video' */'@/views/course/components/Coursedialog'),
      //   // 解耦操作
      //   props: true
      // }
    ]
  },
  {
    path: '*',
    name: 'error-page',
    component: () => import(/* webpackChunKName: 'error' */'@/views/error-page/index')
  }
]

const router = new VueRouter({
  routes
})
// 在每一个路由访问之前，都会进行单行守卫进行判断。
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        name: 'login',
        // 查询字符串参数,就是？后的信息
        query: {
          // 将本次的路由fullPath传递给登录页面
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router
