<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单信息</span>
      </div>
      <el-row :gutter="10" type="flex" align="top">
        <el-col :span="8">
          <el-form-item
            label="预计交期:"
            prop="order.deliveryDate"
            :rules="[{ required: true, message: '预计交期不能为空！', trigger: 'blur' }]"
          >
            <el-date-picker
              v-model="handover.order.deliveryDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width:100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="签订时间:" label-position="left">{{contract.orderDate}}(预计交货期默认三周，可以根据实际情况调整！)</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-row v-for="(item, index) in handover.order.remark.products" :key="index">
            <el-col :span="24">
              <el-form-item
                label="产品要求:"
                :prop="'order.remark.products.' + index + '.description'"
              >
                <el-input v-model="item.description"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="客户要求:"
            prop="order.description"
            :rules="[{ required: true, message: '对订单要求不能为空！' }]"
          >
            <el-input
              placeholder="请输入客户对订单的交期、用途、等重要信息！"
              type="textarea"
              :rows="4"
              v-model="handover.order.description"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-upload
            name="countersignedFiles"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.DOC,.DOCX,.XLS,.XLSX"
            :action="serverURL"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            multiple
            :limit="10"
            :on-exceed="handleExceed"
            :file-list="files"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip">上传客户回签的合同、发票等文件信息！<br>(支持上传文件类型，文件不大于6M,附件不超10个：.jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx)</div>
          </el-upload>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
// 交接单-订单信息
export default {
  name: 'Order',
  props: {
    contract: {
      type: Object,
      required: true
    },
    handover: {
      type: Object,
      required: true
    },
    serverURL: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 已经加载的附件列表
      files: [],
    }
  },
  methods: {
    // 上传文件
    // 关闭对话框，未提交交接单的附件删除
    deleteAnnex() {
      console.log('deleteAnnex')
      this.$http.post('/order/deleteAnnex/v1', { files: this.handover.order.fileListServer })
    },
    // 删除成功的钩子函数
    handleRemove(file, fileList) {
      console.log('handleRemove')
      for (const i in this.handover.order.fileListServer) {
        if (file.uid === this.handover.order.fileListServer[i].uid) {
          // 服务器端删除附件
          this.$http.post('/order/deleteAnnex/v1', { files: [this.handover.order.fileListServer[i]] })
          // 删除元素
          this.handover.order.fileListServer.splice(i, 1)
        }
      }
    },
    handlePreview(file) {
      console.log('handlePreview')
      console.log(file)
    },
    handleExceed(files, fileList) {
      console.log('handleExceed')
      this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 判断文件扩展名，文件大小
    beforeUpload(file) {
      console.log('beforeUpload')
      // 检查文件同名问题
      let isName = true
      this.handover.order.fileListServer.forEach(v => {
        if (v.name === file.name) isName = false
      })
      if (!isName) {
        this.$message({ message: `${file.name}文件和已经上传的文件同名`, type: 'warning' })
      }
      // 文件不能太大于6M
      const isSize = (file.size / 1024 / 1024) < 6
      if (!isSize) {
        this.$message({ message: `${file.name}文件大小超过 6M`, type: 'warning' })
      }
      // 判断文件扩展名
      const typeList = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
      const extension = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
      const isExt = typeList.includes(extension)
      if (!isExt) {
        this.$message({ message: `${file.name}文件扩展名不符合要求`, type: 'warning' })
      }
      return isName && isSize && isExt
    },
    // 成功上传的钩子
    handleSuccess(res, file, fileList) {
      console.log('handleSuccess')
      this.handover.order.fileListServer.push(
        { uid: file.uid, id: res.data.fileList[0].id, name: file.name, url: 'www.sinabuddy.com' }
      )
    },
  },
  // 组件初始
  created() {
    console.log('OrderSummary-created')
    // 先清空数组
    this.handover.order.remark.products.splice(0, this.handover.order.remark.products.length)
    // 从订单中取出产品名称，给每种产品设置生产要求
    for (const value of this.contract.offerSheet.products) {
      console.log('value:', value)
      const product = {}
      product.name = value.name
      product.count = value.count
      product.unit = value.unit
      product.description = `${value.name}${value.count}${value.unit}`
      this.handover.order.remark.products.push(product)
    }

    // 显示已经上传的会签合同附件
    if (this.handover.order.fileListServer.length > 0) {
      // this.files = this.handover.order.fileListServer
      this.files = JSON.parse(JSON.stringify(this.handover.order.fileListServer))
    }
    // 预计的交货期,订单日后的三周
    this.handover.order.deliveryDate = this.$moment(this.contract.orderDate).add(21, 'days').format('YYYY-MM-DD')
  },

  // 组件销毁
  beforDestroy() {}
}
</script>

<style lang="less" scoped>
.box-card {
  font-size: 14px;

  .el-card__header {
    padding: 14px 14px !important;
  }
}
</style>
