<template>
  <div class="createEdit">
    <!-- Card 组件 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 设置标题 -->
        <span>{{ isEdit  ? '编辑菜单' : '添加菜单' }}</span></div>
            <!-- Form 组件 -->
            <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="菜单名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单路径">
                <el-input v-model="form.href"></el-input>
            </el-form-item>
            <el-form-item label="上级菜单">
                <el-select v-model="form.parentId" placeholder="请选择上级菜单">
                  <!-- 无上级菜单，也就是一级菜单 -->
                  <el-option label="无上级菜单" :value="-1"></el-option>
                  <!-- 绑定获取的上级菜单展示 -->
                <el-option
                  v-for="item in parentMenuList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="前端图标">
                <el-input v-model="form.icon"></el-input>
            </el-form-item>
            <el-form-item label="是否显示">
                <el-radio-group v-model="form.shown">
                    <!-- 里面的布尔值会通过v-model帮顶给show -->
                    <el-radio :label='true'>是</el-radio>
                    <el-radio :label='false'>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="form.orderNum" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <!-- 通过对props里面的defaulty值进行判断是否显示按钮 -->
                <el-button v-if="!isEdit">重置</el-button>
            </el-form-item>
            </el-form>
      </el-card>
  </div>
</template>

<script>
import { getEditMenuInfo, createOrUpdataMenu } from '@/services/menu'
export default {
  props: {
    isEdit: {
      // 表单数据
      type: Boolean,
      // 默认添加功能
      default: false
    }
  },
  name: 'createEdit',
  data () {
    return {
      form: {
        parentId: 1,
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: true
      },
      // 存储上级菜单数据
      parentMenuList: []
    }
  },
  created () {
    // 加载上级菜单信息
    this.loadMenuInfo()
  },
  methods: {
    async onSubmit () {
      // 表单验证（）
      // 发送请求
      const { data } = await createOrUpdataMenu(this.form)
      if (data.code === '000000') {
        // 提示用户
        this.$message.success('提交成功')
        // 页面跳转
        this.$router.push({
          name: 'menu'
        })
      }
    },
    async loadMenuInfo () {
      // 检测是否存在路由参数id并对应处理
      const id = this.$route.params.id || -1
      // 请求菜单数据（上级菜单，一级菜单）
      const { data } = await getEditMenuInfo(id)
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
        // 检测是否存在菜单数据，如果存在，更新给from
        if (data.data.menuInfo) {
          this.form = data.data.menuInfo
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
