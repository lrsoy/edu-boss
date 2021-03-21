<template>
  <div>
    <span style=" float: right;line-height:40px">{{ manCourseName.courseName }}</span>
    <el-button @click="onTianjia" style="margin-bottom: 10px;" type="primary">添加章节</el-button>
      <el-dialog
        :title="isEdit === true? '编辑' : '添加' "
        :visible.sync="dialogVisibleCourse"
        width="30%">
        <!-- 对话框组件 -->
        <coursedialog
         v-if="dialogVisibleCourse"
         :is-edit="isEdit"
        @shut="shut"
        @editing="editing"
        :course-name="courseName"
        :description="description"
        :order-num="orderNum"
        :section-name="sectionName"
        ></coursedialog>
      </el-dialog>
      <!-- 添加课时 -->
       <el-dialog
         :title="isClassHour? '编辑' : '添加' "
         :visible.sync="dialogVisibleClassHour"
         width="50%">
         <class-hour
         @addDispose="addDispose"
         :section-id="sectionId"
         :course-name="courseName"
         :order-num="orderNum"
          :theme="theme"
          :duration="duration"
          :is-free="isFree"
          :is-class-hour="isClassHour" v-if="dialogVisibleClassHour"
          :lesson-id="lessonId"
          ></class-hour>
       </el-dialog>
       <!-- 状态 -->
    <el-tree  :data="sections" draggable :props="defaultProps" :allow-drop="handleAllDrop">
      <div class="inner" slot-scope="{node, data}">
        <!-- 设置内容 -->
        <span>{{ node.label }}</span>
        <!-- 设置后续按钮结构 -->
        <!-- section 结构 -->
        <span  v-if="data.sectionName" class="actions">
           <el-button @click="onsection(data)">编辑</el-button>
            <!-- @click="onClassHour" -->
          <el-button type="primary" @click="onClassHourBianji">添加课时</el-button>
          <el-button>状态</el-button>
        </span>
        <!-- lesson 结构 -->
        <span v-else class="actions">
          <el-button @click="compileClassHour(data)">编辑</el-button>
          <el-button type="success" @click="$router.push({
            name: 'course-video',
            params: {
              courseId
            },
            query: {
              lessonId: data.id
            }
          })">上传视频</el-button>
          <el-button @click="dialogVisibleCourse = true">状态</el-button>
        </span>
      </div>

    </el-tree>
 </div>
</template>

<script>
import Coursedialog from './components/Coursedialog'
import ClassHour from './components/ClassHour'
import { getSectionAndLesson } from '@/services/course-section'
import { getCourseById } from '@/services/course'
export default {
  name: 'management',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    Coursedialog,
    ClassHour
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      },
      // 添加章节控制对话框
      dialogVisibleCourse: false,
      // 控制窗口关闭功能
      isEdit: false,
      // 存储课程名称信息
      manCourseName: {},
      // 存储课程名称
      courseName: '',
      // 存储章节描述
      description: '',
      // 存储章节名称，
      sectionName: '',
      // 存储课程排序
      orderNum: null,
      // -----------编辑课时------------
      dialogVisibleClassHour: false,
      // 判断是添加课时还是编辑课时
      isClassHour: false,
      // 课时id
      lessonId: '',
      // 课时名称
      theme: '',
      // 课时时长
      duration: '',
      // 是否试听
      isFree: '',
      sectionId: '',
      // 状态
      dialogVisiblestate: false,
      isState: false
    }
  },
  created () {
    this.loadSection()
    // 加载课程名称请求
    this.loadcourseName()
  },
  methods: {
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.sections = data.data
      }
    },
    // 请求课程名称
    async loadcourseName () {
      const { data } = await getCourseById(this.courseId)
      console.log(data)
      this.manCourseName = data.data
    },
    // 拖拽处理函数
    handleAllDrop (draggingNode, dropNode, type) {
      // 规则1 只能同级一同不能为inner
      // 课时不能移动到其他章节中 前两个参数必须在一个章节内部
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    // 添加按钮设置
    onTianjia () {
      this.dialogVisibleCourse = true
      this.isEdit = false
    },
    // 编辑配置按钮
    onsection (row) {
      this.dialogVisibleCourse = true
      this.isEdit = true
      console.log(row)
      // 课程名称
      this.courseName = this.manCourseName.courseName
      this.description = row.description
      this.orderNum = row.orderNum
      this.sectionName = row.sectionName
    },
    // 添加章节之后的处理
    shut () {
      this.dialogVisibleCourse = false
      this.loadSection()
    },
    // 编辑章节信息
    editing () {
      this.dialogVisibleCourse = false
      this.loadSection()
    },
    // ------课时相关------
    compileClassHour (row) {
      this.dialogVisibleClassHour = true
      this.isClassHour = true
      // 课程名称
      console.log(row)
      this.courseName = this.manCourseName.courseName
      this.theme = row.theme
      this.duration = row.duration
      this.isFree = row.isFree
      this.sectionId = row.sectionId
    },
    onClassHourBianji () {
      this.dialogVisibleClassHour = true
      this.isClassHour = false
    },
    // 保存之后关闭
    addDispose () {
      this.dialogVisibleClassHour = false
      this.loadSection()
    }
  }
}
</script>

<style lang='scss' scoped>
.inner {
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid rgb(238, 238, 238);
  align-items: center;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
