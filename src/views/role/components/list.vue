<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form"  :model="form">
          <el-form-item label="角色名称">
            <el-input  v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-loading="isLoading" @click="onSubmit">查询</el-button>
            <el-button @click="clearInput">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button  @click="handleAdd">添加角色</el-button>
      <el-dialog
        :title="isEdit ? '编辑角色':'添加角色'"
        :visible.sync="dialogVisible"
        width="50%">
          <!-- 将添加与编辑功能放置在组件的内部 -->
        <create-or-edit
          v-if="dialogVisible"
          :is-edit="isEdit"
          @cancel="cancel"
          @shut="shut"
          :role-id="roleId">
        </create-or-edit>
      </el-dialog>
       <el-table :data="tableData" style="width: 100%" v-loading="isLoading"
        >
        <el-table-column prop="id" label="编号" width="180">
        </el-table-column>
        <el-table-column label="角色名称" prop="name" width="180">
        </el-table-column>
        <el-table-column label="描述" prop="description">
        </el-table-column>
        <el-table-column label="添加时间" prop="createdTime">
          <template slot-scope="scope">
                <span>{{ scope.row.createdTime | dataFormat }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" prop="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="$router.push({
                name:'alockmenu',
                params: {
                  roleId: scope.row.id
                }
                })">分配菜单</el-button>
              <el-button type="text" @click="$router.push({
                name: 'allocResource',
                params: {
                  roleId: scope.row.id
                }
              })">分配资源</el-button>
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
 </div>
</template>

<script>
import { getRoles, delateRole } from '@/services/role'
import createOrEdit from './createOrEdit'
export default {
  name: 'list',
  data () {
    return {
      form: {
        name: ''
      },
      isLoading: false,
      tableData: [],
      dialogVisible: false,
      // 控制对话框的功能状态（就是根据不同的值显示不同功能的列表）
      isEdit: false,
      // 存储正在编辑的角色id
      roleId: ''
    }
  },
  // 侦听器侦听里面的数据变化
  watch: {
    roleId (newId, odeId) {
      console.log(newId)
      if (newId === '') {
        this.loadRoles()
      }
    }
  },
  methods: {
    // 查询操作
    async onSubmit () {
      const { data } = await getRoles(this.form)
      if (data.code === '000000') {
        this.tableData = data.data.records
      }
    },
    // 点击按钮清空输入框
    clearInput () {
      this.form.name = ''
      // 刷新数据
      this.loadRoles()
    },
    // 获取所有角色
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRoles(this.form)
      if (data.code === '000000') {
        this.tableData = data.data.records
        this.isLoading = false
      }
    },
    // 删除功能
    handleDelete (role) {
      this.$confirm('确认删除角色', '删除提示').then(
        async () => {
          await delateRole(role.id)
          this.$message('删除成功')
          this.loadRoles()
        }
      ).catch(err => {
        if (err && err.response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消操作')
        }
      })
    },
    // 关闭对话框
    shut () {
      this.dialogVisible = false
      // 刷新列表
      this.loadRoles()
    },
    // 取消状态
    cancel () {
      this.dialogVisible = false
    },
    // 添加功能
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    },
    // 编辑功能
    handleEdit (role) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = role.id
    }
  },
  created () {
    this.loadRoles()
    // this.loadRolesName()
  },
  //   处理日期
  filters: {
    dataFormat (data) {
      data = new Date(data)
      return `
        ${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}
        ${data.getHours()}-${data.getMinutes()}:${data.getSeconds()}
      `
    }
  },
  components: {
    createOrEdit
  }
}
</script>

<style lang='scss' scoped>
</style>
