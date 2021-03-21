<template>
  <div>
    <!-- 使用 http-request 使用自己的逻辑代码进行处理 值为函数-->
    <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :http-request="handUpImg"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="value" :src="value" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
 </div>
</template>

<script>
import { uploadImg } from '@/services/adver'
export default {
  props: {
    value: {
      type: String
    },
    limit: {
      type: Number,
      default: 5
    }
  },
  name: 'uploadingImg',
  data () {
    return {
      // 本地图片预览
      imageUrl: ''
    }
  },
  methods: {
    // 上传图片请求
    // - option上传文件的相关信息
    async handUpImg (options) {
      // -option.file是上传的文件信息
      // 使用Formdata对象处理数据
      const fd = new FormData()
      fd.append('file', options.file)
      // 发送上传请求
      const { data } = await uploadImg(fd)
      // 服务端返回上传成功后的图片地址data.content.name
      // - 因为是子组件，需要向鼓组件传递值，就需要将值发送给父组件
      // - 又因为父组件是通过v-model进行绑定的，默认v-model触发@input事件
      this.$emit('input', data.content.name)
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
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
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
 ::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
