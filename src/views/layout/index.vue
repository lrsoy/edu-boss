<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <app-aside></app-aside>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <app-header></app-header>
      </el-header>
      <!-- 主体 -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 引入头部组件与侧边组件
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader.vue'
export default {
  name: 'index',
  data () {
    return {
    }
  },
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang='scss' scoped>
.el-container{
  height: 100vh;
}
.el-header{
       background-color: #F8F9FB;
}
</style>
