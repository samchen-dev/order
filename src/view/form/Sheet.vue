<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品报价</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片显示区域 -->
    <el-card class="box-card">
      <!-- 显示报价分类 -->
      <el-tabs tab-position="right">
        <el-tab-pane v-for="item in products" :lazy="true" :label="item.title"><Rank v-bind:id="item._id"></Rank></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// 引入子组件
import Rank from './Rank.vue'

export default {
  name: 'Sheet',
  data() {
    return {
      // 产品名称列表
      products: [],
      // 新建报价分类验证规则
      addQuoteRules: {
        level: [{ required: true, message: '级别名不能为空！', trigger: 'blur' }],
        port: [{ required: true, message: '港口名不能为空！', trigger: 'change' }]
      }
    }
  },
  created() {
    // 初始化列表
    this.listProduct()
  },
  methods: {
    // 获取产品名称列表
    async listProduct() {
      console.log('listProduct')
      const { data: res } = await this.$http.get('product/list/v1')
      if (res.meta.status !== 200) {
        return this.$message.err(res.meta.msg)
      }
      this.products = res.data.products
    },
    // 解决键盘输入问题
    change(e) {
      console.log('change')
      return this.$forceUpdate()
    },
    // 添加分类价格
    addAssort(index) {
      console.log('addAssort')
      this.newLevel.assort.splice(index + 1, 0, { size: '', quote: '', spece: '' })
    },
    // 删除分类价格
    delAssort(index) {
      console.log('delAssort')
      // 不能删除唯一的一个分类报价
      if (this.newLevel.assort.length > 1) {
        this.newLevel.assort.splice(index, 1)
      }
    },
    // 向上移动
    upAssort(index) {
      console.log('upAssort')
      if (index > 0) {
        const to = JSON.parse(JSON.stringify(this.newLevel.assort[index]))
        const from = JSON.parse(JSON.stringify(this.newLevel.assort[index - 1]))
        this.$set(this.newLevel.assort, index - 1, to)
        this.$set(this.newLevel.assort, index, from)
      }
      console.log(this.newLevel.assort)
    },
    // 向下移动
    downAssort(index) {
      console.log('downAssort')
      if (index < this.newLevel.assort.length - 1) {
        const to = JSON.parse(JSON.stringify(this.newLevel.assort[index]))
        const from = JSON.parse(JSON.stringify(this.newLevel.assort[index + 1]))
        this.$set(this.newLevel.assort, index + 1, to)
        this.$set(this.newLevel.assort, index, from)
      }
      console.log(this.newLevel.assort)
    },
    // 添加级别
    addLevel() {
      // 添加到级别列表
      console.log('addLevel')
      this.$refs.addQuoteFromRef.validate(val => {
        if (!val) return
        this.levelData.push(this.newLevel)
        this.addDialogVisible = false
      })
    },
    // 起运港返回建议列表
    querySearch(queryString, cb) {
      cb(this.restaurants)
    },
    // 潜在港口信息列表
    loadAll() {
      return [
        { value: '天津,TIANJIN' },
        { value: '青岛,QINGDAO' },
        { value: '上海,SHANGHAI' },
        { value: '连云港,LIANYUNGANG' },
        { value: '天津港/青岛港, TIANJIN/QINGDAO' }
      ]
    },
    handleSelect(item) {
      console.log(item)
    },
    // 关闭添加事件
    addDialogClose() {
      console.log('addDialogClose')
      // this.$refs.addQuoteFromRef.resetFields()
      // this.newLevel.assort = [{ size: '', quote: '', spece: '' }]
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  // 注册子组件
  components: {
    Rank
  }
}
</script>

<style lang="less">
.col-button {
  .el-form-item__content {
    margin-left: 0px !important;
    text-align: right;
  }
}

.addDialog {
  .el-dialog__header {
    // .el-dialog__title {}
  }
  .el-dialog__body {
    padding-bottom: 10px !important;
    .el-form {
      .el-row {
        .el-col {
          .el-form-item {
            margin-bottom: 16px !important;
            font-size: 12px !important;
          }
        }
      }
    }
  }
}
</style>
