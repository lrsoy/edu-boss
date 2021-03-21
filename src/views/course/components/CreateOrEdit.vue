<template>
  <div>
    <!-- 进度条信息 -->
    <el-steps :active="activeStep" simple style="margin-bottom:20px">
      <el-step @click.native="activeStep = i" v-for="(item, i) in steps" :key="item.id"  :title="item.title" icon="el-icon-edit"></el-step>
    </el-steps>
    <el-card>
      <el-form label-position="right">
        <!-- 课程名称 -->
        <div v-show="activeStep ===0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input placeholder="概述1"  style="width:45%" v-model="course.previewFirstField">
              <template slot="append">{{ course.previewFirstField.length }}/50</template>
            </el-input>
            <el-input placeholder="概述2"  style="width:45%;float:right" v-model="course.previewSecondField">
              <template slot="append">{{ course.previewFirstField.length }}/50 </template>
            </el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number v-model="course.sortNum" controls-position="right" lable="描述文字"></el-input-number>
          </el-form-item>
        </div>
        <!-- 课程封面 -->
        <div v-show="activeStep ===1">
          <!-- 组件  v-model默认触发@input-->
          <course-image :limit="6" lable="课程封面" v-model="course.courseListImg"></course-image>
          <course-image :limit="6" lable="解锁封面" v-model="course.courseImgUrl"></course-image>
        </div>
        <!-- 销售信息 -->
        <div v-show="activeStep ===2">
          <el-form-item label="销售价格">
            <el-input type="number" :min="0" v-model="course.discounts">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item  label="商品原价">
            <el-input type="number" :min="0" v-model="course.price">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input type="number" :min="0" v-model="course.sales">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag">
            </el-input>
          </el-form-item>
        </div>
        <!-- 秒杀价格 -->
        <div v-show="activeStep ===3">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
              v-model="course.activityCourseDTO.endTime"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input v-model="course.activityCourseDTO.amount" type="number" :min="0">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="库存">
              <el-input v-model="course.activityCourseDTO.stock" type="number" :min="0">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <!-- 课程详细信息 -->
        <div v-show="activeStep ===4">
          <el-form-item>
            <!-- <el-input v-model="course.courseDescriptionMarkDown" type="textarea"></el-input> -->
            <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            v-model="course.status"></el-switch>
          </el-form-item>
        </div>
        <!-- 点击按钮下一步 -->
        <el-form-item style="float:right;margin-top: 20px">
          <el-button v-if="activeStep !== steps.length - 1" @click="activeStep++">下一步</el-button>
          <el-button v-else type="primary" @click="onSubmit">保存信息</el-button>
        </el-form-item>
      </el-form>
    </el-card>
 </div>
</template>

<script>

import { saveOrUpDate, getCourseById } from '@/services/course'
import CourseImage from './CourseImage'
import TextEditor from '@/components/etxtEditor/index'
export default {
  props: {
    isedit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [Number, String]
    }
  },
  components: {
    CourseImage,
    TextEditor
  },
  // 组件创建完毕，检测当前功能是否编辑功能
  created () {
    if (this.isedit) {
      this.loadCourse()
    }
  },
  data () {
    return {
      // 控制处于哪一个步骤（0代表第一步）
      activeStep: 0,
      // 步骤条相关信息
      steps: [
        { id: 1, title: '基本信息' },
        { id: 2, title: '课程封面' },
        { id: 3, title: '销售信息' },
        { id: 4, title: '秒杀信息' },
        { id: 5, title: '课程详情' }
      ],
      // 本地图片预览
      imageUrl: '',
      // 将数据中的id相关的值全部去除，因为只有编辑时，才使用id
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        // 课程详细信息
        courseDescriptionMarkDown: '',
        // 商品原价
        price: 0,
        // 销售价格
        discounts: 0,
        priceTag: '',
        // 活动标签
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        // 课程封面地址
        courseListImg: '',
        // 解锁封面地址
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        // 上架状态
        status: 0,
        // 销量
        sales: 0,
        // 秒杀信息状态
        activityCourse: false,
        // 秒杀
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          // 开始时间
          beginTime: '',
          // 结束时间
          endTime: '',
          // 秒杀活动价格
          amount: 0,
          // 秒杀库存剩余
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  methods: {
    // 保存信息
    async onSubmit () {
      const { data } = await saveOrUpDate(this.course)
      if (data.code === '000000') {
        this.$message(`${this.isedit ? '编辑' : '添加'}成功`)
        this.$router.push({
          name: 'course'
        })
      }
    },
    // 编辑功能通过id获取元素的内容
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      // 判断当前课程的秒杀状态，如果未开始秒杀，数据就需要重新渲染
      if (!data.data.activityCourse) {
        data.data.activityCourseDTO = {
          // 开始时间
          beginTime: '',
          // 结束时间
          endTime: '',
          // 秒杀活动价格
          amount: 0,
          // 秒杀库存剩余
          stock: 0
        }
      }
      this.course = data.data
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
