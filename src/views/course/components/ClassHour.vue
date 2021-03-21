<template>
  <div>
   <el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="课程名称">
    <el-input disabled="disabled" v-model="form.courseName"></el-input>
  </el-form-item>
  <el-form-item label="章节名称">
    <el-input disabled="disabled" v-model="form.sectionName"></el-input>
  </el-form-item>
  <el-form-item label="课时名称">
    <el-input v-model="form.theme"></el-input>
  </el-form-item>
  <el-form-item label="时长">
     <el-input v-model="form.duration" type="number" :min="0">
       <template slot="append">分钟</template>
     </el-input>
  </el-form-item>
  <el-form-item label="开放试听">
    <el-switch v-model="form.isFree"></el-switch>
  </el-form-item>
  <el-form-item label="课程排序">
    <el-input-number v-model="form.orderNum" controls-position="right" lable="描述文字"></el-input-number>
    </el-form-item>
</el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleClassHour = false">取 消</el-button>
      <el-button type="primary" @click="addClassHour">确 定</el-button>
    </span>
 </div>
</template>

<script>
import { addClassHour, getBySectionId } from '@/services/course-section'
export default {
  name: 'ClassHour',
  props: {
    isClassHour: {
      type: Boolean,
      default: false
    },
    theme: String,
    duration: [Number, String],
    isFree: Boolean,
    courseName: String,
    orderNum: [Number, String],
    sectionId: [String, Number]
  },
  data () {
    return {
      form: {}
    }
  },
  created () {
    this.form.courseName = this.courseName
    if (this.isClassHour) {
      this.form.theme = this.theme
      this.form.duration = this.duration
      this.form.isFree = this.isFree
      this.form.orderNum = this.orderNum
    }
    // 加载章节名称
    this.loadSectionName()
  },
  methods: {
    // 添加功能
    async addClassHour () {
      const { data } = await addClassHour(this.form)
      console.log(data)
      // 发送自定义事件
      this.$emit('addDispose')
    },
    // 获取章节name
    async loadSectionName () {
      const { data } = await getBySectionId(this.sectionId)
      this.form.sectionName = data.data.sectionName
      console.log(this.form)
    }

  }
}
</script>

<style lang='scss' scoped>
</style>
