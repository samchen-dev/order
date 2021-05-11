<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>创建订单</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <OrderRoot></OrderRoot>
    </el-card>
  </div>
</template>

<script>
import OrderRoot from './wizard/OrderRoot.vue'

export default {
  name: 'orderWizard',
  // 注册子组件
  components: {
    OrderRoot
  }
}
</script>

<style lang="less" scoped>

</style>
