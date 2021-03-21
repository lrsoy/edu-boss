import request from '@/utils/request'

// 获取广告列表
export const getAdverList = data => {
  return request({
    method: 'GET',
    url: '/front/ad/getAdList',
    data
  })
}

// 获取广告的位置
export const getAdverSpaces = () => {
  return request({
    method: 'GET',
    url: '/front/ad/space/getAllSpaces'
  })
}

// 修改上架下架信息
export const postDdDtO = params => {
  return request({
    method: 'GET',
    url: '/front/ad/updateStatus',
    params
  })
}

// 新增广告信息
export const addOrUpdate = data => {
  return request({
    method: 'POST',
    url: '/front/ad/saveOrUpdate',
    data
  })
}

// 上传图片接口
export const uploadImg = data => {
  return request({
    method: 'POST',
    url: '/front/upload/img',
    data
  })
}

// 根据id获取信息
export const getAdById = id => {
  return request({
    method: 'GET',
    url: '/front/ad/getAdById',
    params: {
      id
    }
  })
}

// 编辑广告位信息
export const spaceOrUpdate = data => {
  return request({
    method: 'POST',
    url: '/front/ad/space/saveOrUpdate',
    data
  })
}

// 根据id获取广告信息
export const allocateUserRoles = id => {
  return request({
    method: 'GET',
    url: '/boss/role/allocateUserRoles',
    params: {
      id
    }
  })
}
