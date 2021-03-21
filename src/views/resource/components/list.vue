<template>
  <div class="resource-list">
    <!-- 使用 Card 组件 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 使用 Form 组件：行内表单 -->
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          class="demo-form-inline"
        >
          <el-form-item
            label="资源名称"
            prop="name">
            <el-input
              v-model="form.name"
              clearable
              placeholder="资源名称"></el-input>
          </el-form-item>
          <el-form-item label="路径" prop="url">
            <el-input v-model="form.url"
            clearable
             placeholder="路径"></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="form.categoryId" clearable placeholder="资源分类">
              <el-option
              v-for="item in resoureC"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button  @click="handleAdd">添加角色</el-button>
            <el-dialog
              :title="isEdit ?'编辑':'添加'"
              :visible.sync="dialogVisible"
               width="35%">
              <!-- 将内部的表单抽成一个组件，单独放置在这里 -->
              <create-or-edit
                v-if="dialogVisible"
                :is-edit="isEdit"
                @cancel="cancel"
                @shut="shut"
                :resoure-id="resoureId"
                ></create-or-edit>
            </el-dialog>
            <el-button @click="$router.push({
              name: 'Category'
            })">资源分类</el-button>
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="loading">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 使用 Table 组件 -->
      <el-table
         v-loading="loading"
        :data="resources"
        style="width: 100%">
        <el-table-column
          type="index"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源地址">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column label="添加时间">
            <template slot-scope="scope">
                <span>{{ scope.row.createdTime | dataFormat }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
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
    <div class="block">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 15, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="loading"
        >
        </el-pagination>
    </div>
  </div>
</template>

<script>
// 引入请求文件
import { getResourcePages, getResourceCatgeory, delateResource } from '@/services/resource'
import createOrEdit from './createOrEdit'
// 对话框组件
export default {
  components: { createOrEdit },
  name: 'ResourceList',
  data () {
    return {
      resources: [],
      form: {
        current: 1,
        // 显示条数
        size: 10,
        // 资源名字
        name: '',
        // 资源地址
        url: '',
        // 资源分类ID
        categoryId: ''
      },
      //  获取页码数据
      totalCount: 0,
      // 渲染下拉列表，存储资源分类数据
      resoureC: [],
      // 用于保存加载状态
      loading: false,
      // 处理 对话框显示
      dialogVisible: false,
      // 通过变量显示不同表单
      isEdit: false,
      // 用来存储获取到的id
      resoureId: ''
    }
  },
  // 钩子函数监听数据变化
  created () {
    // 加载所有资源数据
    this.loadResources()
    // 加载资源列表
    this.loadResourceCatgeory()
    // 加载资源分类
  },
  methods: {
    async loadResources () {
      // 开始加载前设置，不让其操作数据
      this.loading = true
      const { data } = await getResourcePages(this.form)
      // 检测
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
        // 请求成功取消加载状态
        this.loading = false
      }
    },
    // 每一页显示条数变化进行触发
    handleSizeChange (val) {
      this.form.size = val
      // 由于修改了每页显示条术语，应当页数还原为原来数
      this.form.current = 1
      this.loadResources()
    },
    // 页码变化刷新数据
    handleCurrentChange (val) {
      this.form.current = val
      // 刷新数据
      this.loadResources()
    },
    // 加载资源列表
    async loadResourceCatgeory () {
      const { data } = await getResourceCatgeory()
      if (data.code === '000000') {
        this.resoureC = data.data
        console.log(data)
      }
    },
    // 提交筛选功能
    onSubmit () {
      // 在每一次查询之前将页码恢复到称原始
      this.form.current = 1
      // 更新数据
      this.loadResources()
    },
    // 表单重置按钮
    onReset () {
      this.$refs.form.resetFields()
    },
    // 关闭对话框
    shut () {
      this.dialogVisible = false
      // 加载所有资源数据
      this.loadResources()
      // 加载资源列表
      this.loadResourceCatgeory()
    },
    // 取消关闭按钮
    cancel () {
      this.dialogVisible = false
    },
    // 删除功能
    handleDelete (resoure) {
      this.$confirm('确认删除？', '删除提示').then(
        async () => {
          await delateResource(resoure.id)
          this.$message('删除成功')
          // 加载所有资源数据
          this.loadResources()
        }
      ).catch(err => {
        if (err && err.response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消操作')
        }
      })
    },
    // 添加功能
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    },
    // 编辑功能
    handleEdit (resource) {
      this.dialogVisible = true
      this.isEdit = true
      this.resoureId = resource.id
    }
  },
  //   处理日期
  filters: {
    dataFormat (data) {
      data = new Date(data)
      return `
        ${data.getFullYear()}-${data.getMonth() + 1} - ${data.getDate()}
        ${data.getHours()} - ${data.getMinutes()}:${data.getSeconds()}
      `
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
