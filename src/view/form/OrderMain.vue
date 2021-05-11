<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>创建订单</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片显示区域 -->
    <el-card class="box-card" style="height:400px;">
      <div class="wizard-button-group">
        <el-button type="primary" @click="gotolink('/orderwizard')">向导模式</el-button>
        <el-button type="primary" @click="gotolink('/orderexpert')">专家模式</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import OrderInfo from './OrderInfo'

export default {
  name: 'orderMain',
  methods: {
    gotolink(url) {
      this.$router.replace(url)
    }
  },
}
</script>

<style lang="less" scoped>
.wizard-button-group {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
