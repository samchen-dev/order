<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品报价</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <el-tabs tab-position="right">
        <el-tab-pane label="白刚玉">白刚玉报价单</el-tab-pane>
        <el-tab-pane label="棕刚玉">棕刚玉报价单</el-tab-pane>
        <el-tab-pane label="铬钢玉">铬钢玉报价单</el-tab-pane>
        <el-tab-pane label="板状刚玉">板状刚玉报价单</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Sheet'
}
</script>

<style scoped>
.el-tab-pane {
  font-size: 12px !important;
}
</style>
