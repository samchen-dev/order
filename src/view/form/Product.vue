<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>产品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区域 -->
    <el-card class="product-card">
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
      <el-row>
        <el-col :span="6"><div class="grid-content"></div></el-col>
        <el-col :span="12" class="product-button">
          <el-button type="primary" @click="openProduct()" size="mini">添加</el-button>
        </el-col>
        <el-col :span="6"><div class="grid-content"></div></el-col>
      </el-row>
      <!-- 添加新产品名称对话框 -->
      <el-dialog title="添加产品名称" :visible.sync="productAddDialog" @close="dialogClose('productFormRef')"  width="40%">
        <el-form :model="product" :rules="productRules" ref="productFormRef" label-width="80px" label-position="right" size="mini">
          <el-form-item label="分类名称" prop="title">
            <el-input v-model="product.title" placeholder="分类标题" maxlength="10" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="分类描述" prop="description">
            <el-input v-model="product.description" :rows="4" placeholder="分类描述" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetNewDialog()" size="mini">取 消</el-button>
          <el-button type="primary" @click="addProduct()" size="mini">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改产品名称对话框 -->
      <el-dialog title="更新产品名称" :visible.sync="productUpdateDialog" @close="dialogClose('productUpdateFormRef')" width="40%">
        <el-form :model="updateProduct" :rules="productRules" ref="productUpdateFormRef" label-width="80px" label-position="right" size="mini">
          <el-form-item label="分类名称" prop="title">
            <el-input v-model="updateProduct.title" placeholder="分类标题" maxlength="10" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="分类描述" prop="description">
            <el-input v-model="updateProduct.description" :rows="4" placeholder="分类描述" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetUpdateDialog()" size="mini">取 消</el-button>
          <el-button type="primary" @click="updateProductInfo()" size="mini">更 新</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 标签颜色
      tag: [{ type: '' }, { type: 'success' }, { type: 'info' }, { type: 'warning' }, { type: 'danger' }],
      // 添加对话框标记
      productAddDialog: false,
      // 创建产品名称
      product: {
        title: '',
        description: ''
      },
      // 更新对话框标记
      productUpdateDialog: false,
      // 更新产品名称
      updateProduct: {},
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
    // 打开新建产品名称对话框
    openProduct() {
      console.log('openProduct')
      this.productAddDialog = true
    },
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
        this.listProduct()
        this.productAddDialog = false
      })
    },
    // 重置新建对话框
    resetNewDialog() {
      console.log('resetProduct')
      this.$refs.productFormRef.resetFields()
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
      this.$message.success(res.meta.msg)
      this.updateProduct = res.data.product
      this.productUpdateDialog = true
    },
    // 更新产品名称
    updateProductInfo() {
      console.log('updateProductInfo')
      this.$refs.productUpdateFormRef.validate(async val => {
        if (!val) return
        // 删除时间属性，mongoose 数据库自动更新
        delete this.updateProduct.createdAt
        delete this.updateProduct.updatedAt
        const { data: res } = await this.$http.post('/product/update/v1', {
          product: this.updateProduct
        })

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.listProduct()
        this.productUpdateDialog = false
      })
    },
    // 重置更新对话框
    resetUpdateDialog() {
      console.log('resetUpdateDialog')
      this.updateProduct.title = ''
      this.updateProduct.description = ''
    },
    // 关闭对话框事件
    dialogClose(name) {
      console.log('dialogClose')
      this.$refs[name].resetFields();
    },
    // 产品名称列表
    async listProduct() {
      console.log('listProduct')
      const { data: res } = await this.$http.get('/product/list/v1')
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
.product-button {
  text-align: center;
}

// 产品名称标签间距
.el-tag {
  margin-left: 10px;
}
</style>
