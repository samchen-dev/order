<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="product-card">
      <el-row>
        <el-col :span="6"><div class="grid-content"></div></el-col>
        <el-col :span="12">
          <el-form :model="product" :rules="productRules" ref="productFormRef" label-width="100px" label-position="right" size="mini">
            <el-form-item label="分类名称" prop="title">
              <el-input v-model="product.title" placeholder="分类标题" maxlength="10" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="分类描述" prop="description">
              <el-input v-model="product.description" :rows="4" placeholder="分类描述" type="textarea"></el-input>
            </el-form-item>
            <div class="product-button-group">
              <el-button-group>
                <el-button type="primary" @click="addProduct()" size="mini">确认</el-button>
                <el-button type="primary" @click="resetProduct()" size="mini">重置</el-button>
              </el-button-group>
            </div>
          </el-form>
        </el-col>
        <el-col :span="6"><div class="grid-content"></div></el-col>
      </el-row>
      <el-tag
        v-for="product in products"
        :key="product.title"
        :type="tag[Math.floor(Math.random() * 5)].type"
        closable
        @close="delProduct(product._id, product.title)"
        @click="editProduct(product._id, product.title)"
      >
        {{ product.title }}
      </el-tag>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 标签颜色
      tag: [{ type: '' }, { type: 'success' }, { type: 'info' }, { type: 'warning' }, { type: 'danger' }],
      // 创建产品分类
      product: {
        _id: '',
        title: '',
        description: ''
      },
      productRules: {
        title: [{ required: true, message: '标题不能为空！', trigger: 'blur' }],
        description: [{ required: true, message: '表述不能为空！', trigger: 'blur' }]
      },
      // 已创建的分类列表
      products: []
    }
  },
  created() {
    // 初始化列表
    this.listProduct()
  },
  methods: {
    // 添加新的产品分类
    addProduct() {
      console.log('addProduct')
      // 验证表单项数据是否符合要求
      this.$refs.productFormRef.validate(async val => {
        if (!val) return
        const { data: res } = await this.$http.post('/product/create/v1', { product: this.product })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.products = this.listProduct()
        this.$refs.productFormRef.resetFields()
      })
    },
    // 删除产品名称
    async delProduct(_id, title) {
      console.log('delProduct')
      const { data: res } = await this.$http.get('/product/delete/v1', {
        params: {
          _id,
          title
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.listProduct()
      this.$message.success(res.meta.msg)
    },
    // 修改产品名称
    async editProduct(_id, title) {
      console.log('editProduct')
      const { data: res } = await this.$http.get('/product/info/v1', {
        params: {
          _id,
          title
        }
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res.data)
      this.product._id = res.data.product._id
      this.product.title = res.data.product.title
      this.product.description = res.data.product.description
    },
    // 重置产品
    resetProduct() {
      this.$refs.productFormRef.resetFields()
    },
    // 产品名称列表
    async listProduct() {
      console.log('listProduct')
      const { data: res } = await this.$http.get('product/list/v1')
      if (res.meta.status !== 200) {
        return this.$message.err(res.meta.msg)
      }
      this.products = res.data.products
    },
    // 格式化创建时间
    datetimeFormat(row, column) {
      const date = row[column.property]
      if (!date) {
        return ''
      }
      return this.$moment(date).format('YYYY-MM-DD  HH:mm:ss')
    }
  }
}
</script>
<style lang="less">
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.product-card {
  .el-card__body {
    padding-top: 6px !important;
  }
}
.product-button-group {
  text-align: center;
}

// 产品名称标签间距
.el-tag {
  margin-left: 10px;
}
</style>
