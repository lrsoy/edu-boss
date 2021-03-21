<template>
  <div>
      <el-card>
        <el-tree
          :data="menus"
          :props="defaultProps"
          default-expand-all
          node-key="id"
          show-checkbox
          ref="menutree"
          :default-checked-keys="checkedkeys"
        ></el-tree>
        <div style="margin: 20px">
          <el-button @click="onReset">清空</el-button>
          <el-button type="primary" @click="onSave">保存</el-button>
        </div>
      </el-card>
 </div>
</template>

<script>
import { getMenuNodeList, allocate, getRoleMenus } from '@/services/menu'
export default {
  name: 'alockmenu',
  // 接收参数
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedkeys: []
    }
  },
  created () {
    // 加载所有的菜单选项
    this.loadMenus()
    // 加载当前角色已经分配的菜单
    this.loadgetRoleMenus()
  },
  methods: {
    // 数据筛选方法 (筛选出菜单被选中的 id 值)
    getcheckedkeys (menus) {
      //  遍历数据 （将所有存在子节点的node进行排除  ，尽管特已经被选中)
      menus.forEach((menu) => {
        if (!menu.selected) {
          // eslint-disable-next-line no-useless-return
          return
        }
        // 检测是否有子节点
        if (menu.subMenuList) {
          // 使用递归，对子节点的选中状态进行判断
          return this.getcheckedkeys(menu.subMenuList)
        }
        // 说明选中的单个节点（不存在节点的子节点） 存储id即可
        this.checkedkeys = [...this.checkedkeys, menu.id]
      })
    },
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    async onSave () {
      // 发送请求 一角色id，二菜单每一项的id
      const { data } = await allocate({
        roleId: this.roleId,
        menuIdList: this.$refs.menutree.getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message('分配成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    // 点击按钮清空
    onReset () {
      this.$refs.menutree.setCheckedKeys([])
    },
    // 加载所有菜单信息
    async loadgetRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getcheckedkeys(data.data)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
