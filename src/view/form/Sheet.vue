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
        <el-tab-pane label="白刚玉">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="level" label="级别"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="port" label="起运港"></el-table-column>
            <el-table-column prop="size" label="规格"></el-table-column>
            <el-table-column prop="quote" label="报价"></el-table-column>
            <el-table-column prop="specs" label="指标"></el-table-column>
          </el-table>
          <el-button type="primary" @click="addDialogVisible = true">添加分类</el-button>
          <el-button type="primary">修改分类</el-button>
        </el-tab-pane>
        <el-tab-pane label="棕刚玉">棕刚玉报价单</el-tab-pane>
        <el-tab-pane label="铬钢玉">铬钢玉报价单</el-tab-pane>
        <el-tab-pane label="板状刚玉">板状刚玉报价单</el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加新报价对话框 -->
    <el-dialog class="addDialog" title="新报价" :visible.sync="addDialogVisible" @close="addDialogClose()" width="75%">
      <el-form ref="addQuoteFromRef" :model="newLevel" :rules="addQuoteRules" label-width="55px" label-position="right" size="mini">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="级别:" prop="level">
              <el-input placeholder="级别" v-model="newLevel.level" maxlength="70" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="港口:" prop="port">
              <el-autocomplete
                v-model="newLevel.port"
                :fetch-suggestions="querySearch"
                placeholder="起运港"
                @select="handleSelect"
                style="width:100%"
                size="mini"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描  述:" prop="description">
              <el-input placeholder="描述" v-model="newLevel.description" type="textarea" maxlength="200" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-for="(item, index) in newLevel.assort" type="flex" justify="center" align="middle">
          <el-col :span="6">
            <el-form-item
              label="规格:"
              :prop="'assort.' + index + '.size'"
              :rules="{ required: true, message: '规格不能为空！', trigger: 'blur' }"
            >
              <el-input placeholder="规格" v-model="item.size" maxlength="40" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="价格:"
              :prop="'assort.' + index + '.quote'"
              :rules="[
                { required: true, message: '价格不能为空' },
                { type: 'number', message: '价格必须为数字值' }
              ]"
            >
              <el-input placeholder="价格" v-model.number="item.quote">
                <template slot="append">$</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="指标:"
              :prop="'assort.' + index + '.spece'"
            >
              <el-input placeholder="指标" v-model="item.spece" maxlength="40" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" class="col-button">
            <el-form-item>
              <el-button-group>
                <el-button icon="el-icon-plus" @click="addAssort(index)"></el-button>
                <el-button icon="el-icon-minus" @click="delAssort(index)"></el-button>
                <el-button icon="el-icon-top" @click="upAssort(index)"></el-button>
                <el-button icon="el-icon-bottom" @click="downAssort(index)"></el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLevel()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Sheet',
  data() {
    return {
      // 显示分类对话框控制标记
      addDialogVisible: false,
      // 显示列表数据
      tableData: [
        {
          level: '陶瓷砂',
          description: 'F24-F54',
          port: 'QINGDAO/TIANJIN',
          size: 'F24',
          quote: '820',
          specs: '陶瓷级'
        }
      ],
      // 级别列表
      levelData: [],
      // 添加新分类
      newLevel: {
        level: '',
        port: '',
        description: '',
        assort: [
          {
            size: '',
            quote: '',
            spece: ''
          }
        ]
      },
      // 潜在起运港列表
      restaurants: [],
      // 新建报价分类验证规则
      addQuoteRules: {
        level: [{ required: true, message: '级别名不能为空！', trigger: 'blur' }],
        port: [{ required: true, message: '港口名不能为空！', trigger: 'change' }]
      }
    }
  },
  methods: {
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
