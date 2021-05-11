<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="14">
        <el-card class="box-card">
          <div slot="header">
            <span>生产包装:</span>
          </div>
          <el-row>
            <el-col :span="24">
              <div class="promptText">订单包装:{{ contract.packaging }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="包装:"
                label-width="55px"
                prop="produce.packaging"
                :rules="[{ required: true, message: '包装不能为空！'}]"
              >
                <el-autocomplete
                  v-model="handover.produce.packaging"
                  :fetch-suggestions="packagQuerySearch"
                  placeholder="输入包装"
                  @select="packagHandleSelect"
                  style="width:100%">
                </el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="box-card">
          <div slot="header">
            <span>唛头</span>
          </div>
          <el-radio-group v-model="handover.produce.mark">
            <div v-for="item of markAllType.entries()" :key="item[0]"><el-radio :label="item[0]">{{item[0]}}</el-radio></div>
          </el-radio-group>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <div style="padding-top:10px">
          <el-upload
            name="packageFiles"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.doc,.pdf,.docx,.JPG,.JPEG,.PBG,.GIF,.BMP,.DOC,.PDF,.DOCX"
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
            <div slot="tip">
              上传客户提供包装、唛头相关附件！<br />(支持上传文件类型，文件不大于6M,附件不超10个：.jpg,.jpeg,.png,.gif,.bmp,.doc,.docx,.pdf)
            </div>
          </el-upload>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import OrderInfo from '../../OrderInfo'
// 交接单-生产信息
export default {
  name: 'Produce',
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
      // 已经上传的附件
      files: [],
      // 已经存在的包装列表
      packagingAll: [],
      // 所有的唛头类型
      markAllType: null
    }
  },
  methods: {
    // 包装查询
    packagQuerySearch(queryString, cb) {
      console.log('packagquerySearch', queryString)
      const packaging = this.packagingAll
      const results = queryString ? packaging.filter(this.packagCreateFilter(queryString)) : packaging
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 包装过滤
    packagCreateFilter(queryString) {
      console.log('packagCreateFilter', queryString)
      return restaurant => restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
    },
    packagHandleSelect(item) {
      console.log('packagHandleSelect')
      console.log(item)
    },
    // 删除成功的钩子函数
    handleRemove(file, fileList) {
      console.log('handleRemove')
      for (const i in this.handover.produce.fileListServer) {
        if (file.uid === this.handover.produce.fileListServer[i].uid) {
          // 服务器端删除附件
          this.$http.post('/order/deleteAnnex/v1', { files: [this.handover.produce.fileListServer[i]] })
          // 删除元素
          this.handover.produce.fileListServer.splice(i, 1)
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
      // 检查文件名是否相同，相同就不上传
      let isName = true
      this.handover.produce.fileListServer.forEach(v => {
        if (v.name === file.name) isName = false
      })
      if (!isName) {
        this.$message({ message: `${file.name}文件和已经上传的文件同名`, type: 'warning' })
      }
      // 文件不能太大于6M
      const isSize = file.size / 1024 / 1024 < 6
      if (!isSize) {
        this.$message({ message: `${file.name}文件大小超过 6M`, type: 'warning' })
      }
      // 判断文件扩展名
      const typeList = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'doc', 'pdf', 'docx']
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
      this.handover.produce.fileListServer.push({ uid: file.uid, id: res.data.fileList[0].id, name: file.name, url: 'www.sinabuddy.com' })
    }
  },
  // 组件初始化
  created() {
    console.log('Produce-created')
    // 加载包装列表
    for (const item of OrderInfo.PackagingChineseToEnglish.entries()) {
      this.packagingAll.push({ value: item[1], address: item[1] })
    }
    // 显示已经上传的包装唛头附件
    if (this.handover.produce.fileListServer.length > 0) {
      this.files = JSON.parse(JSON.stringify(this.handover.produce.fileListServer))
    }

    // 加载所有唛头类型
    this.markAllType = OrderInfo.markAllType
    this.handover.produce.packaging = OrderInfo.PackagingChineseToEnglish.get(this.contract.packaging) === 'undefined' ? '' : OrderInfo.PackagingChineseToEnglish.get(this.contract.packaging)
  }
}
</script>

<style lang="less" scoped>
.promptText {
  font-size: 14px;
  color: #606266;
}
.box-card {
  font-size: 14px;
  .el-card__header {
    padding: 14px 14px !important;
  }
}
</style>
