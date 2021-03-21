/* -----先进行引入axios模块----- */
import axios from 'axios'

/* --------引入vuex文件-------- */
import store from '@/store'

/* ----引入element组件,局部方式进行引入，只需要引入message----- */
import { Message } from 'element-ui'

/* -----引入router文件,处理跳转----- */
import router from '@/router'

/* -----引入qs,请求参数处理----- */
import qs from 'qs'

/* (功能一：处理请求地址拼接功能)-----请求拦截器,axios的拦截器,判断是前台接口还是后台的接口----- */

const request = axios.create({
  // -使用axios.create创建一个自定义配置的axios实例
})
// 创建函数，判断接口是属于前台还是后台
function getBaseUrl (url) {
  // - startsWith字符方法，查找字符串中是否存在这个字符串
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}
// - 请求拦截器
request.interceptors.request.use(function (config) {
  // - config参数数本次请求过来的基本配置信息
  config.baseURL = getBaseUrl(config.url)
  // - 统一设置token键全数据
  const { user } = store.state
  if (user && user.access_token) {
    // - 通过请求拦截器参数可以访问请求头，并设置请求头
    config.headers.Authorization = user.access_token
  }
  return config
})

/* --------------------------------------结束--------------------------------------------- */
// （功能二）Token的过期处理-----------------------------------------------------------------
function redirectLogin () {
  router.push({
    name: 'login',
    // 存储路由信息对象
    redirect: router.currentRoute.fullPath
  })
}
// 存储token的状态
let isRefreshing = false

// 存贮因为等待token刷新，挂起的请求
let requests = []

/* ----- 一、响应拦截器，处理对应请求处理前的被拦截器拦截下来的请求，response保存了所有的响应信息 ----- */
request.interceptors.response.use(function (response) {
  // - 01_响应成功执行这一行
  return response

  // - 02_响应失败执行，error存储了所有的失败响应信息
}, function (error) {
  if (error.response) {
    // 02-1请求发送成功了，但是状态码失败的情况,主要处理401的情况，判断失败的状态码
    const { status } = error.response
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      /* --------------二、过期刷新处理------------------------------------------------ */
      // -1.没有token信息如何进行操作---------------
      if (!store.state.user) {
        // - 路由跳转
        redirectLogin()
        // - 结束后面所有操作
        return Promise.reject(error)
      }
      // -------------------结束-------------------------
      // -？？3.判断到底有没有正在刷新token请求----------
      if (isRefreshing) {
        // 将当前失败的请求存储到请求列表中
        return requests.push(function () {
          // 当前函数调用后，会自动发送本次失败的请求
          request(error.config)
        })
      }
      isRefreshing = true
      // -------------------结束-------------------------
      // -2.token过期，或者是错误，需要刷新----------
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // I   刷新失败
        if (res.data.state !== 1) {
          store.commit('setUser', null)
          // 路由跳转
          redirectLogin()
          return Promise.reject(error)
        }

        // II  刷新成功
        store.commit('setUser', res.data.content)
        // - 重新发送失败请求，根据requests 发送所有失败请求
        requests.forEach(callback => callback())
        // - 发送完毕清除requests里面的内容
        requests = []
        // III 重新发送失败请求
        return request(error.config)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // 不管成功失败，都需要更改,将刷新的状态变成false
        isRefreshing = false
      })
      // -----------------------结束-------------------------------
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务器错误，请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // - 请求发送成功，并没有收到响应
    Message.error('请求超时，请重新请求')
  } else {
    // - 意料之外的情况
    Message.error(error.message)
  }
  // 将本次请求错误对象，继续向后抛出，让接收响应的处理函数进行处理
  return Promise.reject(error)
})

// 将这个实例使用es6语法export默认导出
export default request
