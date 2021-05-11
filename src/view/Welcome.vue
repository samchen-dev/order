<template>
  <div class="wrap-banner">
    <h2 style="text-transform:uppercase;" class="main-title">WELCOME {{ user }} !</h2>
    <el-dialog title="警告" :visible.sync="errorDialogVisible" width="30%" center>
      <span v-text="msg"></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {
      // 用户名称
      user: window.sessionStorage.getItem('user'),
      // 错误提示信息
      msg: null,
      // 错误对话框控制标记
      errorDialogVisible: false,
    }
  },
  created() {
    // 判断是否需要打开错误提示框
    if (this.$route.query.msg) {
      this.msg = this.$route.query.msg
      this.errorDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.wrap-banner {
  position: relative;
  -ms-flex-align: center;
  -webkit-box-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.main-title {
  color: #909399;
  z-index: 999;
}
</style>
