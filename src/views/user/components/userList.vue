<template>
  <div>
      <el-form :inline="true" :model="filterParams" class="demo-form-inline" >
        <el-form-item label="手机哈">
            <el-input v-model="filterParams.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <div class="block">
            <el-date-picker
            v-model="filterParams.rangeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            value-format="yyyy-MM-dd">
            </el-date-picker>
        </div>
        </el-form-item>
        <el-form-item>
            <el-button @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表展示 -->
      <el-table
      v-loading="loading"
      :data="users"
      style="width: 100%">
        <el-table-column
            prop="id"
            label="用户ID"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="头像"
            width="180">
            <template slot-scope="scope">
                <img width="30px"  :src="scope.row.portrait || 'http://n1-q.mafengwo.net/s16/M00/EC/A5/CoUBUl8xMvKAAVvUAABEuLnuDG476.jpeg?imageMogr2%2Fthumbnail%2F%2116x16r%2Fgravity%2FCenter%2Fcrop%2F%2116x16%2Fquality%2F90'" alt="">
            </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="用户名">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="手机号">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="注册时间">
            <template slot-scope="scope">
                <span>{{ scope.row.createTime | dataFormat }}</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态">
        </el-table-column>
        <el-table-column
            label="操作">
            <template slot-scope="scrop">
                <el-button type="text" @click="handleSelect(scrop.row)">分配角色</el-button>
            </template>
        </el-table-column>
     </el-table>
    <div class="block">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filterParams.current"
        :page-sizes="[20]"
        :page-size="filterParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :disabled="loading"
        >
        </el-pagination>
    </div>
    <el-dialog
    title="分配角色"
    :visible.sync="dialogVisible"
    width="50%">
    <!-- 下拉菜单位置 -->
    <el-select v-model="roleIdList" multiple placeholder="请选择">
    <el-option
      v-for="item in roles"
      :key="item.value"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAlloc">确 定</el-button>
    </span>
    </el-dialog>
 </div>
</template>

<script>
import { getUserPagesList } from '@/services/user'
import { getAllRole, allocateUserRoles, getUserRoles } from '@/services/role'
export default {
  name: 'userList',
  data () {
    return {
      users: [],
      filterParams: {
        phone: '',
        rangeDate: [],
        currentPage: 1,
        pageSize: 20,
        // userId: 0,
        // 开始时间
        startCreateTime: '',
        // 结束时间
        endCreateTime: '',
        // 状态
        status: ''
      },
      loading: false,
      total: 0,
      //   用于控制对话框是否显示
      dialogVisible: false,
      //   下拉菜单数据
      roles: [],
      //   选中选项的id组陈的数组，提交到后台
      roleIdList: [],
      //   保存当前用户的id
      currentRoleId: null
    }
  },
  created () {
    this.LoadUserList()
  },
  methods: {
    //   查询按钮
    onSubmit () {
      this.filterParams.currentPage = 1
      this.LoadUserList()
    },
    // 请求用户数据列表
    async LoadUserList () {
      this.loading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUserPagesList(this.filterParams)
      if (data.code === '000000') {
        this.users = data.data.records
        this.total = data.data.total
      }
      this.loading = false
      console.log(data)
    },
    handleSizeChange (val) {
      this.filterParams.pageSize = val
      this.filterParams.currentPage = 1
      this.LoadUserList()
    },
    handleCurrentChange (val) {
      this.filterParams.currentPage = val
      this.LoadUserList()
    },
    // 显示对话框 带年纪分配角色按钮
    async handleSelect (userInfo) {
      //  存储当前用户的id
      this.currentRoleId = userInfo.id
      this.dialogVisible = true
      // 请求角色列表数据
      const { data } = await getAllRole()
      if (data.code === '000000') {
        this.roles = data.data
      }
      //   请求当前用户已经分配的角色
      const { data: data1 } = await getUserRoles(userInfo.id)
      if (data1.code === '000000') {
        this.roleIdList = data1.data.map(item => item.id)
      }
    },
    // 进行分配操作
    async handleAlloc () {
      const { data } = await allocateUserRoles({
        userId: this.currentRoleId,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        this.$message('分配角色成功')
        this.dialogVisible = false
      }
    }
  },
  // 处理日期时间过滤器
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

<style lang='scss' scoped>
</style>
