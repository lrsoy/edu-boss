<template>
  <div>
    <el-card>
      <div slot="header"></div>
    <el-form>
      <el-form-item label="视频上传" >
        <input type="file"  ref="video-file">
      </el-form-item>
      <el-form-item label="封面上传">
        <input  ref="image-file" type="file">
      </el-form-item>
      <el-form-item>
        <el-button @click="handleUpload">开始上传</el-button>
        <el-button @click="$router.push({
          name: 'management',
          params: {
            courseId
          }
        })">返回</el-button>
      </el-form-item>
      <el-form-item>
        <p v-if="uploadPercent !== 0">视频上传中：{{ uploadPercent }}%</p>
        <p v-if="isUploadSucces">视频转码中:{{ isTranscodeSussess ? '完成' : '正在转码中....' }}</p>
      </el-form-item>
    </el-form>
    </el-card>
 </div>
</template>

<script>
import { aliyunImagUploadAddressAdnAuth, aliyunVideoUploadAddressAdnAuth, aliyunTransCode, aliyunTransCodePercent } from '@/services/aliyunUpload'
export default {
  name: 'video-file',
  props: {
    courseId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      // 存储数据 用于视频上传凭证
      imageURL: '',
      // 保存上传
      uploader: null,
      // 保存上传视频的id
      videoId: null,
      // 视频上传进度
      uploadPercent: 0,
      // 上传完毕状态
      isUploadSucces: false,
      // 转码完毕状态
      isTranscodeSussess: false
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    handleUpload () {
      // 可能重复使用某一个组件进行上传处理，点击上传是将数据重置
      this.uploadPercent = 0
      this.isUploadSucces = false
      this.isTranscodeSussess = false
      // 获取上传的文件（视频、图片）
      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      // 需要上传的文件添加到上传列表上  先传递图后传递视频
      this.uploader.addFile(imageFile)
      this.uploader.addFile(videoFile)
      // 开始上传
      this.uploader.startUpload()
    },
    // 初始化上传对象
    initUploader () {
      // 官方示例：声明 AliyunUpload.Vod 初始化回调。
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传 图与视频
        onUploadstarted: async uploadInfo => {
          let uploadAddressAndAuth = null
          console.log('执行了', uploadInfo)
          // 检测是不是图片
          if (uploadInfo.isImage) {
            // 是图片进行处理
            const { data } = await aliyunImagUploadAddressAdnAuth()
            if (data.code === '000000') {
              // 3. data.data 即为凭证信息组成的对象
              uploadAddressAndAuth = data.data
              // 5. 保存图片地址，给视频接口使用
              this.imageURL = uploadAddressAndAuth.imageURL
            }
          } else {
            // 是视频进行处理
            const { data } = await aliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            if (data.code === '000000') {
              // 6. 存储凭证
              //  - 图片与视频上传的区别在于图片存在 imageId，视频为 videoId，其他相同
              uploadAddressAndAuth = data.data
              this.videoId = data.data.videoId
              console.log()
            }
            console.log(data)
          }
          // 设置凭证与地址
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
          // 设置完毕   紧接着处理上传进度传利
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
          // console.log('执行了', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          // console.log('执行了', uploadInfo, code, message)
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          // console.log('onUploadTokenExpired', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          this.isUploadSucces = true
          const lessonId = this.$route.query.lessonId
          // 视频转码请求
          const { data } = await aliyunTransCode({
            lessonId,
            coverImageUrl: this.imageURL,
            fileId: this.videoId,
            fileName: this.$refs['video-file'].files[0].name
          })
          if (data.code === '000000') {
            // 一段时间就需要进行查看
            const timer = setInterval(async () => {
              const { data } = await aliyunTransCodePercent(lessonId)
              if (data.code === '000000') {
                if (data.data === 100) {
                  this.$message('视频转码成功')
                  clearInterval(timer)
                }
              }
            }, 1000)
          }
          this.isTranscodeSussess = true
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
