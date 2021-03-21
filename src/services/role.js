import request from '@/utils/request'

export const getRoles = data => {
  return request({
    method: 'POST',
    data,
    url: '/boss/role/getRolePages'
  })
}

export const delateRole = id => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 添加与编辑请求
export const createOrUpdate = data => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

// 编辑信息获取当前角色信息

export const getRoleById = id => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

// 用户管理 获取所有角色
export const getAllRole = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

// 提交
export const allocateUserRoles = data => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

// 点击分配资源，获取当前用户id
export const getRoleResources = roleId => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}

// // 获取用户的所有资源
// export const getAllUser = () => {
//   return request({
//     method: 'GET',
//     url: '/boss/resource/getAll'
//   })
// }

// // 获取用户菜单和资源权限列表
export const getUserPermissions = () => {
  return request({
    method: 'GET',
    url: '/boss/permission/getUserPermissions'
  })
}

// 给角色分配资源
export const allocateRoleResources = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}
