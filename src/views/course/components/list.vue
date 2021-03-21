<template>
  <div class="course-list">
      <el-form
        :inline="true"
        ref="form"
        label-position="left"
        :model="filterParams"
      >
        <el-form-item label="课程名称：" prop="courseName">
          <el-input v-model="filterParams.courseName"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="filterParams.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="isLoading"
            @click="handleReset"
          >重置</el-button>
          <el-button
            type="primary"
            :disabled="isLoading"
            @click="handleFilter"
          >查询</el-button>
        </el-form-item>
        <el-form-item  style="float: right;">
        <el-button
          type="primary"
          @click="$router.push({
            name: 'create'
          })"
        >添加课程</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="courses"
        v-loading="isLoading"
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="100">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="230">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                @change="onStateChange(scope.row)"
                :disabled="scope.row.isStatusLoading"
                >
              </el-switch>
            </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button @click="$router.push({
              name: 'course-edit',
              // 接收当前行的id信息
              params: {
                courseId: scope.row.id
              }
            })">编辑</el-button>
            <el-button @click="$router.push({
              name: 'management',
              params: {
                courseId: scope.row.id
              }
            })">内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="isLoading"
        :current-page="filterParams.currentPage"
        @current-change="handleCurrentChange"
      />
  </div>
</template>

<script>
import { getQueryCourses, changeState } from '@/services/course'

export default {
  name: 'CourseList',
  data () {
    return {
      // 筛选功能参数（表单数据）
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      // 课程信息
      courses: [],
      // 数据总条数
      totalCount: 0,
      // 加载状态
      isLoading: true
    }
  },

  created () {
    // 加载课程
    this.loadCourses()
  },

  methods: {
    // 加载课程
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.filterParams)
      if (data.code === '000000') {
        // 遍历数据，给每一条数据设置一个属性
        data.data.records.forEach(item => {
          item.isStatusLoading = false
        })
        // 保存课程信息
        this.courses = data.data.records
        this.totalCount = data.data.total
        this.isLoading = false
      }
    },
    // 分页页码点击操作
    handleCurrentChange (page) {
      this.filterParams.currentPage = page
      this.loadCourses()
    },
    // 筛选操作
    handleFilter () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    // 重置操作
    handleReset () {
      this.$refs.form.resetFields()
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    // 开关按钮时候进行请求
    async onStateChange (course) {
      // 点击开关禁用开关按钮
      course.isStatusLoading = true
      // 接收操作的课程对象，并发送请求更改上下架状态
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message(`${course.status === 1 ? '上架' : '下架'}成功`)
        // 成功后吧禁用状态关闭
        course.isStatusLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
