import request from '@/utils/request'

// 获取章节信息
export const getSectionAndLesson = courseId => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

// 保存更新数据
export const saveOrUpdateSection = data => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}

// 根据id获取课时内用
export const getClassHourById = lessonId => {
  return request({
    method: 'GET',
    url: '/boss/course/lesson/getById',
    lessonId
  })
}

// 添加或者是保存更新
export const addClassHour = data => {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}

// 根据id获取章节信息
export const getBySectionId = sectionId => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getBySectionId',
    params: {
      sectionId
    }
  })
}
