<template>
  <div>
    <el-form :model="form">
        <el-form-item :model="form" label="广告位置名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
 </div>
</template>

<script>
import { spaceOrUpdate } from '@/services/adver'
export default {
  name: 'dialogbox',
  // 判断是不是编辑功能
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    // 传递当前行的id
    rowName: {
      type: String
    }
  },
  data () {
    return {
      form: {}
    }
  },
  methods: {
    // 点击确定保存发送请求
    async onSubmit () {
      const { data } = await spaceOrUpdate(this.form)
      console.log(data)
      // 发送自定义事件告诉父组件子组件需要关闭提示框
      this.$emit('success')
      this.form = {}
    }
  },
  created () {
    // 加载数据
    if (this.isEdit) {
      this.form.name = this.rowName
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
