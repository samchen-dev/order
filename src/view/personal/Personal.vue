<template>
  <div v-if="renderFalg">
    <el-form class="userForm" ref="userFormRef" :rules="userRules" :model="user" label-width="80px" size="mini">
      <el-row :gutter="10">
        <el-col :span="colWidth[0]" style="height: 1px;"></el-col>
        <el-col :span="colWidth[1]">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="user.name" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="colWidth[2]"></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="colWidth[0]" style="height: 1px;"></el-col>
        <el-col :span="colWidth[1]">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="colWidth[2]"></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="colWidth[0]" style="height: 1px;"></el-col>
        <el-col :span="colWidth[1]">
          <el-form-item label="用户角色" prop="roles">
            <el-checkbox-group v-model="user.roles">
              <el-checkbox name="roleArray" v-for="role in roles" :label="role._id" :key="role._id" :disabled="true">{{ role.title }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="colWidth[2]"></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="colWidth[0]" style="height: 1px;"></el-col>
        <el-col :span="colWidth[1]">
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="user.mail" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="colWidth[2]"></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="colWidth[0]" style="height: 1px;"></el-col>
        <el-col :span="colWidth[1]">
          <el-form-item label="密码" prop="password">
            <el-input v-model="user.password" placeholder="请输入现在使用的密码" type="password" show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="colWidth[2]"></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="colWidth[0]" style="height: 1px;"></el-col>
        <el-col :span="colWidth[1]">
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="user.newPassword" placeholder="请输入你需要修改的密码" type="password" autocomplete="off" show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="colWidth[2]"></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="colWidth[0]" style="height: 1px;"></el-col>
        <el-col :span="colWidth[1]">
          <el-form-item label="确认密码" prop="newPassword2">
            <el-input v-model="user.newPassword2" placeholder="再次输入新密码，请保持两次输入的密码一致！" type="password" autocomplete="off" show-password></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="colWidth[2]"></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="colWidth[0]" style="height: 1px;"></el-col>
        <el-col :span="colWidth[1]">
          <el-form-item label="手机" prop="phone">
            <el-input v-model="user.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="colWidth[2]"></el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="colWidth[0]" style="height: 1px;"></el-col>
        <el-col :span="colWidth[1]" style="text-align:center;">
          <el-button type="primary" @click="resetForm();" size="mini">重置</el-button>
          <el-button type="primary" @click="updateForm()"  size="mini">更新</el-button>
        </el-col>
        <el-col :span="colWidth[2]"></el-col>
      </el-row>
    </el-form>
    <!-- 更新用户的密码成功调用的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="updateDialogVisible"
      width="40%"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <span style="text-align:center">成功更新用户的密码、手机联系方式，但需要立即从新登录！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="logout()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Personal',
  data() {
    // 验证手机
    const validatePhone = (rule, value, callback) => {
      console.log('validatePhone')
      if (value === '') {
        callback(new Error('电话号码不能为空！'))
      } else if (!/^1[0-9]{10}$/.test(value)) {
        callback(new Error('请按照国内手机要求填写！'))
      } else {
        callback()
      }
    }
    const validateNewPassword2 = (rule, value, callback) => {
      console.log('validateNewPassword2')
      if (value !== this.user.newPassword) {
        callback(new Error('两次输入的密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      // 更新用户成功提示对话框控制标记
      updateDialogVisible: false,
      // 渲染控制标记
      renderFalg: false,
      // el-col宽度
      colWidth: [8, 8, 8],
      // 用户信息
      user: null,
      // 角色数组
      roles: [],
      // 验证规则
      userRules: {
        password: [
          { required: true, message: '当前使用的密码不能为空', trigger: 'blur' },
          { min: 6, max: 10, message: '密码长度在 6 到 10 个字符！', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空！', trigger: 'blur' },
          { min: 6, max: 10, message: '密码长度在 6 到 10 个字符！', trigger: 'blur' }
        ],
        newPassword2: [
          { required: true, message: '请再次输入新密码！', trigger: 'blur' },
          { min: 6, max: 10, message: '密码长度在 6 到 10 个字符！', trigger: 'blur' },
          { validator: validateNewPassword2, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系方式不能为空！', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    // 加载用户信息
    async loadDate() {
      console.log('loadDate')
      // 加载角色信息
      {
        const { data: res } = await this.$http.get('/user/allRoles/v1')
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.roles = res.data.roles
      }
      // 加载用户信息
      {
        const { data: res } = await this.$http.get('/user/profile/v1', {
          params: {
            _id: window.sessionStorage.getItem('userID'),
          }
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.user = res.data.user
        // 密码验证字段清空
        this.user.password = ''
      }
      // 渲染组件
      this.renderFalg = true
    },
    // 重置表单内容
    resetForm() {
      console.log('resetForm')
      this.$refs.userFormRef.resetFields()
    },
    // 更新表单内容
    updateForm() {
      console.log('updateForm')
      this.$refs.userFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/user/replace/v1', { user: this.user })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 打开提示对话框
        this.updateDialogVisible = true
      })
    },
    // 登出系统
    logout() {
      this.updateDialogVisible = false
      // 清除token
      window.sessionStorage.clear()
      // 路由重定向
      this.$router.replace('/login')
    }
  },
  created() {
    console.log('created....')
    this.loadDate()
  }
}
</script>


<style scoped>
.userFrom>>>.el-form-item label:after {
  content: " ";
  display: inline-block;
  width: 100%;
}

.userFrom>>>.el-form-item__label {
  text-align: justify;
  line-height: 20px;
}

/* .userFrom>>>.el-form-item.is-required .el-form-item__label:before {
  content: none !important;
} */
</style>
