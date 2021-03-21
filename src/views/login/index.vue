<template>
  <div class="login">
    <el-form
    :label-position="labelPosition"
    ref="form"
    :model="form"
    :rules="rules"
    label-width="80px">
      <el-form-item label="用户名" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
        :loading="isLoading"
        type="primary"
        @click="onSubmit">登录</el-button>
      </el-form-item>
   </el-form>
 </div>
</template>

<script>
import { login } from '@/services/user'
export default {
  name: 'index',
  data () {
    return {
      // 判断按钮是不是被点击
      isLoading: false,
      labelPosition: 'top',
      // 存储表单数据
      form: {
        phone: '',
        password: ''
      },
      // 表单验证规则
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 1.设置校验，获取里面是否填写正确
        await this.$refs.form.validate()
        // 在登录之前设置按钮 通过使用element组件的btn按钮的属性设置，限制重复点击按钮
        this.isLoading = true
        // 2.发送请求
        const { data } = await login(this.form)
        // 登录失败按钮会禁止点击，直至弹框消失
        this.isLoading = false
        // 3.响应数据处理
        if (data.state === 1) {
          // 成功提示框
          this.$message.success('登录成功...')
          // 发送提交
          this.$store.commit('setUser', data.content)

          /*
          所有的都处理玩在进行路由跳转。
          根据可能储存的fullpath数据进行跳转设置
          */
          // 路由跳转
          /**
           * $touter是对象，用来路由跳转，调用方法
           * $route而是存储的事当前路由的信息
           */
          this.$router.push(this.$route.query.redirect || '/')
          // 如果没有信息就会重新跳转到home页面
        } else {
          this.$message.error('登录失败！！！')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.login {
  // 容器撑满高度
  height: 100vh;
  display: flex;
  // 内容水平垂直居中
  align-items: center;
  justify-content: center;
  background-color: #E9EEF3;
  .el-form {
    background-color: #fff;
    width: 300px;
    padding: 20px;
    border-radius: 10px;

    .el-button {
      width: 100%;
    }
  }
}
</style>
