// services/resource.js
import request from '@/utils/request'
// import qs from 'qs'
// 资源请求
export const getResourcePages = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

// 查询数据请求
export const getResourceCatgeory = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

// 添加数据与编辑数据请求
export const saveOrderUpdate = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

// 删除数据请求
export const delateResource = id => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}

// 编辑角色
export const getResourceId = id => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

// 资源列表删除
export const delatecategory = id => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/category/${id}`
  })
}

// // 保存资源分类
export const classSaveOrderUpdate = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}
