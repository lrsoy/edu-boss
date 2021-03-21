<template>
  <div>
    <el-button style="margin-bottom: 10px;" @click="$router.push({
      name: 'addAdvertise'
    })">添加课程</el-button>
    <el-table
      :data="advers"
      style="width: 100%">
      <el-table-column
       align="center"
        prop="id"
        label="ID"
        width="100">
      </el-table-column>
      <el-table-column
      align="center"
        prop="name"
        label="广告名称"
        width="500">
      </el-table-column>
      <el-table-column
        align="center"
        label="广告位置">
      </el-table-column>
      <el-table-column
      align="center"
        prop="img"
        label="广告图片">
        <div class="adver-img" slot-scope="scope">
          <img :src="scope.row.img" alt="">
        </div>
      </el-table-column>
      <el-table-column
      align="center"
        prop="createTime"
        label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column
      align="center"
        prop="status"
        label="上线/下线">
        <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                @change="onStateChange(scope.row)"
                >
              </el-switch>
        </template>
      </el-table-column>
      <el-table-column
      align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="$router.push({
            name: 'redactAdvertise',
            params: {
            id: scope.row.id
            }
          })">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
 </div>
</template>

<script>
import { getAdverList, getAdverSpaces, postDdDtO } from '@/services/adver'
export default {
  name: 'advertList',
  data () {
    return {
      // 课程详情
      advers: [],
      // 广告位置存储位置
      adversSpacesName: []
    }
  },
  created () {
    // 加载广告列表
    this.loadAdverList()
    // // 加载广告位置
    this.loadAdverSpaces()
  },
  methods: {
    // 获取广告列表
    async loadAdverList () {
      const { data } = await getAdverList()
      this.advers = data.content
    },
    // 获取广告位置
    async loadAdverSpaces () {
      const { data } = await getAdverSpaces()
      this.adversSpacesName = data.content
    },
    // 修改上架状态
    onStateChange (advertList) {
      this.$confirm('是否进行上架/下架操作', '删除提示').then(
        async () => {
          await postDdDtO({
            id: advertList.id,
            status: advertList.status
          })
          // 更改状态后重新加载
          this.loadAdverList()
        }
      ).catch(() => {
        this.$message('操作失败')
      })
    }
  },
  // 处理时间格式
  filters: {
    timeFormat (data) {
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
.adver-img{
  img {
    width: 100px;
  }
}
.el-table-column{
  display: flex;
  justify-content: center;
}
</style>
