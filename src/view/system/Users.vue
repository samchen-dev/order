<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <!-- 用户搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="14">
          <el-input placeholder="请输入内容" v-model="search">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openAddDialog()">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表显示区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" min-width="3%"></el-table-column>
        <el-table-column prop="username" label="用户名" min-width="10%"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="7%"></el-table-column>
        <el-table-column prop="roles" label="权限" :formatter="formatRoles" min-width="25%"></el-table-column>
        <el-table-column prop="mail" label="邮箱" min-width="20%"></el-table-column>
        <el-table-column prop="phone" label="电话" min-width="15%"></el-table-column>
        <el-table-column label="状态" min-width="10%">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.disableFlog" @change="updateDisableFlog(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="10%">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改用户信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row)" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加新用户对话框 -->
    <el-dialog title="添加新用户" :visible.sync="addDialogVisible" @close="addDialogClose()" width="50%">
      <el-form ref="userFormRef" :model="userForm" :rules="addUserRules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="username">
              <el-input v-model="userForm.username" placeholder="用户名" size="mini" @input="change($event)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="password">
              <el-input v-model="userForm.password" type="password" placeholder="密码" size="mini" @input="change($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="phone">
              <el-input v-model="userForm.phone" placeholder="电话" size="mini" @input="change($event)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="mail">
              <el-input v-model="userForm.mail" placeholder="邮箱" size="mini" @input="change($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="name">
              <el-input v-model="userForm.name" placeholder="姓名" size="mini" @input="change($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-checkbox-group v-model="roles">
              <el-checkbox v-for="item in roleList" :label="item._id">{{ item.title }}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="createUser()" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱
    let validateMail = (rule, value, callback) => {
      console.log('validateMail')

      if (value === '') {
        callback(new Error('邮箱名称不能为空！'))
      } else if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)) {
        callback(new Error('邮箱名称不符合要求，请从新填写！'))
      } else {
        callback()
      }
    }
    // 验证邮箱
    let validatePhone = (rule, value, callback) => {
      console.log('validatePhone')
      if (value === '') {
        callback(new Error('电话号码不能为空！'))
      } else if (!/^1[0-9]{10}$/.test(value)) {
        callback(new Error('电话号码不符合要求，请从新填写！'))
      } else {
        callback()
      }
    }
    // 验证用户名指接受字符串
    let validateUsername = (rule, value, callback) => {
      console.log('validateUsername')
      if (value === '') {
        callback(new Error('用户名不能为空！'))
      } else if (!/^[A-Za-z]+$/.test(value)) {
        callback(new Error('用户名称不符合要求，请从新填写！'))
      } else {
        callback()
      }
    }
    return {
      // 查询条件
      search: null,
      // 用户列表
      userList: [],
      // 添加新用户对话框的控制标记
      addDialogVisible: false,
      // 添加新用户
      userForm: {},
      // 角色列表
      roleList: [],
      // 选中的角色
      roles: [],

      // 表单验证规则
      addUserRules: {
        username: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空！', trigger: 'blur' },
          { min: 6, max: 10, message: '密码长度在 6 到 10 个字符！', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '邮箱名称不能为空！', trigger: 'blur' },
          { validator: validateMail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '电话号码不能为空！', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空！', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 打开添加用户对话框
    async openAddDialog() {
      const { data: res } = await this.$http.get('/user/allRoles/v1')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleList = res.data.roles
      this.addDialogVisible = true
    },
    // 保存用户
    createUser() {
      // 验证表单数据是否符合要求
      this.$refs.userFormRef.validate(async val => {
        if (!val) return
        console.log('createUser')
        console.log(this.roles)
        this.userForm.roles = this.roles
        const { data: res } = await this.$http.post('/user/register/v1', this.userForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.addDialogVisible = false
        this.$message.success(res.meta.msg)
        // 更新用户列表
        this.getUserList()
        // 清空表单项和保存数据的对象
        this.$refs.userFormRef.resetFields()
        this.roles = []
      })
    },
    // 关闭添加新用户对话框的事件
    addDialogClose() {
      // 清空表单项和保存数据的对象
      console.log('addDialogClose')
      this.$refs.userFormRef.resetFields()
      this.roles = []
    },
    // 返回用户列表
    async getUserList() {
      console.log('getUsername')
      const username = this.search ? this.search : ""
      console.log(username)
      const { data: res } = await this.$http.get('/user/list/v1', {
        params: {
          username
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      const users = res.data.userList
      this.userList = users
    },
    // 更新用户状态
    async updateDisableFlog(userInfo) {
      const { data: res } = await this.$http.get('/user/updateDisableFlog/v1', {
        params: {
          _id: userInfo._id,
          disableFlog: userInfo.disableFlog
        }
      })

      if (res.meta.status !== 200) {
        // 用户状态更新失败，回复之前状态
        userInfo.disableFlog = !userInfo.disableFlog
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 删除用户
    async delUser(userInfo) {
      console.log('delUser')
      const { data: res } = await this.$http.get('/user/delete/v1', {
        params: {
          _id: userInfo._id,
          username: userInfo.username
        }
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getUserList()
      this.$message.success(res.meta.msg)
    },
    // 格式化显示用户的角色信息
    formatRoles(row, column) {
      console.log('formatRoles')
      if (row.roles.length > 0) {
        const roles = []
        row.roles.map(item => roles.push(item.title))
        return roles.join(',')
      }
      return ''
    },
    // 解决键盘输入问题
    change(e) {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
.el-form-item {
  margin-bottom: 15px;
  font-size: 12px;
}
</style>
