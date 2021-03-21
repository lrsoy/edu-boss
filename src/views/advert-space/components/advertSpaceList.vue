<template>
  <div>
    <el-button @click="onTianjia" style="margin-bottom:10px">添加广告位</el-button>
    <el-dialog
      :title="isEdit? '编辑' : '添加' "
      :visible.sync="dialogVisible"
      width="30%">
      <!-- 自定义事件需要接收 -->
      <dialogbox v-if="dialogVisible" @success="success" :is-edit="isEdit" :row-name="rowName"></dialogbox>
    </el-dialog>

   <el-table
      :data="location"
      style="width: 100%">
      <el-table-column
        prop="spaceKey"
        label="spaceKey">
      </el-table-column>
      <el-table-column
      align="center"
        prop="name"
        label="广告位信息">
      </el-table-column>
      <el-table-column
      align="center"
        prop="createTime"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | disposeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
      align="center"
        prop="updateTime"
        label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | disposeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
      align="center"
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="onBianji(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
 </div>
</template>

<script>
import dialogbox from './dialogbox'
import { getAdverSpaces } from '@/services/adver'
export default {
  name: 'advertSpaceList',
  components: {
    dialogbox
  },
  data () {
    return {
      // 存储数据
      location: [],
      // 点击添加按钮弹出对话框
      dialogVisible: false,
      // 判断是不是编辑功能
      isEdit: false,
      // 存储正在编辑的id
      rowName: ''
    }
  },
  created () {
    this.loadAdvsplaces()
  },
  methods: {
    async loadAdvsplaces () {
      const { data } = await getAdverSpaces()
      this.location = data.content
    },
    // 监听子组件的变化成功是，关闭提示框
    success () {
      // 添加成功关闭窗口
      this.dialogVisible = false
      // 自动刷新列表
      this.loadAdvsplaces()
    },
    // 添加按钮设置
    onTianjia () {
      this.dialogVisible = true
      this.isEdit = false
    },
    // 点击编辑按钮
    onBianji (row) {
      this.isEdit = true
      // 让对话框显示
      this.dialogVisible = true
      this.rowName = row.name
    }
  },
  // 使用过滤器处理时间
  filters: {
    disposeTime (data) {
      data = new Date(data)
      return `
        ${data.getFullYear()}-${data.getMonth() + 1} - ${data.getDate()}
        ${data.getHours()} - ${data.getMinutes()}:${data.getSeconds()}
      `
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
