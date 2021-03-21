<template>
  <div>
    <el-form>
      <el-form-item label="角色名称" >
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input  v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" >
        <el-input v-model="role.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSibmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createOrUpdate, getRoleById } from '@/services/role'
export default {
  name: 'createOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [String, Number, Object]
    }
  },
  data () {
    return {
      role: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  methods: {
    // 取消提交
    onCancel () {
      this.$emit('cancel')
      this.role = []
      if (!this.isEdit) {
        this.role = {}
      } else {
        this.loadRole()
      }
    },
    async onSibmit () {
      const { data } = await createOrUpdate(this.role)
      console.log(data)
      // 关闭提示框
      this.$emit('shut')
      this.$message('添加成功')
      // 清除表單內容
      this.role = []
    },
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      if (data.code === '000000') {
        this.role = data.data
      }
    }
  },
  created () {
    if (this.isEdit) {
      // 加载数据
      this.loadRole()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
