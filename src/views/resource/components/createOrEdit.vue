<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="资源名称">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
         <el-form-item label="资源路径">
            <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item  label="资源分类">
            <el-select v-model="form.categoryId" placeholder="请选择活动区域">
               <el-option
                 v-for="item in region"
                 :key="item.id"
                 :label="item.name"
                 :value="item.id"></el-option>
            </el-select>
       </el-form-item>
       <el-form-item label="资源描述">
            <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="onCancel">取消</el-button>
            <el-button @click="onSubmit" type="primary">确定</el-button>
        </el-form-item>
    </el-form>
 </div>
</template>

<script>
import { getResourceCatgeory, saveOrderUpdate, getResourceId } from '@/services/resource'
export default {
  name: 'createOrEdit',
  // 接收父组件传递过来的参数
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    resoureId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      form: {
        name: '',
        url: '',
        // 资源描述
        description: '',
        categoryId: ''
      },
      //  下拉列表数据.
      region: []
    }
  },
  created () {
    this.loadRosour()
    this.loadGetRosour()
  },
  methods: {
    // 下拉列表数据获取
    async loadRosour () {
      const { data } = await getResourceCatgeory()
      if (data.code === '000000') {
        this.region = data.data
      }
    },
    // 点击按钮间数据提交
    async onSubmit () {
      const { data } = await saveOrderUpdate(this.form)
      if (data.code === '000000') {
        // 清空表单内容
        this.form = {}
        // 点击确定按钮关闭窗口，给父组件传递自定义事件
        this.$emit('shut')
        // 提示用户添加成功
        this.$message('添加成功')
      }
    },
    // 点击取消
    onCancel () {
      this.form = {}
      this.$emit('cancel')
    },
    // 将获取到的数据传到form里面
    async loadGetRosour () {
      const { data } = await getResourceId(this.resoureId)
      if (data.code === '000000') {
        this.form = data.data
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
