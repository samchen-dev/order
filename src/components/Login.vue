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
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
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
    const isEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空！'));
      } else {
        const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
        if (reg.test(value)) {
          // 用户名符合验证规则
          this.$refs.loginForm.validateField('password')
        } else {
          // 用户名验证不符合规则
           callback(new Error('用户名不符合邮箱登陆规则！'))
        }
      }
      callback();
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {
            validator: isEmail, trigger: 'blur'
          }
        ],
        password: [
            { required: true, message: '密码不能为空！', trigger: 'blur' },
            { min: 6, max: 10, message: '长度在 6 到 10 个字符！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLogin() {
      this.$refs.loginForm.resetFields()
    },
    login() {
      this.$refs.loginForm.validate(
        val => {
          if (!val) {
            console.log(val);
          }
        }
      )
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
