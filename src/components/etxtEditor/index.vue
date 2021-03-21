<template>
  <div ref="editor">
 </div>
</template>

<script>
// 富文本编辑器
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'
export default {
  name: 'wangeditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    // 富文本编辑器初始化
    this.initEditor()
  },
  methods: {
    // 富文本编辑器
    initEditor () {
      const editor = new E(this.$refs.editor)
      // 创建编辑器之前设置事件
      editor.config.onchange = value => {
        this.$emit('input', value)
      }
      // 配置自定义上传图片功能
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        if (data.code === '000000') {
          // 通过insertImgFn传给富文本编辑器
          insertImgFn(data.data.name)
        }
      }
      editor.create()
      // 设置内容
      editor.txt.html(this.value)
      this.editor = editor
    }
  },
  watch: {
    value () {
      if (this.isLoaded === false) {
        this.editor.txt.html(this.value)
        this.isLoaded = true
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
