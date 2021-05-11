<template>
  <div class="login_container">
    <div class="login_box">
      <!-- LOGO 显示区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单显示区 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid" :autofocus="true"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-s-goods" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login()">登陆</el-button>
          <el-button type="info" @click="resetLogin()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '用户名能为空！', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 6 到 10 个字符！', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空！', trigger: 'blur' },
          { min: 6, max: 10, message: '密码长度在 6 到 10 个字符！', trigger: 'blur' }
        ]
      }
    };
    let mailPass = (rule, value, callback) => {
      console.log('mailPass')
    }
  },
  methods: {
    // 重置
    resetLogin() {
      this.$refs.loginForm.resetFields()
    },
    // 登陆
    login() {
      // 验证登陆表单数据是否符合要求
      this.$refs.loginForm.validate(async val => {
        if (!val) return

        // 发送请求到server
        const { data: res } = await this.$http.post('/user/login/v1', this.loginForm)
        console.log('login data:', res)
        if (res.meta.status === 200) {
          // 存储token,提示登陆成功
          window.sessionStorage.setItem('token', res.data.token)
          window.sessionStorage.setItem('user', res.data.user)
          window.sessionStorage.setItem('userID', res.data.userID)
          window.sessionStorage.setItem('user.roles', res.data.roles)
          this.$message.success('登陆成功！')
          // 跳转到路由到登陆后的主页面
          this.$router.replace('/home')
        } else {
          // 提示登陆失败
          this.$message.error(res.meta.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
