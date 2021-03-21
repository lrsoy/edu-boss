<template>
  <div>
    <el-card>
      <el-button @click="addResource">添加</el-button>
      <div>
        <el-dialog
        v-if="centerDialogVisible"
          :title=" isEdit ? '编辑资源分类' : '添加资源分类' "
          :visible.sync="centerDialogVisible"
          width="30%"
          center>
          <classification @succeedAdd="succeedAdd" :name="name" :sort="sort" v-if="centerDialogVisible" :is-edit="isEdit"></classification>
        </el-dialog>
      </div>
      <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="createdTime"
              label="创建时间">
              <template slot-scope="scope">
                <span>{{ scope.row.createdTime | disposeTime }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="sort"
              label="排序">
            </el-table-column>
            <el-table-column
              label="操作">
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
 </div>
</template>

<script>
import classification from './components/classification'
import { getResourceCatgeory, delatecategory } from '@/services/resource'
export default {
  name: 'resourceCategory',
  components: {
    classification
  },
  data () {
    return {
      tableData: [],
      centerDialogVisible: false,
      isEdit: false,
      // 资源分类所需内容
      name: '',
      sort: ''
    }
  },
  created () {
    this.loadCatgeory()
  },
  methods: {
    async loadCatgeory () {
      const { data } = await getResourceCatgeory()
      if (data.code === '000000') {
        this.tableData = data.data
      }
    },
    // 删除
    handleDelete (rowData) {
      this.$confirm('确认删除吗？, 删除提示', {
      }).then(async () => {
        // 发送删除请求
        const { data } = await delatecategory(rowData.id)
        // 删除后自动更新
        if (data.code === '000000') {
          this.$message.info('删除成功')
          // 删除后刷新数据
          this.loadCatgeory()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    addResource () {
      this.centerDialogVisible = true
      this.isEdit = false
    },
    // 编辑功能
    handleEdit (row) {
      console.log(row)
      this.centerDialogVisible = true
      this.isEdit = true
      // 将当前行的数据传递给表单
      this.name = row.name
      this.sort = row.sort
    },
    // 编辑保存
    succeedAdd () {
      // 重新加载数据
      this.loadCatgeory()
      this.centerDialogVisible = false
    }
  },
  // 处理时间
  filters: {
    disposeTime (data) {
      data = new Date(data)
      return `
        ${data.getFullYear()}-${data.getMonth() + 1} - ${data.getDate()}
        ${data.getHours()}-${data.getMinutes()}:${data.getSeconds()}
      `
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
