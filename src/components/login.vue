<template>
  <div>
    <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">欢迎登录</h3>
      <el-form-item label="账号" prop="username">
        <el-input type="text" placeholder="请输入账号" v-model="loginForm.username"/>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="loginForm.password" show-password/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" v-on:click="submitForm()" style="float: right">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data: function () {
      return {
        loginForm: {
          username: null,
          password: null
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'}
          ],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        },
        showLogin: false,
        ip: ''
      }
    },
    methods: {
      submitForm: function () {
        this.doRequest({
          method: 'post',
          url: this.HOST + '/login',
          data: {
            username: this.loginForm.username,
            password: this.loginForm.password
          }
        }).then(response => {
          localStorage.setItem('TOKEN', response.result.token)
          localStorage.setItem('LOGINED_USER', response.result.sysUser)
          this.$router.push('/index')
        })
      }
    }
  }
</script>

<style scoped>
  .login-box {
    border: 1px solid #dcdfe6;
    width: 400px;
    margin: 180px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }

  .login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
  }

  .mt20 {
    margin-top: 20px;
  }
</style>
