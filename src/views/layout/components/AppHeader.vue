<template>
<div class="app-header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
    </el-breadcrumb>
    <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
            <el-avatar
            :size="30"
            :src="userInfo.portrait"></el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
            <el-dropdown-item
            @click.native="dropOut()"
            >退出</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</div>
</template>

<script>
// 引入user文件
import { getUserInfo } from '@/services/user'
export default {
  name: 'AppHeader',
  data () {
    return {
      // 用户信息接收
      userInfo: {}
    }
  },
  methods: {
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    // 退出
    dropOut () {
      // 弹出提示框，是否确定退出
      this.$confirm('确认退出吗？', '退出意识', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除用户信息
        this.$store.commit('setUser', null)

        // 跳转登录页
        this.$router.push('/login')

        // 提示退出
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消退出!'
        })
      })
    }
  },
  created () {
    //   加载用户信息
    this.loadUserInfo()
  }
}
</script>

<style lang='scss' scoped>
.app-header {
  height: 100%;
  display: flex;
  align-items: center; // 设置垂直居中
  justify-content: space-between;
  color: white;
}
.el-dropdown{
    .el-dropdown-link{
        display: flex;
        align-items: center;
    }
}
</style>
