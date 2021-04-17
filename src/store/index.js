import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 一、存储用户登录成功的数据,（初始值尝试读取本地存储）
    user: JSON.parse(window.localStorage.getItem('user') || null)
    // 通过使用getItem进行获取本地储存的值，内部的参数必须要与setItem里面的键是相同的
  },
  mutations: {
    // 二、存储用户数据
    setUser (state, payload) {
      // 将里面传递过来的值转换成对象
      state.user = JSON.parse(payload)
      // 将用户的登录信息存储到本地中，即使刷新也不会清空这个payolad
      window.localStorage.setItem('user', payload)
      /* setItem是存储值，里面的参数是键值对的格式，第一个参数是键，后面的是值 */
    }
  },
  actions: {
  },
  modules: {
  }
})
