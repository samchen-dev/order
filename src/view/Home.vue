<template>
  <div>
    <el-button @click="logout" type="info">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
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

</style>
