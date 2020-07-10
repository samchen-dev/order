<template>
  <!-- 主页容器 -->
  <el-container class="home-container">
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
          <el-submenu index="1">
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
          <el-submenu index="2">
            <el-menu-item index="/product">
              <i class="el-icon-paperclip"></i>
              <span slot="title">产品分类</span>
            </el-menu-item>
            <el-menu-item index="/sheet">
              <i class="el-icon-data-line"></i>
              <span slot="title">产品报价</span>
            </el-menu-item>
            <el-menu-item index="/ordermain">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">创建订单</span>
            </el-menu-item>
            <el-menu-item index="2-3">
              <i class="el-icon-view"></i>
              <span slot="title">跟踪订单</span>
            </el-menu-item>
            <template slot="title">
              <i class="el-icon-document"></i>
              <span slot="title">订单管理</span>
            </template>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-magic-stick"></i>
              <span slot="title">个人中心</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-user"></i>
              <span slot="title">个人信息</span>
            </el-menu-item>
            <el-menu-item index="3-2">
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
export default {
  name: 'Home',
  data() {
    return { isCollapse: true }
  },
  methods: {
    // 退出系统工能
    logout() {
      // 清除token
      window.sessionStorage.clear()
      // 路由重定向
      this.$router.replace('/login')
    }
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
