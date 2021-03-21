<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="课程名称">
            <el-input disabled="disabled" :readonly="true" v-model="form.courseName"></el-input>
          </el-form-item>
          <el-form-item label="章节名称">
            <el-input v-model="form.sectionName"></el-input>
          </el-form-item>
          <el-form-item label="章节描述">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number v-model="form.orderNum" controls-position="right" lable="描述文字"></el-input-number>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitEditing" v-if="isEdit">确定提交</el-button>
        <el-button type="primary" @click="onSubmit" v-else>确 定</el-button>
      </span>
 </div>
</template>

<script>
// 更新报错数据
import { saveOrUpdateCourse } from '@/services/course'
import { saveOrUpdateSection } from '@/services/course-section'
export default {
  name: 'Coursedialog',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    // 接收父组件传递过来的参数
    courseName: String,
    description: String,
    orderNum: [Number, String],
    sectionName: String
  },
  data () {
    return {
      // 添加阶段
      form: {
      }
    }
  },
  methods: {
    // 控制对话框
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 添加保存
    async onSubmit () {
      const { data } = await saveOrUpdateCourse(this.form)
      if (data.code === '000000') {
        // 发送自定义事件更改父组件内部的isedit状态，让窗口关闭
        this.$emit('shut')
      }
    },
    async onSubmitEditing () {
      const { data } = await saveOrUpdateSection(this.form)
      if (data.code === '000000') {
        this.$emit('editing')
      }
    }
  },
  created () {
    // 组件加载调用方法
    if (this.isEdit) {
      this.form.courseName = this.courseName
      this.form.sectionName = this.sectionName
      this.form.description = this.description
      this.form.orderNum = this.orderNum
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
