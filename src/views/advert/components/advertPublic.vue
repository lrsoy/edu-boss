<template>
  <div>
    <el-card>
      <el-form ref="form" :model="form" label-width="80px">
        <!-- 广告位名称 -->
    <el-form-item label="广告名称">
      <el-input v-model="form.name" style="width:600px"></el-input>
    </el-form-item>
    <el-form-item label="广告位置">
      <el-select v-model="form.spaceId" placeholder="选择广告所在的位置">
        <el-option v-for="item in advListGuanggao" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开始时间">
      <div class="block">
        <el-date-picker
          v-model="form.startTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>
    </el-form-item>
    <el-form-item label="结束时间">
      <div class="block">
        <el-date-picker
          v-model="form.endTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>
    </el-form-item>
    <el-form-item label="上线/下线">
       <el-switch
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="1"
        :inactive-value="0"
        v-model="form.status">
       </el-switch>
    </el-form-item>
    <el-form-item label="广告图片">
      <uploading-img :limit='6' v-model="form.img"></uploading-img>
       <el-button v-if="isEdit" @click="clearImg">删除照片</el-button>
    </el-form-item>
    <el-form-item label="广告连接">
      <el-input v-model="form.link" style="width:600px"></el-input>
    </el-form-item>
    <el-form-item label="广告备注">
      <el-input type="textarea" v-model="form.text"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
    </el-card>
 </div>
</template>

<script>
// import qs from 'qs'
import uploadingImg from './uploadingImg'
import { getAdverSpaces, addOrUpdate, getAdById } from '@/services/adver'
export default {
  name: 'advertPublic',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number]
    }
  },
  components: {
    uploadingImg
  },
  data () {
    return {
      form: {},
      // 广告位置信息存储
      advListGuanggao: []
    }
  },
  methods: {
    // 点击按钮删除图片
    clearImg () {
      this.form.img = ''
    },
    // 加载课程位置
    async loadwb () {
      const { data } = await getAdverSpaces()
      this.advListGuanggao = data.content
    },
    // 将数据发送给服务端完成创建
    async onSubmit () {
      const { data } = await addOrUpdate(this.form)
      console.log(data)
      this.$router.push({
        name: 'advert'
      })
      this.loadwb()
    },
    // 编辑功能 根据id加载课程信息
    async loadAdvert () {
      const { data } = await getAdById(this.id)
      this.form = data.content
    }
  },
  created () {
    this.loadwb()
    // 组件创建完毕检测是否是编辑功能
    if (this.isEdit) {
      this.loadAdvert()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
