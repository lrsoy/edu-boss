import request from '@/utils/request'
// 处理格式工具
import qs from 'qs'

// （一）.用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data)
  })
}
// (二).用户基本信息接口
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

// 请求用户数据列表信息
export const getUserPagesList = data => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}
