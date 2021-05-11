<template>
  <!-- 主页容器 -->
  <el-container v-if="renderFalg" class="home-container">
    <!-- TOP栏 -->
    <el-header height="80px">
      <div>
        <el-radio-group v-model="isCollapse">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <span>SINABUDDY 订单管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧导航 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu default-active="1-1" class="el-menu-vertical-demo"
          :collapse="isCollapse" unique-opened router>
          <el-submenu index="1" v-if="haveRoles.includes(getRoleID(roleMap.get('ADMIN')))">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">系统管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-user"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/rules">
              <i class="el-icon-s-operation"></i>
              <span slot="title">权限管理</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2" v-if="haveRoles.includes(getRoleID(roleMap.get('MANAGER')))">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>
              <span slot="title">报价管理</span>
            </template>
            <el-menu-item index="/product">
              <i class="el-icon-paperclip"></i>
              <span slot="title">产品分类</span>
            </el-menu-item>
            <el-menu-item index="/sheet">
              <i class="el-icon-data-line"></i>
              <span slot="title">产品报价</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3" v-if="haveRoles.includes(getRoleID(roleMap.get('SALESMAN')))">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">订单管理</span>
            </template>
            <el-menu-item index="/ordermain">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">创建订单</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-view"></i>
              <span slot="title">跟踪订单</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4" v-if="haveRoles.includes(getRoleID(roleMap.get('SUPPLY')))">
            <template slot="title">
              <i class="el-icon-school"></i>
              <span slot="title">货源管理</span>
            </template>
            <el-menu-item index="/factoryList">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">工厂信息</span>
            </el-menu-item>
            <el-menu-item index="/supplyAgentList">
              <i class="el-icon-s-marketing"></i>
              <span slot="title">生产安排</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-magic-stick"></i>
              <span slot="title">个人中心</span>
            </template>
            <el-menu-item index="/personal">
              <i class="el-icon-user"></i>
              <span slot="title">密码修改</span>
            </el-menu-item>
            <el-menu-item index="5-2">
              <i class="el-icon-search"></i>
              <span slot="title">业务统计</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧工作区 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>

import OrderInfo from './form/OrderInfo'

export default {
  name: 'Home',
  data() {
    return {
      isCollapse: true,
      // 所有角色
      roles: null,
      // 渲染组件
      renderFalg: false,
      // 拥有的角色
      haveRoles: null,
      // 角色名称
      roleMap: OrderInfo.RoleName,
    }
  },
  methods: {
    // 退出系统工能
    logout() {
      // 清除token
      window.sessionStorage.clear()
      // 路由重定向
      this.$router.replace('/login')
    },
    async loadData() {
      console.log('loadData')
      // 加载所有的角色
      {
        const { data: res } = await this.$http.get('/user/allRoles/v1')
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.roles = res.data.roles
        this.haveRoles = window.sessionStorage.getItem('user.roles').split(',')
      }
      // 渲染组件
      this.renderFalg = true
    },
    getRoleID(title) {
      const role = this.roles.find((item) => item.title === title)
      return role._id
    }
  },
  created() {
    this.loadData()
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #ffffff;
  line-height: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #909399;
  font-size: 32px;
  font-weight: bold;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #ffffff;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #ffffff;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
