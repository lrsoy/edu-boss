<template>
  <div>
  <el-form :model="form" >
            <el-form-item label="名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="form.sort"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit">确 定</el-button>
          </span>
 </div>
</template>

<script>
import { classSaveOrderUpdate } from '@/services/resource'
export default {
  name: 'classification',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    name: String,
    sort: [Number, String]
  },
  data () {
    return {
      form: {}
    }
  },
  created () {
    // 1 判断isEdit的状态
    if (this.isEdit) {
      this.form.name = this.name
      this.form.sort = this.sort
    }
  },
  methods: {
    async onSubmit () {
      const { data } = await classSaveOrderUpdate(this.form)
      if (data.code === '000000') {
        this.$emit('succeedAdd')
        this.$message(`${this.isEdit ? '编辑' : '添加'}成功`)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
