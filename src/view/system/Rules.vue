<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox v-for="item in listData" :label="item._id">{{ item.title }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    let validateRoles= (rule, value, callback) => {
      console.log('validateRoles')
      console.log(rule)
      console.log(value)
    }
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' },
          { validator: validateRoles, trigger: 'change' },
        ],
      },
      listData: [
        { _id: 0, title: '标题1' },
        { _id: 1, title: '标题2' },
        { _id: 2, title: '标题3' },
        { _id: 3, title: '标题4' },
      ]
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formNameRef].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped></style>
