<template>
  <div class="aside">
<el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#F8F9FB"
      text-color="black"
      :unique-opened=true
      router
      active-text-color="black">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
          <el-menu-item index="/role">
            <i class="el-icon-document"></i>
            <span>角色管理</span>
          </el-menu-item>
           <el-menu-item index="/menu">
            <i class="el-icon-document"></i>
            <span>菜单列表</span>
          </el-menu-item>
           <el-menu-item index="/resource">
            <i class="el-icon-document"></i>
            <span>资源列表</span>
          </el-menu-item>
      </el-submenu>
      <el-menu-item index="/course">
        <i class="el-icon-menu"></i>
        <span slot="title">课程管理</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <i class="el-icon-document"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">广告管理</span>
        </template>
        <el-menu-item index="/advert">
          <i class="el-icon-document"></i>
          <span>广告列表</span>
        </el-menu-item>
        <el-menu-item index="/advert-space">
          <i class="el-icon-document"></i>
          <span>广告位列表</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
 </div>
</template>

<script>
export default {
  name: 'AppAside',
  data () {
    return {
    }
  }
}
</script>

<style lang='scss' scoped>
.aside{
  height: 100%;
  .el-menu{
  height: 100%;
  border: none;
 }
}
</style>
