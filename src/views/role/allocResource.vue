<template>
  <div>
    <el-card>
      <el-tree
        :data="resources"
        :props="defaultProps"
        default-expand-all
        node-key="id"
        show-checkbox
        ref="roletree"
        :default-checked-keys="checkedkeys"
      >
      </el-tree>
    </el-card>
    <div class="resoure-item">
      <!-- @click="handlesave" -->
      <el-button type="primary" @click="onsave">保存</el-button>
      <el-button type="primary" @click="onReset">清空</el-button>
    </div>
  </div>
</template>

<script>
// allocateRoleResources
import { getRoleResources, allocateRoleResources } from '@/services/role'
export default {
  name: 'allocResource',
  // 接收参数
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      checkedkeys: [],
      resources: [],
      defaultProps: {
        children: 'resourceList',
        label: 'name'
      }
    }
  },
  created () {
    //  加载资源分配列表
    this.loadgetRoleList()
  },
  methods: {
    // 判断是否被选中  数据筛选
    getCheckedKeys (roles) {
      // 将存在子节点的选项进行排除
      roles.forEach(item => {
        if (!item.selected) {
          // eslint-disable-next-line no-useless-return
          return
        }
        // 说明选中的叶子节点（不存在节点的子节点） 存储id即可
        this.checkedkeys = [...this.checkedkeys, item.id]
      })
    },
    // 获取资源列表
    async loadgetRoleList () {
      const { data } = await getRoleResources(this.roleId)
      if (data.code === '000000') {
        this.resources = data.data
        this.getCheckedKeys(data.data)
      }
      console.log(data)
    },
    // 保存资源列表
    async onsave () {
      const { data } = await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList: this.$refs.roletree.getCheckedKeys()
      })
      // 成功处理并且跳转回去
      if (data.code === '000000') {
        // 提示信息
        this.$message('保存成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    // 点击按钮清空
    onReset () {
      this.$refs.roletree.setCheckedKeys([])
    }
  }
}
</script>

<style lang='scss' scoped>
.resoure-item{
  display: flex;
  justify-content: center;
  margin-top:10px;
}
</style>
