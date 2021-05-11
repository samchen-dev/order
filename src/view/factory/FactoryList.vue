<template>
  <div>
    <div>
      <el-form ref="factoryFormRef" :rules="factoryRules" :model="factory" label-width="60px" size="mini">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="工厂名称:"
              label-width="85px"
              prop="factoryName"
            >
              <el-input v-model="factory.factoryName" placeholder="工厂名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联 系 人:"
              label-width="85px"
              prop="contactPerson"
            >
              <el-input v-model="factory.contactPerson" placeholder="工厂联系人名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="工厂地址:"
              label-width="85px"
              prop="address"
            >
              <el-input v-model="factory.address" placeholder="工厂地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系方式:"
              label-width="85px"
              prop="phone"
            >
              <el-input v-model="factory.phone" placeholder="填写手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" type="flex">
          <el-col :span="10">
            <el-form-item label="主要业务:"
              label-width="85px"
              prop="business"
            >
              <el-input v-model="factory.business" type="textarea" rows="2" placeholder="主要经营的产品，例如(WFA,BFA等信息)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div style="position: relative; top:50%; transform:translateY(-50%);  text-align:center">
              <el-button size="mini" @click="resetForm('factoryFormRef')" type="primary">重置</el-button>
              <el-button size="mini" @click="submitFactory('factoryFormRef')" type="primary">提交</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-table
        :data="factorys"
        ref="refTableFactorys"
        stripe
        border
        height="380"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form :ref="'factoryFormRef' + props.row._id" :rules="factoryRules" :model="props.row" label-position="left" label-width="60px" size="mini">
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-form-item label="工厂名称:"
                    label-width="85px"
                    prop="factoryName"
                  >
                    <el-input v-model="props.row.factoryName" placeholder="工厂名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="联 系 人:"
                    label-width="85px"
                    prop="contactPerson"
                  >
                    <el-input v-model="props.row.contactPerson" placeholder="工厂联系人名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-form-item label="工厂地址:"
                    label-width="85px"
                    prop="address"
                  >
                    <el-input v-model="props.row.address" placeholder="工厂地址"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="联系方式:"
                    label-width="85px"
                    prop="phone"
                  >
                    <el-input v-model="props.row.phone" placeholder="填写手机号码"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10" type="flex">
                <el-col :span="10">
                  <el-form-item label="主要业务:"
                    label-width="85px"
                    prop="business"
                  >
                    <el-input v-model="props.row.business" type="textarea" rows="2" placeholder="主要经营的产品，例如(WFA,BFA等信息)"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <div style="position: relative; top:50%; transform:translateY(-50%);  text-align:center">
                    <el-button size="mini" @click="resetForm('factoryFormRef' + props.row._id)" type="primary">重置</el-button>
                    <el-button size="mini" @click="updateFactory('factoryFormRef' + props.row._id, props.row)" type="primary">更新</el-button>
                    <el-button size="mini" @click="hideUpdateFrom(props.row)" type="primary">隐藏</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="factoryName" label="工厂名称" sortable min-width="25%"> </el-table-column>
        <el-table-column prop="address" label="工厂地址" sortable min-width="30%"> </el-table-column>
        <el-table-column prop="contactPerson" label="联系人" sortable min-width="12%"> </el-table-column>
        <el-table-column prop="phone" label="电话" sortable min-width="13%"> </el-table-column>
        <el-table-column label="操作" min-width="10%">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="删除工厂信息" placement="top" :enterable="false">
              <el-button class="factoryButton" size="mini" @click="dropFactory(scope.row)" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FactoryList',
  data() {
    // 验证手机
    const validatePhone = (rule, value, callback) => {
      console.log('validatePhone')
      if (value === '') {
        callback(new Error('电话号码不能为空！'))
      } else if (!/^1[0-9]{10}$/.test(value)) {
        callback(new Error('请按照国内手机要求填写！'))
      } else {
        callback()
      }
    }
    return {
      // 工厂列表
      factorys: null,
      // 工厂详细信息
      factory: {
        // 工厂名称
        factoryName: '',
        // 工厂地址
        address: '',
        // 工厂联系人
        contactPerson: '',
        // 联系电话
        phone: '',
        // 经营产品业务（棕刚玉、白刚玉等信息）
        business: ''
      },

      // 验证规则
      factoryRules: {
        factoryName: [
          { required: true, message: '工厂名称不能为空！', trigger: 'blur' }
        ],
        contactPerson: [
          { required: true, message: '联系人不能为空！', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '工厂地址不能为空！', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系方式不能为空！', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        business: [
          { required: true, message: '工厂主要业务不能为空！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 加载工厂列表
    async factoryList() {
      console.log('loadFactoryList')
      const { data: res } = await this.$http.get('/factory/list/v1')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.factorys = res.data.factorys
    },
    // 删除工厂
    async dropFactory(row) {
      console.log('dropFactory')
      const { data: res } = await this.$http.get('/factory/delete/v1', {
        params: {
          _id: row._id
        }
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.factoryList()
    },
    // 提交添加的工厂信息
    submitFactory(formName) {
      console.log('submitFactory...')
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/factory/create/v1', { factory: this.factory })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.factoryList()
        this.resetForm(formName)
        console.log(this.factory)
      })
    },
    // 更新工厂信息
    updateFactory(fromName, factory) {
      console.log('updateFactory...', factory)
      this.$refs[fromName].validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/factory/update/v1', { factory })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      })
    },
    // 重置工厂表单信息
    resetForm(name) {
      console.log('resetForm', name)
      this.$refs[name].resetFields()
    },
    // 隐藏更新表单框
    hideUpdateFrom(row) {
      console.log('hideUpdateFrom...', row)
      this.$refs.refTableFactorys.toggleRowExpansion(row, false)
    }
  },
  // 初始化加载
  created() {
    // 执行加载工厂列表
    this.factoryList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  /deep/ th {
    padding: 4px;
  }

  /deep/ td {
    padding: 4px;
  }
}

.factoryButton {
  padding: 4px 4px;
}
</style>
