<template>
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <el-button
    @click="$router.push('/menu/create')"
    >添加菜单</el-button>
  </div>
    <el-table
    :data="tableData"
    border
    style="width: 100%;vertical-align: middle">
    <el-table-column
      label="编号"
      width="50"
      type="index"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="菜单名称"
      width="200">
    </el-table-column>
    <el-table-column
      prop="level"
      label="菜单级数"
      width="200">
    </el-table-column>
    <el-table-column
      prop="icon"
      label="前端图标"
      width="200"
      >
    </el-table-column>
    <el-table-column
      prop="orderNum"
      label="排序"
      width="200"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      >
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-card>
</template>

<script>
import { getAllMenu, delateMenu } from '@/services/menu'
export default {
  name: 'index',
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.loadAllMenus()
  },
  methods: {
    handleEdit (rowData) {
      // 路由跳转
      this.$router.push({
        name: 'edit',
        params: {
          id: rowData.id
        }
      })
    },
    handleDelete (rowData) {
      this.$confirm('确认删除吗？, 删除提示', {
      }).then(async () => {
        // 发送删除请求
        const { data } = await delateMenu(rowData.id)
        // 删除后自动更新
        if (data.code === '000000') {
          this.$message.info('删除成功')
          this.loadAllMenus()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 获取所有菜单信息
    async loadAllMenus () {
      const { data } = await getAllMenu()
      if (data.code === '000000') {
        this.tableData = data.data
      }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
