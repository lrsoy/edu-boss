<template>
  <div>
<el-form-item :label="lable">
  <!-- 进度组件 -->
  <el-progress :width="178" v-if="isUploading" type="circle" :percentage="precentage"></el-progress>
  <!-- 上传组件 -->
    <el-upload
      :status="precentage === 100 ? 'success' : undefined"
      v-else
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :http-request="handleUpload"
      :before-upload="beforeAvatarUpload">
      <!-- 上传课程图片展示位置 -->
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </el-form-item>
 </div>
</template>

<script>
import { uploadCourseImage } from '@/services/course'
export default {
  name: 'CourseImage',
  props: {
    value: {
      type: String
    },
    lable: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      // 控制进度条是否处于一个上传状态
      isUploading: false,
      // 进度条百分比
      precentage: 0
    }
  },
  methods: {
    // 上传图片  option为上传相关信息
    //      - file为上传信息
    async handleUpload (option) {
      //    - 请求前显示进度条
      this.isUploading = true
      const fd = new FormData()
      fd.append('file', option.file)
      // - 参数二是控制进图条
      const { data } = await uploadCourseImage(fd, event => {
        // 通过math方法进行向下取整
        this.precentage = Math.floor(event.loaded / event.total * 100)
      })
      console.log(data)
      if (data.code === '000000') {
        // 上传课程封面 使用自定义事件将获取的值传给父组件
        this.$emit('input', data.data.name)
        this.isUploading = false
        // 避免下次重新选择图片进度条退回去
        this.precentage = 0
      }
    },
    // 上传图片成功回调
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传前的回调
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
 ::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
